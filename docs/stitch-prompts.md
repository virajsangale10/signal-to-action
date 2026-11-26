# Stitch prompts: Signal to Action v2

How to use:
1. In Stitch, pick **Web** (desktop). Paste **Prompt 0** first and generate one screen from it (the Today screen). This sets the style.
2. For every other screen, paste the screen prompt **as a new prompt in the same project**. Each one starts with a one-line style reminder so screens stay consistent.
3. Generate one screen per prompt. If Stitch drops details, follow up with the short "fix" lines under each prompt.
4. Prompt 9 (rep card) uses **Mobile** mode.
5. Optional: attach `shots/signals.png` as a reference image for layout density only, not for style.
6. If a screen looks too flat or generic, follow up with: "Make it feel like a native macOS app with the precision of a keyboard-first issue tracker: frosted sidebar, compact 38px rows, hairline separators, key-cap shortcut hints, more whitespace around sections."

Every screen is fictional (brand "Velora", heart failure). Never use any real company's name, logo or colours in the designs.

---

## Prompt 0: product and design system (paste first)

```
Design a desktop web app called "Signal to Action": a concept tool for pharma brand marketers. All data is fictional. Brand: "Velora" (a heart-failure drug). Logged-in user: "Ketaki B., HCP marketer".

What the product does: the system detects signals about doctors (a lab-result trend, a competitor search, a guideline download) and drafts an engagement plan within a 48-hour window. Plans that pass every guardrail are released automatically. Humans only review exceptions: blocked rules, high-value doctors, conflicts, low-confidence plans. Marketers release digital steps (email, journal ads, webinar invites). Field steps are sent to sales reps as suggestions, which reps accept, snooze or decline. All content is pre-approved by medical-legal review (MLR); the AI can only choose and order approved content, never write new claims.

Visual style: refined and quiet, in the spirit of Apple's own apps (macOS / iPadOS): lots of air, soft materials, hairline separators, nothing shouting. Calm, precise, trustworthy. Light theme.
- Colours:
  - Background (grouped) #F2F2F7, cards and panels white #FFFFFF, sidebar a frosted translucent white over the background.
  - Text #1C1C1E, secondary text #6C6C70, tertiary #AEAEB2, hairline separators #E5E5EA.
  - One accent: deep teal #0A7C86 for primary buttons, links, selected items, toggles and chart highlights only. Accent tint for selected rows #E6F4F5.
  - Status colours only for status, each with an icon and a word: green #248A3D (ready/pass), orange #B35C00 (warning/expiring), red #D70015 (blocked/expired). Keep the green clearly yellower than the teal so "Ready" never looks like a button.
- Type: "Inter" only (closest to SF Pro). Large titles 28-32px semibold with tight letter-spacing (-0.02em); section headers 13px semibold in secondary grey; body 15px; numbers tabular, big numbers 34px semibold.
- Shapes: 14px radius on cards, 10px on buttons and inputs, fully rounded pills for tags. Hairline 0.5-1px separators instead of heavy borders. Very soft, wide shadows only on floating elements (popovers, sheets).
- Components in the Apple idiom: grouped inset lists with hairline dividers, segmented controls for filters, switches only for on/off settings, checkboxes for "include in plan", sheets that slide over for dialogs, SF-Symbols-like thin line icons.
- Component language (so it can be built with shadcn/ui + Radix later): precise and keyboard-first, like a top-tier issue tracker.
  - Compact list rows 36-40px high, with a quiet hover background (#F5F5F7) and a teal tint for the selected row.
  - Keyboard shortcut hints as small grey key caps next to actions and menu items (e.g. "A", "R", "Ctrl K").
  - Ctrl K command menu: centred floating panel with a search input and grouped results.
  - Right-hand sheets that slide over for detail and dialogs (reject, redraft), keeping the list visible behind.
  - Small toasts bottom-centre with an inline "Cancel" or "Undo" action.
  - Dropdown menus and popovers with 8px radius and a soft shadow; tooltips on icon buttons.
  - Data tables with sticky headers, row checkboxes, right-aligned tabular numbers, and a bulk-action bar that appears on selection.
  - Thin 1.5px line icons (Lucide style), 16px in lists, 18px in the sidebar.
  - Status shown as small pills with a dot + word, never colour alone.
- Exact design tokens (use only these, never in-between values):
  - Type scale (Inter): page title 28px/600, section title 17px/600, card title 15px/600, body and list text 14px/400, secondary and meta 13px/400, labels and key caps 12px/500, big numbers 32px/600 tabular. Three weights only: 400, 500, 600. Line height 1.4 for text, 1.15 for titles.
  - Spacing: 4, 8, 12, 16, 24, 32, 48 only. Card padding 16px (20px on wide cards); 24px between sections; 12px between cards; page margins 32px.
  - Sizes: sidebar 232px wide; top bar 56px; list rows 40px (single line) or 56px (two lines); buttons 32px compact / 36px default; inputs and search 36px; icon buttons 32x32 with 16px icons; checkbox 16px with a 32px hit area; pills 22px high.
  - Radius: 14px cards and sheets, 10px buttons and inputs, 8px menus and popovers, 6px key caps, full for pills.
  - Text colours: primary #1C1C1E, secondary #6C6C70; #AEAEB2 only for placeholders and disabled items, never for information.
- UX rules:
  - One primary (filled teal) button per screen. All others are secondary (white with hairline border) or plain text links.
  - Visual hierarchy: one thing is clearly the biggest per screen (the decision, or the key number). Secondary data is smaller and grey, not just lighter.
  - Large targets: whole list rows are clickable (with a chevron at the right end), not just a small button in the row. Primary actions sit at the end of the reading path (bottom-right of a card or sheet).
  - Don't repeat the same number twice on one screen.
  - Group related items inside one card with hairline dividers; separate groups with whitespace, not extra borders.
  - Time left is always text plus a visual: normal grey above 12h, orange at 12h or less, red at 6h or less.
  - Left-align text, right-align numbers, align everything to the same left edge within a card.
- Generous whitespace, 8px grid, no gradients, no illustrations, no emoji, no stock photos.
- Layout shell: frosted left sidebar with icons + labels (Today, Review, Doctors, Guardrails, Ask, Results), a clean top bar with a large page title, a rounded search field showing "Ctrl K", a small "Concept · fictional data" pill, and an avatar "KB".
- Dark mode (only if asked): background #000000, grouped cards #1C1C1E and #2C2C2E, text #F2F2F7, accent teal #3FC1C9, green #30D158, orange #FF9F0A, red #FF453A.

First screen: "Today" (see the next message for details if needed). Show a greeting "Good morning, Ketaki", a summary strip, an exceptions queue and an auto-released summary.
```

