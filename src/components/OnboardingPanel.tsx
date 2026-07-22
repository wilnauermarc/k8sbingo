import { ExternalLink, Rocket, Sparkles, Terminal } from 'lucide-react'

interface OnboardingPanelProps {
  onApplyStarter: () => void
}

const LAB_LINKS = [
  {
    name: 'kind',
    href: 'https://kind.sigs.k8s.io/docs/user/quick-start/',
    command: 'kind create cluster',
  },
  {
    name: 'k3d',
    href: 'https://k3d.io/#quick-start',
    command: 'k3d cluster create',
  },
  {
    name: 'Minikube',
    href: 'https://minikube.sigs.k8s.io/docs/start/',
    command: 'minikube start',
  },
] as const

export function OnboardingPanel({ onApplyStarter }: OnboardingPanelProps) {
  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-border bg-surface-raised/80 p-4 sm:p-5">
        <p className="mb-3 text-xs font-semibold tracking-wide text-ink-muted uppercase">
          How it works
        </p>
        <ol className="grid gap-3 sm:grid-cols-3">
          <Step
            number="1"
            title="Start a lab cluster"
            text="Use kind, k3d, or Minikube on your machine. This app never talks to your cluster."
          />
          <Step
            number="2"
            title="Create a board"
            text="Pick a learning path + difficulty, then click New board for 24 challenges + FREE."
          />
          <Step
            number="3"
            title="Complete tiles"
            text="Open a tile, practice with kubectl, mark it done. Finish a line for bingo."
          />
        </ol>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-k8s/30 bg-k8s/10 p-4 sm:p-5">
          <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-k8s-bright uppercase">
            <Sparkles className="size-3.5" />
            New here?
          </p>
          <p className="mb-3 text-sm leading-relaxed text-ink">
            Start with <strong className="font-semibold">Beginner</strong> and
            the path{' '}
            <strong className="font-semibold">Pods &amp; Deployments</strong> —
            ideal as a first learning board.
          </p>
          <button
            type="button"
            onClick={onApplyStarter}
            className="inline-flex items-center gap-2 rounded-xl bg-k8s px-4 py-2.5 text-sm font-semibold text-white hover:bg-k8s-bright"
          >
            <Rocket className="size-4" />
            Use this starter setup
          </button>
          <p className="mt-2 text-xs text-ink-muted">
            Sets path + difficulty, then asks to create a fresh board.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface-raised/80 p-4 sm:p-5">
          <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-ink-muted uppercase">
            <Terminal className="size-3.5 text-k8s-bright" />
            Set up your local lab
          </p>
          <p className="mb-3 text-sm leading-relaxed text-ink-muted">
            Any single-node lab cluster is enough. Quick starts:
          </p>
          <ul className="space-y-2.5">
            {LAB_LINKS.map((lab) => (
              <li
                key={lab.name}
                className="flex flex-col gap-1 rounded-xl border border-border bg-surface/50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <a
                    href={lab.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-k8s-bright hover:underline"
                  >
                    {lab.name}
                    <ExternalLink className="size-3" />
                  </a>
                  <code className="mt-0.5 block truncate font-mono text-xs text-ink-muted">
                    {lab.command}
                  </code>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Step({
  number,
  title,
  text,
}: {
  number: string
  title: string
  text: string
}) {
  return (
    <li className="rounded-xl border border-border bg-surface/40 px-3.5 py-3">
      <p className="mb-1.5 inline-flex items-center gap-2 text-sm font-semibold text-ink">
        <span className="flex size-6 items-center justify-center rounded-lg bg-k8s/20 text-xs font-bold text-k8s-bright">
          {number}
        </span>
        {title}
      </p>
      <p className="text-xs leading-relaxed text-ink-muted sm:text-sm">{text}</p>
    </li>
  )
}
