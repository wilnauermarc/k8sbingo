import { RefreshCw, RotateCcw } from 'lucide-react'
import type { DifficultyFilter } from '../types/challenge'

interface BoardControlsProps {
  difficultyFilter: DifficultyFilter
  completedCount: number
  bingoCount: number
  onDifficultyChange: (filter: DifficultyFilter) => void
  onNewBoard: () => void
  onResetProgress: () => void
}

const FILTERS: { value: DifficultyFilter; label: string }[] = [
  { value: 'all', label: 'All levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

export function BoardControls({
  difficultyFilter,
  completedCount,
  bingoCount,
  onDifficultyChange,
  onNewBoard,
  onResetProgress,
}: BoardControlsProps) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-raised/80 p-4 sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <label
            htmlFor="difficulty-filter"
            className="block text-xs font-semibold tracking-wide text-ink-muted uppercase"
          >
            Difficulty for next board
          </label>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Difficulty filter">
            {FILTERS.map((filter) => {
              const active = difficultyFilter === filter.value
              return (
                <button
                  key={filter.value}
                  type="button"
                  id={filter.value === 'all' ? 'difficulty-filter' : undefined}
                  onClick={() => onDifficultyChange(filter.value)}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                    active
                      ? 'bg-k8s text-white'
                      : 'border border-border bg-surface text-ink-muted hover:border-border-strong hover:text-ink'
                  }`}
                >
                  {filter.label}
                </button>
              )
            })}
          </div>
          <p className="text-xs text-ink-muted">
            Applies when you create a new board. Current progress is unchanged.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onNewBoard}
            className="inline-flex items-center gap-2 rounded-xl bg-k8s px-4 py-2.5 text-sm font-semibold text-white hover:bg-k8s-bright"
          >
            <RefreshCw className="size-4" />
            New board
          </button>
          <button
            type="button"
            onClick={onResetProgress}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-ink hover:bg-surface-overlay"
          >
            <RotateCcw className="size-4" />
            Reset progress
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-border pt-4 text-sm">
        <Stat label="Completed" value={`${completedCount} / 24`} />
        <Stat label="Bingo lines" value={String(bingoCount)} />
        <Stat
          label="Progress saved"
          value="localStorage"
          muted
        />
      </div>
    </section>
  )
}

function Stat({
  label,
  value,
  muted = false,
}: {
  label: string
  value: string
  muted?: boolean
}) {
  return (
    <div className="rounded-xl border border-border bg-surface/50 px-3 py-2">
      <p className="text-[11px] font-medium tracking-wide text-ink-muted uppercase">
        {label}
      </p>
      <p className={`font-semibold ${muted ? 'text-ink-muted' : 'text-ink'}`}>
        {value}
      </p>
    </div>
  )
}
