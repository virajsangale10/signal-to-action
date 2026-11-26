import type { ReactNode } from 'react'
import { Mail, Monitor, UserRound, Video } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Channel } from '@/data/types'
import { WINDOW_HOURS } from '@/data/seed'

export function Kbd({ children, className, inverted }: { children: ReactNode; className?: string; inverted?: boolean }) {
  return (
    <kbd className={cn(
      'hidden h-5 min-w-5 items-center sm:inline-flex justify-center rounded-[5px] border px-1 font-sans text-[11px] font-medium leading-none',
      inverted ? 'border-white/40 bg-white/15 text-white dark:border-black/20 dark:bg-black/10 dark:text-primary-foreground' : 'border-border bg-card text-muted-foreground shadow-[0_1px_0_var(--border)]',
      className,
    )}>{children}</kbd>
  )
}

export type Tone = 'success' | 'warning' | 'danger' | 'accent' | 'neutral'
const toneCls: Record<Tone, string> = {
  success: 'bg-success-soft text-success-ink',
  warning: 'bg-warning-soft text-warning-ink',
  danger: 'bg-danger-soft text-danger-ink',
  accent: 'bg-accent text-accent-foreground',
  neutral: 'bg-muted text-muted-foreground border border-border',
}
const dotCls: Record<Tone, string> = { success: 'bg-success', warning: 'bg-warning', danger: 'bg-danger', accent: 'bg-primary', neutral: 'bg-tertiary' }

export function Pill({ tone = 'neutral', children, dot = true, className }: { tone?: Tone; children: ReactNode; dot?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex h-6 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-xs font-medium', toneCls[tone], className)}>
      {dot && <span className={cn('size-1.5 rounded-full', dotCls[tone])} aria-hidden />}
      {children}
    </span>
  )
}

export function TimeLeft({ hours, className }: { hours: number; className?: string }) {
  const expired = hours <= 0
  const tone = expired || hours <= 6 ? 'text-danger-ink' : hours <= 14 ? 'text-warning-ink' : 'text-muted-foreground'
  const bar = expired || hours <= 6 ? 'bg-danger' : hours <= 14 ? 'bg-warning' : 'bg-muted-foreground/60'
  const used = Math.min(100, Math.max(4, ((WINDOW_HOURS - hours) / WINDOW_HOURS) * 100))
  return (
    <div className={cn('w-[54px] text-right', className)} aria-label={expired ? 'Expired' : `${hours} hours left of 48`}>
      <div className={cn('text-xs font-medium tabular', tone)}>{expired ? 'Expired' : `${hours}h left`}</div>
      <div className="mt-1 h-[3px] rounded-full bg-border"><div className={cn('h-full rounded-full', bar)} style={{ width: `${expired ? 100 : used}%` }} /></div>
    </div>
  )
}

export const CHANNEL_LABEL: Record<Channel, string> = { email: 'Email', ad: 'Journal ad', webinar: 'Webinar', rep: 'Rep suggestion' }
export const CHANNEL_ICON: Record<Channel, typeof Mail> = { email: Mail, ad: Monitor, webinar: Video, rep: UserRound }

export function ChannelBadge({ channel, size = 'md' }: { channel: Channel; size?: 'sm' | 'md' }) {
  const Icon = CHANNEL_ICON[channel]
  return (
    <span className={cn('grid shrink-0 place-items-center rounded-lg', size === 'md' ? 'size-8' : 'size-6 rounded-md',
      channel === 'rep' ? 'bg-success-soft text-success-ink' : 'bg-accent text-accent-foreground')} aria-hidden>
      <Icon className={size === 'md' ? 'size-4' : 'size-3.5'} strokeWidth={1.75} />
    </span>
  )
}

export function Panel({ className, children, ...rest }: React.ComponentProps<'section'>) {
  return <section className={cn('rounded-[14px] border border-border/80 bg-card', className)} {...rest}>{children}</section>
}

export function PanelLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn('text-[13px] font-semibold text-muted-foreground tracking-normal', className)}>{children}</h3>
}

export function Avatar({ initials, size = 'md' }: { initials: string; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <span className={cn('grid shrink-0 place-items-center rounded-full bg-accent font-semibold text-accent-foreground ring-1 ring-primary/15',
      size === 'sm' && 'size-8 text-[11px]', size === 'md' && 'size-9 text-xs', size === 'lg' && 'size-14 text-lg')}>{initials}</span>
  )
}

export function Stat({ label, value, foot, footTone }: { label: string; value: ReactNode; foot?: ReactNode; footTone?: 'success' | 'warning' | 'muted' }) {
  return (
    <Panel className="p-4">
      <div className="text-[13px] text-muted-foreground">{label}</div>
      <div className="mt-1 text-[32px] font-semibold leading-tight tracking-[-0.02em] tabular">{value}</div>
      {foot && <div className={cn('mt-1 flex items-center gap-1 text-[13px]', footTone === 'success' && 'text-success-ink', footTone === 'warning' && 'text-warning-ink', (!footTone || footTone === 'muted') && 'text-muted-foreground')}>{foot}</div>}
    </Panel>
  )
}

export function Meter({ value, label, right }: { value: number | null; label: string; right?: ReactNode }) {
  return (
    <div className="py-1.5">
      <div className="flex justify-between text-[13px]"><span>{label}</span><span className="text-muted-foreground tabular">{right ?? (value == null ? 'n/a' : `${value}%`)}</span></div>
      <div className="mt-1.5 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${value ?? 0}%` }} /></div>
    </div>
  )
}

export function Sparkline({ values, tone = 'primary', className }: { values: number[]; tone?: 'primary' | 'warning'; className?: string }) {
  const w = 64, h = 20, min = Math.min(...values), max = Math.max(...values), r = max - min || 1
  const d = values.map((v, i) => `${i ? 'L' : 'M'}${((i / (values.length - 1)) * w).toFixed(1)},${(h - 2 - ((v - min) / r) * (h - 4)).toFixed(1)}`).join('')
  return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className={className} aria-hidden><path d={d} fill="none" stroke={tone === 'warning' ? 'var(--warning)' : 'var(--primary)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export function range(r: [number, number]) {
  const f = (n: number) => `${n >= 0 ? '+' : '−'}${Math.abs(n).toFixed(1)}`
  return `${f(r[0])} to ${f(r[1])}`
}
