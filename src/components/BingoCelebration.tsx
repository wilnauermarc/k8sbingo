import { useEffect, useMemo } from 'react'
import { PartyPopper, X } from 'lucide-react'
import type { BingoLine } from '../types/challenge'

interface BingoCelebrationProps {
  lines: BingoLine[]
  onDismiss: () => void
}

function lineLabel(line: BingoLine): string {
  if (line.type === 'row') return `Row ${line.index + 1}`
  if (line.type === 'column') return `Column ${line.index + 1}`
  return line.index === 0 ? 'Main diagonal' : 'Anti-diagonal'
}

export function BingoCelebration({ lines, onDismiss }: BingoCelebrationProps) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: `${(i * 17 + 7) % 100}%`,
        delay: `${(i % 8) * 0.08}s`,
        color: ['#326CE5', '#5B8DEF', '#34D399', '#93C5FD', '#FBBF24'][i % 5],
        size: 6 + (i % 4) * 2,
      })),
    [],
  )

  useEffect(() => {
    if (lines.length === 0) return
    const timer = window.setTimeout(onDismiss, 4500)
    return () => window.clearTimeout(timer)
  }, [lines, onDismiss])

  if (lines.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="animate-confetti absolute top-0 rounded-sm"
          style={{
            left: piece.left,
            width: piece.size,
            height: piece.size * 1.4,
            backgroundColor: piece.color,
            animationDelay: piece.delay,
          }}
        />
      ))}

      <div className="pointer-events-auto absolute inset-x-0 top-6 flex justify-center px-4">
        <div className="animate-bingo-pop flex max-w-md items-start gap-3 rounded-2xl border border-k8s/40 bg-surface-raised/95 px-4 py-3 shadow-xl backdrop-blur">
          <div className="mt-0.5 rounded-lg bg-k8s/20 p-2 text-k8s-bright">
            <PartyPopper className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-base font-semibold text-ink">
              Bingo!
            </p>
            <p className="mt-0.5 text-sm text-ink-muted">
              Completed {lines.map(lineLabel).join(', ')}. Keep going — blackout
              is the ultimate win.
            </p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg p-1 text-ink-muted hover:bg-surface-overlay hover:text-ink"
            aria-label="Dismiss celebration"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
