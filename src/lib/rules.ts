import type { Channel, Doctor, Plan } from '@/data/types'
import { EMAIL_CAP, WINDOW_HOURS } from '@/data/seed'

export type RuleState = 'pass' | 'fail' | 'warn' | 'na'

export type FixAction =
  | { type: 'removeChannel'; channel: Channel }
  | { type: 'swapContent'; stepId: string; contentId: string }
  | { type: 'mergeConflict' }
  | { type: 'cancelOther' }
  | { type: 'retryCrm' }

export interface Rule {
  key: string
  label: string
  state: RuleState
  value: string
  detail: string
  /** Short phrase for the decision header. */
  short?: string
  fix?: { label: string; action: FixAction }
}

export const hoursLeft = (p: Plan) => WINDOW_HOURS - p.age
export const isExpired = (p: Plan) => hoursLeft(p) <= 0
export const included = (p: Plan) => p.steps.filter((s) => s.include)
export const hasChannel = (p: Plan, c: Channel) => included(p).some((s) => s.channel === c)
export const editCount = (p: Plan) => p.steps.filter((s) => s.include !== s.defaultInclude).length

export function emailCount(p: Plan, d: Doctor) {
  const conflictEmail = p.conflict && !p.conflict.resolved && p.conflict.hasEmail ? 1 : 0
  return d.emails30 + (hasChannel(p, 'email') ? 1 : 0) + conflictEmail
}

export function checkPlan(p: Plan, d: Doctor, crmDown: boolean): Rule[] {
  const rules: Rule[] = []
  const inc = included(p)
  const email = hasChannel(p, 'email')
  const rep = hasChannel(p, 'rep')

  // 1. Approved content (MLR)
  const bad = inc.find((s) => !s.contentOptions.find((o) => o.id === s.contentId)?.approved)
  if (bad) {
    const alt = bad.contentOptions.find((o) => o.approved)
    rules.push({
      key: 'content', label: 'Approved content', state: 'fail', value: 'Failed',
      detail: `${bad.contentId} is still in medical-legal (MLR) review and can't be sent.`, short: `content ${bad.contentId} is in MLR review`,
      fix: alt ? { label: `Use approved ${alt.id}`, action: { type: 'swapContent', stepId: bad.id, contentId: alt.id } } : undefined,
    })
  } else rules.push({ key: 'content', label: 'Approved content', state: 'pass', value: 'Passed', detail: 'Every selected item is MLR-approved.' })

  // 2. Email consent
  if (!email) rules.push({ key: 'consent', label: 'Email consent', state: 'na', value: 'Not needed', detail: 'No email in this plan.' })
  else if (!d.emailConsent)
    rules.push({ key: 'consent', label: 'Email consent', state: 'fail', value: 'Failed', detail: `No email consent on file (updated ${d.consentUpdated}).`, short: 'no email consent on file', fix: { label: 'Remove email step', action: { type: 'removeChannel', channel: 'email' } } })
  else rules.push({ key: 'consent', label: 'Email consent', state: 'pass', value: 'On file', detail: `Consent updated ${d.consentUpdated}.` })

  // 3. Email cap across ALL plans for this doctor
  const count = emailCount(p, d)
  if (!email) rules.push({ key: 'cap', label: 'Email cap across all plans', state: 'na', value: `${d.emails30} of ${EMAIL_CAP}`, detail: 'No email in this plan.' })
  else if (count > EMAIL_CAP)
    rules.push({
      key: 'cap', label: 'Email cap across all plans', state: 'fail', value: `${count} of ${EMAIL_CAP}`, short: 'the email cap would be exceeded',
      detail: p.conflict && !p.conflict.resolved ? 'This plan and the queued one together go over the cap.' : `${d.emails30} emails already sent in 30 days.`,
      fix: p.conflict && !p.conflict.resolved ? { label: 'Merge into one plan', action: { type: 'mergeConflict' } } : { label: 'Remove email step', action: { type: 'removeChannel', channel: 'email' } },
    })
  else rules.push({ key: 'cap', label: 'Email cap across all plans', state: 'pass', value: `${count} of ${EMAIL_CAP}`, detail: 'Counts every plan and brand for this doctor.' })

  // 4. Rep capacity / CRM
  if (!rep) rules.push({ key: 'rep', label: 'Rep capacity', state: 'na', value: '—', detail: 'No rep suggestion in this plan.' })
  else if (crmDown) rules.push({ key: 'rep', label: 'Rep capacity', state: 'warn', value: 'Held', detail: 'CRM sync is down. The rep suggestion will wait; digital steps can still go.', fix: { label: 'Retry sync', action: { type: 'retryCrm' } } })
  else if (d.rep.load >= d.rep.cap) rules.push({ key: 'rep', label: 'Rep capacity', state: 'warn', value: `${d.rep.load} of ${d.rep.cap}`, detail: `${d.rep.name} is at the weekly limit. The suggestion waits until Monday.` })
  else rules.push({ key: 'rep', label: 'Rep capacity', state: 'pass', value: `${d.rep.load} of ${d.rep.cap}`, detail: `${d.rep.name} has room this week. The rep decides whether and when.` })

  // 5. Conflicts with other plans
  if (p.conflict && !p.conflict.resolved)
    rules.push({ key: 'conflict', label: 'Conflicts', state: 'fail', value: '1 conflict', short: 'it conflicts with another queued plan', detail: `A ${p.conflict.signal} plan is queued for ${p.conflict.when}.`, fix: { label: 'Merge into one plan', action: { type: 'mergeConflict' } } })
  else rules.push({ key: 'conflict', label: 'Conflicts', state: 'pass', value: p.conflict?.resolved === 'merged' ? 'Merged' : p.conflict?.resolved === 'cancelled' ? 'Resolved' : 'None', detail: 'No other plan overlaps this one.' })

  return rules
}

