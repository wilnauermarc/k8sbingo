const OPT_IN_KEY = 'kb-anon-stats-opt-in'
const SESSION_SENT_KEY = 'kb-anon-session-sent'

export function readStatsOptIn(): boolean {
  try {
    return localStorage.getItem(OPT_IN_KEY) === '1'
  } catch {
    return false
  }
}

export function writeStatsOptIn(enabled: boolean): void {
  localStorage.setItem(OPT_IN_KEY, enabled ? '1' : '0')
}

export function hasSentSessionBeacon(): boolean {
  try {
    return sessionStorage.getItem(SESSION_SENT_KEY) === '1'
  } catch {
    return false
  }
}

export function markSessionBeaconSent(): void {
  try {
    sessionStorage.setItem(SESSION_SENT_KEY, '1')
  } catch {
    // ignore
  }
}

export async function postTrackEvent(
  type: 'session' | 'heartbeat' | 'tile',
  minutes?: number,
): Promise<boolean> {
  try {
    const response = await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        type === 'heartbeat' ? { type, minutes: minutes ?? 1 } : { type },
      ),
      keepalive: true,
    })
    return response.ok
  } catch {
    return false
  }
}
