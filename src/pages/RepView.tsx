import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CalendarDays, Check, ChevronDown, Home, MoreHorizontal, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Page } from '@/components/shell'
import { Button } from '@/components/ui/button'
import { usePlan, useDoctor, useStore } from '@/store/useStore'
import { included } from '@/lib/rules'
import { cn } from '@/lib/utils'

const DECLINE = ['Doctor on leave', 'Already discussed', 'Not a fit', 'Other']

/** The sales rep's side: a suggestion card inside a generic mobile CRM (no real CRM branding). */
export default function RepView() {
  const [params] = useSearchParams()
  const plan = usePlan(params.get('plan') ?? 'wagle-lab')
  const doctor = useDoctor(plan?.doctorId)
  const [declining, setDeclining] = useState(false)
  if (!plan || !doctor) return <Page title="Rep's CRM view"><p>Plan not found.</p></Page>
  const released = plan.status === 'released'
  const rep = included(plan).find((s) => s.channel === 'rep')
  const digital = included(plan).filter((s) => s.channel !== 'rep')
  const resp = plan.repResponse
  const respond = (status: 'accepted' | 'snoozed' | 'declined', reason?: string) => {
    useStore.getState().repRespond(plan.id, status, reason); setDeclining(false)
    toast(`Rep ${status}. The marketer sees this on the plan.`)
  }

  return (
    <Page title="Rep's CRM view">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="max-w-md">
          <h2 className="text-[28px] font-semibold tracking-[-0.025em]">What the rep sees</h2>
          <p className="mt-2 text-[15px] text-muted-foreground">Field steps aren't orders. They arrive as suggestions in the rep's CRM, sized to their weekly capacity, and the rep decides. Their answer flows back to the plan.</p>
          <ul className="mt-4 space-y-2 text-[14px]">
            <li className="flex gap-2"><Check className="mt-0.5 size-4 text-success" />The reason is safe to say out loud: no patient or lab data.</li>
            <li className="flex gap-2"><Check className="mt-0.5 size-4 text-success" />The rep knows what marketing will send, so they don't double up.</li>
            <li className="flex gap-2"><Check className="mt-0.5 size-4 text-success" />Decline reasons go back to the data science team.</li>
          </ul>
          {!released && <p className="mt-5 rounded-xl bg-warning-soft px-4 py-3 text-[14px] text-warning-ink">This plan hasn't been released, so nothing has reached the rep yet. This is a preview. <Link className="font-medium underline" to={`/plans/${plan.id}`}>Open the plan</Link></p>}
          {released && <Button asChild variant="outline" className="mt-5"><Link to={`/plans/${plan.id}`}>Back to the plan</Link></Button>}
        </div>

        <div className="mx-auto w-[360px] max-w-full rounded-[44px] border-[10px] border-foreground/90 bg-background shadow-xl" aria-label="Phone preview">
          <div className="flex h-[700px] flex-col overflow-hidden rounded-[34px]">
            <div className="flex justify-between px-6 pt-3 text-[12px] font-semibold"><span>9:41</span><span>5G</span></div>
            <div className="px-5 pb-3 pt-4">
              <div className="text-[28px] font-bold tracking-[-0.02em]">Suggestions</div>
              <div className="text-[13px] text-muted-foreground">{doctor.rep.name} · {doctor.rep.load + (released ? 1 : 0)} of {doctor.rep.cap} this week</div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-4">
              <div className="rounded-2xl bg-card p-4 shadow-sm">
                <div className="text-[13px] text-muted-foreground">{doctor.name} · {doctor.specialty} · {doctor.city.split(',')[0]}</div>
                <div className="mt-1 text-[19px] font-semibold leading-snug">Discuss the titration guide</div>
                <div className="mt-2 rounded-xl bg-muted px-3 py-2 text-[13.5px]">Recent interest in heart-failure dosing in your territory</div>
                <dl className="mt-3 space-y-1.5 text-[13.5px]">
                  <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Last visit</dt><dd>10 days ago</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Marketing will send</dt><dd className="text-right">{digital.length ? digital.map((s) => s.channel === 'ad' ? 'journal ad' : s.channel).join(', ') : 'nothing this week'}{!doctor.emailConsent && ' (no email: no consent)'}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Talking points</dt><dd className="text-primary">{rep?.contentId ?? 'VEL-REP-092'} · View</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Suggested timing</dt><dd>This week, Tuesday morning</dd></div>
                </dl>
                {resp ? (
                  <div className={cn('mt-4 rounded-xl px-3 py-2.5 text-center text-[14px] font-medium', resp.status === 'accepted' ? 'bg-success-soft text-success-ink' : 'bg-muted text-muted-foreground')}>
                    {resp.status === 'accepted' ? 'Accepted · added to your week' : resp.status === 'snoozed' ? 'Snoozed until Monday' : `Not relevant · ${resp.reason}`}
                  </div>
                ) : declining ? (
                  <div className="mt-4 space-y-2">
                    <div className="text-[13px] text-muted-foreground">Why isn't it relevant?</div>
                    {DECLINE.map((r) => <button key={r} onClick={() => respond('declined', r)} className="block w-full rounded-xl border border-border px-3 py-2.5 text-left text-[14px] hover:bg-hover">{r}</button>)}
                    <button onClick={() => setDeclining(false)} className="w-full py-1 text-[13px] text-muted-foreground">Cancel</button>
                  </div>
                ) : (
                  <div className="mt-4 grid gap-2">
                    <Button className="h-11 rounded-xl text-[15px]" disabled={!released} onClick={() => respond('accepted')}>Accept</Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="secondary" className="h-11 rounded-xl" disabled={!released} onClick={() => respond('snoozed')}>Snooze</Button>
                      <Button variant="secondary" className="h-11 rounded-xl" disabled={!released} onClick={() => setDeclining(true)}>Not relevant</Button>
                    </div>
                  </div>
                )}
              </div>
              {['Dr. K. Bhonsle · follow up on samples', 'Dr. T. Murugan · webinar recap'].map((t) => (
                <div key={t} className="flex items-center justify-between rounded-2xl bg-card px-4 py-3.5 text-[14px] shadow-sm">{t}<ChevronDown className="size-4 text-muted-foreground" /></div>
              ))}
            </div>
            <nav className="grid grid-cols-4 border-t border-border bg-card/90 py-2 text-[10.5px] text-muted-foreground" aria-label="CRM tabs">
              {[[Home, 'Today'], [Users, 'Doctors'], [CalendarDays, 'Calendar'], [MoreHorizontal, 'More']].map(([I, l], i) => { const Icon = I as typeof Home; return <span key={l as string} className={cn('flex flex-col items-center gap-0.5', i === 0 && 'text-primary')}><Icon className="size-5" strokeWidth={1.6} />{l as string}</span> })}
            </nav>
          </div>
        </div>
      </div>
    </Page>
  )
}
