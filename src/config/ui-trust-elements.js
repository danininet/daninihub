const TRUST_BADGES = Object.freeze([
  {
    id: 'ai-assisted',
    label: 'AI Assisted',
    description: 'AI may support structure, formatting or analysis. Human review remains required.'
  },
  {
    id: 'human-review-required',
    label: 'Human Review Required',
    description: 'No automated output should be treated as final authority.'
  },
  {
    id: 'dach-first',
    label: 'DACH First',
    description: 'Built for German-speaking markets and regulatory expectations.'
  },
  {
    id: 'evidence-first',
    label: 'Evidence First',
    description: 'No fabricated metrics, guarantees or simulated proof.'
  },
  {
    id: 'user-owned-output',
    label: 'User Owned Output',
    description: 'Generated artifacts belong to the user under configured conditions.'
  }
]);

const DISCLAIMER_LIBRARY = Object.freeze([
  {
    id: 'general',
    title: 'General Disclaimer',
    text: 'Educational and informational use only. No legal, financial, tax or investment advice.'
  },
  {
    id: 'ai',
    title: 'AI Transparency Disclaimer',
    text: 'AI may assist with structuring, formatting, summarization or visualization. Human verification remains required.'
  },
  {
    id: 'visual',
    title: 'Visualization Disclaimer',
    text: 'Concept renders, diagrams and illustrations are orientation aids and not guaranteed final states.'
  },
  {
    id: 'affiliate',
    title: 'Affiliate Disclaimer',
    text: 'Some links may generate commissions without additional user cost.'
  },
  {
    id: 'lead-calculator',
    title: 'Lead Calculator Disclaimer',
    text: 'Qualification support only. Not a financial or investment evaluation system.'
  }
]);

const VISUAL_RULES = Object.freeze([
  'Swiss minimalism inspired structure',
  'No neon AI clichés',
  'No fake dashboards',
  'No fabricated metrics',
  'Dark charcoal base with muted lime accents',
  'High readability and DACH trust orientation',
  'Iconography must support clarity, not decoration'
]);

module.exports = {
  TRUST_BADGES,
  DISCLAIMER_LIBRARY,
  VISUAL_RULES
};
