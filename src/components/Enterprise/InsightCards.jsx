import React from 'react';
import { Sparkles } from 'lucide-react';

const InsightCards = ({ insights = [] }) => (
  <section className="glass-effect p-4 mb-4">
    <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-teal uppercase tracking-wide">
      <Sparkles size={15} /> Executive Insights
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3">
      {insights.map((insight) => (
        <div key={insight.id} className="rounded-lg bg-white/5 border border-white/10 p-3">
          <p className="text-[10px] uppercase tracking-wide text-white/50">{insight.label}</p>
          <p className={`mt-1 text-sm font-semibold ${insight.tone || 'text-white'}`}>{insight.value}</p>
          <p className="text-[11px] text-white/50 mt-1">{insight.detail}</p>
        </div>
      ))}
    </div>
  </section>
);

export default InsightCards;
