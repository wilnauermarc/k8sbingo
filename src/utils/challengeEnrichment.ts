import type {
  Category,
  Challenge,
  ChallengeChecklist,
  Difficulty,
  EnrichedChallenge,
} from '../types/challenge'

const DIFFICULTY_MINUTES: Record<Difficulty, number> = {
  beginner: 5,
  intermediate: 10,
  advanced: 15,
}

const CATEGORY_WHY: Record<Category, string> = {
  Pods:
    'Pods are the smallest deployable unit — almost everything else schedules or manages Pods.',
  Deployments:
    'Deployments keep a desired replica count and roll out changes safely in real clusters.',
  Services:
    'Services give stable networking to changing Pod IPs — without them, clients chase moving targets.',
  'ConfigMaps and Secrets':
    'Config and credentials should stay out of images so you can change environments without rebuilding.',
  'Jobs and CronJobs':
    'Batch and scheduled work needs run-to-completion semantics that Deployments do not provide.',
  Troubleshooting:
    'Most production time is spent diagnosing failures — describe, logs, and events are your first tools.',
  Networking:
    'DNS, policies, and Ingress decide whether traffic reaches the right Pods securely.',
  Storage:
    'Stateful data needs volumes that survive Pod restarts — emptyDir alone is not enough.',
  Scaling:
    'Matching capacity to demand (manually or automatically) keeps apps responsive and costs sane.',
  Security:
    'Least privilege, non-root, and RBAC reduce blast radius when something goes wrong.',
}

