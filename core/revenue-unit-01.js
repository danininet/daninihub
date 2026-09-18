'use strict';

const REVENUE_UNIT_01 = Object.freeze({
  id: 'RU-001-AI-OFFICE-DACH',
  status: 'HYPOTHESIS',
  market: 'DACH',
  phase1Market: 'DE',
  phase1Region: 'NRW',
  segment: [
    'Gebäudereinigung',
    'Hausmeisterservice',
    'Garten- und Gebäudeservice'
  ],
  buyer: 'Owner-managed local B2B service firms with fragmented phone, email and WhatsApp intake.',
  problemHypothesis: 'Relevant enquiries are delayed, forgotten or poorly qualified because daily field work and office administration compete for the same owner/staff time.',
  product: 'AI Office 24/7',
  promiseBoundary: 'Reduce avoidable intake and follow-up friction; no revenue, conversion, ranking or legal-result guarantee.',
  pilotScope: [
    'capture enquiry',
    'collect contact, need, location, photos and preferred time',
    'prepare booking or callback',
    'prepare follow-up for open enquiries',
    'request feedback after completed service',
    'escalate unclear or risky cases to a human'
  ],
  excludedUntilSeparatelyApproved: [
    'binding quotes',
    'contract acceptance',
    'payment collection',
    'automated legal advice',
    'cold bulk email',
    'automated outbound calls',
    'external AI processing of sensitive customer data'
  ],
  commercialHypothesis: {
    pilot: 'priced individually after fit check',
    recurring: 'only after a measurable pilot signal',
    publicPriceBinding: false
  },
  marketTest: {
    maxInitialProspects: 50,
    minPositiveSignals: 3,
    minQualifiedConversations: 2,
    minPaidCustomers: 1,
    stopRule: 'If sufficient targeted exposure produces too little buyer signal, redefine the problem/segment before building more software.'
  },
  outreachPolicy: {
    status: 'OWNER_APPROVAL_REQUIRED',
    germanyEmailRule: 'Do not send unsolicited advertising email without prior express consent or a documented statutory exception.',
    germanyPhoneRule: 'B2B calls require at least presumed consent; consumer calls require prior express consent.',
    allowedBeforeCampaignApproval: [
      'public market research',
      'public prospect research',
      'lead scoring',
      'drafting messages',
      'preparing account-specific audits'
    ],
    prohibitedBeforeCampaignApproval: [
      'send external sales messages',
      'place advertising calls',
      'spend money',
      'publish unapproved claims'
    ]
  }
});

module.exports = { REVENUE_UNIT_01 };
