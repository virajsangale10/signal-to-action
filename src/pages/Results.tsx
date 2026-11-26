import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts'
import { Page } from '@/components/shell'
import { Panel, PanelLabel, Sparkline, Stat } from '@/components/bits'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BY_SIGNAL, LEARNED, WEEKLY } from '@/data/insights'
import { cn } from '@/lib/utils'

const config = {
  reached: { label: 'Reached', color: 'var(--chart-1)' },
  comparison: { label: 'Comparison', color: 'var(--chart-2)' },
} satisfies ChartConfig

function Filter({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 rounded-[10px] bg-card" aria-label={label}><SelectValue /></SelectTrigger>
      <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
    </Select>
  )
}

export default function Results() {
  const [period, setPeriod] = useState('Last 12 weeks')
  const [signal, setSignal] = useState('Signal type: All')
  const [region, setRegion] = useState('Region: All')
  const [channel, setChannel] = useState('Channel: All')
  const rows = signal === 'Signal type: All' ? BY_SIGNAL : BY_SIGNAL.filter((r) => `Signal type: ${r.type}` === signal)
  const data = WEEKLY.map((w) => ({ ...w, band: [w.comparison, w.reached] as [number, number] }))

  return (
    <Page title="Results">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-[32px] font-semibold tracking-[-0.025em]">Results</h2>
        <div className="flex flex-wrap gap-2">
          <Filter label="Period" value={period} onChange={setPeriod} options={['Last 4 weeks', 'Last 12 weeks', 'This year']} />
          <Filter label="Signal type" value={signal} onChange={setSignal} options={['Signal type: All', ...BY_SIGNAL.map((r) => `Signal type: ${r.type}`)]} />
          <Filter label="Region" value={region} onChange={setRegion} options={['Region: All', 'Region: Northeast', 'Region: Midwest', 'Region: South', 'Region: West']} />
          <Filter label="Channel" value={channel} onChange={setChannel} options={['Channel: All', 'Channel: Email', 'Channel: Rep', 'Channel: Media']} />
        </div>
      </div>
      {(region !== 'Region: All' || channel !== 'Channel: All' || period !== 'Last 12 weeks') && <p className="mt-2 text-[13px] text-muted-foreground">Region, channel and period filters are shown for layout only in this demo; numbers stay the same.</p>}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Plans released" value="1,284" foot="+9% vs prior 12 weeks" footTone="success" />
        <Stat label="Auto-released" value="71%" foot="+4 pts vs prior 12 weeks" footTone="success" />
        <Stat label="Rep suggestions accepted" value="62%" foot="+6 pts vs prior 12 weeks" footTone="success" />
        <Stat label="Extra Rx / 100 doctors" value="+2.6" foot="Range +2.1 to +3.1" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-6">
          <Panel className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h3 className="text-[17px] font-semibold">Weekly prescriptions per 100 doctors</h3><p className="text-[13px] text-muted-foreground">Doctors reached vs matched comparison doctors (12 weeks)</p></div>
              <div className="flex gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded bg-chart-1" />Reached</span><span className="flex items-center gap-1.5"><span className="h-0 w-4 border-t border-dashed border-chart-2" />Comparison</span></div>
            </div>
            <ChartContainer config={config} className="mt-4 h-[260px] w-full">
              <ComposedChart data={data} margin={{ left: -16, right: 8, top: 8 }} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} interval={1} />
                <YAxis domain={[9, 18]} ticks={[9, 12, 15, 18]} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                <Area dataKey="band" stroke="none" fill="var(--color-reached)" fillOpacity={0.12} isAnimationActive={false} tooltipType="none" />
                <Line dataKey="comparison" stroke="var(--color-comparison)" strokeDasharray="4 4" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                <Line dataKey="reached" stroke="var(--color-reached)" strokeWidth={2.25} dot={false} isAnimationActive={false} />
              </ComposedChart>
            </ChartContainer>
            <p className="mt-2 text-[13px] text-muted-foreground">The shaded gap is the lift. Fictional data.</p>
          </Panel>

          <Panel className="overflow-hidden">
            <h3 className="px-5 pt-5 text-[17px] font-semibold">By signal type</h3>
            <div className="mt-3 overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/70"><TableRow><TableHead className="pl-5">Signal type</TableHead><TableHead className="text-right">Plans</TableHead><TableHead className="text-right">Acted on within 48h</TableHead><TableHead className="text-right">Rep acceptance</TableHead><TableHead className="text-right">Lift (range)</TableHead><TableHead className="pr-5 text-right">Trend</TableHead></TableRow></TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.type} className={cn(r.late && 'bg-warning-soft/30')}>
                      <TableCell className="pl-5">{r.type}{r.late && <div className="text-xs text-warning-ink">Often acted on too late</div>}</TableCell>
                      <TableCell className="text-right tabular">{r.plans}</TableCell>
                      <TableCell className={cn('text-right tabular', r.late && 'text-warning-ink')}>{r.acted}%</TableCell>
                      <TableCell className="text-right tabular">{r.accept}%</TableCell>
                      <TableCell className="text-right tabular text-muted-foreground">{r.lift}</TableCell>
                      <TableCell className="pr-5"><Sparkline values={r.trend} tone={r.late ? 'warning' : 'primary'} className="ml-auto" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Panel>
        </div>

        <Panel className="h-fit p-5">
          <PanelLabel>What we learned this month</PanelLabel>
          <ul className="mt-2">{LEARNED.map((l) => <li key={l} className="border-b border-border/70 py-3 text-[14px] last:border-0">{l}</li>)}</ul>
          <Link to="/guardrails" className="text-[13px] font-medium text-primary hover:underline">Change guardrails</Link>
        </Panel>
      </div>
    </Page>
  )
}
