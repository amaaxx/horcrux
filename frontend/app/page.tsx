"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useVelocity,
  useMotionTemplate,
  Variants,
  MotionValue
} from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  Cpu,
  Database,
  Activity,
  Server,
  Zap,
  BrainCircuit,
  Mail
} from "lucide-react";
import Lenis from "lenis";
import {
  GroundTruthVisual,
  WorkspaceVisual,
  BroccoliVisual
} from "@/components/ProjectVisuals";

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

// ── COMPONENT: MAGNETIC ───────────────────────────────────────────────────────
interface MagneticProps { children: React.ReactElement<any>; range?: number; }

function Magnetic({ children, range = 45 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 160, damping: 15, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 160, damping: 15, mass: 0.4 });
  const bounds = useRef<{ cx: number; cy: number } | null>(null);

  const onEnter = () => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    bounds.current = { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
  };
  const onMove = (e: React.MouseEvent) => {
    if (!bounds.current) return;
    const dx = e.clientX - bounds.current.cx;
    const dy = e.clientY - bounds.current.cy;
    if (Math.hypot(dx, dy) < range) { x.set(dx * 0.38); y.set(dy * 0.38); }
    else { x.set(0); y.set(0); }
  };
  const onLeave = () => { x.set(0); y.set(0); bounds.current = null; };

  return (
    <motion.div ref={ref} onMouseEnter={onEnter} onMouseMove={onMove} onMouseLeave={onLeave} style={{ x: springX, y: springY }} className="inline-block">
      {React.cloneElement(children, { "data-cursor": "pointer" })}
    </motion.div>
  );
}

// ── COMPONENT: 3D TILT CARD ───────────────────────────────────────────────────
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
}

function TiltCard({ children, className = "", index = 0 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(true);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 180, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 180, damping: 20 });
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

  const onEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    cachedRect.current = { left: r.left + window.scrollX, top: r.top + window.scrollY, width: r.width, height: r.height };
    if (!isMobile) spotOpacity.set(1);
  };
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cachedRect.current) return;
    const { left, top, width, height } = cachedRect.current;
    const rx = e.pageX - left;
    const ry = e.pageY - top;
    spotX.set(rx);
    spotY.set(ry);
    if (!isMobile) { x.set(rx / width - 0.5); y.set(ry / height - 0.5); }
  };
  const onLeave = () => { x.set(0); y.set(0); spotOpacity.set(0); cachedRect.current = null; };

  // Subtle warm-white spotlight — no color
  const spotlight = useMotionTemplate`radial-gradient(280px circle at ${spotX}px ${spotY}px, rgba(255,255,255,0.04), rgba(255,255,255,0.005) 60%, transparent 100%)`;

  return (
    <motion.div
      ref={ref}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: isMobile ? 0 : rotateX,
        rotateY: isMobile ? 0 : rotateY,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className={`glass-surface rounded-2xl p-6 md:p-8 relative overflow-hidden ${className}`}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ opacity: spotOpacity, background: spotlight }}
      />
      <div className="relative z-10 h-full flex flex-col justify-between">
        {children}
      </div>
    </motion.div>
  );
}

// ── COMPONENT: MANIFESTO WORD ─────────────────────────────────────────────────
function ManifestoWord({ word, index, total, progress }: {
  word: string; index: number; total: number; progress: MotionValue<number>;
}) {
  const start = 0.15 + (index / total) * 0.55;
  const end = start + 0.04;
  const opacity = useTransform(progress, [start, end], [0.1, 1]);
  const color = useTransform(progress, [start, end], ["#2e2e2e", "#f0ede8"]);
  return (
    <motion.span
      style={{ opacity, color, willChange: "opacity, color" }}
      className="inline-block mr-[0.22em] font-sans font-semibold text-2xl md:text-5xl lg:text-6xl tracking-tight"
    >
      {word}
    </motion.span>
  );
}

// ── COMPONENT: VAULT CARD (scroll-linked entry) ───────────────────────────────
function VaultCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.88, 1.0, 0.88]);
  const opacity = useTransform(scrollYProgress, [0.1, 0.42, 0.58, 0.9], [0.15, 1.0, 1.0, 0.15]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, -8]);
  return (
    <motion.div
      ref={ref}
      style={{
        scale: useSpring(scale, { stiffness: 120, damping: 20 }),
        opacity: useSpring(opacity, { stiffness: 120, damping: 20 }),
        rotateX: useSpring(rotateX, { stiffness: 120, damping: 20 }),
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
      }}
      className="min-h-screen flex flex-col justify-center px-8 md:px-16 py-20"
    >
      {children}
    </motion.div>
  );
}

