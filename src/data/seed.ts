// All people, doctors, NPIs, brands (Velora) and numbers here are fictional.
import type { Batch, BatchDoctor, Doctor, Plan, Step, TimingOption } from './types'

export const CURRENT_USER = { name: 'Ketaki B.', initials: 'KB', role: 'HCP marketer', first: 'Ketaki' }
export const COLLEAGUES = ['Aniruddh S. (HCP marketing)', 'Mrinalini P. (HCP marketing)', 'Omnichannel lead']
export const EMAIL_CAP = 4
export const WINDOW_HOURS = 48

const prefs = (email: number | null, journal: number, rep: number, webinar: number) => [
  { label: 'Email', value: email },
  { label: 'Journal ad', value: journal },
  { label: 'Field rep', value: rep },
  { label: 'Webinar', value: webinar },
]

export const DOCTORS: Doctor[] = [
  {
    id: 'wagle', name: 'Dr. A. Wagle', initials: 'AW', specialty: 'Cardiology', city: 'Chicago, IL', npi: '•••• ••4821',
    tier: 'Tier A', targetList: true, emailConsent: false, consentUpdated: 'Nov 2',
    rep: { name: 'S. Kamat', load: 4, cap: 6 }, emails30: 2, repVisitsMonth: 2,
    prefs: prefs(68, 54, 42, 18),
    touches: [
      { lane: 'rep', day: -43, label: 'Oct 14', detail: 'Rep visit · Oct 14 · introduced titration guide' },
      { lane: 'rep', day: -10, label: 'Nov 16', detail: 'Rep visit · Nov 16 · discussed HF guideline update' },
      { lane: 'email', day: -35, label: 'Oct 22', detail: 'Email · Oct 22 · VEL-EM-150 opened' },
      { lane: 'email', day: -15, label: 'Nov 11', detail: 'Email · Nov 11 · VEL-EM-198 opened' },
      { lane: 'media', day: -28, label: 'JACC HF', detail: 'Journal ad · Oct 29 · JACC Heart Failure, 3 views' },
      { lane: 'event', day: -21, label: 'HF Symp.', detail: 'Event · Nov 5 · attended HF symposium (virtual)' },
      { lane: 'signal', day: -2, label: 'Lab trend', detail: 'Signal · Nov 24 · lab result trend detected' },
      { lane: 'rep', day: 3, label: 'Suggested', detail: 'Planned · rep suggestion to S. Kamat · rep decides timing', planned: true },
      { lane: 'media', day: 6, label: 'Dec 1–7', detail: 'Planned · journal ad VEL-AD-118 · Dec 1–7', planned: true },
    ],
    repNote: { text: 'Prefers short visits, Tuesday mornings.', by: 'S. Kamat', on: 'Nov 16' },
    rxTrend: [11, 11.4, 11.2, 12, 12.6, 12.4, 13.3, 13.9],
  },
  {
    id: 'talwar', name: 'Dr. S. Talwar', initials: 'ST', specialty: 'Cardiology', city: 'Boston, MA', npi: '•••• ••7310',
    tier: 'Tier A', targetList: true, emailConsent: true, consentUpdated: 'Sep 30',
    rep: { name: 'A. Bhagat', load: 3, cap: 6 }, emails30: 1, repVisitsMonth: 1,
    prefs: prefs(74, 40, 35, 22),
    touches: [
      { lane: 'email', day: -20, label: 'Nov 6', detail: 'Email · Nov 6 · VEL-EM-150 clicked' },
      { lane: 'rep', day: -32, label: 'Oct 25', detail: 'Rep visit · Oct 25 · samples' },
      { lane: 'signal', day: -1, label: 'Competitor', detail: 'Signal · competitor search detected' },
    ],
    rxTrend: [8, 8.2, 8.1, 8.6, 8.4, 8.8, 9.1, 9],
  },
  {
    id: 'kamble', name: 'Dr. N. Kamble', initials: 'NK', specialty: 'Internal medicine', city: 'Seattle, WA', npi: '•••• ••5562',
    tier: 'Tier B', targetList: true, emailConsent: true, consentUpdated: 'Aug 14',
    rep: { name: 'L. Varghese', load: 5, cap: 6 }, emails30: 4, repVisitsMonth: 0,
    prefs: prefs(81, 22, 30, 12),
    touches: [
      { lane: 'email', day: -26, label: 'Oct 31', detail: 'Email · Oct 31 · opened' },
      { lane: 'email', day: -18, label: 'Nov 8', detail: 'Email · Nov 8 · opened' },
      { lane: 'email', day: -9, label: 'Nov 17', detail: 'Email · Nov 17 · not opened' },
      { lane: 'email', day: -4, label: 'Nov 22', detail: 'Email · Nov 22 · opened' },
      { lane: 'signal', day: -1, label: 'Guideline', detail: 'Signal · guideline download' },
    ],
    rxTrend: [6, 6.1, 6.3, 6.2, 6.6, 6.5, 6.9, 7],
  },
  {
    id: 'sequeira', name: 'Dr. M. Sequeira', initials: 'MS', specialty: 'Heart failure', city: 'Houston, TX', npi: '•••• ••2290',
    tier: 'Tier A', targetList: true, emailConsent: true, consentUpdated: 'Oct 3',
    rep: { name: 'D. Barua', load: 2, cap: 6 }, emails30: 3, repVisitsMonth: 1,
    prefs: prefs(62, 48, 58, 30),
    touches: [
      { lane: 'rep', day: -12, label: 'Nov 14', detail: 'Rep visit · Nov 14 · dosing in older patients' },
      { lane: 'signal', day: -1, label: 'Lab trend', detail: 'Signal · lab result trend' },
      { lane: 'email', day: 1, label: 'Queued', detail: 'Planned · email from the Competitor search plan', planned: true },
    ],
    rxTrend: [9, 9.4, 9.2, 9.8, 10.1, 10, 10.6, 10.9],
  },
  {
    id: 'bhattacharjee', name: 'Dr. R. Bhattacharjee', initials: 'RB', specialty: 'Cardiology', city: 'New York, NY', npi: '•••• ••0047',
    tier: 'Tier 1 prescriber', targetList: true, emailConsent: true, consentUpdated: 'Oct 19',
    rep: { name: 'T. Dhillon', load: 3, cap: 6 }, emails30: 1, repVisitsMonth: 2,
    prefs: prefs(55, 61, 70, 44),
    touches: [
      { lane: 'rep', day: -6, label: 'Nov 20', detail: 'Rep visit · Nov 20 · discussed outcomes data' },
      { lane: 'event', day: -30, label: 'Ad board', detail: 'Event · Oct 27 · advisory board (disclosed)' },
      { lane: 'signal', day: -1, label: 'Guideline', detail: 'Signal · guideline download' },
    ],
    rxTrend: [18, 18.4, 18.9, 18.6, 19.4, 19.9, 20.3, 20.8],
  },
  {
    id: 'kshirsagar', name: 'Dr. L. Kshirsagar', initials: 'LK', specialty: 'Electrophysiology', city: 'Austin, TX', npi: '•••• ••8136',
    tier: 'Tier 1 prescriber', targetList: true, emailConsent: true, consentUpdated: 'Nov 9',
    rep: { name: 'M. Fernandes', load: 1, cap: 6 }, emails30: 0, repVisitsMonth: 0,
    prefs: prefs(44, 38, 66, 72),
    touches: [
      { lane: 'event', day: -1, label: 'Webinar', detail: 'Event · Nov 25 · attended HF dosing webinar' },
      { lane: 'signal', day: 0, label: 'Webinar', detail: 'Signal · webinar attendance' },
    ],
    rxTrend: [14, 14.2, 14.1, 14.6, 14.8, 15.1, 15, 15.6],
  },
  {
    id: 'lobo', name: 'Dr. V. Lobo', initials: 'VL', specialty: 'Cardiology', city: 'Denver, CO', npi: '•••• ••6618',
    tier: 'Tier B', targetList: true, emailConsent: true, consentUpdated: 'Jul 2',
    rep: { name: 'K. Lepcha', load: 4, cap: 6 }, emails30: 1, repVisitsMonth: 1,
    prefs: prefs(58, 33, 41, 15),
    touches: [{ lane: 'signal', day: -2, label: 'Competitor', detail: 'Signal · competitor search' }],
    rxTrend: [7, 7.1, 7.3, 7.2, 7.4, 7.6, 7.5, 7.7],
  },
  {
    id: 'gogoi', name: 'Dr. T. Gogoi', initials: 'TG', specialty: 'Cardiology', city: 'Denver, CO', npi: '•••• ••9034',
    tier: 'Not on target list', targetList: false, emailConsent: false, consentUpdated: 'never',
    rep: { name: 'K. Lepcha', load: 3, cap: 6 }, emails30: 0, repVisitsMonth: 0,
    prefs: prefs(null, 52, 35, 15),
    touches: [
      { lane: 'media', day: -20, label: 'Ad views', detail: 'Journal ad · saw 3 ads, no clicks' },
      { lane: 'signal', day: -1, label: 'Lab trend', detail: 'Signal · lab result trend (found through real-world data)' },
    ],
    rxTrend: [2, 2.1, 2, 2.2, 2.4, 2.3, 2.6, 2.8],
  },
]

