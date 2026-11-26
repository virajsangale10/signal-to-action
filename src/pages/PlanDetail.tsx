import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, Check, CircleAlert, CircleCheck, Clock, Info, Loader2, Merge, Plus, RotateCcw, Sparkles, X } from 'lucide-react'
import { toast } from 'sonner'
import { Page } from '@/components/shell'
import { CHANNEL_ICON, CHANNEL_LABEL, ChannelBadge, Kbd, Meter, Panel, PanelLabel, Pill, range } from '@/components/bits'
import { StepPreview } from '@/components/step-preview'
import { ReleasedView } from '@/components/released-view'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useDoctor, usePlan, useStore } from '@/store/useStore'
import { blockingCount, checkPlan, editCount, hoursLeft, impactRange, included, isExpired, type Rule } from '@/lib/rules'
import { COLLEAGUES, WINDOW_HOURS } from '@/data/seed'
import type { Channel, Doctor, Plan, Step } from '@/data/types'
import { cn } from '@/lib/utils'
import NotFound from './NotFound'

const REASONS = ['Wrong doctor or not a priority', 'Timing is off', "Content isn't right", 'Rep already handling it', 'Other']

export default function PlanDetail() {
  const { id } = useParams()
  const plan = usePlan(id)
  const doctor = useDoctor(plan?.doctorId)
  if (!plan || !doctor) return <NotFound />
  if (plan.status === 'released') return <Page title="Plan detail · Released"><ReleasedView plan={plan} doctor={doctor} /></Page>
  return <PlanEditor plan={plan} doctor={doctor} />
}

