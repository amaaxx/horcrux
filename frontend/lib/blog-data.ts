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
    title: "Engineering Halkill: Architecture & Constraints of a Production-Grade RAG Engine",
    excerpt: "An architectural deep dive into constructing an asynchronous, multi-modal RAG system within a 512MB RAM footprint.",
    date: "2026-07-02",
    readTime: "10 min read",
    tags: ["RAG", "FastAPI", "Systems", "AI"],
    content: `
# Engineering Halkill: Architecture & Constraints of a Production-Grade RAG Engine

The project originated from a fundamental question posed in an academic lecture hall: *Can generative language models be trusted with enterprise-grade data integrity?* The standard consensus was negative, citing the inherent tendency of LLMs to hallucinate.

Rather than accepting hallucination as an structural inevitability, I began engineering a system designed to enforce grounding constraints and ground LLMs in mathematical, verifiable truth. The result was **Halkill** (Hallucination Killer)—an asynchronous, multi-modal RAG (Retrieval-Augmented Generation) engine built from the ground up to process, vectorize, and retrieve source data with absolute precision.

What began as a challenge evolved into a five-month engineering process, scaling a local python prototype into a live, production-grade asynchronous backend capable of parsing, embedding, and querying heterogeneous datasets.

---

## System Architecture & Tech Stack

To ensure high availability and low latency within server resource boundaries, the application implements a decoupled, event-driven topology:

* **Presentation Layer:** React with custom Server-Sent Events (SSE) stream interceptors, deployed on Vercel.
* **Application Core:** Asynchronous Python (FastAPI), acting as a low-overhead orchestrator, deployed on Render.
* **Storage & Vector Indexing:** PostgreSQL via Supabase, utilizing \`pgvector\` for dense vector similarity search.
* **Model Inference:** Google Gemini API (\`gemini-2.5-flash-lite\` and \`gemini-embedding-001\`), managed through LangChain abstractions.
* **Ingestion Pipeline:** Celery + Redis, managing background file parsing and batch vectorization.
* **Database Pool & Migrations:** SQLAlchemy (ORM) and Alembic, with strict connection pooling.

---

## Phase 1: Local Prototyping & Runtime Isolation

The initial development phase adhered to a depth-first methodology: establishing a robust backend execution layer prior to developing the user interface. 

The first hurdle involved setting up a stable, isolated local environment. Early iterations utilized local SQLite-based vector storage via ChromaDB and local HuggingFace embedding models. While functional in local-only environments, local model inference quickly became a bottleneck, and building stateful citation memory across multiple sessions proved to be the primary architectural hurdle.

---

## Phase 2: Memory Optimization under 512MB Constraints

Deploying the prototype to cloud infrastructure introduced severe hardware constraints. The target runtime environment (Render's free tier) imposed a strict **512MB memory limit**.

The local HuggingFace embedding models alone required **1.2GB RAM**, resulting in immediate Out-Of-Memory (OOM) kernel panics upon server boot. To resolve this, I re-engineered the backend for cloud orchestration:
1. Migrated vector storage from local memory to a remote PostgreSQL instance on **Supabase** running \`pgvector\`.
2. Offloaded embedding generation to **Google's Embedding API**, shrinking the application's runtime footprint to less than 180MB.

---

## Phase 3: Architectural Deep Dive

### 1. Multi-Modal Document Normalization
A production-grade RAG pipeline must process more than raw text. Halkill’s ingestion engine standardizes incoming files across three formats:
* **Structured Document Trees (PDFs):** Parsing hierarchy and structural metadata.
* **Tabular Matrices (Excel/CSV):** Normalizing rows into contextually relevant representations via Pandas.
* **Raw Images:** Executing visual analysis models to extract text from diagrams and charts.

The FastAPI gateway normalizes these heterogeneous streams into standardized text chunks, ensuring the downstream vector index remains uniform.

### 2. Zero-RAM File Streaming (Celery + Redis)
Reading a 50MB file directly into memory via FastAPI's default handlers (\`await file.read()\`) scales poorly, risking server termination under concurrent load. 

To eliminate memory spikes, the system implements a zero-RAM disk-streaming pipeline:

\`\`\`python
# Stream incoming file directly to disk space to bypass memory allocation
with open(temp_file_path, "wb") as buffer:
    shutil.copyfileobj(upload_file.file, buffer)

# Delegate compute-heavy parsing to the worker pool
process_document_task.delay(file_path=temp_file_path, user_id=current_user.id)
\`\`\`

The HTTP worker immediately returns a \`202 Accepted\` status, freeing the main thread. A detached **Celery worker** reads the file from disk, generates embeddings, uploads vectors to Supabase, and purges the temporary storage.

### 3. Grounding Guards: Strict vs. Hybrid Routing
To eliminate hallucinations, Halkill introduces two distinct routing paradigms:
* **Strict Mode:** The system enforces strict contextual boundaries. If vector query retrieval yields zero results above a similarity threshold, the system immediately returns a deterministic response: *"Context not found within source documents."* No speculative generation is permitted.
* **Hybrid Mode:** The engine attempts vector grounding first. If the source material is insufficient, it falls back to base LLM parameters while clearly flagging the transition.

### 4. High-Performance SSE Citation Streaming
Standard LLM wrappers stream text tokens but force the user to wait until completion to view source citations. To solve this, Halkill uses a custom Server-Sent Events (SSE) format to stream citation metadata *first*.

I bypassed standard LangChain retrievers and built a custom RPC call in Supabase (\`hybrid_search\`) combining dense cosine similarity with BM25 keyword matching. The API formats the response stream with a metadata header:

\`\`\`text
data: METADATA_SOURCES:{"docs": [{"page": 4, "source": "report.pdf"}]}||| The system output starts here...
\`\`\`

The React client detects the \`METADATA_SOURCES\` token, renders the citation card in the UI, and streams the subsequent text tokens in real time.

### 5. Exponential Backoff Rate Limiting
Batch-processing large documents generates hundreds of embedding requests. To prevent HTTP 429 rate limit errors from Google's API, the Celery pipeline is wrapped in an exponential backoff routine:

\`\`\`text
wait_time = (2 ** attempt_number) * 2 seconds
\`\`\`

Workers process vector uploads in batches of 20, incorporating a 1-second delay between batches to ensure compliance with API limits.

### 6. Relational Pool & Cleanup Constraints
Serverless database configurations are prone to connection drops. The SQLAlchemy engine is configured with connection pools designed to survive drops: \`pool_size=10\`, \`max_overflow=20\`, and \`pool_pre_ping=True\`.

Additionally, data deletion uses cascade constraints: deleting a document triggers an API request to purge the binary file from Supabase Storage and executes a JSONB search to clean up corresponding vector space in \`pgvector\`.

---

## Conclusion & Core Takeaways

Transitioning Halkill from localhost to production highlighted a key engineering principle: system resilience is determined by how well the architecture handles constraints.

By implementing asynchronous job processing, zero-RAM streaming, and deterministic grounding guards, the system scales reliably on minimal resources. Halkill has maintained 100% uptime over its first month in production, proving that engineering discipline and clean architectural boundaries can overcome severe infrastructure limits.
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
# The State of Frontend Engineering in 2026

The boundaries between client and server have ceased to exist. In 2026, the modern web application is a distributed edge function, streaming React Server Components (RSC) to high-performance layouts.

---

## The Shift to Edge-First Architecture

We have moved beyond static sites and regional servers. Today's frontend is global:
- **Zero-Bundle Client Components:** Heavy computational logic runs exclusively on the server, sending lightweight visual structures to the client.
- **Edge Routing:** Requests are intercepted and resolved at the closest edge node, minimizing time-to-first-byte (TTFB).

---

## The Convergence of Frontend and Backend

With frameworks operating seamlessly across runtime environments, frontend engineers are now architecting low-latency distributed databases, data syncing mechanisms, and local-first cache states.
    `
  }
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}
