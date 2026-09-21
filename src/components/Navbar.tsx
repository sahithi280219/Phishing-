import React from 'react';
import { Shield, Volume2, VolumeX, Terminal, Lock, Users } from 'lucide-react';
import { cyberAudio } from '../utils/cyberAudio';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  teamName?: string;
  isAdminLoggedIn: boolean;
  onOpenHowItWorks: () => void;
  onOpenRules: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  teamName,
  isAdminLoggedIn,
  onOpenHowItWorks,
  onOpenRules,
}) => {
  const [muted, setMuted] = React.useState(!cyberAudio.enabled);

  const toggleMute = () => {
    cyberAudio.enabled = !cyberAudio.enabled;
    setMuted(!cyberAudio.enabled);
    if (cyberAudio.enabled) cyberAudio.click();
  };

  const navItem = (view: ViewState, label: string, icon?: React.ReactNode) => {
    const isActive = currentView === view;
    return (
      <button
        id={`nav-btn-${view.toLowerCase()}`}
        onClick={() => {
          cyberAudio.click();
          onNavigate(view);
        }}
        className={`px-3 py-1.5 text-xs sm:text-sm font-chakra tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 rounded border ${
          isActive
            ? 'bg-red-950/70 text-red-300 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.35)]'
            : 'text-zinc-400 border-transparent hover:text-red-400 hover:border-red-900/50 hover:bg-zinc-900/60'
        }`}
      >
        {icon}
        {label}
      </button>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#070709]/95 backdrop-blur-md border-b border-red-950/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div
          id="nav-brand-logo"
          onClick={() => {
            cyberAudio.click();
            onNavigate('LANDING');
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-9 h-9 rounded bg-black border border-red-600 flex items-center justify-center shadow-[0_0_12px_rgba(220,38,38,0.4)] group-hover:shadow-[0_0_20px_rgba(220,38,38,0.7)] transition-all">
            <Shield className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-orbitron font-black tracking-widest text-lg sm:text-xl text-white group-hover:text-red-400 transition-colors">
                PHISH <span className="text-red-600">HUNT</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-900/60">
                2026
              </span>
            </div>
            <p className="text-[10px] font-mono text-zinc-500 tracking-wider hidden sm:block">
              “SPOT THE TRAP. STAY SAFE.”
            </p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <div className="hidden md:flex items-center gap-1.5">
          {navItem('LANDING', 'Home')}
          <button
            id="nav-btn-how-it-works"
            onClick={() => {
              cyberAudio.click();
              onOpenHowItWorks();
            }}
            className="px-3 py-1.5 text-xs sm:text-sm font-chakra tracking-wider uppercase text-zinc-400 hover:text-red-400 hover:bg-zinc-900/60 rounded border border-transparent transition-all"
          >
            How It Works
          </button>
          <button
            id="nav-btn-rules"
            onClick={() => {
              cyberAudio.click();
              onOpenRules();
            }}
            className="px-3 py-1.5 text-xs sm:text-sm font-chakra tracking-wider uppercase text-zinc-400 hover:text-red-400 hover:bg-zinc-900/60 rounded border border-transparent transition-all"
          >
            Rules
          </button>
          {navItem('LEADERBOARD', 'Leaderboard')}
        </div>

        {/* Right Action Items */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Synthesizer Mute Toggle */}
          <button
            id="nav-audio-toggle"
            onClick={toggleMute}
            title={muted ? 'Unmute cyber audio' : 'Mute cyber audio'}
            className="p-2 rounded bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-900 transition-all"
          >
            {muted ? <VolumeX className="w-4 h-4 text-zinc-500" /> : <Volume2 className="w-4 h-4 text-red-500 animate-pulse" />}
          </button>

          {/* Active Team Badge (If joined) */}
          {teamName ? (
            <button
              id="nav-active-team-btn"
              onClick={() => {
                cyberAudio.click();
                onNavigate('WAITING_ROOM');
              }}
              className="px-3 py-1.5 rounded bg-red-950/80 border border-red-600 text-white font-mono text-xs flex items-center gap-2 shadow-[0_0_12px_rgba(220,38,38,0.3)] hover:bg-red-900/80 transition-all"
            >
              <Users className="w-3.5 h-3.5 text-red-400" />
              <span className="font-semibold text-red-200">{teamName}</span>
            </button>
          ) : (
            <button
              id="nav-join-hunt-btn"
              onClick={() => {
                cyberAudio.click();
                onNavigate('TEAM_JOIN');
              }}
              className="px-3.5 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-chakra text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-[0_0_12px_rgba(220,38,38,0.5)]"
            >
              Join Hunt
            </button>
          )}

          {/* Admin Access Button (Hidden from active participant players to guarantee strict role separation) */}
          {(!teamName || isAdminLoggedIn) && (
            <button
              id="nav-admin-login-btn"
              onClick={() => {
                cyberAudio.click();
                onNavigate(isAdminLoggedIn ? 'ADMIN_DASHBOARD' : 'ADMIN_LOGIN');
              }}
              title="Event Controller Command Center"
              className={`px-2.5 py-1.5 text-xs font-mono rounded flex items-center gap-1.5 border transition-all ${
                isAdminLoggedIn
                  ? 'bg-red-900/40 text-red-300 border-red-600 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                  : 'bg-black/60 text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-700'
              }`}
            >
              {isAdminLoggedIn ? <Terminal className="w-3.5 h-3.5 text-red-400" /> : <Lock className="w-3 h-3 text-zinc-500" />}
              <span className="hidden sm:inline">{isAdminLoggedIn ? 'ADMIN CMD' : 'ADMIN'}</span>
            </button>
          )}
        </div>

      </div>

      {/* Mobile Navigation Sub-Bar */}
      <div className="md:hidden flex items-center justify-around py-2 px-3 bg-black/95 border-t border-red-950/60 text-xs">
        <button
          id="nav-mobile-btn-home"
          onClick={() => {
            cyberAudio.click();
            onNavigate('LANDING');
          }}
          className={`px-2.5 py-1 font-chakra uppercase tracking-wider rounded transition-colors ${
            currentView === 'LANDING' ? 'text-red-400 bg-red-950/80 font-bold border border-red-800/60' : 'text-zinc-400'
          }`}
        >
          Home
        </button>
        <button
          id="nav-mobile-btn-how-it-works"
          onClick={() => {
            cyberAudio.click();
            onOpenHowItWorks();
          }}
          className="px-2.5 py-1 font-chakra uppercase tracking-wider text-zinc-400 hover:text-red-400 transition-colors"
        >
          How It Works
        </button>
        <button
          id="nav-mobile-btn-rules"
          onClick={() => {
            cyberAudio.click();
            onOpenRules();
          }}
          className="px-2.5 py-1 font-chakra uppercase tracking-wider text-zinc-400 hover:text-red-400 transition-colors"
        >
          Rules
        </button>
        <button
          id="nav-mobile-btn-leaderboard"
          onClick={() => {
            cyberAudio.click();
            onNavigate('LEADERBOARD');
          }}
          className={`px-2.5 py-1 font-chakra uppercase tracking-wider rounded transition-colors ${
            currentView === 'LEADERBOARD' ? 'text-red-400 bg-red-950/80 font-bold border border-red-800/60' : 'text-zinc-400'
          }`}
        >
          Leaderboard
        </button>
      </div>
    </nav>
  );
};
