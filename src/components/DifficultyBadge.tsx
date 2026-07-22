import type { Difficulty } from '../types/challenge'

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  beginner: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30',
  intermediate: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30',
  advanced: 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30',
}

interface DifficultyBadgeProps {
  difficulty: Difficulty
  className?: string
}

export function DifficultyBadge({
  difficulty,
  className = '',
}: DifficultyBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${DIFFICULTY_STYLES[difficulty]} ${className}`}
    >
      {difficulty}
    </span>
  )
}
