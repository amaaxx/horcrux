"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CommLink() {
  const [status, setStatus] = useState<"idle" | "connecting" | "ready" | "transmitting" | "sent">("idle");
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    const timeoutIds: NodeJS.Timeout[] = [];

    setStatus("connecting");
    setLogs([]); 

    const bootSequence = [
      "Establishing secure uplink...",
      "Bypassing standard nodes...",
      "Resolving DNS to AMAAXX_SERVER...",
      "Connection established. Awaiting payload."
    ];

    let delay = 0;
    bootSequence.forEach((log, index) => {
      const id = setTimeout(() => {
        if (isMounted) {
          setLogs((prev) => [...prev, `> ${log}`]);
          if (index === bootSequence.length - 1) {
            setStatus("ready");
          }
        }
      }, delay);
      
      timeoutIds.push(id);
      delay += 800;
    });

    return () => {
      isMounted = false;
      timeoutIds.forEach(clearTimeout);
    };
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("transmitting");
    setLogs((prev) => [...prev, "> Initiating data transfer..."]);

    setTimeout(() => {
      setLogs((prev) => [...prev, "> Payload delivered successfully.", "> Closing channel."]);
      setStatus("sent");
    }, 2000);
  };

  return (
    <main className="relative min-h-[100dvh] flex flex-col justify-center bg-background text-white p-4 md:p-8 font-mono selection:bg-accent/30 selection:text-accent overflow-hidden">
      
      {/* The Spotlight Effect: Makes the empty space feel deliberate and cinematic */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-800/20 via-background to-background pointer-events-none z-0" />
      
      {/* Grid Pattern Overlay (Optional: adds a blueprint/technical feel to the void) */}
      <div className="absolute inset-0 bg-grid-white/[0.01] bg-[size:30px_30px] pointer-events-none z-0" />

      {/* Expanded to max-w-3xl to command more horizontal screen space */}
      <div className="max-w-3xl w-full mx-auto space-y-8 relative z-10">
        
        {/* Navigation */}
        <Link 
          href="/" 
          className="group flex items-center gap-4 text-neutral-500 hover:text-accent transition-colors w-fit text-xs uppercase tracking-widest"
        >
          <span className="transform group-hover:-translate-x-2 transition-transform duration-300">←</span> 
          Terminate_Connection
        </Link>

        {/* Header */}
        <header className="space-y-4 border-b border-neutral-800 pb-6">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              {status !== "sent" && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${status === "sent" ? "bg-neutral-600" : "bg-accent"}`}></span>
            </span>
            <span className="text-xs text-neutral-500 tracking-widest uppercase">
              Vessel_05 // Secure_Channel
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-sans">
            Comm Link
          </h1>
        </header>

        {/* Terminal Window */}
        <motion.div 
          layout
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-surface border border-neutral-800 rounded-xl overflow-hidden shadow-2xl"
        >
          {/* Terminal Header */}
          <div className="bg-neutral-900 border-b border-neutral-800 px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
            <span className="ml-2 text-[10px] text-neutral-500">root@amaaxx:~</span>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* System Logs */}
            <div className="space-y-2 text-xs md:text-sm text-neutral-400 min-h-[100px]">
              {logs.map((log, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                >
                  {log}
                </motion.div>
              ))}
              
              {(status === "connecting" || status === "transmitting") && (
                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
                  &gt; _
                </motion.div>
              )}
            </div>

            {/* Interactive Form */}
            {status === "ready" && (
              <motion.form 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleSubmit} 
                className="space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-accent uppercase tracking-widest">Client_Identity</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="Enter your name..." 
                      className="w-full bg-transparent border-b border-neutral-700 py-2 text-sm text-white focus:outline-none focus:border-accent transition-colors placeholder:text-neutral-700"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-accent uppercase tracking-widest">Return_Vector</label>
                    <input 
                      required 
                      type="email" 
                      placeholder="Enter your email..." 
                      className="w-full bg-transparent border-b border-neutral-700 py-2 text-sm text-white focus:outline-none focus:border-accent transition-colors placeholder:text-neutral-700"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-accent uppercase tracking-widest">Payload</label>
                    <textarea 
                      required 
                      rows={3}
                      placeholder="Enter transmission data..." 
                      className="w-full bg-transparent border border-neutral-700 rounded-md p-3 text-sm text-white focus:outline-none focus:border-accent transition-colors placeholder:text-neutral-700 resize-none mt-1"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-3 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-md hover:bg-neutral-200 active:scale-[0.98] transition-all"
                >
                  Initiate Transmission
                </button>
              </motion.form>
            )}

            {/* Success State */}
            {status === "sent" && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 border border-accent/30 bg-accent/5 rounded-md text-center"
              >
                <p className="text-accent text-sm">Transmission Logged.</p>
                <p className="text-neutral-500 text-xs mt-1">I will respond to your return vector shortly.</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}