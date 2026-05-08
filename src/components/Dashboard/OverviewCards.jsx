import React from 'react';
import { Activity, AlertTriangle, CheckCircle2, Flame } from 'lucide-react';

const OverviewCards = ({ summary }) => {
  const cards = [
    { id: 'total', label: 'Total KPIs', value: 16, icon: Activity, bg: 'bg-teal/15' },
    { id: 'onTrack', label: 'On Track', value: summary?.onTrack ?? 11, icon: CheckCircle2, bg: 'bg-emerald-500/15' },
    { id: 'attention', label: 'Needs Attention', value: summary?.attention ?? 3, icon: AlertTriangle, bg: 'bg-amber-500/15' },
    { id: 'critical', label: 'Critical', value: summary?.critical ?? 2, icon: Flame, bg: 'bg-rose-500/15' },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div key={card.id} className={`glass-effect px-4 py-3 flex items-center justify-between ${card.bg}`}>
            <div>
              <p className="text-[11px] text-white/60 uppercase tracking-wide">{card.label}</p>
              <p className="text-xl font-semibold text-white mt-1">{card.value}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-black/30 flex items-center justify-center">
              <Icon size={18} className="text-teal" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OverviewCards;
