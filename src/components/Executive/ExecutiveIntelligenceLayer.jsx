import React, { useMemo } from 'react';
import { AlertTriangle, BrainCircuit, Gauge, LineChart as LineChartIcon, ShieldCheck, TrendingUp } from 'lucide-react';
import MetricCard from '../shared/ui/MetricCard';
import { generateSmartInsights } from '../../services/analytics/insightsEngine';
import { buildPartnerIntelligence } from '../../services/analytics/partnerIntelligence';

const toneClass = {
  success: 'text-emerald-300',
  warning: 'text-amber-300',
  danger: 'text-rose-300',
  info: 'text-teal',
};

const ExecutiveIntelligenceLayer = ({ records = [] }) => {
  const intelligence = useMemo(() => generateSmartInsights(records), [records]);
  const partnerSignals = useMemo(() => buildPartnerIntelligence(records).slice(0, 3), [records]);
  const { nationalHealth, history, risks, highlights } = intelligence;

  const cards = [
    { id: 'national-health', label: 'National Business Health Index', value: nationalHealth.score, detail: nationalHealth.status, tone: nationalHealth.score >= 65 ? 'success' : 'danger', movement: `${nationalHealth.inputs.coverage}% coverage` },
    { id: 'strategic-risk', label: 'Operational Risk Indicators', value: risks.length || 'Clear', detail: risks.length ? 'active executive watchpoints' : 'No critical risk triggers', tone: risks.length ? 'warning' : 'success', movement: risks.length ? 'Escalate' : 'Monitor' },
    { id: 'momentum', label: 'Performance Momentum', value: `${history.growthVelocity}%`, detail: `${history.direction} monthly activity`, tone: history.growthVelocity >= 0 ? 'info' : 'warning', movement: `Next: ${history.projection}` },
    { id: 'confidence', label: 'KPI Confidence', value: `${nationalHealth.inputs.dataConfidence}%`, detail: 'metadata completeness', tone: nationalHealth.inputs.dataConfidence >= 65 ? 'success' : 'danger', movement: 'AI-ready' },
  ];

  return (
    <section className="glass-effect p-4" id="executive-intelligence">
      <div className="mb-4 flex flex-col gap-2 border-b border-white/10 pb-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-teal/80"><BrainCircuit size={15} /> Phase 5 intelligence layer</div>
          <h2 className="mt-1 text-lg font-semibold text-white">Operational Decision Intelligence</h2>
          <p className="text-xs text-white/55">Strategic scoring, predictive placeholders, confidence signals, and risk indicators built from the centralized insights engine.</p>
        </div>
        <div className="rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-[11px] text-teal">AI-ready analytics context</div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => <MetricCard key={card.id} label={card.label} value={card.value} detail={card.detail} valueClassName={toneClass[card.tone]} movement={card.movement} />)}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 xl:col-span-2">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-teal"><TrendingUp size={14} /> Smart executive observations</div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {highlights.map((item) => (
              <div key={item.id} className="rounded-lg border border-white/10 bg-black/10 p-3">
                <p className="text-[10px] uppercase tracking-wide text-white/45">{item.label}</p>
                <p className={`mt-1 text-sm font-semibold ${item.tone}`}>{item.value}</p>
                <p className="text-[11px] text-white/55">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-teal"><AlertTriangle size={14} /> Risk & partner watchlist</div>
          <div className="space-y-2">
            {risks.length === 0 && <p className="rounded-lg border border-emerald-400/20 bg-emerald-500/10 p-2 text-xs text-emerald-200">No high-risk KPI warnings triggered in current filters.</p>}
            {risks.map((risk) => <p key={risk.id} className="rounded-lg border border-amber-400/20 bg-amber-500/10 p-2 text-xs text-white/75">{risk.title}: {risk.detail}</p>)}
            {partnerSignals.map((partner) => (
              <div key={partner.partner} className="rounded-lg border border-white/10 bg-black/10 p-2 text-xs">
                <div className="flex items-center justify-between"><span className="text-white">{partner.partner}</span><span className={partner.healthScore >= 60 ? 'text-emerald-300' : 'text-amber-300'}>{partner.healthScore}</span></div>
                <p className="mt-1 text-[11px] text-white/50">{partner.lifecycleStage} · {partner.inactive ? 'inactive partner indicator' : 'engaged'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 text-xs md:grid-cols-3">
        <div className="rounded-lg border border-teal/20 bg-teal/10 p-3"><Gauge size={15} className="mb-1 text-teal" /> Strategic health scoring is centralized for national expansion reviews.</div>
        <div className="rounded-lg border border-gold/20 bg-gold/10 p-3"><LineChartIcon size={15} className="mb-1 text-gold" /> Predictive trend placeholders expose rolling averages, velocity, and projections.</div>
        <div className="rounded-lg border border-emerald-400/20 bg-emerald-500/10 p-3"><ShieldCheck size={15} className="mb-1 text-emerald-300" /> KPI confidence indicators prepare clean data for future AI summaries.</div>
      </div>
    </section>
  );
};

export default ExecutiveIntelligenceLayer;
