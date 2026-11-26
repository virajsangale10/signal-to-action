# Usability test log: Signal to Action

Prototype: `index.html` (hosted link: _add after deploying_) · Moderator: Viraj · Format: 20–25 min, remote, screen share, think aloud

## Who to test with (3 people)

| # | Profile to look for | Name / role (keep anonymous in anything you share) | Date |
|---|---|---|---|
| P1 | Pharma, healthcare or marketing exposure (brand, digital marketing, medical rep, CRM) | | |
| P2 | Product, ops or analytics (used dashboards and approval flows) | | |
| P3 | Non-specialist (fresh eyes for clarity) | | |

## Before the session

- [ ] Open the hosted link on the Signals screen. Edge cases load from the "Demo guide" button (top right).
- [ ] Ask permission to take notes (and record, if they agree).
- [ ] Say: "I'm testing the design, not you. There are no wrong answers. Please think out loud."
- [ ] Give 30 seconds of context: "You run marketing for a heart-failure drug. The system spots signals about doctors and drafts a plan. Your job is to approve good plans before they expire."

## Tasks

Give one at a time. Don't explain the UI. Note time taken and where they hesitate.

| # | Task (read this out) | Success looks like |
|---|---|---|
| T1 | "Look at the most urgent doctor and decide whether to approve the plan." | Picks Dr. Rao, reads steps, approves. |
| T2 | "You think the journal ad is a waste for this doctor. Remove it, then approve." | Unticks step, notices estimate change, approves. |
| T3 | Load edge case "No email consent" from the Demo guide. "Approve this plan." | Notices blocked state, understands why, uses the fix. |
| T4 | Load "CRM sync failure". "The rep task can't go out. What would you do?" | Retries, or approves digital steps only. |
| T5 | "Reject Dr. Iyer's plan because the rep is already handling it." | Finds Reject, picks reason, confirms. |
| T6 | Go to "Ask" in the left menu. "Find out why Northeast cardiology dropped, and send the change you think matters most for approval." | Reads answer, chooses changes, sends. |
| T7 | Go to "Triggers". "Make sure doctors get at most 3 emails a month. What changes?" | Changes the cap, reads the impact preview, submits. |

## What to observe

- Where they look first. Do they notice time left and priority?
- Do they read the "Why" lines? Do they trust the plan or question it?
- Do they understand the estimate number? (Ask: "What does +2.0 mean to you?")
- When approval is blocked, how long until they find the reason?
- Do they notice the rep preview? Do they understand what the rep gets?
- Any word they stumble on (e.g. "NPI", "frequency cap", "lift").
- Do they find Undo after approving?

## Questions after the tasks

1. On a scale of 1–5, how confident would you be approving plans like this every day? Why?
2. What was the most confusing moment?
3. What would you need to see before trusting the AI plan more?
4. (P1 only) What's missing that a real brand team would expect?

## Results

### P1
| Task | Done? | Time | Notes (what they did / said) |
|---|---|---|---|
| T1 | | | |
| T2 | | | |
| T3 | | | |
| T4 | | | |
| T5 | | | |
| T6 | | | |

Confidence score: __ /5 · Most confusing: · Quote:

### P2
| Task | Done? | Time | Notes |
|---|---|---|---|
| T1 | | | |
| T2 | | | |
| T3 | | | |
| T4 | | | |
| T5 | | | |
| T6 | | | |

Confidence score: __ /5 · Most confusing: · Quote:

### P3
| Task | Done? | Time | Notes |
|---|---|---|---|
| T1 | | | |
| T2 | | | |
| T3 | | | |
| T4 | | | |
| T5 | | | |
| T6 | | | |

Confidence score: __ /5 · Most confusing: · Quote:

## Findings (fill after all 3)

| Finding | Seen in | Severity (high / med / low) | Change I made | Done? |
|---|---|---|---|---|
| | | | | |
| | | | | |
| | | | | |

## Top 3 takeaways (these go on the one-pager)

1.
2.
3.
