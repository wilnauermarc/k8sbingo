export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type Category =
  | 'Pods'
  | 'Deployments'
  | 'Services'
  | 'ConfigMaps and Secrets'
  | 'Jobs and CronJobs'
  | 'Troubleshooting'
  | 'Networking'
  | 'Storage'
  | 'Scaling'
  | 'Security'

export interface Challenge {
  id: string
  title: string
  description: string
  difficulty: Difficulty
  category: Category
  hint: string
  exampleSolution: string
  isFree?: boolean
}

export type DifficultyFilter = Difficulty | 'all'

export interface BoardCell {
  challenge: Challenge
  completed: boolean
}

export type BingoLineType = 'row' | 'column' | 'diagonal'

export interface BingoLine {
  id: string
  type: BingoLineType
  index: number
  cells: number[]
}

export interface PersistedBoardState {
  version: 1
  challengeIds: string[]
  completedIds: string[]
  difficultyFilter: DifficultyFilter
  celebratedLineIds: string[]
}
