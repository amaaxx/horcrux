"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { useState, useCallback } from "react";

// ── Spotlight Card ─────────────────────────────────────────────────────────────
// Wraps any bento card with a radial gradient that follows the cursor, giving
// a premium "light source" hover effect without requiring extra libraries.

type SpotlightState = { x: number; y: number; opacity: number };

const SPOTLIGHT_RADIUS = "380px";
const SPOTLIGHT_OPACITY = 0.11;
const SPOTLIGHT_FALLOFF = "75%";

function SpotlightCard({
  children,
  className,
  variants,
}: {
  children: React.ReactNode;
  className: string;
  variants?: Variants;
}) {
  const [spotlight, setSpotlight] = useState<SpotlightState>({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top, opacity: 1 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <motion.div
      variants={variants}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Cursor-tracking spotlight overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-0"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(${SPOTLIGHT_RADIUS} at ${spotlight.x}px ${spotlight.y}px, rgba(59,130,246,${SPOTLIGHT_OPACITY}), transparent ${SPOTLIGHT_FALLOFF})`,
        }}
      />
      {children}
    </motion.div>
  );
}

// ── Home ───────────────────────────────────────────────────────────────────────
export default function Home() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 260, damping: 22, mass: 0.8 },
    },
  };

  return (
    <main className="relative w-full h-[100dvh] flex flex-col bg-background text-white font-sans selection:bg-accent selection:text-white overflow-hidden">

      {/* Global Environment Systems */}
      <div className="system-overlay" />
      <div className="scanline-effect" />

      {/* Multi-layer background depth */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)`,
          backgroundSize: "38px 38px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_20%_110%,rgba(99,102,241,0.06),transparent)] pointer-events-none z-0" />

      {/* ── CONTENT WRAPPER ───────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col h-full max-w-6xl w-full mx-auto px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 gap-3 md:gap-5">

        {/* HERO */}
        <motion.header
          initial={{ opacity: 0, y: -18, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex-none"
        >
          <div className="flex items-center gap-3 mb-2 hidden md:flex">
            <div className="h-px w-8 bg-accent/60" />
            <span className="font-mono text-[10px] text-accent/80 tracking-widest uppercase">Sys_Boot // Initialize</span>
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          </div>
          <h1 className="text-[clamp(1.75rem,7vw,3.5rem)] font-bold tracking-tight leading-none mb-1 md:mb-2">
            <span className="bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent">Amaan.</span>
            <br className="hidden md:block" />
            <span className="text-neutral-500">Software Dev.</span>
          </h1>
          <p className="text-[clamp(0.7rem,2.5vw,1.05rem)] text-neutral-400 leading-snug max-w-lg">
            Building complex, high‑performance web apps and systems.
          </p>
        </motion.header>

        {/* BENTO GRID */}
        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className={[
            "flex-1 min-h-0",
            "grid grid-cols-2 grid-rows-3 gap-2",
            "md:grid-cols-3 md:gap-4 md:[grid-template-rows:2fr_2fr_1.6fr]",
          ].join(" ")}
        >
          {/* VESSEL 01 */}
          <Link href="/vessel/ground-truth-engine" className="col-span-2 md:col-span-2 md:row-span-2 block h-full">
            <SpotlightCard
              variants={item}
              className="relative overflow-hidden bg-surface border border-border rounded-2xl md:rounded-3xl p-4 md:p-8 h-full flex flex-col justify-end transition-all duration-300 hover:border-neutral-600 hover:shadow-[0_0_45px_-8px_rgba(59,130,246,0.22)] active:scale-[0.99] group"
            >
              {/* Ambient corner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="absolute top-4 left-4 md:top-8 md:left-8 flex justify-between w-[calc(100%-2rem)] md:w-[calc(100%-4rem)]">
                <span className="font-mono text-[8px] md:text-[10px] text-neutral-500 tracking-widest uppercase">Vessel_01 // GTE</span>
                <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-accent shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                </span>
              </div>

              <div className="relative z-10 mt-auto pt-10 md:pt-24">
                <h2 className="text-lg md:text-4xl font-bold mb-1 md:mb-3 tracking-tight group-hover:text-accent transition-colors duration-300">
                  Ground Truth Engine
                </h2>
                <p className="text-neutral-400 text-[11px] md:text-base max-w-md mb-3 md:mb-8 leading-relaxed hidden sm:block">
                  An advanced RAG architecture engineered to eliminate AI hallucinations through deterministic semantic routing.
                </p>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {["Python", "Vector DB", "FastAPI", "Next.js 15"].map((tech) => (
                    <span key={tech} className="px-2 py-0.5 md:px-3 md:py-1 text-[9px] md:text-[11px] font-mono text-neutral-300 bg-neutral-800/60 rounded-full border border-neutral-700/60 group-hover:border-accent/25 group-hover:text-neutral-200 transition-all duration-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          </Link>

          {/* VESSEL 02 */}
          <Link href="/vessel/Laminar" className="block h-full">
            <SpotlightCard
              variants={item}
              className="relative overflow-hidden bg-surface border border-border rounded-2xl md:rounded-3xl p-3 md:p-6 h-full flex flex-col transition-all duration-300 hover:border-neutral-600 hover:shadow-[0_0_45px_-8px_rgba(59,130,246,0.22)] active:scale-[0.99] group"
            >
              <div className="relative z-20 flex-none shrink-0">
                <span className="font-mono text-[8px] md:text-[10px] text-neutral-500 tracking-widest uppercase">Vessel_02 // Laminar</span>
              </div>

              <div className="relative w-full flex items-center justify-center flex-1 min-h-0 my-2 md:my-4">
                <div className="absolute w-full h-7 md:h-10 bg-neutral-800 rounded-lg border border-neutral-700 transition-[transform,border-color] group-hover:-translate-y-2 group-hover:scale-[0.98] group-hover:border-accent/30 duration-500 z-10 shadow-lg" />
                <div className="absolute w-full h-7 md:h-10 bg-neutral-800/80 rounded-lg border border-neutral-700/80 translate-y-1.5 scale-[0.95] transition-transform group-hover:translate-y-0 group-hover:scale-[0.92] duration-500 z-0" />
                <div className="absolute w-full h-7 md:h-10 bg-neutral-800/40 rounded-lg border border-neutral-700/50 translate-y-3 scale-[0.90] transition-transform group-hover:translate-y-2.5 group-hover:scale-[0.85] duration-500 -z-10" />
              </div>

              <div className="relative z-20 flex-none shrink-0">
                <h2 className="text-sm md:text-xl font-bold mb-0.5 group-hover:text-accent transition-colors duration-300">Laminar</h2>
                <p className="text-neutral-400 text-[10px] md:text-sm">Recursive note architecture.</p>
              </div>
            </SpotlightCard>
          </Link>

          {/* VESSEL 03 */}
          <Link href="/vessel/blw-portal" className="block h-full">
            <SpotlightCard
              variants={item}
              className="relative overflow-hidden bg-surface border border-border rounded-2xl md:rounded-3xl p-3 md:p-6 h-full flex flex-col transition-all duration-300 hover:border-neutral-600 hover:shadow-[0_0_45px_-8px_rgba(59,130,246,0.22)] active:scale-[0.99] group"
            >
              <div className="relative z-20 flex-none shrink-0">
                <span className="font-mono text-[8px] md:text-[10px] text-neutral-500 tracking-widest uppercase">Vessel_03 // BLW</span>
              </div>

              <div className="relative w-full flex items-center opacity-50 group-hover:opacity-100 transition-opacity duration-500 flex-1 min-h-0 my-2 md:my-4">
                <div className="flex flex-col gap-1.5 w-full">
                  <div className="h-0.5 md:h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-neutral-600 w-1/4 group-hover:bg-accent group-hover:w-full transition-all duration-1000 ease-in-out" />
                  </div>
                  <div className="flex justify-between w-full text-[8px] md:text-[9px] font-mono text-neutral-500">
                    <span>Intranet</span>
                    <span className="group-hover:text-accent transition-colors">Deployed</span>
                  </div>
                </div>
              </div>

              <div className="relative z-20 flex-none shrink-0">
                <h2 className="text-sm md:text-xl font-bold mb-0.5 group-hover:text-accent transition-colors duration-300">BLW Portal</h2>
                <p className="text-neutral-400 text-[10px] md:text-sm">Enterprise deployment.</p>
              </div>
            </SpotlightCard>
          </Link>

          {/* VESSEL 04 */}
          <Link href="/vessel/core-stack" className="block h-full">
            <SpotlightCard
              variants={item}
              className="relative overflow-hidden bg-surface border border-border rounded-2xl md:rounded-3xl px-3 py-3 md:px-6 md:pt-5 md:pb-5 h-full flex flex-col transition-all duration-300 hover:border-neutral-600 hover:shadow-[0_0_45px_-8px_rgba(59,130,246,0.22)] active:scale-[0.99] group"
            >
              <div className="relative z-20 flex-none shrink-0 mb-2 md:mb-3">
                <span className="font-mono text-[8px] md:text-[10px] text-neutral-500 tracking-widest uppercase">Vessel_04 // Stack</span>
              </div>

              <div className="relative z-20 w-full flex-1 min-h-0 flex flex-col justify-between">
                {[
                  { name: "Next.js 15", category: "Framework" },
                  { name: "TypeScript", category: "Language" },
                  { name: "Python", category: "Backend" },
                  { name: "Tailwind v4", category: "Styling" },
                  { name: "C++ / DSA", category: "Logic" },
                ].map((tech, i, arr) => (
                  <div key={tech.name} className="flex flex-col">
                    <div className="flex justify-between items-center group/tech py-[2px]">
                      <span className="text-[11px] md:text-[13px] font-medium text-neutral-300 group-hover/tech:text-white transition-colors duration-200">
                        {tech.name}
                      </span>
                      <span className="text-[8px] md:text-[9px] font-mono text-neutral-600 group-hover/tech:text-accent transition-colors duration-200 hidden xs:block">
                        [{tech.category}]
                      </span>
                    </div>
                    {i < arr.length - 1 && <div className="h-px w-full bg-neutral-800/80 mt-[2px]" />}
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </Link>

          {/* VESSEL 05 */}
          <SpotlightCard
            variants={item}
            className="col-span-2 md:col-span-2 relative overflow-hidden bg-surface border border-border rounded-2xl md:rounded-3xl px-4 py-3 md:p-8 flex flex-col justify-between transition-all duration-300 hover:border-neutral-600 hover:shadow-[0_0_50px_-8px_rgba(59,130,246,0.28)] active:scale-[0.99] group"
          >
            <Link href="/vessel/comm-link" className="absolute inset-0 z-10" aria-label="Open Comm Link" />

            <div className="absolute top-0 right-0 p-4 md:p-8 opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="relative flex h-6 w-6 md:h-8 md:w-8 items-center justify-center">
                <div className="animate-ping absolute inline-flex h-full w-full rounded-full border border-accent opacity-30" />
                <div className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-accent" />
              </div>
            </div>

            <div className="flex-none">
              <span className="font-mono text-[8px] md:text-[10px] text-neutral-500 tracking-widest uppercase">Vessel_05 // Comm_Link</span>
            </div>

            <div className="relative z-20 flex-none flex flex-row items-end justify-between w-full gap-3 mt-2 md:mt-0">
              <div className="pointer-events-none">
                <p className="text-neutral-400 mb-1 font-mono text-[9px] md:text-sm">Initialize connection</p>
                <h2 className="text-xl sm:text-2xl md:text-5xl font-bold tracking-tight group-hover:text-accent transition-colors duration-300 flex items-center gap-1">
                  Let&apos;s Talk
                  <svg suppressHydrationWarning width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-7 md:h-7 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </h2>
              </div>
              <div className="flex gap-2 relative z-30 flex-shrink-0">
                <a href="https://github.com/amaaxx" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-sm bg-neutral-800/50 rounded-full border border-neutral-700/50 text-neutral-400 hover:text-white hover:border-accent/30 hover:bg-accent/5 active:scale-95 transition-all backdrop-blur-sm">GitHub</a>
                <a href="https://linkedin.com/in/amaaxx" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-sm bg-neutral-800/50 rounded-full border border-neutral-700/50 text-neutral-400 hover:text-white hover:border-accent/30 hover:bg-accent/5 active:scale-95 transition-all backdrop-blur-sm">LinkedIn</a>
              </div>
            </div>
          </SpotlightCard>

        </motion.section>
      </div>
    </main>
  );
}