function PlanEditor({ plan, doctor }: { plan: Plan; doctor: Doctor }) {
  const navigate = useNavigate()
  const crmDown = useStore((s) => s.crmDown)
  const st = useStore.getState()
  const rules = checkPlan(plan, doctor, crmDown)
  const blocking = blockingCount(rules)
  const expired = isExpired(plan)
  const decided = plan.status === 'rejected' || plan.status === 'dismissed'
  const locked = expired || decided || !!plan.redrafting
  const inc = included(plan)
  const edits = editCount(plan)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [redraftOpen, setRedraftOpen] = useState(false)
  const firstFail = rules.find((r) => r.state === 'fail')
  const canRelease = !locked && blocking === 0 && inc.length > 0

  const release = () => {
    if (!canRelease) { toast.error(inc.length ? `Fix ${blocking} issue${blocking > 1 ? 's' : ''} to release.` : 'Include at least one step.'); return }
    st.release(plan.id)
    toast.success(`Plan released for ${doctor.name}`, { description: 'Sends are queued. You can cancel each one until its send time.', action: { label: 'Undo', onClick: () => st.undoRelease(plan.id) } })
    window.scrollTo({ top: 0 })
  }
  const releaseRef = useRef(release)
  useEffect(() => { releaseRef.current = release })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement
      if (el.closest('input, textarea, [role=dialog], [role=menu], [role=listbox]') || e.ctrlKey || e.metaKey || e.altKey || locked) return
      const k = e.key.toLowerCase()
      if (k === 'a') { e.preventDefault(); releaseRef.current() }
      if (k === 'r') { e.preventDefault(); setRedraftOpen(true) }
      if (k === 'x') { e.preventDefault(); setRejectOpen(true) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [locked])

  const fix = (r: Rule) => {
    if (!r.fix) return
    st.applyFix(plan.id, r.fix.action)
    toast(r.fix.action.type === 'retryCrm' ? 'CRM sync restored.' : `Fixed: ${r.fix.label[0].toLowerCase() + r.fix.label.slice(1)}.`)
  }

  return (
    <Page title="Plan detail">
      <Link to="/review" className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline"><ArrowLeft className="size-3.5" />Review queue</Link>

      {/* Decision header: the decision comes first */}
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-[30px] font-semibold leading-tight tracking-[-0.025em]"><Link to={`/doctors/${doctor.id}`} className="hover:underline">{doctor.name}</Link></h2>
            <span className="text-[14px] text-muted-foreground">{doctor.specialty} · {doctor.city} · NPI {doctor.npi}</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[14px]" role="status">
            {decided ? (
              <span className="flex items-center gap-1.5 text-muted-foreground"><CircleAlert className="size-4" />{plan.status === 'dismissed' ? 'Dismissed' : `Rejected: ${plan.reject?.reason}`}</span>
            ) : expired ? (
              <span className="flex items-center gap-1.5 text-danger-ink"><Clock className="size-4" />Expired {-hoursLeft(plan)}h ago · the 48h window closed</span>
            ) : blocking ? (
              <>
                <span className="flex items-center gap-1.5 text-danger-ink"><CircleAlert className="size-4" />{blocking} blocking issue{blocking > 1 ? 's' : ''}: {firstFail?.short ?? firstFail?.label.toLowerCase()}</span>
                {firstFail?.fix && <Button size="sm" variant="outline" className="h-7 rounded-lg" onClick={() => fix(firstFail)}>Fix: {firstFail.fix.label[0].toLowerCase() + firstFail.fix.label.slice(1)}</Button>}
              </>
            ) : inc.length ? (
              <span className="flex items-center gap-1.5 text-success-ink"><CircleCheck className="size-4" />Ready to release · {inc.length} step{inc.length > 1 ? 's' : ''}{rules.some((r) => r.state === 'warn') ? ' · with a warning' : ''}</span>
            ) : (
              <span className="flex items-center gap-1.5 text-danger-ink"><CircleAlert className="size-4" />No steps included</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!expired && <Pill tone={hoursLeft(plan) <= 6 ? 'danger' : hoursLeft(plan) <= 14 ? 'warning' : 'neutral'}><Clock className="size-3" />{hoursLeft(plan)}h left</Pill>}
          <Tooltip>
            <TooltipTrigger asChild><button className="inline-flex h-6 items-center gap-1 rounded-full border border-border bg-card px-2.5 text-xs font-medium">Priority {plan.priority}<Info className="size-3 text-muted-foreground" /></button></TooltipTrigger>
            <TooltipContent className="w-52 p-3">
              <div className="mb-1 font-medium">How priority is scored</div>
              {plan.breakdown.map((b) => <div key={b.label} className="flex justify-between"><span>{b.label}</span><span className="tabular">{b.value}</span></div>)}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {plan.assignedTo && <p className="mt-2 text-[13px] text-muted-foreground">Assigned to {plan.assignedTo}</p>}

      {expired && !decided && (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-danger/25 bg-danger-soft px-4 py-3 text-[14px] text-danger-ink">
          <Clock className="size-4" /><span className="flex-1">The window closed {-hoursLeft(plan)}h ago, so acting now is unlikely to help. The plan is read-only. Dismissed signals are logged.</span>
          <Button size="sm" variant="outline" onClick={() => { st.dismiss(plan.id); toast('Signal dismissed and logged.') }}>Dismiss</Button>
          <Button size="sm" onClick={() => toast('A follow-up plan will be drafted the next time this doctor shows a signal.')}>Draft a follow-up plan</Button>
        </div>
      )}

      {decided && (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-[14px]">
          <span className="flex-1 text-muted-foreground">{plan.status === 'rejected' ? `Nothing was sent. Your reason (“${plan.reject?.reason}”) goes into next month's model review.` : 'Signal dismissed. Nothing was sent.'}</span>
          {plan.status === 'rejected' && <Button size="sm" variant="outline" onClick={() => st.undoReject(plan.id)}><RotateCcw className="size-3.5" />Undo reject</Button>}
          <Button size="sm" variant="outline" onClick={() => navigate('/review')}>Back to queue</Button>
        </div>
      )}

      <WhyNow plan={plan} />

      {plan.conflict && !plan.conflict.resolved && !locked && (
        <Panel className="mt-4 border-warning/40 p-4">
          <div className="flex items-start gap-2 text-[14px]"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" /><span>Another plan for {doctor.name} ({plan.conflict.signal}) is queued for {plan.conflict.when}. Together they would send 2 emails in 24 hours.</span></div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <button onClick={() => { st.applyFix(plan.id, { type: 'mergeConflict' }); toast('Merged: one email instead of two.') }} className="rounded-xl border-2 border-primary bg-accent/50 p-3 text-left hover:bg-accent">
              <div className="flex items-center gap-2 font-medium"><Merge className="size-4 text-primary" />Merge into one plan <Pill tone="accent" dot={false}>Recommended</Pill></div>
              <div className="mt-1 text-[13px] text-muted-foreground">Keeps both signals, sends one email and one rep suggestion.</div>
            </button>
            <button onClick={() => { st.applyFix(plan.id, { type: 'cancelOther' }); toast(`Cancelled the queued ${plan.conflict?.signal} plan.`) }} className="rounded-xl border border-border p-3 text-left hover:bg-hover">
              <div className="flex items-center gap-2 font-medium"><X className="size-4" />Keep this plan, cancel the other</div>
              <div className="mt-1 text-[13px] text-muted-foreground">The {plan.conflict.signal.toLowerCase()} plan won't go out.</div>
            </button>
          </div>
        </Panel>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h3 className="text-[19px] font-semibold">AI-drafted plan</h3>
            {edits > 0 && <><Pill tone="warning" dot={false}>Edited · {edits} change{edits > 1 ? 's' : ''}</Pill><Button variant="link" size="sm" className="h-7 px-1" disabled={locked} onClick={() => st.resetPlan(plan.id)}>Reset to AI plan</Button></>}
          </div>
          <div className="relative space-y-3">
            {plan.steps.map((s) => <StepCard key={s.id} step={s} plan={plan} doctor={doctor} locked={locked} />)}
            {plan.redrafting && (
              <div className="absolute inset-0 grid place-items-center rounded-[14px] bg-background/70 backdrop-blur-[2px]" role="status">
                <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-[14px] shadow"><Loader2 className="size-4 animate-spin text-primary" />Redrafting with your note…</div>
              </div>
            )}
          </div>
          {!locked && (
            <div className="mt-3 flex flex-wrap gap-2">
              <AddStep plan={plan} />
              <Button variant="outline" className="rounded-[10px]" onClick={() => setRedraftOpen(true)}><Sparkles className="size-4" />Redraft with a note<Kbd>R</Kbd></Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Panel className="p-4">
            <div className="flex items-center justify-between"><PanelLabel>Rules check</PanelLabel>{blocking ? <Pill tone="danger">{blocking} blocking</Pill> : <Pill tone="success">Ready</Pill>}</div>
            <ul className="mt-2">
              {rules.map((r) => (
                <li key={r.key} className="border-b border-border/70 py-2.5 last:border-0">
                  <div className="flex items-center gap-2.5 text-[14px]">
                    {r.state === 'pass' && <Check className="size-4 text-success" aria-label="passed" />}
                    {r.state === 'fail' && <CircleAlert className="size-4 text-danger" aria-label="failed" />}
                    {r.state === 'warn' && <AlertTriangle className="size-4 text-warning" aria-label="warning" />}
                    {r.state === 'na' && <span className="grid size-4 place-items-center text-tertiary" aria-label="not applicable">–</span>}
                    <span className="flex-1">{r.label}</span>
                    <span className={cn('text-[13px] tabular', r.state === 'fail' ? 'text-danger-ink' : r.state === 'warn' ? 'text-warning-ink' : r.state === 'pass' && r.value === 'Passed' ? 'text-success-ink' : 'text-muted-foreground')}>{r.value}</span>
                    {r.fix && !locked && (r.state === 'fail' || r.state === 'warn') && <button onClick={() => fix(r)} className="text-[13px] font-medium text-primary hover:underline">Fix</button>}
                  </div>
                  {(r.state === 'fail' || r.state === 'warn') && <p className="ml-[26px] mt-0.5 text-[12.5px] text-muted-foreground">{r.detail}</p>}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel className="p-4">
            <PanelLabel>Expected impact</PanelLabel>
            <div className="mt-1 text-[30px] font-semibold tracking-[-0.02em] tabular">{range(impactRange(plan))}</div>
            <div className="text-[13px] text-muted-foreground">extra prescriptions per 100 similar doctors, over 8 weeks</div>
            {edits > 0 && <div className="mt-1 text-[13px] text-muted-foreground">AI plan: {range(plan.impact)}</div>}
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-[13px]">
              <span className="text-muted-foreground">Confidence: {plan.confidence}</span>
              <Popover>
                <PopoverTrigger className="font-medium text-primary hover:underline">How we know</PopoverTrigger>
                <PopoverContent className="w-80 text-[13px]" align="end">
                  <div className="font-medium">How this estimate is made</div>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-muted-foreground">
                    <li>Based on 2,140 similar doctors who got similar plans in the last 6 months.</li>
                    <li>Compared with matched doctors who didn't (same specialty, volume and region).</li>
                    <li>Steps overlap, so their effects are combined, not added up.</li>
                    <li>It's a range because one doctor's response varies a lot. Fictional data.</li>
                  </ul>
                </PopoverContent>
              </Popover>
            </div>
          </Panel>

          <Panel className="p-4">
            <PanelLabel>Channel preferences</PanelLabel>
            <div className="mt-1">{doctor.prefs.map((p) => <Meter key={p.label} label={p.label} value={p.value} right={p.label === 'Email' && !doctor.emailConsent ? <span className="text-danger-ink">{p.value == null ? 'n/a' : `${p.value}%`} · no consent</span> : undefined} />)}</div>
          </Panel>

          <Panel className="p-4">
            <PanelLabel>Recent touches</PanelLabel>
            <ul className="mt-1">
              {doctor.touches.filter((t) => !t.planned && t.lane !== 'signal').slice(-3).reverse().map((t) => (
                <li key={t.detail} className="flex justify-between gap-3 border-b border-border/70 py-2 text-[13px] last:border-0"><span>{t.detail.split(' · ').slice(0, 1).join('')} · {t.detail.split(' · ').slice(2).join(' · ')}</span><span className="shrink-0 text-muted-foreground">{t.detail.split(' · ')[1]}</span></li>
              ))}
            </ul>
            <Link to={`/doctors/${doctor.id}`} className="mt-1 inline-block text-[13px] font-medium text-primary hover:underline">Open doctor profile</Link>
          </Panel>
        </div>
      </div>

      {/* Sticky decision bar */}
      {!decided && (
        <div className="frosted fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/85 lg:left-[240px]">
          <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-3 px-4 py-3 sm:px-8">
            <div className="min-w-0 basis-full text-[13px] leading-snug sm:basis-0 sm:flex-1">
              {expired ? <span className="text-danger-ink">Expired · read-only</span>
                : blocking ? <span className="font-medium text-danger-ink">Fix {blocking} issue{blocking > 1 ? 's' : ''} to release</span>
                : !inc.length ? <span className="font-medium text-danger-ink">Include at least one step</span>
                : <span className="font-medium">{inc.length} step{inc.length > 1 ? 's' : ''} · {inc.map((s) => CHANNEL_LABEL[s.channel].toLowerCase()).join(', ')}</span>}
              <div className="hidden text-muted-foreground sm:block">Sends are queued. You can cancel until each send time.</div>
            </div>
            {!expired && (
              <>
                <Popover>
                  <PopoverTrigger asChild><Button variant="ghost" className="hidden sm:inline-flex">Assign to colleague</Button></PopoverTrigger>
                  <PopoverContent align="end" className="w-64 p-1">
                    {COLLEAGUES.map((c) => <button key={c} className="w-full rounded-md px-3 py-2 text-left text-[13px] hover:bg-hover" onClick={() => { st.assign(plan.id, c); toast(`Assigned to ${c}.`) }}>{c}</button>)}
                  </PopoverContent>
                </Popover>
                <Button variant="outline" className="flex-1 rounded-[10px] sm:flex-none" onClick={() => setRejectOpen(true)} disabled={locked}>Reject…<Kbd>X</Kbd></Button>
                <Button className={cn('flex-1 rounded-[10px] sm:flex-none', !canRelease && 'bg-muted text-muted-foreground shadow-none hover:bg-muted')} onClick={release} aria-disabled={!canRelease}
                  title={!canRelease ? 'Fix the blocking issues first' : undefined}>Release plan<Kbd inverted>A</Kbd></Button>
              </>
            )}
          </div>
        </div>
      )}

      <RejectSheet key={`reject-${rejectOpen}`} open={rejectOpen} onOpenChange={setRejectOpen} plan={plan} doctor={doctor} />
      <RedraftSheet key={`redraft-${redraftOpen}`} open={redraftOpen} onOpenChange={setRedraftOpen} plan={plan} />
    </Page>
  )
}

function WhyNow({ plan }: { plan: Plan }) {
  const inc = included(plan)
  const now = Math.min(plan.age, WINDOW_HOURS)
  const pct = (h: number) => `${Math.min(100, (h / WINDOW_HOURS) * 100)}%`
  return (
    <Panel className="mt-5 p-5">
      <h3 className="text-[17px] font-semibold">Why now</h3>
      <p className="mt-1 text-[14px]"><span className="font-medium">{plan.signal}:</span> {plan.signalDetail}</p>
      <div className="mt-5" role="img" aria-label={`Signal window: detected ${plan.age} hours ago, ${isExpired(plan) ? 'expired' : `${hoursLeft(plan)} hours left`}.`}>
        <div className="flex justify-between text-xs text-muted-foreground"><span>Detected (0h)</span><span className={cn('font-medium', isExpired(plan) ? 'text-danger-ink' : 'text-warning-ink')}>Now · {plan.age}h</span><span>48h window ends</span></div>
        <div className="relative mt-2 h-2 rounded-full bg-muted">
          <div className={cn('absolute inset-y-0 left-0 rounded-full', isExpired(plan) ? 'bg-danger/60' : 'bg-primary/35')} style={{ width: pct(now) }} />
          <div className="absolute -top-1 h-4 w-0.5 rounded bg-foreground" style={{ left: pct(now) }} />
          {inc.filter((s) => s.channel !== 'rep').map((s) => {
            const h = s.timingOptions.find((o) => o.label === s.timing)?.inHours ?? 0
            const Icon = CHANNEL_ICON[s.channel]
            return <span key={s.id} className="absolute -top-[7px] grid size-[22px] -translate-x-1/2 place-items-center rounded-full border-2 border-primary bg-card text-primary" style={{ left: pct(plan.age + h) }} title={`${CHANNEL_LABEL[s.channel]} in ${h}h`}><Icon className="size-3" strokeWidth={2} /></span>
          })}
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13px]">
        {inc.map((s) => {
          const h = s.timingOptions.find((o) => o.label === s.timing)?.inHours
          return <span key={s.id} className="flex items-center gap-2"><ChannelBadge channel={s.channel} size="sm" />{CHANNEL_LABEL[s.channel]} · {s.channel === 'rep' ? 'rep decides' : h != null && plan.age + h > WINDOW_HOURS ? `in ${h}h (after the window)` : `in ${h}h`}</span>
        })}
        {!inc.length && <span className="text-muted-foreground">No steps included</span>}
      </div>
    </Panel>
  )
}

function StepCard({ step, plan, doctor, locked }: { step: Step; plan: Plan; doctor: Doctor; locked: boolean }) {
  const st = useStore.getState()
  const [preview, setPreview] = useState(false)
  const content = step.contentOptions.find((o) => o.id === step.contentId)
  const noConsent = step.channel === 'email' && !doctor.emailConsent
  return (
    <Panel className={cn('p-4 transition-opacity', !step.include && 'bg-card/60')}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <label className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <Checkbox checked={step.include} disabled={locked} onCheckedChange={(v) => st.toggleStep(plan.id, step.id, v === true)} aria-label={`Include ${step.title}`} />Include
        </label>
        <ChannelBadge channel={step.channel} />
        <div className={cn('min-w-[140px] flex-1 text-[15px] font-semibold', !step.include && 'text-muted-foreground')}>{step.title}</div>
        {!content?.approved ? <Pill tone="danger">In MLR review</Pill> : noConsent && step.include ? <Pill tone="danger">No consent</Pill> : <Pill tone="success" className="hidden sm:inline-flex">MLR approved</Pill>}
      </div>
      {step.include && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="min-w-0">
            <Label className="mb-1.5 text-xs font-normal text-muted-foreground">Timing</Label>
            <Select value={step.timing} onValueChange={(v) => st.setTiming(plan.id, step.id, v)} disabled={locked}>
              <SelectTrigger className="w-full rounded-[10px]" aria-label="Timing"><SelectValue /></SelectTrigger>
              <SelectContent>{step.timingOptions.map((o) => <SelectItem key={o.label} value={o.label}>{o.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="min-w-0">
            <Label className="mb-1.5 text-xs font-normal text-muted-foreground">Approved content</Label>
            <Select value={step.contentId} onValueChange={(v) => st.setContent(plan.id, step.id, v)} disabled={locked}>
              <SelectTrigger className="w-full min-w-0 rounded-[10px] [&>span]:truncate" aria-label="Content"><SelectValue /></SelectTrigger>
              <SelectContent>{step.contentOptions.map((o) => <SelectItem key={o.id} value={o.id}>{o.id} · {o.label}{o.approved ? '' : ' (in review)'}</SelectItem>)}</SelectContent>
            </Select>
            {!content?.approved && step.contentOptions.some((o) => o.approved) && !locked && (
              <button className="mt-1.5 text-[12.5px] font-medium text-primary hover:underline" onClick={() => { const alt = step.contentOptions.find((o) => o.approved)!; st.applyFix(plan.id, { type: 'swapContent', stepId: step.id, contentId: alt.id }); toast(`Swapped to approved ${alt.id}.`) }}>
                Use approved {step.contentOptions.find((o) => o.approved)!.id} instead
              </button>
            )}
          </div>
        </div>
      )}
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-border/70 pt-2.5 text-[13px]">
        <span className="text-muted-foreground">Why: {step.why}</span>
        <button className="shrink-0 font-medium text-primary hover:underline" onClick={() => setPreview((v) => !v)} aria-expanded={preview}>{preview ? 'Hide' : 'Preview'}</button>
      </div>
      {preview && <div className="mt-3 rounded-xl bg-muted/60 p-3"><StepPreview step={step} doctor={doctor} plan={plan} /></div>}
    </Panel>
  )
}

function AddStep({ plan }: { plan: Plan }) {
  const have = new Set(plan.steps.map((s) => s.channel))
  const options = (['email', 'ad', 'webinar', 'rep'] as Channel[]).filter((c) => !have.has(c))
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="outline" className="rounded-[10px]" disabled={!options.length}><Plus className="size-4" />Add step</Button></DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((c) => { const I = CHANNEL_ICON[c]; return <DropdownMenuItem key={c} onSelect={() => { useStore.getState().addStep(plan.id, c); toast(`${CHANNEL_LABEL[c]} added. Rules re-checked.`) }}><I className="size-4" />{CHANNEL_LABEL[c]}</DropdownMenuItem> })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function RejectSheet({ open, onOpenChange, plan, doctor }: { open: boolean; onOpenChange: (v: boolean) => void; plan: Plan; doctor: Doctor }) {
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [suppress, setSuppress] = useState(false)
  const [error, setError] = useState('')
  const submit = () => {
    if (!reason) { setError('Pick a reason.'); return }
    if (reason === 'Other' && !note.trim()) { setError('Add a short note for “Other”.'); return }
    useStore.getState().reject(plan.id, reason, note.trim(), suppress)
    onOpenChange(false)
    toast(`Plan for ${doctor.name} rejected. Nothing was sent.`, { action: { label: 'Undo', onClick: () => useStore.getState().undoReject(plan.id) } })
  }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 sm:max-w-md">
        <SheetHeader className="border-b border-border">
          <SheetTitle>Reject plan</SheetTitle>
          <SheetDescription>{doctor.name} · {plan.signal}. Nothing will be sent.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-5 overflow-y-auto p-4">
          <div>
            <Label className="mb-2 block">Main reason</Label>
            <RadioGroup value={reason} onValueChange={(v) => { setReason(v); setError('') }}>
              {REASONS.map((r) => <label key={r} className="flex items-center gap-3 rounded-lg px-2 py-2 text-[14px] hover:bg-hover"><RadioGroupItem value={r} />{r}</label>)}
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="rej-note" className="mb-2 block">Note {reason === 'Other' ? <span className="text-danger-ink">(required)</span> : <span className="font-normal text-muted-foreground">(optional)</span>}</Label>
            <Textarea id="rej-note" value={note} onChange={(e) => { setNote(e.target.value); setError('') }} placeholder="Doctor is on leave until Dec 12" />
          </div>
          <label className="flex items-start gap-3 text-[14px]"><Checkbox checked={suppress} onCheckedChange={(v) => setSuppress(v === true)} className="mt-0.5" /><span>Don't suggest this doctor for {plan.signal.toLowerCase()} signals for 30 days</span></label>
          <p className="text-[13px] text-muted-foreground">Your reason trains future plans. You'll see what changed in a monthly summary.</p>
          {error && <p role="alert" className="text-[13px] font-medium text-danger-ink">{error}</p>}
        </div>
        <SheetFooter className="flex-row justify-end border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={submit}>Reject plan</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function RedraftSheet({ open, onOpenChange, plan }: { open: boolean; onOpenChange: (v: boolean) => void; plan: Plan }) {
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const examples = ['No email this week, she is at a conference', 'Wait until next week', 'Lead with the rep, keep the journal ad']
  const submit = async () => {
    if (!note.trim()) { setError('Write what should change.'); return }
    onOpenChange(false)
    await useStore.getState().redraft(plan.id, note.trim())
    toast.success('Plan redrafted. Rules re-checked.', { description: 'Only approved content was used.' })
  }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 sm:max-w-md">
        <SheetHeader className="border-b border-border">
          <SheetTitle>Redraft with a note</SheetTitle>
          <SheetDescription>Tell the AI what's off. It can change steps and timing, but only uses approved content.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          <Textarea autoFocus value={note} onChange={(e) => { setNote(e.target.value); setError('') }} placeholder="No email this week, she is at a conference" className="min-h-28" />
          {error && <p role="alert" className="text-[13px] font-medium text-danger-ink">{error}</p>}
          <div>
            <div className="mb-2 text-xs text-muted-foreground">Try one</div>
            <div className="flex flex-wrap gap-2">{examples.map((e) => <button key={e} onClick={() => setNote(e)} className="rounded-full border border-border px-3 py-1.5 text-[13px] hover:bg-hover">{e}</button>)}</div>
          </div>
        </div>
        <SheetFooter className="flex-row justify-end border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}><Sparkles className="size-4" />Redraft</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function PlanSkeleton() {
  return <div className="space-y-4"><Skeleton className="h-10 w-72" /><Skeleton className="h-36 w-full rounded-[14px]" /><Skeleton className="h-28 w-full rounded-[14px]" /><Skeleton className="h-28 w-full rounded-[14px]" /></div>
}
