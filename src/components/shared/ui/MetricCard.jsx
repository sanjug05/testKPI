import React from 'react';

const MetricCard = ({ label, value, valueClassName = 'text-white' }) => (
  <div className="glass-effect px-3 py-2">
    <p className="text-white/60 text-[11px]">{label}</p>
    <p className={`text-lg font-semibold ${valueClassName}`}>{value}</p>
  </div>
);

export default MetricCard;
