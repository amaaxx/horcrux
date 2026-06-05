"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useVelocity,
  useMotionTemplate,
  useMotionValueEvent,
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
  Layers,
  Zap
} from "lucide-react";
import Lenis from "lenis";
import {
  GroundTruthVisual,
  WorkspaceVisual,
  BroccoliVisual
} from "@/components/ProjectVisuals";

// ── CUSTOM HOOK: TRACK GLOBAL MOUSE POSITION (GPU ONLY) ───────────────────────
function useMousePosition() {
  const mouse = {
    x: useMotionValue(-200),
    y: useMotionValue(-200),
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x.set(e.clientX);
      mouse.y.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouse.x, mouse.y]);

  return mouse;
}

// ── COMPONENT: MAGNETIC CONTAINER (REFLECTIVE OPTIMIZED) ──────────────────────
interface MagneticProps {
  children: React.ReactElement<any>;
  range?: number;
}

function Magnetic({ children, range = 45 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 160, damping: 15, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 160, damping: 15, mass: 0.4 });

  const cachedBounds = useRef<{ cx: number; cy: number } | null>(null);

  const handleMouseEnter = () => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    cachedBounds.current = {
      cx: rect.left + rect.width / 2,
      cy: rect.top + rect.height / 2,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cachedBounds.current) return;
    const { cx, cy } = cachedBounds.current;
    const distanceX = e.clientX - cx;
    const distanceY = e.clientY - cy;

    const distance = Math.hypot(distanceX, distanceY);
    if (distance < range) {
      x.set(distanceX * 0.38);
      y.set(distanceY * 0.38);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    cachedBounds.current = null;
  };

  return (
    <motion.div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      {React.cloneElement(children, {
        "data-cursor": "pointer",
      })}
    </motion.div>
  );
}

// ── COMPONENT: 3D TILT GLASS CARD WITH LIQUID SPOTLIGHT ───────────────────────
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  index?: number;
}

function TiltCard({ children, className = "", glowColor = "rgba(79, 70, 229, 0.12)", index = 0 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(true);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 180, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 180, damping: 20 });

  // Liquid hover spotlight coordinates
  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);
  const spotlightOpacity = useSpring(0, { stiffness: 150, damping: 20 });

  const cachedRect = useRef<{ left: number; top: number; width: number; height: number } | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    cachedRect.current = {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height,
    };
    if (!isMobile) spotlightOpacity.set(1);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cachedRect.current) return;
    const { left, top, width, height } = cachedRect.current;

    const pageX = e.pageX;
    const pageY = e.pageY;
    const rx = pageX - left;
    const ry = pageY - top;

    spotlightX.set(rx);
    spotlightY.set(ry);

    if (!isMobile) {
      const px = rx / width - 0.5;
      const py = ry / height - 0.5;
      x.set(px);
      y.set(py);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    spotlightOpacity.set(0);
    cachedRect.current = null;
  };

  // Safe TS String parsing for GPU gradient sweeps
  const spotlightGradient = useMotionTemplate`radial-gradient(280px circle at ${spotlightX}px ${spotlightY}px, ${glowColor}, rgba(255,255,255,0.01) 60%, transparent 100%)`;

  return (
    <motion.div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isMobile ? 0 : rotateX,
        rotateY: isMobile ? 0 : rotateY,
        transformStyle: "preserve-3d",
        z: 0,
        willChange: "transform",
      }}
      className={`glass-surface rounded-3xl p-6 md:p-8 relative overflow-hidden transition-colors duration-500 hover:border-white/12 ${className}`}
    >
      {/* Liquid spotlight layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          opacity: spotlightOpacity,
          background: spotlightGradient,
          willChange: "opacity",
        }}
      />

      {/* Dynamic persistent floating content layer desynchronized using index */}
      <motion.div
        style={{ z: 20 }}
        className="h-full flex flex-col justify-between relative z-10 will-change-transform"
        animate={{ y: [0, -5, 0] }}
        transition={{
          duration: 4.5 + (index % 3) * 0.7,
          repeat: Infinity,
          repeatType: "reverse" as const,
          ease: "easeInOut" as const,
          delay: (index % 3) * 0.3
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// ── COMPONENT: MANIFESTO WORD HIGHLIGHTER ─────────────────────────────────────
function ManifestoWord({ word, index, total, progress }: { word: string; index: number; total: number; progress: MotionValue<number> }) {
  const start = 0.15 + (index / total) * 0.55;
  const end = start + 0.04;
  const opacity = useTransform(progress, [start, end], [0.18, 1]);

  return (
    <motion.span
      style={{ opacity, willChange: "opacity" }}
      className="inline-block mr-[0.24em] font-sans font-semibold text-2xl md:text-5xl lg:text-6xl tracking-tight text-neutral-200 hover:text-white transition-colors duration-300"
    >
      {word}
    </motion.span>
  );
}

// ── COMPONENT: VAULT CARD STACK FOCAL TRANSITION (Apple/Stripe Inspired) ──────
function VaultCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Scale: dynamic zoom lens focus at center
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.88, 1.0, 0.88]);
  // Opacity: high visibility at center focal point
  const opacity = useTransform(scrollYProgress, [0.1, 0.42, 0.58, 0.9], [0.3, 1.0, 1.0, 0.3]);
  // RotateX: 3D perspective scroll tilt
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, -8]);

  const springScale = useSpring(scale, { stiffness: 120, damping: 20 });
  const springOpacity = useSpring(opacity, { stiffness: 120, damping: 20 });
  const springRotateX = useSpring(rotateX, { stiffness: 120, damping: 20 });

  return (
    <motion.div
      ref={ref}
      style={{
        scale: springScale,
        opacity: springOpacity,
        rotateX: springRotateX,
        transformStyle: "preserve-3d",
        z: 0,
        willChange: "transform, opacity",
      }}
      className="min-h-screen flex flex-col justify-center px-8 md:px-16 py-20"
    >
      {children}
    </motion.div>
  );
}

