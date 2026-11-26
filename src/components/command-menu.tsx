import { useNavigate } from 'react-router-dom'
import { BarChart3, ClipboardCheck, Layers, MessageSquare, RotateCcw, ShieldCheck, Smartphone, SunMedium, Unplug, UserRound, Users } from 'lucide-react'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from '@/components/ui/command'
import { useStore } from '@/store/useStore'
import { hoursLeft } from '@/lib/rules'
import { toast } from 'sonner'

export function CommandMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate()
  const plans = useStore((s) => s.plans)
  const doctors = useStore((s) => s.doctors)
  const batches = useStore((s) => s.batches)
  const crmDown = useStore((s) => s.crmDown)
  const run = (fn: () => void) => { onOpenChange(false); fn() }
  const go = (to: string) => run(() => navigate(to))

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Search or jump to" description="Find a doctor, a plan, a screen or a demo action">
      <CommandInput placeholder="Search doctors, plans, screens…" />
      <CommandList>
        <CommandEmpty>No results. Try a doctor's name or a screen.</CommandEmpty>
        <CommandGroup heading="Plans waiting for you">
          {plans.filter((p) => p.status === 'review').map((p) => {
            const d = doctors.find((x) => x.id === p.doctorId)!
            const h = hoursLeft(p)
            return (
              <CommandItem key={p.id} value={`${d.name} ${p.signal} plan`} onSelect={() => go(`/plans/${p.id}`)}>
                <ClipboardCheck />{d.name}<span className="text-muted-foreground">· {p.signal}</span>
                <CommandShortcut>{h <= 0 ? 'expired' : `${h}h left`}</CommandShortcut>
              </CommandItem>
            )
          })}
          {batches.filter((b) => b.status === 'review').map((b) => (
            <CommandItem key={b.id} value={`batch ${b.title}`} onSelect={() => go(`/review/batch/${b.id}`)}><Layers />{b.title}</CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Doctors">
          {doctors.map((d) => (
            <CommandItem key={d.id} value={`${d.name} ${d.specialty} ${d.city} doctor`} onSelect={() => go(`/doctors/${d.id}`)}>
              <UserRound />{d.name}<span className="text-muted-foreground">· {d.specialty} · {d.city}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Go to">
          <CommandItem onSelect={() => go('/')}><SunMedium />Today<CommandShortcut>G T</CommandShortcut></CommandItem>
          <CommandItem onSelect={() => go('/review')}><ClipboardCheck />Review queue<CommandShortcut>G R</CommandShortcut></CommandItem>
          <CommandItem onSelect={() => go('/doctors')}><Users />Doctors<CommandShortcut>G D</CommandShortcut></CommandItem>
          <CommandItem onSelect={() => go('/guardrails')}><ShieldCheck />Guardrails<CommandShortcut>G G</CommandShortcut></CommandItem>
          <CommandItem onSelect={() => go('/ask')}><MessageSquare />Ask about performance<CommandShortcut>G A</CommandShortcut></CommandItem>
          <CommandItem onSelect={() => go('/results')}><BarChart3 />Results<CommandShortcut>G S</CommandShortcut></CommandItem>
          <CommandItem onSelect={() => go('/rep')}><Smartphone />Rep's CRM view</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Demo">
          <CommandItem onSelect={() => run(() => { useStore.getState().setCrmDown(!crmDown); toast(crmDown ? 'CRM sync restored.' : 'CRM outage simulated. Rep suggestions will be held.') })}><Unplug />{crmDown ? 'Restore CRM sync' : 'Simulate CRM outage'}</CommandItem>
          <CommandItem onSelect={() => run(() => { useStore.getState().resetDemo(); toast('Demo reset.') })}><RotateCcw />Reset demo</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
