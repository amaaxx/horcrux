"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useVelocity,
  useMotionTemplate,
  useInView,
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
interface MagneticProps { children: React.ReactElement<{ "data-cursor"?: string }>; range?: number; }

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

// ── COMPONENT: SECTION HUD ────────────────────────────────────────────────────
function SectionHud({ activeSection }: { activeSection: number }) {
  const sections = ["HERO", "MANIFESTO", "ARSENAL", "WORKS", "CONNECT"];
  return (
    <div className="section-hud hidden md:flex">
      {sections.map((_, i) => (
        <div
          key={i}
          className={`hud-dot ${activeSection === i ? "active" : ""}`}
          title={sections[i]}
        />
      ))}
    </div>
  );
}

// ── COMPONENT: 3D TILT CARD ───────────────────────────────────────────────────
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

function TiltCard({ children, className = "", spotlightColor = "rgba(212, 199, 146, 0.08)" }: TiltCardProps) {
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

  const spotlight = useMotionTemplate`radial-gradient(320px circle at ${spotX}px ${spotY}px, ${spotlightColor}, transparent 75%)`;

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
      className={`glass-surface bento-scan-card rounded-2xl p-6 md:p-8 relative overflow-hidden ${className}`}
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
  const opacity = useTransform(progress, [start - 0.02, start + 0.02], [0.15, 1]);
  const color = useTransform(
    progress,
    [start - 0.02, start + 0.01, end],
    ["#2a2a2a", "#ffffff", "#f0ede8"]
  );
  const blur = useTransform(progress, [start, end], [4, 0]);
  const y = useTransform(progress, [start, end], [8, 0]);
  const blurFilter = useMotionTemplate`blur(${blur}px)`;
  return (
    <motion.span
      style={{ opacity, color, filter: blurFilter, y, willChange: "opacity, color, transform, filter" }}
      className="inline-block mr-[0.22em] font-sans font-semibold text-2xl md:text-5xl lg:text-6xl tracking-tight"
    >
      {word}
    </motion.span>
  );
}



