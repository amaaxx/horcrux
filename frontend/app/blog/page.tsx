"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Calendar, Clock } from "lucide-react";
import { blogPosts, BlogPost } from "@/lib/blog-data";
import Lenis from "lenis";

// ── HOOK: GLOBAL MOUSE POSITION ───────────────────────────────────────────────
function useMousePosition() {
  const mouse = { x: useMotionValue(-200), y: useMotionValue(-200) };
  useEffect(() => {
    const move = (e: MouseEvent) => { mouse.x.set(e.clientX); mouse.y.set(e.clientY); };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [mouse.x, mouse.y]);
  return mouse;
}

// ── COMPONENT: SCROLL PROGRESS BAR ────────────────────────────────────────────
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 25, restDelta: 0.001 });
  return (
    <div className="scroll-progress-bar">
      <motion.div className="scroll-progress-fill" style={{ scaleX, transformOrigin: "0%" }} />
    </div>
  );
}

// ── COMPONENT: 3D TILT CARD (Adapted for Blog) ────────────────────────────────
function BlogTiltCard({ post, index }: { post: BlogPost; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [isMobile, setIsMobile] = useState(true);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 180, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 180, damping: 20 });
  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);
  const spotOpacity = useSpring(0, { stiffness: 150, damping: 20 });
  const cachedRect = useRef<{ left: number; top: number; width: number; height: number } | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const onEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    cachedRect.current = { left: r.left + window.scrollX, top: r.top + window.scrollY, width: r.width, height: r.height };
    if (!isMobile) spotOpacity.set(1);
  };
  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cachedRect.current) return;
    const { left, top, width, height } = cachedRect.current;
    const rx = e.pageX - left;
    const ry = e.pageY - top;
    spotX.set(rx);
    spotY.set(ry);
    if (!isMobile) {
      const normalizedX = rx / width - 0.5;
      const normalizedY = ry / height - 0.5;
      rotateX.set(normalizedY * 12);
      rotateY.set(normalizedX * -12);
    }
  };
  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    spotOpacity.set(0);
    cachedRect.current = null;
  };

  const spotlight = useMotionTemplate`radial-gradient(300px circle at ${spotX}px ${spotY}px, rgba(255,255,255,0.06), rgba(255,255,255,0.005) 60%, transparent 100%)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, delay: 0.1 * index, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/blog/${post.slug}`}
        ref={ref}
        onMouseEnter={onEnter}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="block group"
        data-cursor-label="READ"
      >
        <motion.div
          style={{
            rotateX: isMobile ? 0 : rotateX,
            rotateY: isMobile ? 0 : rotateY,
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
          className="glass-surface bento-scan-card rounded-2xl p-6 md:p-8 relative overflow-hidden h-full flex flex-col justify-between"
        >
          <motion.div
            className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
            style={{ opacity: spotOpacity, background: spotlight }}
          />
          
          <div className="relative z-10 flex flex-col h-full justify-between gap-8">
            <div className="flex justify-between items-start">
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <ArrowUpRight className="w-5 h-5 text-[#5a5a5a] group-hover:text-white transition-colors duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#f0ede8] mb-3 group-hover:text-white transition-colors">
                {post.title}
              </h2>
              <p className="text-[#5a5a5a] text-sm md:text-base leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-[#3a3a3a] uppercase tracking-wider pt-4 border-t border-white/[0.05]">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

// ── MAIN BLOG PAGE ────────────────────────────────────────────────────────────
export default function BlogIndex() {
  // Smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      gestureOrientation: "vertical",
      smoothWheel: true,
    });
    const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const { x: mx, y: my } = useMousePosition();
  const glowX = useSpring(mx, { stiffness: 70, damping: 24 });
  const glowY = useSpring(my, { stiffness: 70, damping: 24 });

  const { scrollY } = useScroll();
  const gridY = useTransform(scrollY, [0, 4000], [0, -180]);

  return (
    <main className="relative w-full min-h-screen pt-32 pb-24 px-6 md:px-16 lg:px-24 z-10 flex flex-col items-center overflow-x-clip">
      {/* Scroll progress bar */}
      <ScrollProgressBar />

      {/* Parallax dot grid */}
      <motion.div style={{ y: gridY }} className="parallax-grid-bg" />

      {/* Structural schematic lines */}
      <div className="schematic-grid hidden md:flex">
        {[0, 1, 2, 3].map(i => <div key={i} className="schematic-line-v" />)}
      </div>
      <div className="schematic-grid-h hidden md:flex">
        {[0, 1, 2].map(i => <div key={i} className="schematic-line-h" />)}
      </div>

      {/* Subtle mouse follow glow */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-0 hidden md:block"
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle at center, rgba(255,255,255,0.025) 0%, transparent 70%)",
          willChange: "transform",
        }}
      />

      <div className="max-w-6xl w-full relative z-20">
        {/* Navigation / Header */}
        <div className="w-full flex items-center justify-between mb-24 relative z-20">
          <Link href="/" className="btn-ghost flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-widest uppercase" data-cursor-label="HOME">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Matrix</span>
          </Link>
          <div className="flex items-center gap-3">
             <span className="status-dot" />
             <span className="font-mono text-[9px] text-[#5a5a5a] tracking-[0.2em] uppercase">SYSTEM.LOGS</span>
          </div>
        </div>

        {/* Header Section */}
        <motion.div 
          className="flex flex-col gap-4 mb-20 relative z-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3">
            <span className="accent-line w-8" />
            <span className="font-mono text-[10px] text-[#5a5a5a] tracking-[0.25em] uppercase">Transmissions</span>
          </div>
          <h1 className="text-section-title tracking-tight text-[#f0ede8]">
            Engineering <span className="serif-display text-white/50">Logs</span>
          </h1>
          <p className="text-[#5a5a5a] text-sm md:text-base max-w-xl leading-relaxed mt-4 font-light">
            Insights, architecture deep-dives, and thoughts on building resilient software systems at scale.
          </p>
        </motion.div>

        {/* Grid of Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-20">
          {blogPosts.map((post, idx) => (
            <BlogTiltCard key={post.slug} post={post} index={idx} />
          ))}
        </div>
        
        {/* Background Effects specifically for Blog */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#ffffff03] to-transparent pointer-events-none z-0" />
      </div>
    </main>
  );
}
