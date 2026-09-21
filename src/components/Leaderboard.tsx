import React from 'react';
import { Trophy, Medal, Award, Shield, CheckCircle, Clock, Sparkles, Download, RefreshCw, Users, Star } from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { cyberAudio } from '../utils/cyberAudio';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentTeamId?: string;
  onRefresh?: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  currentTeamId,
  onRefresh,
}) => {
  const sortedEntries = [...entries].sort((a, b) => b.totalScore - a.totalScore);
  const hasTeams = sortedEntries.length > 0;
  const hasScores = sortedEntries.some((e) => e.totalScore > 0);
  const champion = hasScores ? sortedEntries[0] : null;

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 font-orbitron font-black text-sm shadow-[0_0_15px_rgba(245,158,11,0.5)]">
            🥇
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-full bg-zinc-300/20 border border-zinc-300 flex items-center justify-center text-zinc-200 font-orbitron font-black text-sm shadow-[0_0_15px_rgba(212,212,216,0.4)]">
            🥈
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-full bg-amber-700/20 border border-amber-600 flex items-center justify-center text-amber-500 font-orbitron font-black text-sm shadow-[0_0_15px_rgba(180,83,9,0.4)]">
            🥉
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded bg-black border border-zinc-800 flex items-center justify-center text-zinc-500 font-mono font-bold text-xs">
            #{rank}
          </div>
        );
    }
  };

  const handleExportSummary = () => {
    cyberAudio.click();
    const rows = [
      ['Rank', 'Team Name', 'Members', 'Round 1 (25)', 'Round 2 (25)', 'Round 3 (25)', 'Round 4 (25)', 'Total Score (100)'],
      ...sortedEntries.map((e, idx) => [
        idx + 1,
        `"${e.teamName}"`,
        `"${e.members.join(', ')}"`,
        e.round1,
        e.round2,
        e.round3,
        e.round4,
        e.totalScore,
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((r) => r.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PhishHunt_Results_28-09-2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8 cyber-grid">
      
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        {/* Mandated Final Completion Telemetry */}
        <div className="p-3.5 rounded-lg bg-black/90 border border-red-900/80 max-w-md mx-auto font-mono text-xs text-left shadow-[0_0_20px_rgba(220,38,38,0.3)] space-y-1">
          <div className="text-emerald-400 font-bold flex items-center gap-2">
            <span>&gt; THREAT CONTAINED</span>
            <span className="w-1.5 h-3 bg-emerald-500 animate-terminal-blink inline-block" />
          </div>
          <div className="text-zinc-200 font-semibold">&gt; INVESTIGATION COMPLETE</div>
          <div className="text-red-400 font-bold">&gt; PHISHING CAMPAIGN STOPPED</div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800 text-red-400 font-mono text-xs uppercase">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>OFFICIAL COMPETITION LEADERBOARD // RESULTS</span>
        </div>
        <h2 className="font-orbitron font-black text-3xl sm:text-4xl text-white uppercase tracking-wider">
          CYBER DEFENSE <span className="text-red-500 text-glow-red">HALL OF FAME</span>
        </h2>
        <p className="text-zinc-400 font-chakra text-sm sm:text-base">
          Validated scores across all 4 operational cybersecurity challenge rounds.
        </p>
      </div>

      {/* Champion Podium Announcement */}
      {champion && (
        <div className="relative p-6 sm:p-8 rounded-xl bg-gradient-to-b from-amber-950/40 via-[#0a0a0c] to-black border-2 border-amber-500/80 shadow-[0_0_35px_rgba(245,158,11,0.3)] text-center overflow-hidden">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded bg-amber-500/20 border border-amber-400 text-amber-300 font-orbitron font-bold text-xs uppercase mb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>EVENT CHAMPION // 1ST PLACE</span>
          </div>

          <h3 className="font-orbitron font-black text-3xl sm:text-5xl text-white tracking-wide uppercase">
            {champion.teamName}
          </h3>

          <p className="font-chakra text-zinc-400 text-sm mt-2">
            Squad Roster: <strong className="text-zinc-200">{champion.members.join(' • ')}</strong>
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            <div className="p-3 rounded bg-black/80 border border-amber-500/50 min-w-[120px]">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">FINAL SCORE</span>
              <span className="font-orbitron font-black text-2xl sm:text-3xl text-amber-400">
                {champion.totalScore} <span className="text-zinc-600 text-sm">/ 100</span>
              </span>
            </div>

            <div className="p-3 rounded bg-black/80 border border-zinc-800 min-w-[100px]">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">R1 DETECT</span>
              <span className="font-orbitron font-bold text-lg text-white">
                {champion.round1} <span className="text-zinc-600 text-xs">/ 25</span>
              </span>
            </div>

            <div className="p-3 rounded bg-black/80 border border-zinc-800 min-w-[100px]">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">R2 SOCIAL</span>
              <span className="font-orbitron font-bold text-lg text-white">
                {champion.round2} <span className="text-zinc-600 text-xs">/ 25</span>
              </span>
            </div>

            <div className="p-3 rounded bg-black/80 border border-zinc-800 min-w-[100px]">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">R3 INVESTIGATE</span>
              <span className="font-orbitron font-bold text-lg text-white">
                {champion.round3} <span className="text-zinc-600 text-xs">/ 25</span>
              </span>
            </div>

            <div className="p-3 rounded bg-black/80 border border-zinc-800 min-w-[100px]">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">R4 ESCAPE</span>
              <span className="font-orbitron font-bold text-lg text-white">
                {champion.round4} <span className="text-zinc-600 text-xs">/ 25</span>
              </span>
            </div>
          </div>

          {/* Prompt-mandated Badges */}
          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-red-950/60 border border-red-700 text-red-300 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400" /> PHISH MASTER
            </span>
            <span className="px-2.5 py-1 rounded bg-red-950/60 border border-red-700 text-red-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-red-400" /> CYBER DETECTIVE
            </span>
            <span className="px-2.5 py-1 rounded bg-red-950/60 border border-red-700 text-red-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-400" /> SOCIAL DEFENDER
            </span>
            <span className="px-2.5 py-1 rounded bg-red-950/60 border border-red-700 text-red-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> FIRST RESPONDER
            </span>
          </div>
        </div>
      )}

      {/* Leaderboard Table Controls */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-mono text-zinc-400">
          RANKED SQUADS ({sortedEntries.length} REGISTERED)
        </div>

        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={() => {
                cyberAudio.click();
                onRefresh();
              }}
              className="p-2 rounded bg-black border border-zinc-800 hover:border-red-600 text-zinc-400 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>SYNC SCORES</span>
            </button>
          )}

          <button
            id="leaderboard-export-btn"
            onClick={handleExportSummary}
            className="px-3.5 py-2 rounded bg-red-950/80 hover:bg-red-900 border border-red-600 text-white text-xs font-chakra font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(220,38,38,0.3)]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT CSV</span>
          </button>
        </div>
      </div>

      {/* Leaderboard Table / Empty States */}
      <div className="bg-[#09090b] border border-red-950 rounded-lg overflow-hidden shadow-[0_0_25px_rgba(0,0,0,0.8)]">
        {!hasTeams ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-10 h-10 text-zinc-600 mx-auto" />
            <h4 className="font-orbitron font-bold text-lg text-zinc-300 uppercase">
              No teams have joined yet.
            </h4>
            <p className="text-zinc-500 font-chakra text-xs max-w-md mx-auto">
              Squads must register via the participant portal using the event code to appear on the official competition scoreboard.
            </p>
          </div>
        ) : !hasScores ? (
          <div className="p-12 text-center space-y-3">
            <Clock className="w-10 h-10 text-amber-500/60 mx-auto" />
            <h4 className="font-orbitron font-bold text-lg text-zinc-300 uppercase">
              No scores available yet.
            </h4>
            <p className="text-zinc-500 font-chakra text-xs max-w-md mx-auto">
              {sortedEntries.length} squad{sortedEntries.length > 1 ? 's are' : ' is'} registered in the waiting room. Verified points will appear dynamically as rounds are completed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-chakra text-sm">
              <thead className="bg-black/90 text-zinc-400 font-mono text-xs uppercase border-b border-zinc-800">
                <tr>
                  <th className="py-3.5 px-4">RANK</th>
                  <th className="py-3.5 px-4">SQUAD</th>
                  <th className="py-3.5 px-3 text-center">R1 (25)</th>
                  <th className="py-3.5 px-3 text-center">R2 (25)</th>
                  <th className="py-3.5 px-3 text-center">R3 (25)</th>
                  <th className="py-3.5 px-3 text-center">R4 (25)</th>
                  <th className="py-3.5 px-4 text-right">TOTAL (100)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {sortedEntries.map((entry, index) => {
                  const rank = index + 1;
                  const isCurrentTeam = entry.teamId === currentTeamId;

                  return (
                    <tr
                      key={entry.teamId}
                      className={`transition-colors ${
                        isCurrentTeam
                          ? 'bg-red-950/40 border-l-2 border-l-red-500'
                          : 'hover:bg-zinc-950/60'
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        {getRankBadge(rank)}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-orbitron font-bold text-white flex items-center gap-2">
                          <span>{entry.teamName}</span>
                          {isCurrentTeam && (
                            <span className="px-1.5 py-0.5 rounded bg-red-900/60 text-red-200 text-[10px] font-mono">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-zinc-500 font-chakra">
                          {entry.members.join(', ')}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono text-zinc-300">
                        {entry.round1}
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono text-zinc-300">
                        {entry.round2}
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono text-zinc-300">
                        {entry.round3}
                      </td>

                      <td className="py-3.5 px-3 text-center font-mono text-zinc-300">
                        {entry.round4}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span className="font-orbitron font-black text-base text-red-400">
                          {entry.totalScore}
                        </span>
                        <span className="text-zinc-600 text-xs font-mono ml-1">/ 100</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Credits */}
      <div className="pt-6 border-t border-zinc-900 text-center text-xs font-mono text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>CYBER AWARENESS PHISH HUNT // 28-09-2026 // OFFLINE COLLEGE EVENT</span>
        <span className="text-red-400 font-semibold">BUILT BY SAHITHI</span>
      </div>

    </div>
  );
};
