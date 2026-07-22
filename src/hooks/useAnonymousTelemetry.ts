import { useEffect, useState } from 'react'
import {
  hasSentSessionBeacon,
  markSessionBeaconSent,
  postTrackEvent,
  readStatsEnabled,
  writeStatsEnabled,
} from '../utils/telemetry'

/**
 * Anonymous telemetry (opt-out): session + dwell heartbeats.
 * No cookies, no client ID sent to the server.
 */
export function useAnonymousTelemetry(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    let cancelled = false

    const startSession = async () => {
      if (hasSentSessionBeacon()) return
      const ok = await postTrackEvent('session')
      if (ok && !cancelled) markSessionBeaconSent()
    }

    void startSession()

    const heartbeat = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return
      void postTrackEvent('heartbeat', 1)
    }, 60_000)

    return () => {
      cancelled = true
      window.clearInterval(heartbeat)
    }
  }, [enabled])
}

export function useStatsPreference() {
  const [enabled, setEnabledState] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setEnabledState(readStatsEnabled())
    setReady(true)
  }, [])

  const setEnabled = (value: boolean) => {
    writeStatsEnabled(value)
    setEnabledState(value)
  }

  return { enabled, setEnabled, ready }
}

export function trackTileCompleted(enabled: boolean): void {
  if (!enabled) return
  void postTrackEvent('tile')
}
