"use client";

import { useEffect, useRef } from "react";

export default function Hero3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mouse coordinate refs (avoid React state to run at 60fps)
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    // Resize handler
    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      
      // Support high DPI screens
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Grid details
    const cols = 28;
    const rows = 28;
    const points: { x: number; y: number; z: number }[] = [];

    // Initialize 3D plane
    const spacingX = 220 / (cols - 1);
    const spacingZ = 220 / (rows - 1);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = -110 + c * spacingX;
        const z = -110 + r * spacingZ;
        points.push({ x, y: 0, z });
      }
    }

    // Interaction state variables
    let time = 0;
    const camDist = 320;
    const pitch = 0.85; // Tilt down
    const yaw = -0.55;    // Tilt slightly side

    // Main animation loop
    const animate = () => {
      time += 0.015;

      // Smooth mouse interpolation
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      // Clear screen
      ctx.clearRect(0, 0, width, height);

      // Dynamically calculate center
      const centerX = width / 2;
      const centerY = height / 2 + 10;

      // Slow idle rotation based on time
      const currentYaw = yaw + Math.sin(time * 0.1) * 0.08;

      // Projection buffers
      const projected: { px: number; py: number; depth: number; opacity: number }[] = [];

      for (let i = 0; i < points.length; i++) {
        const pt = points[i];

        // 1. Math Waves (Base displacement)
        const dFromCenter = Math.sqrt(pt.x * pt.x + pt.z * pt.z);
        let y = Math.sin(pt.x * 0.06 + time * 1.5) * Math.cos(pt.z * 0.06 + time * 1.1) * 11;
        y += Math.sin(dFromCenter * 0.04 - time * 2.0) * 5;

        // Apply pitch/yaw rotation
        // Rotate Z & X (yaw)
        const x1 = pt.x * Math.cos(currentYaw) - pt.z * Math.sin(currentYaw);
        const z1 = pt.x * Math.sin(currentYaw) + pt.z * Math.cos(currentYaw);
        const y1 = y;

        // Rotate Y & Z (pitch)
        const x2 = x1;
        const y2 = y1 * Math.cos(pitch) - z1 * Math.sin(pitch);
        const z2 = y1 * Math.sin(pitch) + z1 * Math.cos(pitch);

        // Calculate 2D mouse distance to deform
        const scale = camDist / (camDist + z2);
        const px = centerX + x2 * scale;
        const py = centerY + y2 * scale;

        // Deform in projected space if mouse hover is active
        let finalPx = px;
        let finalPy = py;
        let localIntensity = 0;

        if (mouse.active) {
          const dx = mouse.x - px;
          const dy = mouse.y - py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const limit = 110;
          if (dist < limit) {
            const force = (1 - dist / limit) * 18;
            localIntensity = 1 - dist / limit;
            
            // Push vertices slightly outward/downward away from cursor
            const angle = Math.atan2(dy, dx);
            finalPx -= Math.cos(angle) * force * 0.6;
            finalPy -= Math.sin(angle) * force * 0.65;
          }
        }

        // Save projected point
        const depthOpacity = Math.max(0.08, Math.min(1.0, 1.2 - (z2 + 110) / 220));
        projected.push({
          px: finalPx,
          py: finalPy,
          depth: z2,
          opacity: depthOpacity * (1 + localIntensity * 0.8),
        });
      }

      // Draw Grid Lines
      ctx.lineWidth = 1.0;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const p1 = projected[i];

          // Right link
          if (c < cols - 1) {
            const p2 = projected[i + 1];
            const avgOpacity = (p1.opacity + p2.opacity) / 2;
            ctx.strokeStyle = `rgba(240, 237, 232, ${avgOpacity * 0.12})`;
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }

          // Bottom link
          if (r < rows - 1) {
            const p2 = projected[i + cols];
            const avgOpacity = (p1.opacity + p2.opacity) / 2;
            ctx.strokeStyle = `rgba(240, 237, 232, ${avgOpacity * 0.12})`;
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }

          // Subtle nodes / dots at random crossings to add visual richness
          if (i % 73 === 0) {
            ctx.fillStyle = `rgba(240, 237, 232, ${p1.opacity * 0.45})`;
            ctx.beginPath();
            ctx.arc(p1.px, p1.py, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Mouse movement listener
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas || !containerRef.current) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove, { passive: true });
      container.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    }

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[320px] md:h-[450px] lg:h-full flex items-center justify-center pointer-events-auto cursor-crosshair rounded-2xl border border-white/[0.04] bg-gradient-to-br from-white/[0.015] to-transparent overflow-hidden"
    >
      {/* Schematic guidelines */}
      <div className="absolute inset-0 bg-grid-white/[0.01] bg-[size:30px_30px]" />
      
      {/* Corner crosshairs */}
      <span className="absolute top-3 left-3 font-mono text-[8px] text-white/20 select-none pointer-events-none">+</span>
      <span className="absolute top-3 right-3 font-mono text-[8px] text-white/20 select-none pointer-events-none">+</span>
      <span className="absolute bottom-3 left-3 font-mono text-[8px] text-white/20 select-none pointer-events-none">+</span>
      <span className="absolute bottom-3 right-3 font-mono text-[8px] text-white/20 select-none pointer-events-none">+</span>

      {/* Sensor / telemetry label */}
      <div className="absolute top-4 left-6 font-mono text-[8px] text-white/35 uppercase tracking-widest select-none pointer-events-none flex items-center gap-2">
        <span className="h-1 w-1 rounded-full bg-white/40 animate-ping" />
        Grid_Mesh // Interactive_3D
      </div>

      <canvas 
        ref={canvasRef} 
        className="w-full h-full z-10 block"
      />
    </div>
  );
}
