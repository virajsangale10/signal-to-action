import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, CircleHelp, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { Page } from '@/components/shell'
import { Panel, range } from '@/components/bits'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ANSWERS, SUGGESTED, type Answer } from '@/data/insights'
import { useStore } from '@/store/useStore'
import { cn } from '@/lib/utils'

interface Turn { q: string; a?: Answer; on: boolean[]; shared?: boolean }

export default function Ask() {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [thread, setThread] = useState<Turn[]>(() => [{ q: ANSWERS[0].question, a: ANSWERS[0], on: ANSWERS[0].changes.map((c) => c.on) }])

  const ask = (q: string) => {
    const text = q.trim()
    if (!text) { setError('Type a question first.'); return }
    const a = ANSWERS.find((x) => x.question === text) ?? ANSWERS.find((x) => x.match.test(text))
    setThread((t) => [{ q: text, a, on: a ? a.changes.map((c) => c.on) : [] }, ...t])
    setInput(''); setError('')
  }

  return (
    <Page title="Ask about performance">
      <div className="mx-auto max-w-[860px]">
        <form onSubmit={(e) => { e.preventDefault(); ask(input) }} className="flex items-center gap-2 rounded-[14px] border border-border bg-card p-2 pl-4 focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/20">
          <MessageSquare className="size-4 shrink-0 text-muted-foreground" />
          <label htmlFor="ask" className="sr-only">Your question</label>
          <input id="ask" value={input} onChange={(e) => { setInput(e.target.value); setError('') }} placeholder="Ask about lift, signals, reps or channels" className="h-9 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground" autoComplete="off" />
          <Button type="submit" variant="secondary" className="rounded-[10px]">Ask</Button>
        </form>
        {error && <p role="alert" className="mt-2 text-[13px] text-danger-ink">{error}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTED.map((s) => <button key={s} onClick={() => ask(s)} className="h-8 rounded-full border border-border bg-card px-3.5 text-[13px] text-muted-foreground hover:bg-hover hover:text-foreground">{s}</button>)}
        </div>

        <div className="mt-6 space-y-6">
          {thread.map((t, i) => (
            <div key={`${i}-${t.q}`} className="space-y-3">
              <div className="flex justify-end"><div className="max-w-[85%] rounded-[14px] rounded-br-md bg-accent px-4 py-2.5 text-[15px] text-accent-foreground">{t.q}</div></div>
              {t.a ? <AnswerCard turn={t} onChange={(on) => setThread((th) => th.map((x) => x === t ? { ...x, on } : x))} onShared={() => setThread((th) => th.map((x) => x === t ? { ...x, shared: true } : x))} />
                : (
                  <Panel className="flex gap-3 p-5 text-[15px]">
                    <CircleHelp className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                    <div><div className="font-medium">I don't know that yet.</div><p className="mt-1 text-[14px] text-muted-foreground">This demo answers three sample questions. In a real product, a question without enough data should say so and suggest what to look at, never guess.</p></div>
                  </Panel>
                )}
            </div>
          ))}
        </div>
      </div>
    </Page>
  )
}

