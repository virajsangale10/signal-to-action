import { useMemo } from 'react'
import { useStore } from '@/store/useStore'
import type { Group, Plan } from '@/data/types'

export const GROUP_LABEL: Record<Group, string> = {
  blocked: 'Blocked by a rule',
  conflict: 'Conflicts',
  high: 'High value',
  expired: 'Expired',
}
export const GROUP_ORDER: Group[] = ['blocked', 'conflict', 'high', 'expired']

/** Plans still waiting for a human, plus open batches. */
export function useReviewItems() {
  const plans = useStore((s) => s.plans)
  const batches = useStore((s) => s.batches)
  const empty = useStore((s) => s.emptyQueue)
  return useMemo(() => {
    const open: Plan[] = empty ? [] : plans.filter((p) => p.status === 'review')
    const openBatches = empty ? [] : batches.filter((b) => b.status === 'review')
    return { open, openBatches }
  }, [plans, batches, empty])
}

export function useReviewCount() {
  const { open, openBatches } = useReviewItems()
  return open.filter((p) => p.group !== 'expired').length + openBatches.length
}
