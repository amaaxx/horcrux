"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface TextMaskWindowProps {
  title?: string;
  subtitle?: string;
  manifestoWords?: string[];
  manifestoProgress?: MotionValue<number>;
  children?: React.ReactNode;
}

export default function TextMaskWindow({
  title = "THE PHILOSOPHY",
  subtitle = "CORE MANIFESTO // 2026",
  children,
}: TextMaskWindowProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll parallax mapping strictly relative to this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax Y-axis translation for the background image/artwork
  const bgTranslateY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1.05, 1.25]);
  const bgRotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);

  // Subtle opacity reveal for the masked text container
  const windowOpacity = useTransform(scrollYProgress, [0, 0.25, 0.85, 1], [0.6, 1, 1, 0.6]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-3xl bg-[#05050A] border border-white/[0.08] p-4 sm:p-8 md:p-12 shadow-2xl"
    >
      {/* Top telemetry marker */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#13737A] animate-pulse" />
          <span className="font-mono text-[9px] sm:text-[10px] text-[#D5B38E] tracking-[0.25em] uppercase font-semibold">
            {subtitle}
          </span>
        </div>
        <span className="font-mono text-[8px] sm:text-[9px] text-white/30 tracking-widest uppercase">
          REACTBITS // TEXT_MASK_WINDOW
        </span>
      </div>

      {/* ── MASSIVE SVG TEXT MASK WINDOW ── */}
      <motion.div
        style={{ opacity: windowOpacity }}
        className="relative w-full h-[140px] sm:h-[220px] md:h-[300px] lg:h-[360px] overflow-hidden rounded-2xl border border-white/[0.05] bg-[#020205]"
      >
        {/* PARALLAX VISUAL CANVAS BEHIND THE MASK */}
        <motion.div
          style={{
            y: bgTranslateY,
            scale: bgScale,
            rotate: bgRotate,
            willChange: "transform",
          }}
          className="absolute -inset-[30%] w-[160%] h-[160%] pointer-events-none"
        >
          {/* Layered Architectural Heritage Gradients & Shapes */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#13737A] via-[#88393C] to-[#FBCA89] opacity-85" />
          
          {/* Architectural geometric grid pattern overlay */}
          <div className="absolute inset-0 bg-grid-white/[0.15] bg-[size:40px_40px] mix-blend-overlay" />
          
          {/* Glowing Radial Accents */}
          <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] rounded-full bg-[#81D1D0] opacity-60 blur-[60px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#CDAA4B] opacity-50 blur-[70px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#004437] opacity-60 blur-[80px]" />

          {/* Abstract SVG Schematic Wireframe Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-30 mix-blend-screen" viewBox="0 0 1000 600" fill="none">
            <line x1="0" y1="100" x2="1000" y2="500" stroke="#FBCA89" strokeWidth="2" strokeDasharray="6 6" />
            <line x1="0" y1="500" x2="1000" y2="100" stroke="#81D1D0" strokeWidth="2" strokeDasharray="8 8" />
            <circle cx="500" cy="300" r="180" stroke="#f0ede8" strokeWidth="1.5" />
            <circle cx="500" cy="300" r="260" stroke="#f0ede8" strokeWidth="0.75" strokeDasharray="4 4" />
          </svg>
        </motion.div>

        {/* ── SVG CUTOUT MASK LAYER (Masks out everything except the text) ── */}
        <svg
          className="absolute inset-0 w-full h-full select-none pointer-events-none"
          viewBox="0 0 1200 280"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <mask id="philosophy-mask" x="0" y="0" width="1200" height="280" maskUnits="userSpaceOnUse">
              {/* White background: hides the background image */}
              <rect x="0" y="0" width="1200" height="280" fill="black" />
              {/* White text: punches through the mask, letting the parallax image shine through */}
              <text
                x="50%"
                y="62%"
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                className="font-black tracking-[-0.03em]"
                style={{
                  fontSize: "148px",
                  fontWeight: 900,
                  fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
                }}
              >
                {title}
              </text>
            </mask>
          </defs>

          {/* Dark Solid Base covering the viewport, cut out by the mask */}
          <rect
            x="0"
            y="0"
            width="1200"
            height="280"
            fill="#05050A"
            mask="url(#philosophy-mask)"
          />

          {/* Alternative direct SVG text clipping for maximum cross-browser fidelity */}
          <clipPath id="philosophy-clip">
            <text
              x="50%"
              y="60%"
              textAnchor="middle"
              dominantBaseline="central"
              className="font-black tracking-[-0.02em]"
              style={{
                fontSize: "146px",
                fontWeight: 900,
                fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
              }}
            >
              {title}
            </text>
          </clipPath>
        </svg>

        {/* Secondary CSS background-clip fallback container for high-DPI crystal crispness */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10"
        >
          <motion.h2
            style={{
              y: bgTranslateY,
              willChange: "transform",
              fontSize: "clamp(2.5rem, 9.2vw, 9.5rem)",
              backgroundImage: "radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(213,179,142,0.8) 50%, rgba(19,115,122,0.7) 100%)",
              mixBlendMode: "overlay",
              opacity: 0.35,
            }}
            className="w-full text-center font-black tracking-tighter uppercase leading-none text-transparent bg-clip-text"
          >
            {title}
          </motion.h2>
        </div>

        {/* Framing border hairline */}
        <div className="absolute inset-0 rounded-2xl border border-white/[0.08] pointer-events-none z-20" />
      </motion.div>

      {/* ── MANIFESTO WORDS / CONTENT INSERTION (Fading in smoothly below) ── */}
      {children && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 sm:mt-12 w-full max-w-4xl mx-auto"
        >
          {children}
        </motion.div>
      )}

      {/* Bottom decorative telemetry */}
      <div className="mt-8 pt-4 border-t border-white/[0.05] flex items-center justify-between text-white/30 font-mono text-[8px] sm:text-[9px]">
        <div className="flex items-center gap-2">
          <span>PARALLAX_DEPTH: -20% ➔ +20%</span>
          <span>//</span>
          <span>GPU_ACCELERATED</span>
        </div>
        <span>ARCHITECTURAL_MANIFESTO</span>
      </div>
    </div>
  );
}
