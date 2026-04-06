import Link from "next/link";
import { notFound } from "next/navigation";

// 1. Define the strict TypeScript blueprint for our projects
type VesselProject = {
  title: string;
  subtitle: string;
  problem: string;
  solution: string;
  stack: string[];
  links?: {
    live?: string;
    github?: string; // The '?' makes this explicitly optional
  };
};

// 2. Apply the blueprint to our database
const vesselData: Record<string, VesselProject> = {
  "ground-truth-engine": {
    title: "Ground Truth Engine",
    subtitle: "Deterministic RAG Architecture",
    problem: "AI hallucination is a critical failure point in enterprise deployments. Standard LLMs generate confident but factually incorrect responses, making them unsuitable for rigid, data-sensitive environments.",
    solution: "By implementing a strict Retrieval-Augmented Generation (RAG) pipeline, we anchor the LLM's generative capabilities to a deterministic vector database, ensuring zero-hallucination outputs based solely on verified internal documents.",
    stack: ["Python", "Vector DB", "FastAPI", "Next.js"],
    links: {
      live: "https://your-deployment-url.com", // You can update this later when Halkill is live
      github: "https://github.com/amaaxx/halkill"
    }
  },
  "strata": {
    title: "Strata",
    subtitle: "Recursive Note Architecture",
    problem: "Standard note-taking applications rely on rigid folder structures or chaotic tagging systems, creating friction when organizing deeply nested or interconnected thoughts.",
    solution: "Engineered a full-stack digital workspace utilizing a recursive data model. This allows for infinite nesting of folders and notes, powered by a robust PostgreSQL backend and a highly responsive React/Tailwind frontend.",
    stack: ["Next.js 15", "PostgreSQL", "React", "Tailwind v4"],
    links: {
      live: "https://your-deployment-url.com", // You can update this later when Laminar is live
      github: "https://github.com/amaaxx/laminar"
    }
  },
  "blw-portal": {
    title: "BLW Portal",
    subtitle: "Enterprise Intranet Deployment",
    problem: "Banaras Locomotive Works (Indian Railways) required a modernized, centralized digital workspace to handle operations and employee engagement across a massive workforce.",
    solution: "Developed and deployed a secure, high-performance portal directly onto the RailNet intranet. The system includes an automated architecture capable of managing data and interactions for over 5,000 employees.",
    stack: ["Enterprise Tech", "Automated Engines", "RailNet"],
    links: {
      live: "https://blw.indianrailways.gov.in",
      github: "https://github.com/amaaxx/indian-railways" 
    }
  },
  "core-stack": {
    title: "Core Stack",
    subtitle: "System Architecture & Arsenal",
    problem: "Modern web development often fractures into either rapid prototyping with poor scaling, or over-engineered monoliths that stall momentum. The challenge is building a stack that guarantees both developer velocity and enterprise-grade scalability.",
    solution: "My primary architecture relies on Next.js 15 for the frontend edge delivery, ensuring high SEO and instant hydration. I anchor this to Python-based backends (FastAPI) for heavy data processing and AI integration. For raw algorithmic logic and core fundamentals, I rely on C++.",
    stack: ["Next.js 15", "TypeScript", "Python", "FastAPI", "C++", "Tailwind v4"],
    links: {
      github: "https://github.com/amaaxx"
    }
  }
};

// Note: We removed the 'type VesselKey' line because Record<string, VesselProject> handles the routing safely now.

export default async function VesselPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const project = vesselData[slug];
  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-white p-6 md:p-16 font-sans selection:bg-accent/30 selection:text-accent">
      <div className="max-w-3xl mx-auto space-y-12 mt-12 md:mt-0 relative z-10">
        
        {/* The "Back" Button */}
        <Link 
          href="/" 
          className="group flex items-center gap-4 text-neutral-500 hover:text-accent transition-colors w-fit text-xs font-mono uppercase tracking-widest"
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

          {/* Action Links */}
          {project.links && (
            <div className="flex flex-wrap gap-4 pt-4">
              {project.links.live && (
                <a 
                  href={project.links.live} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-5 py-2.5 text-sm font-medium bg-accent/10 text-accent border border-accent/20 rounded-full hover:bg-accent/20 hover:border-accent/40 transition-all flex items-center gap-2 group/btn"
                >
                  Launch Live System <span className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform">↗</span>
                </a>
              )}
              {project.links.github && (
                <a 
                  href={project.links.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-5 py-2.5 text-sm font-medium bg-neutral-800/50 text-neutral-300 border border-neutral-700/50 rounded-full hover:text-white hover:border-neutral-500 transition-all flex items-center gap-2"
                >
                  View Source Code
                </a>
              )}
            </div>
          )}
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

          {/* Architecture Schematic Placeholder */}
          <div className="my-16 p-8 border border-neutral-800 rounded-2xl bg-neutral-900/30 flex flex-col items-center justify-center text-center group/diagram transition-colors hover:border-neutral-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
            <div className="h-16 w-16 mb-4 rounded-full border border-neutral-700 flex items-center justify-center bg-neutral-800 relative z-10 group-hover/diagram:border-accent/50 transition-colors duration-500">
              <span className="text-neutral-500 group-hover/diagram:text-accent transition-colors duration-500 font-mono">⌘</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 relative z-10">Architecture Schematic</h3>
            <p className="text-sm text-neutral-500 max-w-sm relative z-10 font-mono">
              System topology visualization goes here.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4 tracking-tight">The Solution Architecture</h2>
          <p className="leading-relaxed">{project.solution}</p>
        </article>
      </div>
    </main>
  );
}