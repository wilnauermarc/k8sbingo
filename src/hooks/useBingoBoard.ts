import { useCallback, useEffect, useMemo, useState } from 'react'
import type {
  BoardCell,
  BingoLine,
  DifficultyFilter,
  PersistedBoardState,
} from '../types/challenge'
import { detectBingoLines } from '../utils/bingo'
import { cellsFromIds, generateBoard } from '../utils/board'

const STORAGE_KEY = 'kubernetes-bingo-v1'

function loadState(): PersistedBoardState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedBoardState
    if (parsed.version !== 1) return null
    if (!Array.isArray(parsed.challengeIds)) return null
    return parsed
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
  celebratedLineIds: string[],
): PersistedBoardState {
  return {
    version: 1,
    challengeIds: cells.map((cell) => cell.challenge.id),
    completedIds: cells
      .filter((cell) => cell.completed && !cell.challenge.isFree)
      .map((cell) => cell.challenge.id),
    difficultyFilter,
    celebratedLineIds,
  }
}

function createInitialBoard(filter: DifficultyFilter = 'all'): {
  cells: BoardCell[]
  difficultyFilter: DifficultyFilter
  celebratedLineIds: string[]
} {
  const saved = loadState()
  if (saved) {
    const restored = cellsFromIds(saved.challengeIds, saved.completedIds)
    if (restored) {
      return {
        cells: restored,
        difficultyFilter: saved.difficultyFilter,
        celebratedLineIds: saved.celebratedLineIds ?? [],
      }
    }
  }

  return {
    cells: generateBoard(filter),
    difficultyFilter: filter,
    celebratedLineIds: [],
  }
}

export function useBingoBoard() {
  const initial = useMemo(() => createInitialBoard(), [])
  const [cells, setCells] = useState<BoardCell[]>(initial.cells)
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>(
    initial.difficultyFilter,
  )
  const [celebratedLineIds, setCelebratedLineIds] = useState<string[]>(
    initial.celebratedLineIds,
  )
  const [newBingoLines, setNewBingoLines] = useState<BingoLine[]>([])

  useEffect(() => {
    saveState(toPersisted(cells, difficultyFilter, celebratedLineIds))
  }, [cells, difficultyFilter, celebratedLineIds])

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

  const toggleComplete = useCallback((challengeId: string) => {
    setCells((prev) =>
      prev.map((cell) => {
        if (cell.challenge.id !== challengeId || cell.challenge.isFree) {
          return cell
        }
        return { ...cell, completed: !cell.completed }
      }),
    )
  }, [])

  const markComplete = useCallback((challengeId: string, completed: boolean) => {
    setCells((prev) =>
      prev.map((cell) => {
        if (cell.challenge.id !== challengeId || cell.challenge.isFree) {
          return cell
        }
        return { ...cell, completed }
      }),
    )
  }, [])

  const newBoard = useCallback((filter: DifficultyFilter = difficultyFilter) => {
    const next = generateBoard(filter)
    setCells(next)
    setDifficultyFilter(filter)
    setCelebratedLineIds([])
    setNewBingoLines([])
  }, [difficultyFilter])

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

  // Detect newly completed bingo lines and surface them once.
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
    completedLines,
    completedCount,
    newBingoLines,
    toggleComplete,
    markComplete,
    newBoard,
    resetProgress,
    changeDifficultyFilter,
    dismissBingoCelebration,
  }
}
