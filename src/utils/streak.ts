import type { LearningStats } from '../types/challenge'

export const DEFAULT_WEEKLY_GOAL = 3

export function todayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10)
}

function parseDay(key: string): Date {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

function shiftDay(key: string, delta: number): string {
  const date = parseDay(key)
  date.setUTCDate(date.getUTCDate() + delta)
  return date.toISOString().slice(0, 10)
}

/** Monday (UTC) of the ISO-like week containing the given day key. */
export function weekStartKey(dayKey: string): string {
  const date = parseDay(dayKey)
  const day = date.getUTCDay() // 0 Sun … 6 Sat
  const diff = day === 0 ? -6 : 1 - day
  date.setUTCDate(date.getUTCDate() + diff)
  return date.toISOString().slice(0, 10)
}

export function createEmptyLearningStats(
  weeklyGoal = DEFAULT_WEEKLY_GOAL,
): LearningStats {
  return {
    dailyCompletions: {},
    weeklyGoal,
  }
}

export function recordCompletion(
  stats: LearningStats,
  dayKey = todayKey(),
): LearningStats {
  const current = stats.dailyCompletions[dayKey] ?? 0
  return {
    ...stats,
    dailyCompletions: {
      ...stats.dailyCompletions,
      [dayKey]: current + 1,
    },
  }
}

export function completionsThisWeek(
  stats: LearningStats,
  dayKey = todayKey(),
): number {
  const start = weekStartKey(dayKey)
  let total = 0
  for (let i = 0; i < 7; i += 1) {
    const key = shiftDay(start, i)
    total += stats.dailyCompletions[key] ?? 0
  }
  return total
}

/**
 * Consecutive days with at least one completion, counting back from today.
 * If today is empty, still allow a streak that ended yesterday.
 */
export function computeStreak(
  stats: LearningStats,
  dayKey = todayKey(),
): number {
  let cursor = dayKey
  if ((stats.dailyCompletions[cursor] ?? 0) === 0) {
    cursor = shiftDay(cursor, -1)
    if ((stats.dailyCompletions[cursor] ?? 0) === 0) return 0
  }

  let streak = 0
  while ((stats.dailyCompletions[cursor] ?? 0) > 0) {
    streak += 1
    cursor = shiftDay(cursor, -1)
  }
  return streak
}
