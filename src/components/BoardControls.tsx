import { Flame, RefreshCw, RotateCcw, Target } from 'lucide-react'
import type { ReactNode } from 'react'
import { LEARNING_PATHS } from '../data/learningPaths'
import type { DifficultyFilter, LearningPathId } from '../types/challenge'

interface BoardControlsProps {
  difficultyFilter: DifficultyFilter
  learningPathId: LearningPathId
  completedCount: number
  bingoCount: number
  weeklyCompleted: number
  weeklyGoal: number
  streakDays: number
  onDifficultyChange: (filter: DifficultyFilter) => void
  onLearningPathChange: (pathId: LearningPathId) => void
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
  learningPathId,
  completedCount,
  bingoCount,
  weeklyCompleted,
  weeklyGoal,
  streakDays,
  onDifficultyChange,
  onLearningPathChange,
  onNewBoard,
  onResetProgress,
}: BoardControlsProps) {
  const activePath =
    LEARNING_PATHS.find((path) => path.id === learningPathId) ?? LEARNING_PATHS[0]

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-raised/80 p-4 sm:p-5">
      <div className="space-y-2">
        <p className="block text-xs font-semibold tracking-wide text-ink-muted uppercase">
          Learning path for next board
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Learning path">
          {LEARNING_PATHS.map((path) => {
            const active = learningPathId === path.id
            return (
              <button
                key={path.id}
                type="button"
                onClick={() => onLearningPathChange(path.id)}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-k8s text-white'
                    : 'border border-border bg-surface text-ink-muted hover:border-border-strong hover:text-ink'
                }`}
              >
                {path.label}
              </button>
            )
          })}
        </div>
        <p className="text-xs text-ink-muted">{activePath.description}</p>
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="block text-xs font-semibold tracking-wide text-ink-muted uppercase">
            Difficulty for next board
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Difficulty filter">
            {FILTERS.map((filter) => {
              const active = difficultyFilter === filter.value
              return (
                <button
                  key={filter.value}
                  type="button"
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
            Path and difficulty apply when you create a new board.
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
          label="This week"
          value={`${weeklyCompleted} / ${weeklyGoal}`}
          icon={<Target className="size-3.5 text-k8s-bright" />}
        />
        <Stat
          label="Streak"
          value={streakDays === 1 ? '1 day' : `${streakDays} days`}
          icon={<Flame className="size-3.5 text-amber-300" />}
        />
      </div>
    </section>
  )
}

function Stat({
  label,
  value,
  muted = false,
  icon,
}: {
  label: string
  value: string
  muted?: boolean
  icon?: ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-surface/50 px-3 py-2">
      <p className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-ink-muted uppercase">
        {icon}
        {label}
      </p>
      <p className={`font-semibold ${muted ? 'text-ink-muted' : 'text-ink'}`}>
        {value}
      </p>
    </div>
  )
}
