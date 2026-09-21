import React, { useState } from 'react';
import { Users, Key, UserCheck, Shield, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { joinTeam, saveTeamSession } from '../utils/api';
import { cyberAudio } from '../utils/cyberAudio';
import { Team, EventState } from '../types';

interface TeamJoinProps {
  onJoinSuccess: (team: Team, event: EventState) => void;
  onBackToHome: () => void;
  defaultEventCode?: string;
}

export const TeamJoin: React.FC<TeamJoinProps> = ({
  onJoinSuccess,
  onBackToHome,
  defaultEventCode = 'PHISH26',
}) => {
  const [eventCode, setEventCode] = useState(defaultEventCode);
  const [teamName, setTeamName] = useState('');
  const [member1, setMember1] = useState('');
  const [member2, setMember2] = useState('');
  const [member3, setMember3] = useState('');
  const [member4, setMember4] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventCode.trim() || !teamName.trim()) {
      setError('Event Code and Team Name are required.');
      return;
    }

    const membersList = [member1, member2, member3, member4]
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    if (membersList.length === 0) {
      setError('At least one team member name must be provided.');
      return;
    }

    setLoading(true);
    setError(null);
    cyberAudio.click();

    try {
      const res = await joinTeam(eventCode.trim().toUpperCase(), teamName.trim(), membersList);
      if (res.success && res.team) {
        saveTeamSession(res.team);
        cyberAudio.accessGranted();
        onJoinSuccess(res.team, res.event);
      } else {
        setError('Failed to join event.');
        cyberAudio.warning();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid Event Code or registration error';
      setError(msg);
      cyberAudio.warning();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 cyber-grid">
      
      <div className="w-full max-w-lg bg-[#08080a] border border-red-800 rounded-lg p-6 sm:p-8 shadow-[0_0_35px_rgba(220,38,38,0.35)] relative corner-bracket-tl corner-bracket-br">
        
        {/* Back Button */}
        <button
          id="team-join-back-btn"
          onClick={() => {
            cyberAudio.click();
            onBackToHome();
          }}
          className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-red-400 text-xs font-mono mb-5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO HOME</span>
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded bg-black border border-red-600 mx-auto flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            <Users className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="font-orbitron font-bold text-2xl text-white tracking-wider uppercase">
            PHISH HUNT // <span className="text-red-500">JOIN EVENT</span>
          </h2>
          <p className="font-mono text-zinc-400 text-xs mt-1">
            ENTER YOUR SQUAD CREDENTIALS TO CONNECT TO THE LIVE CONTROLLER
          </p>
        </div>

        {error && (
          <div className="p-3 mb-5 rounded bg-red-950/70 border border-red-600 text-red-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleJoin} className="space-y-4">
          
          {/* Event Code */}
          <div>
            <label className="block text-zinc-400 font-mono text-xs uppercase mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-red-500" />
              <span>EVENT CODE</span>
            </label>
            <input
              id="team-join-event-code"
              type="text"
              value={eventCode}
              onChange={(e) => setEventCode(e.target.value.toUpperCase())}
              placeholder="PHISH26"
              required
              className="w-full bg-black border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-red-400 font-mono font-bold tracking-widest text-base px-3.5 py-2.5 rounded transition-all outline-none uppercase"
            />
            <span className="text-[11px] font-mono text-zinc-500 mt-1 block">
              Default offline event code: <strong className="text-red-400">PHISH26</strong>
            </span>
          </div>

          {/* Team Name */}
          <div>
            <label className="block text-zinc-400 font-mono text-xs uppercase mb-1.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-red-500" />
              <span>TEAM NAME</span>
            </label>
            <input
              id="team-join-team-name"
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Cyber Warriors"
              required
              className="w-full bg-black border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white font-chakra text-sm px-3.5 py-2.5 rounded transition-all outline-none"
            />
          </div>

          {/* Team Members List */}
          <div className="pt-2">
            <label className="block text-zinc-400 font-mono text-xs uppercase mb-2 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-red-500" />
              <span>TEAM MEMBERS (UP TO 4 MEMBERS)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <input
                  id="team-member-1"
                  type="text"
                  value={member1}
                  onChange={(e) => setMember1(e.target.value)}
                  placeholder="Member 1 (Lead)"
                  required
                  className="w-full bg-black border border-zinc-800 focus:border-red-500 text-white font-chakra text-xs px-3 py-2 rounded outline-none"
                />
              </div>

              <div>
                <input
                  id="team-member-2"
                  type="text"
                  value={member2}
                  onChange={(e) => setMember2(e.target.value)}
                  placeholder="Member 2"
                  className="w-full bg-black border border-zinc-800 focus:border-red-500 text-white font-chakra text-xs px-3 py-2 rounded outline-none"
                />
              </div>

              <div>
                <input
                  id="team-member-3"
                  type="text"
                  value={member3}
                  onChange={(e) => setMember3(e.target.value)}
                  placeholder="Member 3"
                  className="w-full bg-black border border-zinc-800 focus:border-red-500 text-white font-chakra text-xs px-3 py-2 rounded outline-none"
                />
              </div>

              <div>
                <input
                  id="team-member-4"
                  type="text"
                  value={member4}
                  onChange={(e) => setMember4(e.target.value)}
                  placeholder="Member 4"
                  className="w-full bg-black border border-zinc-800 focus:border-red-500 text-white font-chakra text-xs px-3 py-2 rounded outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            id="team-join-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-chakra font-bold text-sm tracking-widest uppercase rounded border border-red-400 shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all flex items-center justify-center gap-2 mt-6 active:scale-[0.99]"
          >
            {loading ? (
              <span className="font-mono text-xs animate-pulse">CONNECTING TO LOBBY...</span>
            ) : (
              <>
                <span>JOIN EVENT</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        <div className="mt-6 pt-4 border-t border-zinc-900 text-center text-[10px] font-mono text-zinc-500">
          EVENT: CYBER AWARENESS PHISH HUNT // 28-09-2026 // BY SAHITHI
        </div>

      </div>

    </div>
  );
};
