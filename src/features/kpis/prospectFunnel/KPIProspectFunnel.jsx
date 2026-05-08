import React, { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import FilterBar from '../../../components/shared/ui/FilterBar';
import ProspectFunnelChart from '../../../components/Charts/ProspectFunnelChart';
import { useFilters } from '../../../hooks/useFilters';
import { useKPIData } from '../../../hooks/useKPIData';
import { useViewOnlyGuard } from '../../../hooks/useViewOnlyGuard';
import KPIChartSection from '../components/KPIChartSection';
import KPIContainer from '../components/KPIContainer';
import KPIFormSection from '../components/KPIFormSection';
import KPISummaryCards from '../components/KPISummaryCards';
import ProspectFunnelForm from './ProspectFunnelForm';
import ProspectFunnelTable from './ProspectFunnelTable';
import {
  INITIAL_PROSPECT_FORM,
  PROSPECT_FUNNEL_SOURCES,
  resetProspectIdentityFields,
  toProspectForm,
} from './prospectFunnelConfig';
import { calculateProspectFunnelMetrics } from './prospectFunnelMetrics';

const KPIProspectFunnel = ({ dateRange }) => {
  const { viewOnly, canWrite } = useViewOnlyGuard();
  const { filters, setFilter } = useFilters({ source: 'All' });
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(INITIAL_PROSPECT_FORM);

  const dataFilters = useMemo(() => ({
    from: dateRange.from,
    to: dateRange.to,
    source: filters.source,
  }), [dateRange.from, dateRange.to, filters.source]);

  const { loading, records, reload, repository } = useKPIData({
    collectionKey: 'prospectFunnel',
    filters: dataFilters,
    errorMessage: 'Failed to load prospect funnel data',
  });

  const { funnel, summaryCards } = useMemo(() => calculateProspectFunnelMetrics(records), [records]);

  const filterOptions = useMemo(() => ([{
    id: 'source',
    value: filters.source,
    onChange: (value) => setFilter('source', value),
    options: PROSPECT_FUNNEL_SOURCES.map((source) => ({
      value: source,
      label: source === 'All' ? 'All sources' : source,
    })),
  }]), [filters.source, setFilter]);

  const handleFieldChange = useCallback((field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canWrite()) return;

    const payload = { ...form, createdAt: new Date().toISOString() };

    try {
      if (editingId) {
        await repository.update(editingId, payload);
        toast.success('Prospect updated');
      } else {
        await repository.create(payload);
        toast.success('Prospect added');
      }

      setForm((current) => resetProspectIdentityFields(current));
      setEditingId(null);
      await reload();
    } catch (error) {
      console.error(error);
      toast.error('Save failed');
    }
  };

  const handleEdit = useCallback((record) => {
    setEditingId(record.id);
    setForm(toProspectForm(record));
  }, []);

  const handleDelete = async (id) => {
    if (!canWrite()) return;
    if (!window.confirm('Delete this prospect entry?')) return;

    try {
      await repository.remove(id);
      toast.success('Deleted');
      await reload();
    } catch (error) {
      console.error(error);
      toast.error('Delete failed');
    }
  };

  return (
    <KPIContainer
      title="KPI 1 · Interested Prospect Funnel"
      description="Track all prospects showing interest and funnel conversion from Interested → Converted."
      toolbar={<FilterBar filters={filterOptions} />}
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <KPISummaryCards metrics={summaryCards} />
        <KPIChartSection><ProspectFunnelChart funnel={funnel} /></KPIChartSection>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <KPIFormSection title={editingId ? 'Edit Prospect' : 'Add Prospect'} readOnly={viewOnly}>
          <ProspectFunnelForm
            editingId={editingId}
            form={form}
            readOnly={viewOnly}
            onChange={handleFieldChange}
            onSubmit={handleSubmit}
          />
        </KPIFormSection>

        <ProspectFunnelTable
          loading={loading}
          records={records}
          readOnly={viewOnly}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </KPIContainer>
  );
};

export default KPIProspectFunnel;
