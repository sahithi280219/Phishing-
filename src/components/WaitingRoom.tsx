import React, { useState, useEffect } from 'react';
import { Users, Radio, Wifi, Lock, LogOut, Play, Sparkles } from 'lucide-react';
import { cyberAudio } from '../utils/cyberAudio';
import { Team, EventState } from '../types';
import { quickStartRound, fetchEventSync } from '../utils/api';

interface WaitingRoomProps {
  team: Team;
  eventState: EventState | null;
  onLeaveTeam: () => void;
  onLaunchRound?: () => void;
}

export const WaitingRoom: React.FC<WaitingRoomProps> = ({ team, eventState, onLeaveTeam, onLaunchRound }) => {
  const [starting, setStarting] = useState(false);

  // Active polling fallback to detect round start without delay
  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const sync = await fetchEventSync();
        if (sync.event && sync.event.currentRound >= 1 && sync.event.roundStatus === 'ACTIVE') {
          onLaunchRound?.();
        }
      } catch {
        // Silently ignore
      }
    }, 2500);

    return () => clearInterval(timer);
  }, [onLaunchRound]);

  const handleQuickStart = async () => {
    if (starting) return;
    setStarting(true);
    cyberAudio.click();
    try {
      await quickStartRound(1);
      cyberAudio.accessGranted();
      onLaunchRound?.();
    } catch {
      cyberAudio.warning();
    } finally {
      setStarting(false);
    }
  };
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 cyber-grid">
      
      <div className="w-full max-w-xl bg-[#08080a] border border-red-800 rounded-lg p-6 sm:p-8 shadow-[0_0_35px_rgba(220,38,38,0.35)] relative corner-bracket-tl corner-bracket-br">
        
        {/* Top Status Badges */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider">
              TERMINAL CONNECTED // ENCRYPTED SESSION
            </span>
          </div>

          <button
            id="waiting-room-leave-btn"
            onClick={() => {
              cyberAudio.click();
              onLeaveTeam();
            }}
            className="text-[11px] font-mono text-zinc-500 hover:text-red-400 flex items-center gap-1 transition-colors"
          >
            <LogOut className="w-3 h-3" />
            <span>SWITCH SQUAD</span>
          </button>
        </div>

        {/* Radar Animation / Icon */}
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-red-800/40 animate-ping opacity-30" />
          <div className="absolute inset-2 rounded-full border border-red-600/50 animate-pulse" />
          <div className="w-18 h-18 rounded-full bg-black border-2 border-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.6)]">
            <Radio className="w-8 h-8 text-red-500 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
        </div>

        {/* Mandated Format Display */}
        <div className="text-center space-y-4 mb-6">
          <div>
            <h1 className="font-orbitron font-black text-3xl sm:text-4xl text-white uppercase tracking-wider drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              PHISH HUNT
            </h1>
            <div className="text-xs font-mono text-zinc-500 mt-0.5">
              CYBER INCIDENT RESPONSE // 28-09-2026 // LIVE OPERATION
            </div>
          </div>

          <div className="p-3.5 rounded bg-black/90 border border-zinc-800 max-w-sm mx-auto">
            <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest block mb-1">
              TEAM IDENTIFIER:
            </span>
            <span className="font-orbitron font-black text-xl text-red-400 tracking-wide block">
              {team.name}
            </span>
          </div>

          {/* MANDATED MISSION STATUS BLOCK */}
          <div className="p-4 rounded-lg bg-red-950/20 border-2 border-red-600/70 max-w-md mx-auto shadow-[0_0_25px_rgba(220,38,38,0.3)]">
            <span className="font-mono text-[11px] text-zinc-400 uppercase tracking-widest block mb-1">
              MISSION STATUS
            </span>
            <div className="font-orbitron font-black text-lg sm:text-xl text-red-400 flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span>WAITING FOR ADMIN AUTHORIZATION</span>
            </div>
            <div className="font-mono text-xs text-zinc-400 tracking-wider mt-1.5 flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-red-500" />
              <span>MISSION CHANNEL STANDBY</span>
            </div>
          </div>

          {/* MANDATED SYSTEM VERIFICATION MATRIX */}
          <div className="p-4 rounded-lg bg-black/90 border border-red-950 max-w-md mx-auto text-left font-mono">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold pb-2 border-b border-zinc-900 mb-2.5 flex items-center justify-between">
              <span>SYSTEM DIAGNOSTICS</span>
              <span className="text-emerald-400 font-bold">ALL NODES OK</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-emerald-400">● EVENT CONNECTED</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-emerald-400">● TEAM VERIFIED</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-emerald-400">● SECURE CHANNEL ACTIVE</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-semibold text-amber-400">● ROUND LOCKED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lockout Notice & Quick Start */}
        <div className="p-3.5 rounded bg-red-950/20 border border-red-900/50 mb-4 flex items-start gap-3 text-xs font-mono text-zinc-400">
          <Lock className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-red-300 font-bold block mb-0.5 uppercase">ADMIN MASTER CONTROL ACTIVE</span>
            <span>
              The Admin controls the complete event. When the Admin starts Round 1, your terminal will launch automatically.
            </span>
          </div>
        </div>

        {/* Quick Launch Round 1 Option for Demo / Organizer Testing */}
        <div className="mb-6">
          <button
            id="waiting-room-quick-start-btn"
            onClick={handleQuickStart}
            disabled={starting}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-chakra font-black text-xs sm:text-sm uppercase tracking-widest rounded border border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.6)] flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{starting ? 'INITIALIZING ROUND 01...' : 'START ROUND 1 (DEMO / ORGANIZER LAUNCH)'}</span>
            <Sparkles className="w-4 h-4 text-amber-300" />
          </button>
        </div>

        {/* Squad Members Roster */}
        <div className="p-4 rounded bg-black/70 border border-zinc-900">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-red-500" />
              <span>SQUAD ROSTER ({team.members.length} MEMBERS)</span>
            </div>
            <span className="text-[10px] text-zinc-500">EVENT CODE: {team.eventCode}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {team.members.map((member, i) => (
              <div key={i} className="p-2 rounded bg-zinc-950 border border-zinc-800 text-xs font-chakra text-zinc-300 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-red-950 border border-red-700 flex items-center justify-center text-[10px] text-red-400 font-mono">
                  {i + 1}
                </span>
                <span className="truncate">{member}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="mt-6 pt-4 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-emerald-500" />
            <span>SERVER LATENCY &lt; 20ms</span>
          </div>
          <span>BUILT BY SAHITHI</span>
        </div>

      </div>

    </div>
  );
};
