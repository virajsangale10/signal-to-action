# Spec: Signal to Action (review and approve an AI-drafted plan)

Author: Viraj · Status: concept, for discussion · Prototype: `index.html`

> Independent concept built from public information. All doctors, brands (Velora) and numbers are fictional. Not affiliated with or endorsed by PharmaForceIQ.

---

## 1. Problem

The platform can spot a useful signal about a doctor (a lab-result trend, a competitor search, a guideline download) and draft a plan to act on it. The value of that signal fades fast, roughly within 48 hours.

Today's risk is not finding signals. It's the moment a person has to approve the plan:

- If the plan is long or doesn't explain itself, people rubber-stamp it or ignore it.
- If a rule (consent, approved content, frequency cap) fails *after* approval, trust drops.
- If reps get every suggestion as an alert, they stop reading them.

**Bet:** a short plan that explains each step, shows every rule check before the button, and lets the user edit or reject with a reason will be approved faster and trusted more.

## 2. Users

| User | What they need from this screen |
|---|---|
| **HCP marketer** (primary) | See which doctors need action now, understand the plan in seconds, adjust it, approve it before it expires. |
| **Omnichannel lead** | Ask why performance moved, preview rule or plan changes, approve them. Sees reject reasons to tune the AI. |
| **Sales rep** (receives output) | Gets one clear CRM task with the reason behind it, and no duplicate email right after their own visit. |

## 3. Goals

1. A marketer can review and approve a plan in under 3 minutes (median).
2. No plan can be approved if it breaks a rule; the user always knows why.
3. Every decision (approve, edit, reject, dismiss) is logged with who, when and what changed.
4. Reject reasons are captured in a structured way so data science can improve plans.

## 4. Epic

**As an HCP marketer, I can review, adjust and approve an AI-drafted engagement plan for a doctor signal in under three minutes, knowing it passes every rule before it goes out.**

## 5. User stories

### Story 1: See signals by urgency
As a marketer, I want open signals sorted by priority with time left, so I act on the most valuable ones first.
- **Given** I have open signals, **when** I open Signals, **then** they are sorted by priority score (high to low).
- **Given** a signal has 12 hours or less left, **then** its time-left chip is highlighted.
- **Given** a signal has expired, **then** it shows "Expired" and stays in the list until dismissed.
- **Given** I have decided a signal today, **then** it moves to a "Done today" group with its status.

### Story 2: Understand the AI plan
As a marketer, I want each step to explain itself, so I can trust or question it quickly.
- **Given** I select a signal, **when** the plan loads, **then** I see the signal in one sentence and up to 4 steps.
- Each step shows: channel, timing, content ID, approval status, and a one-line "Why".
- **Given** the AI left a step off, **then** the step is shown unticked with the reason (e.g. "rep visited 6h ago").
- **Given** the plan has a rep task, **then** I see a preview of exactly what the rep will get in CRM.

### Story 3: Edit the plan
As a marketer, I want to turn steps on or off, so the plan fits what I know.
- **Given** an open plan, **when** I tick or untick a step, **then** the rules check and the estimate update within 300 ms.
- **Then** an "Edited · N changes" badge appears, counted against the AI's original plan.
- **When** I press "Reset to AI plan", **then** all steps return to the AI's choice and the badge disappears.
- Keyboard focus stays on the checkbox I changed.

### Story 4: Know why I can't approve
As a marketer, I want to know exactly what's blocking approval and how to fix it.
- **Given** any rule fails, **then** "Approve" is disabled and the reason appears next to it (linked with `aria-describedby`).
- **Given** a fix exists (remove email step, swap to approved content, retry CRM sync), **then** a fix button appears under that rule.
- **Given** no steps are selected, **then** Approve is disabled with "Select at least one step to approve."
- Warnings (e.g. rep/email overlap) do not block approval.

### Story 5: Approve and send
As a marketer, I want to approve and know it worked.
- **Given** all rules pass, **when** I press "Approve and send to tools", **then** each selected step is sent to its tool (CRM, email, media).
- **Then** I see a confirmation with Undo available for 8 seconds; Undo returns the plan to open and removes the log entry.
- **Then** the activity log records: approver, time, steps sent, number of edits vs AI plan.
- **Then** focus moves to "Next signal" (or the plan heading if none is left).

### Story 6: Reject with a reason
As a marketer, I want to reject a plan and say why, so the system learns.
- **When** I press Reject, **then** a dialog asks for one reason: Wrong doctor or not a priority / Timing is off / Content isn't right / Rep is already handling it / Other.
- **Given** I pick "Other", **then** a note is required.
- **Given** I confirm, **then** nothing is sent, the reason and note are logged, and Undo is available for 8 seconds.
- The dialog traps focus, closes on Esc, and returns focus sensibly.

### Story 7: Ask why performance moved
As an omnichannel lead, I want to ask a question and get a sourced answer I can act on.
- **Given** I ask a supported question, **then** I see a plain-language answer, its drivers (chart), its data basis, freshness and confidence.
- **Then** I see proposed changes with checkboxes and a live projected impact.
- **Given** no change is selected, **then** Approve is disabled with a reason.
- **Given** the question can't be answered, **then** the UI says so instead of guessing.

