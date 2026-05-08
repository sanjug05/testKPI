import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import StrategicAnalyticsDashboard from '../components/Analytics/StrategicAnalyticsDashboard';
import ExecutiveOverview from '../components/Executive/ExecutiveOverview';
import ExecutiveIntelligenceLayer from '../components/Executive/ExecutiveIntelligenceLayer';
import GlobalFilters from '../components/Enterprise/GlobalFilters';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import ActivityTimeline from '../components/Operations/ActivityTimeline';
import ErrorBoundary from '../components/shared/error/ErrorBoundary';
import LoadingState from '../components/shared/ui/LoadingState';
import { buildHierarchyMetadata } from '../config/hierarchy';
import { useAuth } from '../contexts/AuthContext';
import { calculateProspectFunnelMetrics } from '../features/kpis/prospectFunnel/prospectFunnelMetrics';
import { useDateRange } from '../hooks/useDateRange';
import { useGlobalFilters } from '../hooks/useGlobalFilters';
import { useKPIData } from '../hooks/useKPIData';
import { useEnterpriseNotifications } from '../hooks/notifications/useEnterpriseNotifications';
import { useTargets } from '../hooks/useTargets';
import { generateSmartInsights } from '../services/analytics/insightsEngine';
import { channelManagementModule } from '../modules/channelManagement/moduleDefinition';
import { enterpriseEnvironment } from '../platform/config/environment';
import { firestoreSchemaStrategy } from '../platform/data/enterpriseDataArchitecture';
import { buildInsightMetadata } from '../platform/intelligence/aiReadiness';
import { getRegisteredModules } from '../platform/modules/moduleRegistry';
import { reportTemplates } from '../platform/reporting/reportEngine';
import { enterpriseWorkflowDefinitions } from '../platform/workflow/workflowEngine';

const KPIProspectFunnel = lazy(() => import('../features/kpis/prospectFunnel/KPIProspectFunnel'));

const ROUTE_SECTION_IDS = new Set(['overview', 'analytics', 'prospects', 'partners', 'financials', 'quality', 'settings']);

const getSectionFromPath = (pathname) => {
  const section = pathname.split('/').filter(Boolean)[1];
  return ROUTE_SECTION_IDS.has(section) ? section : 'overview';
};

