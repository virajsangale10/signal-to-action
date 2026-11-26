# Spec: Signal to Action (v2, review by exception)

Author: Viraj · Status: concept, for discussion · Prototype: the React app in this repo

> Independent concept built from public information. Velora, every doctor, rep, NPI and number is fictional. Not affiliated with or endorsed by any company.

---

## 1. Problem

The platform spots a doctor-level signal (a lab-result trend, a competitor search, a guideline download) and drafts a plan to act on it. The value of the signal fades within about 48 hours.

My first version asked a marketer to approve every plan. Critiquing it showed that model breaks:

- **Volume.** One trigger drafts about 1,200 plans a month. If every plan waits for a person, signals expire.
- **Ownership.** Marketing doesn't direct sales reps. Field steps must be suggestions the rep decides on.
- **Trust.** If a rule (consent, MLR-approved content, frequency cap) fails after release, or an estimate looks falsely precise, people stop trusting the system.

**Bet:** plans that pass every guardrail go out automatically. People review only the exceptions: blocked rules, conflicts, high-value doctors and similar plans that can be batched. Those few decisions must be fast, safe and explainable.

## 2. Users

| User | What they need |
|---|---|
| **HCP marketer** (primary, "Ketaki B.") | See only what needs a decision, understand each plan in seconds, fix or adjust it, release it before the window closes |
| **Omnichannel lead** | Set and change the guardrails, see the effect before going live, approve rule changes, ask why performance moved |
| **Sales rep** (receives output) | One clear suggestion with a reason that is safe to say out loud, sized to their weekly capacity, which they can accept, snooze or decline |

## 3. Goals

1. Most plans (target 70%+) are released automatically within guardrails.
2. A marketer clears the exception queue in minutes; median time to decide under 3 minutes.
3. No plan can be released if it breaks a rule, and the user always knows why and how to fix it.
4. Every decision and every automatic release is logged: who, when, what changed vs the AI plan.
5. Reject reasons and rep responses come back in a structured way to improve future plans.

## 4. Epic

**As an HCP marketer, I review only the plans that need a human, and I can fix, adjust and release each one in under three minutes, knowing it passes every rule and that nothing is sent until its scheduled time.**

## 5. User stories

### Story 1: See only what needs me (Today and Review)
- **Given** plans were drafted overnight, **when** I open Today, **then** I see how many need my decision, how many were released automatically, and the median time to decide.
- **Given** plans need review, **then** they are grouped by reason: Blocked by a rule, Approve together (batches), Conflicts, High value, Expired, and sorted by time left.
- **Given** a signal expires within 14 hours and has no owner, **then** Today offers "Assign to a colleague".
- In the Review queue, **J/K** moves between rows and **Enter** opens one.

### Story 2: Decide on a batch
- **Given** many doctors got the same plan for the same signal, **then** they appear as one batch with the shared steps, impact range and rules check.
- **Given** one doctor doesn't fit (e.g. not on the target list, no consent), **then** that outlier is pinned at the top, unselected, with the reason.
- **When** I release the batch, **then** only the selected doctors are released, sends are queued, and Undo is available.

### Story 3: Understand a plan (Plan detail)
- **Given** I open a plan, **then** the first thing I see is its status: "Ready to release" or "N blocking issues" with the first fix as a button.
- **Then** I see why now (the signal in one sentence) and a 48-hour window timeline with each step placed on it (icon plus label, not colour alone).
- Each step shows include, channel, timing, approved content, MLR status, a one-line "Why", and a preview of exactly what will go out.
- The priority score has a breakdown (signal strength, doctor value, timing).

### Story 4: Fix and adjust a plan
- **Given** a rule fails, **then** the rules panel shows it with a short explanation and a fix (remove email step, swap to approved content, merge conflicting plans, retry CRM sync).
- **When** I change timing, swap content, include or exclude a step, or add a step, **then** rules and the impact range update immediately, and an "Edited · N changes" badge appears with "Reset to AI plan".
- **When** I "Redraft with a note" (e.g. "No email this week, she is at a conference"), **then** the AI changes steps and timing using approved content only, and the note is logged.

### Story 5: Release with a send queue
- **Given** no rule fails and at least one step is included, **when** I release (**A**), **then** each step is queued, scheduled or delivered to CRM, and I see "What happens next" with a status for each step.
- Queued emails can be cancelled and scheduled ads stopped until their send time. Sent items can't be undone, and the UI says so.
- Undo on the release toast returns the plan to review if nothing has gone out yet.

