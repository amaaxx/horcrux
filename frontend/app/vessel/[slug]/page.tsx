import Link from "next/link";
import { notFound } from "next/navigation";

// The Database: This holds all the unique data for each project
const vesselData = {
  "ground-truth-engine": {
    title: "Ground Truth Engine",
    subtitle: "Deterministic RAG Architecture",
    problem: "AI hallucination is a critical failure point in enterprise deployments. Standard LLMs generate confident but factually incorrect responses, making them unsuitable for rigid, data-sensitive environments.",
    solution: "By implementing a strict Retrieval-Augmented Generation (RAG) pipeline, we anchor the LLM's generative capabilities to a deterministic vector database, ensuring zero-hallucination outputs based solely on verified internal documents.",
    stack: ["Python", "Vector DB", "FastAPI", "Next.js"]
  },
  "strata": {
    title: "Strata",
    subtitle: "Recursive Note Architecture",
    problem: "Standard note-taking applications rely on rigid folder structures or chaotic tagging systems, creating friction when organizing deeply nested or interconnected thoughts.",
    solution: "Engineered a full-stack digital workspace utilizing a recursive data model. This allows for infinite nesting of folders and notes, powered by a robust PostgreSQL backend and a highly responsive React/Tailwind frontend.",
    stack: ["Next.js 15", "PostgreSQL", "React", "Tailwind v4"]
  },
  "blw-portal": {
    title: "BLW Portal",
    subtitle: "Enterprise Intranet Deployment",
    problem: "Banaras Locomotive Works (Indian Railways) required a modernized, centralized digital workspace to handle operations and employee engagement across a massive workforce.",
    solution: "Developed and deployed a secure, high-performance portal directly onto the RailNet intranet. The system includes an automated architecture capable of managing data and interactions for over 5,000 employees.",
    stack: ["Enterprise Tech", "Automated Engines", "RailNet"]
  }
};

type VesselKey = keyof typeof vesselData;

export default async function VesselPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug as VesselKey;
  
  // If the URL doesn't match one of our projects, throw a 404
  const project = vesselData[slug];
  if (!project) {
    notFound();
  }

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
              System_Record // {slug.toUpperCase()}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
            {project.title}
          </h1>
          <p className="text-xl text-neutral-400 font-mono text-sm">
            [ {project.subtitle} ]
          </p>
        </header>

        {/* Dynamic Content Area */}
        <article className="prose prose-invert prose-neutral md:prose-lg max-w-none text-neutral-300">
          <div className="flex flex-wrap gap-2 mb-12">
            {project.stack.map((tech) => (
              <span key={tech} className="px-3 py-1 text-xs font-mono text-accent bg-accent/10 rounded-full border border-accent/20">
                {tech}
              </span>
            ))}
          </div>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4 tracking-tight">The Problem Space</h2>
          <p className="leading-relaxed">{project.problem}</p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-4 tracking-tight">The Solution Architecture</h2>
          <p className="leading-relaxed">{project.solution}</p>
        </article>
      </div>
    </main>
  );
}