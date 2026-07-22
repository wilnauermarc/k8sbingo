import { getStore } from '@netlify/blobs'
import type { Context } from '@netlify/functions'

export interface DayBucket {
  sessions: number
  minutes: number
  tiles: number
}

interface AnalyticsState {
  days: Record<string, DayBucket>
  countries: Record<string, number>
}

const STORE_NAME = 'k8sbingo-analytics'
const STATE_KEY = 'aggregates-v1'

const COUNTRY_NAMES: Record<string, string> = {
  AT: 'Austria',
  AU: 'Australia',
  BE: 'Belgium',
  BR: 'Brazil',
  CA: 'Canada',
  CH: 'Switzerland',
  CN: 'China',
  CZ: 'Czechia',
  DE: 'Germany',
  DK: 'Denmark',
  ES: 'Spain',
  FI: 'Finland',
  FR: 'France',
  GB: 'United Kingdom',
  IE: 'Ireland',
  IN: 'India',
  IT: 'Italy',
  JP: 'Japan',
  NL: 'Netherlands',
  NO: 'Norway',
  PL: 'Poland',
  PT: 'Portugal',
  SE: 'Sweden',
  US: 'United States',
  ZZ: 'Unknown',
}

export function countryName(code: string): string {
  const normalized = code.toUpperCase()
  return COUNTRY_NAMES[normalized] ?? normalized
}

function emptyDay(): DayBucket {
  return { sessions: 0, minutes: 0, tiles: 0 }
}

export function utcDayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10)
}

export function shiftUtcDay(dayKey: string, delta: number): string {
  const date = new Date(`${dayKey}T00:00:00.000Z`)
  date.setUTCDate(date.getUTCDate() + delta)
  return date.toISOString().slice(0, 10)
}

export async function readState(): Promise<AnalyticsState> {
  const store = getStore(STORE_NAME)
  const raw = await store.get(STATE_KEY)
  if (!raw) return { days: {}, countries: {} }
  try {
    const parsed = JSON.parse(raw) as AnalyticsState
    return {
      days: parsed.days ?? {},
      countries: parsed.countries ?? {},
    }
  } catch {
    return { days: {}, countries: {} }
  }
}

export async function writeState(state: AnalyticsState): Promise<void> {
  const store = getStore(STORE_NAME)
  await store.setJSON(STATE_KEY, state)
}

export function ensureDay(
  state: AnalyticsState,
  dayKey: string,
): DayBucket {
  if (!state.days[dayKey]) state.days[dayKey] = emptyDay()
  return state.days[dayKey]
}

export function sumDays(
  state: AnalyticsState,
  dayKeys: string[],
): DayBucket {
  return dayKeys.reduce(
    (acc, key) => {
      const day = state.days[key] ?? emptyDay()
      return {
        sessions: acc.sessions + day.sessions,
        minutes: acc.minutes + day.minutes,
        tiles: acc.tiles + day.tiles,
      }
    },
    emptyDay(),
  )
}

export function corsHeaders(origin: string | null): Record<string, string> {
  const allowed =
    origin &&
    (/^https:\/\/([a-z0-9-]+\.)*netlify\.app$/i.test(origin) ||
      /^http:\/\/localhost(:\d+)?$/i.test(origin) ||
      /^http:\/\/127\.0\.0\.1(:\d+)?$/i.test(origin))
      ? origin
      : 'https://k8sbingo.netlify.app'

  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  }
}

export function getCountryCode(request: Request, context: Context): string {
  const headerCountry =
    request.headers.get('x-country') ||
    request.headers.get('x-nf-country-code') ||
    context.geo?.country?.code ||
    ''
  const code = headerCountry.trim().toUpperCase()
  if (/^[A-Z]{2}$/.test(code)) return code
  return 'ZZ'
}

export function jsonResponse(
  body: unknown,
  status: number,
  origin: string | null,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders(origin),
  })
}