const CATEGORY_CHECKLISTS: Record<Category, ChallengeChecklist> = {
  Pods: {
    before: [
      'Write down the Pod name, image, and namespace you will use.',
      'Decide what “success” looks like (usually Running + Ready).',
      'If you use YAML: skim apiVersion, kind, metadata, spec once before apply.',
    ],
    during: [
      'Create the Pod, then immediately run get + describe — do not wait for “maybe it works”.',
      'If it is not Ready, read Events from the bottom of describe first.',
      'Only then check logs (`kubectl logs`) if the container started.',
    ],
    after: [
      '`kubectl get pod <name> -o wide` — phase and node look right?',
      '`kubectl describe pod <name>` — any Warning/Failed events?',
      'Can you explain the Pod’s status in one sentence?',
    ],
    reflect:
      'If this Pod stayed Pending, which three places would you check first (Events, resources, selectors/taints)?',
  },
  Deployments: {
    before: [
      'Note desired replicas and the app label you will select on.',
      'Know whether this is a create, scale, or rollout/undo task.',
      'Picture READY = desired before you change anything.',
    ],
    during: [
      'After each change, watch `kubectl get deploy` and `kubectl get pods -l …`.',
      'For image changes: use `kubectl rollout status` instead of guessing.',
      'If Pods misbehave, describe the Deployment and the newest Pod.',
    ],
    after: [
      '`kubectl get deploy <name>` — READY matches your target?',
      '`kubectl rollout status deployment/<name>` succeeds?',
      'ReplicaSet/Pods for the label selector look healthy?',
    ],
    reflect:
      'What is the difference between scaling replicas and rolling out a new image?',
  },
  Services: {
    before: [
      'Write the selector labels the Service must match.',
      'Decide type (ClusterIP/NodePort/LoadBalancer) and port → targetPort.',
      'Confirm a backend Pod/Deployment already exists (or create it first).',
    ],
    during: [
      'Create/expose the Service, then check Endpoints immediately.',
      'If Endpoints are empty, fix labels — do not debug DNS yet.',
      'Test with port-forward or a curl/wget Pod only after Endpoints exist.',
    ],
    after: [
      '`kubectl get svc <name>` — type/ports correct?',
      '`kubectl get endpoints <name>` (or EndpointSlices) — backend IPs present?',
      'Traffic test from another Pod or port-forward returns the expected response?',
    ],
    reflect:
      'Why can a Service exist and still send traffic nowhere?',
  },
  'ConfigMaps and Secrets': {
    before: [
      'Decide keys/values and whether consumers need env vars, files, or both.',
      'For Secrets: use throwaway lab values only.',
      'Know the mount path or env var names you will verify.',
    ],
    during: [
      'Create the ConfigMap/Secret first, then wire the Pod/Deployment.',
      'After mounting, exec in and `ls`/`cat`/`printenv` — do not assume.',
      'Remember: changing a ConfigMap does not always reload existing env vars.',
    ],
    after: [
      '`kubectl get` / `describe` shows the object and expected keys?',
      'Pod can read the value (file or env) as intended?',
      'Secret vs ConfigMap: do you see base64 in the Secret YAML?',
    ],
    reflect:
      'When would you mount as a file instead of injecting env vars?',
  },
  'Jobs and CronJobs': {
    before: [
      'Define success: completions count, a log line, or a scheduled Job appearing.',
      'Choose restartPolicy (Never / OnFailure) intentionally.',
      'For CronJobs: know the schedule and whether you will trigger manually.',
    ],
    during: [
      'Watch Jobs and Pods (`kubectl get jobs,pods`).',
      'If a Job fails, describe the Job and read the failed Pod logs.',
      'Clean up finished Jobs when you are done experimenting.',
    ],
    after: [
      'Job shows Completions / Successful as expected?',
      'CronJob created a Job (or manual `--from=cronjob/...` worked)?',
      'Logs show the command output you expected?',
    ],
    reflect:
      'Why is a Deployment a bad fit for a one-shot batch task?',
  },
  Troubleshooting: {
    before: [
      'Name the symptom you expect (Pending, CrashLoopBackOff, ImagePullBackOff, …).',
      'Pick your first three tools: get, describe, logs/events.',
      'Decide what “root cause found” means — not just “Pod looks sad”.',
    ],
    during: [
      'Start with `kubectl get` + `describe` Events before changing YAML randomly.',
      'Use `kubectl logs` / `--previous` when containers restart.',
      'Write one sentence: observation → likely cause → next check.',
    ],
    after: [
      'You can name the root cause (not only the status string)?',
      'The evidence is in Events, logs, or describe output you can point to?',
      'You know one fix you would try next in a real incident?',
    ],
    reflect:
      'What is the danger of restarting/deleting before you capture describe + logs?',
  },
  Networking: {
    before: [
      'Draw the path: client → Service/DNS/Ingress → Pod.',
      'Know which namespace the client and target live in.',
      'Decide the proof: nslookup, wget/curl, or policy effect.',
    ],
    during: [
      'Verify Service Endpoints before blaming DNS.',
      'Test short name vs FQDN if DNS fails.',
      'For NetworkPolicy: confirm your CNI supports policies.',
    ],
    after: [
      'DNS lookup returns the expected ClusterIP/Pod IPs?',
      'HTTP/TCP check from a debug Pod succeeds (or fails on purpose for a deny policy)?',
      'Ingress/NetworkPolicy object shows the rules you intended?',
    ],
    reflect:
      'If DNS works but HTTP fails, what do you check next?',
  },
  Storage: {
    before: [
      'Decide volume type (emptyDir, PVC, …) and mount path.',
      'For PVC: confirm a default StorageClass exists in your lab cluster.',
      'Know whether data must survive deleting the Pod.',
    ],
    during: [
      'Create PVC first if needed; wait until Bound before expecting mounts.',
      'Write a test file, then prove you can read it.',
      'Recreate the Pod when testing persistence — one Pod is not enough proof.',
    ],
    after: [
      'PVC is Bound (if used)?',
      'Mount path contains your test data?',
      'After Pod recreate (same claim), data still there when required?',
    ],
    reflect:
      'What happens to emptyDir data when the Pod is deleted — and why?',
  },
  Scaling: {
    before: [
      'Write the target replica count or HPA min/max/metric.',
      'For CPU HPA: ensure the container has a CPU request.',
      'Know what you will watch: Pods, deploy, or HPA conditions.',
    ],
    during: [
      'Apply the scale/HPA change, then watch Pods with `-w` briefly.',
      'If HPA does not move, describe it and check metrics-server.',
      'Prefer scaling the Deployment/StatefulSet, not editing ReplicaSets by hand.',
    ],
    after: [
      'Pod count matches the scale action?',
      'HPA (if used) shows sane targets/conditions?',
      'PDB (if used) selects the intended Pods?',
    ],
    reflect:
      'Why does CPU-based autoscaling need resource requests?',
  },
  Security: {
    before: [
      'Name the control you are practicing (SA, RBAC, securityContext, PSS, …).',
      'Decide how you will prove it (`auth can-i`, id, missing token path, …).',
      'Use a lab namespace when trying denials or privileged Pods.',
    ],
    during: [
      'Apply the constraint, then verify with a positive or negative check.',
      'For RBAC: test with `--as=system:serviceaccount:…`.',
      'Read the error/events carefully — denials are teaching signals.',
    ],
    after: [
      'The security field or binding is present in the live object?',
      'Verification command matches the intended allow/deny?',
      'You can say what attack/mistake this control reduces?',
    ],
    reflect:
      'What is the smallest privilege this workload actually needs?',
  },
}

