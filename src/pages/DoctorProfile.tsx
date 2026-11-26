import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Info } from 'lucide-react'
import { Page } from '@/components/shell'
import { Avatar, Meter, Panel, PanelLabel, Pill, Sparkline } from '@/components/bits'
import { useDoctor, useStore } from '@/store/useStore'
import { hoursLeft, checkPlan, blockingCount } from '@/lib/rules'
import { EMAIL_CAP } from '@/data/seed'
import type { Touch } from '@/data/types'
import { cn } from '@/lib/utils'
import NotFound from './NotFound'

const LANES: { key: Touch['lane']; label: string }[] = [
  { key: 'signal', label: 'Signals' }, { key: 'rep', label: 'Rep visits' }, { key: 'email', label: 'Email' }, { key: 'media', label: 'Media' }, { key: 'event', label: 'Events' },
]
const MIN = -60, MAX = 14
const pos = (day: number) => `${((day - MIN) / (MAX - MIN)) * 100}%`

export default function DoctorProfile() {
  const { id } = useParams()
  const doctor = useDoctor(id)
  const allPlans = useStore((s) => s.plans)
  const plans = allPlans.filter((p) => p.doctorId === id)
  const crmDown = useStore((s) => s.crmDown)
  const [sel, setSel] = useState<Touch | null>(null)
  if (!doctor) return <NotFound />
  const shown = sel ?? doctor.touches.filter((t) => !t.planned && t.lane === 'rep').slice(-1)[0] ?? doctor.touches[0]
  const openPlans = plans.filter((p) => p.status === 'review')

  return (
    <Page title="Doctor profile">
      <Link to="/doctors" className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline"><ArrowLeft className="size-3.5" />Doctors</Link>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <Avatar initials={doctor.initials} size="lg" />
        <div>
          <div className="flex flex-wrap items-baseline gap-x-3"><h2 className="text-[30px] font-semibold tracking-[-0.025em]">{doctor.name}</h2><span className="text-[14px] text-muted-foreground">{doctor.specialty} · {doctor.city} · NPI {doctor.npi}</span></div>
          <div className="mt-1.5 flex flex-wrap gap-2">
            <Pill tone={doctor.targetList ? 'accent' : 'neutral'} dot={false}>{doctor.targetList ? `Target list · ${doctor.tier}` : 'Not on target list'}</Pill>
            <Pill tone={doctor.emailConsent ? 'success' : 'danger'}>Email consent: {doctor.emailConsent ? 'yes' : 'no'} (updated {doctor.consentUpdated})</Pill>
            <Pill tone="neutral" dot={false}>Rep: {doctor.rep.name}</Pill>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-6">
          <Panel className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-[17px] font-semibold">Field and digital timeline</h3>
              <div className="flex gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" />Past (solid)</span><span className="flex items-center gap-1.5"><span className="size-2 rounded-full border border-primary" />Planned (outlined)</span></div>
            </div>
            <div className="mt-4 overflow-x-auto">
              <div className="min-w-[620px]">
                <div className="grid grid-cols-[90px_minmax(0,1fr)] border-b border-border pb-2 text-xs text-muted-foreground">
                  <span>Channel</span>
                  <div className="relative h-4"><span className="absolute" style={{ left: pos(-60) }}>−60 days</span><span className="absolute -translate-x-1/2" style={{ left: pos(-30) }}>−30 days</span><span className="absolute -translate-x-1/2 font-medium text-primary" style={{ left: pos(0) }}>Today</span><span className="absolute right-0">+14 days</span></div>
                </div>
                {LANES.map((lane) => (
                  <div key={lane.key} className="grid grid-cols-[90px_minmax(0,1fr)] items-center border-b border-border/70 py-2.5 last:border-0">
                    <span className="text-[13px] text-muted-foreground">{lane.label}</span>
                    <div className="relative h-7">
                      <span className="absolute inset-y-0 w-px bg-primary/40" style={{ left: pos(0) }} aria-hidden />
                      {doctor.touches.filter((t) => t.lane === lane.key).map((t) => (
                        <button key={t.detail} onClick={() => setSel(t)} aria-pressed={shown === t} title={t.detail}
                          className={cn('absolute top-1/2 h-6 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-2.5 text-xs font-medium transition-shadow',
                            t.planned ? 'border border-primary bg-card text-primary' : lane.key === 'signal' ? 'bg-primary text-primary-foreground' : 'bg-foreground text-background',
                            shown === t && 'ring-2 ring-ring/50 ring-offset-1 ring-offset-card')}
                          style={{ left: pos(t.day) }}>{t.label}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {shown && <div className="mt-4 flex items-center gap-2 rounded-xl bg-muted px-4 py-3 text-[14px]" aria-live="polite"><Info className="size-4 text-primary" />{shown.detail}<span className="ml-auto hidden text-xs text-muted-foreground sm:inline">Click any item</span></div>}
          </Panel>

          <div className="grid gap-4 md:grid-cols-3">
            <Panel className="p-4"><PanelLabel>Channel preferences</PanelLabel><div className="mt-1">{doctor.prefs.map((p) => <Meter key={p.label} label={p.label} value={p.value} right={p.label === 'Email' && !doctor.emailConsent ? <span className="text-danger-ink">{p.value == null ? 'n/a' : `${p.value}%`} · no consent</span> : undefined} />)}</div></Panel>
            <Panel className="p-4">
              <PanelLabel>Contact pressure</PanelLabel>
              <dl className="mt-2 text-[14px]">
                <div className="flex justify-between border-b border-border/70 py-2"><dt>Emails (30d)</dt><dd className="tabular">{doctor.emails30} of {EMAIL_CAP}</dd></div>
                <div className="flex justify-between border-b border-border/70 py-2"><dt>Rep visits (month)</dt><dd className="tabular">{doctor.repVisitsMonth}</dd></div>
                <div className="flex justify-between py-2"><dt>Conflicts</dt><dd className={openPlans.some((p) => p.conflict && !p.conflict.resolved) ? 'text-warning-ink' : 'text-success-ink'}>{openPlans.some((p) => p.conflict && !p.conflict.resolved) ? '1 conflict' : 'No conflicts'}</dd></div>
              </dl>
            </Panel>
            <Panel className="p-4">
              <PanelLabel>Results</PanelLabel>
              <Sparkline values={doctor.rxTrend} className="mt-3 h-12 w-full" />
              <p className="mt-2 text-[13px] text-muted-foreground">Prescriptions trend, 8 weeks. Lift is measured at segment level, not per doctor.</p>
            </Panel>
          </div>
        </div>

        <div className="space-y-4">
          <Panel className="p-4">
            <PanelLabel>Open plans ({openPlans.length})</PanelLabel>
            {openPlans.length ? openPlans.map((p) => {
              const b = blockingCount(checkPlan(p, doctor, crmDown)); const h = hoursLeft(p)
              return (
                <Link key={p.id} to={`/plans/${p.id}`} className="-mx-2 mt-2 flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-hover">
                  <div className="flex-1"><div className="font-semibold">{p.signal}</div><div className={cn('text-[13px]', b || h <= 6 ? 'text-warning-ink' : 'text-muted-foreground')}>{h <= 0 ? 'Expired' : `${h}h left`}{b ? ` · ${b} blocking issue${b > 1 ? 's' : ''}` : ' · ready'}</div></div>
                  <ChevronRight className="size-4 text-tertiary" />
                </Link>
              )
            }) : <p className="mt-2 text-[13px] text-muted-foreground">No open plans.</p>}
          </Panel>
          {doctor.repNote && (
            <Panel className="p-4">
              <PanelLabel>Notes from rep</PanelLabel>
              <p className="mt-2 text-[15px]">{doctor.repNote.text}</p>
              <p className="mt-2 text-[13px] text-muted-foreground">{doctor.repNote.by} · {doctor.repNote.on}</p>
            </Panel>
          )}
        </div>
      </div>
    </Page>
  )
}
