import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { RoundsOverviewSection } from './components/RoundsOverviewSection';
import { HowItWorksModal, RulesModal } from './components/InfoModals';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { TeamJoin } from './components/TeamJoin';
import { WaitingRoom } from './components/WaitingRoom';
import { RoundNavigation } from './components/RoundNavigation';
import { PreparationBreak } from './components/PreparationBreak';
import { Round1Detector } from './components/rounds/Round1Detector';
import { Round2SocialEng } from './components/rounds/Round2SocialEng';
import { Round3Investigation } from './components/rounds/Round3Investigation';
import { Round4EscapePhish } from './components/rounds/Round4EscapePhish';
import { Leaderboard } from './components/Leaderboard';
import { CyberCursor } from './components/CyberCursor';
import { CinematicHackerOverlay, CinematicTransitionConfig } from './components/CinematicHackerOverlay';

import {
  getEventState,
  getTeams,
  getLeaderboard,
  subscribeToEventStream,
  getSavedTeamSession,
  saveTeamSession,
  clearTeamSession,
  getAdminToken,
  submitRoundScore,
  quickStartRound,
} from './utils/api';
import { cyberAudio } from './utils/cyberAudio';
import { EventState, Team, LeaderboardEntry, ViewState } from './types';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<ViewState>('LANDING');
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);

  // Core Data
  const [eventState, setEventState] = useState<EventState | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [teamsList, setTeamsList] = useState<Team[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Active squad fallback ensures rounds always render cleanly for inspector, demo, or solo users
  const activeSquad: Team = useMemo(() => {
    if (team) return team;
    return {
      id: 'squad_cyber_inspect',
      name: 'CYBER INVESTIGATOR',
      members: ['Operator 1', 'Operator 2'],
      eventCode: eventState?.eventCode || 'PHISH26',
      connectionStatus: 'CONNECTED',
      lastHeartbeat: Date.now(),
      currentScore: 0,
      roundScores: { 1: 0, 2: 0, 3: 0, 4: 0 },
      roundProgress: {
        1: { completed: false, score: 0, foundClueIds: [], timeSpentSec: 0 },
        2: { completed: false, score: 0, decisions: {}, identifiedTactics: [], timeSpentSec: 0 },
        3: { completed: false, score: 0, boardClueIds: [], finalAnswer: null, timeSpentSec: 0 },
        4: { completed: false, score: 0, foundClueIds: [], finalAnswer: null, timeSpentSec: 0 },
      },
      joinedAt: Date.now(),
    };
  }, [team, eventState?.eventCode]);

  // Hacker Cinematic Overlay System
  const [cinematicActive, setCinematicActive] = useState(false);
  const [cinematicConfig, setCinematicConfig] = useState<CinematicTransitionConfig | undefined>(undefined);
  const prevRoundStatusRef = useRef<string | null>(null);

  const triggerHackerCinematic = useCallback((config?: CinematicTransitionConfig) => {
    setCinematicConfig(config);
    setCinematicActive(true);
  }, []);

  // Fetch initial data
  const refreshAllData = useCallback(async () => {
    try {
      const [ev, tList, lb] = await Promise.all([
        getEventState(),
        getTeams(),
        getLeaderboard(),
      ]);
      setEventState(ev);
      setTeamsList(tList);
      setLeaderboard(lb);

      // If participant is logged in, refresh team info
      if (team) {
        const found = tList.find((t) => t.id === team.id);
        if (found) setTeam(found);
      }
    } catch (err) {
      console.error('Error fetching event state:', err);
    }
  }, [team]);

  // Initial mount: load sessions & subscribe to SSE
  useEffect(() => {
    // Check local team session
    const savedTeam = getSavedTeamSession();
    if (savedTeam) {
      setTeam(savedTeam);
    }

    // Check admin token
    if (getAdminToken()) {
      setIsAdminLoggedIn(true);
    }

    // Initial fetch
    refreshAllData();

    // Subscribe to SSE stream for real-time synchronization across all tabs & devices
    const unsubscribe = subscribeToEventStream(
      (updatedEventState) => {
        setEventState(updatedEventState);
        // Also fetch fresh teams & leaderboard
        getTeams().then(setTeamsList).catch(() => {});
        getLeaderboard().then(setLeaderboard).catch(() => {});
      },
      (error) => {
        console.warn('SSE stream notice:', error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Synchronized view routing based on Authoritative Event State
  useEffect(() => {
    if (!eventState) return;

    // Do NOT automatically override Admin View if user is actively administering
    if (currentView === 'ADMIN_DASHBOARD' || currentView === 'ADMIN_LOGIN') {
      return;
    }

    // If results are announced, everyone goes to Leaderboard
    if (eventState.resultsAnnounced) {
      setCurrentView('LEADERBOARD');
      return;
    }

    // If user has a registered squad and is in competition mode:
    if (team) {
      if (eventState.roundStatus === 'IN_BREAK') {
        setCurrentView('BREAK');
      } else if (eventState.roundStatus === 'ACTIVE' || eventState.roundStatus === 'PAUSED') {
        switch (eventState.currentRound) {
          case 1:
            setCurrentView('ROUND_1');
            break;
          case 2:
            setCurrentView('ROUND_2');
            break;
          case 3:
            setCurrentView('ROUND_3');
            break;
          case 4:
            setCurrentView('ROUND_4');
            break;
          default:
            setCurrentView('WAITING_ROOM');
        }
      } else if (eventState.roundStatus === 'NOT_STARTED') {
        // If not started yet, remain in waiting room
        if (currentView !== 'LANDING') {
          setCurrentView('WAITING_ROOM');
        }
      }
    }
  }, [eventState, team, currentView]);

  // Handle Team Round Submission
  const handleRoundComplete = async (
    roundNumber: 1 | 2 | 3 | 4,
    score: number,
    progressDetails: Record<string, unknown>
  ) => {
    const targetTeam = team || activeSquad;
    try {
      const res = await submitRoundScore(targetTeam.id, roundNumber, score, progressDetails);
      if (res.success && res.team) {
        setTeam(res.team);
        saveTeamSession(res.team);
        refreshAllData();
      }
    } catch (err) {
      console.error('Error submitting round score:', err);
    }
  };

  // Leave / Switch Squad
  const handleLeaveTeam = () => {
    clearTeamSession();
    setTeam(null);
    setCurrentView('LANDING');
  };

  // Short cinematic hacker reveal animation for main navigation items (Home, How It Works, Rules, Leaderboard)
  const handleNavigateWithHackerReveal = (targetView: ViewState, customLabel?: string) => {
    const viewLabels: Partial<Record<ViewState, string>> = {
      LANDING: 'HOME // COMMAND HUB',
      LEADERBOARD: 'LIVE THREAT LEADERBOARD',
      TEAM_JOIN: 'SQUAD REGISTRATION',
      WAITING_ROOM: 'OPERATIONS BRIEFING',
      ADMIN_LOGIN: 'ADMIN ACCESS GATEWAY',
      ADMIN_DASHBOARD: 'COMMAND CENTER',
    };

    const targetName = customLabel || viewLabels[targetView] || targetView;

    triggerHackerCinematic({
      variant: 'navigation',
      targetPageName: targetName,
      title: `ROUTING // ${targetName}`,
      threatLevel: 'ELEVATED',
      onComplete: () => {
        setCurrentView(targetView);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    });
  };

  const handleOpenHowItWorksWithHackerReveal = () => {
    triggerHackerCinematic({
      variant: 'navigation',
      targetPageName: 'INCIDENT PROTOCOL',
      title: 'PROTOCOL // HOW IT WORKS',
      threatLevel: 'NORMAL',
      onComplete: () => {
        setHowItWorksOpen(true);
      },
    });
  };

  const handleOpenRulesWithHackerReveal = () => {
    triggerHackerCinematic({
      variant: 'navigation',
      targetPageName: 'ENGAGEMENT RULES',
      title: 'SECURITY POLICY // RULES',
      threatLevel: 'NORMAL',
      onComplete: () => {
        setRulesOpen(true);
      },
    });
  };

  // Cinematic Entrance Handlers
  const handleEnterHuntWithCinematic = () => {
    triggerHackerCinematic({
      title: 'INCIDENT INVESTIGATION PORTAL',
      threatLevel: 'ELEVATED',
      terminalLines: [
        '> ACCESSING SECURE CHANNEL...',
        '> ENCRYPTED CONNECTION ESTABLISHED...',
        '> TRACE DETECTED...',
        '> UNKNOWN ACTOR CONNECTED...',
      ],
      onComplete: () => {
        if (team) {
          setCurrentView('WAITING_ROOM');
        } else {
          setCurrentView('TEAM_JOIN');
        }
      },
    });
  };

  const handleAdminSuccessWithCinematic = () => {
    triggerHackerCinematic({
      title: 'SECURE ADMIN TERMINAL',
      threatLevel: 'NORMAL',
      terminalLines: [
        '> ACCESS GRANTED',
        '> PRIVILEGED CREDENTIALS VERIFIED',
        '> COMMAND CENTER INITIALIZED...',
        '> ALL INCIDENT NODES SYNCHRONIZED',
      ],
      onComplete: () => {
        setIsAdminLoggedIn(true);
        setCurrentView('ADMIN_DASHBOARD');
      },
    });
  };

  // Synchronized detection for round authorization transition
  useEffect(() => {
    if (!eventState || !team) return;
    const prevStatus = prevRoundStatusRef.current;
    prevRoundStatusRef.current = eventState.roundStatus;

    if (
      prevStatus &&
      (prevStatus === 'NOT_STARTED' || prevStatus === 'IN_BREAK') &&
      eventState.roundStatus === 'ACTIVE'
    ) {
      const isNextRound = prevStatus === 'IN_BREAK';
      triggerHackerCinematic({
        title: isNextRound
          ? `STAGE 0${eventState.currentRound} AUTHORIZED`
          : 'ADMIN AUTHORIZATION RECEIVED',
        threatLevel: eventState.currentRound === 4 ? 'CRITICAL' : 'ELEVATED',
        terminalLines: isNextRound
          ? [
              '> NEW MISSION AUTHORIZED',
              '> SECURE CHANNEL OPEN',
              `> ROUND 0${eventState.currentRound} INITIALIZED...`,
              '> COMMENCE INVESTIGATION',
            ]
          : [
              '> ADMIN AUTHORIZATION RECEIVED',
              '> MISSION CHANNEL OPEN',
              '> INVESTIGATION STARTING...',
            ],
      });
    }
  }, [eventState, team, triggerHackerCinematic]);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col selection:bg-red-600 selection:text-white font-chakra">
      {/* Interactive Cyber Mouse Cursor & Atmospheric Particle Trailing Effect */}
      <CyberCursor />
      
      {/* HUD Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigateWithHackerReveal}
        teamName={team?.name}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenHowItWorks={handleOpenHowItWorksWithHackerReveal}
        onOpenRules={handleOpenRulesWithHackerReveal}
      />

      {/* Participant In-Game HUD (shows timer, total score, round completion state) */}
      {eventState &&
        ['ROUND_1', 'ROUND_2', 'ROUND_3', 'ROUND_4'].includes(currentView) && (
          <RoundNavigation
            team={activeSquad}
            eventState={eventState}
            currentRoundNumber={
              (eventState.currentRound && eventState.currentRound >= 1
                ? eventState.currentRound
                : currentView === 'ROUND_1'
                ? 1
                : currentView === 'ROUND_2'
                ? 2
                : currentView === 'ROUND_3'
                ? 3
                : 4) as 1 | 2 | 3 | 4
            }
          />
        )}

      {/* Main View Area */}
      <main className="flex-grow">
        {/* LANDING / HERO VIEW */}
        {currentView === 'LANDING' && (
          <div className="space-y-12 pb-16">
            <Hero
              onEnterHunt={handleEnterHuntWithCinematic}
              onHowItWorks={handleOpenHowItWorksWithHackerReveal}
              onViewRounds={() => {
                const el = document.getElementById('rounds-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <RoundsOverviewSection
              onJoinClick={handleEnterHuntWithCinematic}
              onStartRound={async (roundNum) => {
                if (!team) {
                  setTeam(activeSquad);
                  saveTeamSession(activeSquad);
                }
                try {
                  await quickStartRound(roundNum as 1 | 2 | 3 | 4);
                } catch {
                  // Silently continue
                }
                triggerHackerCinematic({
                  title: `STAGE 0${roundNum} INITIALIZED`,
                  threatLevel: roundNum === 4 ? 'CRITICAL' : 'ELEVATED',
                  terminalLines: [
                    `> ENGAGING CHALLENGE ROUND 0${roundNum}...`,
                    '> FORENSIC ENVIRONMENT LOADED',
                    '> THREAT MATRIX ACTIVE',
                  ],
                  onComplete: () => {
                    const viewMap: Record<number, ViewState> = {
                      1: 'ROUND_1',
                      2: 'ROUND_2',
                      3: 'ROUND_3',
                      4: 'ROUND_4',
                    };
                    setCurrentView(viewMap[roundNum] || 'ROUND_1');
                  },
                });
              }}
            />
          </div>
        )}

        {/* TEAM REGISTRATION / JOIN */}
        {currentView === 'TEAM_JOIN' && (
          <TeamJoin
            defaultEventCode={eventState?.eventCode || 'PHISH26'}
            onJoinSuccess={(newTeam, updatedEvent) => {
              setTeam(newTeam);
              saveTeamSession(newTeam);
              if (updatedEvent) setEventState(updatedEvent);
              setCurrentView('WAITING_ROOM');
            }}
            onBackToHome={() => handleNavigateWithHackerReveal('LANDING', 'Home')}
          />
        )}

        {/* WAITING ROOM */}
        {currentView === 'WAITING_ROOM' && (
          <WaitingRoom
            team={activeSquad}
            eventState={eventState}
            onLeaveTeam={handleLeaveTeam}
            onLaunchRound={() => {
              triggerHackerCinematic({
                title: 'STAGE 01 AUTHORIZED',
                threatLevel: 'ELEVATED',
                terminalLines: [
                  '> MISSION PROTOCOL ENGAGED',
                  '> CLASSIFIED ARTIFACTS DECRYPTED',
                  '> ROUND 01 INITIALIZED...',
                  '> COMMENCE INVESTIGATION',
                ],
                onComplete: () => {
                  setCurrentView('ROUND_1');
                },
              });
            }}
          />
        )}

        {/* 2-MINUTE PREPARATION BREAK */}
        {currentView === 'BREAK' && eventState && (
          <PreparationBreak eventState={eventState} team={activeSquad} />
        )}

        {/* ROUND 1: PHISH DETECTOR */}
        {currentView === 'ROUND_1' && (
          <Round1Detector
            team={activeSquad}
            onComplete={(score, details) => handleRoundComplete(1, score, details)}
          />
        )}

        {/* ROUND 2: SOCIAL ENGINEERING */}
        {currentView === 'ROUND_2' && (
          <Round2SocialEng
            team={activeSquad}
            onComplete={(score, details) => handleRoundComplete(2, score, details)}
          />
        )}

        {/* ROUND 3: CYBER INVESTIGATION */}
        {currentView === 'ROUND_3' && (
          <Round3Investigation
            team={activeSquad}
            onComplete={(score, details) => handleRoundComplete(3, score, details)}
          />
        )}

        {/* ROUND 4: ESCAPE THE PHISH */}
        {currentView === 'ROUND_4' && (
          <Round4EscapePhish
            team={activeSquad}
            onComplete={(score, details) => handleRoundComplete(4, score, details)}
          />
        )}

        {/* LEADERBOARD & RESULTS */}
        {currentView === 'LEADERBOARD' && (
          <Leaderboard
            entries={leaderboard}
            currentTeamId={team?.id}
            onRefresh={refreshAllData}
          />
        )}

        {/* ADMIN LOGIN */}
        {currentView === 'ADMIN_LOGIN' && (
          <AdminLogin
            onLoginSuccess={handleAdminSuccessWithCinematic}
            onBackToHome={() => handleNavigateWithHackerReveal('LANDING', 'Home')}
          />
        )}

        {/* ADMIN DASHBOARD (MASTER CONTROLLER) */}
        {currentView === 'ADMIN_DASHBOARD' && eventState && (
          <AdminDashboard
            eventState={eventState}
            teams={teamsList}
            leaderboard={leaderboard}
            onLogout={() => {
              setIsAdminLoggedIn(false);
              handleNavigateWithHackerReveal('LANDING', 'Home');
            }}
            onRefreshData={refreshAllData}
            onLaunchRoundView={(roundNum) => {
              if (!team) {
                setTeam(activeSquad);
                saveTeamSession(activeSquad);
              }
              triggerHackerCinematic({
                title: `OPERATOR VIEW // ROUND 0${roundNum}`,
                threatLevel: 'ELEVATED',
                terminalLines: [
                  `> MASTER CONTROLLER ENGAGING ROUND 0${roundNum}`,
                  '> SYNCHRONIZING REALTIME INCIDENT BOARD...',
                  '> ENTERING CHALLENGE INTERFACE',
                ],
                onComplete: () => {
                  const viewMap: Record<number, ViewState> = {
                    1: 'ROUND_1',
                    2: 'ROUND_2',
                    3: 'ROUND_3',
                    4: 'ROUND_4',
                  };
                  setCurrentView(viewMap[roundNum] || 'ROUND_1');
                },
              });
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-red-950/80 py-8 px-4 sm:px-6 lg:px-8 text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-orbitron font-bold text-white tracking-widest text-sm">
              PHISH HUNT // 2026
            </span>
            <p className="text-zinc-500 text-[11px] mt-0.5">
              CYBER AWARENESS PHISH HUNT • OFFLINE COLLEGE EVENT • 28-09-2026
            </p>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={handleOpenHowItWorksWithHackerReveal}
              className="hover:text-red-400 transition-colors"
            >
              HOW IT WORKS
            </button>
            <button
              onClick={handleOpenRulesWithHackerReveal}
              className="hover:text-red-400 transition-colors"
            >
              RULES
            </button>
            <button
              onClick={() => handleNavigateWithHackerReveal('LEADERBOARD', 'Leaderboard')}
              className="hover:text-red-400 transition-colors"
            >
              HALL OF FAME
            </button>
            <button
              onClick={() => handleNavigateWithHackerReveal('ADMIN_LOGIN', 'Admin Access')}
              className="text-red-500 hover:text-red-400 transition-colors font-bold"
            >
              ADMIN ACCESS
            </button>
          </div>

          <div className="text-zinc-400">
            ENGINEERED & BUILT BY <span className="text-red-400 font-bold">SAHITHI</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <HowItWorksModal isOpen={howItWorksOpen} onClose={() => setHowItWorksOpen(false)} />
      <RulesModal isOpen={rulesOpen} onClose={() => setRulesOpen(false)} />

      {/* Hacker Cinematic Reveal Overlay */}
      <CinematicHackerOverlay
        active={cinematicActive}
        config={cinematicConfig}
        onFinished={() => setCinematicActive(false)}
      />

    </div>
  );
}
