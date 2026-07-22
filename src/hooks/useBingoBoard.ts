import { useCallback, useEffect, useMemo, useState } from 'react'
import type {
  BoardCell,
  BingoLine,
  DifficultyFilter,
  LearningPathId,
  LearningStats,
  PersistedBoardState,
  PersistedBoardStateV1,
} from '../types/challenge'
import { detectBingoLines } from '../utils/bingo'
import { cellsFromIds, generateBoard } from '../utils/board'
import {
  completionsThisWeek,
  computeStreak,
  createEmptyLearningStats,
  recordCompletion,
} from '../utils/streak'

const STORAGE_KEY = 'kubernetes-bingo-v1'

function isV1(value: unknown): value is PersistedBoardStateV1 {
  return (
    typeof value === 'object' &&
    value !== null &&
    'version' in value &&
    (value as PersistedBoardStateV1).version === 1
  )
}

function isV2(value: unknown): value is PersistedBoardState {
  return (
    typeof value === 'object' &&
    value !== null &&
    'version' in value &&
    (value as PersistedBoardState).version === 2
  )
}

function migrate(raw: unknown): PersistedBoardState | null {
  if (isV2(raw)) {
    if (!Array.isArray(raw.challengeIds)) return null
    return {
      ...raw,
      learningPathId: raw.learningPathId ?? 'mixed',
      learningStats: raw.learningStats ?? createEmptyLearningStats(),
    }
  }

  if (isV1(raw)) {
    if (!Array.isArray(raw.challengeIds)) return null
    return {
      version: 2,
      challengeIds: raw.challengeIds,
      completedIds: raw.completedIds ?? [],
      difficultyFilter: raw.difficultyFilter ?? 'all',
      learningPathId: 'mixed',
      celebratedLineIds: raw.celebratedLineIds ?? [],
      learningStats: createEmptyLearningStats(),
    }
  }

  return null
}

function loadState(): PersistedBoardState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return migrate(JSON.parse(raw) as unknown)
  } catch {
    return null
  }
}

function saveState(state: PersistedBoardState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function toPersisted(
  cells: BoardCell[],
  difficultyFilter: DifficultyFilter,
  learningPathId: LearningPathId,
  celebratedLineIds: string[],
  learningStats: LearningStats,
): PersistedBoardState {
  return {
    version: 2,
    challengeIds: cells.map((cell) => cell.challenge.id),
    completedIds: cells
      .filter((cell) => cell.completed && !cell.challenge.isFree)
      .map((cell) => cell.challenge.id),
    difficultyFilter,
    learningPathId,
    celebratedLineIds,
    learningStats,
  }
}

function createInitialBoard(): {
  cells: BoardCell[]
  difficultyFilter: DifficultyFilter
  learningPathId: LearningPathId
  celebratedLineIds: string[]
  learningStats: LearningStats
} {
  const saved = loadState()
  if (saved) {
    const restored = cellsFromIds(saved.challengeIds, saved.completedIds)
    if (restored) {
      return {
        cells: restored,
        difficultyFilter: saved.difficultyFilter,
        learningPathId: saved.learningPathId,
        celebratedLineIds: saved.celebratedLineIds ?? [],
        learningStats: saved.learningStats ?? createEmptyLearningStats(),
      }
    }
  }

  return {
    cells: generateBoard('all', 'mixed'),
    difficultyFilter: 'all',
    learningPathId: 'mixed',
    celebratedLineIds: [],
    learningStats: createEmptyLearningStats(),
  }
}

export function useBingoBoard() {
  const initial = useMemo(() => createInitialBoard(), [])
  const [cells, setCells] = useState<BoardCell[]>(initial.cells)
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>(
    initial.difficultyFilter,
  )
  const [learningPathId, setLearningPathId] = useState<LearningPathId>(
    initial.learningPathId,
  )
  const [celebratedLineIds, setCelebratedLineIds] = useState<string[]>(
    initial.celebratedLineIds,
  )
  const [learningStats, setLearningStats] = useState<LearningStats>(
    initial.learningStats,
  )
  const [newBingoLines, setNewBingoLines] = useState<BingoLine[]>([])

  useEffect(() => {
    saveState(
      toPersisted(
        cells,
        difficultyFilter,
        learningPathId,
        celebratedLineIds,
        learningStats,
      ),
    )
  }, [cells, difficultyFilter, learningPathId, celebratedLineIds, learningStats])

  const completedFlags = useMemo(
    () => cells.map((cell) => cell.completed),
    [cells],
  )

  const completedLines = useMemo(
    () => detectBingoLines(completedFlags),
    [completedFlags],
  )

  const completedCount = useMemo(
    () => cells.filter((cell) => cell.completed && !cell.challenge.isFree).length,
    [cells],
  )

  const weeklyCompleted = useMemo(
    () => completionsThisWeek(learningStats),
    [learningStats],
  )

  const streakDays = useMemo(
    () => computeStreak(learningStats),
    [learningStats],
  )

  const toggleComplete = useCallback((challengeId: string) => {
    setCells((prev) => {
      const target = prev.find((cell) => cell.challenge.id === challengeId)
      if (!target || target.challenge.isFree) return prev

      const markingComplete = !target.completed
      if (markingComplete) {
        setLearningStats((stats) => recordCompletion(stats))
      }

      return prev.map((cell) => {
        if (cell.challenge.id !== challengeId) return cell
        return { ...cell, completed: !cell.completed }
      })
    })
  }, [])

  const newBoard = useCallback(
    (
      filter: DifficultyFilter = difficultyFilter,
      pathId: LearningPathId = learningPathId,
    ) => {
      const next = generateBoard(filter, pathId)
      setCells(next)
      setDifficultyFilter(filter)
      setLearningPathId(pathId)
      setCelebratedLineIds([])
      setNewBingoLines([])
    },
    [difficultyFilter, learningPathId],
  )

  const resetProgress = useCallback(() => {
    setCells((prev) =>
      prev.map((cell) => ({
        ...cell,
        completed: Boolean(cell.challenge.isFree),
      })),
    )
    setCelebratedLineIds([])
    setNewBingoLines([])
  }, [])

  const changeDifficultyFilter = useCallback((filter: DifficultyFilter) => {
    setDifficultyFilter(filter)
  }, [])

  const changeLearningPath = useCallback((pathId: LearningPathId) => {
    setLearningPathId(pathId)
  }, [])

  useEffect(() => {
    const fresh = completedLines.filter(
      (line) => !celebratedLineIds.includes(line.id),
    )
    if (fresh.length === 0) return

    setCelebratedLineIds((prev) => {
      const ids = fresh.map((line) => line.id).filter((id) => !prev.includes(id))
      if (ids.length === 0) return prev
      return [...prev, ...ids]
    })
    setNewBingoLines(fresh)
  }, [completedLines, celebratedLineIds])

  const dismissBingoCelebration = useCallback(() => {
    setNewBingoLines([])
  }, [])

  return {
    cells,
    difficultyFilter,
    learningPathId,
    completedLines,
    completedCount,
    weeklyCompleted,
    weeklyGoal: learningStats.weeklyGoal,
    streakDays,
    newBingoLines,
    toggleComplete,
    newBoard,
    resetProgress,
    changeDifficultyFilter,
    changeLearningPath,
    dismissBingoCelebration,
  }
}
