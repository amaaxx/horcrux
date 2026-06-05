"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

// ── 1. GROUND TRUTH ENGINE: DETAILED VECTOR DB / SEMANTIC NODE GRAPH ──────────
export function GroundTruthVisual() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const isLineActive = (fromNode: string, toNode: string) => {
    if (!hoveredNode) return true; // Default state: all active
    return hoveredNode === fromNode || hoveredNode === toNode;
  };

  const getLineOpacity = (fromNode: string, toNode: string) => {
    if (!hoveredNode) return 0.45;
    return isLineActive(fromNode, toNode) ? 0.9 : 0.12;
  };

  const getLineStroke = (fromNode: string, toNode: string) => {
    if (isLineActive(fromNode, toNode) && hoveredNode) {
      return "rgba(255, 255, 255, 0.85)";
    }
    return "url(#monoGrad)";
  };

  const getLineStrokeWidth = (fromNode: string, toNode: string) => {
    return isLineActive(fromNode, toNode) && hoveredNode ? 2.2 : 1.2;
  };

  return (
    <div className="relative w-full h-full min-h-[220px] flex items-center justify-center overflow-hidden bg-[#080808]/50">
      {/* Background Cinematic Glows */}
      <div className="absolute w-64 h-64 rounded-full bg-white/[0.015] blur-[80px] -top-12 -left-12" />
      <div className="absolute w-72 h-72 rounded-full bg-white/[0.025] blur-[90px] -bottom-16 -right-16 animate-pulse" />
      
      {/* High-Fidelity Network Graph SVG */}
      <svg 
        className="w-[90%] h-[90%] max-w-[420px] max-h-[300px] z-10 pointer-events-auto" 
        viewBox="0 0 400 240" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="monoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.6)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.12)" />
          </linearGradient>
          <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.85)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.3)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.85)" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <style>
            {`
              .path-flow-fast {
                stroke-dasharray: 6 12;
                animation: flowOffset 0.9s linear infinite;
              }
              .path-flow-slow {
                stroke-dasharray: 8 16;
                animation: flowOffset 2.2s linear infinite;
              }
              .pulse-ring {
                animation: ringGrow 3.2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
              }
              @keyframes flowOffset {
                to {
                  stroke-dashoffset: -24;
                }
              }
              @keyframes ringGrow {
                0% {
                  transform: scale(0.65);
                  opacity: 0.6;
                }
                100% {
                  transform: scale(2.0);
                  opacity: 0;
                }
              }
            `}
          </style>
        </defs>

        {/* Connections */}
        <path d="M 40 120 L 120 120" stroke={getLineStroke("IN_QUERY", "SEM_ROUTER")} strokeWidth={getLineStrokeWidth("IN_QUERY", "SEM_ROUTER")} className="path-flow-fast" opacity={getLineOpacity("IN_QUERY", "SEM_ROUTER")} />
        <path d="M 40 120 L 120 120" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="0.5" opacity={hoveredNode ? (isLineActive("IN_QUERY", "SEM_ROUTER") ? 0.5 : 0.08) : 0.35} />

        <path d="M 120 120 C 150 120, 150 60, 200 60" stroke={getLineStroke("SEM_ROUTER", "V_SHARD_01")} strokeWidth={getLineStrokeWidth("SEM_ROUTER", "V_SHARD_01")} className="path-flow-fast" opacity={getLineOpacity("SEM_ROUTER", "V_SHARD_01")} />
        <path d="M 120 120 L 200 120" stroke={getLineStroke("SEM_ROUTER", "V_SHARD_02")} strokeWidth={getLineStrokeWidth("SEM_ROUTER", "V_SHARD_02")} className="path-flow-slow" opacity={getLineOpacity("SEM_ROUTER", "V_SHARD_02")} />
        <path d="M 120 120 C 150 120, 150 180, 200 180" stroke={getLineStroke("SEM_ROUTER", "V_SHARD_03")} strokeWidth={getLineStrokeWidth("SEM_ROUTER", "V_SHARD_03")} className="path-flow-fast" opacity={getLineOpacity("SEM_ROUTER", "V_SHARD_03")} />

        {/* DB Shards to Context Synthesis */}
        <path d="M 200 60 C 250 60, 250 120, 280 120" stroke={getLineStroke("V_SHARD_01", "SYNTHESIS")} strokeWidth={getLineStrokeWidth("V_SHARD_01", "SYNTHESIS")} className="path-flow-slow" opacity={getLineOpacity("V_SHARD_01", "SYNTHESIS")} />
        <path d="M 200 120 L 280 120" stroke={getLineStroke("V_SHARD_02", "SYNTHESIS")} strokeWidth={getLineStrokeWidth("V_SHARD_02", "SYNTHESIS")} className="path-flow-fast" opacity={getLineOpacity("V_SHARD_02", "SYNTHESIS")} />
        <path d="M 200 180 C 250 180, 250 120, 280 120" stroke={getLineStroke("V_SHARD_03", "SYNTHESIS")} strokeWidth={getLineStrokeWidth("V_SHARD_03", "SYNTHESIS")} className="path-flow-slow" opacity={getLineOpacity("V_SHARD_03", "SYNTHESIS")} />

        <path d="M 280 120 L 360 120" stroke={getLineStroke("SYNTHESIS", "DET_OUT")} strokeWidth={getLineStrokeWidth("SYNTHESIS", "DET_OUT")} className="path-flow-fast" opacity={getLineOpacity("SYNTHESIS", "DET_OUT")} />
        <path d="M 280 120 L 360 120" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="0.5" opacity={hoveredNode ? (isLineActive("SYNTHESIS", "DET_OUT") ? 0.6 : 0.08) : 0.4} />

        {/* Animated flowing data packets */}
        <g opacity={hoveredNode ? 0.22 : 0.85}>
          {/* Input to Router */}
          <circle r="3" fill="rgba(255,255,255,0.7)" filter="url(#glow)">
            <animateMotion path="M 40 120 L 120 120" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <circle r="1.5" fill="rgba(255,255,255,0.95)">
            <animateMotion path="M 40 120 L 120 120" dur="1.2s" begin="0.6s" repeatCount="indefinite" />
          </circle>

          {/* Router to DB Shards */}
          <circle r="3" fill="rgba(255,255,255,0.5)" filter="url(#glow)">
            <animateMotion path="M 120 120 C 150 120, 150 60, 200 60" dur="1.6s" repeatCount="indefinite" />
          </circle>
          <circle r="3" fill="rgba(255,255,255,0.7)" filter="url(#glow)">
            <animateMotion path="M 120 120 L 200 120" dur="1.4s" repeatCount="indefinite" />
          </circle>
          <circle r="3" fill="rgba(255,255,255,0.5)" filter="url(#glow)">
            <animateMotion path="M 120 120 C 150 120, 150 180, 200 180" dur="1.8s" repeatCount="indefinite" />
          </circle>

          {/* DB Shards to Context Synthesis */}
          <circle r="3" fill="rgba(255,255,255,0.5)" filter="url(#glow)">
            <animateMotion path="M 200 60 C 250 60, 250 120, 280 120" dur="1.6s" repeatCount="indefinite" />
          </circle>
          <circle r="3" fill="rgba(255,255,255,0.7)" filter="url(#glow)">
            <animateMotion path="M 200 120 L 280 120" dur="1.4s" repeatCount="indefinite" />
          </circle>
          <circle r="3" fill="rgba(255,255,255,0.5)" filter="url(#glow)">
            <animateMotion path="M 200 180 C 250 180, 250 120, 280 120" dur="1.8s" repeatCount="indefinite" />
          </circle>

          {/* Synthesis to Output */}
          <circle r="3.5" fill="rgba(255,255,255,0.75)" filter="url(#glow)">
            <animateMotion path="M 280 120 L 360 120" dur="1.2s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Pulsing rings around key nodes */}
        <circle cx="120" cy="120" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="1" className="pulse-ring" style={{ transformOrigin: "120px 120px", animationDelay: "0s" }} />
        <circle cx="280" cy="120" r="10" stroke="rgba(255,255,255,0.18)" strokeWidth="1" className="pulse-ring" style={{ transformOrigin: "280px 120px", animationDelay: "0.5s" }} />

        {/* Input Query Node */}
        <g 
          className="cursor-pointer" 
          onMouseEnter={() => setHoveredNode("IN_QUERY")} 
          onMouseLeave={() => setHoveredNode(null)}
          opacity={hoveredNode ? (hoveredNode === "IN_QUERY" ? 1 : 0.4) : 1}
        >
          <circle cx="40" cy="120" r="10" fill="transparent" />
          <circle cx="40" cy="120" r="7" fill="#09090e" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
          <circle cx="40" cy="120" r="3" fill="rgba(255,255,255,0.85)" />
        </g>

        {/* Semantic Router Node */}
        <g 
          className="cursor-pointer" 
          onMouseEnter={() => setHoveredNode("SEM_ROUTER")} 
          onMouseLeave={() => setHoveredNode(null)}
          opacity={hoveredNode ? (hoveredNode === "SEM_ROUTER" ? 1 : 0.4) : 1}
        >
          <motion.circle 
            cx="120" 
            cy="120" 
            r="10" 
            fill="#09090e" 
            stroke="url(#monoGrad)" 
            strokeWidth="2.2"
            filter="url(#glow)"
            animate={{ strokeWidth: [2.2, 3.5, 2.2] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle cx="120" cy="120" r="4" fill="#ffffff" />
        </g>

        {/* Vector DB Nodes */}
        {[60, 120, 180].map((y, idx) => {
          const nodeId = `V_SHARD_0${idx + 1}`;
          return (
            <g 
              key={y}
              className="cursor-pointer" 
              onMouseEnter={() => setHoveredNode(nodeId)} 
              onMouseLeave={() => setHoveredNode(null)}
              opacity={hoveredNode ? (nodeId === hoveredNode ? 1 : 0.4) : 1}
            >
              <circle cx="200" cy={y} r="12" fill="transparent" />
              <circle cx="200" cy={y} r="8" fill="#09090e" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
              <motion.circle 
                cx="200" 
                cy={y} 
                r="3" 
                fill="rgba(255,255,255,0.75)"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, delay: idx * 0.4, repeat: Infinity, ease: "easeInOut" }}
              />
            </g>
          );
        })}

        {/* Context Synthesis Node */}
        <g 
          className="cursor-pointer" 
          onMouseEnter={() => setHoveredNode("SYNTHESIS")} 
          onMouseLeave={() => setHoveredNode(null)}
          opacity={hoveredNode ? (hoveredNode === "SYNTHESIS" ? 1 : 0.4) : 1}
        >
          <motion.circle 
            cx="280" 
            cy="120" 
            r="11" 
            fill="#09090e" 
            stroke="url(#monoGrad)" 
            strokeWidth="2.2"
            filter="url(#glow)"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle cx="280" cy="120" r="4" fill="rgba(255,255,255,0.85)" />
        </g>

        {/* Generation Output Node */}
        <g 
          className="cursor-pointer" 
          onMouseEnter={() => setHoveredNode("DET_OUT")} 
          onMouseLeave={() => setHoveredNode(null)}
          opacity={hoveredNode ? (hoveredNode === "DET_OUT" ? 1 : 0.4) : 1}
        >
          <circle cx="360" cy="120" r="10" fill="transparent" />
          <circle cx="360" cy="120" r="7" fill="#09090e" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
          <circle cx="360" cy="120" r="3" fill="rgba(255,255,255,0.85)" />
        </g>

        <text x="40" y="142" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="monospace" textAnchor="middle" opacity={hoveredNode ? 0.35 : 0.6}>IN_QUERY</text>
        <text x="120" y="145" fill="rgba(255,255,255,0.6)" fontSize="7" fontFamily="monospace" textAnchor="middle" fontWeight="bold" opacity={hoveredNode ? 0.35 : 0.85}>SEM_ROUTER</text>
        <text x="200" y="42" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="monospace" textAnchor="middle" opacity={hoveredNode ? 0.35 : 0.6}>V_SHARD_01</text>
        <text x="200" y="210" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="monospace" textAnchor="middle" opacity={hoveredNode ? 0.35 : 0.6}>V_SHARD_03</text>
        <text x="280" y="145" fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily="monospace" textAnchor="middle" opacity={hoveredNode ? 0.35 : 0.6}>SYNTHESIS</text>
        <text x="360" y="142" fill="rgba(255,255,255,0.5)" fontSize="7" fontFamily="monospace" textAnchor="middle" opacity={hoveredNode ? 0.35 : 0.6}>DET_OUT</text>
      </svg>
    </div>
  );
}

