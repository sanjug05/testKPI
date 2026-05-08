export const PROSPECT_FUNNEL_SOURCES = ['All', 'Referral', 'Digital', 'Exhibition', 'Cold Call', 'Walk-in'];
export const PROSPECT_FUNNEL_STATUSES = ['Interested', 'Shortlisted', 'CFT Done', 'Converted'];

export const INITIAL_PROSPECT_FORM = {
  date: '2025-10-05',
  prospectName: '',
  company: '',
  zone: 'North',
  source: 'Referral',
  status: 'Interested',
  salesperson: '',
  contact: '',
};

export const PROSPECT_FUNNEL_TABLE_COLUMNS = [
  { key: 'date', label: 'Date' },
  { key: 'source', label: 'Lead Source' },
  { key: 'prospectName', label: 'Prospect Name' },
  { key: 'company', label: 'Company' },
  { key: 'contact', label: 'Contact' },
  { key: 'status', label: 'Status' },
  { key: 'salesperson', label: 'Salesperson' },
  { key: 'actions', label: 'Actions', className: 'text-right px-2 py-1' },
];

export const toProspectForm = (record = {}) => ({
  date: record.date || INITIAL_PROSPECT_FORM.date,
  prospectName: record.prospectName || '',
  company: record.company || '',
  zone: record.zone || INITIAL_PROSPECT_FORM.zone,
  source: record.source || INITIAL_PROSPECT_FORM.source,
  status: record.status || INITIAL_PROSPECT_FORM.status,
  salesperson: record.salesperson || '',
  contact: record.contact || '',
});

export const resetProspectIdentityFields = (form) => ({
  ...form,
  prospectName: '',
  company: '',
  salesperson: '',
  contact: '',
});
