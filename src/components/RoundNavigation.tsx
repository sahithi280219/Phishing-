import React, { useState, useEffect } from 'react';
import { Shield, Clock, Award, CheckCircle2, Lock, Flame } from 'lucide-react';
import { Team, EventState } from '../types';

interface RoundNavigationProps {
  team: Team;
  eventState: EventState;
  currentRoundNumber: 1 | 2 | 3 | 4;
}

export const RoundNavigation: React.FC<RoundNavigationProps> = ({
  team,
  eventState,
  currentRoundNumber,
}) => {
  // Server-Authoritative Timer Countdown
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);

  useEffect(() => {
    const updateTimer = () => {
      if (eventState.roundStatus === 'PAUSED' && eventState.roundPauseRemainingSec !== null) {
        setSecondsRemaining(eventState.roundPauseRemainingSec);
        return;
      }

      if (eventState.roundStatus === 'ACTIVE' && eventState.roundStartTime) {
        const now = Date.now();
        const elapsedSec = Math.floor((now - eventState.roundStartTime) / 1000);
        const rem = Math.max(0, eventState.roundDurationSec - elapsedSec);
        setSecondsRemaining(rem);
      } else {
        setSecondsRemaining(0);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [eventState]);

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isLowTime = secondsRemaining <= 60 && secondsRemaining > 0;

  return (
    <div className="w-full bg-[#08080a]/95 border-b border-red-950/80 sticky top-16 z-40 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Project + Team + Total Score */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-black border border-red-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <div className="font-orbitron font-black text-xs sm:text-sm text-white tracking-widest uppercase">
                PHISH <span className="text-red-600">HUNT</span>
              </div>
              <div className="font-mono text-[10px] text-zinc-400">
                TEAM: <strong className="text-red-400 uppercase">{team.name}</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded bg-black border border-red-900/60">
            <Award className="w-4 h-4 text-red-500" />
            <div className="text-left">
              <span className="text-[9px] font-mono text-zinc-400 block leading-none">SCORE</span>
              <span className="font-orbitron font-bold text-xs sm:text-sm text-white">
                {team.currentScore} <span className="text-zinc-500">/ 100</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center: The 4 Round Status Badges */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto justify-center">
          {[1, 2, 3, 4].map((rNum) => {
            const isCompleted = rNum < currentRoundNumber || (rNum === currentRoundNumber && eventState.roundStatus === 'COMPLETED');
            const isActive = rNum === currentRoundNumber && eventState.roundStatus === 'ACTIVE';
            const isPaused = rNum === currentRoundNumber && eventState.roundStatus === 'PAUSED';
            const isLocked = rNum > currentRoundNumber;

            return (
              <div
                key={rNum}
                className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1.5 whitespace-nowrap border transition-all ${
                  isActive
                    ? 'bg-red-950/80 border-red-500 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.4)] animate-pulse'
                    : isPaused
                    ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                    : isCompleted
                    ? 'bg-zinc-900 border-zinc-700 text-zinc-300'
                    : 'bg-black/60 border-zinc-900 text-zinc-600'
                }`}
              >
                {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                {isActive && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />}
                {isPaused && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                {isLocked && <Lock className="w-3 h-3 text-zinc-600" />}

                <span className="font-bold">
                  ROUND 0{rNum}
                </span>

                <span className="text-[10px] uppercase">
                  {isCompleted ? '✓ DONE' : isActive ? '🔴 ACTIVE' : isPaused ? '⏸ PAUSED' : '🔒 LOCKED'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right: Round Counter + Global Countdown Timer */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="text-right">
            <span className="text-[10px] font-mono text-zinc-400 block leading-none">ROUND</span>
            <span className="font-orbitron font-bold text-xs sm:text-sm text-red-400">
              0{currentRoundNumber} / 04
            </span>
          </div>

          <div
            className={`px-3.5 py-1.5 rounded bg-black border flex items-center gap-2 ${
              isLowTime
                ? 'border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse'
                : 'border-red-900/80 text-white'
            }`}
          >
            <Clock className={`w-4 h-4 ${isLowTime ? 'text-red-500 animate-spin' : 'text-red-400'}`} />
            <span className="font-orbitron font-black text-sm sm:text-base tracking-widest">
              {formatTimer(secondsRemaining)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