---

## Prompt 1: Today (exception-first home)

```
Same app and style as before (Signal to Action, Velora, Apple-like refined style with shadcn/ui-style compact components and key-cap shortcut hints, deep teal accent #0A7C86, Inter, grouped background #F2F2F7, frosted sidebar with Today selected).

Screen: "Today". Purpose: in 10 seconds Ketaki knows what needs her and what the system already did.

Follow the exact type scale, spacing, sizes and UX rules from the first prompt.

Header row (32px page margins): left, title "Good morning, Ketaki" (28px/600) and under it one line in secondary grey (14px): "2 plans expire in the next 6 hours." Right, aligned to the title baseline: the ONLY primary button on the screen, "Start review · 7" with a key cap "G R".

Row of 3 stat cards (equal width, 12px gaps), each: label 13px grey, number 32px/600, one 13px context line, no sparklines:
- "Needs your decision" 7, "2 expire within 6h" (orange text + clock icon).
- "Released automatically today" 46, "61 digital steps · 12 rep suggestions".
- "Median time to decide" 2m 10s, "35s faster than last week" (green text + down-arrow icon).

Main area, two columns with 24px gap. Left column (about 65%): one card titled "Needs your decision" (17px/600). Inside, 4 groups separated by small 12px/500 grey group labels with counts: "Blocked by a rule · 3", "Approve together · 1 batch", "Conflicts · 1", "High value · 2". Within each group, rows sorted by time left, soonest first. Each row is 56px, fully clickable, with a chevron at the right end:
- line 1 (14px/500): "Dr. A. Wagle" + a 13px grey "Cardiology · Chicago"
- line 2 (13px grey): the reason, e.g. "Email consent missing"
- right side, right-aligned: a status pill (dot + word, e.g. red "Blocked") and the time left as text "5h left" over a short 48px bar showing time REMAINING (red because it is under 6h).
Example rows: Blocked: Dr. A. Wagle (5h, consent missing), Dr. S. Talwar (9h, content in MLR review), Dr. N. Kamble (20h, email cap reached). Approve together: "38 cardiologists · Lab result trend · same 2-step plan · 1 outlier" (30h). Conflicts: "Dr. M. Sequeira · 2 plans in 24h would exceed the email cap" (14h, orange). High value: Dr. R. Bhattacharjee (11h), Dr. L. Kshirsagar (40h).

Right column (about 35%): one card "Since yesterday" with 3 sections separated by hairlines, each with a 13px grey label:
- "Released automatically": a 4-item mini list (doctor + channel icons + time), then a text link "See all 46".
- "Rep responses": "9 accepted · 2 snoozed · 1 declined", and the declined reason in grey: "Doctor on leave until Dec 12".
- "Expiring tonight": "3 signals have no owner" with a text link "Assign to a colleague".

Footer inside the page, 12px grey #6C6C70: "Concept prototype · fictional data".
```
Fix lines if needed: "Only one filled teal button on the page: Start review." · "Make whole rows clickable with a chevron; remove per-row buttons." · "Use exactly 28 / 17 / 15 / 14 / 13 / 12px text sizes and 4/8/12/16/24/32px spacing."

