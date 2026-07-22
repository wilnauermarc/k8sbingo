import type {
  Category,
  Challenge,
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

const CATEGORY_EXPECT: Record<Category, string> = {
  Pods: 'Before you start: which Pod name/image will exist, and how will Ready look?',
  Deployments:
    'Before you start: how many replicas should be Ready, and what labels must match?',
  Services:
    'Before you start: which Pod selector must the Service match, and which ports?',
  'ConfigMaps and Secrets':
    'Before you start: will values appear as files, env vars, or both?',
  'Jobs and CronJobs':
    'Before you start: what does “success” mean — completions, schedule, or a log line?',
  Troubleshooting:
    'Before you start: what symptom do you expect (Pending, CrashLoop, ImagePull), and where will you look first?',
  Networking:
    'Before you start: from where to where should traffic flow, and how will you prove it?',
  Storage:
    'Before you start: what path is mounted, and should data survive a Pod delete?',
  Scaling:
    'Before you start: what replica count or autoscaling signal are you aiming for?',
  Security:
    'Before you start: which identity or constraint should the workload run under?',
}

const CATEGORY_SUCCESS: Record<Category, string> = {
  Pods: 'Afterwards: `kubectl get pod` / `describe` shows the expected phase and events.',
  Deployments:
    'Afterwards: READY replicas match your target and `rollout status` succeeds.',
  Services:
    'Afterwards: the Service has Endpoints (or EndpointSlices) pointing at healthy Pods.',
  'ConfigMaps and Secrets':
    'Afterwards: `kubectl get` shows the object, and the Pod can read the expected value.',
  'Jobs and CronJobs':
    'Afterwards: Job Completions increase (or CronJob creates Jobs) without unexpected failures.',
  Troubleshooting:
    'Afterwards: you can name the root cause from Events/logs — not just the symptom label.',
  Networking:
    'Afterwards: DNS resolves and/or an HTTP/TCP check from another Pod succeeds as expected.',
  Storage:
    'Afterwards: the mount path contains your test data (and PVC is Bound if used).',
  Scaling:
    'Afterwards: Pod count or HPA status matches the change you made.',
  Security:
    'Afterwards: `auth can-i`, `jsonpath` on securityContext, or describe confirms the constraint.',
}

/** Optional per-challenge overrides for stronger learning copy. */
const OVERRIDES: Partial<
  Record<
    string,
    Partial<
      Pick<EnrichedChallenge, 'why' | 'estimatedMinutes' | 'expect' | 'successCheck'>
    >
  >
> = {
  'pod-nginx': {
    why: 'Creating a Pod by hand builds the mental model every higher-level controller still uses.',
    expect: 'Before you start: a Pod named nginx should become Running with the nginx image.',
    successCheck: 'Afterwards: `kubectl get pod nginx` shows Running/Ready.',
  },
  'deploy-rollout': {
    why: 'Rollouts and undo are how you ship and safely reverse changes in production.',
    expect: 'Before you start: note the current image, then change it and watch Pods replace.',
    successCheck: 'Afterwards: `rollout history` shows a new revision; undo restores the previous one.',
  },
  'trouble-crashloop': {
    why: 'CrashLoopBackOff is one of the most common workload failures — reading Events beats guessing.',
    expect: 'Before you start: expect restarts and a CrashLoopBackOff status.',
    successCheck: 'Afterwards: logs/describe explain the exit — you can state the cause in one sentence.',
  },
  'svc-clusterip': {
    why: 'ClusterIP is the default Service type for in-cluster traffic — the foundation for Ingress and meshes.',
    expect: 'Before you start: Pods labeled for the Service should become Endpoints.',
    successCheck: 'Afterwards: `kubectl get endpoints` (or EndpointSlices) lists Pod IPs.',
  },
  'cm-mount': {
    why: 'Mounting config as files avoids baking environment-specific files into images.',
    expect: 'Before you start: which keys become filenames under the mount path?',
    successCheck: 'Afterwards: `kubectl exec … -- ls` / `cat` shows the ConfigMap keys as files.',
  },
}

export function enrichChallenge(challenge: Challenge): EnrichedChallenge {
  const override = OVERRIDES[challenge.id]
  return {
    ...challenge,
    why:
      override?.why ??
      challenge.why ??
      CATEGORY_WHY[challenge.category],
    estimatedMinutes:
      override?.estimatedMinutes ??
      challenge.estimatedMinutes ??
      DIFFICULTY_MINUTES[challenge.difficulty],
    expect:
      override?.expect ??
      challenge.expect ??
      CATEGORY_EXPECT[challenge.category],
    successCheck:
      override?.successCheck ??
      challenge.successCheck ??
      CATEGORY_SUCCESS[challenge.category],
  }
}
