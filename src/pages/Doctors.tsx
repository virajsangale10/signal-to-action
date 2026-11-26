import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Search } from 'lucide-react'
import { Page } from '@/components/shell'
import { Avatar, Panel, Pill } from '@/components/bits'
import { Input } from '@/components/ui/input'
import { useStore } from '@/store/useStore'
import { EMAIL_CAP } from '@/data/seed'

export default function Doctors() {
  const doctors = useStore((s) => s.doctors)
  const plans = useStore((s) => s.plans)
  const [q, setQ] = useState('')
  const list = useMemo(() => doctors.filter((d) => `${d.name} ${d.specialty} ${d.city}`.toLowerCase().includes(q.toLowerCase().trim())), [doctors, q])
  return (
    <Page title="Doctors">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h2 className="text-[28px] font-semibold tracking-[-0.025em]">Doctors</h2><p className="text-[14px] text-muted-foreground">Everyone with a signal or a plan this month. Fictional.</p></div>
        <label className="relative w-full sm:w-72"><span className="sr-only">Search doctors</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, specialty or city" className="h-9 rounded-[10px] bg-card pl-9" />
        </label>
      </div>
      <Panel className="mt-5 overflow-hidden">
        {list.length ? list.map((d) => {
          const open = plans.filter((p) => p.doctorId === d.id && p.status === 'review').length
          return (
            <Link key={d.id} to={`/doctors/${d.id}`} className="flex items-center gap-4 border-b border-border/70 px-5 py-3 last:border-0 hover:bg-hover">
              <Avatar initials={d.initials} />
              <div className="min-w-0 flex-1">
                <div className="font-medium">{d.name}</div>
                <div className="truncate text-[13px] text-muted-foreground">{d.specialty} · {d.city} · Rep {d.rep.name}</div>
              </div>
              <span className="hidden text-[13px] text-muted-foreground tabular md:inline">Emails {d.emails30} of {EMAIL_CAP}</span>
              {!d.targetList && <Pill tone="neutral" className="hidden sm:inline-flex">Not on target list</Pill>}
              {!d.emailConsent && <Pill tone="danger" className="hidden sm:inline-flex">No email consent</Pill>}
              {open > 0 && <Pill tone="accent">{open} open plan{open > 1 ? 's' : ''}</Pill>}
              <ChevronRight className="size-4 text-tertiary" aria-hidden />
            </Link>
          )
        }) : <p className="px-5 py-10 text-center text-[14px] text-muted-foreground">No doctors match “{q}”.</p>}
      </Panel>
    </Page>
  )
}