// ── COMPONENT: SCROLL REVEAL HEADER (Guglieri / Stokt Inspired 3D Tilt Enters) ──
interface ScrollRevealHeaderProps {
  subtitle: string;
  title: string;
}

function ScrollRevealHeader({ subtitle, title }: ScrollRevealHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 0.35, 0.75], [50, 0, -25]);
  const rotateX = useTransform(scrollYProgress, [0, 0.35, 0.75], [20, 0, -12]);
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.35, 0.75], [0, 0.6, 1, 0.8]);

  const springY = useSpring(y, { stiffness: 90, damping: 18 });
  const springRotateX = useSpring(rotateX, { stiffness: 90, damping: 18 });
  const springOpacity = useSpring(opacity, { stiffness: 90, damping: 18 });

  return (
    <motion.div
      ref={ref}
      style={{
        y: springY,
        rotateX: springRotateX,
        opacity: springOpacity,
        transformStyle: "preserve-3d",
        perspective: 1200,
        willChange: "transform, opacity",
      }}
      className="flex flex-col gap-2"
    >
      <span className="font-mono text-[10px] md:text-xs text-neutral-500 tracking-[0.25em] uppercase">{subtitle}</span>
      <h2 className="text-section-title premium-text-primary tracking-tight">{title}</h2>
    </motion.div>
  );
}

// ── COMPONENT: VAULT ISOMETRIC MOUSE PERSPECTIVE CONTAINER ────────────────────
function VaultVisualContainer({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 140, damping: 24 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 140, damping: 24 });
  const scale = useSpring(1, { stiffness: 180, damping: 22 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseEnter = () => scale.set(1.025);
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d",
        z: 0,
        willChange: "transform, scale",
      }}
      className="w-[85%] h-[60%] md:h-[65%] rounded-3xl glass-surface border border-white/10 shadow-2xl relative flex items-center justify-center select-none overflow-hidden bg-[#07070f]/60 cursor-none"
      data-cursor-label="TILT"
    >
      {children}
    </motion.div>
  );
}

