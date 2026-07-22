import type { Context } from '@netlify/functions'
import {
  countryName,
  jsonResponse,
  readState,
  shiftUtcDay,
  sumDays,
  utcDayKey,
} from './_shared'

export default async function handler(
  request: Request,
  _context: Context,
): Promise<Response> {
  const origin = request.headers.get('origin')

  if (request.method === 'OPTIONS') {
    return jsonResponse({ ok: true }, 204, origin)
  }

  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed' }, 405, origin)
  }

  const state = await readState()
  const todayKey = utcDayKey()
  const last14 = Array.from({ length: 14 }, (_, index) =>
    shiftUtcDay(todayKey, index - 13),
  )
  const weekKeys = last14.slice(-7)

  const countries = Object.entries(state.countries)
    .map(([code, sessions]) => ({
      code,
      name: countryName(code),
      sessions,
    }))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 40)

  return jsonResponse(
    {
      generatedAt: new Date().toISOString(),
      today: sumDays(state, [todayKey]),
      week: sumDays(state, weekKeys),
      last14Days: last14.map((date) => ({
        date,
        ...(state.days[date] ?? { sessions: 0, minutes: 0, tiles: 0 }),
      })),
      countries,
      privacy: {
        storesIp: false,
        usesCookies: false,
        granularity: 'country-only CDN edge + daily aggregates',
        optInRequired: false,
        optOutAvailable: true,
      },
    },
    200,
    origin,
  )
}
