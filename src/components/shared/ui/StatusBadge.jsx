import React from 'react';

const toneClasses = {
  success: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/30',
  warning: 'bg-amber-500/15 text-amber-200 border-amber-400/30',
  danger: 'bg-rose-500/15 text-rose-200 border-rose-400/30',
  info: 'bg-teal/15 text-teal border-teal/30',
  neutral: 'bg-white/10 text-white/70 border-white/15',
};

const StatusBadge = ({ children, tone = 'neutral', className = '' }) => (
  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${toneClasses[tone] || toneClasses.neutral} ${className}`}>
    {children}
  </span>
);

export default StatusBadge;
