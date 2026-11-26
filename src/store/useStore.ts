import { create } from 'zustand'
import { BATCHES, CURRENT_USER, DOCTORS, PLANS } from '@/data/seed'
import type { Batch, Channel, Doctor, Plan, QueueItem, Step } from '@/data/types'
import { DEFAULT_GUARDRAILS, type FixAction, type Guardrails, included } from '@/lib/rules'

const clone = <T,>(v: T): T => structuredClone(v)
let tick = 42
/** Demo clock: starts at 10:42 and moves a minute per action so the log reads naturally. */
const now = () => { tick += 1; const h = 10 + Math.floor(tick / 60), m = tick % 60; return `${h}:${String(m).padStart(2, '0')}` }
const me = CURRENT_USER.name

const NEW_STEP: Record<Channel, Omit<Step, 'id'>> = {
  email: { channel: 'email', title: 'Clinical data email', timing: 'Tomorrow 9:00 am', timingOptions: [{ label: 'Tomorrow 9:00 am', inHours: 22 }, { label: 'Today 4:00 pm', inHours: 5 }], contentId: 'VEL-EM-198', contentOptions: [{ id: 'VEL-EM-198', label: 'Titration guide summary', approved: true }], include: true, defaultInclude: false, why: 'Added by you', weight: 0.3 },
  ad: { channel: 'ad', title: 'Programmatic journal ad', timing: 'Starts tomorrow · runs 7 days', timingOptions: [{ label: 'Starts tomorrow · runs 7 days', inHours: 20 }], contentId: 'VEL-AD-118', contentOptions: [{ id: 'VEL-AD-118', label: 'JACC Heart Failure banner', approved: true }], include: true, defaultInclude: false, why: 'Added by you', weight: 0.15 },
  webinar: { channel: 'webinar', title: 'Invite to HF dosing webinar, Dec 10', timing: 'Tomorrow 10:00 am', timingOptions: [{ label: 'Tomorrow 10:00 am', inHours: 23 }], contentId: 'VEL-WB-005', contentOptions: [{ id: 'VEL-WB-005', label: 'HF dosing webinar invite', approved: true }], include: true, defaultInclude: false, why: 'Added by you', weight: 0.12 },
  rep: { channel: 'rep', title: 'Suggestion to rep · rep decides', timing: 'Rep decides timing', timingOptions: [{ label: 'Rep decides timing', inHours: null }], contentId: 'VEL-REP-092', contentOptions: [{ id: 'VEL-REP-092', label: 'Titration discussion guide', approved: true }], include: true, defaultInclude: false, why: 'Added by you', weight: 0.45 },
}

function queueFor(p: Plan, d: Doctor, crmDown: boolean): QueueItem[] {
  return included(p).map((s) => {
    if (s.channel === 'rep') return { stepId: s.id, channel: s.channel, title: `Rep suggestion to ${d.rep.name}`, when: 'Rep decides', contentId: s.contentId, status: crmDown ? 'held' : 'delivered', detail: crmDown ? 'Held until CRM sync is back' : `Delivered at ${now()} · waiting for the rep` }
    if (s.channel === 'ad') return { stepId: s.id, channel: s.channel, title: 'Journal display ad · runs Dec 1–7', when: s.timing, contentId: s.contentId, status: 'scheduled', detail: `Scheduled for ${s.contentOptions.find((o) => o.id === s.contentId)?.label ?? 'placement'}` }
    return { stepId: s.id, channel: s.channel, title: `${s.timing} · ${s.title}`, when: s.timing, contentId: s.contentId, status: 'queued', detail: 'Queued · you can cancel until the send time' }
  })
}

