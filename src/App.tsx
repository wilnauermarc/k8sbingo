import { useState } from 'react'
import { BingoBoard } from './components/BingoBoard'
import { BingoCelebration } from './components/BingoCelebration'
import { BoardControls } from './components/BoardControls'
import { ChallengeModal } from './components/ChallengeModal'
import { ConfirmDialog } from './components/ConfirmDialog'
import { Header } from './components/Header'
import { getLearningPath } from './data/learningPaths'
import { useBingoBoard } from './hooks/useBingoBoard'
import type { BoardCell } from './types/challenge'

type ConfirmAction = 'new-board' | 'reset' | null

export default function App() {
  const {
    cells,
    difficultyFilter,
    learningPathId,
    completedLines,
    completedCount,
    weeklyCompleted,
    weeklyGoal,
    streakDays,
    newBingoLines,
    toggleComplete,
    newBoard,
    resetProgress,
    changeDifficultyFilter,
    changeLearningPath,
    dismissBingoCelebration,
  } = useBingoBoard()

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)

  const selectedCell: BoardCell | null =
    selectedIndex === null ? null : cells[selectedIndex]

  const hasProgress = completedCount > 0
  const pathLabel = getLearningPath(learningPathId).label

  const requestNewBoard = () => {
    setConfirmAction('new-board')
  }

  const requestReset = () => {
    if (!hasProgress) return
    setConfirmAction('reset')
  }

  const handleConfirm = () => {
    if (confirmAction === 'new-board') {
      newBoard(difficultyFilter, learningPathId)
      setSelectedIndex(null)
    }
    if (confirmAction === 'reset') {
      resetProgress()
      setSelectedIndex(null)
    }
    setConfirmAction(null)
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Header />

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(15rem,18rem)_minmax(0,1fr)] lg:gap-5">
        <BoardControls
          difficultyFilter={difficultyFilter}
          learningPathId={learningPathId}
          completedCount={completedCount}
          bingoCount={completedLines.length}
          weeklyCompleted={weeklyCompleted}
          weeklyGoal={weeklyGoal}
          streakDays={streakDays}
          onDifficultyChange={changeDifficultyFilter}
          onLearningPathChange={changeLearningPath}
          onNewBoard={requestNewBoard}
          onResetProgress={requestReset}
        />

        <main className="min-w-0 rounded-2xl border border-border bg-surface-raised/50 p-3 sm:p-5">
          <BingoBoard
            cells={cells}
            completedLines={completedLines}
            onCellClick={setSelectedIndex}
          />
        </main>
      </div>

      <footer className="space-y-2 pb-4 text-center text-xs text-ink-muted">
        <p>
          Progress stays in this browser via localStorage. No cookies or
          trackers. No cluster access — you mark challenges complete yourself.
        </p>
        <p>
          Example commands are for local lab clusters only (kind / k3d /
          Minikube), not production.
        </p>
        <p>
          Built by{' '}
          <a
            href="https://www.linkedin.com/in/marc-w-599779252/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-k8s-bright underline-offset-2 hover:underline"
          >
            Marc Wilnauer on LinkedIn
          </a>
        </p>
      </footer>

      <ChallengeModal
        challenge={selectedCell?.challenge ?? null}
        completed={selectedCell?.completed ?? false}
        onClose={() => setSelectedIndex(null)}
        onToggleComplete={() => {
          if (!selectedCell) return
          toggleComplete(selectedCell.challenge.id)
        }}
      />

      <ConfirmDialog
        open={confirmAction === 'new-board'}
        title="Create a new board?"
        message={`This replaces your current bingo board and clears completed challenges. Next board: ${pathLabel} · ${difficultyFilter === 'all' ? 'all levels' : difficultyFilter}.`}
        confirmLabel="Create new board"
        tone="primary"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />

      <ConfirmDialog
        open={confirmAction === 'reset'}
        title="Reset progress?"
        message="This clears all completed challenges on the current board. The challenges themselves stay the same. Your weekly streak stats are kept."
        confirmLabel="Reset progress"
        tone="danger"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />

      <BingoCelebration
        lines={newBingoLines}
        onDismiss={dismissBingoCelebration}
      />
    </div>
  )
}
