import type { Context } from '@netlify/functions'
import {
  ensureDay,
  getCountryCode,
  jsonResponse,
  readState,
  utcDayKey,
  writeState,
} from './_shared'

interface TrackBody {
  type?: string
  minutes?: number
}

export default async function handler(
  request: Request,
  context: Context,
): Promise<Response> {
  const origin = request.headers.get('origin')

  if (request.method === 'OPTIONS') {
    return jsonResponse({ ok: true }, 204, origin)
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405, origin)
  }

  let body: TrackBody
  try {
    body = (await request.json()) as TrackBody
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400, origin)
  }

  const type = body.type
  if (type !== 'session' && type !== 'heartbeat' && type !== 'tile') {
    return jsonResponse({ error: 'Invalid event type' }, 400, origin)
  }

  // Caps reduce abuse without storing client identifiers.
  const minutes =
    type === 'heartbeat'
      ? Math.min(5, Math.max(1, Math.floor(Number(body.minutes) || 1)))
      : 0

  const dayKey = utcDayKey()
  const country = getCountryCode(request, context)

  const state = await readState()
  const day = ensureDay(state, dayKey)

  if (type === 'session') {
    day.sessions += 1
    state.countries[country] = (state.countries[country] ?? 0) + 1
  } else if (type === 'heartbeat') {
    day.minutes += minutes
  } else if (type === 'tile') {
    day.tiles += 1
  }

  // Keep storage bounded (≈1 year of daily buckets).
  const keys = Object.keys(state.days).sort()
  if (keys.length > 400) {
    for (const key of keys.slice(0, keys.length - 366)) {
      delete state.days[key]
    }
  }

  await writeState(state)

  return jsonResponse({ ok: true }, 200, origin)
}
