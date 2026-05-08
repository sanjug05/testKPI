import React from 'react';

const MetricCard = ({ label, value, valueClassName = 'text-white', detail, movement }) => (
  <div className="glass-effect group px-3 py-2 transition duration-200 hover:-translate-y-0.5 hover:border-teal/40 hover:bg-white/15">
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="text-[11px] uppercase tracking-wide text-white/60">{label}</p>
        <p className={`mt-1 text-lg font-semibold ${valueClassName}`}>{value}</p>
      </div>
      {movement && <span className="rounded-full bg-black/20 px-2 py-0.5 text-[10px] text-teal">{movement}</span>}
    </div>
    {detail && <p className="mt-1 text-[11px] text-white/55">{detail}</p>}
  </div>
);

export default MetricCard;
