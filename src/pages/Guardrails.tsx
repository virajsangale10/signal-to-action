import { useState } from 'react'
import { Lock } from 'lucide-react'
import { toast } from 'sonner'
import { Page } from '@/components/shell'
import { CHANNEL_LABEL, Panel, PanelLabel, Pill, range } from '@/components/bits'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useStore } from '@/store/useStore'
import { replay } from '@/lib/rules'
import type { Channel } from '@/data/types'
import { cn } from '@/lib/utils'

const TRIGGERS = [
  { name: 'Lab result trend', status: 'Active' },
  { name: 'Competitor search', status: 'Active' },
  { name: 'Publication download', status: 'Paused' },
  { name: 'Peer adoption', status: 'Active' },
]
const HISTORY = [
  { v: 7, who: 'Omnichannel lead', on: 'Nov 20', what: 'Email cap 5 → 4' },
  { v: 6, who: 'Omnichannel lead', on: 'Oct 28', what: 'Auto-release below priority 85' },
  { v: 5, who: 'Ketaki B.', on: 'Oct 2', what: 'Added rep suggestions' },
]

function Block({ label, tone, children }: { label: string; tone: 'accent' | 'warning' | 'success'; children: React.ReactNode }) {
  return (
    <Panel className="p-5">
      <div className={cn('mb-3 text-xs font-semibold tracking-[0.04em]', tone === 'accent' && 'text-primary', tone === 'warning' && 'text-warning-ink', tone === 'success' && 'text-success-ink')}>{label}</div>
      {children}
    </Panel>
  )
}
const Connector = () => <div className="ml-8 h-4 w-px bg-border" aria-hidden />

