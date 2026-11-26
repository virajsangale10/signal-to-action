import { Link } from 'react-router-dom'
import { ChevronRight, Inbox } from 'lucide-react'
import { Pill, TimeLeft, type Tone } from '@/components/bits'
import { GROUP_LABEL, GROUP_ORDER, useReviewItems } from '@/lib/selectors'
import { hoursLeft } from '@/lib/rules'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'
import type { Group } from '@/data/types'
import { Button } from '@/components/ui/button'

const TAG: Record<Group, { tone: Tone; label: string }> = {
  blocked: { tone: 'danger', label: 'Blocked' },
  conflict: { tone: 'warning', label: 'Conflict' },
  high: { tone: 'accent', label: 'High value' },
  expired: { tone: 'neutral', label: 'Expired' },
}

export function QueueEmpty() {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-success-soft text-success-ink"><Inbox className="size-5" strokeWidth={1.7} /></span>
      <h3 className="mt-4 text-lg font-semibold">You're caught up</h3>
      <p className="mt-1 max-w-sm text-[14px] text-muted-foreground">46 plans went out automatically today within your guardrails.</p>
      <div className="mt-5 flex gap-2">
        <Button variant="outline" asChild><Link to="/results">See what went out</Link></Button>
        <Button variant="outline" asChild><Link to="/guardrails">Review guardrails</Link></Button>
      </div>
    </div>
  )
}

/** The grouped "needs your decision" list used on Today and Review. */
export function QueueList({ filter = 'all' }: { filter?: 'all' | Group | 'batch' }) {
  const { open, openBatches } = useReviewItems()
  const doctors = useStore((s) => s.doctors)
  if (!open.length && !openBatches.length) return <QueueEmpty />

  const groups = GROUP_ORDER.filter((g) => filter === 'all' || filter === g)
  const sections: React.ReactNode[] = []

  const groupBlock = (g: Group) => {
    const items = open.filter((p) => p.group === g).sort((a, b) => hoursLeft(a) - hoursLeft(b))
    if (!items.length) return null
    return (
      <div key={g} role="group" aria-label={GROUP_LABEL[g]}>
        <div className="border-y border-border bg-muted/70 px-5 py-2 text-[12.5px] font-medium text-muted-foreground">{GROUP_LABEL[g]} · {items.length}</div>
        {items.map((p) => {
          const d = doctors.find((x) => x.id === p.doctorId)!
          return (
            <Link key={p.id} to={`/plans/${p.id}`} data-row
              className={cn('flex items-center gap-4 border-b border-border/70 px-5 py-3 outline-none transition-colors last:border-b-0 hover:bg-hover focus-visible:bg-accent')}>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2"><span className="font-medium">{d.name}</span><span className="text-[13px] text-muted-foreground">{d.specialty} · {d.city.split(',')[0]}</span></div>
                <div className="truncate text-[13px] text-muted-foreground">{p.reasonLine}{p.assignedTo ? ` · assigned to ${p.assignedTo}` : ''}</div>
              </div>
              <Pill tone={TAG[g].tone} className="hidden sm:inline-flex">{TAG[g].label}</Pill>
              <TimeLeft hours={hoursLeft(p)} />
              <ChevronRight className="size-4 text-tertiary" aria-hidden />
            </Link>
          )
        })}
      </div>
    )
  }

  const batchBlock = () => {
    if (!openBatches.length) return null
    return (
      <div key="batch" role="group" aria-label="Approve together">
        <div className="border-y border-border bg-muted/70 px-5 py-2 text-[12.5px] font-medium text-muted-foreground">Approve together · {openBatches.length} batch</div>
        {openBatches.map((b) => {
          return (
            <Link key={b.id} to={`/review/batch/${b.id}`} data-row
              className={cn('flex items-center gap-4 border-b border-border/70 px-5 py-3 outline-none transition-colors last:border-b-0 hover:bg-hover focus-visible:bg-accent')}>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2"><span className="font-medium">{b.title}</span><span className="text-[13px] text-muted-foreground">Same 2-step plan</span></div>
                <div className="text-[13px] text-muted-foreground">1 outlier flagged for review</div>
              </div>
              <Pill tone="accent" className="hidden sm:inline-flex">Batch</Pill>
              <TimeLeft hours={Math.min(...b.doctors.map((d) => d.hoursLeft))} />
              <ChevronRight className="size-4 text-tertiary" aria-hidden />
            </Link>
          )
        })}
      </div>
    )
  }

  for (const g of groups) {
    sections.push(groupBlock(g))
    if (g === 'blocked' && (filter === 'all' || filter === 'batch')) sections.push(batchBlock())
  }
  if (filter === 'batch') return <div>{batchBlock()}</div>
  const out = sections.filter(Boolean)
  return out.length ? <div>{out}</div> : <p className="px-5 py-10 text-center text-[14px] text-muted-foreground">Nothing in this group right now.</p>
}
