import React from 'react';
import { Plus } from 'lucide-react';
import ActionButton from '../../../components/shared/ui/ActionButton';
import { Field, SelectField } from '../../../components/shared/ui/FormField';
import { ASM_OPTIONS, getStatesForRegion, getTerritoriesForState, REGIONS, RM_OPTIONS } from '../../../config/hierarchy';
import { PROSPECT_FUNNEL_SOURCES, PROSPECT_FUNNEL_STATUSES } from './prospectFunnelConfig';

const ProspectFunnelForm = ({ editingId, form, readOnly, onChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="space-y-2 text-[11px]">
    <Field label="Date" type="date" value={form.date} disabled={readOnly} onChange={(value) => onChange('date', value)} />
    <Field label="Prospect Name" value={form.prospectName} disabled={readOnly} onChange={(value) => onChange('prospectName', value)} />
    <div className="grid grid-cols-2 gap-2">
      <Field label="Company" value={form.company} disabled={readOnly} onChange={(value) => onChange('company', value)} />
      <SelectField label="Region" value={form.region} disabled={readOnly} options={REGIONS} onChange={(value) => onChange('region', value)} />
    </div>
    <div className="grid grid-cols-2 gap-2">
      <SelectField label="State" value={form.state} disabled={readOnly} options={getStatesForRegion(form.region)} onChange={(value) => onChange('state', value)} />
      <SelectField label="Territory" value={form.territory} disabled={readOnly} options={getTerritoriesForState(form.state)} onChange={(value) => onChange('territory', value)} />
    </div>
    <div className="grid grid-cols-2 gap-2">
      <SelectField label="RM" value={form.rm} disabled={readOnly} options={RM_OPTIONS} onChange={(value) => onChange('rm', value)} />
      <SelectField label="ASM" value={form.asm} disabled={readOnly} options={ASM_OPTIONS} onChange={(value) => onChange('asm', value)} />
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