// Inline SVG components
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// ── COMPONENT: SPRING CHARACTER REVEAL ───────────────────────────────────────
function LetterReveal({ text, delayOffset = 0 }: { text: string; delayOffset: number }) {
  return (
    <span className="inline-block whitespace-nowrap">
      {text.split("").map((char, idx) => (
        <span key={idx} className="inline-block overflow-hidden pb-[0.05em] vertical-align-bottom">
          <motion.span
            className="inline-block origin-bottom-left"
            initial={{ y: "105%", rotate: 6, skewY: 4, scale: 0.9 }}
            animate={{ y: 0, rotate: 0, skewY: 0, scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 110,
              damping: 14,
              mass: 0.5,
              delay: delayOffset + idx * 0.025 
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ── MAIN LANDING PAGE ──────────────────────────────────────────────────────────
export default function Home() {
  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const { x, y } = useMousePosition();
  const glowX = useSpring(x, { stiffness: 70, damping: 24 });
  const glowY = useSpring(y, { stiffness: 70, damping: 24 });

  const { scrollY, scrollYProgress } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothedVelocity = useSpring(scrollVelocity, { stiffness: 100, damping: 22 });

  const pageBgColor = useTransform(
    scrollYProgress,
    [0, 0.22, 0.45, 0.72, 1],
    ["#05050a", "#070712", "#09071a", "#050c12", "#05050a"]
  );

  const gridY = useTransform(scrollY, [0, 6000], [0, -320]);
  const surfaceSkewY = useTransform(smoothedVelocity, [-3000, 3000], [-2.5, 2.5]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(heroScroll, [0, 1], [0, 160]);
  const heroScale = useTransform(heroScroll, [0, 1], [1, 0.92]);
  const heroOpacity = useTransform(heroScroll, [0, 0.95], [1, 0]);

  const manifestoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: manifestoScroll } = useScroll({
    target: manifestoRef,
    offset: ["start end", "end start"],
  });

  // ── FIX: FOOLPROOF VAULT SCROLL TRACKER ──
  // Mathematically links activeIndex directly to the Vault's scroll progression, immune to 3D bounding box glitches.
  const [activeIndex, setActiveIndex] = useState(0);
  const vaultRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!vaultRef.current) return;
      const rect = vaultRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;
      
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      
      if (progress < 0.33) {
        setActiveIndex(0);
      } else if (progress < 0.66) {
        setActiveIndex(1);
      } else {
        setActiveIndex(2);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const footerRef = useRef<HTMLDivElement>(null);
  const marqueeSkew = useTransform(smoothedVelocity, [-2500, 2500], [-8, 8]);
  const marqueeScale = useTransform(smoothedVelocity, [-2500, 2500], [0.95, 1.05]);
  const marqueeExtraX = useTransform(smoothedVelocity, [-2500, 2500], [-60, 60]);

  const marqueeGlowRadius = useTransform(smoothedVelocity, (val) => {
    const absVal = Math.min(Math.abs(val), 2500);
    return (absVal / 2500) * 30 + 3;
  });
  const marqueeGlow = useMotionTemplate`0 0 ${marqueeGlowRadius}px rgba(79, 70, 229, 0.5)`;

  const heroWordLine1 = "Software Engineer.".split(" ");
  const heroWordLine2 = "Architecting Production-Grade Systems.".split(" ");
  const manifestoText = "We engineer systems that endure. Coding is more than writing logic—it is about sculpting digital architecture that flows with absolute speed and physical precision. Every frame matters. Every compile counts. We build with hardware-accelerated layouts, tactile responsive animations, and cinematic aesthetics to deliver an experience that feels alive.";
  const manifestoWords = manifestoText.split(" ");

  const scrollToWorks = () => {
    const worksSection = document.getElementById("selected-works-vault");
    if (worksSection) worksSection.scrollIntoView({ behavior: "smooth" });
  };

  const bentoContainerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const bentoCardVariants: Variants = {
    hidden: { opacity: 0, y: 35, scale: 0.96 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } }
  };

  return (
    <motion.main
      style={{ backgroundColor: pageBgColor }}
      className="relative w-full min-h-screen text-neutral-200 selection:bg-white/20 overflow-x-hidden font-sans"
      suppressHydrationWarning
    >
      <motion.div style={{ y: gridY }} className="parallax-grid-bg" />

      {/* Schematic Grid Backdrops */}
      <div className="schematic-grid hidden md:flex">
        <div className="schematic-line-v" />
        <div className="schematic-line-v" />
        <div className="schematic-line-v" />
        <div className="schematic-line-v" />
      </div>
      <div className="schematic-grid-h hidden md:flex">
        <div className="schematic-line-h" />
        <div className="schematic-line-h" />
        <div className="schematic-line-h" />
      </div>

      {/* Interactive Hero Light Leak follows user mouse safely using CSS positioning */}
      <motion.div
        className="fixed top-0 left-0 w-[500px] h-[500px] -ml-[250px] -mt-[250px] rounded-full pointer-events-none z-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.08)_0%,rgba(51,65,85,0.04)_55%,transparent_75%)] hidden md:block"
        style={{
          x: glowX,
          y: glowY,
          transformStyle: "preserve-3d",
          z: 0,
          willChange: "transform",
        }}
      />

      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.05 } }
        }}
      >
        {/* ── HERO SECTION ──────────────────────────────────────────────────────── */}
        <section
          ref={heroRef}
          className="relative w-full min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 z-10 select-none overflow-hidden"
          suppressHydrationWarning
        >
          <motion.div
            style={{
              y: heroY,
              scale: heroScale,
              opacity: heroOpacity,
              transformStyle: "preserve-3d",
              z: 0,
              willChange: "transform, opacity",
            }}
            variants={{
              hidden: { opacity: 0, y: 35 },
              show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
            }}
            className="max-w-6xl w-full flex flex-col gap-8 md:gap-12"
          >
            <div className="flex items-center gap-3">
              <span className="h-[1px] w-12 bg-neutral-700" />
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="font-mono text-[10px] md:text-xs text-neutral-500 tracking-[0.25em] uppercase"
              >
                AMAAN // PLATFORM ENGINE
              </motion.span>
            </div>

            <h1 className="text-huge tracking-tight leading-none font-extrabold max-w-5xl flex flex-col gap-2 premium-text-primary">
              <span className="clip-mask">
                <LetterReveal text="Software Engineer." delayOffset={0.1} />
              </span>

              <span className="clip-mask">
                <LetterReveal text="Architecting Production-Grade Systems." delayOffset={0.3} />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.7 }}
              className="text-neutral-400 text-sm md:text-lg lg:text-xl font-light tracking-wide max-w-2xl leading-relaxed"
            >
              Developing low-latency pipelines, scalable web microservices, and high-performance user interfaces with meticulous engineering practices.
            </motion.p>

            <div className="mt-4 flex flex-wrap gap-4 items-center">
              <Magnetic range={50}>
                <button
                  onClick={scrollToWorks}
                  data-cursor-label="EXPLORE"
                  className="group relative px-8 py-4 bg-white text-black font-semibold rounded-full flex items-center gap-3 transition-transform duration-300 active:scale-95 shadow-[0_0_35px_rgba(255,255,255,0.15)] text-sm md:text-base cursor-none"
                >
                  <span>Explore Selected Works</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Magnetic>

              <div className="flex gap-4">
                <a
                  href="https://github.com/amaaxx"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-label="GITHUB"
                  className="p-3.5 rounded-full border border-white/5 hover:border-white/20 bg-white/5 backdrop-blur-sm transition-all duration-300 active:scale-90 text-neutral-400 hover:text-white"
                >
                  <GithubIcon className="w-4.5 h-4.5" />
                </a>
                <a
                  href="https://linkedin.com/in/amaaxx"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-label="LINKEDIN"
                  className="p-3.5 rounded-full border border-white/5 hover:border-white/20 bg-white/5 backdrop-blur-sm transition-all duration-300 active:scale-90 text-neutral-400 hover:text-white"
                >
                  <LinkedinIcon className="w-4.5 h-4.5" />
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── THE MANIFESTO & ETHOS ─────────────────── */}
        <section
          ref={manifestoRef}
          className="relative py-32 px-6 md:px-16 lg:px-24 z-10 max-w-5xl mx-auto flex flex-col justify-center min-h-[70vh]"
          suppressHydrationWarning
        >
          <div className="mb-10">
            <ScrollRevealHeader subtitle="PHILOSOPHY & VISION" title="Core Manifesto" />
          </div>

          <div className="flex flex-wrap leading-relaxed max-w-4xl">
            {manifestoWords.map((word, idx) => (
              <ManifestoWord
                key={idx}
                word={word}
                index={idx}
                total={manifestoWords.length}
                progress={manifestoScroll}
              />
            ))}
          </div>
        </section>

        {/* ── THE TECH ARSENAL ── */}
        <section className="relative py-20 px-6 md:px-16 lg:px-24 z-10 max-w-6xl mx-auto flex flex-col gap-12 md:gap-16" suppressHydrationWarning>
          <motion.div style={{ skewY: surfaceSkewY }} className="will-change-transform" suppressHydrationWarning>
            <ScrollRevealHeader subtitle="SYSTEM CORE COMPONENTS" title="The Tech Arsenal" />
          </motion.div>

          <motion.div
            variants={bentoContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            style={{ skewY: surfaceSkewY, transformStyle: "preserve-3d" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 will-change-transform"
          >
            <motion.div variants={bentoCardVariants} className="md:col-span-2">
              <TiltCard className="min-h-[240px]" glowColor="rgba(79, 70, 229, 0.1)" index={0}>
                <div className="flex justify-between items-start w-full">
                  <span className="font-mono text-[10px] text-neutral-500 tracking-wider">CORE_FRAMEWORK // SYSTEM_01</span>
                  <Cpu className="w-5 h-5 text-neutral-600" />
                </div>
                <div className="mt-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-200 mb-2">Next.js 15</h3>
                    <p className="text-neutral-400 text-xs md:text-sm max-w-md leading-relaxed mb-4">
                      Leveraging Next.js 15 with React 19 concurrent features. Architecting production systems utilizing advanced Server Actions, edge routing configurations, and zero-bundle server components.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["React 19", "Server Components", "Edge Handlers", "Hydration Optimizations"].map((t) => (
                        <span key={t} className="px-2.5 py-1 text-[10px] font-mono rounded-full bg-white/5 border border-white/5 text-neutral-400">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="w-full md:w-40 h-28 shrink-0 rounded-2xl border border-white/5 bg-[#09090e]/40 relative overflow-hidden flex items-center justify-center">
                    <svg className="w-24 h-20" viewBox="0 0 100 80" fill="none">
                      <circle cx="50" cy="40" r="10" stroke="#4f46e5" strokeWidth="1.5" />
                      <circle cx="50" cy="40" r="4" fill="#4f46e5" />
                      <path d="M 50 30 L 50 12" stroke="#334155" strokeWidth="1.5" />
                      <path d="M 40 40 L 15 40" stroke="#334155" strokeWidth="1.5" />
                      <path d="M 60 40 L 85 40" stroke="#334155" strokeWidth="1.5" />
                      <path d="M 50 50 L 50 68" stroke="#334155" strokeWidth="1.5" />
                      <circle r="2" fill="#22d3ee"><animateMotion path="M 50 30 L 50 12" dur="1s" repeatCount="indefinite" /></circle>
                      <circle r="2" fill="#22d3ee"><animateMotion path="M 50 50 L 50 68" dur="1.2s" repeatCount="indefinite" /></circle>
                      <circle r="2" fill="#22d3ee"><animateMotion path="M 40 40 L 15 40" dur="0.9s" repeatCount="indefinite" /></circle>
                      <circle r="2" fill="#22d3ee"><animateMotion path="M 60 40 L 85 40" dur="1.1s" repeatCount="indefinite" /></circle>
                    </svg>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            <motion.div variants={bentoCardVariants}>
              <TiltCard className="min-h-[240px]" glowColor="rgba(51, 65, 85, 0.12)" index={1}>
                <div className="flex justify-between items-start w-full">
                  <span className="font-mono text-[10px] text-neutral-500 tracking-wider">BACKEND_ENGINE // SYSTEM_02</span>
                  <Server className="w-5 h-5 text-neutral-600" />
                </div>
                <div className="mt-8 flex flex-col justify-between h-full gap-4">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-neutral-200 mb-2">Python & FastAPI</h3>
                    <p className="text-neutral-400 text-xs leading-relaxed mb-4">
                      Constructing high-performance asynchronous API endpoints using FastAPI. Strict type validation with Pydantic and async-native database drivers.
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {["AsyncIO", "Pydantic v2", "FastAPI", "Uvicorn"].map((t) => (
                        <span key={t} className="px-2 py-0.5 text-[9px] font-mono rounded-full bg-white/5 border border-white/5 text-neutral-400">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="w-full h-20 rounded-xl border border-white/5 bg-[#09090e]/40 relative overflow-hidden flex items-center justify-center">
                    <svg className="w-20 h-16" viewBox="0 0 80 60" fill="none">
                      <rect x="25" y="15" width="30" height="30" rx="6" stroke="#334155" strokeWidth="1.5" />
                      <circle cx="40" cy="30" r="4" fill="#4f46e5" className="animate-ping" style={{ transformOrigin: "40px 30px" }} />
                      <circle cx="40" cy="30" r="2.5" fill="#4f46e5" />
                      <path d="M 10 20 C 25 5, 55 5, 70 20" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
                      <path d="M 70 40 C 55 55, 25 55, 10 40" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
                      <circle r="1.5" fill="#22d3ee"><animateMotion path="M 10 20 C 25 5, 55 5, 70 20" dur="1.6s" repeatCount="indefinite" /></circle>
                      <circle r="1.5" fill="#c084fc"><animateMotion path="M 70 40 C 55 55, 25 55, 10 40" dur="1.6s" repeatCount="indefinite" /></circle>
                    </svg>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            <motion.div variants={bentoCardVariants}>
              <TiltCard className="min-h-[220px]" glowColor="rgba(79, 70, 229, 0.08)" index={2}>
                <div className="flex justify-between items-start w-full">
                  <span className="font-mono text-[10px] text-neutral-500 tracking-wider">USER_INTERFACE // SYSTEM_03</span>
                  <Activity className="w-5 h-5 text-neutral-600" />
                </div>
                <div className="mt-8 flex flex-col justify-between h-full gap-4">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-neutral-200 mb-2">React</h3>
                    <p className="text-neutral-400 text-xs leading-relaxed mb-4">
                      Orchestrating state machines, heavy list virtualization, and custom React hook bindings tailored for smooth rendering and high visual velocity.
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {["Fiber", "Concurrent UI", "Hooks Engine"].map((t) => (
                        <span key={t} className="px-2 py-0.5 text-[9px] font-mono rounded-full bg-white/5 border border-white/5 text-neutral-400">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="w-full h-20 rounded-xl border border-white/5 bg-[#09090e]/40 relative overflow-hidden flex items-center justify-center">
                    <svg className="w-20 h-16" viewBox="0 0 80 60" fill="none">
                      <circle cx="40" cy="12" r="4.5" stroke="#334155" strokeWidth="1.5" />
                      <circle cx="22" cy="32" r="4.5" stroke="#334155" strokeWidth="1.5" />
                      <circle cx="58" cy="32" r="4.5" stroke="#4f46e5" strokeWidth="1.5" />
                      <circle cx="12" cy="50" r="3.5" stroke="#334155" strokeWidth="1.5" />
                      <circle cx="32" cy="50" r="3.5" stroke="#334155" strokeWidth="1.5" />
                      <line x1="40" y1="16" x2="22" y2="28" stroke="#334155" strokeWidth="1" />
                      <line x1="40" y1="16" x2="58" y2="28" stroke="#334155" strokeWidth="1" />
                      <line x1="22" y1="36" x2="12" y2="46" stroke="#334155" strokeWidth="1" />
                      <line x1="22" y1="36" x2="32" y2="46" stroke="#334155" strokeWidth="1" />
                      <circle cx="58" cy="32" r="8" stroke="#4f46e5" strokeWidth="0.5" className="animate-ping" style={{ transformOrigin: "58px 32px" }} />
                    </svg>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            <motion.div variants={bentoCardVariants}>
              <TiltCard className="min-h-[220px]" glowColor="rgba(51, 65, 85, 0.08)" index={3}>
                <div className="flex justify-between items-start w-full">
                  <span className="font-mono text-[10px] text-neutral-500 tracking-wider">AI_INTEGRATION // SYSTEM_04</span>
                  <Layers className="w-5 h-5 text-neutral-600" />
                </div>
                <div className="mt-8 flex flex-col justify-between h-full gap-4">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-neutral-200 mb-2">LangChain</h3>
                    <p className="text-neutral-400 text-xs leading-relaxed mb-4">
                      Engineering multi-agent reasoning graphs, vector space routing algorithms, and hybrid RAG data pipelines for LLM integration.
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {["Agentic Graphs", "Vector Embeddings", "RAG Pipelines"].map((t) => (
                        <span key={t} className="px-2 py-0.5 text-[9px] font-mono rounded-full bg-white/5 border border-white/5 text-neutral-400">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="w-full h-20 rounded-xl border border-white/5 bg-[#09090e]/40 relative overflow-hidden flex items-center justify-center">
                    <svg className="w-20 h-16" viewBox="0 0 80 60" fill="none">
                      <circle cx="40" cy="15" r="5" stroke="#4f46e5" strokeWidth="1.5" />
                      <circle cx="20" cy="45" r="4" stroke="#334155" strokeWidth="1.5" />
                      <circle cx="60" cy="45" r="4" stroke="#334155" strokeWidth="1.5" />
                      <path d="M 40 20 L 20 45" stroke="#334155" strokeWidth="1" />
                      <path d="M 20 45 L 60 45" stroke="#334155" strokeWidth="1" />
                      <path d="M 60 45 L 40 20" stroke="#334155" strokeWidth="1" />
                      <circle r="1.5" fill="#4f46e5"><animateMotion path="M 40 20 L 20 45" dur="1.2s" repeatCount="indefinite" /></circle>
                      <circle r="1.5" fill="#4f46e5"><animateMotion path="M 20 45 L 60 45" dur="1s" repeatCount="indefinite" /></circle>
                      <circle r="1.5" fill="#4f46e5"><animateMotion path="M 60 45 L 40 20" dur="1.4s" repeatCount="indefinite" /></circle>
                    </svg>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            <motion.div variants={bentoCardVariants}>
              <TiltCard className="min-h-[220px]" glowColor="rgba(255, 255, 255, 0.04)" index={4}>
                <div className="flex justify-between items-start w-full">
                  <span className="font-mono text-[10px] text-neutral-500 tracking-wider">SYSTEMS_LEVEL // SYSTEM_05</span>
                  <Zap className="w-5 h-5 text-neutral-600" />
                </div>
                <div className="mt-8 flex flex-col justify-between h-full gap-4">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-neutral-200 mb-2">C++ & DSA</h3>
                    <p className="text-neutral-400 text-xs leading-relaxed mb-4">
                      Writing deterministic memory-efficient routines, low-latency algorithms, and resolving high-performance compute bottlenecks.
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {["STL Algorithms", "Memory Control", "Thread Pools"].map((t) => (
                        <span key={t} className="px-2 py-0.5 text-[9px] font-mono rounded-full bg-white/5 border border-white/5 text-neutral-400">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="w-full h-20 rounded-xl border border-white/5 bg-[#09090e]/40 relative overflow-hidden flex items-center justify-center">
                    <svg className="w-20 h-16" viewBox="0 0 80 60" fill="none">
                      <circle cx="40" cy="15" r="4.5" stroke="#334155" strokeWidth="1.5" />
                      <circle cx="25" cy="30" r="4.5" stroke="#334155" strokeWidth="1.5" />
                      <circle cx="55" cy="30" r="4.5" stroke="#334155" strokeWidth="1.5" />
                      <circle cx="15" cy="45" r="4" stroke="#334155" strokeWidth="1.5" />
                      <circle cx="35" cy="45" r="4" stroke="#334155" strokeWidth="1.5" />
                      <line x1="40" y1="19" x2="25" y2="26" stroke="#334155" strokeWidth="1" />
                      <line x1="40" y1="19" x2="55" y2="26" stroke="#334155" strokeWidth="1" />
                      <line x1="25" y1="34" x2="15" y2="41" stroke="#334155" strokeWidth="1" />
                      <line x1="25" y1="34" x2="35" y2="41" stroke="#334155" strokeWidth="1" />
                      <circle cx="40" cy="15" r="7.5" stroke="#4f46e5" strokeWidth="0.5" className="animate-pulse" style={{ transformOrigin: "40px 15px" }} />
                      <circle cx="55" cy="30" r="7.5" stroke="#4f46e5" strokeWidth="0.5" className="animate-pulse" style={{ transformOrigin: "55px 30px", animationDelay: "0.8s" }} />
                    </svg>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            <motion.div variants={bentoCardVariants} className="md:col-span-3">
              <TiltCard className="min-h-[200px]" glowColor="rgba(79, 70, 229, 0.08)" index={5}>
                <div className="flex justify-between items-start w-full">
                  <span className="font-mono text-[10px] text-neutral-500 tracking-wider">DATASTORAGE_ENGINE // SYSTEM_06</span>
                  <Database className="w-5 h-5 text-neutral-600" />
                </div>
                <div className="mt-8 flex flex-col md:flex-row justify-between md:items-end gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-200 mb-2">PostgreSQL</h3>
                    <p className="text-neutral-400 text-xs md:text-sm max-w-xl leading-relaxed mb-4">
                      Managing transactional integrity and complex vector querying. Optimizing relational query execution plans, indexing schemas (GIN/GiST), and deploying dedicated pgvector storage setups.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["ACID Transactions", "pgvector Indexing", "Query Optimization", "CDC Pipeline"].map((t) => (
                        <span key={t} className="px-2.5 py-1 text-[10px] font-mono rounded-full bg-white/5 border border-white/5 text-neutral-400">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="w-full md:w-44 h-24 shrink-0 rounded-2xl border border-white/5 bg-[#09090e]/40 relative overflow-hidden flex items-center justify-center">
                    <svg className="w-32 h-16" viewBox="0 0 160 80" fill="none">
                      <rect x="15" y="15" width="40" height="8" rx="2" stroke="#334155" strokeWidth="1" />
                      <rect x="15" y="27" width="40" height="8" rx="2" stroke="#334155" strokeWidth="1" />
                      <rect x="15" y="39" width="40" height="8" rx="2" stroke="#334155" strokeWidth="1" />
                      <path d="M 120 31 L 65 31" stroke="#334155" strokeWidth="1.2" strokeDasharray="2 2" />
                      <circle cx="120" cy="31" r="3.5" fill="#4f46e5" />
                      <circle r="1.5" fill="#22d3ee"><animateMotion path="M 120 31 L 65 31" dur="1.2s" repeatCount="indefinite" /></circle>
                      <circle cx="55" cy="29" r="6" stroke="#22d3ee" strokeWidth="0.5" className="animate-ping" style={{ transformOrigin: "55px 29px" }} />
                    </svg>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

          </motion.div>
        </section>

        {/* ── THE VAULT (SELECTED WORKS - STICKY SPLIT LAYOUT) ── */}
        <section
          id="selected-works-vault"
          ref={vaultRef as React.RefObject<HTMLElement>}
          className="relative flex flex-col md:flex-row items-start w-full z-10"
          suppressHydrationWarning
        >
          {/* Left Pinned Visual Column */}
          <div className="w-full md:w-1/2 md:sticky md:top-0 h-[50vh] md:h-screen flex items-center justify-center overflow-hidden z-20" style={{ perspective: 1200 }}>
            <VaultVisualContainer>
              {/* Debug Scroll Tracker Overlay */}
              <div className="absolute top-4 left-4 font-mono text-[9px] text-neutral-500/80 z-50 select-none pointer-events-none">
                ACTIVE_INDEX // 0{activeIndex + 1}
              </div>
              
              <div 
                className="absolute inset-0 w-full h-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ 
                  opacity: activeIndex === 0 ? 1 : 0, 
                  pointerEvents: activeIndex === 0 ? "auto" : "none",
                  transform: activeIndex === 0 ? "scale(1) translateZ(0)" : "scale(0.95) translateZ(-20px)",
                  transformStyle: "preserve-3d"
                }}
              >
                <GroundTruthVisual />
              </div>
              <div 
                className="absolute inset-0 w-full h-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ 
                  opacity: activeIndex === 1 ? 1 : 0, 
                  pointerEvents: activeIndex === 1 ? "auto" : "none",
                  transform: activeIndex === 1 ? "scale(1) translateZ(0)" : "scale(0.95) translateZ(-20px)",
                  transformStyle: "preserve-3d"
                }}
              >
                <WorkspaceVisual />
              </div>
              <div 
                className="absolute inset-0 w-full h-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ 
                  opacity: activeIndex === 2 ? 1 : 0, 
                  pointerEvents: activeIndex === 2 ? "auto" : "none",
                  transform: activeIndex === 2 ? "scale(1) translateZ(0)" : "scale(0.95) translateZ(-20px)",
                  transformStyle: "preserve-3d"
                }}
              >
                <BroccoliVisual />
              </div>
            </VaultVisualContainer>
          </div>

          {/* Right Scroll Track Column */}
          <div className="w-full md:w-1/2 flex flex-col">
            <VaultCard>
              <div className="flex flex-col gap-6 max-w-lg">
                <span className="font-mono text-xs text-neutral-500 tracking-wider">PROJECT_01 // RAG_ARCHITECTURE</span>
                <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-none premium-text-primary">Ground Truth Engine</h3>
                <div className="p-4 rounded-2xl border border-white/5 bg-[#09090e]/60 backdrop-blur-sm shadow-md">
                  <span className="font-mono text-[9px] text-[#4f46e5] font-bold block mb-1">ARCHITECTURE BRIEF:</span>
                  <p className="text-neutral-400 text-sm leading-relaxed font-light">An advanced Retrieval-Augmented Generation (RAG) platform engineered to remove hallucination risks. Employs a deterministic, structured 5-layer framework that parses documents, routes semantic intent, and synthesizes vectorized context.</p>
                </div>
                <div className="space-y-3">
                  <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">Core Specifications:</span>
                  <ul className="space-y-1.5 text-xs md:text-sm text-neutral-400 font-light list-disc list-inside">
                    <li>5-layer parsing, routing, ranking, and database layout.</li>
                    <li>Deterministic semantic classification using cosine vector calculations.</li>
                    <li>pgvector integration yielding sub-180ms document indexing.</li>
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-4 my-2">
                  <div>
                    <span className="font-mono text-[9px] text-neutral-500 block">LATENCY RESPONSE</span>
                    <span className="text-lg font-bold font-mono text-neutral-200">&lt; 180ms</span>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-neutral-500 block">ACCURACY TARGET</span>
                    <span className="text-lg font-bold font-mono text-indigo-400">99.8% Hallucination-Free</span>
                  </div>
                </div>
                <div className="pt-2">
                  <Magnetic>
                    <a href="/vessel/ground-truth-engine" data-cursor-label="GTE" className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-neutral-400 hover:text-white border-b border-neutral-700 hover:border-white pb-1 transition-colors cursor-none">
                      <span>Inspect Repository Architecture</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </Magnetic>
                </div>
              </div>
            </VaultCard>

            <VaultCard>
              <div className="flex flex-col gap-6 max-w-lg">
                <span className="font-mono text-xs text-neutral-500 tracking-wider">PROJECT_02 // ENTERPRISE_PORTAL</span>
                <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-none premium-text-primary">Centralized Workspace</h3>
                <div className="p-4 rounded-2xl border border-white/5 bg-[#09090e]/60 backdrop-blur-sm shadow-md">
                  <span className="font-mono text-[9px] text-emerald-500 font-bold block mb-1">ENTERPRISE BRIEF:</span>
                  <p className="text-neutral-400 text-sm leading-relaxed font-light">A high-security, low-latency intranet dashboard portal servicing Banaras Locomotive Works. Deployed internally to consolidate databases, proxy legacy Oracle systems, and manage staff operations.</p>
                </div>
                <div className="space-y-3">
                  <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">Core Specifications:</span>
                  <ul className="space-y-1.5 text-xs md:text-sm text-neutral-400 font-light list-disc list-inside">
                    <li>Servicing 15,000+ active enterprise directory profiles with RBAC.</li>
                    <li>Real-time legacy sync middleware proxying Oracle tables securely.</li>
                    <li>API caching reducing database query latency to 45ms.</li>
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-4 my-2">
                  <div>
                    <span className="font-mono text-[9px] text-neutral-500 block">DEPLOYED FOOTPRINT</span>
                    <span className="text-lg font-bold font-mono text-neutral-200">15K+ Active Users</span>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-neutral-500 block">PROXY SPEED</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">45ms Avg Latency</span>
                  </div>
                </div>
                <div className="pt-2">
                  <Magnetic>
                    <a href="/vessel/blw-portal" data-cursor-label="BLW" className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-neutral-400 hover:text-white border-b border-neutral-700 hover:border-white pb-1 transition-colors cursor-none">
                      <span>Read Enterprise Case Study</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </Magnetic>
                </div>
              </div>
            </VaultCard>

            <VaultCard>
              <div className="flex flex-col gap-6 max-w-lg">
                <span className="font-mono text-xs text-neutral-500 tracking-wider">PROJECT_03 // WEB_SYSTEM</span>
                <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-none premium-text-primary">pink-broccoli</h3>
                <div className="p-4 rounded-2xl border border-white/5 bg-[#09090e]/60 backdrop-blur-sm shadow-md">
                  <span className="font-mono text-[9px] text-pink-500 font-bold block mb-1">FRONTEND BRIEF:</span>
                  <p className="text-neutral-400 text-sm leading-relaxed font-light">A high-velocity, design-forward web application. Compiled with custom layout structures, pre-rendered vector graphics, and optimized component pipelines achieving near-zero garbage collection delays.</p>
                </div>
                <div className="space-y-3">
                  <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest block">Core Specifications:</span>
                  <ul className="space-y-1.5 text-xs md:text-sm text-neutral-400 font-light list-disc list-inside">
                    <li>Lighthouse Performance score hitting 100/100 across platforms.</li>
                    <li>Virtualized list rendering with zero layout thrashing.</li>
                    <li>Extremely low memory footprint and high frontend velocity.</li>
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-4 my-2">
                  <div>
                    <span className="font-mono text-[9px] text-neutral-500 block">LCP LOAD SPEED</span>
                    <span className="text-lg font-bold font-mono text-neutral-200">0.52 Seconds</span>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-neutral-500 block">GZIPPED BUNDLE SIZE</span>
                    <span className="text-lg font-bold font-mono text-pink-400">&lt; 42 Kilobytes</span>
                  </div>
                </div>
                <div className="pt-2">
                  <Magnetic>
                    <a href="/vessel/Laminar" data-cursor-label="BROCCOLI" className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-neutral-400 hover:text-white border-b border-neutral-700 hover:border-white pb-1 transition-colors cursor-none">
                      <span>View Interactive UI Build</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </Magnetic>
                </div>
              </div>
            </VaultCard>

          </div>
        </section>

        {/* ── FOOTER SECTION ────────────────────────────────────────────────────── */}
        <footer
          ref={footerRef}
          className="relative w-full z-10 bg-[#09090e] pt-32 pb-16 px-6 md:px-16 lg:px-24 flex flex-col justify-end min-h-[70vh] border-t border-white/5 select-none"
          suppressHydrationWarning
        >
          <div className="max-w-6xl w-full mx-auto flex flex-col gap-12 md:gap-16" suppressHydrationWarning>
            <motion.div
              style={{
                scale: marqueeScale,
                skewY: marqueeSkew,
                x: marqueeExtraX,
                textShadow: marqueeGlow,
                transformStyle: "preserve-3d",
                z: 0,
                willChange: "transform",
              }}
              data-cursor-label="TALK"
              className="w-full overflow-hidden flex flex-col gap-2 border-t border-b border-white/5 py-6 md:py-8 marquee-glow cursor-none"
            >
              <motion.div variants={marqueeVariantsLeft} animate="animate" className="flex text-marquee leading-none uppercase font-black font-sans tracking-tighter w-[200%] gap-12 select-none">
                <div className="flex justify-around min-w-full shrink-0 gap-12">
                  <span>LET&apos;S TALK</span><span>•</span><span>LET&apos;S TALK</span><span>•</span><span>LET&apos;S TALK</span><span>•</span>
                </div>
                <div className="flex justify-around min-w-full shrink-0 gap-12">
                  <span>LET&apos;S TALK</span><span>•</span><span>LET&apos;S TALK</span><span>•</span><span>LET&apos;S TALK</span><span>•</span>
                </div>
              </motion.div>
              <motion.div variants={marqueeVariantsRight} animate="animate" className="flex text-marquee leading-none uppercase font-black font-sans tracking-tighter w-[200%] gap-12 select-none opacity-50">
                <div className="flex justify-around min-w-full shrink-0 gap-12">
                  <span>LET&apos;S TALK</span><span>•</span><span>LET&apos;S TALK</span><span>•</span><span>LET&apos;S TALK</span><span>•</span>
                </div>
                <div className="flex justify-around min-w-full shrink-0 gap-12">
                  <span>LET&apos;S TALK</span><span>•</span><span>LET&apos;S TALK</span><span>•</span><span>LET&apos;S TALK</span><span>•</span>
                </div>
              </motion.div>
            </motion.div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t border-white/5">
              <div className="flex flex-col gap-1 text-center md:text-left font-mono text-[10px] text-neutral-500">
                <span>DESIGNED & ENGINEERED BY AMAAN</span>
                <span>© 2026 HORCRUX ENGINE • ALL RIGHTS RESERVED</span>
              </div>
              <div className="flex gap-6 items-center">
                <Magnetic>
                  <a href="https://github.com/amaaxx" target="_blank" rel="noopener noreferrer" data-cursor-label="EXTERNAL" className="font-mono text-xs text-neutral-500 hover:text-white transition-colors cursor-none">GITHUB</a>
                </Magnetic>
                <Magnetic>
                  <a href="https://linkedin.com/in/amaaxx" target="_blank" rel="noopener noreferrer" data-cursor-label="EXTERNAL" className="font-mono text-xs text-neutral-500 hover:text-white transition-colors cursor-none">LINKEDIN</a>
                </Magnetic>
              </div>
            </div>
          </div>
        </footer>
      </motion.div>
    </motion.main>
  );
}

// ── MARQUEE ANIMATION VARIANTS ────────────────────────────────────────────────
const marqueeVariantsLeft: Variants = {
  animate: { x: ["0%", "-50%"], transition: { x: { repeat: Infinity, repeatType: "loop", duration: 18, ease: "linear" } } },
};

const marqueeVariantsRight: Variants = {
  animate: { x: ["-50%", "0%"], transition: { x: { repeat: Infinity, repeatType: "loop", duration: 18, ease: "linear" } } },
};