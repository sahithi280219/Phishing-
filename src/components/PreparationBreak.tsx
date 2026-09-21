import React, { useState, useEffect } from 'react';
import { Clock, ShieldAlert, Award, Lock, Sparkles } from 'lucide-react';
import { EventState, Team } from '../types';
import { ROUNDS_INFO } from '../data/gameData';

interface PreparationBreakProps {
  eventState: EventState;
  team: Team;
}

export const PreparationBreak: React.FC<PreparationBreakProps> = ({ eventState, team }) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(120);

  // Synchronize with global server break timestamp
  useEffect(() => {
    const updateBreakTimer = () => {
      if (eventState.breakStartTime) {
        const now = Date.now();
        const elapsedSec = Math.floor((now - eventState.breakStartTime) / 1000);
        const rem = Math.max(0, eventState.breakDurationSec - elapsedSec);
        setSecondsRemaining(rem);
      } else {
        setSecondsRemaining(120);
      }
    };

    updateBreakTimer();
    const interval = setInterval(updateBreakTimer, 1000);
    return () => clearInterval(interval);
  }, [eventState]);

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const completedRoundNum = eventState.currentRound;
  const lastRoundScore = completedRoundNum > 0 ? team.roundScores[completedRoundNum as 1 | 2 | 3 | 4] : 0;
  const nextRoundNum = Math.min(4, completedRoundNum + 1);
  const nextRoundInfo = ROUNDS_INFO.find((r) => r.number === nextRoundNum);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10 cyber-grid">
      
      <div className="w-full max-w-xl bg-[#08080a] border border-red-800 rounded-lg p-6 sm:p-8 shadow-[0_0_35px_rgba(220,38,38,0.4)] text-center relative corner-bracket-tl corner-bracket-br">
        
        {/* Header Status */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-red-950/80 border border-red-700 text-red-300 font-mono text-xs uppercase mb-4 shadow-[0_0_15px_rgba(220,38,38,0.4)]">
          <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
          <span>CYBER INCIDENT RESPONSE // STAGE COMPLETE</span>
        </div>

        {/* Mandated Round Completion Telemetry */}
        <div className="p-4 rounded-lg bg-black/90 border border-red-900/80 font-mono text-left text-xs mb-5 space-y-1">
          <div className="text-emerald-400 font-bold flex items-center gap-2">
            <span>&gt; MISSION COMPLETE</span>
            <span className="w-1.5 h-3 bg-emerald-500 animate-terminal-blink inline-block" />
          </div>
          <div className="text-zinc-300">&gt; THREAT ANALYSIS SAVED</div>
          <div className="text-red-400 font-bold">&gt; AWAITING COMMAND AUTHORIZATION</div>
        </div>

        <h2 className="font-orbitron font-black text-2xl sm:text-3xl text-white uppercase tracking-wider mb-2">
          ROUND 0{completedRoundNum} DEBRIEF
        </h2>

        {/* WAITING FOR ADMIN BADGE */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-950/60 border border-red-600 text-red-400 font-orbitron font-bold text-sm tracking-wider uppercase my-2 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse">
          <Lock className="w-4 h-4 text-red-500" />
          <span>WAITING FOR ADMIN</span>
        </div>

        {/* Score Display Card */}
        <div className="p-4 rounded-lg bg-black/80 border border-red-900/80 max-w-xs mx-auto my-5 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
          <span className="text-zinc-400 text-xs font-mono uppercase block mb-1">
            TEAM: <strong className="text-white">{team.name}</strong>
          </span>
          <div className="flex items-center justify-center gap-2">
            <Award className="w-6 h-6 text-red-500" />
            <div className="font-orbitron font-black text-3xl text-white">
              {lastRoundScore} <span className="text-zinc-500 text-lg">/ 25</span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-red-400 mt-1 block">
            TOTAL SCORE: {team.currentScore} / 100
          </span>
        </div>

        {/* Global 2-Minute Preparation Timer */}
        <div className="my-6">
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
            PREPARATION BREAK // GLOBAL SERVER COUNTDOWN
          </div>
          <div className="inline-block px-8 py-3 rounded bg-black border-2 border-red-600 shadow-[0_0_25px_rgba(220,38,38,0.5)]">
            <div className="font-orbitron font-black text-4xl sm:text-5xl text-red-500 tracking-widest animate-pulse">
              {formatTimer(secondsRemaining)}
            </div>
          </div>
          <div className="text-[11px] font-mono text-zinc-500 mt-2">
            ALL PARTICIPATING SQUADS ARE SYNCHRONIZED TO THIS CENTRAL CLOCK
          </div>
        </div>

        {/* Locked Next Round Card */}
        <div className="p-4 rounded bg-red-950/20 border border-red-900/60 text-left my-6 flex items-start gap-3">
          <Lock className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-orbitron font-bold text-xs text-red-300 uppercase flex items-center gap-2">
              <span>NEXT ROUND LOCKED</span>
              <span>•</span>
              <span className="text-zinc-400">WAITING FOR EVENT ADMIN</span>
            </div>
            {nextRoundInfo && (
              <p className="text-zinc-400 font-chakra text-xs">
                Next: <strong className="text-white">ROUND 0{nextRoundInfo.number}: {nextRoundInfo.title}</strong> ({nextRoundInfo.subtitle}) - {Math.floor(nextRoundInfo.durationSec / 60)} minutes.
              </p>
            )}
            <p className="text-zinc-500 text-[11px] font-mono">
              The Event Controller will initiate the round when all squads are ready. Do not refresh.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-900 text-zinc-500 text-[11px] font-mono flex items-center justify-between">
          <span>EVENT: CYBER AWARENESS PHISH HUNT</span>
          <span>BUILT BY SAHITHI</span>
        </div>

      </div>

    </div>
  );
};
