import React, { useState } from 'react';
import { Terminal, Play, Square, Pause, RotateCcw, Trophy, Users, ShieldAlert, Clock, Award, Radio, LogOut, CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';
import { EventState, Team, LeaderboardEntry } from '../types';
import {
  adminControlRound,
  adminPauseEvent,
  adminResumeEvent,
  adminResetEvent,
  adminAnnounceResults,
  adminClearAuth,
} from '../utils/api';
import { cyberAudio } from '../utils/cyberAudio';
import { ROUNDS_INFO } from '../data/gameData';

interface AdminDashboardProps {
  eventState: EventState;
  teams: Team[];
  leaderboard: LeaderboardEntry[];
  onLogout: () => void;
  onRefreshData: () => void;
  onLaunchRoundView?: (roundNum: number) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  eventState,
  teams,
  leaderboard,
  onLogout,
  onRefreshData,
  onLaunchRoundView,
}) => {
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [justStartedRound, setJustStartedRound] = useState<number | null>(null);

  const handleRoundAction = async (roundNum: 1 | 2 | 3 | 4, action: 'START' | 'END' | 'START_BREAK') => {
    setActionLoading(true);
    setActionMessage(null);
    cyberAudio.click();

    try {
      const res = await adminControlRound(roundNum, action);
      if (res.success) {
        cyberAudio.accessGranted();
        setActionMessage(`COMMAND ACCEPTED: ROUND 0${roundNum} ${action}`);
        if (action === 'START') {
          setJustStartedRound(roundNum);
        }
        onRefreshData();
      } else {
        cyberAudio.warning();
        setActionMessage('COMMAND REJECTED BY CONTROLLER');
      }
    } catch {
      cyberAudio.warning();
      setActionMessage('SERVER ERROR EXECUTING ACTION');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePause = async () => {
    setActionLoading(true);
    cyberAudio.warning();
    try {
      await adminPauseEvent();
      setActionMessage('EVENT PAUSED ON ALL TERMINALS');
      onRefreshData();
    } finally {
      setActionLoading(false);
    }
  };

  const handleResume = async () => {
    setActionLoading(true);
    cyberAudio.accessGranted();
    try {
      await adminResumeEvent();
      setActionMessage('EVENT RESUMED');
      onRefreshData();
    } finally {
      setActionLoading(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('RESET EVENT: Are you sure you want to return the competition to the waiting room?')) {
      return;
    }
    setActionLoading(true);
    cyberAudio.warning();
    try {
      await adminResetEvent();
      setActionMessage('EVENT RESET TO LOBBY STAGE');
      onRefreshData();
    } finally {
      setActionLoading(false);
    }
  };

  const handleAnnounce = async () => {
    setActionLoading(true);
    cyberAudio.accessGranted();
    try {
      await adminAnnounceResults();
      setActionMessage('OFFICIAL RESULTS BROADCAST TO ALL TEAMS');
      onRefreshData();
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogoutAdmin = () => {
    cyberAudio.click();
    adminClearAuth();
    onLogout();
  };

  const currentRoundInfo = ROUNDS_INFO.find((r) => r.number === eventState.currentRound);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 cyber-grid">
      
      {/* Top HUD Command Bar */}
      <div className="bg-[#08080a] border border-red-800 rounded-lg p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_0_25px_rgba(220,38,38,0.25)]">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-black border border-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            <Terminal className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <div className="font-orbitron font-black text-xl text-white tracking-wider flex items-center gap-2">
              <span>ADMIN COMMAND CENTER</span>
              <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-700 text-red-400 text-[10px] font-mono">
                MASTER CONTROLLER
              </span>
            </div>
            <div className="font-mono text-xs text-zinc-400">
              EVENT: <strong className="text-white">CYBER AWARENESS PHISH HUNT</strong> • CODE:{' '}
              <strong className="text-red-400">{eventState.eventCode}</strong>
            </div>
          </div>
        </div>

        {/* Global Controls: Pause, Resume, Reset, Logout */}
        <div className="flex flex-wrap items-center gap-2">
          {eventState.roundStatus === 'PAUSED' ? (
            <button
              onClick={handleResume}
              disabled={actionLoading}
              className="px-3 py-1.5 rounded bg-emerald-950 border border-emerald-500 text-emerald-300 hover:bg-emerald-900 font-chakra text-xs font-bold uppercase flex items-center gap-1.5 transition-all"
            >
              <Play className="w-3.5 h-3.5" />
              <span>RESUME EVENT</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              disabled={actionLoading || eventState.roundStatus === 'NOT_STARTED'}
              className="px-3 py-1.5 rounded bg-amber-950/80 border border-amber-500 text-amber-300 hover:bg-amber-900 font-chakra text-xs font-bold uppercase flex items-center gap-1.5 transition-all"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>PAUSE EVENT</span>
            </button>
          )}

          <button
            onClick={handleReset}
            disabled={actionLoading}
            className="px-3 py-1.5 rounded bg-black border border-zinc-700 hover:border-red-600 text-zinc-400 hover:text-white font-chakra text-xs font-bold uppercase flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET EVENT</span>
          </button>

          <button
            onClick={handleLogoutAdmin}
            className="px-3 py-1.5 rounded bg-red-950/50 border border-red-900 hover:border-red-600 text-red-400 hover:text-red-200 font-chakra text-xs font-bold uppercase flex items-center gap-1.5 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>DISCONNECT</span>
          </button>
        </div>

      </div>

      {/* Action Feedback Banner */}
      {actionMessage && (
        <div className="p-3 rounded bg-red-950/60 border border-red-600 text-white font-mono text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse">
          <Terminal className="w-4 h-4 text-red-400" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Active Round Controller Banner */}
      {eventState.roundStatus === 'ACTIVE' && (
        <div className="p-5 rounded-lg bg-emerald-950/30 border-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded bg-black border border-emerald-500 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              <Play className="w-5 h-5 fill-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>ROUND 0{eventState.currentRound} IS CURRENTLY ACTIVE &amp; LIVE</span>
              </div>
              <h4 className="font-orbitron font-bold text-white text-base mt-0.5">
                ALL PARTICIPANT SCREENS ARE SYNCHRONIZED
              </h4>
              <p className="text-zinc-400 font-chakra text-xs">
                You can play along as inspector or monitor squad submissions in real time.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              id="admin-enter-active-round-banner-btn"
              onClick={() => {
                cyberAudio.accessGranted();
                onLaunchRoundView?.(eventState.currentRound);
              }}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-chakra font-black text-sm uppercase tracking-wider rounded border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.6)] flex items-center gap-2 transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>ENTER &amp; PLAY ROUND 0{eventState.currentRound}</span>
            </button>
            <button
              onClick={() => handleRoundAction(eventState.currentRound as 1 | 2 | 3 | 4, 'END')}
              disabled={actionLoading}
              className="px-4 py-3 bg-zinc-900 hover:bg-black text-red-400 font-chakra font-bold text-xs uppercase tracking-wider rounded border border-zinc-700 hover:border-red-600 flex items-center gap-1.5 transition-all"
            >
              <Square className="w-3.5 h-3.5" />
              <span>END ROUND</span>
            </button>
          </div>
        </div>
      )}

      {/* Primary Master Trigger: START EVENT (When in Waiting Room / Lobby) */}
      {eventState.currentRound === 0 && (
        <div className="p-5 rounded-lg bg-red-950/40 border-2 border-red-600 shadow-[0_0_30px_rgba(239,68,68,0.4)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>EVENT LOBBY READY // {teams.length} SQUADS IN WAITING ROOM</span>
            </div>
            <h3 className="font-orbitron font-black text-xl text-white mt-1">
              MASTER CONTROL: INITIATE COMPETITION
            </h3>
            <p className="text-zinc-300 font-chakra text-xs mt-0.5">
              Clicking START EVENT will simultaneously transition all waiting participant terminals and launch Round 1.
            </p>
          </div>

          <button
            id="admin-start-event-master-btn"
            onClick={() => handleRoundAction(1, 'START')}
            disabled={actionLoading}
            className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-chakra font-black text-base uppercase tracking-widest rounded border border-red-400 shadow-[0_0_25px_rgba(239,68,68,0.8)] hover:shadow-[0_0_40px_rgba(239,68,68,1)] flex items-center gap-2 shrink-0 transition-all active:scale-95"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>START EVENT &amp; ROUND 1</span>
          </button>
        </div>
      )}

      {/* Controller Statistics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-lg bg-[#09090b] border border-red-950">
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono uppercase mb-1">
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>EVENT STATUS</span>
          </div>
          <div className="font-orbitron font-black text-lg text-white">
            {eventState.roundStatus === 'IN_BREAK'
              ? 'PREPARATION BREAK'
              : eventState.roundStatus === 'ACTIVE'
              ? `ROUND 0${eventState.currentRound} ACTIVE`
              : eventState.roundStatus === 'COMPLETED'
              ? 'ROUND COMPLETED'
              : eventState.roundStatus === 'PAUSED'
              ? 'PAUSED'
              : 'WAITING ROOM'}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#09090b] border border-red-950">
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono uppercase mb-1">
            <Users className="w-4 h-4 text-red-400" />
            <span>CONNECTED TEAMS</span>
          </div>
          <div className="font-orbitron font-black text-2xl text-white">
            {teams.length}{' '}
            <span className="text-xs font-mono text-zinc-500 font-normal">SQUADS</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#09090b] border border-red-950">
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono uppercase mb-1">
            <Clock className="w-4 h-4 text-red-400" />
            <span>CURRENT PHASE</span>
          </div>
          <div className="font-orbitron font-black text-lg text-red-400">
            {eventState.currentRound === 0 ? 'LOBBY' : `ROUND 0${eventState.currentRound} / 04`}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#09090b] border border-red-950">
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono uppercase mb-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>RESULTS STATE</span>
          </div>
          <div className="font-orbitron font-black text-lg text-amber-400">
            {eventState.resultsAnnounced ? 'BROADCAST ACTIVE' : 'PENDING'}
          </div>
        </div>

      </div>

      {/* Master Round-by-Round Execution Panel */}
      <div className="bg-[#09090b] border border-red-950 rounded-lg p-5">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <h3 className="font-orbitron font-bold text-base sm:text-lg text-white uppercase">
              AUTHORITATIVE ROUND LAUNCH CONTROLS
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            PARTICIPANTS CANNOT MANUALLY PROGRESS
          </span>
        </div>

        {/* 4 Rounds Control Rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROUNDS_INFO.map((round) => {
            const isCurrent = eventState.currentRound === round.number;
            const isCompleted = eventState.currentRound > round.number || (isCurrent && eventState.roundStatus === 'COMPLETED');
            const isActive = isCurrent && eventState.roundStatus === 'ACTIVE';
            const isInBreak = isCurrent && eventState.roundStatus === 'IN_BREAK';

            return (
              <div
                key={round.number}
                className={`p-4 rounded-lg border flex flex-col justify-between space-y-4 transition-all ${
                  isActive
                    ? 'bg-red-950/40 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.35)]'
                    : isCompleted
                    ? 'bg-black/60 border-zinc-800'
                    : 'bg-[#08080a] border-zinc-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-red-500 font-bold">ROUND 0{round.number}</span>
                    <span className="text-zinc-500">{Math.floor(round.durationSec / 60)} MIN</span>
                  </div>

                  <h4 className="font-orbitron font-bold text-sm text-white">
                    {round.title}
                  </h4>
                  <p className="text-xs text-zinc-400 font-chakra mt-1">
                    {round.subtitle}
                  </p>

                  <div className="mt-2 text-[10px] font-mono">
                    {isActive && (
                      <span className="text-emerald-400 flex items-center gap-1 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        RUNNING ON ALL CLIENTS
                      </span>
                    )}
                    {isInBreak && (
                      <span className="text-amber-400 flex items-center gap-1 font-bold">
                        <Clock className="w-3 h-3" />
                        2-MIN BREAK COUNTDOWN
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-zinc-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        COMPLETED
                      </span>
                    )}
                    {!isActive && !isInBreak && !isCompleted && (
                      <span className="text-zinc-600">LOCKED / READY</span>
                    )}
                  </div>
                </div>

                {/* Buttons for this round */}
                <div className="space-y-2 pt-2 border-t border-zinc-900">
                  {!isActive ? (
                    <button
                      onClick={() => handleRoundAction(round.number as 1 | 2 | 3 | 4, 'START')}
                      disabled={actionLoading}
                      className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-chakra text-xs font-bold uppercase rounded border border-red-400 shadow-[0_0_10px_rgba(220,38,38,0.4)] flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>START ROUND 0{round.number}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRoundAction(round.number as 1 | 2 | 3 | 4, 'END')}
                      disabled={actionLoading}
                      className="w-full py-2 bg-zinc-900 hover:bg-black border border-red-600 text-red-400 font-chakra text-xs font-bold uppercase rounded flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Square className="w-3.5 h-3.5" />
                      <span>END ROUND 0{round.number}</span>
                    </button>
                  )}

                  {isCurrent && (
                    <button
                      onClick={() => handleRoundAction(round.number as 1 | 2 | 3 | 4, 'START_BREAK')}
                      disabled={actionLoading}
                      className="w-full py-1.5 bg-black hover:bg-zinc-950 border border-zinc-800 hover:border-amber-500 text-amber-300 font-chakra text-[11px] font-bold uppercase rounded flex items-center justify-center gap-1 transition-all"
                    >
                      <Clock className="w-3 h-3" />
                      <span>TRIGGER 2-MIN BREAK</span>
                    </button>
                  )}

                  <button
                    id={`admin-enter-round-card-${round.number}`}
                    onClick={() => {
                      cyberAudio.click();
                      onLaunchRoundView?.(round.number);
                    }}
                    className="w-full py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-red-500 text-zinc-300 hover:text-white font-chakra text-[11px] font-bold uppercase rounded flex items-center justify-center gap-1.5 transition-all"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-red-500" />
                    <span>{isActive ? `PLAY / ENTER ROUND 0${round.number}` : `PREVIEW / TEST ROUND 0${round.number}`}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Announce Official Results Button */}
        <div className="mt-6 pt-5 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-orbitron font-bold text-white text-sm">
              FINAL CHAMPIONSHIP BROADCAST
            </div>
            <p className="text-zinc-400 text-xs font-chakra">
              Once Round 4 finishes, click to announce final rankings and unveil the Hall of Fame on all squad screens.
            </p>
          </div>

          <button
            onClick={handleAnnounce}
            disabled={actionLoading}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-chakra font-black text-xs tracking-wider uppercase rounded shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center gap-2 transition-all"
          >
            <Trophy className="w-4 h-4 text-black" />
            <span>ANNOUNCE FINAL RESULTS</span>
          </button>
        </div>
      </div>

      {/* Live Teams Status & Monitor Table */}
      <div className="bg-[#09090b] border border-red-950 rounded-lg p-5">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-red-500" />
            <h3 className="font-orbitron font-bold text-sm text-white uppercase">
              LIVE PARTICIPANT SQUADS ({teams.length})
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            AUTO-SYNCING TELEMETRY VIA SSE
          </span>
        </div>

        {teams.length === 0 ? (
          <div className="p-8 rounded bg-black/60 border border-dashed border-zinc-800 text-center text-zinc-500 font-mono text-xs">
            NO SQUADS CONNECTED YET. TEAMS CAN JOIN USING EVENT CODE: <strong className="text-red-400">{eventState.eventCode}</strong>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-chakra text-xs">
              <thead className="bg-black/90 text-zinc-400 font-mono uppercase border-b border-zinc-800">
                <tr>
                  <th className="py-2.5 px-3">TEAM NAME</th>
                  <th className="py-2.5 px-3">MEMBERS</th>
                  <th className="py-2.5 px-2 text-center">R1</th>
                  <th className="py-2.5 px-2 text-center">R2</th>
                  <th className="py-2.5 px-2 text-center">R3</th>
                  <th className="py-2.5 px-2 text-center">R4</th>
                  <th className="py-2.5 px-3 text-right">TOTAL</th>
                  <th className="py-2.5 px-3 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {teams.map((t) => (
                  <tr key={t.id} className="hover:bg-zinc-950/60">
                    <td className="py-2.5 px-3 font-orbitron font-bold text-white">
                      {t.name}
                    </td>
                    <td className="py-2.5 px-3 text-zinc-400">
                      {t.members.join(', ')}
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono text-zinc-300">
                      {t.roundScores[1]}
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono text-zinc-300">
                      {t.roundScores[2]}
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono text-zinc-300">
                      {t.roundScores[3]}
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono text-zinc-300">
                      {t.roundScores[4]}
                    </td>
                    <td className="py-2.5 px-3 text-right font-orbitron font-bold text-red-400">
                      {t.currentScore} / 100
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
