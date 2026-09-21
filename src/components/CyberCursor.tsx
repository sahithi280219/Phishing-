import React, { useEffect, useState, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export const CyberCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [targetPos, setTargetPos] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number | null>(null);

  // Detect touch devices to avoid drawing custom cursor on mobile touchscreens
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(isTouch);
    }
  }, []);

  // Track mouse coordinates and target interactive elements
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      setTargetPos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Check if hovering over interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          'button, a, input, select, textarea, [role="button"], [data-hover="cyber"], label, .interactive-hover'
        );
        setIsPointer(!!interactive);
      }

      // Spawn a subtle trailing spark
      if (Math.random() < 0.28) {
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          size: Math.random() * 2 + 1,
          alpha: 0.65,
          life: 0,
          maxLife: 20 + Math.random() * 15,
        });
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      // Spawn burst of cyber sparks
      for (let i = 0; i < 7; i++) {
        const angle = (Math.PI * 2 * i) / 7 + (Math.random() - 0.5);
        const speed = Math.random() * 2.5 + 1.2;
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2.5 + 1,
          alpha: 0.9,
          life: 0,
          maxLife: 25,
        });
      }
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isTouchDevice]);

  // Smooth lagging outer ring animation frame loop
  useEffect(() => {
    if (isTouchDevice) return;

    let currentX = targetPos.x;
    let currentY = targetPos.y;

    const animate = () => {
      // Lerp smooth follow
      const factor = isPointer ? 0.35 : 0.22;
      currentX += (targetPos.x - currentX) * factor;
      currentY += (targetPos.y - currentY) * factor;
      setPos({ x: currentX, y: currentY });

      // Animate canvas particles
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Update & draw particles
          const nextParticles: Particle[] = [];
          for (let i = 0; i < particlesRef.current.length; i++) {
            const p = particlesRef.current[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life++;
            const progress = p.life / p.maxLife;
            const currentAlpha = p.alpha * (1 - progress);

            if (currentAlpha > 0.02 && p.life < p.maxLife) {
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size * (1 - progress * 0.4), 0, Math.PI * 2);
              ctx.fillStyle = `rgba(239, 68, 68, ${currentAlpha})`;
              ctx.shadowColor = '#ef4444';
              ctx.shadowBlur = 6;
              ctx.fill();
              nextParticles.push(p);
            }
          }
          particlesRef.current = nextParticles;
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [targetPos, isPointer, isTouchDevice]);

  // Canvas size sync
  useEffect(() => {
    if (isTouchDevice) return;
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isTouchDevice]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none" aria-hidden="true">
      {/* Ambient Cyber Spotlight Aura that softly illuminates background grids and elements under the mouse */}
      <div
        className="fixed top-0 left-0 w-[420px] h-[420px] -ml-[210px] -mt-[210px] rounded-full pointer-events-none opacity-30"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.22) 0%, rgba(220, 38, 38, 0.08) 40%, transparent 70%)',
          willChange: 'transform',
        }}
      />

      {/* Particle Canvas for click bursts and trailing sparks */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Outer Tactical Crosshair Ring (smoothly tracks with lerp lag) */}
      <div
        className={`fixed top-0 left-0 pointer-events-none rounded-full border transition-all duration-150 flex items-center justify-center ${
          isPointer
            ? 'w-11 h-11 -ml-[22px] -mt-[22px] bg-red-950/30 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.7)]'
            : 'w-7 h-7 -ml-3.5 -mt-3.5 bg-transparent border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.35)]'
        }`}
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${isClicking ? 0.75 : 1})`,
          willChange: 'transform',
        }}
      >
        {/* Subtle Crosshair Ticks when hovering interactive items */}
        {isPointer && (
          <>
            <div className="absolute top-0 w-2 h-0.5 bg-red-400 shadow-[0_0_6px_#ef4444]" />
            <div className="absolute bottom-0 w-2 h-0.5 bg-red-400 shadow-[0_0_6px_#ef4444]" />
            <div className="absolute left-0 w-0.5 h-2 bg-red-400 shadow-[0_0_6px_#ef4444]" />
            <div className="absolute right-0 w-0.5 h-2 bg-red-400 shadow-[0_0_6px_#ef4444]" />
            {/* Micro corner brackets */}
            <div className="absolute -top-1 -left-1 w-1.5 h-1.5 border-t border-l border-red-500" />
            <div className="absolute -top-1 -right-1 w-1.5 h-1.5 border-t border-r border-red-500" />
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 border-b border-l border-red-500" />
            <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 border-b border-r border-red-500" />
          </>
        )}
      </div>

      {/* Cyber Reticle Glow Center (moves with ZERO latency directly on clientX/Y) */}
      <div
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          transform: `translate3d(${targetPos.x}px, ${targetPos.y}px, 0)`,
          willChange: 'transform',
        }}
      >
        <div
          className={`w-2.5 h-2.5 -ml-[5px] -mt-[5px] rounded-full bg-red-500 border border-white/60 shadow-[0_0_10px_#ef4444,0_0_20px_#dc2626] transition-transform duration-100 ease-out ${
            isClicking ? 'scale-50 bg-white' : isPointer ? 'scale-125 bg-red-400' : 'scale-100'
          }`}
        />
        {/* Tiny crosshair pips on default cursor */}
        {!isPointer && (
          <div className="absolute top-0 left-0 -ml-2 -mt-2 w-4 h-4 pointer-events-none opacity-60">
            <div className="absolute top-0 left-1.5 w-1 h-[1px] bg-red-400" />
            <div className="absolute bottom-0 left-1.5 w-1 h-[1px] bg-red-400" />
            <div className="absolute left-0 top-1.5 h-1 w-[1px] bg-red-400" />
            <div className="absolute right-0 top-1.5 h-1 w-[1px] bg-red-400" />
          </div>
        )}
      </div>
    </div>
  );
};
