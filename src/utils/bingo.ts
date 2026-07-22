import type { BingoLine } from '../types/challenge'

const BOARD_SIZE = 5
const CELL_COUNT = BOARD_SIZE * BOARD_SIZE

function rowCells(row: number): number[] {
  const start = row * BOARD_SIZE
  return Array.from({ length: BOARD_SIZE }, (_, col) => start + col)
}

function columnCells(col: number): number[] {
  return Array.from({ length: BOARD_SIZE }, (_, row) => row * BOARD_SIZE + col)
}

/** All possible bingo lines on a 5x5 board (rows, columns, both diagonals). */
export function getAllBingoLines(): BingoLine[] {
  const lines: BingoLine[] = []

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    lines.push({
      id: `row-${row}`,
      type: 'row',
      index: row,
      cells: rowCells(row),
    })
  }

  for (let col = 0; col < BOARD_SIZE; col += 1) {
    lines.push({
      id: `column-${col}`,
      type: 'column',
      index: col,
      cells: columnCells(col),
    })
  }

  lines.push({
    id: 'diagonal-main',
    type: 'diagonal',
    index: 0,
    cells: Array.from({ length: BOARD_SIZE }, (_, i) => i * BOARD_SIZE + i),
  })

  lines.push({
    id: 'diagonal-anti',
    type: 'diagonal',
    index: 1,
    cells: Array.from(
      { length: BOARD_SIZE },
      (_, i) => i * BOARD_SIZE + (BOARD_SIZE - 1 - i),
    ),
  })

  return lines
}

/**
 * Returns bingo lines that are fully completed given a boolean completion
 * array of length 25 (row-major order).
 */
export function detectBingoLines(completed: boolean[]): BingoLine[] {
  if (completed.length !== CELL_COUNT) {
    throw new Error(`Expected ${CELL_COUNT} cells, received ${completed.length}`)
  }

  return getAllBingoLines().filter((line) =>
    line.cells.every((index) => completed[index]),
  )
}

export function isCellInAnyLine(
  cellIndex: number,
  lines: BingoLine[],
): boolean {
  return lines.some((line) => line.cells.includes(cellIndex))
}

export { BOARD_SIZE, CELL_COUNT }
