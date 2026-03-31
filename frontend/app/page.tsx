"use client";

import { motion } from "framer-motion";

export default function Home() {
  // Animation settings for the staggered grid loading
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 300, damping: 24 } 
    },
  };

  return (
    <main className="min-h-screen bg-background text-white p-4 md:p-8 font-sans selection:bg-accent selection:text-white">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* HERO SECTION */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-20"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
            Amaan. <br className="hidden md:block" />
            <span className="text-neutral-500">Software Developer.</span>
          </h1>
          <p className="max-w-xl text-lg text-neutral-400">
            Building complex, high-performance web applications and systems. 
          </p>
        </motion.header>

        {/* BENTO GRID SECTION */}
        <motion.section 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-4 h-auto md:h-[800px]"
        >
          
          {/* Main Large Card (Spans 2 columns, 2 rows) */}
          <motion.div 
            variants={item}
            className="bg-surface border border-border rounded-3xl p-6 md:col-span-2 md:row-span-2 flex flex-col justify-end transition-colors hover:border-neutral-700 cursor-pointer"
          >
            <h2 className="text-2xl font-bold mb-2">Ground Truth Engine</h2>
            <p className="text-neutral-400">RAG system built for absolute accuracy.</p>
          </motion.div>

          {/* Top Right Card */}
          <motion.div 
            variants={item}
            className="bg-surface border border-border rounded-3xl p-6 flex flex-col justify-end transition-colors hover:border-neutral-700 cursor-pointer"
          >
            <h2 className="text-xl font-bold mb-2">Strata</h2>
            <p className="text-neutral-400 text-sm">Recursive note architecture.</p>
          </motion.div>

          {/* Middle Right Card */}
          <motion.div 
            variants={item}
            className="bg-surface border border-border rounded-3xl p-6 flex flex-col justify-end transition-colors hover:border-neutral-700 cursor-pointer"
          >
            <h2 className="text-xl font-bold mb-2">BLW Portal</h2>
            <p className="text-neutral-400 text-sm">Intranet deployment.</p>
          </motion.div>

          {/* Bottom Left Card (Stats/Tech Stack) */}
          <motion.div 
            variants={item}
            className="bg-surface border border-border rounded-3xl p-6 flex flex-col justify-end transition-colors hover:border-neutral-700"
          >
            <h2 className="text-xl font-bold">Tech Stack</h2>
          </motion.div>

          {/* Bottom Middle Card (Contact/Links) */}
          <motion.div 
            variants={item}
            className="bg-surface border border-border rounded-3xl p-6 md:col-span-2 flex flex-col justify-end transition-colors hover:border-neutral-700 group cursor-pointer"
          >
            <h2 className="text-xl font-bold group-hover:text-accent transition-colors">Let's Talk ↗</h2>
          </motion.div>

        </motion.section>

      </div>
    </main>
  );
}