// ── COMPONENT: SCROLL REVEAL HEADER ──────────────────────────────────────────
function ScrollRevealHeader({ subtitle, title }: { subtitle: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 0.35, 0.75], [50, 0, -25]);
  const rotateX = useTransform(scrollYProgress, [0, 0.35, 0.75], [18, 0, -10]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.35, 0.75], [0, 0.6, 1, 0.8]);
  return (
    <motion.div
      ref={ref}
      style={{
        y: useSpring(y, { stiffness: 90, damping: 18 }),
        rotateX: useSpring(rotateX, { stiffness: 90, damping: 18 }),
        opacity: useSpring(opacity, { stiffness: 90, damping: 18 }),
        transformStyle: "preserve-3d",
        perspective: 1200,
        willChange: "transform, opacity",
      }}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center gap-3">
        <span className="accent-line w-6" />
        <span className="font-mono text-[10px] text-[#3a3a3a] tracking-[0.25em] uppercase">{subtitle}</span>
      </div>
      <h2 className="text-section-title tracking-tight text-[#f0ede8]">{title}</h2>
    </motion.div>
  );
}

// ── COMPONENT: VAULT VISUAL CONTAINER (3D mouse tilt) ────────────────────────
function VaultVisualContainer({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7, -7]), { stiffness: 140, damping: 24 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), { stiffness: 140, damping: 24 });
  const scale = useSpring(1, { stiffness: 180, damping: 22 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) / r.width);
    y.set((e.clientY - r.top - r.height / 2) / r.height);
  };
  const onEnter = () => scale.set(1.02);
  const onLeave = () => { x.set(0); y.set(0); scale.set(1); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d",
        willChange: "transform",
        background: "rgba(10, 10, 10, 0.75)",
        borderColor: "rgba(255, 255, 255, 0.07)",
        backdropFilter: "blur(20px)",
      } as any}
      className="w-[85%] h-[60%] md:h-[65%] rounded-2xl border shadow-2xl relative flex items-center justify-center select-none overflow-hidden cursor-none"
      data-cursor-label="TILT"
    >
      {children}
    </motion.div>
  );
}

