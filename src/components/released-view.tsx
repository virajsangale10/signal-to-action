import { Link } from 'react-router-dom'
import { ArrowLeft, CircleCheck, Smartphone } from 'lucide-react'
import { toast } from 'sonner'
import { ChannelBadge, Panel, PanelLabel, Pill, type Tone } from '@/components/bits'
import { Button } from '@/components/ui/button'
import { useStore } from '@/store/useStore'
import { editCount } from '@/lib/rules'
import type { Doctor, Plan, QueueStatus } from '@/data/types'

const STATUS: Record<QueueStatus, { label: string; tone: Tone }> = {
  queued: { label: 'Queued', tone: 'accent' },
  sent: { label: 'Sent', tone: 'success' },
  cancelled: { label: 'Cancelled', tone: 'neutral' },
  delivered: { label: 'Delivered to CRM · waiting for rep', tone: 'neutral' },
  held: { label: 'Held · CRM sync down', tone: 'warning' },
  accepted: { label: 'Accepted by rep', tone: 'success' },
  snoozed: { label: 'Snoozed by rep', tone: 'warning' },
  declined: { label: 'Declined by rep', tone: 'neutral' },
  scheduled: { label: 'Scheduled', tone: 'success' },
  stopped: { label: 'Stopped', tone: 'neutral' },
}

export function ReleasedView({ plan, doctor }: { plan: Plan; doctor: Doctor }) {
  const st = useStore.getState()
  const edits = editCount(plan)
  const q = plan.queue ?? []
  const email = q.find((x) => x.channel === 'email')
  const rep = q.find((x) => x.channel === 'rep')
  const allCancelled = q.length > 0 && q.every((x) => x.status === 'cancelled' || x.status === 'stopped')

  return (
    <>
      <Link to="/review" className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline"><ArrowLeft className="size-3.5" />Review queue</Link>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-3">
        <h2 className="text-[30px] font-semibold tracking-[-0.025em]"><Link to={`/doctors/${doctor.id}`} className="hover:underline">{doctor.name}</Link></h2>
        <span className="text-[14px] text-muted-foreground">{doctor.specialty} · {doctor.city} · NPI {doctor.npi}</span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-success/30 bg-success-soft px-4 py-3 text-[14px] text-success-ink" role="status">
        <CircleCheck className="size-4" />
        <span className="flex-1">Released just now by you{edits ? ` · ${edits} change${edits > 1 ? 's' : ''} from the AI plan` : ' · AI plan unchanged'}{allCancelled ? ' · every step since cancelled' : ''}</span>
        <a href="#log" className="font-medium underline-offset-2 hover:underline">View activity log</a>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Panel className="p-5">
          <h3 className="text-[17px] font-semibold">What happens next</h3>
          <ol className="mt-3">
            {q.map((it, i) => {
              const s = STATUS[it.status]
              const cancellable = it.status === 'queued' || it.status === 'scheduled'
              return (
                <li key={it.stepId} className="relative flex gap-4 pb-5 last:pb-0">
                  {i < q.length - 1 && <span className="absolute left-4 top-9 bottom-1 w-px bg-border" aria-hidden />}
                  <ChannelBadge channel={it.channel} />
                  <div className="min-w-0 flex-1 border-b border-border/70 pb-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="text-[15px] font-semibold">{it.title}</div>
                      {cancellable && (
                        <Button size="sm" variant="outline" className="rounded-lg" onClick={() => { st.cancelItem(plan.id, it.stepId); toast(it.status === 'scheduled' ? 'Journal ad stopped.' : 'Email cancelled before sending.') }}>
                          {it.status === 'scheduled' ? 'Stop' : 'Cancel send'}
                        </Button>
                      )}
                    </div>
                    <div className="mt-1.5"><Pill tone={s.tone}>{s.label}</Pill></div>
                    <div className="mt-1.5 text-[13px] text-muted-foreground">{it.contentId} · {it.detail}</div>
                    {it.channel === 'rep' && (it.status === 'delivered' || it.status === 'held') && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" asChild className="rounded-lg"><Link to={`/rep?plan=${plan.id}`}><Smartphone className="size-3.5" />Open the rep's view</Link></Button>
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
          <p className="mt-4 text-[13px] text-muted-foreground">Sent items can't be undone. Queued items can be cancelled until their send time.</p>
        </Panel>

        <div className="space-y-4">
          <Panel className="p-4">
            <PanelLabel>Outcome so far</PanelLabel>
            <dl className="mt-2 text-[14px]">
              <div className="flex justify-between border-b border-border/70 py-2.5"><dt>Email</dt><dd className="text-muted-foreground">{!email ? 'Not in plan' : email.status === 'cancelled' ? 'Cancelled' : 'Not sent yet'}</dd></div>
              <div className="flex justify-between border-b border-border/70 py-2.5"><dt>Rep</dt><dd className="text-muted-foreground">{!rep ? 'Not in plan' : plan.repResponse ? `${plan.repResponse.status[0].toUpperCase()}${plan.repResponse.status.slice(1)}${plan.repResponse.reason ? ` · ${plan.repResponse.reason}` : ''}` : rep.status === 'held' ? 'Held' : 'No response yet'}</dd></div>
              <div className="py-2.5"><dt>Lift</dt><dd className="text-[13px] text-muted-foreground">Measured after 8 weeks against matched doctors, at segment level, not per doctor.</dd></div>
            </dl>
          </Panel>
          <Panel className="p-4" id="log">
            <PanelLabel>Activity log</PanelLabel>
            <ul className="mt-2">
              {plan.log.map((l, i) => <li key={i} className="flex justify-between gap-3 border-b border-border/70 py-2.5 text-[14px] last:border-0"><span>{l.text}</span><span className="shrink-0 text-[13px] text-muted-foreground tabular">{l.at}</span></li>)}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  )
}