---

## Prompt 2: Batch review

```
Same app and style (Signal to Action, Velora, Apple-like refined style with shadcn/ui-style compact components and key-cap shortcut hints, deep teal accent #0A7C86, Inter, grouped background #F2F2F7, frosted sidebar). Sidebar: Review selected.

Screen: "Batch review". Purpose: approve many similar plans with one decision, while catching the outliers.

Header: back link "← Review queue", title "38 cardiologists · Lab result trend", subtitle "Same plan drafted for all. 37 pass every rule. 1 needs a look."

Top card "The plan for this batch": two steps as horizontal cards with icons: "1. Clinical data email · VEL-EM-207 · sent within 4h of approval" and "2. Rep suggestion · discuss titration guide · reps decide timing". Each step has an "MLR approved" green tag. A "Change for all" text button on each step.

Middle: a table of the 38 doctors (show 8 rows, then "Show 30 more"). Columns: checkbox, Doctor (masked NPI under name), Specialty, City, Time left (mini bar), Email cap (e.g. "2 of 4"), Rep load (e.g. "S. Kamat 4/6"), Status. The outlier row is pinned to the top with an orange "Needs a look" tag: "Dr. T. Gogoi · not on target list · no email consent · plan will skip email".

Right side panel: "Expected impact" showing a range "+1.4 to +2.6 extra prescriptions per 100 doctors" with "Confidence: medium" and a "How we know" link. Below: "Rules check for the batch" list with green checks (Approved content, Consent, Email cap, Rep capacity) and one orange item (1 doctor without email consent: email skipped automatically).

Sticky bottom bar: summary "37 plans · 37 emails · 37 rep suggestions · sends start 4:00 pm" and buttons: primary "Release 37 plans", secondary "Release and review outlier", tertiary "Reject batch".
```

---

## Prompt 3: Plan detail (one doctor, exception)

