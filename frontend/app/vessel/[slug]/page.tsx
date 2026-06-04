"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { 
  GroundTruthVisual, 
  WorkspaceVisual, 
  BroccoliVisual,
  CoreStackVisual 
} from "@/components/ProjectVisuals";

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
    title: "Laminar (pink-broccoli)",
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

export default function VesselPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const project = vesselData[slug];
  if (!project) {
    notFound();
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 140,
        damping: 20
      }
    }
  };

  // Render the correct high-fidelity visual
  const renderVisual = () => {
    switch (slug) {
      case "ground-truth-engine":
        return <GroundTruthVisual />;
      case "blw-portal":
        return <WorkspaceVisual />;
      case "Laminar":
        return <BroccoliVisual />;
      case "core-stack":
        return <CoreStackVisual />;
      default:
        return <CoreStackVisual />;
    }
  };

  return (
    <main className="min-h-screen bg-[#05050a] text-neutral-200 p-6 md:p-16 font-sans relative overflow-x-hidden selection:bg-accent/25 selection:text-white">
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto mt-12 md:mt-0 relative z-10"
      >

        {/* Navigation */}
        <motion.div variants={itemVariants}>
          <Link
            href="/"
            className="group flex items-center gap-4 text-neutral-500 hover:text-white transition-colors w-fit text-xs font-mono uppercase tracking-widest mb-12"
            data-cursor="pointer"
          >
            <span className="transform group-hover:-translate-x-2 transition-transform duration-300">←</span>
            Return_To_Grid
          </Link>
        </motion.div>

        {/* Cinematic Header */}
        <motion.header variants={itemVariants} className="space-y-4 mb-16 border-b border-white/5 pb-12">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4f46e5] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4f46e5]"></span>
            </span>
            <span className="font-mono text-xs text-neutral-500 tracking-widest uppercase">
              System_Record // {slug.toUpperCase()}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter premium-text-primary leading-none">
            {project.title}
          </h1>
          <p className="text-neutral-500 font-mono text-xs pt-2">
            [ {project.subtitle} ]
          </p>
        </motion.header>

        {/* 2-Column Dossier Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 pb-16">

          {/* Main Narrative (Left) */}
          <div className="md:col-span-8 space-y-12">
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-bold text-neutral-200 mb-4 tracking-tight flex items-center gap-2">
                <span className="text-[#4f46e5] text-sm font-mono">01.</span> The Problem Space
              </h2>
              <p className="leading-relaxed text-neutral-400 md:text-lg">{project.problem}</p>
            </motion.section>

            {/* Engineered Architecture Schematic: Overruled with High-Fidelity Custom Visuals */}
            <motion.div 
              variants={itemVariants} 
              className="my-12 rounded-3xl glass-surface border border-white/5 bg-[#09090e]/60 backdrop-blur-md relative overflow-hidden group shadow-lg"
            >
              <div className="absolute inset-0 bg-grid-white/[0.015] bg-[size:20px_20px]" />

              <div className="relative z-10 w-full flex items-center justify-center p-6 border-b border-white/5">
                {renderVisual()}
              </div>

              <div className="relative z-10 p-6 text-center">
                <h3 className="text-md font-bold text-neutral-300 mb-1">Topology Schematic</h3>
                <p className="text-[10px] text-neutral-500 font-mono tracking-wider uppercase">
                  Systems connectivity verified. Flow conditions optimal.
                </p>
              </div>
            </motion.div>

            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-bold text-neutral-200 mb-4 tracking-tight flex items-center gap-2">
                <span className="text-[#4f46e5] text-sm font-mono">02.</span> Solution Architecture
              </h2>
              <p className="leading-relaxed text-neutral-400 md:text-lg">{project.solution}</p>
            </motion.section>
          </div>

          {/* Hard-Data Sidebar (Right) */}
          <div className="md:col-span-4 space-y-8 order-first md:order-last">

            {/* Action Links */}
            {project.links && (
              <motion.div variants={itemVariants} className="flex flex-col gap-3">
                {project.links.live && (
                  <a 
                    href={project.links.live.startsWith("http") ? project.links.live : `https://${project.links.live}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full py-4 px-6 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-200 active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2"
                    data-cursor="pointer"
                  >
                    Initialize System <span className="text-sm leading-none">↗</span>
                  </a>
                )}
                {project.links.github && (
                  <a 
                    href={project.links.github.startsWith("http") ? project.links.github : `https://${project.links.github}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full py-4 px-6 bg-transparent border border-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:border-white/20 active:scale-[0.98] transition-all text-center"
                    data-cursor="pointer"
                  >
                    Source Code
                  </a>
                )}
              </motion.div>
            )}

            {/* Telemetry Module */}
            <motion.div variants={itemVariants} className="p-6 border border-white/5 rounded-2xl bg-[#09090e]/60 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#4f46e5] to-transparent opacity-50" />
              <h3 className="font-mono text-[9px] text-neutral-500 tracking-widest uppercase mb-6">System_Telemetry</h3>
              <ul className="space-y-4 font-mono text-xs">
                <li className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-neutral-500">Status</span>
                  <span className="text-[#4f46e5] flex items-center gap-2 font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#4f46e5] animate-pulse" /> {project.telemetry.status}
                  </span>
                </li>
                <li className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-neutral-500">Version</span>
                  <span className="text-neutral-300">{project.telemetry.version}</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-neutral-500">Build_Hash</span>
                  <span className="text-neutral-300">{project.telemetry.buildHash}</span>
                </li>
              </ul>
            </motion.div>

            {/* Arsenal Module */}
            <motion.div variants={itemVariants} className="p-6 border border-white/5 rounded-2xl bg-[#09090e]/60 backdrop-blur-md">
              <h3 className="font-mono text-[9px] text-neutral-500 tracking-widest uppercase mb-6">Tech_Arsenal</h3>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span key={tech} className="px-3 py-1.5 text-[10px] font-mono text-neutral-300 bg-white/5 rounded-md border border-white/5">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </main>
  );
}