import React, { Suspense, lazy, useState } from 'react';
import OverviewCards from '../components/Dashboard/OverviewCards';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import LoadingState from '../components/shared/ui/LoadingState';
import { useDateRange } from '../hooks/useDateRange';

const KPIProspectFunnel = lazy(() => import('../features/kpis/prospectFunnel/KPIProspectFunnel'));

const DashboardPage = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const { dateRange, setDateRange } = useDateRange();

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-navy via-black to-navy text-white">
      <Sidebar active={activeSection} onChange={setActiveSection} />

      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <Header dateRange={dateRange} setDateRange={setDateRange} />
        <main className="flex-1 overflow-y-auto pb-4">
          <OverviewCards />

          <div className="space-y-4">
            {(activeSection === 'overview' || activeSection === 'prospects') && (
              <Suspense fallback={<section className="glass-effect p-4"><LoadingState message="Loading KPI module…" /></section>}>
                <KPIProspectFunnel dateRange={dateRange} />
              </Suspense>
            )}

            {activeSection !== 'overview' && activeSection !== 'prospects' && (
              <section className="glass-effect p-4">
                <h3 className="text-sm font-semibold text-teal mb-2">KPI module stabilization pending</h3>
                <p className="text-xs text-white/60">
                  TODO: Mount this KPI with KPIContainer, KPISummaryCards, KPIChartSection, KPIFormSection, and KPITableSection after its collection contract is verified.
                </p>
              </section>
            )}

            <section className="glass-effect p-4 border border-dashed border-teal/30">
              <h3 className="text-sm font-semibold text-teal mb-2">KPI 2–16 stabilization backlog</h3>
              <p className="text-xs text-white/60">
                TODO: Preserve and remount remaining KPI business logic incrementally through the shared enterprise KPI architecture, centralized Firestore layer, and reusable hooks.
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
