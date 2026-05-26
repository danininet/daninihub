const LEGAL_PAGES = Object.freeze([
  {
    slug: 'impressum',
    title: 'Impressum',
    mandatoryFor: ['DACH'],
    status: 'required_before_public_launch',
    sections: [
      'Responsible entity',
      'Contact information',
      'Business purpose',
      'Liability notice',
      'Copyright notice'
    ]
  },
  {
    slug: 'datenschutz',
    title: 'Datenschutzerklärung',
    mandatoryFor: ['DACH'],
    status: 'required_before_public_launch',
    sections: [
      'GDPR/DSGVO rights',
      'Data processing',
      'Cookies and analytics',
      'Email and contact forms',
      'Third-party providers',
      'Data deletion and export'
    ]
  },
  {
    slug: 'ki-transparenz',
    title: 'KI Transparenz',
    mandatoryFor: ['DACH'],
    status: 'required_before_public_launch',
    sections: [
      'AI assisted content policy',
      'Human review obligation',
      'No guarantee policy',
      'Illustration and visualization notice',
      'Educational and informational scope'
    ]
  },
  {
    slug: 'haftungsausschluss',
    title: 'Haftungsausschluss',
    mandatoryFor: ['DACH'],
    status: 'required_before_public_launch',
    sections: [
      'No legal advice',
      'No financial advice',
      'No investment guarantee',
      'No technical guarantee',
      'Independent verification requirement'
    ]
  },
  {
    slug: 'affiliate-offenlegung',
    title: 'Affiliate Offenlegung',
    mandatoryFor: ['DACH'],
    status: 'required_if_affiliate_links_exist',
    sections: [
      'Affiliate compensation notice',
      'No influence guarantee',
      'Independent user responsibility'
    ]
  }
]);

function getLegalPages() {
  return LEGAL_PAGES;
}

module.exports = {
  LEGAL_PAGES,
  getLegalPages
};