// ── COMPONENT: LETTER REVEAL ──────────────────────────────────────────────────
function LetterReveal({ text, delayOffset }: { text: string; delayOffset: number }) {
  return (
    <span className="inline-block whitespace-nowrap">
      {text.split("").map((char, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.05em]">
          <motion.span
            className="inline-block origin-bottom-left"
            initial={{ y: "105%", rotate: 5, skewY: 3, scale: 0.92 }}
            animate={{ y: 0, rotate: 0, skewY: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 110, damping: 14, mass: 0.5, delay: delayOffset + i * 0.022 }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ── SVG ICONS ─────────────────────────────────────────────────────────────────
const GithubIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
const LinkedinIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// ── MARQUEE ANIMATION VARIANTS ────────────────────────────────────────────────
const marqueeL: Variants = {
  animate: { x: ["0%", "-50%"], transition: { x: { repeat: Infinity, repeatType: "loop", duration: 18, ease: "linear" } } },
};
const marqueeR: Variants = {
  animate: { x: ["-50%", "0%"], transition: { x: { repeat: Infinity, repeatType: "loop", duration: 18, ease: "linear" } } },
};

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function Home() {
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

  const { scrollY, scrollYProgress } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVel = useSpring(scrollVelocity, { stiffness: 100, damping: 22 });

  const gridY = useTransform(scrollY, [0, 6000], [0, -280]);
  const surfaceSkewY = useTransform(smoothVel, [-3000, 3000], [-2, 2]);
  const marqueeScale = useTransform(smoothVel, [-2500, 2500], [0.96, 1.04]);
  const marqueeSkew = useTransform(smoothVel, [-2500, 2500], [-6, 6]);
  const marqueeExtraX = useTransform(smoothVel, [-2500, 2500], [-40, 40]);

  // Hero parallax
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], [0, 160]);
  const heroScale = useTransform(heroScroll, [0, 1], [1, 0.92]);
  const heroOpacity = useTransform(heroScroll, [0, 0.9], [1, 0]);

  // Manifesto
  const manifestoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: manifestoScroll } = useScroll({ target: manifestoRef, offset: ["start end", "end start"] });

  // Vault active index
  const [activeIndex, setActiveIndex] = useState(0);
  const vaultRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const fn = () => {
      if (!vaultRef.current) return;
      const r = vaultRef.current.getBoundingClientRect();
      const t = Math.max(0, Math.min(1, -r.top / (r.height - window.innerHeight)));
      setActiveIndex(t < 0.33 ? 0 : t < 0.66 ? 1 : 2);
    };
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollToWorks = () => {
    document.getElementById("selected-works-vault")?.scrollIntoView({ behavior: "smooth" });
  };

  const manifestoText = "We engineer systems that endure. Coding is more than writing logic—it is about sculpting digital architecture that flows with absolute speed and physical precision. Every frame matters. Every compile counts. We build with hardware-accelerated layouts, tactile responsive animations, and cinematic aesthetics to deliver an experience that feels alive.";
  const manifestoWords = manifestoText.split(" ");

  // Bento variants
  const bentoContainer: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.09 } } };
  const bentoCard: Variants = { hidden: { opacity: 0, y: 36, scale: 0.96 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 22 } } };

  return (
    <motion.main
      className="relative w-full min-h-screen text-[#f0ede8] overflow-x-hidden font-sans"
      suppressHydrationWarning
    >
      {/* Parallax dot grid */}
      <motion.div style={{ y: gridY }} className="parallax-grid-bg" />

      {/* Structural schematic lines */}
      <div className="schematic-grid hidden md:flex">
        {[0, 1, 2, 3].map(i => <div key={i} className="schematic-line-v" />)}
      </div>
      <div className="schematic-grid-h hidden md:flex">
        {[0, 1, 2].map(i => <div key={i} className="schematic-line-h" />)}
      </div>

      {/* Subtle mouse follow — no color, just a very faint warm ghost */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-0 hidden md:block"
        style={{
          x: glowX, y: glowY,
          translateX: "-50%", translateY: "-50%",
          width: 500, height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle at center, rgba(255,255,255,0.025) 0%, transparent 70%)",
          willChange: "transform",
        }}
      />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative w-full min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 z-10 select-none overflow-hidden"
        suppressHydrationWarning
      >
        <motion.div
          style={{ y: heroY, scale: heroScale, opacity: heroOpacity, willChange: "transform, opacity" }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 18 }}
          className="max-w-6xl w-full flex flex-col gap-8 md:gap-12"
        >
          {/* Status */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-4"
          >
            <div className="status-badge">
              <span className="status-dot" />
              Available for Work
            </div>
            <span className="h-[1px] w-8 bg-white/10" />
            <span className="font-mono text-[10px] text-[#3a3a3a] tracking-[0.25em] uppercase">
              AMAAN // PLATFORM ENGINE
            </span>
          </motion.div>

          {/* Headline — sans + serif editorial contrast */}
          <h1 className="tracking-tight leading-none flex flex-col gap-1">
            {/* Sans: weight, scale, engineering */}
            <span className="clip-mask text-huge font-extrabold text-[#f0ede8]">
              <LetterReveal text="Software Engineer." delayOffset={0.1} />
            </span>
            {/* Serif: italic, editorial, premium */}
            <span className="clip-mask serif-display" style={{ fontSize: "clamp(2rem, 5.5vw, 7rem)", lineHeight: 1.0 }}>
              <LetterReveal text="Architecting systems that endure." delayOffset={0.3} />
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
            className="text-[#5a5a5a] text-sm md:text-base font-light tracking-wide max-w-xl leading-relaxed"
          >
            Developing low-latency pipelines, scalable web microservices, and high-performance user interfaces with meticulous engineering practices.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.95 }}
            className="flex flex-wrap gap-4 items-center"
          >
            <Magnetic range={55}>
              <button
                onClick={scrollToWorks}
                data-cursor-label="EXPLORE"
                className="group btn-primary px-7 py-3.5 text-[#0a0a0a] font-semibold rounded-full flex items-center gap-3 text-sm cursor-none"
              >
                <span>Explore Selected Works</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" />
              </button>
            </Magnetic>

            <div className="flex gap-2.5 items-center">
              {[
                { href: "https://github.com/amaaxx", Icon: GithubIcon, label: "GITHUB" },
                { href: "https://linkedin.com/in/amaaxx", Icon: LinkedinIcon, label: "LINKEDIN" },
              ].map(({ href, Icon, label }) => (
                <Magnetic key={label} range={35}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-label={label}
                    className="flex items-center justify-center p-3 rounded-full btn-ghost transition-all duration-300 cursor-none w-10 h-10"
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                  </a>
                </Magnetic>
              ))}
            </div>
          </motion.div>

          {/* Stats — no neon, just typographic contrast */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-wrap gap-8 pt-4 border-t border-white/[0.05]"
          >
            {[
              { label: "Years Building", value: "3+" },
              { label: "Projects Shipped", value: "12+" },
              { label: "Uptime Target", value: "99.9%" },
              { label: "Users Served", value: "15K+" },
            ].map((s, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <span className="text-xl md:text-2xl font-bold font-mono stat-value">{s.value}</span>
                <span className="font-mono text-[9px] text-[#3a3a3a] uppercase tracking-widest">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── HAIRLINE DIVIDER ────────────────────────────────────────────── */}
      <div className="hairline-divider relative z-10 mx-6 md:mx-16 lg:mx-24" />

      {/* ── MANIFESTO ───────────────────────────────────────────────────── */}
      <section
        ref={manifestoRef}
        className="relative py-32 px-6 md:px-16 lg:px-24 z-10 max-w-5xl mx-auto flex flex-col justify-center min-h-[70vh]"
      >
        <div className="mb-12">
          <ScrollRevealHeader subtitle="PHILOSOPHY & VISION" title="Core Manifesto" />
        </div>
        <div className="flex flex-wrap leading-relaxed max-w-4xl">
          {manifestoWords.map((word, idx) => (
            <ManifestoWord key={idx} word={word} index={idx} total={manifestoWords.length} progress={manifestoScroll} />
          ))}
        </div>
      </section>

      {/* ── TECH ARSENAL ────────────────────────────────────────────────── */}
      <section className="relative py-20 px-6 md:px-16 lg:px-24 z-10 max-w-6xl mx-auto flex flex-col gap-12 md:gap-16">
        <motion.div style={{ skewY: surfaceSkewY }}>
          <ScrollRevealHeader subtitle="SYSTEM CORE COMPONENTS" title="The Tech Arsenal" />
        </motion.div>

        <motion.div
          variants={bentoContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          style={{ skewY: surfaceSkewY, transformStyle: "preserve-3d" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4"
        >
          {/* CARD — Next.js (wide) */}
          <motion.div variants={bentoCard} className="md:col-span-2">
            <TiltCard className="min-h-[240px]" index={0}>
              <div className="flex justify-between items-start w-full">
                <span className="font-mono text-[9px] text-[#3a3a3a] tracking-wider uppercase">CORE_FRAMEWORK // 01</span>
                <Cpu className="w-4 h-4 text-[#3a3a3a]" />
              </div>
              <div className="mt-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-[#f0ede8] mb-2">Next.js 15</h3>
                  <p className="text-[#5a5a5a] text-xs md:text-sm max-w-md leading-relaxed mb-4">
                    Leveraging Next.js 15 with React 19 concurrent features. Architecting production systems utilizing advanced Server Actions, edge routing, and zero-bundle server components.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["React 19", "Server Components", "Edge Handlers", "Hydration Optimizations"].map(t => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="w-full md:w-32 h-24 shrink-0 rounded-xl border border-white/[0.05] bg-black/40 flex items-center justify-center">
                  <svg className="w-20 h-16" viewBox="0 0 100 80" fill="none">
                    <circle cx="50" cy="40" r="10" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
                    <circle cx="50" cy="40" r="4" fill="rgba(255,255,255,0.35)" />
                    <path d="M50 30 L50 12" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                    <path d="M40 40 L15 40" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                    <path d="M60 40 L85 40" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                    <path d="M50 50 L50 68" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                    <circle r="2" fill="rgba(255,255,255,0.6)"><animateMotion path="M 50 30 L 50 12" dur="1s" repeatCount="indefinite" /></circle>
                    <circle r="2" fill="rgba(255,255,255,0.6)"><animateMotion path="M 50 50 L 50 68" dur="1.3s" repeatCount="indefinite" /></circle>
                    <circle r="2" fill="rgba(255,255,255,0.4)"><animateMotion path="M 40 40 L 15 40" dur="0.9s" repeatCount="indefinite" /></circle>
                    <circle r="2" fill="rgba(255,255,255,0.4)"><animateMotion path="M 60 40 L 85 40" dur="1.1s" repeatCount="indefinite" /></circle>
                  </svg>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* CARD — FastAPI */}
          <motion.div variants={bentoCard}>
            <TiltCard className="min-h-[240px]" index={1}>
              <div className="flex justify-between items-start w-full">
                <span className="font-mono text-[9px] text-[#3a3a3a] tracking-wider uppercase">BACKEND // 02</span>
                <Server className="w-4 h-4 text-[#3a3a3a]" />
              </div>
              <div className="mt-8">
                <h3 className="text-2xl font-bold tracking-tight text-[#f0ede8] mb-2">Python & FastAPI</h3>
                <p className="text-[#5a5a5a] text-xs leading-relaxed mb-4">
                  High-performance async API endpoints. Strict type validation with Pydantic and async-native database drivers.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["AsyncIO", "Pydantic v2", "FastAPI", "Uvicorn"].map(t => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* CARD — React */}
          <motion.div variants={bentoCard}>
            <TiltCard className="min-h-[220px]" index={2}>
              <div className="flex justify-between items-start w-full">
                <span className="font-mono text-[9px] text-[#3a3a3a] tracking-wider uppercase">UI_LAYER // 03</span>
                <Activity className="w-4 h-4 text-[#3a3a3a]" />
              </div>
              <div className="mt-8">
                <h3 className="text-2xl font-bold tracking-tight text-[#f0ede8] mb-2">React</h3>
                <p className="text-[#5a5a5a] text-xs leading-relaxed mb-4">
                  State machines, list virtualization, and custom hook bindings tailored for smooth rendering and high visual velocity.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Fiber", "Concurrent UI", "Hooks Engine"].map(t => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* CARD — LangChain */}
          <motion.div variants={bentoCard}>
            <TiltCard className="min-h-[220px]" index={3}>
              <div className="flex justify-between items-start w-full">
                <span className="font-mono text-[9px] text-[#3a3a3a] tracking-wider uppercase">AI // 04</span>
                <BrainCircuit className="w-4 h-4 text-[#3a3a3a]" />
              </div>
              <div className="mt-8">
                <h3 className="text-2xl font-bold tracking-tight text-[#f0ede8] mb-2">LangChain</h3>
                <p className="text-[#5a5a5a] text-xs leading-relaxed mb-4">
                  Multi-agent reasoning graphs, vector space routing algorithms, and hybrid RAG data pipelines for LLM integration.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Agentic Graphs", "Vector Embeddings", "RAG Pipelines"].map(t => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* CARD — C++ */}
          <motion.div variants={bentoCard}>
            <TiltCard className="min-h-[220px]" index={4}>
              <div className="flex justify-between items-start w-full">
                <span className="font-mono text-[9px] text-[#3a3a3a] tracking-wider uppercase">SYSTEMS // 05</span>
                <Zap className="w-4 h-4 text-[#3a3a3a]" />
              </div>
              <div className="mt-8">
                <h3 className="text-2xl font-bold tracking-tight text-[#f0ede8] mb-2">C++ & DSA</h3>
                <p className="text-[#5a5a5a] text-xs leading-relaxed mb-4">
                  Deterministic memory-efficient routines, low-latency algorithms, and high-performance compute bottlenecks.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["STL Algorithms", "Memory Control", "Thread Pools"].map(t => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* CARD — PostgreSQL (full width) */}
          <motion.div variants={bentoCard} className="md:col-span-3">
            <TiltCard className="min-h-[180px]" index={5}>
              <div className="flex justify-between items-start w-full">
                <span className="font-mono text-[9px] text-[#3a3a3a] tracking-wider uppercase">DATASTORAGE // 06</span>
                <Database className="w-4 h-4 text-[#3a3a3a]" />
              </div>
              <div className="mt-8 flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-[#f0ede8] mb-2">PostgreSQL</h3>
                  <p className="text-[#5a5a5a] text-xs md:text-sm max-w-xl leading-relaxed mb-4">
                    Managing transactional integrity and complex vector querying. Optimizing relational query execution plans, indexing schemas (GIN/GiST), and dedicated pgvector storage.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["ACID Transactions", "pgvector Indexing", "Query Optimization", "CDC Pipeline"].map(t => (
                      <span key={t} className="tag">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </motion.div>
      </section>

      {/* ── HAIRLINE DIVIDER ────────────────────────────────────────────── */}
      <div className="hairline-divider relative z-10 mx-6 md:mx-16 lg:mx-24" />

      {/* ── VAULT — SELECTED WORKS ───────────────────────────────────────── */}
      <section
        id="selected-works-vault"
        ref={vaultRef as React.RefObject<HTMLElement>}
        className="relative flex flex-col md:flex-row items-start w-full z-10"
      >
        {/* Label */}
        <div className="absolute top-8 left-6 md:left-16 z-30 section-marker">
          <span className="section-marker-line" />
          <span className="font-mono text-[9px] text-[#3a3a3a] tracking-[0.25em] uppercase">SELECTED_WORKS</span>
        </div>

        {/* Left: sticky visual */}
        <div className="w-full md:w-1/2 md:sticky md:top-0 h-[50vh] md:h-screen flex items-center justify-center overflow-hidden z-20">
          <VaultVisualContainer>
            {/* Index HUD */}
            <div className="absolute top-4 left-4 font-mono text-[8px] text-white/20 z-50 pointer-events-none select-none">
              ACTIVE // 0{activeIndex + 1}
            </div>
            {/* Active indicator line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] z-50 bg-white/10" />

            {[GroundTruthVisual, WorkspaceVisual, BroccoliVisual].map((Visual, i) => (
              <div
                key={i}
                className="absolute inset-0 w-full h-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  opacity: activeIndex === i ? 1 : 0,
                  pointerEvents: activeIndex === i ? "auto" : "none",
                  transform: activeIndex === i ? "scale(1) translateZ(0)" : "scale(0.96) translateZ(-16px)",
                  transformStyle: "preserve-3d",
                }}
              >
                <Visual />
              </div>
            ))}
          </VaultVisualContainer>
        </div>

        {/* Right: scroll track */}
        <div className="w-full md:w-1/2 flex flex-col">

          {/* PROJECT 01 */}
          <VaultCard>
            <div className="flex flex-col gap-6 max-w-lg">
              <div className="section-marker">
                <span className="section-marker-line" />
                <span className="font-mono text-[9px] text-[#3a3a3a] tracking-wider uppercase">PROJECT_01 // RAG_ARCHITECTURE</span>
              </div>
              {/* Serif headline — the editorial money shot */}
              <h3 className="tracking-tight leading-tight" style={{ fontSize: "clamp(2.4rem, 4.5vw, 4rem)" }}>
                <span className="font-extrabold text-[#f0ede8] block">Ground Truth</span>
                <span className="serif-display text-[#f0ede8]/70 block" style={{ fontSize: "0.9em" }}>Engine</span>
              </h3>
              <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <span className="font-mono text-[8px] text-[#3a3a3a] font-bold block mb-1.5 uppercase tracking-widest">Architecture Brief</span>
                <p className="text-[#5a5a5a] text-sm leading-relaxed font-light">An advanced Retrieval-Augmented Generation platform engineered to remove hallucination risks. Employs a deterministic 5-layer framework that parses documents, routes semantic intent, and synthesizes vectorized context.</p>
              </div>
              <ul className="space-y-1.5 text-xs text-[#5a5a5a] font-light list-disc list-inside">
                <li>5-layer parsing, routing, ranking, and database layout.</li>
                <li>Deterministic semantic classification using cosine vector calculations.</li>
                <li>pgvector integration yielding sub-180ms document indexing.</li>
              </ul>
              <div className="grid grid-cols-2 gap-4 border-t border-b border-white/[0.05] py-4">
                <div>
                  <span className="font-mono text-[8px] text-[#3a3a3a] block uppercase tracking-widest">Latency Response</span>
                  <span className="text-lg font-bold font-mono text-[#f0ede8]">&lt; 180ms</span>
                </div>
                <div>
                  <span className="font-mono text-[8px] text-[#3a3a3a] block uppercase tracking-widest">Accuracy Target</span>
                  <span className="text-lg font-bold font-mono text-[#f0ede8]">99.8% Hallucination-Free</span>
                </div>
              </div>
              <Magnetic>
                <a href="/vessel/ground-truth-engine" data-cursor-label="GTE" className="inline-flex items-center gap-2 font-mono text-xs text-[#5a5a5a] hover:text-[#f0ede8] transition-colors cursor-none animated-underline">
                  Inspect Repository Architecture <ArrowUpRight className="w-3 h-3" />
                </a>
              </Magnetic>
            </div>
          </VaultCard>

          {/* PROJECT 02 */}
          <VaultCard>
            <div className="flex flex-col gap-6 max-w-lg">
              <div className="section-marker">
                <span className="section-marker-line" />
                <span className="font-mono text-[9px] text-[#3a3a3a] tracking-wider uppercase">PROJECT_02 // ENTERPRISE_PORTAL</span>
              </div>
              <h3 className="tracking-tight leading-tight" style={{ fontSize: "clamp(2.4rem, 4.5vw, 4rem)" }}>
                <span className="font-extrabold text-[#f0ede8] block">Centralized</span>
                <span className="serif-display text-[#f0ede8]/70 block" style={{ fontSize: "0.9em" }}>Workspace</span>
              </h3>
              <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <span className="font-mono text-[8px] text-[#3a3a3a] font-bold block mb-1.5 uppercase tracking-widest">Enterprise Brief</span>
                <p className="text-[#5a5a5a] text-sm leading-relaxed font-light">A high-security, low-latency intranet dashboard portal servicing Banaras Locomotive Works. Consolidates databases, proxies legacy Oracle systems, and manages staff operations.</p>
              </div>
              <ul className="space-y-1.5 text-xs text-[#5a5a5a] font-light list-disc list-inside">
                <li>Servicing 15,000+ active enterprise directory profiles with RBAC.</li>
                <li>Real-time legacy sync middleware proxying Oracle tables securely.</li>
                <li>API caching reducing database query latency to 45ms.</li>
              </ul>
              <div className="grid grid-cols-2 gap-4 border-t border-b border-white/[0.05] py-4">
                <div>
                  <span className="font-mono text-[8px] text-[#3a3a3a] block uppercase tracking-widest">Deployed Footprint</span>
                  <span className="text-lg font-bold font-mono text-[#f0ede8]">15K+ Active Users</span>
                </div>
                <div>
                  <span className="font-mono text-[8px] text-[#3a3a3a] block uppercase tracking-widest">Proxy Speed</span>
                  <span className="text-lg font-bold font-mono text-[#f0ede8]">45ms Avg Latency</span>
                </div>
              </div>
              <Magnetic>
                <a href="/vessel/blw-portal" data-cursor-label="BLW" className="inline-flex items-center gap-2 font-mono text-xs text-[#5a5a5a] hover:text-[#f0ede8] transition-colors cursor-none animated-underline">
                  Read Enterprise Case Study <ArrowUpRight className="w-3 h-3" />
                </a>
              </Magnetic>
            </div>
          </VaultCard>

          {/* PROJECT 03 */}
          <VaultCard>
            <div className="flex flex-col gap-6 max-w-lg">
              <div className="section-marker">
                <span className="section-marker-line" />
                <span className="font-mono text-[9px] text-[#3a3a3a] tracking-wider uppercase">PROJECT_03 // WEB_SYSTEM</span>
              </div>
              <h3 className="tracking-tight leading-tight" style={{ fontSize: "clamp(2.4rem, 4.5vw, 4rem)" }}>
                <span className="font-extrabold text-[#f0ede8] block">pink-broccoli</span>
                <span className="serif-display text-[#f0ede8]/70 block" style={{ fontSize: "0.9em" }}>Laminar build.</span>
              </h3>
              <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <span className="font-mono text-[8px] text-[#3a3a3a] font-bold block mb-1.5 uppercase tracking-widest">Frontend Brief</span>
                <p className="text-[#5a5a5a] text-sm leading-relaxed font-light">A high-velocity, design-forward web application compiled with custom layout structures, pre-rendered vector graphics, and optimized component pipelines achieving near-zero GC delays.</p>
              </div>
              <ul className="space-y-1.5 text-xs text-[#5a5a5a] font-light list-disc list-inside">
                <li>Lighthouse Performance score hitting 100/100 across platforms.</li>
                <li>Virtualized list rendering with zero layout thrashing.</li>
                <li>Extremely low memory footprint and high frontend velocity.</li>
              </ul>
              <div className="grid grid-cols-2 gap-4 border-t border-b border-white/[0.05] py-4">
                <div>
                  <span className="font-mono text-[8px] text-[#3a3a3a] block uppercase tracking-widest">LCP Load Speed</span>
                  <span className="text-lg font-bold font-mono text-[#f0ede8]">0.52 Seconds</span>
                </div>
                <div>
                  <span className="font-mono text-[8px] text-[#3a3a3a] block uppercase tracking-widest">Gzipped Bundle</span>
                  <span className="text-lg font-bold font-mono text-[#f0ede8]">&lt; 42 Kilobytes</span>
                </div>
              </div>
              <Magnetic>
                <a href="/vessel/Laminar" data-cursor-label="BROCCOLI" className="inline-flex items-center gap-2 font-mono text-xs text-[#5a5a5a] hover:text-[#f0ede8] transition-colors cursor-none animated-underline">
                  View Interactive UI Build <ArrowUpRight className="w-3 h-3" />
                </a>
              </Magnetic>
            </div>
          </VaultCard>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer
        className="relative w-full z-10 pt-32 pb-16 px-6 md:px-16 lg:px-24 flex flex-col justify-end min-h-[70vh] border-t border-white/[0.05] select-none overflow-hidden"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(8,8,8,0.98))" }}
      >
        <div className="max-w-6xl w-full mx-auto flex flex-col gap-12 md:gap-16 relative z-10">
          {/* Marquee — plain text, no rainbow */}
          <motion.div
            style={{ scale: marqueeScale, skewY: marqueeSkew, x: marqueeExtraX, willChange: "transform" }}
            data-cursor-label="TALK"
            className="w-full overflow-hidden flex flex-col gap-1 border-t border-b border-white/[0.05] py-6 md:py-8 cursor-none"
          >
            <motion.div variants={marqueeL} animate="animate" className="flex text-marquee leading-none uppercase font-black tracking-tighter w-[200%] gap-12 select-none">
              {[0, 1].map(i => (
                <div key={i} className="flex justify-around min-w-full shrink-0 gap-12 text-[#f0ede8]">
                  <span>LET&apos;S TALK</span><span className="text-white/20">•</span>
                  <span>LET&apos;S TALK</span><span className="text-white/20">•</span>
                  <span>LET&apos;S TALK</span><span className="text-white/20">•</span>
                </div>
              ))}
            </motion.div>
            {/* Second line — italic serif, editorial */}
            <motion.div variants={marqueeR} animate="animate" className="flex leading-none w-[200%] gap-12 select-none" style={{ fontSize: "clamp(1.5rem, 4vw, 4rem)" }}>
              {[0, 1].map(i => (
                <div key={i} className="flex justify-around min-w-full shrink-0 gap-12 serif-display text-white/12">
                  <span>Build something real.</span><span>•</span>
                  <span>Build something real.</span><span>•</span>
                  <span>Build something real.</span><span>•</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Contact row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <Magnetic range={40}>
              <a
                href="mailto:amaan@example.com"
                data-cursor-label="EMAIL"
                className="group flex items-center gap-3 px-5 py-3 rounded-full btn-ghost transition-all duration-300 cursor-none"
              >
                <Mail className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
                <span className="font-mono text-sm text-white/40 group-hover:text-white/70 transition-colors">amaan@example.com</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
              </a>
            </Magnetic>
            <div className="flex gap-6 items-center">
              {["GITHUB", "LINKEDIN"].map((l, i) => (
                <React.Fragment key={l}>
                  {i > 0 && <span className="w-[1px] h-3 bg-white/10" />}
                  <Magnetic>
                    <a
                      href={l === "GITHUB" ? "https://github.com/amaaxx" : "https://linkedin.com/in/amaaxx"}
                      target="_blank" rel="noopener noreferrer"
                      data-cursor-label="EXTERNAL"
                      className="font-mono text-[10px] text-[#3a3a3a] hover:text-[#f0ede8] transition-colors cursor-none"
                    >
                      {l}
                    </a>
                  </Magnetic>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-white/[0.04]">
            <div className="font-mono text-[9px] text-[#2e2e2e] text-center md:text-left leading-relaxed">
              <div>DESIGNED & ENGINEERED BY AMAAN</div>
              <div>© 2026 HORCRUX ENGINE • ALL RIGHTS RESERVED</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[8px] text-[#2e2e2e]">BUILT WITH</span>
              {["NEXT.JS", "FRAMER MOTION", "LENIS"].map(tech => (
                <span key={tech} className="px-2 py-0.5 rounded font-mono text-[7px] bg-white/[0.03] border border-white/[0.05] text-[#2e2e2e]">{tech}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </motion.main>
  );
}