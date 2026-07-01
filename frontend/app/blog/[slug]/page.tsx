"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { getBlogPostBySlug } from "@/lib/blog-data";
import Lenis from "lenis";
import MarkdownRenderer from "@/components/MarkdownRenderer";

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

  if (!post) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-bold mb-4">404 - Transmission Not Found</h1>
        <Link href="/blog" className="btn-ghost px-6 py-3 rounded-full flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Return to Logs
        </Link>
      </main>
    );
  }

  return (
    <main className="relative w-full min-h-screen pt-32 pb-32 px-6 md:px-16 lg:px-24 z-10 flex flex-col items-center selection:bg-white/20 selection:text-white">
      {/* Background ambient effect */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#ffffff04] to-transparent pointer-events-none z-0" />
      
      <article className="max-w-3xl w-full relative z-20">
        
        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-16"
        >
          <Link href="/blog" className="inline-flex items-center gap-2 text-[#5a5a5a] hover:text-[#f0ede8] transition-colors group text-sm font-mono uppercase tracking-widest" data-cursor-label="BACK">
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to Transmissions</span>
          </Link>
        </motion.div>

        {/* Header Section */}
        <header className="mb-16 border-b border-white/[0.06] pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-3 mb-8"
          >
            {post.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#f0ede8] mb-8 leading-[1.1]"
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

      <style jsx global>{`
        .prose-container h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #f0ede8;
          margin-top: 2rem;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }
        .prose-container h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #f0ede8;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }
        .prose-container p {
          margin-bottom: 1.5rem;
        }
        .prose-container strong {
          color: #f0ede8;
          font-weight: 600;
        }
        .prose-container blockquote {
          border-left: 2px solid rgba(255, 255, 255, 0.2);
          padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          color: #d0d0d0;
          font-family: var(--font-serif);
        }
      `}</style>
    </main>
  );
}
