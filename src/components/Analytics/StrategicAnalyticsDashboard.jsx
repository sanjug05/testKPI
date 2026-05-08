import React, { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart3, CircleGauge, MapPinned, UsersRound } from 'lucide-react';
import { selectStrategicAnalytics } from '../../stores/enterpriseSelectors';

const AnalyticsPanel = ({ title, icon: Icon, items = [], metricKey = 'converted', suffix = '', description }) => (
  <div className="glass-effect p-4">
    <div className="mb-3 flex items-start justify-between gap-3">
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-white"><Icon size={16} className="text-teal" /> {title}</h3>
        <p className="mt-1 text-[11px] text-white/50">{description}</p>
      </div>
      <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-white/45">{items.length} segments</span>
    </div>
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={items.slice(0, 8)}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.08)" />
          <XAxis dataKey="name" stroke="rgba(255,255,255,.5)" fontSize={10} />
          <YAxis stroke="rgba(255,255,255,.5)" fontSize={10} allowDecimals={false} />
          <Tooltip contentStyle={{ background: '#0A1628', border: '1px solid rgba(0,180,216,.35)', borderRadius: 12 }} formatter={(value) => [`${value}${suffix}`, title]} />
          <Bar dataKey={metricKey} fill="#00B4D8" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const StrategicAnalyticsDashboard = ({ records = [] }) => {
  const analytics = useMemo(() => selectStrategicAnalytics(records), [records]);

  return (
    <section className="space-y-4" id="strategic-analytics">
      <div className="glass-effect p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-teal/80"><BarChart3 size={15} /> Strategic analytics command view</div>
            <h2 className="mt-1 text-lg font-semibold text-white">Leadership Business Analysis</h2>
            <p className="text-xs text-white/55">Regional, conversion, onboarding, source, sales efficiency, and territory comparison views reuse the centralized analytics layer.</p>
          </div>
          <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] text-gold">Presentation-ready snapshot foundation</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <AnalyticsPanel title="Regional analytics view" icon={MapPinned} items={analytics.regional} metricKey="converted" description="Compares converted prospects and regional contribution." />
        <AnalyticsPanel title="Conversion analytics view" icon={CircleGauge} items={analytics.conversion} metricKey="conversionRate" suffix="%" description="Highlights territory conversion efficiency and underperformance." />
        <AnalyticsPanel title="Onboarding analytics view" icon={UsersRound} items={analytics.onboarding} metricKey="onboardingVelocity" suffix="%" description="Tracks RM-led movement from interested to shortlist, CFT, and conversion." />
        <AnalyticsPanel title="Source performance analytics" icon={BarChart3} items={analytics.source} metricKey="records" description="Identifies highest-volume lead sources and future conversion analysis inputs." />
        <AnalyticsPanel title="Sales efficiency analytics" icon={CircleGauge} items={analytics.salesEfficiency} metricKey="conversionRate" suffix="%" description="Prepares salesperson efficiency and coaching review architecture." />
        <AnalyticsPanel title="Territory comparison dashboard" icon={MapPinned} items={analytics.territory} metricKey="records" description="Compares territory activity levels for expansion monitoring." />
      </div>
    </section>
  );
};

export default StrategicAnalyticsDashboard;
