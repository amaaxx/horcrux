import Link from "next/link";

export default async function VesselPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await the params (Next.js 15 standard)
  const resolvedParams = await params;
  
  // Clean up the URL slug for the UI (e.g., "ground-truth-engine" -> "GROUND TRUTH ENGINE")
  const formattedTitle = resolvedParams.slug.replace(/-/g, " ").toUpperCase();

  return (
    <main className="min-h-screen bg-background text-white p-6 md:p-16 font-sans selection:bg-accent/30 selection:text-accent cursor-none">
      <div className="max-w-3xl mx-auto space-y-16 mt-12 md:mt-0 relative z-10">
        
        {/* The "Back" Button */}
        <Link 
          href="/" 
          className="group flex items-center gap-4 text-neutral-500 hover:text-accent transition-colors w-fit text-xs font-mono uppercase tracking-widest cursor-none"
        >
          <span className="transform group-hover:-translate-x-2 transition-transform duration-300">←</span> 
          Return_To_Grid
        </Link>

        {/* Header Section */}
        <header className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="font-mono text-xs text-neutral-500 tracking-widest uppercase">
              System_Record // {resolvedParams.slug}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
            {formattedTitle}
          </h1>
        </header>

        {/* Content Area */}
        <article className="prose prose-invert prose-neutral md:prose-lg max-w-none text-neutral-300">
          <p className="leading-relaxed text-xl text-neutral-400">
            This is the architecture breakdown for the {formattedTitle}. Here, we detail the problem space, the technical stack, and the deployment strategy.
          </p>
          
          <div className="h-px w-full bg-border my-12" />
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4 tracking-tight">The Problem Space</h2>
          <p className="leading-relaxed">
            AI hallucination is a critical failure point in enterprise deployments. Standard LLMs generate confident but factually incorrect responses, making them unsuitable for rigid, data-sensitive environments.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4 tracking-tight">The Solution Architecture</h2>
          <p className="leading-relaxed">
            By implementing a strict Retrieval-Augmented Generation (RAG) pipeline, we anchor the LLM's generative capabilities to a deterministic vector database, ensuring zero-hallucination outputs based solely on verified internal documents.
          </p>
        </article>
      </div>
    </main>
  );
}