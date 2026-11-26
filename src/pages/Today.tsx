import { Link, useNavigate } from 'react-router-dom'
import { ArrowDown, Clock, Mail, Monitor, UserRound } from 'lucide-react'
import { Page } from '@/components/shell'
import { Kbd, Panel, Stat } from '@/components/bits'
import { QueueList } from '@/components/queue-list'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { AUTO_RELEASED, COLLEAGUES, CURRENT_USER } from '@/data/seed'
import { useReviewCount, useReviewItems } from '@/lib/selectors'
import { hoursLeft } from '@/lib/rules'
import { useStore } from '@/store/useStore'
import { toast } from 'sonner'

const ICON = { email: Mail, ad: Monitor, rep: UserRound } as const

export default function Today() {
  const count = useReviewCount()
  const { open } = useReviewItems()
  const navigate = useNavigate()
  const released = useStore((s) => s.plans.filter((p) => p.status === 'released').length)
  const batchReleased = useStore((s) => s.batches.filter((b) => b.status === 'released').reduce((a, b) => a + (b.released?.length ?? 0), 0))
  const expiring = open.filter((p) => hoursLeft(p) > 0 && hoursLeft(p) <= 6)
  const unowned = open.filter((p) => hoursLeft(p) > 0 && hoursLeft(p) <= 14 && !p.assignedTo)
  const autoToday = 46 + released + batchReleased

  return (
    <Page title="Today">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-[32px] font-semibold leading-tight tracking-[-0.025em]">Good morning, {CURRENT_USER.first}</h2>
          <p className="mt-1 text-[15px] text-muted-foreground">
            {count ? `${count} ${count === 1 ? 'decision needs' : 'decisions need'} you.` : 'Nothing needs you right now.'}{expiring.length ? ` ${expiring.length} expire${expiring.length === 1 ? 's' : ''} in the next 6 hours.` : ''} {autoToday} plans went out automatically.
          </p>
        </div>
        <Button size="lg" className="rounded-[10px]" onClick={() => navigate('/review')}>Start review · {count}<Kbd inverted>G</Kbd><Kbd inverted>R</Kbd></Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Needs your decision" value={count} foot={expiring.length ? <><Clock className="size-3.5" />{expiring.length} expire within 6h</> : 'None expiring soon'} footTone={expiring.length ? 'warning' : 'muted'} />
        <Stat label="Released automatically today" value={autoToday} foot="61 digital steps · 12 rep suggestions" />
        <Stat label="Median time to decide" value="2m 10s" foot={<><ArrowDown className="size-3.5" />35s faster than last week</>} footTone="success" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Panel className="overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4"><h3 className="text-[17px] font-semibold">Needs your decision</h3><Link to="/review" className="text-[13px] font-medium text-primary hover:underline">Open queue</Link></div>
          <QueueList />
        </Panel>

        <div className="space-y-4">
          <Panel>
            <h3 className="px-5 pt-4 text-[17px] font-semibold">Since yesterday</h3>
            <div className="px-5 pb-2 pt-3">
              <div className="text-[13px] text-muted-foreground">Released automatically</div>
              <ul className="mt-2">
                {AUTO_RELEASED.map((a) => (
                  <li key={a.name} className="flex items-center justify-between border-b border-border/70 py-2.5 text-[14px] last:border-0">
                    <span>{a.name}</span>
                    <span className="flex items-center gap-2 text-muted-foreground">
                      {a.channels.map((c) => { const I = ICON[c]; return <I key={c} className="size-4" strokeWidth={1.6} aria-label={c} /> })}
                      <span className="w-[62px] text-right text-[13px] tabular">{a.at}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <Link to="/results" className="mt-1 inline-block text-[13px] font-medium text-primary hover:underline">See all {autoToday}</Link>
            </div>
            <div className="border-t border-border px-5 py-4">
              <div className="text-[13px] text-muted-foreground">Rep responses</div>
              <div className="mt-1 text-[14px]">9 accepted · 2 snoozed · 1 declined</div>
              <div className="text-[13px] text-muted-foreground">Declined: “Doctor on leave until Dec 12”</div>
            </div>
            <div className="border-t border-border px-5 py-4">
              <div className="text-[13px] text-muted-foreground">Expiring soon</div>
              <div className="mt-1 text-[14px]">{unowned.length ? `${unowned.length} signal${unowned.length === 1 ? ' has' : 's have'} no owner` : 'Every expiring signal has an owner'}</div>
              {unowned.length > 0 && (
                <Popover>
                  <PopoverTrigger className="mt-1 text-[13px] font-medium text-primary hover:underline">Assign to a colleague</PopoverTrigger>
                  <PopoverContent align="start" className="w-64 p-1">
                    {COLLEAGUES.map((c) => (
                      <button key={c} className="w-full rounded-md px-3 py-2 text-left text-[13px] hover:bg-hover"
                        onClick={() => { unowned.forEach((p) => useStore.getState().assign(p.id, c)); toast(`${unowned.length} signal${unowned.length === 1 ? '' : 's'} assigned to ${c}.`) }}>{c}</button>
                    ))}
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </Panel>
          <p className="px-1 text-xs text-muted-foreground">Concept prototype · fictional data</p>
        </div>
      </div>
    </Page>
  )
}
