import { useEffect, useId, useState, type ReactNode } from 'react'
import {
  Check,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  Lightbulb,
  ListChecks,
  Terminal,
  X,
} from 'lucide-react'
import type { EnrichedChallenge } from '../types/challenge'
import { DifficultyBadge } from './DifficultyBadge'

interface ChallengeModalProps {
  challenge: EnrichedChallenge | null
  completed: boolean
  onClose: () => void
  onToggleComplete: () => void
}

export function ChallengeModal({
  challenge,
  completed,
  onClose,
  onToggleComplete,
}: ChallengeModalProps) {
  const titleId = useId()
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [checkedExpect, setCheckedExpect] = useState(false)
  const [checkedSuccess, setCheckedSuccess] = useState(false)

  useEffect(() => {
    setShowHint(false)
    setShowSolution(false)
    setCheckedExpect(false)
    setCheckedSuccess(false)
  }, [challenge?.id])

  useEffect(() => {
    if (!challenge) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [challenge, onClose])

  if (!challenge) return null

  const isFree = Boolean(challenge.isFree)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-border bg-surface-raised shadow-2xl animate-bingo-pop sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {!isFree && <DifficultyBadge difficulty={challenge.difficulty} />}
              {!isFree && (
                <span className="inline-flex items-center gap-1 rounded-md bg-surface-overlay px-2 py-0.5 text-[11px] font-medium text-ink-muted ring-1 ring-border">
                  <Clock3 className="size-3" />~{challenge.estimatedMinutes} min
                </span>
              )}
              <span className="rounded-md bg-surface-overlay px-2 py-0.5 text-[11px] font-medium text-ink-muted ring-1 ring-border">
                {isFree ? 'Free space' : challenge.category}
              </span>
              {completed && (
                <span className="inline-flex items-center gap-1 rounded-md bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success ring-1 ring-success/30">
                  <Check className="size-3" strokeWidth={3} />
                  Completed
                </span>
              )}
            </div>
            <h2
              id={titleId}
              className="font-display text-xl font-semibold text-ink sm:text-2xl"
            >
              {challenge.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-ink-muted hover:bg-surface-overlay hover:text-ink"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto px-5 py-4">
          <p className="text-sm leading-relaxed text-ink-muted sm:text-[15px]">
            {challenge.description}
          </p>

          {!isFree && (
            <div className="rounded-xl border border-k8s/25 bg-k8s/10 px-3.5 py-3">
              <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-k8s-bright uppercase">
                <CircleHelp className="size-3.5" />
                Why it matters
              </p>
              <p className="text-sm leading-relaxed text-ink">{challenge.why}</p>
            </div>
          )}

          {!isFree && (
            <div className="rounded-xl border border-border bg-surface-overlay/40 px-3.5 py-3">
              <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-ink-muted uppercase">
                <ListChecks className="size-3.5 text-k8s-bright" />
                Learning checklist
              </p>
              <ul className="space-y-3">
                <ChecklistItem
                  checked={checkedExpect}
                  onChange={setCheckedExpect}
                  label="Before"
                  text={challenge.expect}
                />
                <ChecklistItem
                  checked={checkedSuccess}
                  onChange={setCheckedSuccess}
                  label="After"
                  text={challenge.successCheck}
                />
              </ul>
              <p className="mt-3 text-xs text-ink-muted">
                Checklist is for your thinking — it is not stored and not verified.
              </p>
            </div>
          )}

          <p className="rounded-xl border border-border bg-surface/60 px-3 py-2 text-xs text-ink-muted">
            Completion is self-reported. This app does not verify your cluster.
          </p>

          {!isFree && (
            <>
              <RevealSection
                open={showHint}
                onToggle={() => setShowHint((value) => !value)}
                icon={<Lightbulb className="size-4" />}
                label="Hint"
              >
                <p className="text-sm leading-relaxed text-ink">{challenge.hint}</p>
              </RevealSection>

              <RevealSection
                open={showSolution}
                onToggle={() => setShowSolution((value) => !value)}
                icon={<Terminal className="size-4" />}
                label="Example solution"
              >
                <pre className="overflow-x-auto rounded-xl border border-border bg-surface p-3 text-xs leading-relaxed text-sky-100">
                  <code>{challenge.exampleSolution}</code>
                </pre>
              </RevealSection>
            </>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-border px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-ink hover:bg-surface-overlay"
          >
            Close
          </button>
          {!isFree && (
            <button
              type="button"
              onClick={onToggleComplete}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${
                completed
                  ? 'border border-border bg-surface-overlay text-ink hover:bg-surface'
                  : 'bg-k8s text-white hover:bg-k8s-bright'
              }`}
            >
              {completed ? (
                <Check className="size-4" />
              ) : (
                <ClipboardCheck className="size-4" />
              )}
              {completed ? 'Mark as incomplete' : 'Mark as completed'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function ChecklistItem({
  checked,
  onChange,
  label,
  text,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
  text: string
}) {
  return (
    <li>
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-1 size-4 rounded border-border bg-surface accent-k8s"
        />
        <span>
          <span className="block text-xs font-semibold tracking-wide text-k8s-bright uppercase">
            {label}
          </span>
          <span className="text-sm leading-relaxed text-ink">{text}</span>
        </span>
      </label>
    </li>
  )
}

interface RevealSectionProps {
  open: boolean
  onToggle: () => void
  icon: ReactNode
  label: string
  children: ReactNode
}

function RevealSection({
  open,
  onToggle,
  icon,
  label,
  children,
}: RevealSectionProps) {
  return (
    <div className="rounded-xl border border-border bg-surface-overlay/40">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left text-sm font-medium text-ink hover:bg-surface-overlay"
      >
        <span className="inline-flex items-center gap-2">
          <span className="text-k8s-bright">{icon}</span>
          {open ? `Hide ${label.toLowerCase()}` : `Reveal ${label.toLowerCase()}`}
        </span>
        {open ? (
          <ChevronUp className="size-4 text-ink-muted" />
        ) : (
          <ChevronDown className="size-4 text-ink-muted" />
        )}
      </button>
      {open && <div className="border-t border-border px-3.5 py-3">{children}</div>}
    </div>
  )
}