const t = (label: string, inHours: number | null): TimingOption => ({ label, inHours })

function step(s: Omit<Step, 'defaultInclude'>): Step {
  return { ...s, defaultInclude: s.include }
}

const repStep = (id: string, rep: string, load: number, why: string, contentId = 'VEL-REP-092', label = 'Titration discussion guide'): Step =>
  step({
    id, channel: 'rep', title: `Suggestion to rep ${rep} (${load} of 6 this week) · rep decides`,
    timing: 'Rep decides timing', timingOptions: [t('Rep decides timing', null), t('Suggest this week', null), t('Suggest next week', null)],
    contentId, contentOptions: [{ id: contentId, label, approved: true }, contentId === 'VEL-REP-092' ? { id: 'VEL-REP-101', label: 'Outcomes data talking points', approved: true } : { id: 'VEL-REP-092', label: 'Titration discussion guide', approved: true }],
    include: true, why, weight: 0.45,
  })

export const PLANS: Plan[] = [
  {
    id: 'wagle-lab', doctorId: 'wagle', signal: 'Lab result trend',
    signalDetail: 'More patients in this practice had raised NT-proBNP results in 30 days (aggregated, de-identified).',
    age: 43, priority: 92, breakdown: [{ label: 'Signal strength', value: 40 }, { label: 'Doctor value', value: 30 }, { label: 'Timing', value: 22 }],
    group: 'blocked', reasonLine: 'Email consent missing', status: 'review', impact: [1.2, 2.4], confidence: 'medium',
    steps: [
      step({ id: 'w1', channel: 'email', title: 'Clinical data email', timing: 'Today 11:45 am', timingOptions: [t('Today 11:45 am', 1), t('Today 4:00 pm', 5), t('Tomorrow 9:00 am', 22)],
        contentId: 'VEL-EM-207', contentOptions: [{ id: 'VEL-EM-207', label: 'New data on titration', approved: true }, { id: 'VEL-EM-198', label: 'Titration guide summary', approved: true }],
        include: true, why: 'Dr. Wagle opens most emails within a day', weight: 0.35 }),
      step({ id: 'w2', channel: 'ad', title: 'Programmatic journal ad', timing: 'Starts in 2h · runs 7 days', timingOptions: [t('Starts in 2h · runs 7 days', 2), t('Starts tomorrow · runs 7 days', 20)],
        contentId: 'VEL-AD-118', contentOptions: [{ id: 'VEL-AD-118', label: 'JACC Heart Failure banner', approved: true }, { id: 'VEL-AD-121', label: 'Titration guide banner', approved: true }],
        include: true, why: 'Reads two cardiology journals in our media plan', weight: 0.15 }),
      repStep('w3', 'S. Kamat', 4, 'Territory rep has 2 open slots this week'),
      step({ id: 'w4', channel: 'webinar', title: 'Invite to HF dosing webinar, Dec 10', timing: 'After the rep visit', timingOptions: [t('After the rep visit', 30), t('Tomorrow 10:00 am', 23)],
        contentId: 'VEL-WB-005', contentOptions: [{ id: 'VEL-WB-005', label: 'HF dosing webinar invite', approved: true }],
        include: false, why: 'Attended a similar session last year. Left off to keep the plan short.', weight: 0.12 }),
    ],
    log: [{ text: 'Plan drafted by system', at: '06:12', who: 'System' }, { text: 'Signal detected', at: '05:40', who: 'System' }],
  },
  {
    id: 'talwar-comp', doctorId: 'talwar', signal: 'Competitor search',
    signalDetail: 'Searched dosing for a competing heart-failure therapy three times this week.',
    age: 39, priority: 84, breakdown: [{ label: 'Signal strength', value: 38 }, { label: 'Doctor value', value: 28 }, { label: 'Timing', value: 18 }],
    group: 'blocked', reasonLine: 'Content in MLR review', status: 'review', impact: [0.9, 1.9], confidence: 'medium',
    steps: [
      step({ id: 't1', channel: 'email', title: 'Head-to-head summary email', timing: 'Today 1:00 pm', timingOptions: [t('Today 1:00 pm', 2), t('Tomorrow 9:00 am', 22)],
        contentId: 'VEL-EM-214', contentOptions: [{ id: 'VEL-EM-214', label: 'Head-to-head summary', approved: false }, { id: 'VEL-EM-198', label: 'Titration guide summary', approved: true }],
        include: true, why: 'Covers the topic of the search', weight: 0.4 }),
      step({ id: 't2', channel: 'ad', title: 'Programmatic journal ad', timing: 'Starts in 2h · runs 7 days', timingOptions: [t('Starts in 2h · runs 7 days', 2), t('Starts tomorrow · runs 7 days', 20)],
        contentId: 'VEL-AD-118', contentOptions: [{ id: 'VEL-AD-118', label: 'JACC Heart Failure banner', approved: true }],
        include: true, why: 'Keeps Velora visible without another direct contact', weight: 0.2 }),
    ],
    log: [{ text: 'Plan drafted by system', at: '07:02', who: 'System' }, { text: 'Signal detected', at: '06:20', who: 'System' }],
  },
  {
    id: 'kamble-guide', doctorId: 'kamble', signal: 'Guideline download',
    signalDetail: 'Downloaded the updated heart-failure guideline summary.',
    age: 28, priority: 79, breakdown: [{ label: 'Signal strength', value: 30 }, { label: 'Doctor value', value: 24 }, { label: 'Timing', value: 25 }],
    group: 'blocked', reasonLine: 'Email cap reached', status: 'review', impact: [0.8, 1.6], confidence: 'medium',
    steps: [
      step({ id: 'k1', channel: 'email', title: 'Guideline summary email', timing: 'Today 6:00 pm', timingOptions: [t('Today 6:00 pm', 7), t('Next week', 120)],
        contentId: 'VEL-EM-150', contentOptions: [{ id: 'VEL-EM-150', label: 'Guideline at a glance', approved: true }],
        include: true, why: 'Matches what Dr. Kamble just read (81% email affinity)', weight: 0.4 }),
      repStep('k2', 'L. Varghese', 5, 'No rep contact this month', 'VEL-REP-101', 'Outcomes data talking points'),
    ],
    log: [{ text: 'Plan drafted by system', at: '07:40', who: 'System' }],
  },
  {
    id: 'sequeira-lab', doctorId: 'sequeira', signal: 'Lab result trend',
    signalDetail: 'More patients with heart-failure lab patterns in the last 30 days (aggregated, de-identified).',
    age: 34, priority: 81, breakdown: [{ label: 'Signal strength', value: 36 }, { label: 'Doctor value', value: 27 }, { label: 'Timing', value: 18 }],
    group: 'conflict', reasonLine: '2 plans in 24h would exceed the email cap', status: 'review', impact: [1.0, 2.0], confidence: 'medium',
    conflict: { signal: 'Competitor search', when: 'tomorrow 9:00 am', hasEmail: true },
    steps: [
      step({ id: 's1', channel: 'email', title: 'Clinical data email', timing: 'Today 3:00 pm', timingOptions: [t('Today 3:00 pm', 4), t('Tomorrow 2:00 pm', 27)],
        contentId: 'VEL-EM-207', contentOptions: [{ id: 'VEL-EM-207', label: 'New data on titration', approved: true }],
        include: true, why: 'Opens about half of our emails', weight: 0.3 }),
      repStep('s2', 'D. Barua', 2, 'Rep visited 12 days ago; good follow-up window'),
    ],
    log: [{ text: 'Plan drafted by system', at: '08:05', who: 'System' }],
  },
  {
    id: 'bhattacharjee-guide', doctorId: 'bhattacharjee', signal: 'Guideline download',
    signalDetail: 'Downloaded the updated heart-failure guideline summary and the dosing appendix.',
    age: 37, priority: 95, breakdown: [{ label: 'Signal strength', value: 32 }, { label: 'Doctor value', value: 45 }, { label: 'Timing', value: 18 }],
    group: 'high', reasonLine: 'Guideline download · Tier-1 prescriber sign-off', status: 'review', impact: [1.6, 3.0], confidence: 'high',
    steps: [
      repStep('b1', 'T. Dhillon', 3, 'Strong relationship; visited 6 days ago', 'VEL-REP-101', 'Outcomes data talking points'),
      step({ id: 'b2', channel: 'email', title: 'Guideline summary email', timing: 'Tomorrow 9:00 am', timingOptions: [t('Today 4:00 pm', 5), t('Tomorrow 9:00 am', 22)],
        contentId: 'VEL-EM-150', contentOptions: [{ id: 'VEL-EM-150', label: 'Guideline at a glance', approved: true }],
        include: true, why: 'Arrives after the rep conversation, not before', weight: 0.25 }),
      step({ id: 'b3', channel: 'webinar', title: 'Invite to HF dosing webinar, Dec 10', timing: 'Tomorrow 10:00 am', timingOptions: [t('Tomorrow 10:00 am', 23)],
        contentId: 'VEL-WB-005', contentOptions: [{ id: 'VEL-WB-005', label: 'HF dosing webinar invite', approved: true }],
        include: true, why: 'Attended two of our last three events', weight: 0.15 }),
    ],
    log: [{ text: 'Plan drafted by system', at: '05:58', who: 'System' }],
  },
  {
    id: 'kshirsagar-webinar', doctorId: 'kshirsagar', signal: 'Webinar attendance',
    signalDetail: 'Attended the full HF dosing webinar yesterday and asked a question about older patients.',
    age: 8, priority: 88, breakdown: [{ label: 'Signal strength', value: 34 }, { label: 'Doctor value', value: 40 }, { label: 'Timing', value: 14 }],
    group: 'high', reasonLine: 'Webinar attendance · Tier-1 prescriber sign-off', status: 'review', impact: [1.4, 2.6], confidence: 'medium',
    steps: [
      repStep('l1', 'M. Fernandes', 1, 'Answer the question from the webinar in person'),
      step({ id: 'l2', channel: 'ad', title: 'Programmatic journal ad', timing: 'Starts tomorrow · runs 7 days', timingOptions: [t('Starts in 2h · runs 7 days', 2), t('Starts tomorrow · runs 7 days', 20)],
        contentId: 'VEL-AD-121', contentOptions: [{ id: 'VEL-AD-121', label: 'Titration guide banner', approved: true }],
        include: true, why: 'High journal affinity in electrophysiology', weight: 0.15 }),
    ],
    log: [{ text: 'Plan drafted by system', at: '09:30', who: 'System' }],
  },
  {
    id: 'lobo-comp', doctorId: 'lobo', signal: 'Competitor search',
    signalDetail: 'Searched for a competing heart-failure therapy twice.',
    age: 50, priority: 72, breakdown: [{ label: 'Signal strength', value: 30 }, { label: 'Doctor value', value: 22 }, { label: 'Timing', value: 20 }],
    group: 'expired', reasonLine: 'Window closed 2h ago', status: 'review', impact: [0.6, 1.2], confidence: 'low',
    steps: [
      step({ id: 'v1', channel: 'email', title: 'Head-to-head summary email', timing: 'Today 1:00 pm', timingOptions: [t('Today 1:00 pm', 2)],
        contentId: 'VEL-EM-198', contentOptions: [{ id: 'VEL-EM-198', label: 'Titration guide summary', approved: true }],
        include: true, why: 'Covers the topic of the search', weight: 0.4 }),
    ],
    log: [{ text: 'Plan drafted by system', at: 'Mon 08:10', who: 'System' }],
  },
]