### Story 6: Reject with a reason
- **When** I reject (**X**), **then** a side sheet asks for one reason (Wrong doctor or not a priority / Timing is off / Content isn't right / Rep already handling it / Other). "Other" requires a note.
- I can choose "Don't suggest this doctor for this signal type for 30 days".
- Nothing is sent, the reason is logged, and Undo is available.

### Story 7: The rep decides field steps
- **Given** a plan with a rep step is released, **then** the rep receives a suggestion in CRM with a reason that is safe to say (never patient or lab data), what marketing will send, approved talking points and suggested timing.
- **When** the rep accepts, snoozes or declines (with a reason), **then** the response appears on the plan and in its log.
- Rep suggestions respect a weekly capacity per rep.

### Story 8: Change guardrails safely
- The omnichannel lead edits a trigger as WHEN (signal type, minimum priority) → THEN (channels, max steps) → GUARDRAILS (email cap across all plans and brands, skip email after a rep visit, max rep suggestions a week) → RELEASE (review every plan / auto-release below a priority / batch similar plans).
- Consent and MLR approval are always enforced and can't be switched off.
- Every change shows a before/after replay of the last 30 days, needs approval, has a start date and is versioned.

### Story 9: Ask why performance moved
- **Given** I ask a supported question, **then** I get a plain answer, its likely drivers including "Unexplained", the data basis, freshness and confidence, and a "How we know" method note.
- Suggested changes show ranges; "Open in Guardrails to apply" pre-fills the guardrail where possible.
- **Given** the question can't be answered, **then** the UI says "I don't know that yet" instead of guessing.

## 6. Edge cases

| Case | Expected behaviour | Where to see it |
|---|---|---|
| **Signal expired** | Red status, read-only plan; actions are Dismiss (logged) or Draft a follow-up | Dr. V. Lobo |
| **No email consent** | Consent rule fails; fix: remove email step | Dr. A. Wagle |
| **Content not approved** | Step shows "In MLR review"; fix: use the approved alternative | Dr. S. Talwar |
| **Email cap reached** | Cap counts every plan and brand; fix: remove email step | Dr. N. Kamble |
| **Two plans conflict** | Banner with two choices: merge (recommended) or cancel the other | Dr. M. Sequeira |
| **CRM sync failure** | Global banner; rep steps are held, digital steps can still go; Retry sync | Avatar menu → Simulate CRM outage |
| **Rep at weekly limit** | Warning: the suggestion waits until next week | Rules panel |
| **Batch outlier** | Pinned, unselected, with the reason | 38 cardiologists batch |
| **Empty queue** | "You're caught up", with how many plans went out automatically | Avatar menu → Show empty review queue |
| **User edits the AI plan** | Edited badge, live rules and range, Reset to AI plan, edits logged | Any plan |
| **User rejects** | Required reason, note for Other, optional 30-day suppression, Undo | Any plan |
| **Cancel after release** | Cancel queued email / stop ad until send time; sent items are final | Released plan |
| Rules check slow or failing | Show "Checking…", block release until it returns, re-check on release | Not built |
| Two people open the same plan | Show who else is viewing; on release, detect a changed plan version | Not built |

## 7. Definition of done

- All acceptance criteria pass, checked by QA.
- Every state has a designed screen: loading (skeleton), empty, error, expired, decided, released.
- Works from 375px to desktop with no sideways scrolling; decision bars stay reachable on phones.
- Keyboard: every action reachable; shortcuts shown as key caps; sheets and dialogs trap focus and close on Esc; visible focus everywhere.
- WCAG 2.1 AA contrast in light and dark; status is never shown by colour alone.
- Analytics events: `queue_viewed`, `plan_opened`, `step_toggled`, `content_swapped`, `fix_applied`, `plan_redrafted`, `plan_released`, `send_cancelled`, `plan_rejected` (with reason), `batch_released`, `rep_responded`, `guardrail_submitted`.
- API errors shown in plain language.
- Product owner has accepted the story in the demo environment.

## 8. Non-goals (this release)

- Writing new email copy. The AI only selects and orders MLR-approved modules.
- Per-doctor attribution of lift. Lift is measured at segment level.
- A full rep app. Only the suggestion card is specified.
- Changing the scoring model.
- Free-form questions beyond the supported set in Ask.

## 9. Success metrics

| Metric | Definition | Starting target |
|---|---|---|
| Auto-release rate | Plans released without a human / all plans | 70%+ |
| Time to decide | Median time from opening an exception to a decision | < 3 min |
| Expired unreviewed | Signals that expired with no decision | < 5% |
| Plans edited | Human-reviewed plans with at least one change | 20–40% (above 60% means the AI plan is off) |
| Plans rejected | Rejected / reviewed, with top 3 reasons each sprint | < 15% |
| Sends cancelled | Queued items cancelled after release | < 3% (higher means the review step is unclear) |
| Rep acceptance | Suggestions accepted / delivered | 60%+ |

Targets are my assumptions; replace them with real baselines in the first month.

## 10. Proposed API (to agree with backend)

- `GET /review-queue` → plans and batches needing a human, with group and `expiresAt`
- `GET /plans/:id` → steps, defaults, content options with MLR status, plan version
- `POST /plans/:id/check` → rules for a given set of steps (target < 300 ms)
- `POST /plans/:id/redraft` `{ note }` → new steps (approved content only)
- `POST /plans/:id/release` `{ steps, planVersion }` → send queue items
- `POST /plans/:id/queue/:stepId/cancel`
- `POST /plans/:id/reject` `{ reason, note, suppressDays }`
- `POST /batches/:id/release` `{ doctorIds }`
- `GET /plans/:id/events` → activity log
- `GET /guardrails/:trigger`, `POST /guardrails/:trigger/replay`, `POST /guardrails/:trigger/submit`
- `GET /integrations/crm/status`; rep responses arrive as events

## 11. Open questions

**Backend**
- Is release one call that fans out to each tool, or one per channel? How do we show partial failure?
- Is the email cap checked again at send time, across brands?
- Can the guardrails replay run in seconds on 30 days of data?

**Data science**
- How is the impact range calculated, and what confidence levels can we honestly show?
- How fresh are signals, consent and MLR status (minutes, hours, daily)?
- How is lift measured after the fact: matched comparison, holdout, time lag?
- Which reject reasons and rep decline reasons are most useful for retraining?

**QA**
- Can we seed a test environment with every edge case above?
- How do we test time (a signal expiring while open, a queued send reaching its time)?

**Product / compliance**
- Which plans must always have a human, regardless of guardrails?
- Who can approve guardrail changes? Is two-person approval needed?
- What must the audit trail show for auto-releases, and how long is it kept?
- Is the rep-facing reason text reviewed by compliance?
