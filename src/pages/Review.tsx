import { useEffect, useRef, useState } from 'react'
import { Page } from '@/components/shell'
import { Kbd, Panel } from '@/components/bits'
import { QueueList } from '@/components/queue-list'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useReviewItems } from '@/lib/selectors'
import type { Group } from '@/data/types'

type F = 'all' | Group | 'batch'

export default function Review() {
  const [filter, setFilter] = useState<F>('all')
  const { open, openBatches } = useReviewItems()
  const ref = useRef<HTMLDivElement>(null)
  const n = (g: Group) => open.filter((p) => p.group === g).length

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement
      if (el.closest('input, textarea, [role=dialog], [role=menu]') || e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key !== 'j' && e.key !== 'k') return
      const rows = [...(ref.current?.querySelectorAll<HTMLElement>('[data-row]') ?? [])]
      if (!rows.length) return
      e.preventDefault()
      const cur = rows.indexOf(document.activeElement as HTMLElement)
      const next = e.key === 'j' ? Math.min(rows.length - 1, cur + 1) : Math.max(0, cur - 1)
      rows[cur === -1 ? 0 : next].focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <Page title="Review">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-[28px] font-semibold tracking-[-0.025em]">Review queue</h2>
          <p className="text-[14px] text-muted-foreground">Only exceptions land here. Everything else is released within your guardrails.</p>
        </div>
        <p className="hidden items-center gap-1.5 text-[13px] text-muted-foreground sm:flex"><Kbd>J</Kbd><Kbd>K</Kbd> move · <Kbd>Enter</Kbd> open</p>
      </div>
      <Tabs value={filter} onValueChange={(v) => setFilter(v as F)} className="mt-5">
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="blocked">Blocked {n('blocked') || ''}</TabsTrigger>
            <TabsTrigger value="batch">Batches {openBatches.length || ''}</TabsTrigger>
            <TabsTrigger value="conflict">Conflicts {n('conflict') || ''}</TabsTrigger>
            <TabsTrigger value="high">High value {n('high') || ''}</TabsTrigger>
            <TabsTrigger value="expired">Expired {n('expired') || ''}</TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
      <Panel className="mt-4 overflow-hidden">
        <div ref={ref}><QueueList filter={filter} /></div>
      </Panel>
    </Page>
  )
}