const FIRST = ['A', 'B', 'C', 'D', 'G', 'H', 'J', 'K', 'M', 'N', 'P', 'R', 'S', 'U', 'V', 'Y']
const LAST = ['Kulkarni', 'Pinto', 'Chhabra', 'Mukherjee', 'Naik', 'Thakkar', 'Saldanha', 'Gaitonde', 'Rege', 'Bhide', 'Dalvi', 'Sawant', 'Kapadia', 'Wadia', 'Mistry', 'Borkar', 'Kini', 'Shenoy', 'Pai', 'Hegde', 'Ranade', 'Joglekar', 'Apte', 'Phadke', 'Sule', 'Tambe', 'Mhatre', 'Vaidya', 'Lele', 'Karnik', 'Oak', 'Datar', 'Godbole', 'Paranjpe', 'Khare', 'Bapat', 'Gokhale']
const CITIES = ['Chicago', 'Miami', 'Seattle', 'Boston', 'Cleveland', 'San Diego', 'Atlanta', 'Dallas', 'Denver', 'Phoenix', 'Detroit', 'Portland', 'Columbus', 'Nashville']
const REPS = ['S. Kamat', 'A. Bhagat', 'L. Varghese', 'D. Barua', 'T. Dhillon', 'K. Lepcha', 'M. Fernandes']

