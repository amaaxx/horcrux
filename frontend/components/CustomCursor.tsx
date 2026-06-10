"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // High-end spring physics for the trailing effect
  const springX = useSpring(mouseX, { stiffness: 450, damping: 28, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 450, damping: 28, mass: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseLeave = () => setIsVisible(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hoverEl = target.closest("[data-cursor-label]");
      if (hoverEl) {
        setLabel(hoverEl.getAttribute("data-cursor-label"));
      } else {
        setLabel(null);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* The trailing morphing badge */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-white/50 pointer-events-none z-50 hidden md:flex items-center justify-center mix-blend-difference font-mono text-[8px] font-bold tracking-widest text-white overflow-hidden select-none"
        animate={{
          width: label ? 96 : 30,
          height: label ? 30 : 30,
          borderRadius: label ? "8px" : "50%",
          backgroundColor: label ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0)",
          borderColor: label ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.4)",
        }}
        transition={{ type: "spring", stiffness: 380, damping: 26 }}
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="whitespace-nowrap"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      {/* The precise center dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-50 hidden md:block mix-blend-difference"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: label ? 0.3 : 1,
          opacity: label ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}