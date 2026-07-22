import { Boxes, Cloud } from 'lucide-react'

export function Header() {
  return (
    <header className="space-y-4">
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-raised/80 px-3 py-1 text-xs font-medium text-ink-muted">
        <Cloud className="size-3.5 text-k8s-bright" />
        Hands-on learning · local cluster
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-k8s/20 text-k8s-bright ring-1 ring-k8s/30">
              <Boxes className="size-6" />
            </span>
            <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              KubernetesBingo
            </h1>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">
            Practice real kubectl skills on a 5×5 bingo board. Complete challenges
            in your own cluster (kind, k3d, or Minikube), mark fields done, and
            chase bingo lines.
          </p>
        </div>
      </div>
    </header>
  )
}