function batchDoctors(): BatchDoctor[] {
  const out: BatchDoctor[] = [{
    id: 'gogoi', name: 'Dr. T. Gogoi', npi: '••••9034', specialty: 'Cardiology', city: 'Denver', hoursLeft: 30, emails30: 0,
    rep: { name: 'K. Lepcha', load: 3, cap: 6 }, outlier: 'Not on target list · no email consent · plan will skip email',
  }]
  for (let i = 0; i < 37; i++) {
    out.push({
      id: `bd${i}`, name: `Dr. ${FIRST[(i * 7) % FIRST.length]}. ${LAST[i % LAST.length]}`, npi: `••••${String(1000 + ((i * 7919) % 9000)).padStart(4, '0')}`,
      specialty: i % 9 === 4 ? 'Heart failure' : 'Cardiology', city: CITIES[(i * 5) % CITIES.length], hoursLeft: 28 + (i % 9),
      emails30: i % 4, rep: { name: REPS[i % REPS.length], load: 1 + (i % 5), cap: 6 },
    })
  }
  return out
}

export const BATCHES: Batch[] = [{
  id: 'lab-cardio', title: '38 cardiologists · Lab result trend', signal: 'Lab result trend',
  summary: 'Same plan drafted for all. 37 pass every rule. 1 needs a look.',
  steps: [
    { channel: 'email', title: 'Clinical data email', detail: 'VEL-EM-207 · sent within 4h of release', contentId: 'VEL-EM-207' },
    { channel: 'rep', title: 'Rep suggestion', detail: 'Discuss titration guide · reps decide timing', contentId: 'VEL-REP-092' },
  ],
  doctors: batchDoctors(), status: 'review', impact: [1.4, 2.6], confidence: 'medium',
}]

export const AUTO_RELEASED = [
  { name: 'Dr. P. Deshmukh', channels: ['email', 'ad'] as const, at: '08:14' },
  { name: 'Dr. K. Bhonsle', channels: ['email'] as const, at: '07:52' },
  { name: 'Dr. T. Murugan', channels: ['rep', 'email'] as const, at: '06:40' },
  { name: 'Dr. H. Lalwani', channels: ['ad'] as const, at: 'Yesterday' },
]