/** Diminishing returns: steps overlap, so their effects are combined, never added. */
export function impactRange(p: Plan): [number, number] {
  const f = (steps: { weight: number }[]) => 1 - steps.reduce((acc, s) => acc * (1 - s.weight), 1)
  const base = f(p.steps.filter((s) => s.defaultInclude)) || 1
  const now = f(included(p))
  const k = now / base
  return [Math.round(p.impact[0] * k * 10) / 10, Math.round(p.impact[1] * k * 10) / 10]
}

export function blockingCount(rules: Rule[]) {
  return rules.filter((r) => r.state === 'fail').length
}

/* ---------- guardrails replay (fictional model) ---------- */
export interface Guardrails {
  signal: string
  minPriority: number
  channels: Record<Channel, boolean>
  maxSteps: number
  emailCap: number
  repGap: number
  repMax: number
  release: 'review' | 'auto' | 'batch'
  autoBelow: number
  startDate: string
}

export const DEFAULT_GUARDRAILS: Guardrails = {
  signal: 'Lab result trend', minPriority: 70, channels: { email: true, ad: true, webinar: false, rep: true },
  maxSteps: 3, emailCap: 4, repGap: 48, repMax: 6, release: 'auto', autoBelow: 85, startDate: 'Dec 1',
}

const SIGNAL_BASE: Record<string, number> = { 'Lab result trend': 1240, 'Competitor search': 980, 'Publication download': 760, 'Peer adoption': 520 }

export function replay(g: Guardrails) {
  const base = SIGNAL_BASE[g.signal] ?? 1000
  const drafted = Math.round(base * Math.max(0.15, (100 - g.minPriority) / 30))
  const autoShare = g.release === 'auto' ? Math.min(0.92, 0.55 + (g.autoBelow - 70) / 60) : g.release === 'batch' ? 0.5 : 0
  const blockedFactor = g.channels.email ? ({ 3: 0.08, 4: 0.052, 5: 0.03, 6: 0.02 } as Record<number, number>)[g.emailCap] ?? 0.05 : 0
  const emailsBlocked = Math.round(drafted * blockedFactor)
  const repHeld = g.channels.rep ? Math.round(drafted * ({ 4: 0.04, 5: 0.022, 6: 0.011, 8: 0.004 } as Record<number, number>)[g.repMax]) : 0
  const autoReleased = Math.round(drafted * autoShare)
  const toReview = g.release === 'batch' ? Math.round((drafted - autoReleased) / 12) + Math.round(drafted * 0.08) : drafted - autoReleased
  const reviewPerDay = Math.round((toReview / 21 / 1.2) * 10) / 10
  const ch = g.channels
  const reach = 1 - (1 - (ch.email ? 0.3 : 0)) * (1 - (ch.ad ? 0.12 : 0)) * (1 - (ch.webinar ? 0.1 : 0)) * (1 - (ch.rep ? 0.42 : 0))
  const timeliness = g.release === 'review' ? 0.86 : g.release === 'batch' ? 0.93 : 0.97
  const mid = 3.4 * reach * timeliness * Math.min(g.maxSteps, 4) / 3 * (1 - emailsBlocked / Math.max(drafted, 1) * 0.5)
  return {
    drafted, autoReleased, toReview, emailsBlocked, repHeld, reviewPerDay,
    lift: [Math.round(mid * 0.72 * 10) / 10, Math.round(mid * 1.25 * 10) / 10] as [number, number],
  }
}
