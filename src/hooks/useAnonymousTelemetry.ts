import { useEffect, useState } from 'react'
import {
  hasSentSessionBeacon,
  markSessionBeaconSent,
  postTrackEvent,
  readStatsOptIn,
  writeStatsOptIn,
} from '../utils/telemetry'

/**
 * Opt-in anonymous telemetry: session + dwell heartbeats.
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

export function useStatsOptIn() {
  const [optedIn, setOptedIn] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setOptedIn(readStatsOptIn())
    setReady(true)
  }, [])

  const setOptIn = (value: boolean) => {
    writeStatsOptIn(value)
    setOptedIn(value)
  }

  return { optedIn, setOptIn, ready }
}

export function trackTileCompleted(optedIn: boolean): void {
  if (!optedIn) return
  void postTrackEvent('tile')
}