```
Same app and style (Signal to Action, Velora, Apple-like refined style with shadcn/ui-style compact components and key-cap shortcut hints, deep teal accent #0A7C86, Inter, grouped background #F2F2F7, frosted sidebar). Sidebar: Review selected.

Screen: "Plan detail" for one doctor who needs a decision. Most important rule: the decision comes first.

Decision header (full width, top): "Dr. A. Wagle · Cardiology · Chicago, IL · NPI •••• ••4821". Next to it a status summary in one line: red icon + "1 blocking issue: no email consent on file" and an inline button "Fix: remove email step". Right side: "5h left" orange chip and "Priority 92" chip with an info icon (tooltip lists: signal strength 40, doctor value 30, timing 22).

Below: "Why now" card: "Lab result trend: more patients in this practice had raised NT-proBNP results in 30 days (aggregated, de-identified)." Under it a horizontal 48-hour window timeline: a track from "Detected" to "48h", a "Now" marker at 43h, and step markers placed on the track with both icon AND label (e.g. "Email · in 1h", "Rep suggestion · rep decides"). Markers differ by shape and label, not only colour.

Left column (60%): "AI-drafted plan" with 3 step cards. Each card: checkbox "Include", channel icon, title, timing as an editable dropdown ("Today 4:00 pm"), content as a dropdown of approved variants ("VEL-EM-207 · New data on titration"), a one-line "Why: Dr. Wagle opens most emails within a day", and "Preview" link. The rep step is labelled "Suggestion to rep S. Kamat (4 of 6 this week) · rep decides". A "+ Add step" button and a "Redraft with a note" button (opens a text field: "e.g. no email this week").

Right column (40%): "Rules check" list (approved content, email consent [failed, red, with fix button], email cap across ALL plans for this doctor "2 of 4", rep capacity, conflicts "none"), then "Expected impact" as a range "+1.2 to +2.4 per 100 similar doctors · confidence medium · How we know", then "Channel preferences" bars, then "Recent touches" mini timeline.

Sticky bottom bar: primary "Release plan" (disabled, with text "Fix 1 issue to release"), secondary "Reject…", text button "Assign to colleague". Small note: "Sends are queued. You can cancel until each send time."
```
Fix lines: "Show the timeline bigger." · "Make the failed rule more prominent next to the decision header."

---

## Prompt 4: Plan detail, released state (send queue + status)

```
Same app and style (Apple-like refined style with shadcn/ui-style compact components and key-cap shortcut hints, deep teal accent #0A7C86, Inter, grouped background #F2F2F7, frosted sidebar). Same doctor as the plan detail screen, after release.

Screen: "Plan detail · Released". Top banner (green): "Released 2 min ago by you · 1 change from the AI plan". Next to it "View activity log".

Main area: "What happens next" as a vertical timeline with times:
- "4:00 pm today · Clinical data email" status "Queued" with "Cancel send" button (still possible).
- "Rep suggestion to S. Kamat" status "Delivered to CRM · waiting for rep" (later states: Accepted / Snoozed / Declined with reason).
- "Journal display ad · runs Dec 1–7" status "Scheduled" with "Stop" button.
Each item has an icon, status tag, and a short status history line.

Right panel: "Outcome so far" with honest early metrics: "Email: not sent yet", "Rep: no response yet", "Lift: measured after 8 weeks against matched doctors". Below: "Activity log" list: "Released by Ketaki B. · 10:42", "Removed webinar step · 10:41", "Plan drafted by system · 06:12", "Signal detected · 05:40".

No undo button for already-sent items; only cancel for queued ones.
```

---

## Prompt 5: Doctor 360

```
Same app and style (Apple-like refined style with shadcn/ui-style compact components and key-cap shortcut hints, deep teal accent #0A7C86, Inter, grouped background #F2F2F7, frosted sidebar). Sidebar: Doctors selected.

Screen: "Doctor profile: Dr. A. Wagle". Purpose: one view of everything field and digital, past and planned.

Header: initials avatar, name, specialty, city, masked NPI, tags "Target list · Tier A", "Email consent: no (updated Nov 2)", "Rep: S. Kamat".

Main: a horizontal multi-lane timeline across the last 60 days and the next 14 days, with a "Today" line. Lanes: Signals, Rep visits, Email, Media, Events. Past items are solid, planned items are outlined. Clicking an item shows a small detail card (example open: "Rep visit · Nov 16 · discussed HF guideline update").

Below the timeline, three cards: "Channel preferences" (bars: Rep 64%, Journal 41%, Webinar 18%, Email n/a - no consent), "Contact pressure" (emails 2 of 4 in 30 days, rep visits 2 this month, no conflicts), "Results" (prescriptions trend sparkline, "attributed lift is measured at segment level, not per doctor").

Right side: "Open plans (1)" card linking to the plan, and "Notes from rep" card with one note: "Prefers short visits, Tuesday mornings."
```

