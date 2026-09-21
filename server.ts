import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'phish_hunt_super_secret_session_2026';
const ADMIN_USER = process.env.ADMIN_USERNAME || 'Admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'Zeroriskclub@123';

interface TeamProgress {
  1: { completed: boolean; score: number; foundClueIds: string[]; timeSpentSec: number };
  2: { completed: boolean; score: number; decisions: Record<number, string>; identifiedTactics: string[]; timeSpentSec: number };
  3: { completed: boolean; score: number; boardClueIds: string[]; finalAnswer: string | null; timeSpentSec: number };
  4: { completed: boolean; score: number; foundClueIds: string[]; finalAnswer: string | null; timeSpentSec: number };
}

interface TeamData {
  id: string;
  name: string;
  members: string[];
  eventCode: string;
  connectionStatus: 'CONNECTED' | 'DISCONNECTED';
  lastHeartbeat: number;
  currentScore: number;
  roundScores: { 1: number; 2: number; 3: number; 4: number };
  roundProgress: TeamProgress;
  joinedAt: number;
}

interface ServerEventState {
  eventId: string;
  eventCode: string;
  eventName: string;
  eventDate: string;
  eventStatus: 'NOT_STARTED' | 'WAITING' | 'ROUND_ACTIVE' | 'ROUND_PAUSED' | 'BREAK_ACTIVE' | 'EVENT_COMPLETED';
  currentRound: 0 | 1 | 2 | 3 | 4;
  roundStatus: 'NOT_STARTED' | 'LOCKED' | 'ACTIVE' | 'PAUSED' | 'IN_BREAK' | 'COMPLETED';
  roundStartTime: number | null;
  roundDurationSec: number;
  roundPauseRemainingSec: number | null;
  breakStartTime: number | null;
  breakDurationSec: number;
  showLiveLeaderboard: boolean;
  resultsAnnounced: boolean;
}

// In-Memory Authoritative Game State
let eventState: ServerEventState = {
  eventId: 'phish_hunt_2026',
  eventCode: 'PHISH26',
  eventName: 'Cyber Awareness Phish Hunt',
  eventDate: '28-09-2026',
  eventStatus: 'NOT_STARTED',
  currentRound: 0,
  roundStatus: 'NOT_STARTED',
  roundStartTime: null,
  roundDurationSec: 300,
  roundPauseRemainingSec: null,
  breakStartTime: null,
  breakDurationSec: 120, // 2 minutes
  showLiveLeaderboard: false,
  resultsAnnounced: false,
};

let teams: Map<string, TeamData> = new Map();
let activeAdminSessions = new Set<string>();
let sseClients: express.Response[] = [];

function getSortedLeaderboard() {
  return Array.from(teams.values())
    .map((t) => ({
      teamId: t.id,
      teamName: t.name,
      members: t.members,
      round1: t.roundScores[1] || 0,
      round2: t.roundScores[2] || 0,
      round3: t.roundScores[3] || 0,
      round4: t.roundScores[4] || 0,
      totalScore: t.currentScore || 0,
      badges: ['PHISH MASTER', 'CYBER DETECTIVE', 'SOCIAL DEFENDER', 'FIRST RESPONDER'],
      lastSubmittedTime: t.lastHeartbeat,
    }))
    .sort((a, b) => b.totalScore - a.totalScore);
}

// Broadcast changes to all connected SSE clients
function broadcastState() {
  const payload = JSON.stringify({
    type: 'STATE_UPDATE',
    event: { ...eventState, serverTime: Date.now() },
    teams: Array.from(teams.values()),
    leaderboard: getSortedLeaderboard(),
    serverTime: Date.now(),
  });

  sseClients = sseClients.filter((res) => {
    try {
      res.write(`data: ${payload}\n\n`);
      return true;
    } catch {
      return false;
    }
  });
}

// Periodically check team disconnection
setInterval(() => {
  const now = Date.now();
  let changed = false;
  teams.forEach((team) => {
    if (now - team.lastHeartbeat > 12000 && team.connectionStatus === 'CONNECTED') {
      team.connectionStatus = 'DISCONNECTED';
      changed = true;
    }
  });
  if (changed) {
    broadcastState();
  }
}, 4000);

