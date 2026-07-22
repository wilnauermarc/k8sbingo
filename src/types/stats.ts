export interface DayBucket {
  sessions: number
  minutes: number
  tiles: number
}

export interface StatsSnapshot {
  generatedAt: string
  today: DayBucket
  week: DayBucket
  last14Days: Array<{ date: string } & DayBucket>
  countries: Array<{ code: string; name: string; sessions: number }>
  privacy: {
    storesIp: false
    usesCookies: false
    granularity: 'country-only CDN edge + daily aggregates'
    optInRequired: true
  }
}

export type TrackEventType = 'session' | 'heartbeat' | 'tile'

export interface TrackPayload {
  type: TrackEventType
  /** Heartbeat may send 1–5 minutes; other events ignore this. */
  minutes?: number
}