type ChecklistOverride = Partial<ChallengeChecklist> & {
  why?: string
  estimatedMinutes?: number
}

/** Optional per-challenge overrides for stronger learning copy. */
const OVERRIDES: Partial<Record<string, ChecklistOverride>> = {
  'pod-nginx': {
    why: 'Creating a Pod by hand builds the mental model every higher-level controller still uses.',
    before: [
      'Plan a Pod named nginx using image nginx:1.27.',
      'Success = Running/Ready, not just “created”.',
    ],
    after: [
      '`kubectl get pod nginx` shows Running.',
      '`kubectl describe pod nginx` has no pull/schedule errors.',
    ],
    reflect: 'What controller would you use instead if you needed 3 copies always running?',
  },
  'deploy-rollout': {
    why: 'Rollouts and undo are how you ship and safely reverse changes in production.',
    before: [
      'Note the current image before you change it.',
      'Plan: set image → rollout status → undo → history.',
    ],
    during: [
      'Watch Pods replace during the rollout; do not skip `rollout status`.',
      'Use `rollout history` before and after undo.',
    ],
    after: [
      'A new revision appears in rollout history.',
      'Undo restores the previous working image.',
    ],
    reflect: 'When would you pause a rollout instead of undoing it?',
  },
  'trouble-crashloop': {
    why: 'CrashLoopBackOff is one of the most common workload failures — reading Events beats guessing.',
    before: [
      'Expect restarts and status CrashLoopBackOff.',
      'Your goal is the exit cause, not deleting the Pod immediately.',
    ],
    during: [
      'describe → Events, then logs / logs --previous.',
      'Write: “container exits because …”.',
    ],
    after: [
      'You can point to the failing command/exit from logs.',
      'You can explain why Kubernetes keeps restarting it.',
    ],
    reflect: 'How is CrashLoopBackOff different from ImagePullBackOff?',
  },
  'svc-clusterip': {
    why: 'ClusterIP is the default Service type for in-cluster traffic — the foundation for Ingress and meshes.',
    before: [
      'Deployment Pods must share labels with the Service selector.',
      'Plan ports: Service port 80 → container port 80.',
    ],
    after: [
      '`kubectl get endpoints <svc>` lists Pod IPs.',
      'port-forward or in-cluster wget reaches nginx.',
    ],
    reflect: 'What changes for clients if Pods are deleted and recreated behind this Service?',
  },
  'cm-mount': {
    why: 'Mounting config as files avoids baking environment-specific files into images.',
    before: [
      'Know which ConfigMap keys become filenames.',
      'Pick a mount path (e.g. /etc/config) to verify.',
    ],
    after: [
      '`kubectl exec … -- ls /etc/config` shows keys as files.',
      '`cat` on a file returns the expected value.',
    ],
    reflect: 'Would an already-running process automatically reload that file? Why/why not?',
  },
}

function mergeChecklist(
  base: ChallengeChecklist,
  override?: Partial<ChallengeChecklist>,
  legacy?: { expect?: string; successCheck?: string },
): ChallengeChecklist {
  const before = [
    ...(override?.before ?? []),
    ...(legacy?.expect ? [legacy.expect] : []),
  ]
  const after = [
    ...(override?.after ?? []),
    ...(legacy?.successCheck ? [legacy.successCheck] : []),
  ]

  return {
    before: before.length > 0 ? before : base.before,
    during: override?.during?.length ? override.during : base.during,
    after: after.length > 0 ? after : base.after,
    reflect: override?.reflect ?? base.reflect,
  }
}

export function enrichChallenge(challenge: Challenge): EnrichedChallenge {
  const override = OVERRIDES[challenge.id]
  const categoryChecklist = CATEGORY_CHECKLISTS[challenge.category]

  return {
    ...challenge,
    why: override?.why ?? challenge.why ?? CATEGORY_WHY[challenge.category],
    estimatedMinutes:
      override?.estimatedMinutes ??
      challenge.estimatedMinutes ??
      DIFFICULTY_MINUTES[challenge.difficulty],
    checklist: mergeChecklist(
      categoryChecklist,
      {
        ...override,
        ...challenge.checklist,
      },
      {
        expect: challenge.expect,
        successCheck: challenge.successCheck,
      },
    ),
  }
}
