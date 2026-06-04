"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);

  // Motion values mapped directly to cursor position
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // High-performance spring alignment running on the GPU
  const springX = useSpring(mouseX, { stiffness: 450, damping: 28, mass: 0.2 });
  const springY = useSpring(mouseY, { stiffness: 450, damping: 28, mass: 0.2 });
  
  // Spring to smooth out physical sizing adjustment (prevents text blurring)
  const cursorSize = useSpring(isHovered ? (cursorLabel ? 80 : 54) : 12, {
    stiffness: 320,
    damping: 24,
  });

  // Track cursor velocity on screen
  const velX = useVelocity(springX);
  const velY = useVelocity(springY);

  const smoothVelX = useSpring(velX, { stiffness: 180, damping: 30 });
  const smoothVelY = useSpring(velY, { stiffness: 180, damping: 30 });

  // Map speed to physical scale stretch
  const cursorScaleX = useTransform([smoothVelX, smoothVelY], ([vx, vy]) => {
    const speed = Math.hypot(vx as number, vy as number);
    return Math.min(1 + speed / 1200, 1.85);
  });

  const cursorScaleY = useTransform([smoothVelX, smoothVelY], ([vx, vy]) => {
    const speed = Math.hypot(vx as number, vy as number);
    return Math.max(1 - speed / 2400, 0.55);
  });

  // Map direction of motion to rotation angle
  const cursorAngle = useTransform([smoothVelX, smoothVelY], ([vx, vy]) => {
    const angleRad = Math.atan2(vy as number, vx as number);
    return angleRad * (180 / Math.PI);
  });

  useEffect(() => {
    // Check if the user device features hover capabilities
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mediaQuery.matches) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseLeaveWindow = () => setIsVisible(false);
    const handleMouseEnterWindow = () => setIsVisible(true);

    // Global event delegation for interaction states
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const hoverEl = target.closest("[data-cursor-label]");
      if (hoverEl) {
        setCursorLabel(hoverEl.getAttribute("data-cursor-label"));
        setIsHovered(true);
        return;
      }

      const isInteractive = 
          target.tagName === "A" || 
          target.tagName === "BUTTON" || 
          target.closest("a") || 
          target.closest("button") || 
          target.closest('[data-cursor="pointer"]') || 
          target.closest('[data-cursor="magnetic"]') || 
          target.getAttribute("role") === "button";

      setCursorLabel(null);
      setIsHovered(!!isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeaveWindow);
    document.addEventListener("mouseenter", handleMouseEnterWindow);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeaveWindow);
      document.removeEventListener("mouseenter", handleMouseEnterWindow);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:flex items-center justify-center"
      style={{
        x: springX,
        y: springY,
        width: cursorSize,
        height: cursorSize,
        translateX: "-50%",
        translateY: "-50%",
        transformStyle: "preserve-3d",
        transform: "translateZ(0)", // Hardware layer promotion
        willChange: "width, height, transform",
      }}
    >
      {/* Elastic, Velocity-Stretched Background Bubble */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          scaleX: cursorScaleX,
          scaleY: cursorScaleY,
          rotate: cursorAngle,
          transformStyle: "preserve-3d",
          transform: "translateZ(0)",
          willChange: "transform",
          backgroundColor: isHovered ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 1)",
          border: isHovered ? "1px solid rgba(255, 255, 255, 0.18)" : "1px solid rgba(255, 255, 255, 0)",
          backdropFilter: isHovered ? "blur(6px) saturate(110%)" : "none",
          WebkitBackdropFilter: isHovered ? "blur(6px) saturate(110%)" : "none",
          boxShadow: isHovered ? "0 8px 32px rgba(0, 0, 0, 0.25)" : "none",
        }}
      />

      {/* Target Crosshair ticks for technical HUD feel */}
      {isHovered && (
        <svg className="absolute -inset-1.5 w-[calc(100%+12px)] h-[calc(100%+12px)] pointer-events-none opacity-40" viewBox="0 0 100 100">
          <line x1="50" y1="0" x2="50" y2="8" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
          <line x1="50" y1="92" x2="50" y2="100" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
          <line x1="0" y1="50" x2="8" y2="50" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
          <line x1="92" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
        </svg>
      )}

      {/* Level, centered text content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {isHovered && cursorLabel && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="font-mono text-[8px] font-extrabold uppercase tracking-[0.2em] text-neutral-200 text-center select-none"
          >
            {cursorLabel}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}