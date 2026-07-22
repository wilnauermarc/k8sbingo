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

export interface ChallengeChecklist {
  /** Decide what “done” looks like before touching the cluster. */
  before: string[]
  /** Practical moves while working. */
  during: string[]
  /** Concrete checks that prove success. */
  after: string[]
  /** One reflection prompt to lock in the lesson. */
  reflect: string
}

export interface Challenge {
  id: string
  title: string
  description: string
  difficulty: Difficulty
  category: Category
  hint: string
  exampleSolution: string
  /** Why this skill matters in real cluster work. */
  why?: string
  /** Rough hands-on time in a local cluster. */
  estimatedMinutes?: number
  /** Optional checklist overrides (merged on top of category defaults). */
  checklist?: Partial<ChallengeChecklist>
  /** @deprecated Prefer checklist.before — still accepted for older overrides. */
  expect?: string
  /** @deprecated Prefer checklist.after — still accepted for older overrides. */
  successCheck?: string
  isFree?: boolean
}

/** Challenge with learning fields always populated. */
export interface EnrichedChallenge extends Challenge {
  why: string
  estimatedMinutes: number
  checklist: ChallengeChecklist
}

export type DifficultyFilter = Difficulty | 'all'

export type LearningPathId =
  | 'mixed'
  | 'workloads'
  | 'config'
  | 'networking'
  | 'troubleshooting'
  | 'storage-scaling'
  | 'security'
  | 'batch'

export interface LearningPath {
  id: LearningPathId
  label: string
  description: string
  categories: Category[] | null
}

export interface BoardCell {
  challenge: EnrichedChallenge
  completed: boolean
}

export type BingoLineType = 'row' | 'column' | 'diagonal'

export interface BingoLine {
  id: string
  type: BingoLineType
  index: number
  cells: number[]
}

export interface LearningStats {
  /** YYYY-MM-DD → number of challenges newly completed that day */
  dailyCompletions: Record<string, number>
  weeklyGoal: number
}

export interface PersistedBoardState {
  version: 2
  challengeIds: string[]
  completedIds: string[]
  difficultyFilter: DifficultyFilter
  learningPathId: LearningPathId
  celebratedLineIds: string[]
  learningStats: LearningStats
}

/** Legacy v1 shape for migration. */
export interface PersistedBoardStateV1 {
  version: 1
  challengeIds: string[]
  completedIds: string[]
  difficultyFilter: DifficultyFilter
  celebratedLineIds: string[]
}
