# Usability test log: Signal to Action

Prototype: the Signal to Action React app (hosted link: _add after deploying_) · Moderator: Viraj · Format: 25 min, remote, screen share, think aloud

## Who to test with (3 people)

| # | Profile to look for | Name / role (keep anonymous in anything you share) | Date |
|---|---|---|---|
| P1 | Pharma, healthcare or marketing exposure (brand, digital marketing, medical rep, CRM) | | |
| P2 | Product, ops or analytics (used dashboards and approval flows) | | |
| P3 | Non-specialist (fresh eyes for clarity) | | |

## Before the session

- [ ] Open the hosted link on **Today**. Use the avatar menu (top right) → **Reset demo** before each participant.
- [ ] Ask permission to take notes (and record, if they agree).
- [ ] Say: "I'm testing the design, not you. There are no wrong answers. Please think out loud."
- [ ] Give 30 seconds of context: "You run marketing for a heart-failure drug. The system spots signals about doctors and drafts plans. Most go out automatically within rules your team set. You only see the ones that need a person."

## Tasks

Give one at a time. Don't explain the UI. Note time taken and where they hesitate.

| # | Task (read this out) | Success looks like |
|---|---|---|
| T1 | "What needs your attention today, and what already happened without you?" | Reads the counts, the grouped list and "Since yesterday" correctly. |
| T2 | "Dr. Wagle's plan is blocked. Get it out before it expires." | Finds the consent issue, uses the fix, releases. |
| T3 | "You've just released it. Stop the journal ad, keep the rest." | Finds "What happens next", stops the ad, understands what can't be undone. |
| T4 | "Handle the 38 cardiologists in one go, but not the doctor who doesn't fit." | Opens the batch, notices the outlier is excluded, releases. |
| T5 | "Dr. Sequeira has two plans clashing. Sort it out." | Understands the conflict, chooses merge (or cancel) and explains why. |
| T6 | "Reject Dr. Bhattacharjee's plan because the rep is already handling it." | Finds Reject, picks the reason, confirms. |
| T7 | "Find out why Northeast cardiology dropped, then make sure doctors get at most 3 emails a month. What changes?" | Reads the answer, opens Guardrails, sets the cap, reads the before/after, submits. |

Optional: switch on **Simulate CRM outage** in the avatar menu and ask "What happens to the rep suggestion now?"

## What to observe

- Do they understand that most plans went out without them? Does that feel safe or scary?
- Where do they look first on a plan: the status line, the timeline, the steps or the rules?
- Do they read the "Why" lines and previews? Do they trust the plan or question it?
- Do they understand the impact range? (Ask: "What does +1.2 to +2.4 mean to you?")
- When something is blocked, how long until they find the fix?
- Do they understand the rep decides field steps, not marketing?
- Do they understand cancel vs undo after release?
- Any word they stumble on (e.g. "NPI", "MLR", "guardrail", "lift").
## Questions after the tasks

1. On a scale of 1–5, how comfortable would you be letting most plans go out automatically with these guardrails? Why?
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
| T7 | | | |

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
| T7 | | | |

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
| T7 | | | |

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
