import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { BarChart3, CircleHelp, ClipboardCheck, Menu, MessageSquare, Monitor, Moon, RotateCcw, Search, ShieldCheck, Smartphone, Sun, SunMedium, Unplug, Users, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, Kbd } from '@/components/bits'
import { CURRENT_USER } from '@/data/seed'
import { useStore } from '@/store/useStore'
import { useReviewCount } from '@/lib/selectors'
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { CommandMenu } from '@/components/command-menu'
import { toast } from 'sonner'

const NAV = [
  { to: '/', label: 'Today', icon: SunMedium, key: 't' },
  { to: '/review', label: 'Review', icon: ClipboardCheck, key: 'r', count: true },
  { to: '/doctors', label: 'Doctors', icon: Users, key: 'd' },
  { to: '/guardrails', label: 'Guardrails', icon: ShieldCheck, key: 'g' },
  { to: '/ask', label: 'Ask', icon: MessageSquare, key: 'a' },
  { to: '/results', label: 'Results', icon: BarChart3, key: 's' },
]

type Theme = 'light' | 'dark' | 'system'
function useTheme(): [Theme, (t: Theme) => void] {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('sta-theme') as Theme) || 'light')
  useEffect(() => {
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
      document.documentElement.classList.toggle('dark', dark)
    }
    apply(); try { localStorage.setItem('sta-theme', theme) } catch { /* private mode */ }
    const mq = matchMedia('(prefers-color-scheme: dark)'); mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [theme])
  return [theme, setTheme]
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const count = useReviewCount()
  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pt-5 pb-6">
        <div className="text-[15px] font-semibold tracking-[-0.01em]">Signal to Action</div>
        <div className="text-xs text-muted-foreground">Velora · Heart failure</div>
      </div>
      <nav aria-label="Main" className="flex flex-col gap-0.5 px-3">
        {NAV.map(({ to, label, icon: Icon, count: showCount }) => (
          <NavLink key={to} to={to} end={to === '/'} onClick={onNavigate}
            className={({ isActive }) => cn('group flex h-9 items-center gap-3 rounded-lg px-3 text-[14px] transition-colors',
              isActive ? 'bg-accent font-medium text-accent-foreground' : 'text-foreground/85 hover:bg-hover')}>
            <Icon className="size-[17px]" strokeWidth={1.6} aria-hidden />
            <span className="flex-1">{label}</span>
            {showCount && count > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-muted px-1.5 text-[11px] font-medium text-muted-foreground tabular">{count}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto px-3 pb-3">
        <NavLink to="/rep" onClick={onNavigate} className={({ isActive }) => cn('flex h-9 items-center gap-3 rounded-lg px-3 text-[13px] text-muted-foreground hover:bg-hover', isActive && 'bg-accent text-accent-foreground')}>
          <Smartphone className="size-4" strokeWidth={1.6} aria-hidden />Rep's CRM view
        </NavLink>
        <NavLink to="/about" onClick={onNavigate} className={({ isActive }) => cn('flex h-9 items-center gap-3 rounded-lg px-3 text-[13px] text-muted-foreground hover:bg-hover', isActive && 'bg-accent text-accent-foreground')}>
          <CircleHelp className="size-4" strokeWidth={1.6} aria-hidden />About this concept
        </NavLink>
        <div className="mt-2 flex items-center gap-3 border-t border-border px-2 pt-3">
          <Avatar initials={CURRENT_USER.initials} size="sm" />
          <div className="leading-tight"><div className="text-[13px] font-medium">{CURRENT_USER.name}</div><div className="text-xs text-muted-foreground">{CURRENT_USER.role}</div></div>
        </div>
      </div>
    </div>
  )
}

export function AppShell() {
  const [open, setOpen] = useState(false)
  const [cmd, setCmd] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let g = false, timer = 0
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmd((v) => !v); return }
      const el = e.target as HTMLElement
      if (el.closest('input, textarea, select, [contenteditable=true], [role=dialog], [role=menu], [role=listbox]') || e.ctrlKey || e.metaKey || e.altKey) return
      const k = e.key.toLowerCase()
      if (g) {
        g = false; window.clearTimeout(timer)
        const item = NAV.find((n) => n.key === k)
        if (item) { e.preventDefault(); navigate(item.to) }
        return
      }
      if (k === 'g') { g = true; timer = window.setTimeout(() => { g = false }, 900) }
      if (k === '/') { e.preventDefault(); setCmd(true) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="frosted sticky top-0 hidden h-dvh border-r border-border bg-sidebar lg:block">
        <SidebarNav />
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[260px] bg-card p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">Main sections of the app</SheetDescription>
          <SidebarNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="min-w-0">
        <ShellContext.Provider value={{ openMenu: () => setOpen(true), openCommand: () => setCmd(true) }}>
          <Outlet />
        </ShellContext.Provider>
      </div>
      <CommandMenu open={cmd} onOpenChange={setCmd} />
    </div>
  )
}

const ShellContext = createContext({ openMenu: () => {}, openCommand: () => {} })

function UserMenu() {
  const [theme, setTheme] = useTheme()
  const crmDown = useStore((s) => s.crmDown)
  const emptyQueue = useStore((s) => s.emptyQueue)
  const { setCrmDown, setEmptyQueue, resetDemo } = useStore.getState()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50" aria-label="Account and demo settings">
        <Avatar initials={CURRENT_USER.initials} size="sm" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal"><div className="text-sm font-medium">{CURRENT_USER.name}</div><div className="text-xs text-muted-foreground">{CURRENT_USER.role} · fictional</div></DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Appearance</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as Theme)}>
          <DropdownMenuRadioItem value="light"><Sun className="size-4" />Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark"><Moon className="size-4" />Dark</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system"><Monitor className="size-4" />System</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Demo states</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked={crmDown} onCheckedChange={(v) => { setCrmDown(!!v); toast(v ? 'CRM outage simulated. Rep suggestions will be held.' : 'CRM sync restored.') }}><Unplug className="size-4" />Simulate CRM outage</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={emptyQueue} onCheckedChange={(v) => setEmptyQueue(!!v)}><Inbox className="size-4" />Show empty review queue</DropdownMenuCheckboxItem>
        <DropdownMenuItem onSelect={() => { resetDemo(); toast('Demo reset to the start of the day.') }}><RotateCcw className="size-4" />Reset demo</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function Page({ title, children, actions, wide }: { title: ReactNode; children: ReactNode; actions?: ReactNode; wide?: boolean }) {
  const { openMenu, openCommand } = useContext(ShellContext)
  const crmDown = useStore((s) => s.crmDown)
  useEffect(() => { document.title = `${typeof title === 'string' ? title : 'Signal to Action'} · Signal to Action` }, [title])
  return (
    <>
      <header className="frosted sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 sm:px-8">
        <button className="-ml-1 grid size-9 place-items-center rounded-lg hover:bg-hover lg:hidden" onClick={openMenu} aria-label="Open navigation"><Menu className="size-5" strokeWidth={1.6} /></button>
        <h1 className="min-w-0 flex-1 truncate text-[17px] font-semibold tracking-[-0.01em]">{title}</h1>
        {actions}
        <button onClick={openCommand} className="hidden h-9 w-64 items-center gap-2 rounded-[10px] border border-border bg-card px-3 text-left text-[13px] text-muted-foreground transition-colors hover:border-input md:flex" aria-label="Search doctors and plans">
          <Search className="size-4" strokeWidth={1.6} /><span className="flex-1">Search doctors, plans…</span><Kbd>Ctrl K</Kbd>
        </button>
        <button onClick={openCommand} className="grid size-9 place-items-center rounded-lg hover:bg-hover md:hidden" aria-label="Search"><Search className="size-5" strokeWidth={1.6} /></button>
        <NavLink to="/about" className="hidden h-7 items-center rounded-full border border-border bg-muted px-3 text-xs text-muted-foreground hover:text-foreground sm:inline-flex">Concept · fictional data</NavLink>
        <UserMenu />
      </header>
      {crmDown && (
        <div role="status" className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-warning/30 bg-warning-soft px-4 py-2 text-[13px] text-warning-ink sm:px-8">
          <Unplug className="size-4" aria-hidden /><b className="font-semibold">CRM sync failed at 09:42.</b><span>Digital steps can still be released. Rep suggestions are held until sync is back.</span>
          <button className="ml-auto font-medium underline underline-offset-2" onClick={() => { useStore.getState().setCrmDown(false); toast('CRM sync restored. Held suggestions are being delivered.') }}>Retry sync</button>
        </div>
      )}
      <main className={cn('mx-auto px-4 pb-28 pt-6 sm:px-8 sm:pt-8', wide ? 'max-w-[1400px]' : 'max-w-[1240px]')}>{children}</main>
    </>
  )
}
