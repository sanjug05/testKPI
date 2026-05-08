import React from 'react';

const KPIFormSection = ({ title, readOnly, children }) => (
  <div className="xl:col-span-1 glass-effect p-3 space-y-3">
    <div className="flex items-center justify-between mb-1">
      <p className="text-xs text-white/70">{title}</p>
      {readOnly && <span className="text-[10px] text-amber-300">Read-only mode</span>}
    </div>
    {children}
  </div>
);

export default KPIFormSection;
