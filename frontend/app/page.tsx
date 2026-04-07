"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";

export default function Home() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 300, damping: 24 } 
    },
  };

  return (
    <main className="relative min-h-[100dvh] flex flex-col justify-center bg-background text-white p-4 md:p-8 font-sans selection:bg-accent selection:text-white overflow-hidden">
      
      {/* Unified Environment: Radial Spotlight & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800/20 via-background to-background pointer-events-none z-0" />
      <div className="absolute inset-0 bg-grid-white/[0.01] bg-[size:30px_30px] pointer-events-none z-0" />

      <div className="max-w-6xl w-full mx-auto space-y-8 md:space-y-10 py-10 md:py-0 relative z-10">
        
        {/* HERO SECTION */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-4 md:pt-0"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 drop-shadow-sm">
            Amaan. <br className="hidden md:block" />
            <span className="text-neutral-500">Software Developer.</span>
          </h1>
          <p className="max-w-xl text-lg text-neutral-400">
            Building complex, high-performance web applications and systems. 
          </p>
        </motion.header>

        {/* BENTO GRID SECTION */}
        <motion.section 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-4 h-auto md:h-[65vh] md:min-h-[600px] md:max-h-[800px]"
        >
          
          {/* VESSEL 01: Ground Truth Engine */}
          <Link href="/vessel/ground-truth-engine" className="md:col-span-2 md:row-span-2 block">
            <motion.div 
              variants={item}
              className="relative overflow-hidden bg-surface border border-border rounded-3xl p-8 h-full flex flex-col justify-end transition-all duration-300 hover:border-neutral-600 active:scale-[0.98] active:border-neutral-500 group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute top-8 left-8 flex items-center gap-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase">
                  Vessel_01 // System_Active
                </span>
              </div>
              <div className="relative z-10 mt-auto md:mt-0 pt-20">
                <h2 className="text-3xl font-bold mb-3 tracking-tight group-hover:text-accent transition-colors duration-300">
                  Ground Truth Engine
                </h2>
                <p className="text-neutral-400 max-w-md mb-8 leading-relaxed">
                  An advanced RAG architecture engineered to eliminate AI hallucinations through deterministic semantic routing.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Python', 'Vector DB', 'FastAPI', 'Next.js 15'].map((tech) => (
                    <span key={tech} className="px-3 py-1 text-[11px] font-mono text-neutral-300 bg-neutral-800/50 rounded-full border border-neutral-700/50 backdrop-blur-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </Link>

          {/* VESSEL 02: Strata */}
          <Link href="/vessel/strata" className="block">
          <motion.div 
            variants={item}
            className="relative overflow-hidden bg-surface border border-border rounded-3xl p-6 h-full flex flex-col justify-between transition-all duration-300 hover:border-neutral-600 active:scale-[0.98] active:border-neutral-500 group"
          >
            <div className="absolute top-6 left-6">
              <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase">
                Vessel_02 // Strata
              </span>
            </div>
            {/* MOBILE FIX: mt-14 forces clearance below absolute label, md:mt-auto hands it back to Flexbox on desktop */}
            <div className="relative mt-14 md:mt-auto md:mb-auto h-20 w-full flex items-center justify-center">
               <div className="absolute w-full h-12 bg-neutral-800 rounded-lg border border-neutral-700 transform transition-transform group-hover:-translate-y-3 group-hover:scale-[0.98] duration-500 z-10 shadow-lg" />
               <div className="absolute w-full h-12 bg-neutral-800/80 rounded-lg border border-neutral-700/80 transform translate-y-2 scale-[0.95] transition-transform group-hover:-translate-y-0 group-hover:scale-[0.92] duration-500 z-0" />
               <div className="absolute w-full h-12 bg-neutral-800/40 rounded-lg border border-neutral-700/50 transform translate-y-4 scale-[0.90] transition-transform group-hover:translate-y-3 group-hover:scale-[0.85] duration-500 -z-10" />
            </div>
            <div className="relative z-20 mt-4">
              <h2 className="text-xl font-bold mb-1 group-hover:text-accent transition-colors duration-300">Strata</h2>
              <p className="text-neutral-400 text-sm">Recursive note architecture.</p>
            </div>
          </motion.div>
          </Link>

          {/* VESSEL 03: BLW Portal */}
          <Link href="/vessel/blw-portal" className="block">
          <motion.div 
            variants={item}
            className="relative overflow-hidden bg-surface border border-border rounded-3xl p-6 h-full flex flex-col justify-between transition-all duration-300 hover:border-neutral-600 active:scale-[0.98] active:border-neutral-500 group"
          >
            <div className="absolute top-6 left-6">
              <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase">
                Vessel_03 // BLW_Intranet
              </span>
            </div>
            {/* MOBILE FIX: mt-14 added */}
            <div className="relative mt-14 md:mt-auto md:mb-auto w-full flex items-center justify-start opacity-50 group-hover:opacity-100 transition-opacity duration-500">
               <div className="flex flex-col gap-2 w-full">
                 <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                   <div className="h-full bg-neutral-600 w-1/4 group-hover:bg-accent group-hover:w-full transition-all duration-1000 ease-in-out"></div>
                 </div>
                 <div className="flex justify-between w-full text-[9px] font-mono text-neutral-500">
                   <span>Auth_Required</span>
                   <span className="group-hover:text-accent transition-colors">Deployed</span>
                 </div>
               </div>
            </div>
            <div className="relative z-20 mt-4">
              <h2 className="text-xl font-bold mb-1 group-hover:text-accent transition-colors duration-300">BLW Portal</h2>
              <p className="text-neutral-400 text-sm">Enterprise deployment.</p>
            </div>
          </motion.div>
          </Link>

          {/* VESSEL 04: Core Stack */}
          <Link href="/vessel/core-stack" className="block">
          <motion.div 
            variants={item}
            className="relative overflow-hidden bg-surface border border-border rounded-3xl p-6 h-full flex flex-col justify-between transition-all duration-300 hover:border-neutral-600 active:scale-[0.98] active:border-neutral-500 group"
          >
            <div className="absolute top-6 left-6">
              <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase">
                Vessel_04 // Core_Stack
              </span>
            </div>
            {/* MOBILE FIX: mt-14 added */}
            <div className="mt-14 md:mt-auto md:mb-auto z-20 w-full pt-4 md:pt-0">
              <div className="flex flex-col gap-3">
                {[
                  { name: "Next.js 15", category: "Framework" },
                  { name: "TypeScript", category: "Language" },
                  { name: "Python", category: "Backend" },
                  { name: "Tailwind v4", category: "Styling" },
                  { name: "C++ / DSA", category: "Logic" }
                ].map((tech) => (
                  <div key={tech.name} className="flex justify-between items-center group/tech">
                    <span className="text-sm font-medium text-neutral-300 group-hover/tech:text-white transition-colors">
                      {tech.name}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-600 group-hover/tech:text-accent transition-colors">
                      [{tech.category}]
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          </Link>

          {/* VESSEL 05: Comm Link */}
          <motion.div 
            variants={item}
            className="relative overflow-hidden bg-surface border border-border rounded-3xl p-8 md:col-span-2 flex flex-col justify-end transition-all duration-300 hover:border-neutral-600 active:scale-[0.98] active:border-neutral-500 group"
          >
            <Link href="/vessel/comm-link" className="absolute inset-0 z-10" aria-label="Open Comm Link" />

            <div className="absolute top-0 right-0 p-8 opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
               <div className="relative flex h-8 w-8 items-center justify-center">
                 <div className="animate-ping absolute inline-flex h-full w-full rounded-full border border-accent opacity-30"></div>
                 <div className="relative inline-flex rounded-full h-2 w-2 bg-accent"></div>
               </div>
            </div>
            <div className="absolute top-8 left-8 pointer-events-none">
              <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase">
                Vessel_05 // Comm_Link
              </span>
            </div>
            <div className="relative z-20 flex flex-col md:flex-row items-start md:items-end justify-between w-full gap-6 mt-16 md:mt-0">
              <div className="pointer-events-none">
                <p className="text-neutral-400 mb-2 font-mono text-sm">Initialize connection</p>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight group-hover:text-accent transition-colors duration-300 flex items-center">
                  Let's Talk 
                  <svg 
                    width="32" 
                    height="32" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="ml-2 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
                  >
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </h2>
              </div>
              <div className="flex gap-3 relative z-30">
                <a href="https://github.com/amaaxx" target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm bg-neutral-800/50 rounded-full border border-neutral-700/50 text-neutral-400 hover:text-white hover:border-neutral-500 active:scale-95 transition-all backdrop-blur-sm">
                  GitHub
                </a>
                <a href="https://linkedin.com/in/amaaxx" target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm bg-neutral-800/50 rounded-full border border-neutral-700/50 text-neutral-400 hover:text-white hover:border-neutral-500 active:scale-95 transition-all backdrop-blur-sm">
                  LinkedIn
                </a>
              </div>
            </div>
          </motion.div>

        </motion.section>
      </div>
    </main>
  );
}