// ── COMPONENT: SCROLL REVEAL HEADER (clip-path + parallax) ───────────────────
function ScrollRevealHeader({ subtitle, title }: { subtitle: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 0.35, 0.75], [60, 0, -30]);
  const rotateX = useTransform(scrollYProgress, [0, 0.35, 0.75], [20, 0, -12]);
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
      <motion.div
        className="flex items-center gap-3 overflow-hidden"
        initial={{ x: -40, opacity: 0 }}
        animate={isInView ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="accent-line w-6" />
        <span className="font-mono text-[10px] text-[#3a3a3a] tracking-[0.25em] uppercase">{subtitle}</span>
      </motion.div>
      <div className="overflow-hidden">
        <motion.h2
          className="text-section-title tracking-tight text-[#f0ede8]"
          initial={{ y: "100%", opacity: 0 }}
          animate={isInView ? { y: "0%", opacity: 1 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          {title}
        </motion.h2>
      </div>
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
      } as unknown as React.CSSProperties}
      className="w-full max-w-[480px] aspect-[4/3] rounded-2xl border shadow-2xl relative flex items-center justify-center select-none overflow-hidden cursor-none"
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

// ── COMPONENT: SECTION SPLIT ENTRY ────────────────────────────────────────────
// Slides in from left or right on scroll intersection
function SplitEntry({ children, from = "left", delay = 0, className = "" }: {
  children: React.ReactNode;
  from?: "left" | "right" | "bottom";
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-8% 0px -8% 0px" });

  const initial = from === "left" ? { x: -60, opacity: 0, filter: "blur(8px)" }
    : from === "right" ? { x: 60, opacity: 0, filter: "blur(8px)" }
    : { y: 50, opacity: 0, filter: "blur(6px)" };

  const animate = isInView
    ? { x: 0, y: 0, opacity: 1, filter: "blur(0px)" }
    : initial;

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── COMPONENT: STAGGERED COUNTER ──────────────────────────────────────────────
function AnimatedCounter({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5% 0px" });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col gap-0.5"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      <span className="text-xl md:text-2xl font-bold font-mono stat-value">{value}</span>
      <span className="font-mono text-[9px] text-[#3a3a3a] uppercase tracking-widest">{label}</span>
    </motion.div>
  );
}

// ── COMPONENT: WIPE DIVIDER ───────────────────────────────────────────────────
function WipeDivider({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5% 0px" });

  return (
    <motion.div
      ref={ref}
      className={`hairline-divider ${className}`}
      style={{ transformOrigin: "left center", scaleX: 0 }}
      animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
    />
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

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVel = useSpring(scrollVelocity, { stiffness: 100, damping: 22 });

  const gridY = useTransform(scrollY, [0, 6000], [0, -280]);
  const surfaceSkewY = useTransform(smoothVel, [-3000, 3000], [-2, 2]);
  const marqueeScale = useTransform(smoothVel, [-2500, 2500], [0.96, 1.04]);
  const marqueeSkew = useTransform(smoothVel, [-2500, 2500], [-6, 6]);
  const marqueeExtraX = useTransform(smoothVel, [-2500, 2500], [-40, 40]);

  // Hero parallax — multiple depth planes
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], [0, 160]);
  const heroScale = useTransform(heroScroll, [0, 1], [1, 0.88]);
  const heroOpacity = useTransform(heroScroll, [0, 0.85], [1, 0]);
  const heroBlur = useTransform(heroScroll, [0, 1], [0, 12]);
  const heroBlurFilter = useMotionTemplate`blur(${heroBlur}px)`;
  // Background parallax planes at different rates (depth illusion)
  const heroBgY = useTransform(heroScroll, [0, 1], [0, 80]);
  const heroFgY = useTransform(heroScroll, [0, 1], [0, 240]);

  // Manifesto
  const manifestoRef = useRef<HTMLElement>(null);
  const { scrollYProgress: manifestoScroll } = useScroll({ target: manifestoRef, offset: ["start end", "end start"] });
  const manifestoOpacity = useTransform(manifestoScroll, [0, 0.4, 0.9], [0, 1, 0]);

  // Vault ref
  const vaultRef = useRef<HTMLElement>(null);

  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const worksSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: worksScrollProgress } = useScroll({
    target: worksSectionRef,
    offset: ["start start", "end end"]
  });

  const worksXTranslation = useTransform(worksScrollProgress, [0, 1], ["0%", "-66.66%"]);
  const worksSpringX = useSpring(worksXTranslation, { stiffness: 100, damping: 22, mass: 0.5 });

  const currentCardIndex = useTransform(worksScrollProgress, [0, 0.33, 0.66, 1], [1, 1, 2, 3]);
  const [activeCardIndex, setActiveCardIndex] = useState(1);
  useEffect(() => {
    return currentCardIndex.on("change", (latest) => {
      setActiveCardIndex(Math.min(3, Math.max(1, Math.round(latest))));
    });
  }, [currentCardIndex]);

  // Parallax offsets for project visuals
  const card1Parallax = useTransform(worksScrollProgress, [0, 0.33], [0, 60]);
  const card2Parallax = useTransform(worksScrollProgress, [0.15, 0.5, 0.8], [-60, 0, 60]);
  const card3Parallax = useTransform(worksScrollProgress, [0.66, 1], [-60, 0]);

  // Section HUD tracking
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([null, null, null, null, null]);
  useEffect(() => {
    const fn = () => {
      const scrollPos = window.scrollY + window.innerHeight / 2;
      let found = 0;
      sectionRefs.current.forEach((el, i) => {
        if (!el) return;
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;
        if (scrollPos >= top && scrollPos < bottom) found = i;
      });
      setActiveSection(found);
    };
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollToWorks = () => {
    document.getElementById("selected-works-vault")?.scrollIntoView({ behavior: "smooth" });
  };

  const manifestoText = "I engineer systems that endure. Architecture is more than writing syntax—it is about sculpting resilient digital foundations that operate with uncompromising speed and physical precision. Every frame matters. Every compile counts. I build deterministic backends, low-latency pipelines, and hardware-accelerated interfaces designed to scale effortlessly and feel genuinely alive.";
  const manifestoWords = manifestoText.split(" ");

  // Bento variants — upgraded with rotateZ micro-tilt and blur
  const bentoContainer: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
  };
  const bentoCard: Variants = {
    hidden: { opacity: 0, y: 48, scale: 0.93, rotateZ: -1.5, filter: "blur(6px)" },
    show: {
      opacity: 1, y: 0, scale: 1, rotateZ: 0, filter: "blur(0px)",
      transition: { type: "spring", stiffness: 240, damping: 24 }
    }
  };



  return (
    <motion.main
      className="relative w-full min-h-screen text-[#f0ede8] overflow-x-clip font-sans"
      suppressHydrationWarning
    >
      {/* Scroll progress bar */}
      <ScrollProgressBar />

      {/* Section HUD */}
      <SectionHud activeSection={activeSection} />

      {/* Parallax dot grid */}
      <motion.div style={{ y: gridY }} className="parallax-grid-bg" />

      {/* Structural schematic lines */}
      <div className="schematic-grid hidden md:flex">
        {[0, 1, 2, 3].map(i => <div key={i} className="schematic-line-v" />)}
      </div>
      <div className="schematic-grid-h hidden md:flex">
        {[0, 1, 2].map(i => <div key={i} className="schematic-line-h" />)}
      </div>

      {/* Subtle mouse follow */}
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
        ref={(el) => { heroRef.current = el!; sectionRefs.current[0] = el; }}
        className="relative w-full min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 z-10 select-none overflow-hidden"
        suppressHydrationWarning
      >
        {/* Depth background layer — slowest parallax */}
        <motion.div
          className="hero-depth-bg"
          style={{ y: heroBgY, willChange: "transform" }}
        />

        {/* Vignette */}
        <div className="hero-vignette" />

        {/* Main hero content — medium parallax */}
        <motion.div
          style={{
            y: heroY,
            scale: heroScale,
            opacity: heroOpacity,
            filter: heroBlurFilter,
            willChange: "transform, opacity, filter"
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 18 }}
          className="max-w-6xl w-full flex flex-col gap-8 md:gap-12 relative z-10"
        >
          {/* Identifier Tag */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <span className="h-[1px] w-6 bg-[#D5B38E]/50" />
            <span className="font-mono text-[10px] text-[#D5B38E] tracking-[0.25em] uppercase font-medium">
              AMAAN // SOFTWARE & SYSTEMS ARCHITECTURE
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="tracking-tight leading-none flex flex-col gap-1">
            <span className="clip-mask text-huge font-extrabold text-[#f0ede8]">
              <LetterReveal text="Software Engineer." delayOffset={0.1} />
            </span>
            <span className="clip-mask serif-display" style={{ fontSize: "clamp(2rem, 5.5vw, 7rem)", lineHeight: 1.0 }}>
              <LetterReveal text="Architecting systems that endure." delayOffset={0.3} />
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
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

            <Magnetic range={55}>
              <Link
                href="/blog"
                data-cursor-label="READ"
                className="group btn-ghost px-7 py-3.5 text-[#f0ede8] font-semibold rounded-full flex items-center gap-3 text-sm cursor-none"
              >
                <span>Read Transmissions</span>
                <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </Link>
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

          {/* Stats — staggered counter reveal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-wrap gap-8 pt-4 border-t border-white/[0.05]"
          >
            {[
              { label: "Years Building", value: "3+" },
              { label: "Projects Shipped", value: "12+" },
              { label: "Uptime Target", value: "99.9%" },
              { label: "Users Served", value: "15K+" },
            ].map((s, i) => (
              <AnimatedCounter key={i} value={s.value} label={s.label} delay={1.2 + i * 0.08} />
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom discipline indicator */}
        <motion.div
          className="absolute bottom-12 right-8 md:right-16 pointer-events-none hidden md:block"
          style={{ y: heroFgY, opacity: heroOpacity, willChange: "transform, opacity" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <div className="font-mono text-[8px] text-[#3a3a3a] tracking-[0.25em] uppercase flex flex-col gap-1 text-right">
            <span>FULL-STACK // DISTRIBUTED SYSTEMS</span>
            <span>2026 REPOSITORY</span>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          style={{ opacity: heroOpacity }}
        >
          <span className="font-mono text-[8px] text-[#2e2e2e] tracking-[0.25em] uppercase">SCROLL</span>
          <motion.div
            className="w-[1px] h-8 bg-gradient-to-b from-white/20 to-transparent"
            animate={{ scaleY: [1, 0.4, 1], opacity: [0.6, 0.2, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* ── HAIRLINE DIVIDER ────────────────────────────────────────────── */}
      <WipeDivider className="relative z-10 mx-6 md:mx-16 lg:mx-24" />

      {/* ── MANIFESTO ───────────────────────────────────────────────────── */}
      <section
        ref={(el) => { manifestoRef.current = el!; sectionRefs.current[1] = el; }}
        className="relative py-32 px-6 md:px-16 lg:px-24 z-10 max-w-5xl mx-auto flex flex-col justify-center min-h-[70vh]"
      >
        {/* Ambient depth glow behind manifesto */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 40% at 50% 60%, rgba(255,255,255,0.008) 0%, transparent 70%)`,
            opacity: manifestoOpacity,
          }}
        />

        <div className="mb-12">
          <ScrollRevealHeader subtitle="PHILOSOPHY & VISION" title="Core Manifesto" />
        </div>

        {/* Manifesto words with blur+color+y scroll reveal */}
        <div className="flex flex-wrap leading-relaxed max-w-4xl">
          {manifestoWords.map((word, idx) => (
            <ManifestoWord key={idx} word={word} index={idx} total={manifestoWords.length} progress={manifestoScroll} />
          ))}
        </div>

        {/* Side decorative lines — slide in from edges */}
        <SplitEntry from="left" delay={0.3} className="mt-12">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-white/10" />
            <span className="font-mono text-[9px] text-[#2e2e2e] tracking-[0.2em]">ENGINEERING PHILOSOPHY // 2026</span>
          </div>
        </SplitEntry>
      </section>

      {/* ── TECH ARSENAL ────────────────────────────────────────────────── */}
      <section
        ref={(el) => { sectionRefs.current[2] = el; }}
        className="relative py-20 px-6 md:px-16 lg:px-24 z-10 max-w-6xl mx-auto flex flex-col gap-12 md:gap-16"
      >
        <motion.div style={{ skewY: surfaceSkewY }}>
          <ScrollRevealHeader subtitle="SYSTEM CORE COMPONENTS" title="The Tech Arsenal" />
        </motion.div>

        <motion.div
          variants={bentoContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.08 }}
          style={{ skewY: surfaceSkewY, transformStyle: "preserve-3d" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4"
        >
          {/* CARD — Next.js (wide) */}
          <motion.div variants={bentoCard} className="md:col-span-2">
            <TiltCard className="min-h-[240px]" spotlightColor="rgba(19, 115, 122, 0.18)">
              <div className="flex justify-between items-start w-full">
                <span className="font-mono text-[9px] text-[#81D1D0]/80 tracking-wider uppercase">CORE_FRAMEWORK // 01</span>
                <Cpu className="w-4 h-4 text-[#81D1D0]/70" />
              </div>
              <div className="mt-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-[#f0ede8] mb-2">Next.js 15</h3>
                  <p className="text-[#8a8a8a] text-xs md:text-sm max-w-md leading-relaxed mb-4">
                    Leveraging Next.js 15 with React 19 concurrent features. Architecting production systems utilizing advanced Server Actions, edge routing, and zero-bundle server components.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["React 19", "Server Components", "Edge Handlers", "Hydration Optimizations"].map(t => (
                      <span key={t} className="tag border-[#13737A]/30 text-[#81D1D0]/70">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="w-full md:w-32 h-24 shrink-0 rounded-xl border border-[#13737A]/20 bg-black/40 flex items-center justify-center">
                  <svg className="w-20 h-16" viewBox="0 0 100 80" fill="none">
                    <circle cx="50" cy="40" r="10" stroke="rgba(129, 209, 208, 0.3)" strokeWidth="1.5" />
                    <circle cx="50" cy="40" r="4" fill="rgba(19, 115, 122, 0.6)" />
                    <path d="M50 30 L50 12" stroke="rgba(129, 209, 208, 0.2)" strokeWidth="1.5" />
                    <path d="M40 40 L15 40" stroke="rgba(129, 209, 208, 0.2)" strokeWidth="1.5" />
                    <path d="M60 40 L85 40" stroke="rgba(129, 209, 208, 0.2)" strokeWidth="1.5" />
                    <path d="M50 50 L50 68" stroke="rgba(129, 209, 208, 0.2)" strokeWidth="1.5" />
                    <circle r="2" fill="#81D1D0"><animateMotion path="M 50 30 L 50 12" dur="1s" repeatCount="indefinite" /></circle>
                    <circle r="2" fill="#81D1D0"><animateMotion path="M 50 50 L 50 68" dur="1.3s" repeatCount="indefinite" /></circle>
                    <circle r="2" fill="#13737A"><animateMotion path="M 40 40 L 15 40" dur="0.9s" repeatCount="indefinite" /></circle>
                    <circle r="2" fill="#13737A"><animateMotion path="M 60 40 L 85 40" dur="1.1s" repeatCount="indefinite" /></circle>
                  </svg>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* CARD — FastAPI */}
          <motion.div variants={bentoCard}>
            <TiltCard className="min-h-[240px]" spotlightColor="rgba(246, 163, 51, 0.18)">
              <div className="flex justify-between items-start w-full">
                <span className="font-mono text-[9px] text-[#F6A333]/80 tracking-wider uppercase">BACKEND // 02</span>
                <Server className="w-4 h-4 text-[#F6A333]/70" />
              </div>
              <div className="mt-8">
                <h3 className="text-2xl font-bold tracking-tight text-[#f0ede8] mb-2">Python & FastAPI</h3>
                <p className="text-[#8a8a8a] text-xs leading-relaxed mb-4">
                  High-performance async API endpoints. Strict type validation with Pydantic and async-native database drivers.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["AsyncIO", "Pydantic v2", "FastAPI", "Uvicorn"].map(t => (
                    <span key={t} className="tag border-[#F6A333]/30 text-[#F6A333]/70">{t}</span>
                  ))}
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* CARD — React */}
          <motion.div variants={bentoCard}>
            <TiltCard className="min-h-[220px]" spotlightColor="rgba(129, 209, 208, 0.18)">
              <div className="flex justify-between items-start w-full">
                <span className="font-mono text-[9px] text-[#81D1D0]/80 tracking-wider uppercase">UI_LAYER // 03</span>
                <Activity className="w-4 h-4 text-[#81D1D0]/70" />
              </div>
              <div className="mt-8">
                <h3 className="text-2xl font-bold tracking-tight text-[#f0ede8] mb-2">React</h3>
                <p className="text-[#8a8a8a] text-xs leading-relaxed mb-4">
                  State machines, list virtualization, and custom hook bindings tailored for smooth rendering and high visual velocity.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Fiber", "Concurrent UI", "Hooks Engine"].map(t => (
                    <span key={t} className="tag border-[#81D1D0]/30 text-[#81D1D0]/70">{t}</span>
                  ))}
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* CARD — LangChain */}
          <motion.div variants={bentoCard}>
            <TiltCard className="min-h-[220px]" spotlightColor="rgba(0, 68, 55, 0.22)">
              <div className="flex justify-between items-start w-full">
                <span className="font-mono text-[9px] text-[#D4C792]/80 tracking-wider uppercase">AI // 04</span>
                <BrainCircuit className="w-4 h-4 text-[#D4C792]/70" />
              </div>
              <div className="mt-8">
                <h3 className="text-2xl font-bold tracking-tight text-[#f0ede8] mb-2">LangChain</h3>
                <p className="text-[#8a8a8a] text-xs leading-relaxed mb-4">
                  Multi-agent reasoning graphs, vector space routing algorithms, and hybrid RAG data pipelines for LLM integration.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Agentic Graphs", "Vector Embeddings", "RAG Pipelines"].map(t => (
                    <span key={t} className="tag border-[#D4C792]/30 text-[#D4C792]/70">{t}</span>
                  ))}
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* CARD — C++ */}
          <motion.div variants={bentoCard}>
            <TiltCard className="min-h-[220px]" spotlightColor="rgba(136, 57, 60, 0.22)">
              <div className="flex justify-between items-start w-full">
                <span className="font-mono text-[9px] text-[#88393C]/80 tracking-wider uppercase">SYSTEMS // 05</span>
                <Zap className="w-4 h-4 text-[#88393C]/70" />
              </div>
              <div className="mt-8">
                <h3 className="text-2xl font-bold tracking-tight text-[#f0ede8] mb-2">C++ & DSA</h3>
                <p className="text-[#8a8a8a] text-xs leading-relaxed mb-4">
                  Deterministic memory-efficient routines, low-latency algorithms, and high-performance compute bottlenecks.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["STL Algorithms", "Memory Control", "Thread Pools"].map(t => (
                    <span key={t} className="tag border-[#88393C]/30 text-[#88393C]/70">{t}</span>
                  ))}
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* CARD — PostgreSQL (full width) */}
          <motion.div variants={bentoCard} className="md:col-span-3">
            <TiltCard className="min-h-[180px]" spotlightColor="rgba(205, 170, 75, 0.18)">
              <div className="flex justify-between items-start w-full">
                <span className="font-mono text-[9px] text-[#CDAA4B]/80 tracking-wider uppercase">DATASTORAGE // 06</span>
                <Database className="w-4 h-4 text-[#CDAA4B]/70" />
              </div>
              <div className="mt-8 flex flex-col md:flex-row justify-between md:items-end gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-[#f0ede8] mb-2">PostgreSQL</h3>
                  <p className="text-[#8a8a8a] text-xs md:text-sm max-w-xl leading-relaxed mb-4">
                    Managing transactional integrity and complex vector querying. Optimizing relational query execution plans, indexing schemas (GIN/GiST), and dedicated pgvector storage.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["ACID Transactions", "pgvector Indexing", "Query Optimization", "CDC Pipeline"].map(t => (
                      <span key={t} className="tag border-[#CDAA4B]/30 text-[#CDAA4B]/70">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </motion.div>
      </section>

      {/* ── HAIRLINE DIVIDER ────────────────────────────────────────────── */}
      <WipeDivider className="relative z-10 mx-6 md:mx-16 lg:mx-24" />

      {/* ── VAULT — SELECTED WORKS ───────────────────────────────────────── */}
      <section
        id="selected-works-vault"
        ref={(el) => { vaultRef.current = el!; sectionRefs.current[3] = el; }}
        className="relative w-full z-10"
      >
        {/* Label */}
        <motion.div
          className="absolute top-8 left-6 md:left-16 z-30 section-marker"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-marker-line" />
          <span className="font-mono text-[9px] text-[#3a3a3a] tracking-[0.25em] uppercase">SELECTED_WORKS</span>
        </motion.div>

        <div className={isMobile ? "w-full flex flex-col" : "horizontal-scroll-container"} ref={worksSectionRef}>
          <div className={isMobile ? "w-full flex flex-col" : "horizontal-scroll-sticky"}>
            <motion.div
              className={isMobile ? "w-full flex flex-col" : "horizontal-scroll-track"}
              style={isMobile ? {} : { x: worksSpringX }}
            >
              {/* PROJECT 01 */}
              <div className={isMobile ? "w-full flex flex-col px-6 py-20 border-b border-white/[0.05]" : "horizontal-scroll-card"}>
                <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16 w-full max-w-6xl mx-auto relative h-full">
                  <motion.div 
                    className="w-full md:w-1/2 flex items-center justify-center"
                    style={isMobile ? {} : { x: card1Parallax }}
                  >
                    <VaultVisualContainer>
                      <div className="absolute top-4 left-4 font-mono text-[8px] text-white/20 z-50 pointer-events-none select-none">
                        PROJECT // 01
                      </div>
                      <GroundTruthVisual />
                    </VaultVisualContainer>
                  </motion.div>
                  <div className="w-full md:w-1/2 flex flex-col gap-6 max-w-lg relative">
                    <div className="absolute -right-12 -top-20 font-mono text-[160px] font-black text-white/[0.015] leading-none pointer-events-none select-none hidden md:block">
                      01
                    </div>
                    <SplitEntry from="left">
                      <div className="section-marker">
                        <span className="section-marker-line" />
                        <span className="font-mono text-[10px] text-white/50 tracking-[0.25em] font-semibold uppercase">PROJECT_01 // DETERMINISTIC_RAG</span>
                      </div>
                    </SplitEntry>
                    <div className="overflow-hidden">
                      <motion.h3
                        className="tracking-tight leading-tight"
                        style={{ fontSize: "clamp(2.4rem, 4.5vw, 4rem)" }}
                        initial={{ y: "100%" }}
                        whileInView={{ y: "0%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <span className="font-extrabold text-[#f0ede8] block">Ground Truth</span>
                        <span className="serif-display text-[#f0ede8]/70 block" style={{ fontSize: "0.9em" }}>Engine</span>
                      </motion.h3>
                    </div>
                    <SplitEntry from="bottom" delay={0.1}>
                      <div className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md shadow-xl">
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#f0ede8]/60" />
                          <span className="font-mono text-[9.5px] text-[#f0ede8]/60 font-semibold uppercase tracking-[0.2em]">Architecture Brief</span>
                        </div>
                        <p className="text-[#d8d5d0] text-sm md:text-[14.5px] leading-relaxed font-normal antialiased">An advanced Retrieval-Augmented Generation platform engineered to eliminate hallucination risks. Employs a deterministic 5-layer framework that parses documents, routes semantic intent, and synthesizes vectorized context.</p>
                      </div>
                    </SplitEntry>
                    <SplitEntry from="bottom" delay={0.2}>
                      <ul className="space-y-2.5">
                        {[
                          "5-layer deterministic ingestion, intent parsing, and semantic routing pipeline.",
                          "Strict cosine-similarity vector thresholds preventing hallucination leaks.",
                          "pgvector storage engine achieving sub-180ms document indexation and retrieval."
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-[12.5px] md:text-[13px] text-[#b8b5b0] leading-relaxed">
                            <span className="mt-1 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-white/[0.06] border border-white/10 text-[8px] font-mono text-[#f0ede8]/60">
                              //
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </SplitEntry>
                    <SplitEntry from="bottom" delay={0.3}>
                      <div className="grid grid-cols-2 gap-6 border-y border-white/[0.08] py-4 bg-white/[0.01] px-1">
                        <div className="border-r border-white/[0.06] pr-4">
                          <span className="font-mono text-[9px] text-[#8a8a8a] block uppercase tracking-[0.2em] mb-1">Latency Response</span>
                          <span className="text-xl md:text-2xl font-bold font-mono text-[#f5f3ef] tracking-tight">&lt; 180ms</span>
                        </div>
                        <div className="pl-2">
                          <span className="font-mono text-[9px] text-[#8a8a8a] block uppercase tracking-[0.2em] mb-1">Accuracy Target</span>
                          <span className="text-xl md:text-2xl font-bold font-mono text-[#f5f3ef] tracking-tight">99.8% Hallucination-Free</span>
                        </div>
                      </div>
                    </SplitEntry>
                    <div className="pt-2">
                      <Magnetic range={45}>
                        <Link
                          href="/vessel/ground-truth-engine"
                          data-cursor-label="EXPLORE"
                          className="btn-project-cta group cursor-none"
                        >
                          <span>Explore Architecture Dossier</span>
                          <div className="cta-icon-badge">
                            <ArrowUpRight className="w-3.5 h-3.5 text-white/80 group-hover:text-white" />
                          </div>
                        </Link>
                      </Magnetic>
                    </div>
                  </div>
                </div>
              </div>

              {/* PROJECT 02 */}
              <div className={isMobile ? "w-full flex flex-col px-6 py-20 border-b border-white/[0.05]" : "horizontal-scroll-card"}>
                <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16 w-full max-w-6xl mx-auto relative h-full">
                  <motion.div 
                    className="w-full md:w-1/2 flex items-center justify-center"
                    style={isMobile ? {} : { x: card2Parallax }}
                  >
                    <VaultVisualContainer>
                      <div className="absolute top-4 left-4 font-mono text-[8px] text-white/20 z-50 pointer-events-none select-none">
                        PROJECT // 02
                      </div>
                      <WorkspaceVisual />
                    </VaultVisualContainer>
                  </motion.div>
                  <div className="w-full md:w-1/2 flex flex-col gap-6 max-w-lg relative">
                    <div className="absolute -right-12 -top-20 font-mono text-[160px] font-black text-white/[0.015] leading-none pointer-events-none select-none hidden md:block">
                      02
                    </div>
                    <SplitEntry from="left">
                      <div className="section-marker">
                        <span className="section-marker-line" />
                        <span className="font-mono text-[10px] text-white/50 tracking-[0.25em] font-semibold uppercase">PROJECT_02 // ENTERPRISE_PORTAL</span>
                      </div>
                    </SplitEntry>
                    <div className="overflow-hidden">
                      <motion.h3
                        className="tracking-tight leading-tight"
                        style={{ fontSize: "clamp(2.4rem, 4.5vw, 4rem)" }}
                        initial={{ y: "100%" }}
                        whileInView={{ y: "0%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <span className="font-extrabold text-[#f0ede8] block">Centralized</span>
                        <span className="serif-display text-[#f0ede8]/70 block" style={{ fontSize: "0.9em" }}>Workspace</span>
                      </motion.h3>
                    </div>
                    <SplitEntry from="bottom" delay={0.1}>
                      <div className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md shadow-xl">
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#f0ede8]/60" />
                          <span className="font-mono text-[9.5px] text-[#f0ede8]/60 font-semibold uppercase tracking-[0.2em]">Enterprise Brief</span>
                        </div>
                        <p className="text-[#d8d5d0] text-sm md:text-[14.5px] leading-relaxed font-normal antialiased">A high-security, low-latency intranet dashboard portal servicing Banaras Locomotive Works. Consolidates databases, proxies legacy Oracle systems, and manages staff operations.</p>
                      </div>
                    </SplitEntry>
                    <SplitEntry from="bottom" delay={0.2}>
                      <ul className="space-y-2.5">
                        {[
                          "Servicing 15,000+ active enterprise directory profiles with RBAC security.",
                          "Real-time legacy sync middleware proxying Oracle tables securely.",
                          "Edge-cached API endpoints reducing database query latency to 45ms."
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-[12.5px] md:text-[13px] text-[#b8b5b0] leading-relaxed">
                            <span className="mt-1 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-white/[0.06] border border-white/10 text-[8px] font-mono text-[#f0ede8]/60">
                              //
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </SplitEntry>
                    <SplitEntry from="bottom" delay={0.3}>
                      <div className="grid grid-cols-2 gap-6 border-y border-white/[0.08] py-4 bg-white/[0.01] px-1">
                        <div className="border-r border-white/[0.06] pr-4">
                          <span className="font-mono text-[9px] text-[#8a8a8a] block uppercase tracking-[0.2em] mb-1">Deployed Footprint</span>
                          <span className="text-xl md:text-2xl font-bold font-mono text-[#f5f3ef] tracking-tight">15K+ Active Users</span>
                        </div>
                        <div className="pl-2">
                          <span className="font-mono text-[9px] text-[#8a8a8a] block uppercase tracking-[0.2em] mb-1">Proxy Speed</span>
                          <span className="text-xl md:text-2xl font-bold font-mono text-[#f5f3ef] tracking-tight">45ms Avg Latency</span>
                        </div>
                      </div>
                    </SplitEntry>
                    <div className="pt-2">
                      <Magnetic range={45}>
                        <Link
                          href="/vessel/blw-portal"
                          data-cursor-label="CASE STUDY"
                          className="btn-project-cta group cursor-none"
                        >
                          <span>Read Enterprise Case Study</span>
                          <div className="cta-icon-badge">
                            <ArrowUpRight className="w-3.5 h-3.5 text-white/80 group-hover:text-white" />
                          </div>
                        </Link>
                      </Magnetic>
                    </div>
                  </div>
                </div>
              </div>

              {/* PROJECT 03 */}
              <div className={isMobile ? "w-full flex flex-col px-6 py-20" : "horizontal-scroll-card"}>
                <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16 w-full max-w-6xl mx-auto relative h-full">
                  <motion.div 
                    className="w-full md:w-1/2 flex items-center justify-center"
                    style={isMobile ? {} : { x: card3Parallax }}
                  >
                    <VaultVisualContainer>
                      <div className="absolute top-4 left-4 font-mono text-[8px] text-white/20 z-50 pointer-events-none select-none">
                        PROJECT // 03
                      </div>
                      <BroccoliVisual />
                    </VaultVisualContainer>
                  </motion.div>
                  <div className="w-full md:w-1/2 flex flex-col gap-6 max-w-lg relative">
                    <div className="absolute -right-12 -top-20 font-mono text-[160px] font-black text-white/[0.015] leading-none pointer-events-none select-none hidden md:block">
                      03
                    </div>
                    <SplitEntry from="left">
                      <div className="section-marker">
                        <span className="section-marker-line" />
                        <span className="font-mono text-[10px] text-white/50 tracking-[0.25em] font-semibold uppercase">PROJECT_03 // WEB_SYSTEM</span>
                      </div>
                    </SplitEntry>
                    <div className="overflow-hidden">
                      <motion.h3
                        className="tracking-tight leading-tight"
                        style={{ fontSize: "clamp(2.4rem, 4.5vw, 4rem)" }}
                        initial={{ y: "100%" }}
                        whileInView={{ y: "0%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <span className="font-extrabold text-[#f0ede8] block">pink-broccoli</span>
                        <span className="serif-display text-[#f0ede8]/70 block" style={{ fontSize: "0.9em" }}>Laminar build.</span>
                      </motion.h3>
                    </div>
                    <SplitEntry from="bottom" delay={0.1}>
                      <div className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md shadow-xl">
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#f0ede8]/60" />
                          <span className="font-mono text-[9.5px] text-[#f0ede8]/60 font-semibold uppercase tracking-[0.2em]">Frontend Architecture</span>
                        </div>
                        <p className="text-[#d8d5d0] text-sm md:text-[14.5px] leading-relaxed font-normal antialiased">A high-velocity, design-forward web application compiled with custom layout structures, pre-rendered vector graphics, and optimized component pipelines achieving near-zero GC delays.</p>
                      </div>
                    </SplitEntry>
                    <SplitEntry from="bottom" delay={0.2}>
                      <ul className="space-y-2.5">
                        {[
                          "Lighthouse Performance score hitting a flawless 100/100 across platforms.",
                          "Virtualized list rendering engine with zero layout thrashing or stutter.",
                          "Minimalist memory footprint with instant hydration and high visual velocity."
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-[12.5px] md:text-[13px] text-[#b8b5b0] leading-relaxed">
                            <span className="mt-1 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-white/[0.06] border border-white/10 text-[8px] font-mono text-[#f0ede8]/60">
                              //
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </SplitEntry>
                    <SplitEntry from="bottom" delay={0.3}>
                      <div className="grid grid-cols-2 gap-6 border-y border-white/[0.08] py-4 bg-white/[0.01] px-1">
                        <div className="border-r border-white/[0.06] pr-4">
                          <span className="font-mono text-[9px] text-[#8a8a8a] block uppercase tracking-[0.2em] mb-1">LCP Load Speed</span>
                          <span className="text-xl md:text-2xl font-bold font-mono text-[#f5f3ef] tracking-tight">0.52 Seconds</span>
                        </div>
                        <div className="pl-2">
                          <span className="font-mono text-[9px] text-[#8a8a8a] block uppercase tracking-[0.2em] mb-1">Gzipped Bundle</span>
                          <span className="text-xl md:text-2xl font-bold font-mono text-[#f5f3ef] tracking-tight">&lt; 42 KB</span>
                        </div>
                      </div>
                    </SplitEntry>
                    <div className="pt-2">
                      <Magnetic range={45}>
                        <Link
                          href="/vessel/Laminar"
                          data-cursor-label="LIVE DEMO"
                          className="btn-project-cta group cursor-none"
                        >
                          <span>Launch Interactive UI Build</span>
                          <div className="cta-icon-badge">
                            <ArrowUpRight className="w-3.5 h-3.5 text-white/80 group-hover:text-white" />
                          </div>
                        </Link>
                      </Magnetic>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Dynamic bottom HUD for the horizontal scroll deck */}
        {!isMobile && (
          <div className="absolute left-8 bottom-8 md:bottom-12 font-mono text-[10px] tracking-widest text-[#f0ede8]/30 flex items-center gap-3 z-30 animate-fade-in">
            <span className="text-[#f0ede8] font-bold">0{activeCardIndex}</span>
            <div className="w-12 h-[1px] bg-white/10 relative">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-[#f0ede8]"
                animate={{ width: `${(activeCardIndex / 3) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span>03</span>
          </div>
        )}
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <FooterSection sectionRef={(el: HTMLElement | null) => { sectionRefs.current[4] = el; }} marqueeScale={marqueeScale} marqueeSkew={marqueeSkew} marqueeExtraX={marqueeExtraX} />
    </motion.main>
  );
}

// ── COMPONENT: FOOTER SECTION (cinematic clip-path reveal) ────────────────────
function FooterSection({
  sectionRef,
  marqueeScale,
  marqueeSkew,
  marqueeExtraX,
}: {
  sectionRef: (el: HTMLElement | null) => void;
  marqueeScale: MotionValue<number>;
  marqueeSkew: MotionValue<number>;
  marqueeExtraX: MotionValue<number>;
}) {
  const ref = useRef<HTMLElement>(null);

  return (
    <footer
      ref={(el) => { (ref as React.MutableRefObject<HTMLElement | null>).current = el; sectionRef(el); }}
      className="relative w-full z-20 pt-28 pb-16 px-6 md:px-16 lg:px-24 flex flex-col justify-end min-h-[55vh] border-t border-white/[0.1] select-none overflow-hidden bg-[#090909]"
    >
      {/* Dramatic ambient radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-6xl w-full mx-auto flex flex-col gap-12 md:gap-16 relative z-10">
        {/* Marquee — velocity-warped */}
        <motion.div
          style={{ scale: marqueeScale, skewY: marqueeSkew, x: marqueeExtraX, willChange: "transform" }}
          data-cursor-label="TALK"
          className="w-full overflow-hidden flex flex-col gap-2 border-t border-b border-white/[0.1] py-8 md:py-10 cursor-none"
        >
          <motion.div 
            variants={marqueeL as Variants} 
            animate="animate" 
            className="flex text-marquee leading-none uppercase font-black tracking-tighter w-[200%] gap-12 select-none text-[#f0ede8]"
            style={{
              textShadow: "0 0 35px rgba(246, 163, 51, 0.2), 0 0 70px rgba(19, 115, 122, 0.16)"
            }}
          >
            {[0, 1].map(i => (
              <div key={i} className="flex justify-around min-w-full shrink-0 gap-12">
                <span>LET&apos;S TALK</span><span className="text-[#F6A333]/50">•</span>
                <span>LET&apos;S TALK</span><span className="text-[#13737A]/50">•</span>
                <span>LET&apos;S TALK</span><span className="text-[#D4C792]/50">•</span>
              </div>
            ))}
          </motion.div>
          {/* Second line — italic serif */}
          <motion.div variants={marqueeR as Variants} animate="animate" className="flex leading-none w-[200%] gap-12 select-none" style={{ fontSize: "clamp(1.5rem, 4vw, 4rem)" }}>
            {[0, 1].map(i => (
              <div key={i} className="flex justify-around min-w-full shrink-0 gap-12 serif-display text-white/40">
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
              href="mailto:amaaxx1301@outlook.com"
              data-cursor-label="EMAIL"
              className="group flex items-center gap-3 px-6 py-3.5 rounded-full bg-white/[0.05] border border-white/15 hover:border-white/40 hover:bg-white/[0.1] transition-all duration-300 cursor-none shadow-lg"
            >
              <Mail className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
              <span className="font-mono text-sm text-[#f0ede8] font-medium tracking-wide">amaaxx1301@outlook.com</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white/50 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          </Magnetic>

          <div className="flex gap-6 items-center">
            {[
              { label: "GITHUB", href: "https://github.com/amaaxx" },
              { label: "LINKEDIN", href: "https://linkedin.com/in/amaaxx" },
            ].map(({ label, href }, i) => (
              <React.Fragment key={label}>
                {i > 0 && <span className="w-[1px] h-3 bg-white/20" />}
                <Magnetic>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-label="EXTERNAL"
                    className="font-mono text-xs text-white/70 hover:text-white font-medium tracking-wider transition-colors cursor-none py-1"
                  >
                    {label}
                  </a>
                </Magnetic>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-white/[0.08]">
          <div className="font-mono text-[10px] text-white/50 text-center md:text-left leading-relaxed">
            <div className="font-semibold text-white/70">DESIGNED & ENGINEERED BY AMAAN</div>
            <div>© 2026 AMAAN • ALL RIGHTS RESERVED</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-white/40 font-medium">BUILT WITH</span>
            {["NEXT.JS 15", "FRAMER MOTION", "LENIS", "TAILWIND"].map(tech => (
              <span key={tech} className="px-2.5 py-1 rounded-full font-mono text-[8px] font-medium bg-white/[0.06] border border-white/10 text-white/80">{tech}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}