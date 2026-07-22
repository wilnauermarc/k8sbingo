import { useEffect, useId, useMemo, useState, type ReactNode } from 'react'
import {
  Check,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  Lightbulb,
  ListChecks,
  MessageCircleQuestion,
  Play,
  ShieldAlert,
  Target,
  Terminal,
  X,
} from 'lucide-react'
import type { ChallengeChecklist, EnrichedChallenge } from '../types/challenge'
import { DifficultyBadge } from './DifficultyBadge'

interface ChallengeModalProps {
  challenge: EnrichedChallenge | null
  completed: boolean
  onClose: () => void
  onToggleComplete: () => void
}

type ChecklistKey = `${keyof ChallengeChecklist}-${number}` | 'reflect'

export function ChallengeModal({
  challenge,
  completed,
  onClose,
  onToggleComplete,
}: ChallengeModalProps) {
  const titleId = useId()
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setShowHint(false)
    setShowSolution(false)
    setChecked({})
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

  const progress = useMemo(() => {
    if (!challenge || challenge.isFree) {
      return { done: 0, total: 0 }
    }
    const { checklist } = challenge
    const keys: ChecklistKey[] = [
      ...checklist.before.map((_, i) => `before-${i}` as const),
      ...checklist.during.map((_, i) => `during-${i}` as const),
      ...checklist.after.map((_, i) => `after-${i}` as const),
      'reflect',
    ]
    const done = keys.filter((key) => checked[key]).length
    return { done, total: keys.length }
  }, [challenge, checked])

  if (!challenge) return null

  const isFree = Boolean(challenge.isFree)
  const { checklist } = challenge

  const toggle = (key: string) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }))
  }

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
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-ink-muted uppercase">
                  <ListChecks className="size-3.5 text-k8s-bright" />
                  Learning checklist
                </p>
                <span className="text-[11px] font-medium text-ink-muted">
                  {progress.done}/{progress.total} checked
                </span>
              </div>

              <div className="space-y-4">
                <ChecklistGroup
                  icon={<Target className="size-3.5" />}
                  title="1. Plan"
                  subtitle="Decide what done looks like before you touch the cluster."
                  items={checklist.before}
                  idPrefix="before"
                  checked={checked}
                  onToggle={toggle}
                />
                <ChecklistGroup
                  icon={<Play className="size-3.5" />}
                  title="2. While you work"
                  subtitle="Stay in a tight get → describe → logs loop."
                  items={checklist.during}
                  idPrefix="during"
                  checked={checked}
                  onToggle={toggle}
                />
                <ChecklistGroup
                  icon={<Check className="size-3.5" />}
                  title="3. Verify"
                  subtitle="Prove it with evidence — not vibes."
                  items={checklist.after}
                  idPrefix="after"
                  checked={checked}
                  onToggle={toggle}
                />
                <div className="rounded-xl border border-border bg-surface/50 px-3 py-3">
                  <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-amber-300 uppercase">
                    <MessageCircleQuestion className="size-3.5" />
                    4. Reflect
                  </p>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={Boolean(checked.reflect)}
                      onChange={() => toggle('reflect')}
                      className="mt-1 size-4 rounded border-border bg-surface accent-k8s"
                    />
                    <span className="text-sm leading-relaxed text-ink">
                      {checklist.reflect}
                    </span>
                  </label>
                </div>
              </div>

              <p className="mt-3 text-xs text-ink-muted">
                Use this as a lab coach. Checks stay on this screen only and are
                not auto-verified against your cluster.
              </p>
            </div>
          )}

          <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-xs leading-relaxed text-amber-100/90">
            <span className="mb-1 inline-flex items-center gap-1.5 font-semibold tracking-wide text-amber-300 uppercase">
              <ShieldAlert className="size-3.5" />
              Lab only
            </span>
            <span className="mt-1 block text-ink-muted">
              Run example commands only on a local lab cluster (kind, k3d,
              Minikube). Never paste them into shared, staging, or production
              contexts. Completion is self-reported — this app cannot access your
              cluster.
            </span>
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
                <div className="mb-3 rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-ink-muted">
                  <strong className="font-semibold text-amber-300">
                    Before you copy:
                  </strong>{' '}
                  confirm your kubecontext is a disposable lab cluster. Some
                  examples intentionally create failing Pods, hostPath mounts, or
                  RBAC bindings for learning.
                </div>
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

function ChecklistGroup({
  icon,
  title,
  subtitle,
  items,
  idPrefix,
  checked,
  onToggle,
}: {
  icon: ReactNode
  title: string
  subtitle: string
  items: string[]
  idPrefix: string
  checked: Record<string, boolean>
  onToggle: (key: string) => void
}) {
  return (
    <div>
      <div className="mb-2">
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-k8s-bright uppercase">
          {icon}
          {title}
        </p>
        <p className="mt-0.5 text-xs text-ink-muted">{subtitle}</p>
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => {
          const key = `${idPrefix}-${index}`
          return (
            <li key={key}>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg px-1 py-0.5 hover:bg-surface/40">
                <input
                  type="checkbox"
                  checked={Boolean(checked[key])}
                  onChange={() => onToggle(key)}
                  className="mt-1 size-4 shrink-0 rounded border-border bg-surface accent-k8s"
                />
                <span className="text-sm leading-relaxed text-ink">{item}</span>
              </label>
            </li>
          )
        })}
      </ul>
    </div>
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