// Round durations
const ROUND_DURATIONS: Record<number, number> = {
  1: 300, // 5 min
  2: 420, // 7 min
  3: 480, // 8 min
  4: 600, // 10 min
};

function generateAdminToken(username: string): string {
  const expires = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  const hmac = crypto.createHmac('sha256', SESSION_SECRET);
  hmac.update(`admin:${username}:${expires}`);
  const signature = hmac.digest('hex');
  const token = `adm_${expires}_${signature}`;
  activeAdminSessions.add(token);
  return token;
}

function isValidAdminToken(token: string | null | undefined): boolean {
  if (!token) return false;
  if (activeAdminSessions.has(token)) return true;
  // Verify persistent HMAC signed token
  if (token.startsWith('adm_')) {
    const parts = token.split('_');
    if (parts.length === 3) {
      const expires = Number(parts[1]);
      const sig = parts[2];
      if (!isNaN(expires) && expires > Date.now()) {
        const hmac = crypto.createHmac('sha256', SESSION_SECRET);
        hmac.update(`admin:${ADMIN_USER}:${expires}`);
        if (hmac.digest('hex') === sig) {
          activeAdminSessions.add(token);
          return true;
        }
      }
    }
  }
  return false;
}

function verifyAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'ACCESS DENIED: Missing authorization header' });
  }
  const token = authHeader.substring(7);
  if (!isValidAdminToken(token)) {
    return res.status(403).json({ error: 'ACCESS DENIED: Invalid or expired session' });
  }
  next();
}

