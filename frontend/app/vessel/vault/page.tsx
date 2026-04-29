"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Contact = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export default function Vault() {
  const [status, setStatus] = useState<"initializing" | "ready">("initializing");
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState<Contact[]>([]);
  const [isPurging, setIsPurging] = useState<string | null>(null);

  useEffect(() => {
    // Initialization sequence
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus("ready");
          return 100;
        }
        return prev + 5;
      });
    }, 20);

    // Fetch messages
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/contact");
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        }
      } catch (error) {
        console.error("Failed to sync with mainframe:", error);
      }
    };

    fetchMessages();
    return () => clearInterval(interval);
  }, []);

  const purgeRecord = async (id: string) => {
    setIsPurging(id);
    try {
      const response = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (response.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (error) {
      console.error("Purge failed:", error);
    } finally {
      setIsPurging(null);
    }
  };

  return (
    <main className="relative min-h-[100dvh] flex flex-col bg-background text-white selection:bg-accent/30 selection:text-accent overflow-hidden font-sans">
      
      {/* Immersive Environment */}
      <div className="system-overlay opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col flex-1 max-w-6xl w-full mx-auto px-6 py-8 md:py-16">
        
        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex justify-between items-center"
        >
          <Link 
            href="/" 
            className="group inline-flex items-center gap-3 text-neutral-500 hover:text-white transition-all text-[10px] uppercase tracking-[0.3em] font-mono"
          >
            <span className="w-8 h-px bg-neutral-800 group-hover:w-12 group-hover:bg-accent transition-all duration-500" />
            Exit_Vault
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-1 w-8 bg-neutral-800" />
            <span className="font-mono text-[10px] text-neutral-500 tracking-widest uppercase">
              Auth_Level // Administrator
            </span>
          </div>
        </motion.div>

        <header className="mb-12 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-1 w-12 bg-accent" />
            <span className="font-mono text-[10px] text-accent tracking-widest uppercase">Data_Archive // Vessel_Vault</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            The <span className="text-neutral-500">Vault.</span>
          </h1>
          <div className="flex gap-8 pt-2">
            <div className="space-y-1">
              <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Total_Transmissions</p>
              <p className="text-xl font-bold text-accent">{messages.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">System_Status</p>
              <p className="text-xl font-bold text-green-500">Nominal</p>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {status === "initializing" ? (
            <motion.div 
              key="loader"
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex-1 flex flex-col items-center justify-center py-20"
            >
              <div className="w-full max-w-xs h-1 bg-neutral-900 rounded-full overflow-hidden mb-4">
                <motion.div 
                  className="h-full bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[10px] font-mono text-neutral-500 tracking-[0.2em] uppercase animate-pulse">Decrypting_Data_Logs...</p>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 gap-4"
            >
              {messages.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-neutral-800 rounded-3xl bg-neutral-900/20">
                  <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">No Transmissions Found</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative bg-surface border border-neutral-800 rounded-3xl p-6 md:p-8 hover:border-neutral-600 transition-all"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-4">
                          <span className="px-2 py-1 bg-accent/10 border border-accent/20 rounded text-[9px] font-mono text-accent uppercase tracking-widest">
                            Log_{idx + 1}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-500">
                            {new Date(msg.created_at).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{msg.name}</h3>
                          <p className="text-sm text-accent font-mono">{msg.email}</p>
                        </div>
                        <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl">
                          <p className="text-sm text-neutral-400 leading-relaxed italic">
                            "{msg.message}"
                          </p>
                        </div>
                      </div>
                      <div className="flex md:flex-col justify-end gap-2">
                        <button 
                          onClick={() => purgeRecord(msg.id)}
                          disabled={isPurging === msg.id}
                          className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-bold text-red-500 uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                        >
                          {isPurging === msg.id ? "Purging..." : "Purge_Record"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer System Decor */}
      <div className="p-8 flex justify-between items-center opacity-20 pointer-events-none mt-auto">
        <span className="text-[8px] font-mono tracking-widest">AMAAXX_ENCRYPTION_v5.0</span>
        <span className="text-[8px] font-mono tracking-widest">UNAUTHORIZED_ACCESS_PROHIBITED</span>
      </div>
    </main>
  );
}
