import React from 'react';
import { ShieldAlert, Crosshair, ArrowRight, Activity, Award, Clock, Terminal, Zap, Lock } from 'lucide-react';
import { cyberAudio } from '../utils/cyberAudio';
import hackerHeroImg from '../assets/images/cyber_hacker_hero_1789905393541.jpg';

interface HeroProps {
  onEnterHunt: () => void;
  onHowItWorks: () => void;
  onViewRounds: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onEnterHunt, onHowItWorks, onViewRounds }) => {
  return (
    <section className="relative min-h-[92vh] w-full flex items-center justify-center overflow-hidden py-12 md:py-20">
      
      {/* FULL-SECTION HACKER BACKGROUND IMAGE LAYER - HIGHLY VISIBLE WITH RED RIM LIGHTING & GLOWING SILHOUETTE */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* 1. Luminous Glowing Red Silhouette Aura (Backlighting that ensures silhouette never disappears) */}
        <div className="absolute top-[28%] right-[2%] md:right-[12%] w-[580px] h-[580px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(239,68,68,0.65)_0%,rgba(220,38,38,0.35)_40%,transparent_72%)] blur-[60px] pointer-events-none animate-pulse" />
        <div className="absolute top-[40%] right-[10%] md:right-[18%] w-[380px] h-[380px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,50,50,0.45)_0%,rgba(185,28,28,0.2)_50%,transparent_75%)] blur-[40px] pointer-events-none" />

        {/* 2. Volumetric Cyber Smoke & Atmospheric Mist Layers */}
        <div className="absolute right-0 top-1/4 w-[650px] h-[480px] bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.25)_0%,rgba(185,28,28,0.12)_45%,transparent_75%)] blur-3xl pointer-events-none animate-smoke-drift-1" />
        <div className="absolute right-[8%] bottom-8 w-[550px] h-[420px] bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.22)_0%,rgba(15,5,5,0.45)_50%,transparent_75%)] blur-2xl pointer-events-none animate-smoke-drift-2" />
        
        {/* 3. The Hacker Background Figure with High Visibility and Strong Red Rim Lighting */}
        <img
          src={hackerHeroImg}
          alt="Cyber Threat Adversary Silhouette"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-[78%_35%] md:object-[82%_center] scale-105 filter contrast-135 brightness-105 saturate-125 opacity-85 md:opacity-95 drop-shadow-[0_0_35px_rgba(239,68,68,0.9)] drop-shadow-[0_0_80px_rgba(220,38,38,0.6)] animate-red-rim-pulse"
        />

        {/* 4. Left-side Scrim for text readability, keeping the right-side hacker bathed in luminous red light */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/75 to-transparent md:from-[#050505] md:via-[#050505]/55 md:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-transparent to-[#050505]" />
        
        {/* 5. Cyber HUD Visual Effects Framing the Hacker Silhouette */}
        <div className="absolute top-[22%] right-[8%] md:right-[15%] hidden lg:block pointer-events-none">
          {/* Rotating Target Reticle around the Hacker */}
          <div className="relative w-72 h-72 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-red-500/40 border-dashed animate-hud-rotate" />
            <div className="absolute inset-4 rounded-full border border-red-500/30 animate-hud-rotate-reverse" />
            <div className="absolute inset-8 rounded-full border border-red-500/50" />
            
            {/* Crosshair ticks */}
            <div className="absolute top-0 w-4 h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444]" />
            <div className="absolute bottom-0 w-4 h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444]" />
            <div className="absolute left-0 w-0.5 h-4 bg-red-500 shadow-[0_0_8px_#ef4444]" />
            <div className="absolute right-0 w-0.5 h-4 bg-red-500 shadow-[0_0_8px_#ef4444]" />

            {/* Target telemetry label */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded bg-black/80 border border-red-600 font-mono text-[10px] text-red-400 font-bold whitespace-nowrap shadow-[0_0_15px_rgba(239,68,68,0.5)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span>[TARGET: ADVERSARY_ACTIVE]</span>
            </div>

            {/* Telemetry data tags */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-red-950/70 border border-red-800 font-mono text-[9px] text-red-300 whitespace-nowrap">
              ENTROPY: 7.942 // EXPLOIT: CVE-2026-9042
            </div>
          </div>
        </div>

        {/* 6. Scanlines and Laser Sweep Line */}
        <div className="scanlines absolute inset-0 opacity-25 pointer-events-none" />
        <div className="cyber-grid absolute inset-0 opacity-20 pointer-events-none" />
        <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500/80 to-transparent shadow-[0_0_20px_#ef4444] animate-scanline-sweep pointer-events-none" />

        {/* 7. Floating Security Nodes & Red Network Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-35 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cyberLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <line x1="15%" y1="20%" x2="40%" y2="35%" stroke="url(#cyberLineGrad)" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="40%" y1="35%" x2="65%" y2="25%" stroke="url(#cyberLineGrad)" strokeWidth="1" />
          <line x1="65%" y1="25%" x2="85%" y2="55%" stroke="url(#cyberLineGrad)" strokeWidth="1" strokeDasharray="6 3" />
          <line x1="40%" y1="35%" x2="35%" y2="70%" stroke="url(#cyberLineGrad)" strokeWidth="1" />
          <line x1="35%" y1="70%" x2="70%" y2="75%" stroke="url(#cyberLineGrad)" strokeWidth="1" strokeDasharray="3 3" />
          
          <circle cx="15%" cy="20%" r="3" fill="#ef4444" className="animate-ping" style={{ transformOrigin: '15% 20%' }} />
          <circle cx="40%" cy="35%" r="4" fill="#ef4444" />
          <circle cx="65%" cy="25%" r="3" fill="#ef4444" />
          <circle cx="85%" cy="55%" r="4" fill="#ef4444" className="animate-pulse" />
          <circle cx="35%" cy="70%" r="3.5" fill="#ef4444" />
          <circle cx="70%" cy="75%" r="4" fill="#ef4444" className="animate-ping" style={{ transformOrigin: '70% 75%' }} />
        </svg>

        {/* Subtle Background Terminal Activity Log */}
        <div className="absolute bottom-4 left-6 hidden xl:block font-mono text-[10px] text-red-500/50 space-y-0.5 pointer-events-none select-none">
          <div>&gt; [SYS_TELEMETRY] ADVERSARY TRAFFIC DETECTED ON PORT 443</div>
          <div>&gt; [FORENSICS] PAYLOAD ENTROPY SCAN: 7.94 (OBFUSCATED SCRIPT)</div>
          <div>&gt; [SOC_MONITOR] HEURISTIC ANALYSIS: SUSPICIOUS OAUTH GRANT IDENTIFIED</div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Command & Typography Area (7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-700/80 shadow-[0_0_20px_rgba(220,38,38,0.4)] backdrop-blur-md">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
              </span>
              <span className="font-mono text-[11px] sm:text-xs text-red-200 tracking-widest uppercase font-semibold">
                CYBER AWARENESS // 28-09-2026 // OFFLINE EVENT
              </span>
            </div>

            {/* High-Impact Headline */}
            <div className="space-y-2">
              <h1 className="font-orbitron font-black text-4xl sm:text-6xl md:text-7xl tracking-tight text-white uppercase leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
                SPOT THE{' '}
                <span className="relative inline-block px-3.5 py-1 bg-red-600 text-black shadow-[0_0_30px_rgba(239,68,68,0.85)] transform -skew-x-6">
                  [TRAP]
                </span>
                <br />
                <span className="text-glow-red text-red-500">STAY SAFE.</span>
              </h1>

              {/* Sub-tag & Author Credit */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="h-px w-10 bg-red-600/70" />
                <p className="font-mono text-red-400 text-xs sm:text-sm tracking-widest uppercase font-bold">
                  PROJECT PHISH HUNT
                </p>
                <span className="text-zinc-600">•</span>
                <span className="px-2 py-0.5 rounded bg-black/80 border border-zinc-800 font-mono text-[11px] text-zinc-300">
                  BUILT BY <strong className="text-red-400">SAHITHI</strong>
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-zinc-300 font-chakra text-base sm:text-lg md:text-xl font-normal leading-relaxed tracking-wide max-w-xl">
              An intense, escape-room-style cybersecurity competition. Step into the role of a digital forensics operative across 4 challenging stages and 25 realistic scenarios to dissect phishing payloads, repel social engineering traps, and contain coordinated cyberattacks.
            </p>

            {/* MANDATED SYSTEM STATUS PANEL */}
            <div className="w-full max-w-xl p-3.5 rounded-lg bg-black/90 border border-red-900/80 shadow-[0_0_25px_rgba(220,38,38,0.25)] font-mono">
              <div className="flex items-center justify-between text-zinc-500 text-[10px] uppercase font-bold tracking-widest pb-2 border-b border-red-950 mb-2.5">
                <span className="text-white flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-red-500" />
                  SYSTEM STATUS // INCIDENT RESPONSE CENTER
                </span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  CLASSIFIED SESSION
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="flex items-center gap-2 p-2 rounded bg-zinc-950/90 border border-zinc-900">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-zinc-400 text-[11px]">NETWORK:</span>
                  <span className="text-emerald-400 font-bold text-[11px]">SECURE</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-zinc-950/90 border border-zinc-900">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-zinc-400 text-[11px]">THREAT LEVEL:</span>
                  <span className="text-amber-400 font-bold text-[11px]">UNKNOWN</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-zinc-950/90 border border-zinc-900">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-zinc-400 text-[11px]">INVESTIGATION:</span>
                  <span className="text-red-400 font-bold text-[11px]">STANDBY</span>
                </div>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-enter-hunt-btn"
                onClick={() => {
                  cyberAudio.accessGranted();
                  onEnterHunt();
                }}
                className="group relative px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-chakra font-black text-base sm:text-lg tracking-widest uppercase rounded border border-red-400 shadow-[0_0_25px_rgba(220,38,38,0.7)] hover:shadow-[0_0_40px_rgba(220,38,38,1)] transition-all flex items-center gap-3 active:scale-95"
              >
                <Crosshair className="w-5 h-5 text-black group-hover:rotate-90 transition-transform duration-300" />
                <span>JOIN EVENT AS SQUAD</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                id="hero-how-it-works-btn"
                onClick={() => {
                  cyberAudio.click();
                  onHowItWorks();
                }}
                className="px-6 py-4 bg-zinc-950/90 hover:bg-zinc-900 text-zinc-200 hover:text-white font-chakra font-bold text-sm sm:text-base tracking-wider uppercase rounded border border-zinc-700 hover:border-red-600 transition-all flex items-center gap-2"
              >
                <Terminal className="w-4 h-4 text-red-500" />
                <span>MISSION INTEL</span>
              </button>

              <button
                id="hero-view-rounds-btn"
                onClick={() => {
                  cyberAudio.click();
                  onViewRounds();
                }}
                className="px-5 py-4 bg-red-950/50 hover:bg-red-950/90 text-red-300 hover:text-red-100 font-chakra font-bold text-sm tracking-wider uppercase rounded border border-red-900/80 hover:border-red-600 transition-all flex items-center gap-2"
              >
                <span>4 STAGES</span>
              </button>
            </div>

            {/* HUD Status Bar */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <div className="p-3 rounded bg-black/85 border border-red-950/90 corner-bracket-tl shadow-[0_0_15px_rgba(0,0,0,0.5)] cyber-hover-card cursor-pointer">
                <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-mono uppercase mb-1">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  <span>EVENT STATE</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-orbitron font-bold text-xs text-emerald-400">ONLINE</span>
                </div>
              </div>

              <div className="p-3 rounded bg-black/85 border border-red-950/90 shadow-[0_0_15px_rgba(0,0,0,0.5)] cyber-hover-card cursor-pointer">
                <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-mono uppercase mb-1">
                  <ShieldAlert className="w-3 h-3 text-red-500" />
                  <span>SCENARIOS</span>
                </div>
                <span className="font-orbitron font-bold text-xs text-white">25 QUESTIONS</span>
              </div>

              <div className="p-3 rounded bg-black/85 border border-red-950/90 shadow-[0_0_15px_rgba(0,0,0,0.5)] cyber-hover-card cursor-pointer">
                <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-mono uppercase mb-1">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>TOTAL POINTS</span>
                </div>
                <span className="font-orbitron font-bold text-xs text-red-400">500 PTS</span>
              </div>

              <div className="p-3 rounded bg-black/85 border border-red-950/90 corner-bracket-br shadow-[0_0_15px_rgba(0,0,0,0.5)] cyber-hover-card cursor-pointer">
                <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-mono uppercase mb-1">
                  <Lock className="w-3 h-3 text-red-500" />
                  <span>EVENT MODE</span>
                </div>
                <span className="font-orbitron font-bold text-xs text-zinc-200">OFFLINE ESCAPE</span>
              </div>
            </div>

          </div>

          {/* Right Column: Tactical Command HUD & Threat Monitor Terminal (5 cols on desktop) */}
          <div className="lg:col-span-5 flex items-center justify-center">
            
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden border-2 border-red-600/90 bg-black/90 backdrop-blur-xl shadow-[0_0_50px_rgba(220,38,38,0.45)] hover:shadow-[0_0_60px_rgba(220,38,38,0.7)] hover:border-red-500 transition-all duration-300 p-5 space-y-4">
              
              {/* Terminal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-red-950/90">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
                  <span className="font-orbitron font-bold text-xs text-red-400 tracking-wider">
                    TARGET: ADVERSARY NODE
                  </span>
                </div>
                <div className="px-2 py-0.5 rounded bg-red-950/60 border border-red-800 text-[10px] font-mono text-zinc-300">
                  DEF_LEVEL: 04
                </div>
              </div>

              {/* Threat Actor Reconnaissance & Radar Targeting Scope */}
              <div className="relative w-full h-52 rounded-xl bg-[#070709] border border-red-700/80 flex items-center justify-center overflow-hidden shadow-[inset_0_0_30px_rgba(220,38,38,0.35)]">
                
                {/* 1. Glowing Silhouette Backlight Aura */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.45)_0%,rgba(185,28,28,0.2)_40%,transparent_75%)] pointer-events-none animate-pulse" />
                
                {/* 2. Volumetric Cyber Smoke in Viewport */}
                <div className="absolute inset-x-0 bottom-0 h-28 bg-[radial-gradient(ellipse_at_bottom,rgba(239,68,68,0.35)_0%,rgba(0,0,0,0.6)_60%,transparent_90%)] blur-lg pointer-events-none animate-smoke-drift-1" />
                
                {/* 3. Clearly Recognizable Hooded Hacker with Strong Red Rim Lighting */}
                <img
                  src={hackerHeroImg}
                  alt="Target Threat Actor"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-[78%_25%] filter contrast-140 brightness-110 saturate-125 opacity-90 drop-shadow-[0_0_20px_#ef4444] drop-shadow-[0_0_45px_#dc2626] animate-red-rim-pulse"
                />

                {/* 4. Deep Contrast Vignette & CRT Scanlines */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />
                <div className="scanlines absolute inset-0 opacity-30 pointer-events-none" />
                <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent shadow-[0_0_12px_#ef4444] animate-scanline-sweep pointer-events-none" />

                {/* 5. Tactical Radar Scope Overlaid on Hacker */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="absolute w-44 h-44 rounded-full border border-red-500/25" />
                  <div className="absolute w-32 h-32 rounded-full border border-red-500/35" />
                  <div className="absolute w-16 h-16 rounded-full border border-red-500/60" />
                  <div className="absolute w-full h-px bg-red-500/25" />
                  <div className="absolute h-full w-px bg-red-500/25" />
                  
                  {/* Rotating Radar Sweep */}
                  <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(239,68,68,0.4)_360deg)] animate-spin-slow rounded-full pointer-events-none" />
                </div>
                
                {/* 6. Threat Target Lock Brackets around Hooded Face */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-24 border border-red-500/60 rounded pointer-events-none flex flex-col justify-between p-1">
                  <div className="flex justify-between">
                    <span className="w-2 h-2 border-t-2 border-l-2 border-red-500" />
                    <span className="w-2 h-2 border-t-2 border-r-2 border-red-500" />
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="w-2 h-2 border-b-2 border-l-2 border-red-500" />
                    <span className="w-2 h-2 border-b-2 border-r-2 border-red-500" />
                  </div>
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-black/90 border border-red-500 text-[8px] font-mono text-red-400 font-bold whitespace-nowrap shadow-[0_0_8px_#ef4444]">
                    [TARGET: ADVERSARY_ALPHA]
                  </div>
                </div>

                {/* Threat Blips */}
                <div className="absolute top-8 right-6 flex items-center gap-1 pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[9px] font-mono text-red-300 font-bold bg-black/80 px-1 rounded border border-red-900">SPEAR_PHISH</span>
                </div>
                <div className="absolute bottom-6 left-5 flex items-center gap-1 pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-[9px] font-mono text-amber-300 font-bold bg-black/80 px-1 rounded border border-amber-900">MFA_TRAP</span>
                </div>

                {/* Status Bar */}
                <div className="absolute top-2 left-2 z-10 pointer-events-none bg-black/85 px-2 py-0.5 rounded border border-red-900/80 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[9px] font-mono text-red-400 font-bold uppercase tracking-wider">LIVE ADVERSARY TRACK</span>
                </div>
              </div>

              {/* Stage Progression Matrix */}
              <div className="space-y-2 font-mono text-xs">
                <div className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider flex items-center justify-between">
                  <span>ROUND DOSSIERS</span>
                  <span className="text-red-400">25 TOTAL CHALLENGES</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded bg-black/70 border border-red-950 flex flex-col">
                    <span className="text-[10px] text-zinc-500">STAGE 01</span>
                    <span className="text-white font-bold text-xs">Q1–Q8 (EASY)</span>
                    <span className="text-red-400 text-[10px] font-semibold">+10 / -5 PTS</span>
                  </div>
                  <div className="p-2 rounded bg-black/70 border border-red-950 flex flex-col">
                    <span className="text-[10px] text-zinc-500">STAGE 02</span>
                    <span className="text-white font-bold text-xs">Q9–Q14 (MEDIUM)</span>
                    <span className="text-red-400 text-[10px] font-semibold">+20 / -10 PTS</span>
                  </div>
                  <div className="p-2 rounded bg-black/70 border border-red-950 flex flex-col">
                    <span className="text-[10px] text-zinc-500">STAGE 03</span>
                    <span className="text-white font-bold text-xs">Q15–Q20 (MED→HARD)</span>
                    <span className="text-red-400 text-[10px] font-semibold">+20/+30 PTS</span>
                  </div>
                  <div className="p-2 rounded bg-black/70 border border-red-950 flex flex-col">
                    <span className="text-[10px] text-zinc-500">STAGE 04</span>
                    <span className="text-white font-bold text-xs">Q21–Q25 (FINAL)</span>
                    <span className="text-red-400 text-[10px] font-semibold">+30 / -13 PTS</span>
                  </div>
                </div>
              </div>

              {/* Bottom Telemetry Bar */}
              <div className="p-2.5 rounded bg-black/80 border border-red-900/60 flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <Zap className="w-3.5 h-3.5 text-red-500" />
                  <span>FORENSICS READY</span>
                </div>
                <span className="text-emerald-400 font-bold">READY TO DEPLOY</span>
              </div>

              {/* Corner Brackets */}
              <div className="corner-bracket-tl absolute inset-0 pointer-events-none" />
              <div className="corner-bracket-br absolute inset-0 pointer-events-none" />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
