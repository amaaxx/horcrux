"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values mapped directly to cursor position
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // High-performance spring alignment running on the GPU
  const springX = useSpring(mouseX, { stiffness: 450, damping: 28, mass: 0.2 });
  const springY = useSpring(mouseY, { stiffness: 450, damping: 28, mass: 0.2 });
  
  // Spring to smooth out sizing adjustments
  const scale = useSpring(isHovered ? 4.0 : 1, { stiffness: 350, damping: 22 });

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

    // Global event delegation for interaction states - 0 DOM queries in animation loops
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = 
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.closest("a") || 
        target.closest("button") || 
        target.closest('[data-cursor="pointer"]') || 
        target.closest('[data-cursor="magnetic"]') || 
        target.getAttribute("role") === "button";

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
      className="fixed top-0 left-0 w-3 h-3 rounded-full pointer-events-none z-[9999] hidden md:block mix-blend-difference bg-white"
      style={{
        x: springX,
        y: springY,
        scale,
        translateX: "-50%",
        translateY: "-50%",
        transformStyle: "preserve-3d",
        transform: "translateZ(0)", // Hardware layer promotion
        willChange: "transform",
        backgroundColor: isHovered ? "rgba(255, 255, 255, 0)" : "rgba(255, 255, 255, 1)",
        border: isHovered ? "1px solid rgba(255, 255, 255, 1)" : "1px solid rgba(255, 255, 255, 0)",
      }}
    />
  );
}