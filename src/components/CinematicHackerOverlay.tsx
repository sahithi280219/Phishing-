import React, { useEffect, useState, useRef } from 'react';
import { Terminal, ShieldAlert, Wifi, Activity } from 'lucide-react';
import { cyberAudio } from '../utils/cyberAudio';
import hackerImg from '../assets/images/cyber_hacker_hero_1789905393541.jpg';

export interface CinematicTransitionConfig {
  title?: string;
  terminalLines?: string[];
  durationMs?: number;
  threatLevel?: 'NORMAL' | 'ELEVATED' | 'CRITICAL';
  variant?: 'navigation' | 'full';
  targetPageName?: string;
  onComplete?: () => void;
}

interface Props {
  active: boolean;
  config?: CinematicTransitionConfig;
  onFinished: () => void;
}

export const CinematicHackerOverlay: React.FC<Props> = ({ active, config, onFinished }) => {
  const [phase, setPhase] = useState<'idle' | 'darken' | 'terminal' | 'glitch' | 'reveal' | 'fadeout'>('idle');
  const [displayedLineIdx, setDisplayedLineIdx] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const isNav = config?.variant === 'navigation';

  const defaultLines = [
    '> ACCESSING SECURE CHANNEL...',
    '> ENCRYPTED CONNECTION ESTABLISHED...',
    '> TRACE DETECTED...',
    '> UNKNOWN ACTOR CONNECTED...',
  ];

  const lines = config?.terminalLines && config.terminalLines.length > 0 ? config.terminalLines : defaultLines;
  const isCritical = config?.threatLevel === 'CRITICAL';

  // Digital particle network canvas around the hacker
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }

    const nodes: Node[] = Array.from({ length: 32 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      radius: Math.random() * 2 + 1,
    }));

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      ctx.strokeStyle = isCritical ? 'rgba(239, 68, 68, 0.25)' : 'rgba(220, 38, 38, 0.18)';
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = isCritical ? '#ef4444' : '#dc2626';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 6;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [active, isCritical]);

  // Master sequence timing controller
  useEffect(() => {
    if (!active) {
      setPhase('idle');
      return;
    }

    // FAST NAVIGATION SHORT ANIMATION VARIANT (e.g. ~850ms total)
    if (isNav) {
      // 0ms: Sudden red glitch burst & audio glitch
      setPhase('glitch');
      cyberAudio.glitch();

      // 120ms: Hidden hooded hacker suddenly snaps into prominent view with red scanline & targeting reticle
      const tNavReveal = setTimeout(() => {
        setPhase('reveal');
        cyberAudio.warning();
      }, 120);

      // 620ms: Smooth fadeout to allow graceful transition to target page
      const tNavFade = setTimeout(() => {
        setPhase('fadeout');
      }, 620);

      // 850ms: Sequence finished, route to selected page
      const tNavDone = setTimeout(() => {
        setPhase('idle');
        if (config?.onComplete) config.onComplete();
        onFinished();
      }, 850);

      return () => {
        clearTimeout(tNavReveal);
        clearTimeout(tNavFade);
        clearTimeout(tNavDone);
      };
    }

    // STANDARD FULL CINEMATIC SEQUENCE (for Admin login, round changes, etc.)
    setPhase('darken');
    cyberAudio.click();

    const t1 = setTimeout(() => {
      setPhase('terminal');
      setDisplayedLineIdx(0);
    }, 150);

    const t2 = setTimeout(() => {
      setDisplayedLineIdx((prev) => Math.min(prev + 1, lines.length - 1));
    }, 380);

    const t3 = setTimeout(() => {
      setDisplayedLineIdx((prev) => Math.min(prev + 2, lines.length - 1));
      cyberAudio.warning();
    }, 620);

    const t4 = setTimeout(() => {
      setPhase('glitch');
    }, 850);

    const t5 = setTimeout(() => {
      setPhase('reveal');
      if (isCritical) {
        cyberAudio.warning();
      } else {
        cyberAudio.accessGranted();
      }
    }, 1050);

    const t6 = setTimeout(() => {
      setPhase('fadeout');
    }, 1500);

    const t7 = setTimeout(() => {
      setPhase('idle');
      if (config?.onComplete) config.onComplete();
      onFinished();
    }, 1750);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
    };
  }, [active, isNav, lines.length, isCritical, config, onFinished]);

  if (!active || phase === 'idle') return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cybersecurity Hacker Transition"
      onClick={() => {
        // Instant skip on user click so navigation is never blocked
        if (config?.onComplete) config.onComplete();
        onFinished();
      }}
      className={`fixed inset-0 z-[100] flex items-center justify-center select-none overflow-hidden transition-opacity duration-300 cursor-pointer ${
        phase === 'fadeout' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* 1. Deep Black Screen & Vignette */}
      <div className="absolute inset-0 bg-[#040405] bg-opacity-95" />

      {/* 2. Scanning Laser Scanline Sweep */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_25px_#ef4444] animate-scanline-sweep" />
      </div>

      {/* CRT Scanlines and Matrix Grid Texture */}
      <div className="scanlines absolute inset-0 opacity-40 pointer-events-none" />
      <div className="cyber-grid absolute inset-0 opacity-25 pointer-events-none" />

      {/* Canvas for Red Digital Network Nodes */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Sudden Glitch Screen Flash / Scan Slice Artifacts during glitch phase */}
      {(phase === 'glitch' || isNav) && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          <div className="absolute inset-0 bg-red-600/15 mix-blend-screen animate-cyber-glitch" />
          <div className="absolute top-1/4 left-0 right-0 h-16 bg-red-500/10 backdrop-invert animate-scan-slice" />
          <div className="absolute bottom-1/3 left-0 right-0 h-10 bg-red-600/20 backdrop-blur-sm animate-scan-slice" style={{ animationDelay: '0.08s' }} />
        </div>
      )}

      {/* 5. Threat Actor Hacker Silhouette Presence with Strong Red Rim Lighting & Glowing Aura */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 ${
          phase === 'reveal'
            ? 'opacity-100 scale-100 animate-glitch-reveal'
            : phase === 'glitch'
            ? 'opacity-85 scale-105 filter hue-rotate-15 animate-cyber-glitch'
            : 'opacity-0 scale-95'
        }`}
      >
        <div className="relative w-full max-w-2xl h-[540px] flex items-center justify-center overflow-hidden">
          
          {/* Luminous Red Silhouette Backlight Aura */}
          <div className="absolute w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(239,68,68,0.75)_0%,rgba(220,38,38,0.35)_45%,transparent_75%)] blur-[50px] pointer-events-none animate-pulse" />
          
          {/* Volumetric Cyber Smoke */}
          <div className="absolute inset-x-0 bottom-10 h-44 bg-[radial-gradient(ellipse_at_bottom,rgba(239,68,68,0.35)_0%,transparent_75%)] blur-2xl pointer-events-none animate-smoke-drift-1" />

          {/* Cyber HUD Targeting Ring directly over the Hacker */}
          <div className="absolute w-72 h-72 rounded-full border border-red-500/50 border-dashed animate-hud-rotate pointer-events-none" />
          <div className="absolute w-56 h-56 rounded-full border border-red-500/40 animate-hud-rotate-reverse pointer-events-none" />

          {/* Background hacker image with high contrast and strong red rim lighting */}
          <img
            src={hackerImg}
            alt="Incident Threat Actor Silhouette"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain filter contrast-145 brightness-110 saturate-125 drop-shadow-[0_0_30px_#ef4444] drop-shadow-[0_0_65px_#dc2626] animate-red-rim-pulse"
          />

          {/* Target Acquisition Brackets over the Silhouette */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-44 h-36 border border-red-500/60 rounded pointer-events-none flex flex-col justify-between p-1.5">
            <div className="flex justify-between">
              <span className="w-3 h-3 border-t-2 border-l-2 border-red-500" />
              <span className="w-3 h-3 border-t-2 border-r-2 border-red-500" />
            </div>
            <div className="flex justify-between items-end">
              <span className="w-3 h-3 border-b-2 border-l-2 border-red-500" />
              <span className="w-3 h-3 border-b-2 border-r-2 border-red-500" />
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black/90 border border-red-500 text-[9px] font-mono text-red-400 font-bold whitespace-nowrap shadow-[0_0_12px_#ef4444]">
              [THREAT ACTOR IDENTIFIED]
            </div>
          </div>

          {/* Soft vignette fade at outermost bounds */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,#040405_85%)] pointer-events-none" />
        </div>
      </div>

      {/* NAVIGATION VARIANT: Floating Tactical HUD Telemetry Banner */}
      {isNav ? (
        <div className="relative z-20 flex flex-col items-center justify-end h-full pb-16 pointer-events-none">
          <div className="px-5 py-2.5 rounded-lg bg-black/95 border-2 border-red-500 shadow-[0_0_35px_rgba(239,68,68,0.8)] backdrop-blur-md flex items-center gap-3 animate-glitch-reveal">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="font-orbitron font-bold text-sm sm:text-base text-white tracking-widest uppercase">
              {config?.title || `ROUTING // ${config?.targetPageName || 'SECURE VIEW'}`}
            </span>
          </div>
          <div className="mt-2.5 font-mono text-[11px] text-red-400 tracking-wider flex items-center gap-2">
            <span>&gt; INTERCEPT DETECTED</span>
            <span>•</span>
            <span className="text-zinc-300">ESTABLISHING SECURE CONNECTION...</span>
          </div>
        </div>
      ) : (
        /* STANDARD VARIANT: Central Terminal Telemetry Box */
        <div
          className={`relative z-20 w-full max-w-lg mx-4 bg-black/90 border-2 ${
            isCritical ? 'border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.8)]' : 'border-red-700 shadow-[0_0_40px_rgba(220,38,38,0.5)]'
          } rounded-lg p-5 sm:p-6 backdrop-blur-md corner-bracket-tl corner-bracket-br transition-all duration-150 ${
            phase === 'glitch' ? 'animate-cyber-glitch' : ''
          }`}
        >
          {/* HUD Top Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-red-950 mb-4 font-mono text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="font-orbitron font-bold text-white tracking-wider">
                {config?.title || 'CYBER INVESTIGATION PROTOCOL'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-red-400 font-bold uppercase">
              <Activity className="w-3 h-3 text-red-500 animate-spin" style={{ animationDuration: '4s' }} />
              <span>{config?.threatLevel || 'ELEVATED'}</span>
            </div>
          </div>

          {/* Terminal Text Lines */}
          <div className="space-y-2 font-mono text-xs sm:text-sm text-red-400 min-h-[95px] flex flex-col justify-center">
            {lines.slice(0, displayedLineIdx + 1).map((line, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2 ${
                  idx === displayedLineIdx ? 'text-white text-glow-red font-bold' : 'text-red-300 opacity-80'
                }`}
              >
                <span>{line}</span>
                {idx === displayedLineIdx && (
                  <span className="inline-block w-2 h-4 bg-red-500 animate-terminal-blink" />
                )}
              </div>
            ))}
          </div>

          {/* Bottom Status Ticker */}
          <div className="mt-4 pt-3 border-t border-red-950/80 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <div className="flex items-center gap-2">
              <Wifi className="w-3 h-3 text-red-500" />
              <span>CHANNEL: 0x88F7 // ENCRYPTED</span>
            </div>
            <span className="text-zinc-600 hover:text-zinc-400">CLICK TO PROCEED</span>
          </div>
        </div>
      )}
    </div>
  );
};
