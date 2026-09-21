import React from 'react';
import { Mail, MessageSquare, Search, ShieldCheck, Clock, Award, Flame, Play } from 'lucide-react';
import { ROUNDS_INFO } from '../data/gameData';

interface RoundsOverviewSectionProps {
  onJoinClick: () => void;
  onStartRound?: (roundNum: number) => void;
}

export const RoundsOverviewSection: React.FC<RoundsOverviewSectionProps> = ({ onJoinClick, onStartRound }) => {
  const getIcon = (rNum: number) => {
    switch (rNum) {
      case 1:
        return <Mail className="w-6 h-6 text-red-400" />;
      case 2:
        return <MessageSquare className="w-6 h-6 text-red-400" />;
      case 3:
        return <Search className="w-6 h-6 text-red-400" />;
      case 4:
        return <Flame className="w-6 h-6 text-red-500 animate-pulse" />;
      default:
        return <ShieldCheck className="w-6 h-6 text-red-400" />;
    }
  };

  return (
    <section id="rounds-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-950/50 border border-red-800 text-red-400 text-xs font-mono uppercase mb-3">
          <span>EVENT ARCHITECTURE</span>
          <span>//</span>
          <span>4 STAGES TO GLORY</span>
        </div>
        <h2 className="font-orbitron font-bold text-3xl sm:text-4xl text-white tracking-wide uppercase">
          THE 4 <span className="text-red-500 text-glow-red">CHALLENGE ROUNDS</span>
        </h2>
        <p className="mt-3 text-zinc-400 font-chakra text-base">
          Teams advance synchronously under the Event Controller’s command. Every stage presents unique realistic threats with strict forensic standards.
        </p>
      </div>

      {/* 4 Rounds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {ROUNDS_INFO.map((round) => (
          <div
            key={round.number}
            className="group relative bg-[#09090b] rounded-lg border border-red-950/80 hover:border-red-600 transition-all duration-300 p-5 flex flex-col justify-between hover:shadow-[0_0_20px_rgba(220,38,38,0.25)] hover:-translate-y-1"
          >
            {/* Top Round Badge */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded bg-black border border-red-900/60 group-hover:border-red-500 transition-colors">
                  {getIcon(round.number)}
                </div>
                <div className="text-right">
                  <span className="font-orbitron font-black text-xl text-zinc-600 group-hover:text-red-500 transition-colors">
                    0{round.number}
                  </span>
                  <div className="text-[10px] font-mono text-zinc-400 tracking-wider">
                    ROUND
                  </div>
                </div>
              </div>

              {/* Title & Subtitle */}
              <h3 className="font-orbitron font-bold text-lg text-white group-hover:text-red-400 transition-colors">
                {round.title}
              </h3>
              <div className="text-xs font-mono text-red-500/90 font-medium mb-3">
                {round.subtitle}
              </div>

              <p className="text-zinc-400 font-chakra text-sm leading-relaxed mb-6">
                {round.description}
              </p>
            </div>

            {/* Metrics Footer */}
            <div className="pt-4 border-t border-zinc-800/80 grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-1.5 rounded bg-black/60 border border-zinc-900">
                <div className="text-zinc-500 text-[10px]">DIFF</div>
                <div className="text-red-400 text-xs">{round.difficulty}</div>
              </div>
              <div className="p-1.5 rounded bg-black/60 border border-zinc-900">
                <div className="text-zinc-500 text-[10px]">TIME</div>
                <div className="text-white text-xs flex items-center justify-center gap-0.5">
                  <Clock className="w-2.5 h-2.5 text-zinc-400" />
                  {Math.floor(round.durationSec / 60)}m
                </div>
              </div>
              <div className="p-1.5 rounded bg-black/60 border border-zinc-900">
                <div className="text-zinc-500 text-[10px]">POINTS</div>
                <div className="text-red-400 text-xs font-bold">{round.points} PTS</div>
              </div>
            </div>

            {/* Direct Launch / Enter Button */}
            <button
              id={`rounds-overview-start-btn-${round.number}`}
              onClick={() => onStartRound ? onStartRound(round.number) : onJoinClick()}
              className="mt-3.5 w-full py-2 bg-red-950/70 hover:bg-red-600 text-red-300 hover:text-white font-chakra text-xs font-bold uppercase rounded border border-red-800/70 hover:border-red-400 flex items-center justify-center gap-1.5 transition-all shadow-[0_0_10px_rgba(220,38,38,0.25)] active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>START ROUND 0{round.number}</span>
            </button>

          </div>
        ))}
      </div>

      {/* Total Score Banner */}
      <div className="mt-10 p-6 rounded-lg bg-gradient-to-r from-red-950/40 via-black to-red-950/40 border border-red-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-red-600/20 border border-red-500 flex items-center justify-center text-red-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-orbitron font-bold text-white text-lg">
              500 MAXIMUM POINTS // 1 EVENT CHAMPION
            </h4>
            <p className="text-zinc-400 font-chakra text-sm">
              Strict 2-minute synchronized break between rounds. No skipping. All teams play simultaneously.
            </p>
          </div>
        </div>

        <button
          id="rounds-cta-join-btn"
          onClick={onJoinClick}
          className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-chakra font-bold text-sm tracking-wider uppercase rounded transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)] whitespace-nowrap"
        >
          REGISTER YOUR SQUAD
        </button>
      </div>

    </section>
  );
};
