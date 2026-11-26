// Fictional answers for "Ask" and data for "Results".

export interface Answer {
  id: string
  question: string
  match: RegExp
  answer: string
  chips: string[]
  drivers: { label: string; value: number; unexplained?: boolean }[]
  method: string[]
  changes: { label: string; range: [number, number]; on: boolean; guardrail?: { emailCap?: number; repMax?: number } }[]
  base: [number, number]
  table: { cols: string[]; rows: string[][]; total: number }
}

export const ANSWERS: Answer[] = [
  {
    id: 'ne-drop',
    question: 'Why did script lift drop in Northeast cardiology over the last 4 weeks?',
    match: /north|drop|fell|dip|decline/i,
    answer: 'Lift fell from about +3.1 to +1.9 per 100 doctors. The two biggest likely causes: more emails than planned, and two rep territories left empty.',
    chips: ['1,240 cardiologists', 'Data refreshed 6h ago', 'Confidence: medium'],
    drivers: [
      { label: 'More emails than planned', value: -0.6 },
      { label: 'Two vacant rep territories', value: -0.5 },
      { label: 'Peer adoption webinar', value: 0.1 },
      { label: 'Unexplained', value: -0.2, unexplained: true },
    ],
    method: [
      'Compared 1,240 Northeast cardiologists reached by signal-driven plans with 1,180 matched doctors who were not.',
      'Matched on specialty, prescribing volume, prior Velora use and territory type.',
      'Window: last 4 weeks vs the 8 weeks before. Drivers are statistical associations, not proven causes.',
    ],
    changes: [
      { label: 'Cap Northeast emails at 4 a month', range: [0.2, 0.4], on: true, guardrail: { emailCap: 4 } },
      { label: 'Virtual rep calls in vacant territories', range: [0.3, 0.5], on: true },
    ],
    base: [1.9, 2.0],
    table: {
      cols: ['Doctor', 'Territory', 'Emails (30d)', 'Last rep visit', 'Lift'],
      rows: [
        ['Dr. K. Gaitonde', 'Boston N', '7', '41 days', '−0.8'],
        ['Dr. P. Mistry', 'Boston N', '6', '35 days', '−0.5'],
        ['Dr. R. Bapat', 'Hartford', '6', 'vacant', '−0.6'],
        ['Dr. J. Kini', 'Providence', '4', '9 days', '+0.4'],
      ],
      total: 1240,
    },
  },
  {
    id: 'top-signal',
    question: 'Which signal has the highest lift?',
    match: /signal|highest|best|most/i,
    answer: 'Lab result trends do best: about +2.4 to +3.4 per 100 doctors when acted on within 48 hours. Publication downloads do worst, mostly because they are acted on after the window closes.',
    chips: ['All regions', 'Last 12 weeks', 'Confidence: high'],
    drivers: [
      { label: 'Lab result trend', value: 2.9 },
      { label: 'Peer adoption', value: 2.5 },
      { label: 'Competitor search', value: 2.3 },
      { label: 'Publication download', value: 1.0 },
    ],
    method: ['Lift per signal type vs matched comparison doctors, last 12 weeks.', 'Only plans acted on within 48 hours are counted for the 48h figures.'],
    changes: [
      { label: 'Raise priority of lab result signals', range: [0.2, 0.4], on: true },
      { label: 'Auto-release publication-download plans under priority 80', range: [0.1, 0.3], on: true },
    ],
    base: [2.3, 2.6],
    table: { cols: ['Signal type', 'Plans', 'Acted on in 48h', 'Lift'], rows: [['Lab result trend', '512', '94%', '+2.4 to +3.4'], ['Competitor search', '318', '88%', '+1.8 to +2.8'], ['Peer adoption', '264', '91%', '+2.0 to +3.0'], ['Publication download', '190', '54%', '+0.6 to +1.4']], total: 1284 },
  },
  {
    id: 'vacant',
    question: 'Show vacant rep territories',
    match: /vacant|territor|rep|coverage/i,
    answer: 'Two territories have had no rep for three weeks: Boston North and Hartford. 312 target doctors are in them, and rep suggestions there are being held.',
    chips: ['14 Northeast territories', 'Data refreshed 1 day ago', 'Confidence: high'],
    drivers: [
      { label: 'Boston North (vacant 23 days)', value: -0.4 },
      { label: 'Hartford (vacant 19 days)', value: -0.3 },
      { label: 'Covered territories', value: 0.2 },
    ],
    method: ['Territory coverage from the CRM roster, refreshed daily.', 'Lift compares doctors in vacant territories with matched doctors in covered ones.'],
    changes: [
      { label: 'Route held suggestions to virtual reps', range: [0.3, 0.5], on: true },
      { label: 'Lower rep suggestions per week to 5 elsewhere', range: [0.0, 0.1], on: false, guardrail: { repMax: 5 } },
    ],
    base: [1.9, 2.0],
    table: { cols: ['Territory', 'Doctors', 'Held suggestions', 'Days vacant'], rows: [['Boston North', '168', '41', '23'], ['Hartford', '144', '29', '19']], total: 312 },
  },
]

export const SUGGESTED = ['Why did Northeast email opens dip?', 'Which signal has the highest lift?', 'Show vacant rep territories']

export const WEEKLY = [
  { week: 'W1', reached: 11.6, comparison: 11.3 },
  { week: 'W2', reached: 12.0, comparison: 11.5 },
  { week: 'W3', reached: 12.5, comparison: 11.8 },
  { week: 'W4', reached: 13.2, comparison: 12.1 },
  { week: 'W5', reached: 13.9, comparison: 12.4 },
  { week: 'W6', reached: 14.3, comparison: 12.7 },
  { week: 'W7', reached: 15.0, comparison: 13.0 },
  { week: 'W8', reached: 15.4, comparison: 13.3 },
  { week: 'W9', reached: 15.9, comparison: 13.6 },
  { week: 'W10', reached: 16.4, comparison: 13.9 },
  { week: 'W11', reached: 16.8, comparison: 14.2 },
  { week: 'W12', reached: 17.3, comparison: 14.6 },
]

export const BY_SIGNAL = [
  { type: 'Lab result trend', plans: 512, acted: 94, accept: 68, lift: '+2.4 to +3.4', trend: [2.1, 2.3, 2.4, 2.6, 2.8, 2.9] },
  { type: 'Competitor search', plans: 318, acted: 88, accept: 59, lift: '+1.8 to +2.8', trend: [2.0, 2.0, 2.1, 2.2, 2.2, 2.3] },
  { type: 'Peer adoption', plans: 264, acted: 91, accept: 64, lift: '+2.0 to +3.0', trend: [2.1, 2.3, 2.3, 2.3, 2.4, 2.5] },
  { type: 'Publication download', plans: 190, acted: 54, accept: 47, lift: '+0.6 to +1.4', trend: [1.3, 1.2, 1.2, 1.1, 1.0, 1.0], late: true },
]

export const LEARNED = [
  'Lab result trends acted on within 24h drive 1.6x higher rep acceptance than older signals.',
  'Publication downloads often miss the 48h window when routed to manual review.',
  'Capping emails at 4 per 30 days kept opt-outs below 0.3% without reducing lift.',
]