function AnswerCard({ turn, onChange, onShared }: { turn: Turn; onChange: (on: boolean[]) => void; onShared: () => void }) {
  const a = turn.a!
  const navigate = useNavigate()
  const [how, setHow] = useState(false)
  const [table, setTable] = useState(false)
  const max = Math.max(...a.drivers.map((d) => Math.abs(d.value)))
  const hasNeg = a.drivers.some((d) => d.value < 0)
  const sel = a.changes.filter((_, i) => turn.on[i])
  const proj: [number, number] = [a.base[0] + sel.reduce((s, c) => s + c.range[0], 0), a.base[1] + sel.reduce((s, c) => s + c.range[1], 0)]

  const apply = () => {
    const g = sel.reduce((acc, c) => ({ ...acc, ...c.guardrail }), {} as { emailCap?: number; repMax?: number })
    if (Object.keys(g).length) useStore.getState().setGuardrails(g)
    navigate('/guardrails')
    toast(Object.keys(g).length ? 'Opened in Guardrails with the change filled in. Review the impact, then submit.' : 'Opened in Guardrails. This change needs a planning decision, so nothing was filled in.')
  }

  return (
    <Panel className="p-6">
      <p className="text-[17px] font-semibold leading-snug tracking-[-0.01em]">{a.answer}</p>
      <div className="mt-3 flex flex-wrap gap-2">{[...a.chips, 'Fictional data'].map((c) => <span key={c} className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground">{c}</span>)}</div>

      <div className="mt-5 border-t border-border pt-5">
        <div className="text-[13px] font-semibold text-muted-foreground">Likely drivers (per 100 doctors)</div>
        <div className="mt-3 space-y-2.5">
          {a.drivers.map((d) => {
            const w = (Math.abs(d.value) / max) * (hasNeg ? 50 : 100)
            return (
              <div key={d.label} className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_48px] items-center gap-3 text-[14px]">
                <span className={cn(d.unexplained && 'text-muted-foreground')}>{d.label}</span>
                <div className="relative h-2.5" aria-hidden>
                  {hasNeg && <span className="absolute inset-y-[-4px] left-1/2 w-px bg-border" />}
                  <span className={cn('absolute inset-y-0 rounded-full', d.unexplained ? 'bg-chart-2' : d.value < 0 ? 'bg-danger' : 'bg-primary')}
                    style={{ width: `${w}%`, left: hasNeg ? (d.value < 0 ? `${50 - w}%` : '50%') : 0 }} />
                </div>
                <span className={cn('text-right text-[13px] tabular', d.unexplained ? 'text-muted-foreground' : d.value < 0 ? 'text-danger-ink' : 'text-primary')}>{d.value > 0 ? '+' : '−'}{Math.abs(d.value).toFixed(1)}</span>
              </div>
            )
          })}
        </div>
        <p className="mt-3 text-[13px] text-muted-foreground">Associations, not proven causes.</p>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <button className="flex w-full items-center justify-between text-[14px] font-medium" onClick={() => setHow((v) => !v)} aria-expanded={how}>
          <span>How we know</span><span className="flex items-center gap-1 text-[13px] text-primary">{how ? 'Hide details' : 'Show details'}<ChevronDown className={cn('size-4 transition-transform', how && 'rotate-180')} /></span>
        </button>
        {how && <ul className="mt-2 list-disc space-y-1 pl-5 text-[13.5px] text-muted-foreground">{a.method.map((m) => <li key={m}>{m}</li>)}</ul>}
      </div>

      <div className="mt-4 border-t border-border pt-5">
        <div className="text-[13px] font-semibold text-muted-foreground">Suggested changes</div>
        <div className="mt-3 overflow-hidden rounded-xl border border-border">
          {a.changes.map((c, i) => (
            <label key={c.label} className="flex cursor-pointer items-center gap-3 border-b border-border/70 px-4 py-3 text-[14px] last:border-0 hover:bg-hover">
              <Checkbox checked={turn.on[i]} onCheckedChange={(v) => onChange(turn.on.map((x, j) => (j === i ? v === true : x)))} />
              <span className="flex-1">{c.label}</span><span className="text-[13px] text-primary tabular">{range(c.range)}</span>
            </label>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div><div className="text-[13px] text-muted-foreground">Projected lift range</div><div className="text-[32px] font-semibold leading-tight tracking-[-0.02em] tabular">{range(proj)}</div></div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="rounded-[10px]" disabled={turn.shared} onClick={() => { onShared(); toast('Shared with the omnichannel lead.') }}>{turn.shared ? 'Shared' : 'Share with omnichannel lead'}</Button>
            <Button className="rounded-[10px]" disabled={!sel.length} onClick={apply}>Open in Guardrails to apply</Button>
          </div>
        </div>
        {!sel.length && <p className="mt-2 text-[13px] text-danger-ink">Select at least one change.</p>}
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <button className="flex w-full items-center justify-between text-[14px] font-medium" onClick={() => setTable((v) => !v)} aria-expanded={table}>
          <span>Doctors behind this answer ({a.table.total.toLocaleString()})</span><span className="text-[13px] text-primary">{table ? 'Collapse' : 'Expand table'}</span>
        </button>
        {table && (
          <div className="mt-3 overflow-x-auto">
            <Table><TableHeader><TableRow>{a.table.cols.map((c, i) => <TableHead key={c} className={i >= 2 ? 'text-right' : ''}>{c}</TableHead>)}</TableRow></TableHeader>
              <TableBody>{a.table.rows.map((r) => <TableRow key={r[0]}>{r.map((c, i) => <TableCell key={i} className={i >= 2 ? 'text-right tabular' : ''}>{c}</TableCell>)}</TableRow>)}</TableBody></Table>
            <p className="mt-2 text-xs text-muted-foreground">Showing {a.table.rows.length} examples.</p>
          </div>
        )}
      </div>
    </Panel>
  )
}