async function startServer() {
  const app = express();

  app.use(express.json());

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'PHISH HUNT SERVER',
      timestamp: Date.now(),
    });
  });

  // Admin Token Verification (Server-Side Authorization Check)
  app.get('/api/admin/verify', verifyAdminAuth, (req, res) => {
    res.json({
      success: true,
      authorized: true,
      adminUser: ADMIN_USER,
    });
  });

  // Admin Comprehensive Full Data Inspection (Protected)
  app.get('/api/admin/overview', verifyAdminAuth, (req, res) => {
    res.json({
      success: true,
      event: { ...eventState, serverTime: Date.now() },
      teams: Array.from(teams.values()),
      leaderboard: getSortedLeaderboard(),
      activeSessionsCount: activeAdminSessions.size,
    });
  });

  // Admin Delete Team
  app.delete('/api/admin/team/:teamId', verifyAdminAuth, (req, res) => {
    const { teamId } = req.params;
    if (teams.has(teamId)) {
      teams.delete(teamId);
      broadcastState();
      return res.json({ success: true, message: `Team ${teamId} removed` });
    }
    return res.status(404).json({ error: 'Team not found' });
  });

  // Admin Login
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const token = generateAdminToken(username);
      return res.json({
        success: true,
        message: 'ACCESS GRANTED',
        token,
        adminUser: username,
      });
    }

    return res.status(401).json({
      success: false,
      message: 'ACCESS DENIED',
      error: 'Invalid administrator credentials',
    });
  });

  // Admin Logout
  app.post('/api/admin/logout', verifyAdminAuth, (req, res) => {
    const token = req.headers.authorization?.substring(7);
    if (token) activeAdminSessions.delete(token);
    res.json({ success: true });
  });

  // Real-Time SSE Stream for participants and admin
  app.get('/api/events/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Send initial snapshot
    res.write(
      `data: ${JSON.stringify({
        type: 'INITIAL_STATE',
        event: { ...eventState, serverTime: Date.now() },
        teams: Array.from(teams.values()),
        leaderboard: getSortedLeaderboard(),
        serverTime: Date.now(),
      })}\n\n`
    );

    sseClients.push(res);

    req.on('close', () => {
      sseClients = sseClients.filter((client) => client !== res);
    });
  });

  // General Sync Endpoint
  app.get('/api/sync', (req, res) => {
    res.json({
      event: { ...eventState, serverTime: Date.now() },
      teams: Array.from(teams.values()),
      leaderboard: getSortedLeaderboard(),
      serverTime: Date.now(),
    });
  });

  // Team Join
  app.post('/api/team/join', (req, res) => {
    const { eventCode, teamName, members } = req.body;

    if (!eventCode || eventCode.trim().toUpperCase() !== eventState.eventCode) {
      return res.status(400).json({ error: 'Invalid Event Code. Please verify with the event controller.' });
    }

    if (!teamName || teamName.trim().length < 2) {
      return res.status(400).json({ error: 'Team name is required.' });
    }

    const trimmedName = teamName.trim();
    const existingTeam = Array.from(teams.values()).find(
      (t) => t.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (existingTeam) {
      // Reconnection for existing team
      existingTeam.connectionStatus = 'CONNECTED';
      existingTeam.lastHeartbeat = Date.now();
      broadcastState();
      return res.json({
        success: true,
        reconnected: true,
        team: existingTeam,
        event: { ...eventState, serverTime: Date.now() },
      });
    }

    // New Team registration
    const teamId = 'team_' + crypto.randomUUID().slice(0, 8);
    const validMembers = Array.isArray(members)
      ? members.map((m: string) => String(m || '').trim()).filter(Boolean)
      : ['Member 1'];

    const newTeam: TeamData = {
      id: teamId,
      name: trimmedName,
      members: validMembers.length > 0 ? validMembers : ['Team Lead'],
      eventCode: eventState.eventCode,
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

    teams.set(teamId, newTeam);
    broadcastState();

    return res.json({
      success: true,
      team: newTeam,
      event: { ...eventState, serverTime: Date.now() },
    });
  });

  // Team Heartbeat
  app.post('/api/team/heartbeat', (req, res) => {
    const { teamId } = req.body;
    const team = teams.get(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const wasDisconnected = team.connectionStatus === 'DISCONNECTED';
    team.lastHeartbeat = Date.now();
    team.connectionStatus = 'CONNECTED';

    if (wasDisconnected) {
      broadcastState();
    }

    return res.json({
      success: true,
      serverTime: Date.now(),
      currentRound: eventState.currentRound,
      roundStatus: eventState.roundStatus,
    });
  });

  // Team Submit Round Answers
  app.post('/api/team/submit-answer', (req, res) => {
    const { teamId, roundNumber, progress, roundScore } = req.body;
    const team = teams.get(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const rNum = Number(roundNumber) as 1 | 2 | 3 | 4;
    if (![1, 2, 3, 4].includes(rNum)) {
      return res.status(400).json({ error: 'Invalid round number' });
    }

    // Update round progress
    const numericScore = Math.max(0, Number(roundScore) || 0);
    team.roundScores[rNum] = numericScore;
    team.roundProgress[rNum] = {
      ...team.roundProgress[rNum],
      ...progress,
      score: numericScore,
      completed: true,
    };

    // Calculate total score
    team.currentScore =
      team.roundScores[1] +
      team.roundScores[2] +
      team.roundScores[3] +
      team.roundScores[4];

    team.lastHeartbeat = Date.now();
    team.connectionStatus = 'CONNECTED';

    broadcastState();

    return res.json({
      success: true,
      team,
      event: { ...eventState, serverTime: Date.now() },
    });
  });

  // ADMIN CONTROLS (Protected)
  app.post('/api/admin/start-event', verifyAdminAuth, (req, res) => {
    eventState.eventStatus = 'WAITING';
    eventState.currentRound = 0;
    eventState.roundStatus = 'NOT_STARTED';
    broadcastState();
    res.json({ success: true, event: eventState });
  });

  function startRoundInternal(rNum: 1 | 2 | 3 | 4) {
    eventState.currentRound = rNum;
    eventState.eventStatus = 'ROUND_ACTIVE';
    eventState.roundStatus = 'ACTIVE';
    eventState.roundDurationSec = ROUND_DURATIONS[rNum] || 300;
    eventState.roundStartTime = Date.now();
    eventState.roundPauseRemainingSec = null;
    eventState.breakStartTime = null;
    broadcastState();
    return eventState;
  }

  // Quick Start / Demo Start (allows participant or organizer to test or start round immediately)
  app.post('/api/event/quick-start-round', (req, res) => {
    const { roundNumber } = req.body;
    const rNum = (Number(roundNumber) || 1) as 1 | 2 | 3 | 4;
    const validRound = [1, 2, 3, 4].includes(rNum) ? rNum : 1;
    const updated = startRoundInternal(validRound as 1 | 2 | 3 | 4);
    res.json({ success: true, event: updated });
  });

  app.post('/api/admin/start-round', verifyAdminAuth, (req, res) => {
    const { roundNumber } = req.body;
    const rNum = Number(roundNumber) as 1 | 2 | 3 | 4;
    if (![1, 2, 3, 4].includes(rNum)) {
      return res.status(400).json({ error: 'Invalid round' });
    }

    const updated = startRoundInternal(rNum);
    res.json({ success: true, event: updated });
  });

  app.post('/api/admin/pause-round', verifyAdminAuth, (req, res) => {
    if (eventState.roundStatus === 'ACTIVE' && eventState.roundStartTime) {
      const elapsed = Math.floor((Date.now() - eventState.roundStartTime) / 1000);
      const remaining = Math.max(0, eventState.roundDurationSec - elapsed);
      eventState.roundStatus = 'PAUSED';
      eventState.eventStatus = 'ROUND_PAUSED';
      eventState.roundPauseRemainingSec = remaining;
      broadcastState();
    }
    res.json({ success: true, event: eventState });
  });

  app.post('/api/admin/resume-round', verifyAdminAuth, (req, res) => {
    if (eventState.roundStatus === 'PAUSED' && eventState.roundPauseRemainingSec !== null) {
      eventState.roundStatus = 'ACTIVE';
      eventState.eventStatus = 'ROUND_ACTIVE';
      eventState.roundDurationSec = eventState.roundPauseRemainingSec;
      eventState.roundStartTime = Date.now();
      eventState.roundPauseRemainingSec = null;
      broadcastState();
    }
    res.json({ success: true, event: eventState });
  });

  app.post('/api/admin/end-round', verifyAdminAuth, (req, res) => {
    eventState.roundStatus = 'COMPLETED';
    if (eventState.currentRound === 4) {
      eventState.eventStatus = 'EVENT_COMPLETED';
    } else {
      eventState.eventStatus = 'WAITING';
    }
    broadcastState();
    res.json({ success: true, event: eventState });
  });

  app.post('/api/admin/start-break', verifyAdminAuth, (req, res) => {
    eventState.eventStatus = 'BREAK_ACTIVE';
    eventState.roundStatus = 'IN_BREAK';
    eventState.breakStartTime = Date.now();
    eventState.breakDurationSec = 120; // 2 minutes global timer
    broadcastState();
    res.json({ success: true, event: eventState });
  });

  app.post('/api/admin/toggle-leaderboard', verifyAdminAuth, (req, res) => {
    eventState.showLiveLeaderboard = !eventState.showLiveLeaderboard;
    eventState.resultsAnnounced = true;
    broadcastState();
    res.json({
      success: true,
      showLiveLeaderboard: eventState.showLiveLeaderboard,
      resultsAnnounced: eventState.resultsAnnounced,
    });
  });

  app.post('/api/admin/reset-event', verifyAdminAuth, (req, res) => {
    eventState = {
      eventId: 'phish_hunt_2026',
      eventCode: 'PHISH26',
      eventName: 'Cyber Awareness Phish Hunt',
      eventDate: '28-09-2026',
      eventStatus: 'NOT_STARTED',
      currentRound: 0,
      roundStatus: 'NOT_STARTED',
      roundStartTime: null,
      roundDurationSec: 300,
      roundPauseRemainingSec: null,
      breakStartTime: null,
      breakDurationSec: 120,
      showLiveLeaderboard: false,
      resultsAnnounced: false,
    };
    teams.clear();
    broadcastState();
    res.json({ success: true, event: eventState });
  });

  // Vite middleware in dev or static files in production
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    (typeof __filename !== 'undefined' && __filename.endsWith('.cjs')) ||
    (!process.env.npm_lifecycle_event?.includes('dev') && fs.existsSync(path.join(process.cwd(), 'dist', 'index.html')));

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Application build in progress. Please refresh in a moment.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PHISH HUNT] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
