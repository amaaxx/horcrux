"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Very tight spring — cursor tracks almost instantly
  const springX = useSpring(mouseX, { stiffness: 520, damping: 32, mass: 0.18 });
  const springY = useSpring(mouseY, { stiffness: 520, damping: 32, mass: 0.18 });

  const velX = useVelocity(springX);
  const velY = useVelocity(springY);
  const smoothVelX = useSpring(velX, { stiffness: 200, damping: 30 });
  const smoothVelY = useSpring(velY, { stiffness: 200, damping: 30 });

  // Elastic stretch in direction of travel
  const scaleX = useTransform([smoothVelX, smoothVelY], ([vx, vy]) => {
    const speed = Math.hypot(vx as number, vy as number);
    return Math.min(1 + speed / 1200, 1.8);
  });
  const scaleY = useTransform([smoothVelX, smoothVelY], ([vx, vy]) => {
    const speed = Math.hypot(vx as number, vy as number);
    return Math.max(1 - speed / 2400, 0.55);
  });
  const angle = useTransform([smoothVelX, smoothVelY], ([vx, vy]) =>
    Math.atan2(vy as number, vx as number) * (180 / Math.PI)
  );

  const cursorSize = useSpring(isHovered ? (cursorLabel ? 80 : 52) : 9, {
    stiffness: 360, damping: 28,
  });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;

    setIsVisible(true);

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const hoverEl = target.closest("[data-cursor-label]");
      if (hoverEl) {
        setCursorLabel(hoverEl.getAttribute("data-cursor-label"));
        setIsHovered(true);
        return;
      }

      const interactive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest('[data-cursor="pointer"]') ||
        target.getAttribute("role") === "button";

      setCursorLabel(null);
      setIsHovered(!!interactive);
    };

    const onLeave  = () => setIsVisible(false);
    const onEnter  = () => setIsVisible(true);

    window.addEventListener("mousemove", onMove,  { passive: true });
    window.addEventListener("mouseover", onOver,  { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  // Single warm off-white — the only "color" on the cursor
  const warmWhite = "rgba(240, 237, 232, 0.88)";
  const warmWhiteDim = "rgba(240, 237, 232, 0.16)";

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:flex items-center justify-center"
      style={{
        x: springX, y: springY,
        width: cursorSize, height: cursorSize,
        translateX: "-50%", translateY: "-50%",
        transformStyle: "preserve-3d",
        willChange: "width, height, transform",
      }}
    >
      {/* Main elastic bubble */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          scaleX,
          scaleY,
          rotate: angle,
          willChange: "transform",
          backgroundColor: isHovered ? "rgba(8, 8, 8, 0.82)" : warmWhite,
          border: isHovered ? `1px solid ${warmWhiteDim}` : "none",
          backdropFilter: isHovered ? "blur(8px)" : "none",
          WebkitBackdropFilter: isHovered ? "blur(8px)" : "none",
          boxShadow: isHovered ? `0 0 0 1px ${warmWhiteDim}` : "none",
          transition: "background-color 0.35s ease, border-color 0.35s ease",
        }}
      />

      {/* Ring — only when hovered, very subtle */}
      {isHovered && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1.18, opacity: 0.18 }}
          style={{
            inset: "-4px",
            border: `1px solid ${warmWhite}`,
            borderRadius: "50%",
          }}
        />
      )}

      {/* Crosshair ticks — minimal, hairline */}
      {isHovered && (
        <svg
          className="absolute pointer-events-none opacity-25"
          style={{ inset: "-6px", width: "calc(100% + 12px)", height: "calc(100% + 12px)" }}
          viewBox="0 0 100 100"
        >
          <line x1="50" y1="2"  x2="50" y2="14"  stroke={warmWhite} strokeWidth="1" />
          <line x1="50" y1="86" x2="50" y2="98"  stroke={warmWhite} strokeWidth="1" />
          <line x1="2"  y1="50" x2="14" y2="50"  stroke={warmWhite} strokeWidth="1" />
          <line x1="86" y1="50" x2="98" y2="50"  stroke={warmWhite} strokeWidth="1" />
        </svg>
      )}

      {/* Label text */}
      {isHovered && cursorLabel && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15 }}
          className="absolute font-mono text-[7px] font-bold uppercase tracking-[0.18em] text-center select-none"
          style={{ color: warmWhite }}
        >
          {cursorLabel}
        </motion.span>
      )}
    </motion.div>
  );
}