export type EventStatus = 
  | 'NOT_STARTED' 
  | 'WAITING' 
  | 'ROUND_ACTIVE' 
  | 'ROUND_PAUSED' 
  | 'BREAK_ACTIVE' 
  | 'EVENT_COMPLETED';

export type RoundStatus = 'NOT_STARTED' | 'LOCKED' | 'ACTIVE' | 'PAUSED' | 'IN_BREAK' | 'COMPLETED';

export type ViewState = 
  | 'LANDING' 
  | 'TEAM_JOIN' 
  | 'WAITING_ROOM' 
  | 'ROUND_1' 
  | 'ROUND_2' 
  | 'ROUND_3' 
  | 'ROUND_4' 
  | 'BREAK' 
  | 'LEADERBOARD' 
  | 'ADMIN_LOGIN' 
  | 'ADMIN_DASHBOARD';

export interface RoundInfo {
  number: number;
  title: string;
  subtitle: string;
  difficulty: string; // e.g. "★★☆☆☆"
  durationSec: number;
  points: number;
  description: string;
}

export interface TeamProgressRound1 {
  completed: boolean;
  score: number;
  foundClueIds: string[]; // specific suspicious items clicked
  timeSpentSec: number;
}

export interface TeamProgressRound2 {
  completed: boolean;
  score: number;
  decisions: Record<number, 'TRUST' | 'VERIFY' | 'REPORT'>;
  identifiedTactics: string[];
  timeSpentSec: number;
}

export interface TeamProgressRound3 {
  completed: boolean;
  score: number;
  boardClueIds: string[];
  finalAnswer: string | null;
  timeSpentSec: number;
}

export interface TeamProgressRound4 {
  completed: boolean;
  score: number;
  foundClueIds: string[];
  finalAnswer: string | null;
  timeSpentSec: number;
}

export interface Team {
  id: string;
  name: string;
  members: string[];
  eventCode: string;
  connectionStatus: 'CONNECTED' | 'DISCONNECTED';
  lastHeartbeat: number;
  currentScore: number;
  roundScores: {
    1: number;
    2: number;
    3: number;
    4: number;
  };
  roundProgress: {
    1: TeamProgressRound1;
    2: TeamProgressRound2;
    3: TeamProgressRound3;
    4: TeamProgressRound4;
  };
  joinedAt: number;
}

export interface EventState {
  eventId: string;
  eventCode: string;
  eventName: string;
  eventDate: string;
  eventStatus: EventStatus;
  currentRound: 0 | 1 | 2 | 3 | 4;
  roundStatus: RoundStatus;
  roundStartTime: number | null;
  roundDurationSec: number;
  roundPauseRemainingSec: number | null;
  breakStartTime: number | null;
  breakDurationSec: number;
  showLiveLeaderboard: boolean;
  resultsAnnounced: boolean;
  serverTime: number;
}

export interface LeaderboardEntry {
  teamId: string;
  teamName: string;
  members: string[];
  round1: number;
  round2: number;
  round3: number;
  round4: number;
  totalScore: number;
  badges: string[];
  lastSubmittedTime: number;
}

export interface EventSyncResponse {
  event: EventState;
  teams: Team[];
  leaderboard: LeaderboardEntry[];
  serverTime: number;
}

// Data models for Round 1: Phish Detector
export interface SuspiciousPart {
  id: string;
  text: string;
  type: 'SENDER' | 'URL' | 'URGENCY' | 'CREDENTIAL' | 'ATTACHMENT' | 'SAFE_INDICATOR';
  isSuspicious: boolean;
  points: number;
  explanation: string;
}

export interface PhishMessage {
  id: string;
  title: string;
  category: string;
  senderDisplay: string;
  senderAddress: string;
  subject: string;
  receivedTime: string;
  isPhishing: boolean;
  summary: string;
  parts: SuspiciousPart[];
  fullBodyText: string;
}

// Data models for Round 2: Social Engineering
export interface DialogueStep {
  id: number;
  speaker: string;
  message: string;
  attackerTactic: 'IMPERSONATION' | 'AUTHORITY' | 'URGENCY' | 'OTP_REQUEST' | 'PERSONAL_INFO';
  correctDecision: 'TRUST' | 'VERIFY' | 'REPORT';
  tacticExplanation: string;
  trustConsequence: string;
  verifyConsequence: string;
  reportConsequence: string;
}

// Data models for Round 3: Cyber Investigation
export interface EvidenceItem {
  id: string;
  type: 'EMAIL' | 'CHAT' | 'WEBSITE' | 'ATTACHMENT' | 'SMS';
  title: string;
  iconName: string;
  summary: string;
  fullData: Record<string, string>;
  isClue: boolean;
  clueTitle: string;
  clueDeduction: string;
}

// Data models for Round 4: Escape the Phish
export interface EscapeMissionClue {
  id: string;
  title: string;
  category: string;
  description: string;
  evidenceSnippet: string;
  securityImpact: string;
}
