import React, { useMemo } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { ASM_OPTIONS, getStatesForRegion, getTerritoriesForState, REGIONS, RM_OPTIONS, SALESPERSON_OPTIONS } from '../../config/hierarchy';
import { KPI_HEALTH_STATUS } from '../../config/kpiIntelligence';
import { PROSPECT_FUNNEL_SOURCES } from '../../features/kpis/prospectFunnel/prospectFunnelConfig';

const asOptions = (values) => ['All', ...values].map((value) => ({ value, label: value }));

const GlobalFilters = ({ filters, onChange, onReset }) => {
  const stateOptions = useMemo(() => asOptions(getStatesForRegion(filters.region)), [filters.region]);
  const territoryOptions = useMemo(() => asOptions(getTerritoriesForState(filters.state)), [filters.state]);
  const controls = [
    { id: 'region', label: 'Region', options: asOptions(REGIONS) },
    { id: 'state', label: 'State', options: stateOptions },
    { id: 'territory', label: 'Territory', options: territoryOptions },
    { id: 'rm', label: 'RM', options: asOptions(RM_OPTIONS) },
    { id: 'asm', label: 'ASM', options: asOptions(ASM_OPTIONS) },
    { id: 'salesperson', label: 'Salesperson', options: asOptions(SALESPERSON_OPTIONS) },
    { id: 'source', label: 'Lead Source', options: PROSPECT_FUNNEL_SOURCES.map((value) => ({ value, label: value === 'All' ? 'All sources' : value })) },
    { id: 'kpiStatus', label: 'KPI Status', options: asOptions(Object.values(KPI_HEALTH_STATUS)) },
  ];

  return (
    <section className="glass-effect p-3 mb-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 text-xs text-teal font-semibold uppercase tracking-wide">
          <SlidersHorizontal size={15} /> Enterprise Filters
        </div>
        <button type="button" onClick={onReset} className="text-[11px] text-teal hover:text-gold">Reset filters</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2">
        {controls.map((control) => (
          <label key={control.id} className="text-[10px] text-white/60">
            {control.label}
            <select value={filters[control.id]} onChange={(event) => onChange(control.id, event.target.value)} className="mt-1 w-full glass-input px-2 py-1 rounded text-[11px] focus:outline-none">
              {control.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        ))}
      </div>
    </section>
  );
};

export default GlobalFilters;
