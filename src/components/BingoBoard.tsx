import type { BoardCell, BingoLine } from '../types/challenge'
import { isCellInAnyLine } from '../utils/bingo'
import { BingoCell } from './BingoCell'

interface BingoBoardProps {
  cells: BoardCell[]
  completedLines: BingoLine[]
  onCellClick: (index: number) => void
}

export function BingoBoard({
  cells,
  completedLines,
  onCellClick,
}: BingoBoardProps) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div
        className="mx-auto grid w-max grid-cols-5 gap-2 sm:gap-2.5"
        role="grid"
        aria-label="Kubernetes bingo board"
      >
        {cells.map((cell, index) => (
          <BingoCell
            key={`${cell.challenge.id}-${index}`}
            cell={cell}
            inBingoLine={isCellInAnyLine(index, completedLines)}
            onClick={() => onCellClick(index)}
          />
        ))}
      </div>
    </div>
  )
}
