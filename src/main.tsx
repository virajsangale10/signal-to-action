import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { AppShell } from '@/components/shell'
import Today from '@/pages/Today'

// Each screen loads on demand, so the first screen stays fast.
const Review = lazy(() => import('@/pages/Review'))
const BatchReview = lazy(() => import('@/pages/BatchReview'))
const PlanDetail = lazy(() => import('@/pages/PlanDetail'))
const Doctors = lazy(() => import('@/pages/Doctors'))
const DoctorProfile = lazy(() => import('@/pages/DoctorProfile'))
const GuardrailsPage = lazy(() => import('@/pages/Guardrails'))
const Ask = lazy(() => import('@/pages/Ask'))
const Results = lazy(() => import('@/pages/Results'))
const RepView = lazy(() => import('@/pages/RepView'))
const About = lazy(() => import('@/pages/About'))
const NotFound = lazy(() => import('@/pages/NotFound'))

function Loading() {
  return (
    <div className="mx-auto max-w-[1240px] space-y-4 px-4 pt-20 sm:px-8" role="status" aria-label="Loading">
      <Skeleton className="h-9 w-72" />
      <Skeleton className="h-32 w-full rounded-[14px]" />
      <Skeleton className="h-64 w-full rounded-[14px]" />
    </div>
  )
}

// Apply the saved theme before first paint to avoid a flash.
try {
  const t = localStorage.getItem('sta-theme')
  if (t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)) document.documentElement.classList.add('dark')
} catch { /* storage unavailable */ }

const s = (el: React.ReactNode) => <Suspense fallback={<Loading />}>{el}</Suspense>

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider delayDuration={300}>
      <HashRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Today />} />
            <Route path="review" element={s(<Review />)} />
            <Route path="review/batch/:id" element={s(<BatchReview />)} />
            <Route path="plans/:id" element={s(<PlanDetail />)} />
            <Route path="doctors" element={s(<Doctors />)} />
            <Route path="doctors/:id" element={s(<DoctorProfile />)} />
            <Route path="guardrails" element={s(<GuardrailsPage />)} />
            <Route path="ask" element={s(<Ask />)} />
            <Route path="results" element={s(<Results />)} />
            <Route path="rep" element={s(<RepView />)} />
            <Route path="about" element={s(<About />)} />
            <Route path="*" element={s(<NotFound />)} />
          </Route>
        </Routes>
      </HashRouter>
      <Toaster position="bottom-center" />
    </TooltipProvider>
  </StrictMode>,
)