interface State {
  doctors: Doctor[]
  plans: Plan[]
  batches: Batch[]
  crmDown: boolean
  emptyQueue: boolean
  guardrails: Guardrails
  savedGuardrails: Guardrails
  guardrailsSubmitted: boolean
  version: number
  // plan editing
  toggleStep: (planId: string, stepId: string, on: boolean) => void
  setTiming: (planId: string, stepId: string, label: string) => void
  setContent: (planId: string, stepId: string, contentId: string) => void
  addStep: (planId: string, channel: Channel) => void
  resetPlan: (planId: string) => void
  applyFix: (planId: string, a: FixAction) => void
  redraft: (planId: string, note: string) => Promise<void>
  // decisions
  release: (planId: string) => void
  undoRelease: (planId: string) => void
  reject: (planId: string, reason: string, note: string, suppress: boolean) => void
  undoReject: (planId: string) => void
  dismiss: (planId: string) => void
  assign: (planId: string, who: string) => void
  cancelItem: (planId: string, stepId: string) => void
  repRespond: (planId: string, status: 'accepted' | 'snoozed' | 'declined', reason?: string) => void
  releaseBatch: (batchId: string, ids: string[]) => void
  undoBatch: (batchId: string) => void
  // guardrails
  setGuardrails: (g: Partial<Guardrails>) => void
  discardGuardrails: () => void
  submitGuardrails: () => void
  // demo
  setCrmDown: (v: boolean) => void
  setEmptyQueue: (v: boolean) => void
  resetDemo: () => void
}

const initial = () => ({
  doctors: clone(DOCTORS), plans: clone(PLANS), batches: clone(BATCHES), crmDown: false, emptyQueue: false,
  guardrails: { ...DEFAULT_GUARDRAILS }, savedGuardrails: { ...DEFAULT_GUARDRAILS }, guardrailsSubmitted: false, version: 7,
})

