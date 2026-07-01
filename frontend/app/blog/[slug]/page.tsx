"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, useScroll, useSpring, useTransform, useMotionValue } from "framer-motion";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { getBlogPostBySlug } from "@/lib/blog-data";
import Lenis from "lenis";
import MarkdownRenderer from "@/components/MarkdownRenderer";

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

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = getBlogPostBySlug(slug);

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

  if (!post) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#080808]">
        <h1 className="text-4xl font-bold mb-4 text-[#f0ede8]">404 - Transmission Not Found</h1>
        <Link href="/blog" className="btn-ghost px-6 py-3 rounded-full flex items-center gap-2 text-xs font-mono uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Return to Logs
        </Link>
      </main>
    );
  }

  return (
    <main className="relative w-full min-h-screen pt-44 pb-32 px-6 md:px-16 lg:px-24 z-10 flex flex-col items-center overflow-x-clip selection:bg-white/20 selection:text-white">
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

      <article className="max-w-3xl w-full relative z-20">
        
        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-20"
        >
          <Link href="/blog" className="inline-flex items-center gap-2 text-[#5a5a5a] hover:text-[#f0ede8] transition-colors group text-sm font-mono uppercase tracking-widest" data-cursor-label="BACK">
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to Transmissions</span>
          </Link>
        </motion.div>

        {/* Header Section */}
        <header className="mb-14 border-b border-white/[0.06] pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-3 mb-6"
          >
            {post.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-[54px] font-bold tracking-tight text-[#f0ede8] mb-10 leading-[1.25]"
          >
            {post.title}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-6 text-sm font-mono text-[#5a5a5a] uppercase tracking-wider"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#8a8a8a]" />
              <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8a8a8a]" />
              <span>{post.readTime}</span>
            </div>
          </motion.div>
        </header>

        {/* Content Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <MarkdownRenderer content={post.content || ""} />
        </motion.div>

      </article>

      {/* Global typography overrides for the blog content */}
      <style jsx global>{`
        .prose-container h1 {
          font-family: var(--serif);
          font-style: italic;
          font-weight: 400;
          font-size: 2.2rem;
          color: #f0ede8;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          letter-spacing: -0.01em;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 0.5rem;
        }
        .prose-container h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #f0ede8;
          margin-top: 2.5rem;
          margin-bottom: 1.25rem;
          letter-spacing: -0.02em;
        }
        .prose-container h3 {
          font-size: 1.35rem;
          font-weight: 600;
          color: #e0e0e0;
          margin-top: 2rem;
          margin-bottom: 1rem;
          letter-spacing: -0.01em;
        }
        .prose-container p {
          margin-bottom: 1.5rem;
          font-family: var(--font-geist-sans), sans-serif;
          line-height: 1.8;
          color: #a0a0a0;
          font-weight: 300;
        }
        .prose-container strong {
          color: #f0ede8;
          font-weight: 600;
        }
        .prose-container blockquote {
          border-left: 2px solid rgba(255, 255, 255, 0.2);
          padding-left: 1.5rem;
          margin: 2.5rem 0;
          font-style: italic;
          color: #d0d0d0;
          font-family: var(--serif);
          font-size: 1.15rem;
          line-height: 1.6;
        }
      `}</style>
    </main>
  );
}
