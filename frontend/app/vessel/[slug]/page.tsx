import Link from "next/link";
import { notFound } from "next/navigation";

type VesselProject = {
  title: string;
  subtitle: string;
  problem: string;
  solution: string;
  stack: string[];
  links?: {
    live?: string;
    github?: string;
  };
  telemetry: {
    status: string;
    version: string;
    buildHash: string;
  }
};

const vesselData: Record<string, VesselProject> = {
  "ground-truth-engine": {
    title: "Ground Truth Engine",
    subtitle: "Deterministic RAG Architecture",
    problem: "AI hallucination is a critical failure point in enterprise deployments. Standard LLMs generate confident but factually incorrect responses, making them unsuitable for rigid, data-sensitive environments.",
    solution: "By implementing a strict Retrieval-Augmented Generation (RAG) pipeline, we anchor the LLM's generative capabilities to a deterministic vector database, ensuring zero-hallucination outputs based solely on verified internal documents.",
    stack: ["Python", "Vector DB", "FastAPI", "Next.js"],
    links: {
      live: "https://halkill.vercel.app",
      github: "https://github.com/amaaxx/halkill"
    },
    telemetry: { status: "Active", version: "v1.2.4", buildHash: "0x8F9A2C" }
  },
  "Laminar": {
    title: "Laminar",
    subtitle: "Recursive Note Architecture",
    problem: "Standard note-taking applications rely on rigid folder structures or chaotic tagging systems, creating friction when organizing deeply nested or interconnected thoughts.",
    solution: "Engineered a full-stack digital workspace utilizing a recursive data model. This allows for infinite nesting of folders and notes, powered by a robust PostgreSQL backend and a highly responsive React/Tailwind frontend.",
    stack: ["Next.js 15", "PostgreSQL", "React", "Tailwind v4"],
    links: {
      live: "https://your-deployment-url.com",
      github: "https://github.com/amaaxx/laminar"
    },
    telemetry: { status: "Iterating", version: "v0.9.1-beta", buildHash: "0x3B1F8D" }
  },
  "blw-portal": {
    title: "BLW Portal",
    subtitle: "Enterprise Intranet Deployment",
    problem: "Banaras Locomotive Works (Indian Railways) required a modernized, centralized digital workspace to handle operations and employee engagement across a massive workforce.",
    solution: "Developed and deployed a secure, high-performance portal directly onto the RailNet intranet. The system includes an automated architecture capable of managing data and interactions for over 5,000 employees.",
    stack: ["Enterprise Tech", "Automated Engines", "RailNet"],
    links: {
      live: "https://indian-railways-six.vercel.app/",
      github: "https://github.com/amaaxx/indian-railways"
    },
    telemetry: { status: "Deployed", version: "v2.0.0-LTS", buildHash: "0xRAILNET" }
  },
  "core-stack": {
    title: "Core Stack",
    subtitle: "System Architecture & Arsenal",
    problem: "Modern web development often fractures into either rapid prototyping with poor scaling, or over-engineered monoliths that stall momentum. The challenge is building a stack that guarantees both developer velocity and enterprise-grade scalability.",
    solution: "My primary architecture relies on Next.js 15 for the frontend edge delivery, ensuring high SEO and instant hydration. I anchor this to Python-based backends (FastAPI) for heavy data processing and AI integration. For raw algorithmic logic and core fundamentals, I rely on C++.",
    stack: ["Next.js 15", "TypeScript", "Python", "FastAPI", "C++", "Tailwind v4"],
    links: {
      github: "https://github.com/amaaxx"
    },
    telemetry: { status: "Stable", version: "v4.2.0", buildHash: "0xCORE" }
  }
};