// ── 2. CENTRALIZED DIGITAL WORKSPACE: SLEEK ISOMETRIC INTERACTION GRID ───────
export function WorkspaceVisual() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-full min-h-[220px] flex items-center justify-center overflow-hidden bg-[#080808]/50 pointer-events-auto cursor-pointer"
    >
      {/* Background Ambient glows */}
      <div className="absolute w-64 h-64 rounded-full bg-white/[0.015] blur-[85px] -bottom-10 -left-12" />
      <div className="absolute w-72 h-72 rounded-full bg-white/[0.025] blur-[90px] -top-12 -right-12" />

      {/* 3D Rotated Isometric CSS Layout */}
      <div 
        style={{
          transform: isHovered 
            ? "rotateX(52deg) rotateY(0deg) rotateZ(-38deg) scale(1.05) translateZ(0)"
            : "rotateX(52deg) rotateY(0deg) rotateZ(-38deg) translateZ(0)",
          transformStyle: "preserve-3d",
          transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
        className="relative w-[300px] h-[300px] md:w-[340px] md:h-[340px] flex items-center justify-center z-10"
      >
        {/* Layer 1: System Base Grid (Deepest) */}
        <motion.div 
          style={{
            transformStyle: "preserve-3d",
          }}
          animate={{
            transform: isHovered ? "translateZ(-55px)" : "translateZ(-30px)",
            borderColor: isHovered ? "rgba(255, 255, 255, 0.18)" : "rgba(255, 255, 255, 0.05)"
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute w-[90%] h-[90%] rounded-2xl bg-black/60 backdrop-blur-sm p-4 flex flex-col justify-between border"
        >
          <div className="absolute inset-0 bg-grid-white/[0.015] bg-[size:15px_15px] rounded-2xl" />
          <div className="flex justify-between items-center relative z-10">
            <span className="font-mono text-[7px] text-neutral-500 uppercase tracking-widest">RailNet_Database // Node_09</span>
            <div className={`h-1.5 w-1.5 rounded-full ${isHovered ? "bg-white animate-ping" : "bg-white/40"}`} />
          </div>
          
          <div className="grid grid-cols-6 gap-1 relative z-10">
            {Array.from({ length: 18 }).map((_, i) => (
              <div 
                key={i} 
                className={`h-2 rounded-[1px] border border-white/5 ${
                  i % 4 === 0 ? "bg-white/10 border-white/20" : "bg-white/5"
                }`} 
              />
            ))}
          </div>
        </motion.div>

        {/* Layer 2: Main Operational Dashboard Grid (Middle) */}
        <motion.div 
          style={{
            transformStyle: "preserve-3d",
          }}
          animate={{
            transform: isHovered ? "translateZ(15px)" : "translateZ(10px)",
            boxShadow: isHovered ? "0 35px 65px -12px rgba(0,0,0,0.9)" : "0 25px 50px -12px rgba(0,0,0,0.8)",
            borderColor: isHovered ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.08)",
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute w-[85%] h-[85%] rounded-2xl border bg-[#0a0a0a]/80 backdrop-blur-md p-4 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-neutral-800" />
              <span className="w-2 h-2 rounded-full bg-neutral-800" />
              <span className="w-2 h-2 rounded-full bg-white/30" />
            </div>
            <span className="font-mono text-[7px] text-neutral-400 tracking-wider font-bold">OPERATIONS.BLW</span>
          </div>

          <div className="my-3 space-y-2">
            {/* System metric bar 1 */}
            <div className="space-y-1">
              <div className="flex justify-between text-[7px] font-mono text-neutral-400">
                <span>INTRANET_SYNC</span>
                <span className="text-white/60 font-bold">98.2%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "98.2%" }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="h-full bg-white/50" 
                />
              </div>
            </div>

            {/* System metric bar 2 */}
            <div className="space-y-1">
              <div className="flex justify-between text-[7px] font-mono text-neutral-400">
                <span>DIRECTORY_RBAC</span>
                <span className="text-white/50 font-bold">15,482 USERS</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  transition={{ duration: 1.5, delay: 0.7 }}
                  className="h-full bg-white/30" 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-[7px] font-mono text-neutral-500 border-t border-white/5 pt-2">
            <span>PING: 42ms</span>
            <span className="text-neutral-300 bg-white/5 px-1 py-0.5 rounded font-bold">LTS_STABLE</span>
          </div>
        </motion.div>

        {/* Layer 3: High Priority Alert Panel (Top Overlay) */}
        <motion.div 
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-[55%] h-[35%] right-2 top-2 z-25"
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div 
            style={{
              transformStyle: "preserve-3d",
            }}
            animate={{
              transform: isHovered ? "translateZ(85px)" : "translateZ(50px)",
              boxShadow: isHovered ? "0 25px 45px rgba(0,0,0,0.95)" : "0 15px 30px rgba(0,0,0,0.9)",
              borderColor: isHovered ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.12)",
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full rounded-xl border bg-black/90 backdrop-blur-md p-3 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <span className="font-mono text-[7px] text-neutral-300 font-bold uppercase tracking-wider">Oracle_Gateway</span>
              <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-ping" />
            </div>
            <p className="font-mono text-[8px] text-neutral-400 leading-normal">
              DATA_TUNNEL: ACTIVE<br/>
              FLOW_RATE: 1.2 GB/s
            </p>
            <div className="h-1 w-full bg-white/10 rounded overflow-hidden">
              <div className="h-full bg-white/45 w-3/4 animate-pulse" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// ── 3. PINK-BROCCOLI: MINI UI ABSTRACTION WITH BEZIER GRAPHIC & MESH GRID ────
export function BroccoliVisual() {
  const [mousePos, setMousePos] = useState({ x: 140, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    setMousePos({
      x: (px / (rect.width || 1)) * 280,
      y: (py / (rect.height || 1)) * 100,
    });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-full min-h-[220px] flex items-center justify-center overflow-hidden bg-[#080808]/50 pointer-events-auto cursor-pointer"
    >
      <motion.div 
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.02),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.015),transparent_50%)]"
      />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />

      <motion.div
        animate={{
          y: [0, -5, 0],
          rotate: [0.4, -0.4, 0.4]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative w-[85%] h-[80%] max-w-[340px] max-h-[220px] rounded-2xl border border-white/10 bg-[#09090f]/80 backdrop-blur-md shadow-2xl p-4 flex flex-col justify-between z-10"
      >
        <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
          <div className="flex gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/35" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/15" />
          </div>
          <span className="font-mono text-[7px] text-neutral-400 tracking-wider">broccoli.systems</span>
        </div>

        <div className="flex-1 w-full relative flex items-center justify-center my-2">
          <svg className="w-full h-full max-h-[110px]" viewBox="0 0 280 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="broccoliGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.85)" />
                <stop offset="50%" stopColor="rgba(255, 255, 255, 0.35)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0.85)" />
              </linearGradient>
              <filter id="broccoliGlow" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Dynamic magnetic cursor trace node and lines */}
            {isHovered && (
              <>
                <line x1="85" y1="45" x2={mousePos.x} y2={mousePos.y} stroke="rgba(255,255,255,0.2)" strokeWidth="0.75" strokeDasharray="3 3" />
                <line x1="178" y1="48" x2={mousePos.x} y2={mousePos.y} stroke="rgba(255,255,255,0.15)" strokeWidth="0.75" strokeDasharray="3 3" />
                <circle cx={mousePos.x} cy={mousePos.y} r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" className="animate-pulse" />
                <circle cx={mousePos.x} cy={mousePos.y} r="2.5" fill="#ffffff" />
              </>
            )}

            <motion.path 
              d="M 10 70 C 80 10, 150 90, 270 30"
              animate={{ 
                d: isHovered 
                  ? `M 10 70 C ${mousePos.x} ${mousePos.y}, 150 90, 270 30` 
                  : "M 10 70 C 80 10, 150 90, 270 30"
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              stroke="url(#broccoliGrad)" 
              strokeWidth="2" 
              strokeLinecap="round"
              filter="url(#broccoliGlow)"
            />

            <motion.path 
              d="M 10 40 C 90 80, 180 10, 270 80"
              animate={{ 
                d: isHovered
                  ? `M 10 40 C 90 80, ${mousePos.x} ${mousePos.y}, 270 80`
                  : "M 10 40 C 90 80, 180 10, 270 80"
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
              stroke="rgba(255, 255, 255, 0.25)" 
              strokeWidth="1" 
              strokeDasharray="4 4"
              opacity="0.4"
            />

            <circle cx="85" cy="45" r="4.5" fill="#09090f" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" />
            <circle cx="178" cy="48" r="4.5" fill="#09090f" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" />
          </svg>
        </div>

        <div className="flex justify-between items-center text-[7px] font-mono text-neutral-500">
          <span>FPS: 120 / GPU</span>
          <span className="text-neutral-400 font-bold uppercase tracking-wider">UI_VELOCITY_VERIFIED</span>
        </div>
      </motion.div>
    </div>
  );
}

// ── 4. CORE STACK VISUAL: INTERCONNECTED FLOATING CLOUDS ────────────────────
export function CoreStackVisual() {
  return (
    <div className="relative w-full h-full min-h-[220px] flex items-center justify-center overflow-hidden pointer-events-none bg-[#080808]/50">
      <div className="absolute w-64 h-64 rounded-full bg-white/[0.015] blur-[80px] -top-12 -left-12 animate-pulse" />
      <div className="absolute w-64 h-64 rounded-full bg-white/[0.025] blur-[80px] -bottom-12 -right-12" />

      <svg className="w-[85%] h-[85%] max-w-[380px] z-10" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
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
        <path d="M 70 100 L 150 60" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.2" className="stack-link" />
        <path d="M 70 100 L 150 140" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.2" className="stack-link" />
        <path d="M 150 60 L 230 100" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.2" className="stack-link" />
        <path d="M 150 140 L 230 100" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.2" className="stack-link" />

        {/* Next.js Node (Left) */}
        <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
          <circle cx="70" cy="100" r="22" fill="#09090e" stroke="rgba(255, 255, 255, 0.65)" strokeWidth="2.5" />
          <text x="70" y="103" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Next.js</text>
        </motion.g>

        {/* Python Backend Node (Top) */}
        <motion.g animate={{ y: [0, 4, 0] }} transition={{ duration: 4, delay: 0.8, repeat: Infinity, ease: "easeInOut" }}>
          <circle cx="150" cy="60" r="20" fill="#09090e" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" />
          <text x="150" y="63" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">Python</text>
        </motion.g>

        {/* FastAPI Node (Bottom) */}
        <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 4, delay: 1.6, repeat: Infinity, ease: "easeInOut" }}>
          <circle cx="150" cy="140" r="20" fill="#09090e" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2" />
          <text x="150" y="143" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">FastAPI</text>
        </motion.g>

        {/* C++ Compute Core Node (Right) */}
        <motion.g animate={{ y: [0, 4, 0] }} transition={{ duration: 4, delay: 2.4, repeat: Infinity, ease: "easeInOut" }}>
          <circle cx="230" cy="100" r="22" fill="#09090e" stroke="rgba(255, 255, 255, 0.65)" strokeWidth="2.5" />
          <text x="230" y="103" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">C++</text>
        </motion.g>
      </svg>
    </div>
  );
}
