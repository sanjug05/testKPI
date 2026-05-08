import React from 'react';

const toneClasses = {
  info: 'border-teal/30 bg-teal/10 text-teal',
  warning: 'border-amber-400/30 bg-amber-500/10 text-amber-100',
  danger: 'border-rose-400/30 bg-rose-500/10 text-rose-100',
};

const AlertBanner = ({ tone = 'info', children }) => (
  <div className={`rounded-xl border px-3 py-2 text-xs ${toneClasses[tone] || toneClasses.info}`}>{children}</div>
);

export default AlertBanner;
