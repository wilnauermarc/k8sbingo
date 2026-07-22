import type { Category, LearningPath, LearningPathId } from '../types/challenge'

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'mixed',
    label: 'Mixed board',
    description: 'Random mix across all topics — classic bingo.',
    categories: null,
  },
  {
    id: 'workloads',
    label: 'Pods & Deployments',
    description: 'Run workloads, rollouts, probes, and labels.',
    categories: ['Pods', 'Deployments'],
  },
  {
    id: 'config',
    label: 'Config & Secrets',
    description: 'ConfigMaps, Secrets, mounts, and env injection.',
    categories: ['ConfigMaps and Secrets'],
  },
  {
    id: 'networking',
    label: 'Services & Networking',
    description: 'Services, DNS, Ingress, and NetworkPolicies.',
    categories: ['Services', 'Networking'],
  },
  {
    id: 'troubleshooting',
    label: 'Troubleshooting week',
    description: 'CrashLoop, ImagePull, Pending, logs, and events.',
    categories: ['Troubleshooting'],
  },
  {
    id: 'storage-scaling',
    label: 'Storage & Scaling',
    description: 'Volumes, PVCs, HPA, and disruption budgets.',
    categories: ['Storage', 'Scaling'],
  },
  {
    id: 'security',
    label: 'Security basics',
    description: 'ServiceAccounts, RBAC, and hardening contexts.',
    categories: ['Security'],
  },
  {
    id: 'batch',
    label: 'Jobs & CronJobs',
    description: 'One-shot Jobs, schedules, retries, and cleanup.',
    categories: ['Jobs and CronJobs'],
  },
]

export function getLearningPath(id: LearningPathId): LearningPath {
  return LEARNING_PATHS.find((path) => path.id === id) ?? LEARNING_PATHS[0]
}

export function categoriesForPath(id: LearningPathId): Category[] | null {
  return getLearningPath(id).categories
}
