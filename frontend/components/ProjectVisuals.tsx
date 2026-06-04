"use client";

import React from "react";
import { motion } from "framer-motion";

// ── 1. GROUND TRUTH ENGINE: DETAILED VECTOR DB / SEMANTIC NODE GRAPH ──────────
export function GroundTruthVisual() {
  return (
    <div className="relative w-full h-full min-h-[220px] flex items-center justify-center overflow-hidden pointer-events-none bg-[#07070F]/50">
      {/* Background Cinematic Glows */}
      <div className="absolute w-64 h-64 rounded-full bg-indigo-500/10 blur-[80px] -top-12 -left-12" />
      <div className="absolute w-72 h-72 rounded-full bg-cyan-600/12 blur-[90px] -bottom-16 -right-16 animate-pulse" />
      
      {/* High-Fidelity Network Graph SVG */}
      <svg 
        className="w-[90%] h-[90%] max-w-[420px] max-h-[300px] z-10" 
        viewBox="0 0 400 240" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cyanToIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="1" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <style>
            {`
              .path-flow-fast {
                stroke-dasharray: 6 12;
                animation: flowOffset 0.8s linear infinite;
              }
              .path-flow-slow {
                stroke-dasharray: 8 16;
                animation: flowOffset 2s linear infinite;
              }
              .pulse-ring {
                animation: ringGrow 3s cubic-bezier(0.16, 1, 0.3, 1) infinite;
              }
              @keyframes flowOffset {
                to {
                  stroke-dashoffset: -24;
                }
              }
              @keyframes ringGrow {
                0% {
                  transform: scale(0.6);
                  opacity: 0.8;
                }
                100% {
                  transform: scale(2.2);
                  opacity: 0;
                }
              }
            `}
          </style>
        </defs>

        {/* Connections */}
        <path d="M 40 120 L 120 120" stroke="url(#cyanToIndigo)" strokeWidth="1.5" className="path-flow-fast" />
        <path d="M 40 120 L 120 120" stroke="#22d3ee" strokeWidth="0.5" opacity="0.4" />

        <path d="M 120 120 C 150 120, 150 60, 200 60" stroke="url(#cyanToIndigo)" strokeWidth="1.5" className="path-flow-fast" />
        <path d="M 120 120 L 200 120" stroke="url(#cyanToIndigo)" strokeWidth="1.5" className="path-flow-slow" />
        <path d="M 120 120 C 150 120, 150 180, 200 180" stroke="url(#cyanToIndigo)" strokeWidth="1.5" className="path-flow-fast" />

        <path d="M 120 120 C 150 120, 150 60, 200 60" stroke="#4f46e5" strokeWidth="0.5" opacity="0.3" />
        <path d="M 120 120 L 200 120" stroke="#4f46e5" strokeWidth="0.5" opacity="0.3" />
        <path d="M 120 120 C 150 120, 150 180, 200 180" stroke="#4f46e5" strokeWidth="0.5" opacity="0.3" />

        <path d="M 200 60 C 250 60, 250 120, 280 120" stroke="url(#cyanToIndigo)" strokeWidth="1.5" className="path-flow-slow" />
        <path d="M 200 120 L 280 120" stroke="url(#cyanToIndigo)" strokeWidth="1.5" className="path-flow-fast" />
        <path d="M 200 180 C 250 180, 250 120, 280 120" stroke="url(#cyanToIndigo)" strokeWidth="1.5" className="path-flow-slow" />

        <path d="M 280 120 L 360 120" stroke="url(#cyanToIndigo)" strokeWidth="2" className="path-flow-fast" />
        <path d="M 280 120 L 360 120" stroke="#22d3ee" strokeWidth="0.5" opacity="0.5" />

        {/* Animated flowing data packets */}
        {/* Input to Router */}
        <circle r="3.5" fill="#22d3ee" filter="url(#glow)">
          <animateMotion path="M 40 120 L 120 120" dur="1.2s" repeatCount="indefinite" />
        </circle>
        <circle r="2" fill="#e0f7fa">
          <animateMotion path="M 40 120 L 120 120" dur="1.2s" begin="0.6s" repeatCount="indefinite" />
        </circle>

        {/* Router to DB Shards */}
        <circle r="3.5" fill="#818cf8" filter="url(#glow)">
          <animateMotion path="M 120 120 C 150 120, 150 60, 200 60" dur="1.6s" repeatCount="indefinite" />
        </circle>
        <circle r="2" fill="#e0f7fa">
          <animateMotion path="M 120 120 C 150 120, 150 60, 200 60" dur="1.6s" begin="0.8s" repeatCount="indefinite" />
        </circle>

        <circle r="3.5" fill="#22d3ee" filter="url(#glow)">
          <animateMotion path="M 120 120 L 200 120" dur="1.4s" repeatCount="indefinite" />
        </circle>
        <circle r="2" fill="#e0f7fa">
          <animateMotion path="M 120 120 L 200 120" dur="1.4s" begin="0.7s" repeatCount="indefinite" />
        </circle>

        <circle r="3.5" fill="#818cf8" filter="url(#glow)">
          <animateMotion path="M 120 120 C 150 120, 150 180, 200 180" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle r="2" fill="#e0f7fa">
          <animateMotion path="M 120 120 C 150 120, 150 180, 200 180" dur="1.8s" begin="0.9s" repeatCount="indefinite" />
        </circle>

        {/* DB Shards to Context Synthesis */}
        <circle r="3.5" fill="#c084fc" filter="url(#glow)">
          <animateMotion path="M 200 60 C 250 60, 250 120, 280 120" dur="1.6s" repeatCount="indefinite" />
        </circle>
        <circle r="2" fill="#e0f7fa">
          <animateMotion path="M 200 60 C 250 60, 250 120, 280 120" dur="1.6s" begin="0.8s" repeatCount="indefinite" />
        </circle>

        <circle r="3.5" fill="#22d3ee" filter="url(#glow)">
          <animateMotion path="M 200 120 L 280 120" dur="1.4s" repeatCount="indefinite" />
        </circle>
        <circle r="2" fill="#e0f7fa">
          <animateMotion path="M 200 120 L 280 120" dur="1.4s" begin="0.7s" repeatCount="indefinite" />
        </circle>

        <circle r="3.5" fill="#c084fc" filter="url(#glow)">
          <animateMotion path="M 200 180 C 250 180, 250 120, 280 120" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle r="2" fill="#e0f7fa">
          <animateMotion path="M 200 180 C 250 180, 250 120, 280 120" dur="1.8s" begin="0.9s" repeatCount="indefinite" />
        </circle>

        {/* Synthesis to Output */}
        <circle r="4" fill="#22d3ee" filter="url(#glow)">
          <animateMotion path="M 280 120 L 360 120" dur="1.2s" repeatCount="indefinite" />
        </circle>
        <circle r="2" fill="#e0f7fa">
          <animateMotion path="M 280 120 L 360 120" dur="1.2s" begin="0.6s" repeatCount="indefinite" />
        </circle>

        {/* Pulsing rings around key nodes */}
        <circle cx="120" cy="120" r="10" stroke="#22d3ee" strokeWidth="1" className="pulse-ring" style={{ transformOrigin: "120px 120px", animationDelay: "0s" }} />
        <circle cx="120" cy="120" r="10" stroke="#22d3ee" strokeWidth="1" className="pulse-ring" style={{ transformOrigin: "120px 120px", animationDelay: "1.5s" }} />
        
        <circle cx="280" cy="120" r="10" stroke="#4f46e5" strokeWidth="1" className="pulse-ring" style={{ transformOrigin: "280px 120px", animationDelay: "0.5s" }} />
        <circle cx="280" cy="120" r="10" stroke="#4f46e5" strokeWidth="1" className="pulse-ring" style={{ transformOrigin: "280px 120px", animationDelay: "2s" }} />

        {/* Input Query Node */}
        <circle cx="40" cy="120" r="7" fill="#09090e" stroke="#22d3ee" strokeWidth="2" />
        <circle cx="40" cy="120" r="3" fill="#22d3ee" />

        {/* Semantic Router Node */}
        <motion.circle 
          cx="120" 
          cy="120" 
          r="10" 
          fill="#09090e" 
          stroke="url(#cyanToIndigo)" 
          strokeWidth="2.5"
          filter="url(#glow)"
          animate={{ strokeWidth: [2.5, 4, 2.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="120" cy="120" r="5" fill="#e0f7fa" />

        {/* Vector DB Nodes */}
        {[60, 120, 180].map((y, idx) => (
          <g key={y}>
            <circle cx="200" cy={y} r="8" fill="#09090e" stroke="#4f46e5" strokeWidth="2" />
            <motion.circle 
              cx="200" 
              cy={y} 
              r="3.5" 
              fill="#818cf8"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, delay: idx * 0.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <circle cx="200" cy={y} r="14" stroke="#4f46e5" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.4" />
          </g>
        ))}

        {/* Context Synthesis Node */}
        <motion.circle 
          cx="280" 
          cy="120" 
          r="11" 
          fill="#09090e" 
          stroke="url(#cyanToIndigo)" 
          strokeWidth="2.5"
          filter="url(#glow)"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="280" cy="120" r="4.5" fill="#c084fc" />

        {/* Generation Output Node */}
        <circle cx="360" cy="120" r="7" fill="#09090e" stroke="#22d3ee" strokeWidth="2" />
        <circle cx="360" cy="120" r="3" fill="#22d3ee" />

        <text x="40" y="142" fill="#64748b" fontSize="7" fontFamily="monospace" textAnchor="middle">IN_QUERY</text>
        <text x="120" y="145" fill="#22d3ee" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SEM_ROUTER</text>
        <text x="200" y="42" fill="#64748b" fontSize="7" fontFamily="monospace" textAnchor="middle">V_SHARD_01</text>
        <text x="200" y="210" fill="#64748b" fontSize="7" fontFamily="monospace" textAnchor="middle">V_SHARD_03</text>
        <text x="280" y="145" fill="#818cf8" fontSize="7" fontFamily="monospace" textAnchor="middle">SYNTHESIS</text>
        <text x="360" y="142" fill="#22d3ee" fontSize="7" fontFamily="monospace" textAnchor="middle">DET_OUT</text>
      </svg>
    </div>
  );
}

// ── 2. CENTRALIZED DIGITAL WORKSPACE: SLEEK ISOMETRIC INTERACTION GRID ───────
export function WorkspaceVisual() {
  return (
    <div className="relative w-full h-full min-h-[220px] flex items-center justify-center overflow-hidden pointer-events-none bg-[#050B0B]/50">
      {/* Background Ambient glows */}
      <div className="absolute w-64 h-64 rounded-full bg-emerald-500/8 blur-[85px] -bottom-10 -left-12" />
      <div className="absolute w-72 h-72 rounded-full bg-teal-500/10 blur-[90px] -top-12 -right-12" />

      {/* 3D Rotated Isometric CSS Layout */}
      <div 
        style={{
          transform: "rotateX(52deg) rotateY(0deg) rotateZ(-38deg) translateZ(0)",
          transformStyle: "preserve-3d",
        }}
        className="relative w-[300px] h-[300px] md:w-[340px] md:h-[340px] flex items-center justify-center z-10"
      >
        {/* Layer 1: System Base Grid (Deepest) */}
        <div 
          style={{
            transform: "translateZ(-30px)",
            transformStyle: "preserve-3d",
          }}
          className="absolute w-[90%] h-[90%] rounded-2xl border border-white/5 bg-black/60 backdrop-blur-sm p-4 flex flex-col justify-between"
        >
          <div className="absolute inset-0 bg-grid-white/[0.015] bg-[size:15px_15px] rounded-2xl" />
          <div className="flex justify-between items-center relative z-10">
            <span className="font-mono text-[7px] text-neutral-500 uppercase tracking-widest">RailNet_Database // Node_09</span>
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/60" />
          </div>
          
          <div className="grid grid-cols-6 gap-1 relative z-10">
            {Array.from({ length: 18 }).map((_, i) => (
              <div 
                key={i} 
                className={`h-2 rounded-[1px] border border-white/5 ${
                  i % 4 === 0 ? "bg-emerald-500/20 border-emerald-500/30" : "bg-white/5"
                }`} 
              />
            ))}
          </div>
        </div>

        {/* Layer 2: Main Operational Dashboard Grid (Middle) */}
        <div 
          style={{
            transform: "translateZ(10px)",
            transformStyle: "preserve-3d",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)",
          }}
          className="absolute w-[85%] h-[85%] rounded-2xl border border-emerald-500/20 bg-[#090F0E]/70 backdrop-blur-md p-4 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-neutral-800" />
              <span className="w-2 h-2 rounded-full bg-neutral-800" />
              <span className="w-2 h-2 rounded-full bg-emerald-500/60" />
            </div>
            <span className="font-mono text-[7px] text-emerald-400 tracking-wider font-bold">OPERATIONS.BLW</span>
          </div>

          <div className="my-3 space-y-2">
            {/* System metric bar 1 */}
            <div className="space-y-1">
              <div className="flex justify-between text-[7px] font-mono text-neutral-400">
                <span>INTRANET_SYNC</span>
                <span className="text-emerald-400 font-bold">98.2%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "98.2%" }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" 
                />
              </div>
            </div>

            {/* System metric bar 2 */}
            <div className="space-y-1">
              <div className="flex justify-between text-[7px] font-mono text-neutral-400">
                <span>DIRECTORY_RBAC</span>
                <span className="text-teal-400 font-bold">15,482 USERS</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  transition={{ duration: 1.5, delay: 0.7 }}
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-400" 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-[7px] font-mono text-neutral-500 border-t border-white/5 pt-2">
            <span>PING: 42ms</span>
            <span className="text-emerald-500 bg-emerald-500/10 px-1 py-0.5 rounded font-bold">LTS_STABLE</span>
          </div>
        </div>

        {/* Layer 3: High Priority Alert Panel (Top Overlay) */}
        <motion.div 
          style={{
            transform: "translateZ(50px)",
            transformStyle: "preserve-3d",
            boxShadow: "0 15px 30px rgba(0,0,0,0.9)",
          }}
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-[55%] h-[35%] right-2 top-2 rounded-xl border border-teal-500/30 bg-[#0c1413]/80 backdrop-blur-md p-3 flex flex-col justify-between"
        >
          <div className="flex justify-between items-center">
            <span className="font-mono text-[7px] text-teal-300 font-bold uppercase tracking-wider">Oracle_Gateway</span>
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-ping" />
          </div>
          <p className="font-mono text-[8px] text-neutral-400 leading-normal">
            DATA_TUNNEL: ACTIVE<br/>
            FLOW_RATE: 1.2 GB/s
          </p>
          <div className="h-1 w-full bg-teal-500/20 rounded overflow-hidden">
            <div className="h-full bg-teal-400 w-3/4 animate-pulse" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ── 3. PINK-BROCCOLI: MINI UI ABSTRACTION WITH BEZIER GRAPHIC & MESH GRID ────
export function BroccoliVisual() {
  return (
    <div className="relative w-full h-full min-h-[220px] flex items-center justify-center overflow-hidden pointer-events-none bg-[#09050A]/50">
      <motion.div 
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.15),rgba(217,70,239,0.1),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.12),rgba(236,72,153,0.08),transparent_50%)]"
      />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />

      <motion.div
        animate={{
          y: [0, -6, 0],
          rotate: [0.5, -0.5, 0.5]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative w-[85%] h-[80%] max-w-[340px] max-h-[220px] rounded-2xl border border-white/10 bg-[#09090f]/75 backdrop-blur-md shadow-2xl p-4 flex flex-col justify-between z-10"
      >
        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
          <div className="flex gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500/60" />
            <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500/60" />
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500/60" />
          </div>
          <span className="font-mono text-[7px] text-pink-400 tracking-wider">pink-broccoli.systems</span>
        </div>

        <div className="flex-1 w-full relative flex items-center justify-center my-2">
          <svg className="w-full h-full max-h-[110px]" viewBox="0 0 280 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="broccoliGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="50%" stopColor="#d946ef" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
              <filter id="broccoliGlow" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <motion.path 
              d="M 10 70 C 80 10, 150 90, 270 30" 
              stroke="url(#broccoliGrad)" 
              strokeWidth="2.5" 
              strokeLinecap="round"
              filter="url(#broccoliGlow)"
              animate={{
                d: [
                  "M 10 70 C 80 10, 150 90, 270 30",
                  "M 10 60 C 90 30, 130 70, 270 40",
                  "M 10 70 C 80 10, 150 90, 270 30"
                ]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            <motion.path 
              d="M 10 40 C 90 80, 180 10, 270 80" 
              stroke="#f97316" 
              strokeWidth="1" 
              strokeDasharray="4 4"
              opacity="0.6"
              animate={{
                d: [
                  "M 10 40 C 90 80, 180 10, 270 80",
                  "M 10 50 C 70 60, 190 30, 270 60",
                  "M 10 40 C 90 80, 180 10, 270 80"
                ]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />

            <circle cx="85" cy="45" r="4.5" fill="#09090f" stroke="#ec4899" strokeWidth="2.5" />
            <circle cx="178" cy="48" r="4.5" fill="#09090f" stroke="#d946ef" strokeWidth="2.5" />
          </svg>
        </div>

        <div className="flex justify-between items-center text-[7px] font-mono text-neutral-500">
          <span>FPS: 120 / GPU</span>
          <span className="text-pink-400 font-bold uppercase tracking-wider">UI_VELOCITY_VERIFIED</span>
        </div>
      </motion.div>
    </div>
  );
}

// ── 4. CORE STACK VISUAL: INTERCONNECTED FLOATING CLOUDS ────────────────────
export function CoreStackVisual() {
  return (
    <div className="relative w-full h-full min-h-[220px] flex items-center justify-center overflow-hidden pointer-events-none bg-[#07070F]/50">
      <div className="absolute w-64 h-64 rounded-full bg-purple-500/8 blur-[80px] -top-12 -left-12 animate-pulse" />
      <div className="absolute w-64 h-64 rounded-full bg-blue-500/8 blur-[80px] -bottom-12 -right-12" />

      <svg className="w-[85%] h-[85%] max-w-[380px] z-10" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <style>
            {`
              .stack-link {
                stroke-dasharray: 5 10;
                animation: dashFlow 1.2s linear infinite;
              }
              @keyframes dashFlow {
                to {
                  stroke-dashoffset: -15;
                }
              }
            `}
          </style>
        </defs>

        {/* Link paths */}
        <path d="M 70 100 L 150 60" stroke="#c084fc" strokeWidth="1.5" className="stack-link" />
        <path d="M 70 100 L 150 140" stroke="#6366f1" strokeWidth="1.5" className="stack-link" />
        <path d="M 150 60 L 230 100" stroke="#c084fc" strokeWidth="1.5" className="stack-link" />
        <path d="M 150 140 L 230 100" stroke="#6366f1" strokeWidth="1.5" className="stack-link" />

        {/* Next.js Node (Left) */}
        <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
          <circle cx="70" cy="100" r="22" fill="#09090e" stroke="#c084fc" strokeWidth="2.5" />
          <text x="70" y="103" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Next.js</text>
        </motion.g>

        {/* Python Backend Node (Top) */}
        <motion.g animate={{ y: [0, 4, 0] }} transition={{ duration: 4, delay: 0.8, repeat: Infinity, ease: "easeInOut" }}>
          <circle cx="150" cy="60" r="20" fill="#09090e" stroke="#6366f1" strokeWidth="2" />
          <text x="150" y="63" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Python</text>
        </motion.g>

        {/* FastAPI Node (Bottom) */}
        <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 4, delay: 1.6, repeat: Infinity, ease: "easeInOut" }}>
          <circle cx="150" cy="140" r="20" fill="#09090e" stroke="#818cf8" strokeWidth="2" />
          <text x="150" y="143" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">FastAPI</text>
        </motion.g>

        {/* C++ Compute Core Node (Right) */}
        <motion.g animate={{ y: [0, 4, 0] }} transition={{ duration: 4, delay: 2.4, repeat: Infinity, ease: "easeInOut" }}>
          <circle cx="230" cy="100" r="22" fill="#09090e" stroke="#c084fc" strokeWidth="2.5" />
          <text x="230" y="103" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">C++</text>
        </motion.g>
      </svg>
    </div>
  );
}
