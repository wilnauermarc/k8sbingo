import { ShieldCheck } from 'lucide-react'

interface StatsOptInBannerProps {
  optedIn: boolean
  onChange: (value: boolean) => void
}

export function StatsOptInBanner({ optedIn, onChange }: StatsOptInBannerProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface-raised/80 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1.5">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-k8s-bright uppercase">
            <ShieldCheck className="size-3.5" />
            Anonymous stats (opt-in)
          </p>
          <p className="max-w-3xl text-sm leading-relaxed text-ink-muted">
            Help improve KubernetesBingo with <strong className="text-ink">anonymous</strong>{' '}
            usage totals only: sessions, approximate minutes on page, completed
            tiles, and country from the CDN edge. No cookies, no IP storage, no
            fingerprinting, no personal profiles. Off by default.
          </p>
        </div>
        <label className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium text-ink">
          <input
            type="checkbox"
            checked={optedIn}
            onChange={(event) => onChange(event.target.checked)}
            className="size-4 accent-k8s"
          />
          Share anonymous stats
        </label>
      </div>
    </section>
  )
}
