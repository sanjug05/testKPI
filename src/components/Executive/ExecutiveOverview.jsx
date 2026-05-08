import React, { useMemo } from 'react';
import { ArrowDownRight, ArrowUpRight, Map, Rocket, ShieldAlert, Trophy } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import MetricCard from '../shared/ui/MetricCard';
import StatusBadge from '../shared/ui/StatusBadge';
import NotificationPanel from '../Notifications/NotificationPanel';
import { buildExecutiveSnapshot } from './executiveMetrics';

const toneToClass = {
  success: 'text-emerald-300',
  warning: 'text-amber-300',
  danger: 'text-rose-300',
  info: 'text-teal',
};

const ExecutiveOverview = ({ records = [], health, alerts = [] }) => {
  const snapshot = useMemo(() => buildExecutiveSnapshot(records), [records]);
  const criticalCards = useMemo(() => [...snapshot.cards].sort((a, b) => (a.tone === 'danger' ? -1 : 0) - (b.tone === 'danger' ? -1 : 0)), [snapshot.cards]);

  return (
    <section className="mb-4 space-y-4" id="executive-overview">
      <div className="glass-effect overflow-hidden p-4">
        <div className="flex flex-col gap-3 border-b border-white/10 pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-teal/80">
              <ShieldAlert size={15} /> Executive command center
            </div>
            <h1 className="mt-1 text-2xl font-semibold text-white">National Business Health Overview</h1>
            <p className="mt-1 text-xs text-white/60">Critical KPIs are prioritized first so leadership can assess channel health in under 30 seconds.</p>
          </div>
          <StatusBadge tone={health?.atRisk ? 'danger' : 'success'}>{health?.status || 'Monitoring'}</StatusBadge>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {criticalCards.map((card) => (
            <MetricCard key={card.id} label={card.label} value={card.value} valueClassName={toneToClass[card.tone]} detail={card.detail} movement={card.movement} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="glass-effect p-4 xl:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white"><Map size={16} className="text-teal" /> National performance snapshot</h3>
            <span className="text-[11px] text-white/50">Movement indicators compare visible monthly samples</span>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3">
              <Trophy size={18} className="mb-2 text-emerald-300" />
              <p className="text-[11px] uppercase text-white/50">Top-performing region</p>
              <p className="text-lg font-semibold text-white">{snapshot.topRegion.name}</p>
              <p className="text-xs text-emerald-200">{snapshot.topRegion.value} conversions</p>
            </div>
            <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 p-3">
              <ArrowDownRight size={18} className="mb-2 text-amber-300" />
              <p className="text-[11px] uppercase text-white/50">Underperforming territories</p>
              <div className="mt-1 space-y-1">
                {snapshot.weakTerritories.map((territory) => <p key={territory.name} className="text-xs text-white/80">{territory.name} · {territory.value}</p>)}
              </div>
            </div>
            <div className="rounded-xl border border-teal/20 bg-teal/10 p-3">
              <Rocket size={18} className="mb-2 text-teal" />
              <p className="text-[11px] uppercase text-white/50">Onboarding velocity</p>
              <p className="text-lg font-semibold text-white">{snapshot.onboardingVelocity}%</p>
              <p className="text-xs text-white/60">Best source: {snapshot.bestSource.name}</p>
            </div>
          </div>

          <div className="mt-4 h-52 rounded-xl border border-white/10 bg-black/10 p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-teal"><ArrowUpRight size={14} /> Monthly growth trend</div>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={snapshot.trends}>
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" fontSize={10} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={10} allowDecimals={false} />
                <Tooltip contentStyle={{ background: '#0A1628', border: '1px solid rgba(0,180,216,.35)', borderRadius: 12 }} />
                <Line type="monotone" dataKey="value" stroke="#00B4D8" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <NotificationPanel alerts={alerts} />
      </div>
    </section>
  );
};

export default ExecutiveOverview;
