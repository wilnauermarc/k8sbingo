import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Clock3,
  Globe2,
  LayoutGrid,
  RefreshCw,
  Users,
} from 'lucide-react'
import { CountryMap } from '../components/CountryMap'
import type { StatsSnapshot } from '../types/stats'

export function StatsPage() {
  const [stats, setStats] = useState<StatsSnapshot | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/stats')
      if (!response.ok) {
        throw new Error(`Stats unavailable (${response.status})`)
      }
      const data = (await response.json()) as StatsSnapshot
      setStats(data)
    } catch {
      setStats(null)
      setError(
        'Could not load stats. On production this needs the Netlify function + Blobs. Locally use `netlify dev`.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const maxSessions = Math.max(
    ...(stats?.last14Days.map((day) => day.sessions) ?? [1]),
    1,
  )

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            to="/"
            className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-k8s-bright hover:underline"
          >
            <ArrowLeft className="size-4" />
            Back to bingo
          </Link>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
            Anonymous stats
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-muted">
            Public aggregates only. Built for GDPR-friendly transparency: opt-in
            on the main page, no cookies, no IP storage, country from CDN edge.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium text-ink hover:bg-surface-overlay"
        >
          <RefreshCw className="size-4" />
          Refresh
        </button>
      </div>

      <section className="rounded-2xl border border-border bg-surface-raised/80 p-4 text-sm leading-relaxed text-ink-muted">
        <p className="font-semibold text-ink">What we store</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Daily counters: sessions, minutes, completed tiles</li>
          <li>Country code from Netlify CDN geo (DE, US, …) — not city, not IP</li>
        </ul>
        <p className="mt-2 font-semibold text-ink">What we do not store</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>IP addresses, names, emails, kubeconfigs</li>
          <li>Cookies or cross-day user IDs</li>
          <li>Which challenges someone opened</li>
        </ul>
        <p className="mt-3 text-xs">
          “Sessions” ≈ opted-in browser tabs that sent one anonymous ping.
          Minutes are approximate heartbeats while the tab is visible. Numbers
          can be slightly off under concurrency.
        </p>
      </section>

      {loading && (
        <p className="text-sm text-ink-muted">Loading aggregates…</p>
      )}
      {error && (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {error}
        </p>
      )}

      {stats && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi
              icon={<Users className="size-4 text-k8s-bright" />}
              label="Sessions today"
              value={String(stats.today.sessions)}
            />
            <Kpi
              icon={<Users className="size-4 text-k8s-bright" />}
              label="Sessions this week"
              value={String(stats.week.sessions)}
            />
            <Kpi
              icon={<Clock3 className="size-4 text-k8s-bright" />}
              label="Minutes this week"
              value={String(stats.week.minutes)}
            />
            <Kpi
              icon={<LayoutGrid className="size-4 text-k8s-bright" />}
              label="Tiles this week"
              value={String(stats.week.tiles)}
            />
          </div>

          <section className="rounded-2xl border border-border bg-surface-raised/80 p-4 sm:p-5">
            <h2 className="mb-3 font-display text-lg font-semibold text-ink">
              Last 14 days
            </h2>
            <div className="flex h-40 items-end gap-1.5">
              {stats.last14Days.map((day) => (
                <div
                  key={day.date}
                  className="flex flex-1 flex-col items-center justify-end gap-1"
                  title={`${day.date}: ${day.sessions} sessions, ${day.minutes} min, ${day.tiles} tiles`}
                >
                  <div
                    className="w-full rounded-t bg-k8s/80"
                    style={{
                      height: `${Math.max(4, (day.sessions / maxSessions) * 100)}%`,
                    }}
                  />
                  <span className="text-[9px] text-ink-muted">
                    {day.date.slice(8)}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-ink-muted">
              Bar height = sessions. Hover a bar for minutes and tiles.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="inline-flex items-center gap-2 font-display text-lg font-semibold text-ink">
              <Globe2 className="size-5 text-k8s-bright" />
              Visitor countries
            </h2>
            <CountryMap countries={stats.countries} />
            <div className="rounded-2xl border border-border bg-surface-raised/80 p-4">
              <ul className="space-y-2">
                {stats.countries.length === 0 && (
                  <li className="text-sm text-ink-muted">
                    No country data yet — aggregates appear after opted-in
                    visits on Netlify.
                  </li>
                )}
                {stats.countries.map((country) => {
                  const max = stats.countries[0]?.sessions || 1
                  return (
                    <li key={country.code} className="text-sm">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="font-medium text-ink">
                          {country.name}{' '}
                          <span className="text-ink-muted">({country.code})</span>
                        </span>
                        <span className="tabular-nums text-ink-muted">
                          {country.sessions}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-surface">
                        <div
                          className="h-full rounded-full bg-k8s"
                          style={{
                            width: `${(country.sessions / max) * 100}%`,
                          }}
                        />
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </section>

          <p className="pb-4 text-center text-xs text-ink-muted">
            Updated {new Date(stats.generatedAt).toLocaleString()} ·{' '}
            {stats.privacy.granularity}
          </p>
        </>
      )}
    </div>
  )
}

function Kpi({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface-raised/80 px-4 py-3">
      <p className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-ink-muted uppercase">
        {icon}
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-bold text-ink">{value}</p>
    </div>
  )
}
