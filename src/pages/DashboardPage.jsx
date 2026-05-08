import React, { Suspense, lazy, useState } from 'react';
import OverviewCards from '../components/Dashboard/OverviewCards';
import GlobalFilters from '../components/Enterprise/GlobalFilters';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import LoadingState from '../components/shared/ui/LoadingState';
import { useAuth } from '../contexts/AuthContext';
import { useDateRange } from '../hooks/useDateRange';
import { useGlobalFilters } from '../hooks/useGlobalFilters';

const KPIProspectFunnel = lazy(() => import('../features/kpis/prospectFunnel/KPIProspectFunnel'));

const DashboardPage = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const { dateRange, setDateRange } = useDateRange();
  const { profile } = useAuth();
  const { filters, queryFilters, setFilter, resetFilters } = useGlobalFilters(profile);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-navy via-black to-navy text-white">
      <Sidebar active={activeSection} onChange={setActiveSection} />

      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <Header dateRange={dateRange} setDateRange={setDateRange} />
        <main className="flex-1 overflow-y-auto pb-4">
          <OverviewCards />
          <GlobalFilters filters={filters} onChange={setFilter} onReset={resetFilters} />

          <div className="space-y-4">
            {(activeSection === 'overview' || activeSection === 'prospects') && (
              <Suspense fallback={<section className="glass-effect p-4"><LoadingState message="Loading KPI module…" /></section>}>
                <KPIProspectFunnel dateRange={dateRange} globalFilters={queryFilters} />
              </Suspense>
            )}

            {activeSection !== 'overview' && activeSection !== 'prospects' && (
              <section className="glass-effect p-4">
                <h3 className="text-sm font-semibold text-teal mb-2">KPI module stabilization pending</h3>
                <p className="text-xs text-white/60">
                  TODO: Mount this KPI with KPIContainer, KPISummaryCards, KPIChartSection, KPIFormSection, KPITableSection, RBAC guards, target hooks, and hierarchy-aware query filters after its collection contract is verified.
                </p>
              </section>
            )}

            <section className="glass-effect p-4 border border-dashed border-teal/30">
              <h3 className="text-sm font-semibold text-teal mb-2">Enterprise scalability backlog</h3>
              <p className="text-xs text-white/60">
                TODO: Extend this Phase 3 foundation into notifications, approval workflows, incentive calculations, dealer lifecycle tracking, AI insights, mobile-first review screens, and advanced analytics workspaces.
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
