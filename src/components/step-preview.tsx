import { Lock } from 'lucide-react'
import type { Doctor, Plan, Step } from '@/data/types'
import { included } from '@/lib/rules'
import { CHANNEL_LABEL } from '@/components/bits'

/** What each step will actually look like, so the reviewer approves the real thing. */
export function StepPreview({ step, doctor, plan }: { step: Step; doctor: Doctor; plan: Plan }) {
  const content = step.contentOptions.find((o) => o.id === step.contentId)
  if (step.channel === 'email') {
    const mods = [
      { id: 'VEL-M-12', text: 'Velora is a once-daily treatment for adults with chronic heart failure with reduced ejection fraction.' },
      { id: 'VEL-M-18', text: 'The titration guide shows how patients in the VELORA-HF study reached their target dose.' },
      { id: 'VEL-M-30', text: 'Download the titration guide · Request a visit from your Velora representative' },
      { id: 'VEL-ISI-03', text: 'Important Safety Information is attached to every email.' },
    ]
    return (
      <div className="space-y-2 text-[13px]">
        <div className="text-muted-foreground">To {doctor.name} · From Velora Medical Information · Subject: <span className="text-foreground">{content?.label}</span></div>
        <div className="rounded-lg border-l-[3px] border-primary bg-accent px-3 py-2"><div className="text-[11px] font-medium text-accent-foreground">Personalised field</div>Dear {doctor.name},</div>
        {mods.map((m) => (
          <div key={m.id} className="rounded-lg border-l-[3px] border-success bg-success-soft/60 px-3 py-2">
            <div className="flex items-center gap-1 text-[11px] font-medium text-success-ink"><Lock className="size-3" />{m.id} · locked</div>{m.text}
          </div>
        ))}
        <p className="pt-1 text-xs text-muted-foreground">Green blocks are MLR-approved and locked. The AI can choose and order them, never rewrite them.</p>
      </div>
    )
  }
  if (step.channel === 'rep') {
    const digital = included(plan).filter((s) => s.channel !== 'rep').map((s) => CHANNEL_LABEL[s.channel].toLowerCase())
    return (
      <div className="max-w-sm rounded-2xl border border-border bg-card p-4 text-[13px] shadow-sm">
        <div className="flex justify-between text-xs text-muted-foreground"><span>CRM · suggestion for {doctor.rep.name}</span><span>{doctor.rep.load + 1} of {doctor.rep.cap} this week</span></div>
        <div className="mt-2 text-[15px] font-semibold">Discuss the titration guide</div>
        <div className="text-muted-foreground">{doctor.name} · {doctor.city}</div>
        <ul className="mt-2 list-disc space-y-0.5 pl-4">
          <li>Reason: recent interest in heart-failure dosing in your territory</li>
          <li>Approved talking points {step.contentId}</li>
          <li>Marketing will send: {digital.length ? digital.join(', ') : 'nothing this week'}</li>
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">The rep never sees patient or lab data. The reason is written to be safe to say.</p>
      </div>
    )
  }
  if (step.channel === 'ad') {
    return (
      <div className="flex items-center gap-4 text-[13px]">
        <div className="flex aspect-[300/250] w-32 flex-col justify-between rounded-lg bg-primary p-2.5 text-[10px] text-primary-foreground">
          <span className="font-semibold tracking-wide">VELORA</span><span className="text-[13px] font-semibold leading-tight">Reaching target dose, step by step</span><span>Important Safety Information</span>
        </div>
        <div><div className="font-medium">{step.contentId} · 300×250</div><div className="text-muted-foreground">{content?.label}</div><div className="text-muted-foreground">Up to 3 views a week. Runs on journals the doctor reads.</div></div>
      </div>
    )
  }
  return <div className="text-[13px]"><div className="font-medium">HF dosing webinar · Dec 10, 12:00 CT</div><div className="text-muted-foreground">Speaker: practising cardiologist (paid, disclosed). One-click registration. Meal not provided, so no transfer-of-value report.</div></div>
}