---

## Prompt 6: Guardrails and triggers

```
Same app and style (Apple-like refined style with shadcn/ui-style compact components and key-cap shortcut hints, deep teal accent #0A7C86, Inter, grouped background #F2F2F7, frosted sidebar). Sidebar: Guardrails selected.

Screen: "Guardrails · Lab result trend". Purpose: set rules once so most plans can go out automatically, and see the effect before changing anything.

Left list of triggers with status tags (Lab result trend · Active, Competitor search · Active, Publication download · Paused, Peer adoption · Active).

Centre: a vertical rule builder made of 4 connected blocks with small labels:
1. WHEN: signal type dropdown, priority score slider (at least 70).
2. THEN: draft a plan using channel chips (Email, Journal ad, Webinar, Rep suggestion), "at most 3 steps".
3. GUARDRAILS (orange label): max emails per doctor per 30 days across all plans and brands (4), skip email if a rep visited within (48 hours), max rep suggestions per week (6), and a locked row "Consent and MLR approval are always enforced" with a lock icon.
4. RELEASE (green label): radio options "Review every plan" / "Release automatically when every rule passes and priority is below 85 (recommended)" / "Batch similar plans for one review".

Right panel: "Impact preview · replayed on last 30 days": before/after columns for plans drafted, released automatically, sent to review, emails blocked by cap, rep suggestions held, average review load per marketer per day. Range estimate for lift with confidence.

Bottom: "Version 7 · changed by Omnichannel lead, Nov 20" link "History", buttons "Submit for approval" (primary), "Discard", and a field "Start date: Dec 1".
```

---

## Prompt 7: Ask (answer to action, with confidence)

```
Same app and style (Apple-like refined style with shadcn/ui-style compact components and key-cap shortcut hints, deep teal accent #0A7C86, Inter, grouped background #F2F2F7, frosted sidebar). Sidebar: Ask selected.

Screen: "Ask about performance". Layout: centred conversation column (max 920px).

Top: big input "Ask about lift, signals, reps or channels" with 3 suggestion chips.

Thread shows one question bubble: "Why did script lift drop in Northeast cardiology over the last 4 weeks?"

Answer card:
- Plain answer first: "Lift fell from about +3.1 to +1.9 per 100 doctors. The two biggest likely causes: more emails than planned, and two rep territories left empty."
- Chips: "1,240 cardiologists", "Data refreshed 6h ago", "Confidence: medium", "Fictional data".
- "Likely drivers" horizontal diverging bar chart (negative red, positive teal) with labels and values, plus a grey bar "Unexplained −0.2". Note under chart: "Associations, not proven causes."
- "How we know" expandable row (method, comparison group, time window).
- "Suggested changes" with checkboxes and a range each: "Cap Northeast emails at 4 a month (+0.2 to +0.4)", "Virtual rep calls in vacant territories (+0.3 to +0.5)".
- Projected range "+2.4 to +2.9" and buttons "Open in Guardrails to apply" (primary) and "Share with omnichannel lead".
- Collapsed "Doctors behind this answer" table.
```

---

## Prompt 8: Results

```
Same app and style (Apple-like refined style with shadcn/ui-style compact components and key-cap shortcut hints, deep teal accent #0A7C86, Inter, grouped background #F2F2F7, frosted sidebar). Sidebar: Results selected.

Screen: "Results". Purpose: show what signal-driven plans led to, honestly.

Header with filters: date range "Last 12 weeks", Signal type, Region, Channel.

Top row: 4 stat cards with small deltas: "Plans released 1,284", "Auto-released 71%", "Rep suggestions accepted 62%", "Extra prescriptions per 100 doctors +2.6 (range +2.1 to +3.1)".

Main chart: line chart of weekly lift for doctors reached vs matched comparison doctors (two lines, shaded gap labelled "Lift"), 12 weeks.

Below: table "By signal type": columns Signal type, Plans, Acted on within 48h, Rep acceptance, Lift (range), Trend sparkline. Rows: Lab result trend, Competitor search, Peer adoption, Publication download (publication download flagged orange: "Often acted on too late").

Side card: "What we learned this month" with 3 short bullets and a "Change guardrails" link.
```

