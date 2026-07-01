export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  content?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "classroom-joke-to-production-rag",
    title: "How a Classroom Joke Forced Me to Build a Production-Grade RAG Engine",
    excerpt: "The journey of building Halkill: a production-grade asynchronous RAG engine to combat LLM hallucinations under 512MB RAM constraints.",
    date: "2026-07-02",
    readTime: "10 min read",
    tags: ["RAG", "FastAPI", "Systems", "AI"],
    content: `
"Who’s your mentor?" my professor asked.
"ChatGPT," I replied. 

The entire classroom laughed. My professor quickly pointed out that AI hallucinates, makes things up, and can't be trusted with factual accuracy. Honestly? He was right. But instead of just taking the L, I got completely obsessed with fixing that exact flaw. 

I decided to build a system that grounded LLMs in verifiable truth. I called it **Halkill** (Hallucination Kill).

When I started this on January 13th, my tech stack was literally just HTML, CSS, and JavaScript. I didn’t know backend architecture, I didn’t know Python, and I definitely didn't know the vector math behind Retrieval-Augmented Generation (RAG). 

Five months later—after juggling mid-sem exams, crying over dependency conflicts, and failing at deployment over 100 times—I finally had a live, production-grade asynchronous backend.

Here’s the story of how I built it, the tech stack I used, and the architectural nightmares I had to solve along the way.

---

### The Final Tech Stack

Before we get into the details, here is the stack I eventually landed on after months of trial and error:

* **Frontend:** React (State management was a nightmare to sync with streaming AI), deployed on Vercel.
* **Backend:** Python, FastAPI (chosen for its asynchronous speed), deployed on Render.
* **Database & Storage:** PostgreSQL via Supabase (using \`pgvector\` for similarity search and Supabase Storage for raw files).
* **AI & Embeddings:** Google Gemini (\`gemini-2.5-flash-lite\`) and \`gemini-embedding-001\`, orchestrated with LangChain.
* **Background Workers:** Celery + Redis (to decouple heavy embedding tasks from the web server).
* **Security & Perf:** JWT for Auth, SlowAPI for rate limiting, SQLAlchemy + Alembic for ORM/migrations.

---

### Phase 1: The "Localhost Works Fine" Trap

I’m a big believer in a depth-first approach. A rock-solid backend with a terrible UI is infinitely better than a beautiful frontend that doesn't actually work. So, I dove straight into Python and FastAPI.

The first week was brutal. I spent three days and two sleepless nights just fighting dependency conflicts and broken virtual environments. I literally cried out of frustration because I couldn't figure out why my libraries were overwriting each other. When it finally compiled and ran, the relief was pure euphoria. 

My initial build used ChromaDB (because it was free and limitless locally) and HuggingFace transformers for local embeddings. It worked great on my machine. I even showed it to my friends, and a few of them said, *"ChatGPT can already do this, why are you building it?"* It stung, but I knew that building a wrapper is easy; building a context-aware RAG engine with stateful memory is a different beast. I kept coding.

---

### Phase 2: The 512MB Reality Check 

In February, I had to pause Halkill to build a project for the Indian Railways. When I came back in May to deploy Halkill, reality hit me like a truck.

I tried deploying my backend to Render. Render’s free tier gives you 512MB of RAM. 
My local HuggingFace embedding model was 1.2GB. 

Every time the server spun up, it immediately threw an Out-Of-Memory (OOM) error and crashed. I was stuck. If I kept the local model, I couldn't deploy. If I changed the architecture, I risked making the model stupid. 

I had no choice but to tear down my local stack and re-architect for the cloud. I stripped out ChromaDB and migrated my database to **Supabase**. I dumped the HuggingFace transformers and wired up **Google's Embedding APIs** to offload the compute. 

But even with the models offloaded, I was still hitting memory spikes. Here is how I actually fixed the system for production.

---

### Phase 3: The Engineering Deep Dive

#### 1. Zero-RAM File Offloading (Celery + Redis)
If a user uploads a 50MB PDF and you use \`await file.read()\` in FastAPI, that entire 50MB goes straight into your server's RAM. Do that with a few concurrent users, and Render kills your container. 

To fix this, I made sure the FastAPI web layer *never* holds the file in memory. Instead, it streams the incoming document directly to a temporary disk path (\`/tmp\`) using Python's \`shutil.copyfileobj\`. 

\`\`\`python
# Streaming the file to disk instantly
with open(temp_file_path, "wb") as buffer:
    shutil.copyfileobj(upload_file.file, buffer)

# Firing off the background worker
process_document_task.delay(file_path=temp_file_path, user_id=current_user.id)
\`\`\`
The HTTP request instantly returns a "Processing" status to the user. Meanwhile, a detached **Celery worker** (communicating via **Redis**) picks up the file, chunks it, hits the Google API for embeddings, pushes the vectors to Supabase, and deletes the temp file. The web server's RAM stays completely untouched.

#### 2. The Streaming Citation Problem 
One of the most annoying things about standard AI chatbots is waiting for a massive response to finish generating before you see where the information came from. 

LangChain makes it weirdly difficult to extract metadata and stream it *before* the LLM tokens start flowing. So, I bypassed the standard LangChain retrievers and wrote a custom RPC call in Supabase (\`hybrid_search\`) that uses both dense vector similarity and sparse keyword matching.

I then built a spliced stream using Server-Sent Events (SSE). Right before the AI starts typing, my backend injects a custom delimiter string into the stream:

\`\`\`text
data: METADATA_SOURCES:{"docs": [{"page": 4, "source": "report.pdf"}]}||| The quarterly revenue...
\`\`\`
The React frontend is programmed to intercept that exact \`METADATA_SOURCES\` tag, instantly render a citation card on the UI, and then seamlessly print the rest of the AI's text. 

#### 3. API Rate Limit Throttling
When you process a massive PDF, you generate hundreds of text chunks. If you fire hundreds of embedding requests at Google's API at once, you get slapped with an HTTP 429 (Too Many Requests) error, and your pipeline dies.

I had to engineer a custom \`CloudEmbeddings\` wrapper with an exponential backoff algorithm (\`wait = (2 ** attempt) * 2\`). When the Celery worker inserts data into Supabase, I force it to batch chunks of 20 and trigger a \`time.sleep(1)\`. It intentionally slows down the ingestion process to guarantee the system stays under the 1,500 Requests-Per-Minute quota.

#### 4. Bulletproofing the Database
Serverless databases drop connections. It's just a fact of life. To stop SQLAlchemy from throwing connection errors, I had to configure the engine with aggressive connection pooling: \`pool_size=10\`, \`max_overflow=20\`, and \`pool_pre_ping=True\`.

I also built cascading data cleanups. If a user deletes a document, the backend doesn't just delete the relational row. It fires an API call to purge the raw file from Supabase Storage, and executes a targeted JSONB \`.contains()\` query to wipe all orphaned vector chunks from the \`pgvector\` table, keeping the database perfectly clean.

---

### The Aftermath

When I finally wired Vercel, Render, and Supabase together, I thought I was done. I wasn't. 

After my first "successful" deployment, the app broke at least 100 times in production. Environment variables failed, CORS policies blocked requests, Redis connections timed out, and the Celery workers kept losing track of tasks. There were days I seriously considered just giving up. 

But I didn't. I ended up pushing 3 to 5 commits a day—sometimes 10+—chasing down every single bug. I added hallucination scoring, strict API rate limiting with SlowAPI (restricting users to 20 messages a minute), and JWT authentication. 

Today, Halkill has been live and healthy for a month. 

I didn't just build an AI wrapper. I learned how to build resilient, asynchronous infrastructure. It started with a joke in a classroom, but it ended with the most complex piece of software I’ve ever engineered.
    `
  },
  {
    slug: "state-of-frontend-2026",
    title: "The State of Frontend Engineering in 2026",
    excerpt: "How server components, edge computing, and new primitives are changing the way we build web applications.",
    date: "2026-05-22",
    readTime: "6 min read",
    tags: ["Frontend", "React", "Next.js"],
    content: `
The lines between backend and frontend are blurring...

*More content will be provided soon.*
    `
  }
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}
