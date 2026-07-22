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
    <aside className="flex h-full flex-col gap-5 rounded-2xl border border-border bg-surface-raised/80 p-4 sm:p-5">
      <div className="space-y-2">
        <p className="text-xs font-semibold tracking-wide text-ink-muted uppercase">
          Learning path
        </p>
        <div
          className="flex flex-col gap-1.5"
          role="group"
          aria-label="Learning path"
        >
          {LEARNING_PATHS.map((path) => {
            const active = learningPathId === path.id
            return (
              <button
                key={path.id}
                type="button"
                onClick={() => onLearningPathChange(path.id)}
                className={`rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
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
        <p className="text-xs leading-relaxed text-ink-muted">
          {activePath.description}
        </p>
      </div>

      <div className="space-y-2 border-t border-border pt-4">
        <p className="text-xs font-semibold tracking-wide text-ink-muted uppercase">
          Difficulty
        </p>
        <div
          className="grid grid-cols-2 gap-1.5"
          role="group"
          aria-label="Difficulty filter"
        >
          {FILTERS.map((filter) => {
            const active = difficultyFilter === filter.value
            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => onDifficultyChange(filter.value)}
                className={`rounded-xl px-2.5 py-2 text-sm font-medium transition ${
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
          Applies when you create a new board.
        </p>
      </div>

      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <button
          type="button"
          onClick={onNewBoard}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-k8s px-4 py-2.5 text-sm font-semibold text-white hover:bg-k8s-bright"
        >
          <RefreshCw className="size-4" />
          New board
        </button>
        <button
          type="button"
          onClick={onResetProgress}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-ink hover:bg-surface-overlay"
        >
          <RotateCcw className="size-4" />
          Reset progress
        </button>
      </div>

      <div className="mt-auto space-y-3 border-t border-border pt-4">
        <p className="text-xs font-semibold tracking-wide text-ink-muted uppercase">
          Goals
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <Stat
            label="Completed"
            value={`${completedCount} / 24`}
            hint="Tiles done on this board"
          />
          <Stat
            label="Bingo lines"
            value={String(bingoCount)}
            hint="Full row, column, or diagonal"
          />
          <Stat
            label="This week"
            value={`${weeklyCompleted} / ${weeklyGoal}`}
            hint={`${weeklyGoal} challenges / week keeps you on track`}
            icon={<Target className="size-3.5 text-k8s-bright" />}
          />
          <Stat
            label="Streak"
            value={streakDays === 1 ? '1 day' : `${streakDays} days`}
            hint="Consecutive days with ≥1 completion"
            icon={<Flame className="size-3.5 text-amber-300" />}
          />
        </div>
        <p className="text-xs leading-relaxed text-ink-muted">
          Board goal: complete lines (or blackout). Weekly goal: finish{' '}
          {weeklyGoal} challenges to stay active — streak counts days in a row
          with at least one completion.
        </p>
      </div>
    </aside>
  )
}

function Stat({
  label,
  value,
  hint,
  muted = false,
  icon,
}: {
  label: string
  value: string
  hint?: string
  muted?: boolean
  icon?: ReactNode
}) {
  return (
    <div
      className="rounded-xl border border-border bg-surface/50 px-3 py-2"
      title={hint}
    >
      <p className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-ink-muted uppercase">
        {icon}
        {label}
      </p>
      <p className={`font-semibold ${muted ? 'text-ink-muted' : 'text-ink'}`}>
        {value}
      </p>
      {hint && (
        <p className="mt-0.5 text-[10px] leading-snug text-ink-muted/80">{hint}</p>
      )}
    </div>
  )
}
