import { CHALLENGES, FREE_SPACE, getChallengeById } from '../data/challenges'
import type {
  BoardCell,
  Challenge,
  Difficulty,
  DifficultyFilter,
} from '../types/challenge'
import { BOARD_SIZE, CELL_COUNT } from './bingo'

const CENTER_INDEX = Math.floor(CELL_COUNT / 2)

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function filterChallengesByDifficulty(
  filter: DifficultyFilter,
): Challenge[] {
  if (filter === 'all') return [...CHALLENGES]
  return CHALLENGES.filter((challenge) => challenge.difficulty === filter)
}

/**
 * Builds a 5x5 board: 24 challenges + free center.
 * Prefers the selected difficulty, then fills any shortfall from the full pool.
 */
export function generateBoard(filter: DifficultyFilter = 'all'): BoardCell[] {
  const preferred = shuffle(filterChallengesByDifficulty(filter))
  const preferredIds = new Set(preferred.map((challenge) => challenge.id))
  const fillers = shuffle(
    CHALLENGES.filter((challenge) => !preferredIds.has(challenge.id)),
  )
  const selected = [...preferred, ...fillers].slice(0, CELL_COUNT - 1)

  const cells: BoardCell[] = []
  let challengeIndex = 0
  for (let i = 0; i < CELL_COUNT; i += 1) {
    if (i === CENTER_INDEX) {
      cells.push({ challenge: FREE_SPACE, completed: true })
    } else {
      cells.push({ challenge: selected[challengeIndex], completed: false })
      challengeIndex += 1
    }
  }

  return cells
}

export function cellsFromIds(
  challengeIds: string[],
  completedIds: string[],
): BoardCell[] | null {
  if (challengeIds.length !== CELL_COUNT) return null

  const completedSet = new Set(completedIds)
  const cells: BoardCell[] = []

  for (let i = 0; i < challengeIds.length; i += 1) {
    const challenge = getChallengeById(challengeIds[i])
    if (!challenge) return null

    const isFree = Boolean(challenge.isFree) || i === CENTER_INDEX
    cells.push({
      challenge: isFree ? FREE_SPACE : challenge,
      completed: isFree || completedSet.has(challenge.id),
    })
  }

  return cells
}

export function countByDifficulty(
  cells: BoardCell[],
): Record<Difficulty, number> {
  const counts: Record<Difficulty, number> = {
    beginner: 0,
    intermediate: 0,
    advanced: 0,
  }

  for (const cell of cells) {
    if (cell.challenge.isFree) continue
    counts[cell.challenge.difficulty] += 1
  }

  return counts
}

export { CENTER_INDEX, BOARD_SIZE }
