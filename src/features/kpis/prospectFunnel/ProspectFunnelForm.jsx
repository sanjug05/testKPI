import React from 'react';
import { Plus } from 'lucide-react';
import ActionButton from '../../../components/shared/ui/ActionButton';
import { Field, SelectField } from '../../../components/shared/ui/FormField';
import { PROSPECT_FUNNEL_SOURCES, PROSPECT_FUNNEL_STATUSES } from './prospectFunnelConfig';

const ProspectFunnelForm = ({ editingId, form, readOnly, onChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="space-y-2 text-[11px]">
    <Field label="Date" type="date" value={form.date} disabled={readOnly} onChange={(value) => onChange('date', value)} />
    <Field label="Prospect Name" value={form.prospectName} disabled={readOnly} onChange={(value) => onChange('prospectName', value)} />
    <div className="grid grid-cols-2 gap-2">
      <Field label="Company" value={form.company} disabled={readOnly} onChange={(value) => onChange('company', value)} />
      <Field label="Zone" value={form.zone} disabled={readOnly} onChange={(value) => onChange('zone', value)} />
    </div>
    <div className="grid grid-cols-2 gap-2">
      <SelectField label="Lead Source" value={form.source} disabled={readOnly} options={PROSPECT_FUNNEL_SOURCES.filter((source) => source !== 'All')} onChange={(value) => onChange('source', value)} />
      <SelectField label="Status" value={form.status} disabled={readOnly} options={PROSPECT_FUNNEL_STATUSES} onChange={(value) => onChange('status', value)} />
    </div>
    <div className="grid grid-cols-2 gap-2">
      <Field label="Salesperson" value={form.salesperson} disabled={readOnly} onChange={(value) => onChange('salesperson', value)} />
      <Field label="Contact (optional)" value={form.contact} disabled={readOnly} onChange={(value) => onChange('contact', value)} />
    </div>

    <ActionButton type="submit" disabled={readOnly} icon={Plus} className="mt-2 w-full py-1.5">
      {editingId ? 'Update Prospect' : 'Add Prospect'}
    </ActionButton>
  </form>
);

export default ProspectFunnelForm;
