"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function CommLink() {
  const [status, setStatus] = useState<"initializing" | "ready" | "transmitting" | "secure">("initializing");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (status === "initializing") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus("ready");
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [status]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("transmitting");
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Uplink failed");
      }

      setStatus("secure");
    } catch (error: any) {
      console.error("Transmission error:", error);
      alert(`System Error: ${error.message || "Critical failure during data uplink. Please try again."}`);
      setStatus("ready");
    }
  };

  return (
    <main className="relative min-h-[100dvh] flex flex-col bg-background text-white selection:bg-accent/30 selection:text-accent overflow-hidden font-sans">
      
      {/* Immersive Environment */}
      <div className="system-overlay opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none" />
      
      {/* Grid Floor */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col flex-1 max-w-6xl w-full mx-auto px-6 py-8 md:py-16">
        
        {/* Navigation / Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link 
            href="/" 
            className="group inline-flex items-center gap-3 text-neutral-500 hover:text-white transition-all text-[10px] uppercase tracking-[0.3em] font-mono"
          >
            <span className="w-8 h-px bg-neutral-800 group-hover:w-12 group-hover:bg-accent transition-all duration-500" />
            Back_To_Mainframe
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Context & Metadata */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-5 space-y-10"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-1 w-12 bg-accent" />
                <span className="font-mono text-[10px] text-accent tracking-widest uppercase">System_Link // Vessel_05</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9]">
                Initiate <br />
                <span className="text-neutral-500">Contact.</span>
              </h1>
              <p className="text-neutral-400 text-lg leading-relaxed max-w-sm">
                Establishing a secure, direct uplink to my private server. 
                Encrypted and prioritized.
              </p>
            </div>

            <div className="space-y-6 pt-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Location", value: "Global / Edge" },
                  { label: "Status", value: "Awaiting Data" },
                  { label: "Uplink", value: "Secure SSL" },
                  { label: "Latency", value: "24ms" },
                ].map((item) => (
                  <div key={item.label} className="p-4 border border-neutral-800 bg-neutral-900/40 rounded-2xl backdrop-blur-sm">
                    <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-sm font-medium text-neutral-200">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <a href="https://github.com/amaaxx" target="_blank" rel="noopener noreferrer" className="flex-1 py-3 px-6 bg-neutral-900/60 border border-neutral-800 rounded-xl text-xs font-bold text-neutral-400 hover:text-white hover:border-neutral-600 transition-all text-center">GitHub</a>
                <a href="https://linkedin.com/in/amaaxx" target="_blank" rel="noopener noreferrer" className="flex-1 py-3 px-6 bg-neutral-900/60 border border-neutral-800 rounded-xl text-xs font-bold text-neutral-400 hover:text-white hover:border-neutral-600 transition-all text-center">LinkedIn</a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Uplink */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-7"
          >
            <div className="relative group">
              {/* Outer Glow Effect */}
              <div className="absolute -inset-px bg-gradient-to-br from-accent/20 via-transparent to-accent/5 rounded-[2rem] blur-sm opacity-50 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative bg-surface border border-neutral-800 rounded-[2rem] p-1 overflow-hidden shadow-2xl">
                
                {/* Status Bar */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-800/50">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Data_Stream // {status.toUpperCase()}</span>
                  </div>
                  {status === "initializing" && (
                    <div className="text-[10px] font-mono text-accent">{progress}%</div>
                  )}
                </div>

                <div className="p-8 md:p-12">
                  <AnimatePresence mode="wait">
                    {status === "initializing" ? (
                      <motion.div 
                        key="init"
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col items-center justify-center py-24 space-y-8"
                      >
                        <div className="relative w-24 h-24">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-neutral-800" />
                            <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="2" fill="transparent" strokeDasharray={276} strokeDashoffset={276 - (276 * progress) / 100} className="text-accent transition-all duration-300" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 animate-pulse" />
                          </div>
                        </div>
                        <p className="text-xs font-mono text-neutral-500 tracking-[0.2em] uppercase animate-pulse">Initializing_Protocol...</p>
                      </motion.div>
                    ) : status === "ready" || status === "transmitting" ? (
                      <motion.form 
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onSubmit={handleSubmit}
                        className="space-y-8"
                      >
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono ml-1">Identity</label>
                              <input 
                                required
                                name="name"
                                type="text" 
                                placeholder="Your Name"
                                className="w-full bg-neutral-900/40 border border-neutral-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all placeholder:text-neutral-700"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono ml-1">Return_Path</label>
                              <input 
                                required
                                name="email"
                                type="email" 
                                placeholder="email@address.com"
                                className="w-full bg-neutral-900/40 border border-neutral-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all placeholder:text-neutral-700"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono ml-1">Payload</label>
                            <textarea 
                              required
                              name="message"
                              rows={4}
                              placeholder="Write your transmission here..."
                              className="w-full bg-neutral-900/40 border border-neutral-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all placeholder:text-neutral-700 resize-none"
                            />
                          </div>
                        </div>

                        <button 
                          disabled={status === "transmitting"}
                          className="relative w-full group overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-accent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.22,1,0.36,1]" />
                          <div className={`relative w-full py-5 px-6 border border-accent rounded-2xl flex items-center justify-center gap-3 transition-colors duration-500 ${status === "transmitting" ? "bg-accent text-white" : "text-accent group-hover:text-white"}`}>
                            <span className="text-xs font-bold uppercase tracking-[0.2em]">
                              {status === "transmitting" ? "Transmitting..." : "Send Payload"}
                            </span>
                            {status !== "transmitting" && (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                              </svg>
                            )}
                            {status === "transmitting" && (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            )}
                          </div>
                        </button>
                      </motion.form>
                    ) : (
                      <motion.div 
                        key="secure"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center space-y-6"
                      >
                        <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mb-4">
                          <motion.svg 
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </motion.svg>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold">Transmission Logged.</h3>
                          <p className="text-neutral-500 text-sm max-w-[280px]">
                            Your data has been securely delivered to the mainframe. Awaiting return vector.
                          </p>
                        </div>
                        <button 
                          onClick={() => setStatus("ready")}
                          className="text-[10px] font-mono text-neutral-600 hover:text-accent transition-colors uppercase tracking-widest mt-8"
                        >
                          New_Transmission
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Footer System Decor */}
      <div className="p-8 flex justify-between items-center opacity-20 pointer-events-none mt-auto">
        <span className="text-[8px] font-mono tracking-widest">AMAAXX_SECURITY_LAYER_v5.0</span>
        <div className="flex gap-4">
          <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
          <div className="w-1 h-1 bg-white rounded-full animate-pulse [animation-delay:0.2s]" />
          <div className="w-1 h-1 bg-white rounded-full animate-pulse [animation-delay:0.4s]" />
        </div>
      </div>
    </main>
  );
}