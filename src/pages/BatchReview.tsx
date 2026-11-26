import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, Check, CircleCheck, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { Page } from '@/components/shell'
import { ChannelBadge, Kbd, Panel, PanelLabel, Pill, range } from '@/components/bits'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'
import { EMAIL_CAP, WINDOW_HOURS } from '@/data/seed'
import NotFound from './NotFound'
import type { Batch } from '@/data/types'

export default function BatchReview() {
  const { id } = useParams()
  const batch = useStore((s) => s.batches.find((b) => b.id === id))
  if (!batch) return <NotFound />
  return <BatchBody batch={batch} />
}

function BatchBody({ batch }: { batch: Batch }) {
  const navigate = useNavigate()
  const ready = useMemo(() => batch.doctors.filter((d) => !d.outlier).map((d) => d.id), [batch])
  const [selected, setSelected] = useState<Set<string>>(() => new Set(ready))
  const [showAll, setShowAll] = useState(false)

  const rows = showAll ? batch.doctors : batch.doctors.slice(0, 8)
  const n = selected.size
  const outlier = batch.doctors.find((d) => d.outlier)
  const released = batch.status === 'released'
  const toggle = (did: string, on: boolean) => setSelected((s) => { const c = new Set(s); if (on) c.add(did); else c.delete(did); return c })
  const allOn = n === batch.doctors.length

  const release = (andOutlier = false) => {
    if (!n) { toast.error('Select at least one doctor.'); return }
    const ids = [...selected]
    useStore.getState().releaseBatch(batch.id, ids)
    toast.success(`${ids.length} plans released`, { description: 'Sends start at 4:00 pm. You can cancel until then.', action: { label: 'Undo', onClick: () => useStore.getState().undoBatch(batch.id) } })
    if (andOutlier) navigate('/doctors/gogoi')
  }
  const releaseRef = useRef(release)
  useEffect(() => { releaseRef.current = release })
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement
      if (el.closest('input, textarea, [role=dialog], [role=menu]') || e.ctrlKey || e.metaKey || e.altKey || released) return
      if (e.key.toLowerCase() === 'a') { e.preventDefault(); releaseRef.current() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [released])

  return (
    <Page title="Batch review">
      <Link to="/review" className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline"><ArrowLeft className="size-3.5" />Review queue</Link>
      <h2 className="mt-3 text-[30px] font-semibold leading-tight tracking-[-0.025em]">{batch.title}</h2>
      <p className="mt-1 text-[14px] text-muted-foreground">{batch.summary}</p>

      {released && (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-success/30 bg-success-soft px-4 py-3 text-[14px] text-success-ink" role="status">
          <CircleCheck className="size-4" /><span className="flex-1">{batch.released?.length} plans released by you · emails queued for 4:00 pm · {batch.released?.length} rep suggestions delivered</span>
          <Button size="sm" variant="outline" onClick={() => useStore.getState().undoBatch(batch.id)}><RotateCcw className="size-3.5" />Undo release</Button>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-6">
          <Panel className="p-5">
            <h3 className="text-[17px] font-semibold">The plan for this batch</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {batch.steps.map((s, i) => (
                <div key={s.title} className="rounded-xl border border-border p-4">
                  <div className="flex gap-3"><ChannelBadge channel={s.channel} /><div><div className="font-semibold">{i + 1}. {s.title}</div><div className="text-[13px] text-muted-foreground">{s.detail}</div></div></div>
                  <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-3">
                    <Pill tone="success">MLR approved</Pill>
                    <Popover>
                      <PopoverTrigger className="text-[13px] font-medium text-primary hover:underline" disabled={released}>Change for all</PopoverTrigger>
                      <PopoverContent className="w-64 p-1" align="end">
                        {(s.channel === 'email' ? ['Send within 4h of release', 'Send tomorrow 9:00 am', 'Remove email for all'] : ['Reps decide timing', 'Suggest this week', 'Remove rep suggestion for all']).map((o) => (
                          <button key={o} className="w-full rounded-md px-3 py-2 text-left text-[13px] hover:bg-hover" onClick={() => toast(`Applied to all ${batch.doctors.length} plans: ${o.toLowerCase()}.`)}>{o}</button>
                        ))}
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-muted/70">
                  <TableRow>
                    <TableHead className="w-10 pl-5"><Checkbox aria-label="Select all" checked={allOn ? true : n ? 'indeterminate' : false} disabled={released} onCheckedChange={(v) => setSelected(v === true ? new Set(batch.doctors.map((d) => d.id)) : new Set())} /></TableHead>
                    <TableHead>Doctor</TableHead><TableHead>Specialty</TableHead><TableHead>City</TableHead>
                    <TableHead className="text-right">Time left</TableHead><TableHead className="text-right">Email cap</TableHead><TableHead>Rep load</TableHead><TableHead className="pr-5 text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((d) => (
                    <TableRow key={d.id} className={cn(d.outlier && 'bg-warning-soft/40 hover:bg-warning-soft/60')} data-state={selected.has(d.id) ? 'selected' : undefined}>
                      <TableCell className="pl-5"><Checkbox aria-label={`Include ${d.name}`} checked={selected.has(d.id)} disabled={released} onCheckedChange={(v) => toggle(d.id, v === true)} /></TableCell>
                      <TableCell className="whitespace-normal">
                        {d.outlier ? <Link to="/doctors/gogoi" className="font-medium hover:underline">{d.name}</Link> : <span className="font-medium">{d.name}</span>}
                        <div className="text-xs text-muted-foreground">NPI {d.npi}</div>
                        {d.outlier && <div className="mt-0.5 max-w-[240px] text-xs text-warning-ink">{d.outlier}</div>}
                      </TableCell>
                      <TableCell>{d.specialty}</TableCell><TableCell>{d.city}</TableCell>
                      <TableCell className="text-right tabular">
                        {d.hoursLeft}h<div className="ml-auto mt-1 h-[3px] w-12 rounded bg-border"><div className="h-full rounded bg-muted-foreground/60" style={{ width: `${((WINDOW_HOURS - d.hoursLeft) / WINDOW_HOURS) * 100}%` }} /></div>
                      </TableCell>
                      <TableCell className="text-right tabular">{d.outlier ? '—' : `${d.emails30 + 1} of ${EMAIL_CAP}`}</TableCell>
                      <TableCell className="tabular">{d.rep.name} <span className="text-muted-foreground">{d.rep.load}/{d.rep.cap}</span></TableCell>
                      <TableCell className="pr-5 text-right">{released && batch.released?.includes(d.id) ? <Pill tone="success">Released</Pill> : d.outlier ? <Pill tone="warning">Needs a look</Pill> : <Pill tone="success">Ready</Pill>}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between border-t border-border px-5 py-3 text-[13px] text-muted-foreground">
              <span>Showing {rows.length} of {batch.doctors.length} doctors</span>
              <button className="font-medium text-primary hover:underline" onClick={() => setShowAll((v) => !v)}>{showAll ? 'Show fewer' : `Show ${batch.doctors.length - 8} more`}</button>
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel className="p-4">
            <PanelLabel>Expected impact</PanelLabel>
            <div className="mt-1 text-[30px] font-semibold tracking-[-0.02em] tabular">{range(batch.impact)}</div>
            <div className="text-[13px] text-muted-foreground">extra prescriptions per 100 doctors</div>
            <div className="mt-3 flex justify-between border-t border-border pt-3 text-[13px]"><span className="text-muted-foreground">Confidence: {batch.confidence}</span>
              <Popover><PopoverTrigger className="font-medium text-primary hover:underline">How we know</PopoverTrigger>
                <PopoverContent className="w-72 text-[13px]" align="end">Based on 512 lab-result plans in the last 12 weeks, compared with matched doctors. A range, because response varies. Fictional data.</PopoverContent></Popover>
            </div>
          </Panel>
          <Panel className="p-4">
            <PanelLabel>Rules check for the batch</PanelLabel>
            <ul className="mt-2 text-[14px]">
              {['Approved content', 'Consent', 'Email cap', 'Rep capacity'].map((r) => <li key={r} className="flex items-center gap-2.5 border-b border-border/70 py-2.5"><Check className="size-4 text-success" aria-label="passed" />{r}</li>)}
              <li className="flex items-start gap-2.5 py-2.5 text-warning-ink"><AlertTriangle className="mt-0.5 size-4 shrink-0" aria-label="warning" />1 doctor without email consent: email skipped automatically</li>
            </ul>
          </Panel>
        </div>
      </div>

      {!released && (
        <div className="frosted fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/85 lg:left-[240px]">
          <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-3 px-4 py-3 sm:px-8">
            <div className="basis-full text-[13px] text-muted-foreground sm:basis-0 sm:flex-1">{n} plans · {n - (selected.has(outlier?.id ?? '') ? 1 : 0)} emails · {n} rep suggestions · sends start 4:00 pm</div>
            <Button variant="ghost" onClick={() => toast('Batch rejected. Each doctor goes back to automatic handling.')}>Reject batch</Button>
            <Button variant="outline" className="rounded-[10px]" onClick={() => release(true)}>Release and review outlier</Button>
            <Button className="rounded-[10px]" onClick={() => release()}>Release {n} plans<Kbd inverted>A</Kbd></Button>
          </div>
        </div>
      )}
    </Page>
  )
}
