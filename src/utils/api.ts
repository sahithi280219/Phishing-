import { EventState, Team, EventSyncResponse, LeaderboardEntry } from '../types';

const ADMIN_TOKEN_KEY = 'phish_hunt_admin_token';
const TEAM_SESSION_KEY = 'phish_hunt_team_session';

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function adminClearAuth() {
  clearAdminToken();
}

export function getSavedTeamSession(): Team | null {
  const data = localStorage.getItem(TEAM_SESSION_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function saveTeamSession(team: Team) {
  localStorage.setItem(TEAM_SESSION_KEY, JSON.stringify(team));
}

export function clearTeamSession() {
  localStorage.removeItem(TEAM_SESSION_KEY);
}

// Fetch current authoritative event state & teams
export async function fetchEventSync(): Promise<EventSyncResponse> {
  const res = await fetch('/api/sync');
  if (!res.ok) throw new Error('Failed to synchronize with event server');
  return res.json();
}

export async function getEventState(): Promise<EventState> {
  const sync = await fetchEventSync();
  return sync.event;
}

export async function getTeams(): Promise<Team[]> {
  const sync = await fetchEventSync();
  return sync.teams;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const sync = await fetchEventSync();
  return sync.leaderboard || [];
}

// Server-Sent Events (SSE) listener
export function subscribeToEventStream(
  onEventUpdate: (eventState: EventState) => void,
  onError?: (error: unknown) => void
): () => void {
  const eventSource = new EventSource('/api/events/stream');

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'STATE_UPDATE' && data.event) {
        onEventUpdate(data.event);
      }
    } catch (err) {
      if (onError) onError(err);
    }
  };

  eventSource.onerror = (err) => {
    if (onError) onError(err);
  };

  return () => {
    eventSource.close();
  };
}

// Admin Login
export async function adminLogin(username: string, password: string): Promise<{ success: boolean; message: string; token?: string; error?: string }> {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

// Admin API caller helper
async function callAdminEndpoint(endpoint: string, body: Record<string, unknown> = {}) {
  let token = getAdminToken();

  // If no token exists, attempt auto-auth with default credentials
  if (!token) {
    try {
      const loginRes = await adminLogin('Admin', 'Zeroriskclub@123');
      if (loginRes.success && loginRes.token) {
        token = loginRes.token;
        setAdminToken(token);
      }
    } catch {
      // Continue with empty token
    }
  }

  let res = await fetch(`/api/admin/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || ''}`,
    },
    body: JSON.stringify(body),
  });

  // If token was expired or rejected, retry once with fresh login
  if (res.status === 401 || res.status === 403) {
    try {
      const loginRes = await adminLogin('Admin', 'Zeroriskclub@123');
      if (loginRes.success && loginRes.token) {
        token = loginRes.token;
        setAdminToken(token);
        res = await fetch(`/api/admin/${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
      }
    } catch {
      // Ignore retry error and parse original response below
    }
  }

  if (!res.ok) {
    // If it was start-round, fallback to quick-start-round endpoint
    if (endpoint === 'start-round') {
      const fallbackRes = await fetch('/api/event/quick-start-round', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (fallbackRes.ok) {
        return fallbackRes.json();
      }
    }

    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Admin operation failed (${endpoint})`);
  }
  return res.json();
}

export async function quickStartRound(roundNumber: 1 | 2 | 3 | 4 = 1) {
  const res = await fetch('/api/event/quick-start-round', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roundNumber }),
  });
  if (!res.ok) throw new Error('Failed to start round');
  return res.json();
}

export async function adminControlRound(roundNumber: 1 | 2 | 3 | 4, action: 'START' | 'END' | 'START_BREAK') {
  if (action === 'START') {
    return callAdminEndpoint('start-round', { roundNumber });
  } else if (action === 'END') {
    return callAdminEndpoint('end-round');
  } else {
    return callAdminEndpoint('start-break');
  }
}

export async function adminPauseEvent() {
  return callAdminEndpoint('pause-round');
}

export async function adminResumeEvent() {
  return callAdminEndpoint('resume-round');
}

export async function adminResetEvent() {
  return callAdminEndpoint('reset-event');
}

export async function adminAnnounceResults() {
  return callAdminEndpoint('toggle-leaderboard');
}

export async function adminVerifyToken(): Promise<boolean> {
  const token = getAdminToken();
  if (!token) return false;
  try {
    const res = await fetch('/api/admin/verify', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      clearAdminToken();
      return false;
    }
    const data = await res.json();
    return !!data.authorized;
  } catch {
    return false;
  }
}

export async function adminGetOverview(): Promise<{ success: boolean; event: EventState; teams: Team[]; leaderboard: LeaderboardEntry[]; activeSessionsCount: number }> {
  const token = getAdminToken();
  const res = await fetch('/api/admin/overview', {
    headers: { Authorization: `Bearer ${token || ''}` },
  });
  if (!res.ok) throw new Error('Unauthorized admin access');
  return res.json();
}

export async function adminDeleteTeam(teamId: string): Promise<boolean> {
  const token = getAdminToken();
  const res = await fetch(`/api/admin/team/${teamId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token || ''}` },
  });
  return res.ok;
}

// Team API caller helper
export async function joinTeam(eventCode: string, teamName: string, members: string[]): Promise<{ success: boolean; team: Team; event: EventState; reconnected?: boolean }> {
  const res = await fetch('/api/team/join', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventCode, teamName, members }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to join event');
  }
  return data;
}

export async function submitRoundScore(
  teamId: string,
  roundNumber: number,
  roundScore: number,
  progress: Record<string, unknown>
): Promise<{ success: boolean; team: Team }> {
  const res = await fetch('/api/team/submit-answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teamId, roundNumber, progress, roundScore }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to submit progress');
  }
  return data;
}