## 6. Edge cases

| Case | Expected behaviour | In prototype |
|---|---|---|
| **Signal expired** | Banner "Signal expired", plan read-only, only action is Dismiss (logged as "expired before review"). | Edge case: Signal expired |
| **No email consent** | Consent rule fails, Approve disabled with reason, fix: "Remove the email step". | Edge case: No email consent |
| **Content not approved** | Step shows "In review"; rule fails naming the content ID; if an approved alternative exists, offer "Use approved X". | Edge case: Content not approved |
| **CRM sync failure** | Banner: digital steps still work; rep rule fails with "Retry CRM sync"; unticking the rep task lets user approve digital only. | Edge case: CRM sync failure |
| **Rep visit and email overlap** | AI leaves the email off and says why. If user adds it back: non-blocking warning. | Edge case: Rep visit and email overlap |
| **Frequency cap reached** | Cap rule fails with the count ("4 of 4 in 30 days"); fix: remove the email step. | Edge case: Email frequency cap |
| **Empty signal list** | "No new signals. You're caught up." with refresh timing. Never a blank panel. | Edge case: No signals |
| **User edits the AI plan** | Edited badge, live rules and estimate, Reset to AI plan, edit count saved in the log. | Untick any step |
| **User rejects** | Required reason, note for Other, nothing sent, logged, undo. | Press Reject |
| Rules check slow or fails | Show "Checking…" on the rules list; Approve disabled until it returns; run a final server check on approve. | Not built |
| Plan changed by someone else | On approve, if plan version changed, show "This plan was updated by X. Review changes." | Not built |
| Signal expires while open | Switch to the expired state live; keep any edits visible but read-only. | Not built |

## 7. Definition of done

- All acceptance criteria above pass, checked by QA.
- Every state has a designed screen: loading, empty, error, expired, decided.
- Works from 380px wide to desktop with no sideways scrolling.
- Keyboard: every action reachable; tabs use arrow keys; dialog traps focus and closes on Esc; visible focus everywhere.
- Text and controls meet WCAG 2.1 AA contrast in light and dark themes; status is never shown by colour alone.
- Rule messages and button reasons are read by screen readers.
- Analytics events fire: `plan_viewed`, `step_toggled`, `plan_reset`, `plan_approved`, `plan_rejected` (with reason), `plan_undo`, `signal_dismissed`.
- API errors are handled and shown in plain language.
- Product owner has accepted the story in the demo environment.

## 8. Non-goals (this release)

- Editing content, timing or channel inside a step (only on/off, plus choosing among approved subject lines).
- Creating new steps from scratch.
- Bulk approve across many doctors.
- Changing the AI model or scoring.
- A rep-facing mobile view (we only preview what the rep gets).
- Free-form questions beyond the supported set in "Ask about performance".

## 9. Success metrics

| Metric | Definition | Starting target |
|---|---|---|
| Time to approve | Median time from plan opened to approved | < 3 min |
| % plans edited | Approved plans with at least one change vs AI | 20–40% (above 60% means the AI plan is off) |
| % plans rejected | Rejected / decided | < 15%, with top 3 reasons reviewed each sprint |
| Expired unreviewed | Signals that expired with no decision | < 5% |
| Undo rate | Approvals undone within 8s | < 3% (higher means the confirm step is unclear) |

Targets are my assumptions; replace them with real baselines in the first month.

## 10. Open questions

**Backend**
- Endpoints needed (proposed):
  - `GET /signals?status=open` (list, sorted, with `expiresAt`)
  - `GET /signals/:id/plan` (steps, default on/off, skip reasons, plan version)
  - `POST /plans/:id/check` (rules check for a given set of steps; target < 300 ms)
  - `POST /plans/:id/approve` `{steps, planVersion}` and `POST /plans/:id/reject` `{reason, note}`
  - `POST /plans/:id/undo` (within the undo window)
  - `GET /signals/:id/events` (activity log)
  - `GET /integrations/crm/status`
- Is "send to tools" one call that fans out, or one call per channel? How do we show partial failure?
- Where do consent and frequency caps live, and are they checked at approve time again?

**Data science**
- How is "expected extra prescriptions per 100 similar doctors" calculated, and what range should we show instead of one number?
- How fresh are signals and the estimate (minutes, hours, daily)?
- How is lift measured after the fact: control group, matched doctors, time lag?
- Which reject reasons are most useful for improving plans?

**QA**
- Can we get a seeded test environment with each edge case (expired, no consent, content in review, CRM down, cap reached)?
- How do we test timing (signal expiring while the page is open)?
- What does the audit trail need to show for compliance, and how long is it kept?

**Product / compliance**
- Who is allowed to approve: brand marketer, omnichannel lead, or both? Do some plans need two approvers?
- Does medical-legal review status come into the platform in real time?
