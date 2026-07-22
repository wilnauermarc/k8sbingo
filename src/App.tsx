import { useState } from 'react'
import { BingoBoard } from './components/BingoBoard'
import { BingoCelebration } from './components/BingoCelebration'
import { BoardControls } from './components/BoardControls'
import { ChallengeModal } from './components/ChallengeModal'
import { ConfirmDialog } from './components/ConfirmDialog'
import { Header } from './components/Header'
import { useBingoBoard } from './hooks/useBingoBoard'
import type { BoardCell } from './types/challenge'

type ConfirmAction = 'new-board' | 'reset' | null

export default function App() {
  const {
    cells,
    difficultyFilter,
    completedLines,
    completedCount,
    newBingoLines,
    toggleComplete,
    newBoard,
    resetProgress,
    changeDifficultyFilter,
    dismissBingoCelebration,
  } = useBingoBoard()

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)

  const selectedCell: BoardCell | null =
    selectedIndex === null ? null : cells[selectedIndex]

  const hasProgress = completedCount > 0

  const requestNewBoard = () => {
    setConfirmAction('new-board')
  }

  const requestReset = () => {
    if (!hasProgress) return
    setConfirmAction('reset')
  }

  const handleConfirm = () => {
    if (confirmAction === 'new-board') {
      newBoard(difficultyFilter)
      setSelectedIndex(null)
    }
    if (confirmAction === 'reset') {
      resetProgress()
      setSelectedIndex(null)
    }
    setConfirmAction(null)
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Header />

      <BoardControls
        difficultyFilter={difficultyFilter}
        completedCount={completedCount}
        bingoCount={completedLines.length}
        onDifficultyChange={changeDifficultyFilter}
        onNewBoard={requestNewBoard}
        onResetProgress={requestReset}
      />

      <main className="rounded-2xl border border-border bg-surface-raised/50 p-3 sm:p-5">
        <BingoBoard
          cells={cells}
          completedLines={completedLines}
          onCellClick={setSelectedIndex}
        />
      </main>

      <footer className="pb-4 text-center text-xs text-ink-muted">
        Progress stays in this browser via localStorage. No cluster access — you
        mark challenges complete yourself.
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
        message="This replaces your current bingo board and clears completed challenges. Your difficulty selection will be used for the new draw."
        confirmLabel="Create new board"
        tone="primary"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />

      <ConfirmDialog
        open={confirmAction === 'reset'}
        title="Reset progress?"
        message="This clears all completed challenges on the current board. The challenges themselves stay the same."
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
