import React, { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Download, FileText } from 'lucide-react';
import FilterBar from '../../../components/shared/ui/FilterBar';
import ProspectFunnelChart from '../../../components/Charts/ProspectFunnelChart';
import InsightCards from '../../../components/Enterprise/InsightCards';
import ActionButton from '../../../components/shared/ui/ActionButton';
import { PERMISSIONS } from '../../../config/rbac';
import { useAuth } from '../../../contexts/AuthContext';
import { useFilters } from '../../../hooks/useFilters';
import { useKPIData } from '../../../hooks/useKPIData';
import { usePermissions } from '../../../hooks/usePermissions';
import { useTargets } from '../../../hooks/useTargets';
import { useViewOnlyGuard } from '../../../hooks/useViewOnlyGuard';
import { buildAuditMetadata } from '../../../utils/audit';
import { exportToExcel, exportToPdf } from '../../../utils/exporters';
import { buildHierarchyMetadata } from '../../../config/hierarchy';
import { buildProspectInsights } from '../../../utils/insights';
import KPIChartSection from '../components/KPIChartSection';
import KPIContainer from '../components/KPIContainer';
import KPIFormSection from '../components/KPIFormSection';
import KPISummaryCards from '../components/KPISummaryCards';
import ProspectFunnelForm from './ProspectFunnelForm';
import ProspectFunnelTable from './ProspectFunnelTable';
import {
  INITIAL_PROSPECT_FORM,
  PROSPECT_FUNNEL_SOURCES,
  PROSPECT_FUNNEL_TABLE_COLUMNS,
  resetProspectIdentityFields,
  toProspectForm,
} from './prospectFunnelConfig';
import { calculateProspectFunnelMetrics } from './prospectFunnelMetrics';

const normalizeRecordForEnterprise = (record) => ({
  ...record,
  ...buildHierarchyMetadata(record),
  zone: record.region || record.zone,
  monthKey: record.date?.slice(0, 7),
});

const KPIProspectFunnel = ({ dateRange, globalFilters = {} }) => {
  const { user, profile } = useAuth();
  const { can } = usePermissions();
  const { viewOnly, canWrite } = useViewOnlyGuard();
  const lockedSourceFilter = globalFilters.source && globalFilters.source !== 'All' ? globalFilters.source : null;
  const { filters, setFilter } = useFilters({ source: lockedSourceFilter || 'All' });
  const [editingId, setEditingId] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form, setForm] = useState(INITIAL_PROSPECT_FORM);

  const dataFilters = useMemo(() => ({
    from: dateRange.from,
    to: dateRange.to,
    source: lockedSourceFilter || filters.source,
    region: globalFilters.region,
    state: globalFilters.state,
    territory: globalFilters.territory,
    rm: globalFilters.rm,
    asm: globalFilters.asm,
    salesperson: globalFilters.salesperson,
  }), [dateRange.from, dateRange.to, filters.source, globalFilters, lockedSourceFilter]);

  const { loading, records, reload, repository } = useKPIData({
    collectionKey: 'prospectFunnel',
    filters: dataFilters,
    errorMessage: 'Failed to load prospect funnel data',
  });

  const enterpriseRecords = useMemo(() => records.map(normalizeRecordForEnterprise), [records]);
  const { funnel, summaryCards } = useMemo(() => calculateProspectFunnelMetrics(enterpriseRecords), [enterpriseRecords]);
  const insights = useMemo(() => buildProspectInsights(enterpriseRecords), [enterpriseRecords]);
  const periodKey = dateRange.from?.slice(0, 7);
  const { targetValue, health } = useTargets({
    kpiKey: 'prospectFunnel',
    periodType: 'monthly',
    periodKey,
    territory: globalFilters.territory,
    role: profile.role,
    achievement: funnel.converted,
  });

  const enrichedSummaryCards = useMemo(() => ([
    ...summaryCards,
    { id: 'target', label: 'Monthly target', value: targetValue || 'Not set', valueClassName: 'text-teal' },
    { id: 'health', label: 'KPI health', value: health.status, valueClassName: health.atRisk ? 'text-rose-300' : 'text-emerald-300' },
  ]), [health.atRisk, health.status, summaryCards, targetValue]);

  const filteredRecords = useMemo(() => {
    if (!globalFilters.kpiStatus || globalFilters.kpiStatus === 'All') return enterpriseRecords;
    return health.status === globalFilters.kpiStatus ? enterpriseRecords : [];
  }, [enterpriseRecords, globalFilters.kpiStatus, health.status]);

  const filterOptions = useMemo(() => ([{
    id: 'source',
    value: lockedSourceFilter || filters.source,
    onChange: (value) => setFilter('source', value),
    options: PROSPECT_FUNNEL_SOURCES.map((source) => ({
      value: source,
      label: source === 'All' ? 'All sources' : source,
    })),
  }]), [filters.source, lockedSourceFilter, setFilter]);

  const handleFieldChange = useCallback((field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
      ...(field === 'region' ? { zone: value } : {}),
    }));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canWrite(editingId ? PERMISSIONS.KPI_UPDATE : PERMISSIONS.KPI_CREATE)) return;

    const payload = {
      ...form,
      ...buildHierarchyMetadata(form),
      zone: form.region,
      monthKey: form.date?.slice(0, 7),
      ...buildAuditMetadata({ user, existingRecord: editingRecord }),
    };

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
      setEditingRecord(null);
      await reload();
    } catch (error) {
      console.error(error);
      toast.error('Save failed');
    }
  };

  const handleEdit = useCallback((record) => {
    setEditingId(record.id);
    setEditingRecord(record);
    setForm(toProspectForm(record));
  }, []);

  const handleDelete = async (id) => {
    if (!canWrite(PERMISSIONS.KPI_DELETE)) return;
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

  const exportColumns = PROSPECT_FUNNEL_TABLE_COLUMNS.filter((column) => column.key !== 'actions');
  const exportToolbar = (
    <div className="flex items-center gap-2">
      <FilterBar filters={filterOptions} />
      <ActionButton variant="secondary" icon={Download} onClick={() => exportToExcel({ filename: 'prospect-funnel-filtered', columns: exportColumns, records: filteredRecords })}>Excel</ActionButton>
      <ActionButton variant="secondary" icon={FileText} onClick={() => exportToPdf({ title: 'Prospect Funnel Filtered Export', columns: exportColumns, records: filteredRecords })}>PDF</ActionButton>
    </div>
  );

  return (
    <KPIContainer
      title="KPI 1 · Interested Prospect Funnel"
      description="Track all prospects showing interest and funnel conversion from Interested → Converted with hierarchy, targets, health, exports, and audit metadata."
      toolbar={exportToolbar}
    >
      <InsightCards insights={insights} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <KPISummaryCards metrics={enrichedSummaryCards} />
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
          records={filteredRecords}
          readOnly={viewOnly}
          canEdit={can(PERMISSIONS.KPI_UPDATE)}
          canDelete={can(PERMISSIONS.KPI_DELETE)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </KPIContainer>
  );
};

export default KPIProspectFunnel;
