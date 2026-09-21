import React, { useState } from 'react';
import { Terminal, Lock, KeyRound, AlertOctagon, CheckCircle2, ShieldAlert, ArrowLeft } from 'lucide-react';
import { adminLogin, setAdminToken } from '../utils/api';
import { cyberAudio } from '../utils/cyberAudio';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToHome }) => {
  const [username, setUsername] = useState('Admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setLoading(true);
    setStatusMessage(null);
    cyberAudio.click();

    try {
      const res = await adminLogin(username.trim(), password);
      if (res.success && res.token) {
        setAdminToken(res.token);
        setStatusMessage({ type: 'success', text: 'ACCESS GRANTED' });
        cyberAudio.accessGranted();
        setTimeout(() => {
          onLoginSuccess();
        }, 900);
      } else {
        setStatusMessage({ type: 'error', text: 'ACCESS DENIED' });
        cyberAudio.warning();
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'ACCESS DENIED // SERVER UNREACHABLE' });
      cyberAudio.warning();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 cyber-grid">
      
      <div className="w-full max-w-md bg-[#08080a] border border-red-800 rounded-lg p-6 sm:p-8 shadow-[0_0_30px_rgba(220,38,38,0.35)] relative corner-bracket-tl corner-bracket-br">
        
        {/* Back Button */}
        <button
          id="admin-login-back-btn"
          onClick={() => {
            cyberAudio.click();
            onBackToHome();
          }}
          className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-red-400 text-xs font-mono mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO MAIN PORTAL</span>
        </button>

        {/* Header */}
        <div className="text-left mb-6 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-red-950/80 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-black border border-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                <Terminal className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <h2 className="font-orbitron font-black text-lg sm:text-xl text-white tracking-widest uppercase">
                  SECURE ADMIN TERMINAL
                </h2>
                <div className="text-[10px] text-zinc-500">SUBSYSTEM: ROOT_AUTH_v2.6</div>
              </div>
            </div>
            <div className="px-2 py-0.5 rounded bg-red-950/60 border border-red-800 text-[10px] text-red-400 font-bold">
              PORT: 0x88FE
            </div>
          </div>

          {/* Mandated Terminal Prompts */}
          <div className="p-3 rounded bg-black/90 border border-red-900/60 space-y-1 text-xs">
            <div className="text-red-400 font-bold flex items-center gap-1.5">
              <span>&gt; AUTHENTICATION REQUIRED</span>
              <span className="w-1.5 h-3 bg-red-500 animate-terminal-blink inline-block" />
            </div>
            <div className="text-zinc-400 font-mono text-[11px]">
              &gt; PRIVILEGED ACCESS ONLY
            </div>
          </div>
        </div>

        {/* Security Notification Banner */}
        <div className="p-3 rounded bg-red-950/30 border border-red-900/60 mb-6 flex items-start gap-2.5 text-xs font-mono text-zinc-300">
          <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div>
            <span className="text-red-400 font-bold block mb-0.5">HIGH-SECURITY CLEARANCE</span>
            <span>All administrative actions are cryptographically signed and synchronized to the live event state.</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono">
          
          <div>
            <label className="block text-zinc-400 font-mono text-xs uppercase mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-red-500" />
                <span>ACCESS ID</span>
              </span>
              <span className="text-[10px] text-zinc-600">IDENTIFIER</span>
            </label>
            <input
              id="admin-login-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Admin Access ID"
              required
              className="w-full bg-black border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white font-mono text-sm px-3.5 py-2.5 rounded transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-mono text-xs uppercase mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-red-500" />
                <span>PASSPHRASE</span>
              </span>
              <span className="text-[10px] text-zinc-600">ENCRYPTED</span>
            </label>
            <input
              id="admin-login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full bg-black border border-zinc-800 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white font-mono text-sm px-3.5 py-2.5 rounded transition-all outline-none"
            />
          </div>

          {/* Feedback Status */}
          {statusMessage && (
            <div
              id="admin-login-status"
              className={`p-3.5 rounded font-mono text-xs uppercase tracking-wider transition-all ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/60 border border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-red-950/80 border border-red-600 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>&gt; ACCESS GRANTED</span>
                  </div>
                  <div className="text-[11px] text-emerald-400/80 pl-6">
                    &gt; COMMAND CENTER INITIALIZED
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 font-bold text-red-400">
                  <AlertOctagon className="w-4 h-4 text-red-500" />
                  <span>&gt; {statusMessage.text}</span>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            id="admin-login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-500 active:scale-[0.99] text-white font-chakra font-bold text-sm tracking-widest uppercase rounded border border-red-400 shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <span className="font-mono text-xs animate-pulse">VALIDATING CREDENTIALS...</span>
            ) : (
              <>
                <Terminal className="w-4 h-4" />
                <span>ACCESS COMMAND CENTER</span>
              </>
            )}
          </button>

        </form>

        <div className="mt-8 pt-4 border-t border-zinc-900 text-center text-[10px] font-mono text-zinc-500">
          EVENT: CYBER AWARENESS PHISH HUNT // 28-09-2026 // BY SAHITHI
        </div>

      </div>

    </div>
  );
};