export default async function VesselPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const project = vesselData[slug];
  if (!project) {
    notFound();
  }

  return (
    <main className="h-[100dvh] overflow-y-auto bg-background text-white p-6 md:p-16 font-sans selection:bg-accent/30 selection:text-accent relative overflow-x-hidden">
      <div className="system-overlay" />

      <div className="max-w-5xl mx-auto mt-12 md:mt-0 relative z-10">

        {/* Navigation */}
        <Link
          href="/"
          className="group flex items-center gap-4 text-neutral-500 hover:text-accent transition-colors w-fit text-xs font-mono uppercase tracking-widest mb-12"
        >
          <span className="transform group-hover:-translate-x-2 transition-transform duration-300">←</span>
          Return_To_Grid
        </Link>

        {/* Cinematic Header */}
        <header className="space-y-4 mb-16 border-b border-neutral-800 pb-12">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="font-mono text-xs text-neutral-500 tracking-widest uppercase">
              System_Record // {slug.toUpperCase()}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white drop-shadow-sm">
            {project.title}
          </h1>
          <p className="text-xl text-neutral-400 font-mono text-sm pt-2">
            [ {project.subtitle} ]
          </p>
        </header>

        {/* 2-Column Dossier Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 pb-16">

          {/* Main Narrative (Left) */}
          <article className="md:col-span-8 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 tracking-tight flex items-center gap-2">
                <span className="text-accent text-sm font-mono">01.</span> The Problem Space
              </h2>
              <p className="leading-relaxed text-neutral-400 md:text-lg">{project.problem}</p>
            </section>

            {/* Engineered Architecture Schematic */}
            <div className="my-12 p-8 border border-neutral-800 rounded-3xl bg-neutral-900/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />

              {/* Glowing SVG Topology */}
              <div className="relative z-10 w-full h-48 flex items-center justify-center mb-6">
                <svg width="100%" height="100%" viewBox="0 0 400 150" fill="none" className="max-w-md">
                  <path d="M 100 75 L 200 75 L 300 75" stroke="#262626" strokeWidth="2" strokeDasharray="4 4" />
                  <path d="M 100 75 L 200 75 L 300 75" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" className="opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <circle cx="100" cy="75" r="16" fill="#171717" stroke="#3b82f6" strokeWidth="2" />
                  <circle cx="200" cy="75" r="24" fill="#171717" stroke="#3b82f6" strokeWidth="2" className="group-hover:fill-accent/10 transition-colors duration-500" />
                  <circle cx="300" cy="75" r="16" fill="#171717" stroke="#3b82f6" strokeWidth="2" />

                  <circle cx="100" cy="75" r="4" fill="#3b82f6" />
                  <circle cx="200" cy="75" r="6" fill="#3b82f6" className="animate-pulse" />
                  <circle cx="300" cy="75" r="4" fill="#3b82f6" />
                </svg>
              </div>

              <div className="relative z-10 text-center">
                <h3 className="text-lg font-bold text-white mb-2">Topology Verified</h3>
                <p className="text-xs text-neutral-500 font-mono tracking-wider uppercase">
                  Data flow architecture optimal.
                </p>
              </div>
            </div>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 tracking-tight flex items-center gap-2">
                <span className="text-accent text-sm font-mono">02.</span> Solution Architecture
              </h2>
              <p className="leading-relaxed text-neutral-400 md:text-lg">{project.solution}</p>
            </section>
          </article>

          {/* Hard-Data Sidebar (Right) */}
          <aside className="md:col-span-4 space-y-8 order-first md:order-last">

            {/* Action Links */}
            {project.links && (
              <div className="flex flex-col gap-3">
                {project.links.live && (
                  <a 
                    href={project.links.live.startsWith("http") ? project.links.live : `https://${project.links.live}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full py-4 px-6 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-200 active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2"
                  >
                    Initialize System <span className="text-lg leading-none">↗</span>
                  </a>
                )}
                {project.links.github && (
                  <a 
                    href={project.links.github.startsWith("http") ? project.links.github : `https://${project.links.github}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full py-4 px-6 bg-transparent border border-neutral-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:border-neutral-400 active:scale-[0.98] transition-all text-center"
                  >
                    Source Code
                  </a>
                )}
              </div>
            )}

            {/* Telemetry Module */}
            <div className="p-6 border border-neutral-800 rounded-2xl bg-surface/50 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
              <h3 className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase mb-6">System_Telemetry</h3>
              <ul className="space-y-4 font-mono text-xs">
                <li className="flex justify-between items-center border-b border-neutral-800/50 pb-3">
                  <span className="text-neutral-500">Status</span>
                  <span className="text-accent flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" /> {project.telemetry.status}
                  </span>
                </li>
                <li className="flex justify-between items-center border-b border-neutral-800/50 pb-3">
                  <span className="text-neutral-500">Version</span>
                  <span className="text-neutral-300">{project.telemetry.version}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-neutral-500">Build_Hash</span>
                  <span className="text-neutral-300">{project.telemetry.buildHash}</span>
                </li>
              </ul>
            </div>

            {/* Arsenal Module */}
            <div className="p-6 border border-neutral-800 rounded-2xl bg-surface/50">
              <h3 className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase mb-6">Tech_Arsenal</h3>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span key={tech} className="px-3 py-1.5 text-[10px] font-mono text-neutral-300 bg-neutral-900 rounded-md border border-neutral-800">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>
    </main>
  );
}