---

## Prompt 9: Rep suggestion card (switch Stitch to Mobile)

```
Mobile screen (390px) for a sales rep using their CRM app. Same colours and type as the "Signal to Action" web app (deep teal accent #0A7C86, Inter), in the iOS idiom: large title, grouped inset cards, rounded buttons, but designed as a card inside a generic CRM, no brand logos.

Screen: "Suggestions for today" with a header "S. Kamat · 4 of 6 suggestions this week".

Top card (expanded): "Dr. A. Wagle · Cardiology · Chicago". Title "Discuss the titration guide". Reason written safely for field use: "Recent interest in heart-failure dosing in your territory" (never mentions patient lab data). Context lines: "Last visit 10 days ago", "Marketing will not email this week (no consent)". Approved talking points: "VEL-CRM-014" with a "View" link. Suggested timing "This week, Tuesday morning preferred".
Three large buttons: "Accept" (primary), "Snooze", "Not relevant" (opens reasons: Doctor on leave / Already discussed / Not a fit / Other).

Below: two collapsed cards for other doctors. Bottom tab bar: Today, Doctors, Calendar, More.
```

---

## Prompt 10: States and edge cases (generate as variants of Prompt 3)

Paste one at a time after generating the plan detail screen:

```
Variant of the Plan detail screen: signal expired. Decision header shows red "Expired 2h ago · window closed". Plan is read-only (greyed inputs). Only actions: "Dismiss" and "Draft a follow-up plan". Note: "Dismissed signals are logged."
```
```
Variant: CRM sync is down. Amber banner across the top: "CRM sync failed at 09:42. Digital steps can still be released. Rep suggestions will be held until sync is back." Rep step shows "Held" tag. Buttons: "Retry sync", "Release digital steps only".
```
```
Variant: conflict. Banner: "Another plan for Dr. M. Sequeira (Competitor search) is queued for tomorrow. Together they would send 2 emails in 24h." Options shown as two cards: "Merge into one plan (recommended)" and "Keep this plan, cancel the other".
```
```
Variant: content in MLR review. Email step shows red tag "VEL-EM-207 in MLR review" and an inline suggestion "Use approved VEL-EM-198 instead" with a "Swap" button.
```
```
Variant: loading state of the Plan detail screen with skeleton blocks for the header, timeline and steps.
```
```
Variant: Review queue empty state: centred icon, "You're caught up", "46 plans went out automatically today within your guardrails", buttons "See what went out" and "Review guardrails".
```
```
Modal on the Plan detail screen: "Reject plan". Radio reasons: Wrong doctor or not a priority / Timing is off / Content isn't right / Rep already handling it / Other (note required). Checkbox "Don't suggest this doctor for this signal type for 30 days". Note under: "Your reason trains future plans. You'll see a monthly summary." Buttons "Reject plan", "Cancel".
```

---

## Gap-to-screen checklist

| Gap found | Fixed in |
|---|---|
| One-by-one approval doesn't scale | Today (exceptions only), Batch review, Guardrails release mode |
| Marketer "approving" rep visits | Plan detail (rep suggestion, rep decides), Rep card |
| False precision in lift | Ranges + confidence + "How we know" in Plan, Batch, Ask, Results |
| Undo after send is impossible | Released state: send queue, cancel only queued items |
| No outcomes after sending | Released state, Doctor 360, Results |
| Only on/off editing | Plan detail: timing, content variants, add step, redraft with a note |
| Cap ignores other plans; conflicts | Plan rules "across all plans", Conflict variant |
| Unsafe "why" shown to reps | Rep card uses field-safe reason |
| Signals silently expire | Today "Coming up", assign to colleague, Expired variant |
| Priority score unexplained | Plan header tooltip breakdown |
| Rejections disappear | Reject modal: "trains future plans", monthly summary |
| Trigger changes without governance | Guardrails: versions, history, start date, approval |
| Decision buried in dense screen | Plan detail: decision header first |
| Colour-only timeline markers | Markers with shape + label |
| Missing loading / empty / error states | Prompt 10 variants |
