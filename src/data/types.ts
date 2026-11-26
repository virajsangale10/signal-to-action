export type Channel = 'email' | 'ad' | 'webinar' | 'rep'

export interface ContentOption {
  id: string
  label: string
  approved: boolean
}

export interface TimingOption {
  label: string
  /** Hours from now until this step lands. null = the rep decides. */
  inHours: number | null
}

export interface Step {
  id: string
  channel: Channel
  title: string
  timing: string
  timingOptions: TimingOption[]
  contentId: string
  contentOptions: ContentOption[]
  include: boolean
  defaultInclude: boolean
  why: string
  /** Rough share of the plan's effect this step carries (0-1). Combined with diminishing returns, never added. */
  weight: number
}

export type Group = 'blocked' | 'conflict' | 'high' | 'expired'
export type PlanStatus = 'review' | 'released' | 'rejected' | 'dismissed'

export type QueueStatus =
  | 'queued' | 'sent' | 'cancelled'
  | 'delivered' | 'held' | 'accepted' | 'snoozed' | 'declined'
  | 'scheduled' | 'stopped'

export interface QueueItem {
  stepId: string
  channel: Channel
  title: string
  when: string
  contentId: string
  status: QueueStatus
  detail: string
}

export interface LogEntry {
  text: string
  at: string
  who: string
}

export interface Plan {
  id: string
  doctorId: string
  signal: string
  signalDetail: string
  /** Hours since the signal was detected. The window is 48h. */
  age: number
  priority: number
  breakdown: { label: string; value: number }[]
  group: Group
  reasonLine: string
  steps: Step[]
  status: PlanStatus
  /** Expected extra prescriptions per 100 similar doctors for the AI plan, as a range. */
  impact: [number, number]
  confidence: 'low' | 'medium' | 'high'
  conflict?: { signal: string; when: string; hasEmail: boolean; resolved?: 'merged' | 'cancelled' }
  queue?: QueueItem[]
  reject?: { reason: string; note: string; suppress: boolean }
  log: LogEntry[]
  redrafting?: boolean
  assignedTo?: string
  repResponse?: { status: 'accepted' | 'snoozed' | 'declined'; reason?: string }
}

export interface Touch {
  lane: 'signal' | 'rep' | 'email' | 'media' | 'event'
  /** Days relative to today: negative is past, positive is planned. */
  day: number
  label: string
  detail: string
  planned?: boolean
}

export interface Doctor {
  id: string
  name: string
  initials: string
  specialty: string
  city: string
  npi: string
  tier: string
  targetList: boolean
  emailConsent: boolean
  consentUpdated: string
  rep: { name: string; load: number; cap: number }
  emails30: number
  repVisitsMonth: number
  prefs: { label: string; value: number | null }[]
  touches: Touch[]
  repNote?: { text: string; by: string; on: string }
  rxTrend: number[]
}

export interface BatchDoctor {
  id: string
  name: string
  npi: string
  specialty: string
  city: string
  hoursLeft: number
  emails30: number
  rep: { name: string; load: number; cap: number }
  outlier?: string
}

export interface Batch {
  id: string
  title: string
  signal: string
  summary: string
  steps: { channel: Channel; title: string; detail: string; contentId: string }[]
  doctors: BatchDoctor[]
  status: 'review' | 'released'
  impact: [number, number]
  confidence: 'low' | 'medium' | 'high'
  released?: string[]
}
