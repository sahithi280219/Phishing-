import React from 'react';
import { X, ShieldAlert, Cpu, CheckCircle2, Lock, Users, AlertTriangle, Terminal } from 'lucide-react';
import { cyberAudio } from '../utils/cyberAudio';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#09090b] border border-red-800 rounded-lg shadow-[0_0_30px_rgba(220,38,38,0.35)] overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-red-950/80 bg-black/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-red-500" />
            <h3 className="font-orbitron font-bold text-lg text-white tracking-wider">
              OPERATIONAL WORKFLOW // HOW IT WORKS
            </h3>
          </div>
          <button
            onClick={() => {
              cyberAudio.click();
              onClose();
            }}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-zinc-300 font-chakra text-sm">
          
          <div className="p-3.5 rounded bg-red-950/20 border border-red-900/50 flex items-start gap-3">
            <Terminal className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-mono text-xs text-red-300 font-bold uppercase mb-1">
                MASTER CONTROLLER ARCHITECTURE
              </div>
              <p className="text-zinc-400 leading-relaxed text-xs">
                This competition operates on an authoritative server controller. Participants cannot start, skip, or unlock rounds. All teams are in lockstep.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 rounded bg-black/40 border border-zinc-800">
              <div className="font-orbitron font-bold text-red-400 text-xs mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-red-950 border border-red-700 flex items-center justify-center text-[11px]">1</span>
                TEAM ENTRY & WAITING ROOM
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Teams enter the Event Code (e.g. <span className="text-red-300 font-mono font-bold">PHISH26</span>), squad name, and member rosters. Squads wait in the live waiting lobby until the Event Admin launches the hunt.
              </p>
            </div>

            <div className="p-4 rounded bg-black/40 border border-zinc-800">
              <div className="font-orbitron font-bold text-red-400 text-xs mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-red-950 border border-red-700 flex items-center justify-center text-[11px]">2</span>
                SERVER SYNCHRONIZATION
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                When Admin clicks Start Round 1, all connected screens enter Round 1 simultaneously with a unified server-authoritative countdown timer.
              </p>
            </div>

            <div className="p-4 rounded bg-black/40 border border-zinc-800">
              <div className="font-orbitron font-bold text-red-400 text-xs mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-red-950 border border-red-700 flex items-center justify-center text-[11px]">3</span>
                GLOBAL 2-MINUTE BREAK
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Between each round, a synchronized 2-minute cooldown timer displays for all teams while scores calculate. Next round stays locked until Admin activates it.
              </p>
            </div>

            <div className="p-4 rounded bg-black/40 border border-zinc-800">
              <div className="font-orbitron font-bold text-red-400 text-xs mb-2 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-red-950 border border-red-700 flex items-center justify-center text-[11px]">4</span>
                FINAL CHAMPIONSHIP
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                After the 4th Round (Escape the Phish), comprehensive forensic analytics and official ranking leaderboard are unveiled by the event organizer.
              </p>
            </div>

          </div>

          <div className="border-t border-zinc-800 pt-4 flex items-center justify-between text-xs font-mono text-zinc-500">
            <span>OFFLINE COLLEGE EVENT // 28-09-2026</span>
            <span className="text-red-400">BUILT BY SAHITHI</span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-red-950/80 bg-black/60 flex justify-end">
          <button
            onClick={() => {
              cyberAudio.click();
              onClose();
            }}
            className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-chakra text-xs uppercase font-bold rounded transition-all"
          >
            ACKNOWLEDGE & PROCEED
          </button>
        </div>

      </div>
    </div>
  );
};

export const RulesModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#09090b] border border-red-800 rounded-lg shadow-[0_0_30px_rgba(220,38,38,0.35)] overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-red-950/80 bg-black/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <h3 className="font-orbitron font-bold text-lg text-white tracking-wider">
              COMPETITION PROTOCOLS // RULES OF ENGAGEMENT
            </h3>
          </div>
          <button
            onClick={() => {
              cyberAudio.click();
              onClose();
            }}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-zinc-300 font-chakra text-sm">
          
          <div className="space-y-3">
            <div className="p-3 rounded bg-black/60 border border-zinc-800/80 flex items-start gap-3">
              <Lock className="w-4 h-4 text-red-400 shrink-0 mt-1" />
              <div>
                <span className="font-orbitron font-semibold text-white text-xs block mb-1">
                  1. NO INDEPENDENT PROGRESSION
                </span>
                <p className="text-zinc-400 text-xs">
                  Participants must play only the active round. Teams cannot skip, unlock future rounds, or reset their progress. All timers run synchronously from the central server.
                </p>
              </div>
            </div>

            <div className="p-3 rounded bg-black/60 border border-zinc-800/80 flex items-start gap-3">
              <Users className="w-4 h-4 text-red-400 shrink-0 mt-1" />
              <div>
                <span className="font-orbitron font-semibold text-white text-xs block mb-1">
                  2. SQUAD COOPERATION
                </span>
                <p className="text-zinc-400 text-xs">
                  Teams are composed of 1 to 4 participants. Discuss suspicious indicators together before committing submissions. Only one submission is finalized per round.
                </p>
              </div>
            </div>

            <div className="p-3 rounded bg-black/60 border border-zinc-800/80 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-1" />
              <div>
                <span className="font-orbitron font-semibold text-white text-xs block mb-1">
                  3. SCORING PRECISION (500 TOTAL PTS // 25 SCENARIOS)
                </span>
                <p className="text-zinc-400 text-xs">
                  Across 4 rounds and 25 real scenarios: R1 (+10 / -5 pts), R2 (+20 / -10 pts), R3 (+20 / +30 pts), and R4 (+30 / -13 pts). Concise keyword forensics determine precision scoring.
                </p>
              </div>
            </div>

            <div className="p-3 rounded bg-red-950/25 border border-red-900/60 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-1" />
              <div>
                <span className="font-orbitron font-semibold text-red-300 text-xs block mb-1">
                  4. EDUCATIONAL SAFETY ASSURANCE
                </span>
                <p className="text-zinc-400 text-xs">
                  All domains, emails, and credentials presented are 100% fictional simulations for cybersecurity awareness. Real passwords, OTPs, or government IDs must never be input.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-4 flex items-center justify-between text-xs font-mono text-zinc-500">
            <span>OFFLINE COLLEGE EVENT // 28-09-2026</span>
            <span className="text-red-400">BUILT BY SAHITHI</span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-red-950/80 bg-black/60 flex justify-end">
          <button
            onClick={() => {
              cyberAudio.click();
              onClose();
            }}
            className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-chakra text-xs uppercase font-bold rounded transition-all"
          >
            I UNDERSTAND THE RULES
          </button>
        </div>

      </div>
    </div>
  );
};
