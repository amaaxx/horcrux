"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface HeroSpotlightProps {
  name?: string;
  subtitle?: string;
  role?: string;
}

export default function HeroSpotlight({
  name = "A M A A N",
  subtitle = "SOFTWARE & SYSTEMS ARCHITECTURE",
  role = "Software Engineer.",
}: HeroSpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  // Mouse Coordinates Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for primary orb (Terracotta)
  const springConfigPrimary = { stiffness: 120, damping: 18, mass: 0.6 };
  const orb1X = useSpring(mouseX, springConfigPrimary);
  const orb1Y = useSpring(mouseY, springConfigPrimary);

  // Spring physics with slight lag for secondary orb (Amber Gold)
  const springConfigSecondary = { stiffness: 80, damping: 22, mass: 0.9 };
  const orb2X = useSpring(mouseX, springConfigSecondary);
  const orb2Y = useSpring(mouseY, springConfigSecondary);

  // Spring physics with counter offset for tertiary orb (Peacock Teal)
  const springConfigTertiary = { stiffness: 60, damping: 26, mass: 1.2 };
  const orb3X = useSpring(mouseX, springConfigTertiary);
  const orb3Y = useSpring(mouseY, springConfigTertiary);

  // Offset mappings for dynamic refraction feel
  const orb2OffsetX = useTransform(orb2X, (v) => v + 60);
  const orb2OffsetY = useTransform(orb2Y, (v) => v - 40);
  const orb3OffsetX = useTransform(orb3X, (v) => v - 70);
  const orb3OffsetY = useTransform(orb3Y, (v) => v + 50);

  useEffect(() => {
    const isTouchDevice =
      typeof window !== "undefined" &&
      ("ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches);
    setIsTouch(Boolean(isTouchDevice));

    // Center initial orbs
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(rect.width / 2);
      mouseY.set(rect.height / 2);
    }
  }, [mouseX, mouseY]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = () => {
    if (!isTouch) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!isTouch) {
      setIsHovered(false);
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(rect.width / 2);
        mouseY.set(rect.height / 2);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-hidden rounded-3xl bg-[#05050A] border border-white/[0.06] p-6 sm:p-10 md:p-16 select-none group cursor-crosshair"
      style={{
        boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 0 20px 50px rgba(0, 0, 0, 0.7)",
      }}
    >
      {/* Structural blueprint watermark line */}
      <div className="absolute top-4 left-6 right-6 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FBCA89] animate-pulse" />
          <span className="font-mono text-[9px] sm:text-[10px] text-[#D5B38E] tracking-[0.25em] uppercase font-semibold">
            {subtitle}
          </span>
        </div>
        <span className="font-mono text-[8px] sm:text-[9px] text-white/30 tracking-widest uppercase hidden sm:block">
          IRIDESCENCE // SPOTLIGHT_SYSTEM
        </span>
      </div>

      {/* ── GLOWING REACTBITS ORBS LAYER (Background) ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Orb 1: Terracotta Red (#88393C) */}
        <motion.div
          style={{
            x: orb1X,
            y: orb1Y,
            translateX: "-50%",
            translateY: "-50%",
            willChange: "transform",
          }}
          animate={
            isTouch
              ? {
                  x: ["35%", "65%", "40%", "35%"],
                  y: ["40%", "60%", "70%", "40%"],
                  transition: { duration: 10, repeat: Infinity, ease: "easeInOut" },
                }
              : {}
          }
          className="absolute w-[260px] h-[260px] sm:w-[360px] sm:h-[360px] rounded-full bg-[#88393C] opacity-75 blur-[85px] sm:blur-[110px]"
        />

        {/* Orb 2: Amber Sun (#FBCA89) / Sandstone Gold */}
        <motion.div
          style={{
            x: isTouch ? orb1X : orb2OffsetX,
            y: isTouch ? orb1Y : orb2OffsetY,
            translateX: "-50%",
            translateY: "-50%",
            willChange: "transform",
          }}
          animate={
            isTouch
              ? {
                  x: ["60%", "30%", "70%", "60%"],
                  y: ["60%", "35%", "50%", "60%"],
                  transition: { duration: 12, repeat: Infinity, ease: "easeInOut" },
                }
              : {}
          }
          className="absolute w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] rounded-full bg-[#FBCA89] opacity-65 blur-[75px] sm:blur-[95px]"
        />

        {/* Orb 3: Peacock Teal (#13737A) */}
        <motion.div
          style={{
            x: isTouch ? orb1X : orb3OffsetX,
            y: isTouch ? orb1Y : orb3OffsetY,
            translateX: "-50%",
            translateY: "-50%",
            willChange: "transform",
          }}
          animate={
            isTouch
              ? {
                  x: ["45%", "60%", "30%", "45%"],
                  y: ["70%", "40%", "30%", "70%"],
                  transition: { duration: 14, repeat: Infinity, ease: "easeInOut" },
                }
              : {}
          }
          className="absolute w-[180px] h-[180px] sm:w-[260px] sm:h-[260px] rounded-full bg-[#13737A] opacity-55 blur-[80px] sm:blur-[105px]"
        />
      </div>

      {/* ── GRID PATTERN TEXTURE (Middle) ── */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:28px_28px] pointer-events-none z-10" />

      {/* ── FOREGROUND CONTENT (Inversion with mix-blend-mode: difference) ── */}
      <div className="relative z-20 flex flex-col justify-center items-center text-center pt-8 pb-4 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col items-center"
        >
          {/* Main Name Heading with mix-blend-mode: difference */}
          <h1
            className="text-white font-black tracking-[0.2em] sm:tracking-[0.32em] uppercase leading-none select-none transition-transform duration-300"
            style={{
              fontSize: "clamp(2.75rem, 9.5vw, 8.5rem)",
              mixBlendMode: "difference",
              textShadow: "0 0 40px rgba(255,255,255,0.15)",
              willChange: "transform",
            }}
          >
            {name}
          </h1>

          <div
            className="mt-3 sm:mt-5 text-[#f0ede8]/90 font-serif italic text-base sm:text-2xl md:text-3xl tracking-wide select-none"
            style={{ mixBlendMode: "difference" }}
          >
            {role}
          </div>
        </motion.div>

        {/* Interactive Indicator Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-6 sm:mt-8 inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-md"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#81D1D0] animate-ping" />
          <span className="font-mono text-[8.5px] sm:text-[9.5px] text-[#f0ede8]/70 tracking-widest uppercase">
            {isHovered ? "SPOTLIGHT // ACTIVE [DIFF_WARP]" : "HOVER_TO_REFRACT // PHYSICAL_BLOW"}
          </span>
        </motion.div>
      </div>

      {/* Subtle corner crosshairs */}
      <span className="absolute bottom-3 left-4 font-mono text-[8px] text-white/20 select-none pointer-events-none">+</span>
      <span className="absolute bottom-3 right-4 font-mono text-[8px] text-white/20 select-none pointer-events-none">+</span>
    </div>
  );
}