function Row({ label, htmlFor, children }: { label: string; htmlFor?: string; children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 py-3 text-[14px] last:border-0"><label htmlFor={htmlFor}>{label}</label>{children}</div>
}

export default function GuardrailsPage() {
  const g = useStore((s) => s.guardrails)
  const saved = useStore((s) => s.savedGuardrails)
  const submitted = useStore((s) => s.guardrailsSubmitted)
  const version = useStore((s) => s.version)
  const { setGuardrails, discardGuardrails, submitGuardrails } = useStore.getState()
  const [trigger, setTrigger] = useState('Lab result trend')
  const before = replay(saved), after = replay(g)
  const changed = JSON.stringify(g) !== JSON.stringify(saved)
  const setNum = (k: 'emailCap' | 'repMax') => (e: React.ChangeEvent<HTMLInputElement>) => { const v = Math.max(1, Math.min(10, Number(e.target.value) || 1)); setGuardrails({ [k]: v }) }

  const metrics: { label: string; b: number | string; a: number | string; better?: 'up' | 'down' }[] = [
    { label: 'Plans drafted', b: before.drafted.toLocaleString(), a: after.drafted.toLocaleString() },
    { label: 'Released automatically', b: before.autoReleased.toLocaleString(), a: after.autoReleased.toLocaleString(), better: 'up' },
    { label: 'Sent to review', b: before.toReview.toLocaleString(), a: after.toReview.toLocaleString(), better: 'down' },
    { label: 'Emails blocked by cap', b: before.emailsBlocked, a: after.emailsBlocked },
    { label: 'Rep suggestions held', b: before.repHeld, a: after.repHeld },
    { label: 'Review per marketer / day', b: before.reviewPerDay, a: after.reviewPerDay, better: 'down' },
  ]
  const tone = (m: (typeof metrics)[number]) => {
    if (!m.better || m.a === m.b) return ''
    const up = Number(String(m.a).replace(/,/g, '')) > Number(String(m.b).replace(/,/g, ''))
    return (m.better === 'up') === up ? 'text-success-ink' : 'text-danger-ink'
  }

  return (
    <Page title={`Guardrails · ${trigger}`}>
      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)_300px]">
        <Panel className="h-fit overflow-hidden">
          <div className="border-b border-border px-4 py-3 text-[13px] text-muted-foreground">Signal triggers</div>
          {TRIGGERS.map((t) => (
            <button key={t.name} onClick={() => { setTrigger(t.name); if (t.name !== 'Lab result trend') toast('Only “Lab result trend” is editable in this demo.') }}
              className={cn('block w-full border-b border-border/70 px-4 py-3 text-left last:border-0 hover:bg-hover', trigger === t.name && 'bg-accent')} aria-current={trigger === t.name}>
              <div className={cn('text-[14px]', trigger === t.name && 'font-medium text-accent-foreground')}>{t.name}</div>
              <Pill tone={t.status === 'Active' ? 'success' : 'neutral'} dot={false} className="mt-1 h-5">{t.status}</Pill>
            </button>
          ))}
        </Panel>

        <div className={cn(trigger !== 'Lab result trend' && 'pointer-events-none opacity-60')} aria-disabled={trigger !== 'Lab result trend'}>
          <Block label="WHEN" tone="accent">
            <Row label="Signal type">
              <Select value={g.signal} onValueChange={(v) => setGuardrails({ signal: v })}>
                <SelectTrigger className="w-60 rounded-[10px]" aria-label="Signal type"><SelectValue /></SelectTrigger>
                <SelectContent>{TRIGGERS.map((t) => <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>)}</SelectContent>
              </Select>
            </Row>
            <div className="py-3 text-[14px]">
              <div className="flex justify-between"><span id="prio-l">Priority score</span><span className="font-medium tabular">At least {g.minPriority}</span></div>
              <Slider aria-labelledby="prio-l" className="mt-3" min={50} max={95} step={5} value={[g.minPriority]} onValueChange={([v]) => setGuardrails({ minPriority: v })} />
            </div>
          </Block>
          <Connector />
          <Block label="THEN" tone="accent">
            <div className="flex flex-wrap items-center justify-between gap-3 text-[14px]">
              <span>Draft a plan using approved channels:</span>
              <label className="flex items-center gap-2 text-[13px] text-muted-foreground">At most
                <Select value={String(g.maxSteps)} onValueChange={(v) => setGuardrails({ maxSteps: Number(v) })}>
                  <SelectTrigger size="sm" className="w-16 rounded-lg" aria-label="Max steps"><SelectValue /></SelectTrigger>
                  <SelectContent>{[2, 3, 4].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
                </Select>steps</label>
            </div>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Channels">
              {(['email', 'ad', 'webinar', 'rep'] as Channel[]).map((c) => (
                <button key={c} aria-pressed={g.channels[c]} onClick={() => setGuardrails({ channels: { ...g.channels, [c]: !g.channels[c] } })}
                  className={cn('h-8 rounded-full border px-3.5 text-[13px] font-medium transition-colors', g.channels[c] ? 'border-primary/40 bg-accent text-accent-foreground' : 'border-border text-muted-foreground hover:bg-hover')}>{CHANNEL_LABEL[c]}</button>
              ))}
            </div>
          </Block>
          <Connector />
          <Block label="GUARDRAILS" tone="warning">
            <Row label="Max emails per doctor per 30 days (all plans and brands)" htmlFor="cap"><Input id="cap" type="number" min={1} max={10} value={g.emailCap} onChange={setNum('emailCap')} className="h-9 w-20 rounded-[10px] text-center tabular" /></Row>
            <Row label="Skip email if a rep visited within">
              <Select value={String(g.repGap)} onValueChange={(v) => setGuardrails({ repGap: Number(v) })}>
                <SelectTrigger className="w-32 rounded-[10px]" aria-label="Rep visit gap"><SelectValue /></SelectTrigger>
                <SelectContent>{[24, 48, 72].map((n) => <SelectItem key={n} value={String(n)}>{n} hours</SelectItem>)}</SelectContent>
              </Select>
            </Row>
            <Row label="Max rep suggestions per week" htmlFor="repmax"><Input id="repmax" type="number" min={1} max={10} value={g.repMax} onChange={setNum('repMax')} className="h-9 w-20 rounded-[10px] text-center tabular" /></Row>
            <div className="flex items-center gap-2 pt-3 text-[13px] text-muted-foreground"><Lock className="size-3.5" />Consent and MLR approval are always enforced</div>
          </Block>
          <Connector />
          <Block label="RELEASE" tone="success">
            <RadioGroup value={g.release} onValueChange={(v) => setGuardrails({ release: v as typeof g.release })} className="gap-1">
              <label className="flex items-start gap-3 rounded-lg px-1 py-2 text-[14px]"><RadioGroupItem value="review" className="mt-0.5" /><span>Review every plan<span className="block text-[13px] text-muted-foreground">Safest; slow at high volume and signals expire.</span></span></label>
              <label className="flex items-start gap-3 rounded-lg px-1 py-2 text-[14px]"><RadioGroupItem value="auto" className="mt-0.5" /><span>Release automatically when every rule passes and priority is below {g.autoBelow} (recommended)<span className="block text-[13px] text-muted-foreground">High-priority plans still come to you. Every auto-release is logged.</span></span></label>
              <label className="flex items-start gap-3 rounded-lg px-1 py-2 text-[14px]"><RadioGroupItem value="batch" className="mt-0.5" /><span>Batch similar plans for one review<span className="block text-[13px] text-muted-foreground">One decision covers plans with the same signal and steps.</span></span></label>
            </RadioGroup>
          </Block>
        </div>

        <div className="h-fit space-y-4 lg:sticky lg:top-20">
          <Panel className="p-4" aria-live="polite">
            <PanelLabel>Impact preview</PanelLabel>
            <p className="text-[13px] text-muted-foreground">Replayed on the last 30 days</p>
            <table className="mt-3 w-full text-[13.5px]">
              <thead><tr className="text-[12px] text-muted-foreground"><th className="pb-2 text-left font-normal">Metric</th><th className="pb-2 text-right font-normal">Before</th><th className="pb-2 text-right font-normal">After</th></tr></thead>
              <tbody>
                {metrics.map((m) => (
                  <tr key={m.label} className="border-t border-border/70"><td className="py-2 pr-2">{m.label}</td><td className="py-2 text-right text-muted-foreground tabular">{m.b}</td><td className={cn('py-2 text-right font-medium tabular', tone(m))}>{m.a}</td></tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 border-t border-border pt-3">
              <div className="text-[13px] text-muted-foreground">Estimated lift</div>
              <div className="text-[17px] font-semibold tabular">{range(after.lift)} Rx / 100 HCPs</div>
              {changed && <div className="text-[13px] text-muted-foreground">Now {range(before.lift)}</div>}
              <div className="text-[13px] text-muted-foreground">Confidence: medium · fictional model</div>
            </div>
          </Panel>
          {submitted && <Panel className="border-primary/30 bg-accent p-4 text-[13px] text-accent-foreground">Submitted for approval. The omnichannel lead will review version {version + 1} before it goes live on {g.startDate}.</Panel>}
        </div>
      </div>

      <div className="frosted fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/85 lg:left-[240px]">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3 px-4 py-3 sm:px-8">
          <span className="basis-full text-[13px] text-muted-foreground sm:basis-0 sm:flex-1">
            Version {version} · changed by Omnichannel lead, Nov 20{' '}
            <Popover><PopoverTrigger className="font-medium text-primary hover:underline">History</PopoverTrigger>
              <PopoverContent className="w-72 p-2" align="start">
                {HISTORY.map((h) => <div key={h.v} className="rounded-md px-2 py-2 text-[13px] hover:bg-hover"><div className="font-medium">Version {h.v} · {h.what}</div><div className="text-muted-foreground">{h.who} · {h.on}</div></div>)}
              </PopoverContent>
            </Popover>
            {changed && <span className="ml-2 text-warning-ink">· unsaved changes</span>}
          </span>
          <label className="flex items-center gap-2 text-[13px] text-muted-foreground">Start date<Input value={g.startDate} onChange={(e) => setGuardrails({ startDate: e.target.value })} className="h-9 w-24 rounded-[10px]" /></label>
          <Button variant="outline" disabled={!changed} onClick={() => { discardGuardrails(); toast('Changes discarded.') }}>Discard</Button>
          <Button disabled={!changed || submitted} onClick={() => { submitGuardrails(); toast.success('Submitted for approval', { description: `The omnichannel lead reviews it before ${g.startDate}.` }) }}>{submitted ? 'Submitted' : 'Submit for approval'}</Button>
        </div>
      </div>
    </Page>
  )
}