export const useStore = create<State>()((set, get) => {
  const edit = (planId: string, fn: (p: Plan) => void) =>
    set((s) => ({ plans: s.plans.map((p) => { if (p.id !== planId) return p; const c = clone(p); fn(c); return c }) }))
  const doctorOf = (p: Plan) => get().doctors.find((d) => d.id === p.doctorId)!

  return {
    ...initial(),

    toggleStep: (planId, stepId, on) => edit(planId, (p) => { const s = p.steps.find((x) => x.id === stepId)!; s.include = on }),
    setTiming: (planId, stepId, label) => edit(planId, (p) => { const s = p.steps.find((x) => x.id === stepId)!; s.timing = label }),
    setContent: (planId, stepId, contentId) => edit(planId, (p) => { const s = p.steps.find((x) => x.id === stepId)!; s.contentId = contentId }),
    addStep: (planId, channel) => edit(planId, (p) => {
      const base = clone(NEW_STEP[channel])
      if (channel === 'rep') { const d = doctorOf(p); base.title = `Suggestion to rep ${d.rep.name} (${d.rep.load} of ${d.rep.cap} this week) · rep decides` }
      p.steps.push({ ...base, id: `${p.id}-${channel}-${p.steps.length}` })
      p.log.unshift({ text: `Added ${channel === 'ad' ? 'journal ad' : channel} step`, at: now(), who: me })
    }),
    resetPlan: (planId) => edit(planId, (p) => {
      const orig = PLANS.find((x) => x.id === planId)!
      p.steps = clone(orig.steps); p.conflict = clone(orig.conflict)
    }),
    applyFix: (planId, a) => {
      if (a.type === 'retryCrm') { set({ crmDown: false }); return }
      edit(planId, (p) => {
        if (a.type === 'removeChannel') { p.steps.forEach((s) => { if (s.channel === a.channel) s.include = false }); p.log.unshift({ text: `Removed ${a.channel} step to pass rules`, at: now(), who: me }) }
        if (a.type === 'swapContent') { const s = p.steps.find((x) => x.id === a.stepId)!; s.contentId = a.contentId; p.log.unshift({ text: `Swapped content to ${a.contentId}`, at: now(), who: me }) }
        if (a.type === 'mergeConflict' && p.conflict) { p.conflict.resolved = 'merged'; p.log.unshift({ text: `Merged with the ${p.conflict.signal} plan: one email instead of two`, at: now(), who: me }) }
        if (a.type === 'cancelOther' && p.conflict) { p.conflict.resolved = 'cancelled'; p.log.unshift({ text: `Cancelled the queued ${p.conflict.signal} plan`, at: now(), who: me }) }
      })
    },
    redraft: async (planId, note) => {
      edit(planId, (p) => { p.redrafting = true })
      await new Promise((r) => setTimeout(r, 1100))
      edit(planId, (p) => {
        const n = note.toLowerCase()
        if (/no email|skip email|without email|conference|away/.test(n)) p.steps.forEach((s) => { if (s.channel === 'email') s.include = false })
        else if (/later|next week|delay|wait/.test(n)) p.steps.forEach((s) => { const last = s.timingOptions[s.timingOptions.length - 1]; s.timing = last.label })
        else if (/rep|field|visit/.test(n)) p.steps.forEach((s) => { s.include = s.channel === 'rep' || s.channel === 'ad' })
        else { const opt = p.steps.find((s) => s.include && s.timingOptions.length > 1); if (opt) opt.timing = opt.timingOptions[1].label }
        p.redrafting = false
        p.log.unshift({ text: `Redrafted with your note: “${note}”`, at: now(), who: me })
      })
    },

    release: (planId) => {
      const p = get().plans.find((x) => x.id === planId)!
      const q = queueFor(p, doctorOf(p), get().crmDown)
      edit(planId, (x) => { x.status = 'released'; x.queue = q; const n = x.steps.filter((s) => s.include !== s.defaultInclude).length; x.log.unshift({ text: `Released by ${me}${n ? ` · ${n} change${n > 1 ? 's' : ''} from the AI plan` : ''}`, at: now(), who: me }) })
    },
    undoRelease: (planId) => edit(planId, (p) => { p.status = 'review'; p.queue = undefined; p.log.shift() }),
    reject: (planId, reason, note, suppress) => edit(planId, (p) => { p.status = 'rejected'; p.reject = { reason, note, suppress }; p.log.unshift({ text: `Rejected: ${reason}${note ? ` · “${note}”` : ''}${suppress ? ' · suppressed 30 days' : ''}`, at: now(), who: me }) }),
    undoReject: (planId) => edit(planId, (p) => { p.status = 'review'; p.reject = undefined; p.log.shift() }),
    dismiss: (planId) => edit(planId, (p) => { p.status = 'dismissed'; p.log.unshift({ text: 'Dismissed: expired before review', at: now(), who: me }) }),
    assign: (planId, who) => edit(planId, (p) => { p.assignedTo = who; p.log.unshift({ text: `Assigned to ${who}`, at: now(), who: me }) }),
    cancelItem: (planId, stepId) => edit(planId, (p) => {
      const it = p.queue?.find((q) => q.stepId === stepId); if (!it) return
      it.status = it.status === 'scheduled' ? 'stopped' : 'cancelled'; it.detail = `${it.status === 'stopped' ? 'Stopped' : 'Cancelled'} by you at ${now()}`
      p.log.unshift({ text: `${it.status === 'stopped' ? 'Stopped' : 'Cancelled'} ${it.channel === 'ad' ? 'journal ad' : it.channel}`, at: now(), who: me })
    }),
    repRespond: (planId, status, reason) => edit(planId, (p) => {
      p.repResponse = { status, reason }
      const it = p.queue?.find((q) => q.channel === 'rep'); if (it) { it.status = status; it.detail = `${status[0].toUpperCase() + status.slice(1)} by ${doctorOf(p).rep.name}${reason ? ` · ${reason}` : ''}` }
      p.log.unshift({ text: `Rep ${status}${reason ? `: ${reason}` : ''}`, at: now(), who: doctorOf(p).rep.name })
    }),
    releaseBatch: (batchId, ids) => set((s) => ({ batches: s.batches.map((b) => b.id === batchId ? { ...b, status: 'released', released: ids } : b) })),
    undoBatch: (batchId) => set((s) => ({ batches: s.batches.map((b) => b.id === batchId ? { ...b, status: 'review', released: undefined } : b) })),

    setGuardrails: (g) => set((s) => ({ guardrails: { ...s.guardrails, ...g }, guardrailsSubmitted: false })),
    discardGuardrails: () => set((s) => ({ guardrails: { ...s.savedGuardrails } })),
    submitGuardrails: () => set({ guardrailsSubmitted: true }),

    setCrmDown: (v) => set({ crmDown: v }),
    setEmptyQueue: (v) => set({ emptyQueue: v }),
    resetDemo: () => { tick = 42; set(initial()) },
  }
})

export const useDoctor = (id?: string) => useStore((s) => s.doctors.find((d) => d.id === id))
export const usePlan = (id?: string) => useStore((s) => s.plans.find((p) => p.id === id))
