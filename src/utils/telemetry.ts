const OPT_OUT_KEY = 'kb-anon-stats-opt-in'
const SESSION_SENT_KEY = 'kb-anon-session-sent'

/**
 * Opt-out model: enabled by default.
 * localStorage "0" = opted out; missing/"1" = enabled.
 * (Key name kept for backward compatibility with earlier builds.)
 */
export function readStatsEnabled(): boolean {
  try {
    return localStorage.getItem(OPT_OUT_KEY) !== '0'
  } catch {
    return true
  }
}

export function writeStatsEnabled(enabled: boolean): void {
  localStorage.setItem(OPT_OUT_KEY, enabled ? '1' : '0')
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
