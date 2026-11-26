import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Page } from '@/components/shell'
import { Kbd, Panel } from '@/components/bits'
import { Button } from '@/components/ui/button'

const GAPS = [
  ['Approving every plan one by one doesn\'t scale', 'Plans that pass every guardrail go out automatically. People see only exceptions, and similar plans are batched.', '/review'],
  ['Marketers "approving" rep visits', 'Field steps are suggestions the rep accepts, snoozes or declines. Their answer returns to the plan.', '/rep'],
  ['One precise impact number', 'Ranges with confidence and a "How we know" note. Step effects are combined, never added up.', '/plans/wagle-lab'],
  ['"Undo" after something was sent', 'A send queue: cancel each item until its send time. Sent items are final.', '/plans/bhattacharjee-guide'],
  ['On/off was the only edit', 'Change timing, swap approved content, add a step, or redraft with a note.', '/plans/wagle-lab'],
  ['Email cap ignored other plans', 'The cap counts every plan and brand. Conflicts offer a merge.', '/plans/sequeira-lab'],
  ['Unsafe reasons shown to reps', 'Reps see a reason that is safe to say out loud: no patient or lab data.', '/rep'],
  ['Rule changes with no governance', 'Guardrails replay the last 30 days, keep a version history and need approval.', '/guardrails'],
]

/* Editorial type for this reading page: serif headlines, small spaced mono labels. */
function Eyebrow({ children }: { children: ReactNode }) {
  return <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{children}</h3>
}

export default function About() {
  return (
    <Page title="About this concept">
      <div className="mx-auto max-w-[860px] space-y-10">
        <div>
          <p className="border-l-2 border-primary pl-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Concept prototype</p>
          <h2 className="mt-4 font-serif text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[56px]">Signal to Action</h2>
          <p className="mt-4 max-w-[680px] text-[18px] leading-relaxed text-muted-foreground">A concept for the screens where a pharma brand team decides what happens after a doctor-level signal: what goes out automatically, what needs a person, and what the rep sees.</p>
          <p className="mt-4 rounded-xl bg-card px-4 py-3 text-[14px]">Independent work by Viraj, built from public information for a Product Engineer (UI) application. Velora, every doctor, rep, NPI and number is fictional. Not affiliated with or endorsed by any company.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild><Link to="/">Open the prototype</Link></Button>
            <Button variant="outline" asChild><a href="docs/onepager.pdf" target="_blank" rel="noreferrer">One-pager (PDF)<ArrowUpRight className="size-4" /></a></Button>
            <Button variant="outline" asChild><a href="docs/spec.md" target="_blank" rel="noreferrer">Product spec<ArrowUpRight className="size-4" /></a></Button>
            <Button variant="outline" asChild><a href="docs/test-log.md" target="_blank" rel="noreferrer">Usability test plan<ArrowUpRight className="size-4" /></a></Button>
          </div>
        </div>

        <Panel className="p-6 sm:p-8">
          <Eyebrow>The problem</Eyebrow>
          <p className="mt-3 font-serif text-[22px] leading-snug sm:text-[26px]">Finding the signal isn't the hard part. Acting on it well within 48 hours is.</p>
          <p className="mt-3 text-[15px]">If every plan waits for a person, signals expire. If nothing does, trust breaks the first time a rule is missed. The design question: <b className="font-semibold">which decisions need a human, and how do we make those few fast and safe?</b></p>
        </Panel>

        <div>
          <h3 className="font-serif text-[28px] font-semibold leading-tight">What changed after I critiqued my first version</h3>
          <Panel className="mt-4 overflow-hidden">
            {GAPS.map(([gap, fix, to]) => (
              <Link key={gap} to={to} className="grid gap-1 border-b border-border/70 px-5 py-3.5 last:border-0 hover:bg-hover sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] sm:gap-6">
                <span className="text-[14px] text-muted-foreground">{gap}</span><span className="text-[14px]">{fix}</span>
              </Link>
            ))}
          </Panel>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Panel className="p-5">
            <Eyebrow>Try it</Eyebrow>
            <ul className="mt-3 space-y-2 text-[14px]">
              <li>Fix Dr. Wagle's consent issue and release the plan, then cancel the queued email.</li>
              <li>Merge Dr. Sequeira's conflicting plans.</li>
              <li>Accept the suggestion in the rep's view and see it back on the plan.</li>
              <li>Ask why Northeast dropped, then open the change in Guardrails.</li>
              <li>Simulate a CRM outage or an empty queue from the avatar menu.</li>
            </ul>
          </Panel>
          <Panel className="p-5">
            <Eyebrow>Keyboard</Eyebrow>
            <dl className="mt-3 grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 text-[14px]">
              <dt><Kbd>Ctrl K</Kbd></dt><dd>Search and jump</dd>
              <dt className="flex gap-1"><Kbd>G</Kbd><Kbd>R</Kbd></dt><dd>Go to Review (T, D, G, A, S for others)</dd>
              <dt className="flex gap-1"><Kbd>J</Kbd><Kbd>K</Kbd></dt><dd>Move through the queue</dd>
              <dt><Kbd>A</Kbd></dt><dd>Release plan or batch</dd>
              <dt><Kbd>R</Kbd></dt><dd>Redraft with a note</dd>
              <dt><Kbd>X</Kbd></dt><dd>Reject</dd>
            </dl>
          </Panel>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Panel className="p-5">
            <Eyebrow>New to pharma: what I'd verify first</Eyebrow>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[14px]">
              <li>Which plans truly need a human, and who signs off.</li>
              <li>How MLR approval and consent reach the platform, and how fresh they are.</li>
              <li>How CRM sync fails, and what reps see today.</li>
              <li>How lift is measured and how sure we can be.</li>
              <li>What the audit trail must show for compliance.</li>
            </ul>
          </Panel>
          <Panel className="p-5">
            <Eyebrow>How it's built</Eyebrow>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[14px]">
              <li>Designed first in Stitch from a written brief, then built with AI coding tools.</li>
              <li>React, TypeScript, Vite, Tailwind CSS and shadcn/ui (Radix).</li>
              <li>cmdk command menu, Sonner toasts, Recharts, Lucide icons, Zustand state.</li>
              <li>Keyboard-first, works at phone width, light and dark themes.</li>
            </ul>
          </Panel>
        </div>

        <Panel className="p-6 sm:p-8">
          <Eyebrow>30 / 60 / 90 days in the role</Eyebrow>
          <div className="mt-4 grid gap-6 sm:grid-cols-3 text-[14px]">
            <div><div className="font-serif text-[24px] font-semibold">30 days</div><p className="mt-1.5 text-muted-foreground">Know the product, UI team and roadmap; own the front-end backlog and a definition of ready.</p></div>
            <div><div className="font-serif text-[24px] font-semibold">60 days</div><p className="mt-1.5 text-muted-foreground">First AI prototype of a roadmap screen tested with three internal experts.</p></div>
            <div><div className="font-serif text-[24px] font-semibold">90 days</div><p className="mt-1.5 text-muted-foreground">That screen shipped to production; stories ready a sprint ahead.</p></div>
          </div>
        </Panel>
      </div>
    </Page>
  )
}
