import { Check, Clock3, Sparkles } from 'lucide-react'
import type { BoardCell, Category } from '../types/challenge'
import { DifficultyBadge } from './DifficultyBadge'

const CATEGORY_SHORT: Record<Category, string> = {
  Pods: 'Pods',
  Deployments: 'Deploy',
  Services: 'Svc',
  'ConfigMaps and Secrets': 'Config',
  'Jobs and CronJobs': 'Jobs',
  Troubleshooting: 'Debug',
  Networking: 'Net',
  Storage: 'Storage',
  Scaling: 'Scale',
  Security: 'Sec',
}

interface BingoCellProps {
  cell: BoardCell
  inBingoLine: boolean
  onClick: () => void
}

export function BingoCell({
  cell,
  inBingoLine,
  onClick,
}: BingoCellProps) {
  const { challenge, completed } = cell
  const isFree = Boolean(challenge.isFree)

  const base =
    'relative flex h-24 w-24 shrink-0 flex-col justify-between overflow-hidden rounded-xl border p-2.5 text-left transition sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-36 lg:w-36'
  const stateClass = isFree
    ? 'border-k8s/50 bg-k8s-soft/40 text-ink'
    : completed
      ? 'border-success/40 bg-success-soft/40 text-ink'
      : 'border-border bg-surface-raised text-ink hover:border-k8s/50 hover:bg-surface-overlay'
  const bingoRing = inBingoLine
    ? 'ring-2 ring-k8s-bright shadow-[0_0_0_1px_rgb(91_141_239_/_0.35)]'
    : ''

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${challenge.title}${completed ? ', completed' : ''}`}
      className={`${base} ${stateClass} ${bingoRing}`}
    >
      <div className="flex min-w-0 items-start justify-between gap-1">
        <span className="min-w-0 truncate text-[10px] font-medium uppercase tracking-wider text-ink-muted">
          {isFree ? 'Center' : CATEGORY_SHORT[challenge.category]}
        </span>
        {isFree ? (
          <Sparkles className="size-3.5 shrink-0 text-k8s-bright" aria-hidden />
        ) : completed ? (
          <span className="shrink-0 rounded-full bg-success/20 p-0.5 text-success">
            <Check className="size-3.5" strokeWidth={3} aria-hidden />
          </span>
        ) : (
          <span className="inline-flex shrink-0 items-center gap-0.5 text-[10px] tabular-nums text-ink-muted/80">
            <Clock3 className="size-2.5" aria-hidden />
            {challenge.estimatedMinutes}m
          </span>
        )}
      </div>

      <p
        className={`line-clamp-3 font-display text-[11px] leading-snug font-semibold sm:text-xs md:text-[13px] ${
          isFree ? 'text-k8s-bright' : ''
        }`}
      >
        {challenge.title}
      </p>

      <div className="min-h-[18px]">
        {!isFree && <DifficultyBadge difficulty={challenge.difficulty} />}
      </div>
    </button>
  )
}