const normalizeRecordForEnterprise = (record) => ({
  ...record,
  ...buildHierarchyMetadata(record),
  zone: record.region || record.zone,
  monthKey: record.date?.slice(0, 7),
});

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(() => getSectionFromPath(location.pathname));
  const { dateRange, setDateRange } = useDateRange();
  const { profile } = useAuth();
  const { filters, queryFilters, setFilter, resetFilters } = useGlobalFilters(profile);

  useEffect(() => {
    setActiveSection(getSectionFromPath(location.pathname));
  }, [location.pathname]);

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    navigate(sectionId === 'overview' ? '/dashboard' : `/dashboard/${sectionId}`);
  };

  const executiveFilters = useMemo(() => ({
    from: dateRange.from,
    to: dateRange.to,
    region: queryFilters.region,
    state: queryFilters.state,
    territory: queryFilters.territory,
    rm: queryFilters.rm,
    asm: queryFilters.asm,
    salesperson: queryFilters.salesperson,
    source: queryFilters.source,
  }), [dateRange.from, dateRange.to, queryFilters]);

  const { loading: executiveLoading, records: executiveRawRecords } = useKPIData({
    collectionKey: 'prospectFunnel',
    filters: executiveFilters,
    errorMessage: 'Failed to load executive overview data',
  });

  const executiveRecords = useMemo(() => executiveRawRecords.map(normalizeRecordForEnterprise), [executiveRawRecords]);
  const { funnel } = useMemo(() => calculateProspectFunnelMetrics(executiveRecords), [executiveRecords]);
  const periodKey = dateRange.from?.slice(0, 7);
  const { health } = useTargets({
    kpiKey: 'prospectFunnel',
    periodType: 'monthly',
    periodKey,
    territory: queryFilters.territory,
    role: profile.role,
    achievement: funnel.converted,
  });
  const insights = useMemo(() => generateSmartInsights(executiveRecords).highlights, [executiveRecords]);
  const alerts = useEnterpriseNotifications({ records: executiveRecords, health, insights });
  const platformReadiness = useMemo(() => ({
    modules: getRegisteredModules().length,
    activeKpiPlugins: channelManagementModule.kpiPlugins.length,
    workflows: Object.keys(enterpriseWorkflowDefinitions).length,
    reportTemplates: Object.keys(reportTemplates).length,
    schemaVersion: firestoreSchemaStrategy.version,
    aiMetadata: buildInsightMetadata({
      moduleId: 'channelManagement',
      kpiKey: 'prospectFunnel',
      filters: executiveFilters,
      dimensions: ['region', 'territory', 'source', 'status'],
      recordCount: executiveRecords.length,
    }),
  }), [executiveFilters, executiveRecords.length]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-navy via-black to-navy text-white md:flex">
        <Sidebar active={activeSection} onChange={handleSectionChange} />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden px-3 pb-4 pt-20 md:p-4">
          <Header activeSection={activeSection} dateRange={dateRange} setDateRange={setDateRange} onJump={handleSectionChange} />
          <main className="flex-1 overflow-y-auto scroll-smooth pb-4">
            <ExecutiveOverview records={executiveRecords} health={health} alerts={alerts} />
            <ExecutiveIntelligenceLayer records={executiveRecords} />
            {executiveLoading && <section className="glass-effect mb-4 p-4"><LoadingState message="Refreshing executive snapshot…" /></section>}

            <div className="sticky top-[150px] z-10 md:top-[112px]">
              <GlobalFilters filters={filters} onChange={setFilter} onReset={resetFilters} />
            </div>

            <div className="space-y-4">
              {activeSection === 'analytics' && <StrategicAnalyticsDashboard records={executiveRecords} />}

              {(activeSection === 'overview' || activeSection === 'prospects') && (
                <Suspense fallback={<section className="glass-effect p-4"><LoadingState message="Loading KPI module…" /></section>}>
                  <KPIProspectFunnel dateRange={dateRange} globalFilters={queryFilters} />
                </Suspense>
              )}

              {activeSection !== 'overview' && activeSection !== 'prospects' && activeSection !== 'analytics' && (
                <section className="glass-effect p-4">
                  <h3 className="text-sm font-semibold text-teal mb-2">Operational workflow readiness pending</h3>
                  <p className="text-xs text-white/60">
                    TODO: Mount this KPI with the standardized enterprise module contract: KPI header, summary cards, charts, filters, forms, tables, export actions, health status, insights, loading, empty, error, and retry states.
                  </p>
                </section>
              )}

              <ActivityTimeline records={executiveRecords} />

              <section className="glass-effect border border-teal/20 p-4">
                <div className="mb-3 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-teal">Enterprise platform ecosystem readiness</h3>
                    <p className="text-xs text-white/60">{enterpriseEnvironment.appName} core services are registered without changing KPI business logic.</p>
                  </div>
                  <span className="text-[11px] text-white/45">{platformReadiness.schemaVersion}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    ['Registered modules', platformReadiness.modules],
                    ['Active KPI plugins', platformReadiness.activeKpiPlugins],
                    ['Workflow definitions', platformReadiness.workflows],
                    ['Report templates', platformReadiness.reportTemplates],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[11px] uppercase tracking-wide text-white/40">{label}</p>
                      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[11px] text-white/45">AI metadata contract: {platformReadiness.aiMetadata.schemaVersion} · redaction-ready aggregate context.</p>
              </section>

              <section className="glass-effect border border-dashed border-teal/30 p-4">
                <h3 className="text-sm font-semibold text-teal mb-2">Future enterprise readiness backlog</h3>
                <p className="text-xs text-white/60">
                  TODO: Connect approval workflows, scheduled executive reports, AI-generated recommendations, predictive operations models, partner master data, workflow automation, task routing, and multi-business expansion support on top of this Phase 5 intelligence foundation.
                </p>
              </section>
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardPage;
