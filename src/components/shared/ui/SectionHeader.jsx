import React from 'react';

const SectionHeader = ({ title, description, actions }) => (
  <div>
    <h3 className="text-sm font-semibold text-teal">{title}</h3>
    {description && <p className="text-[11px] text-white/60">{description}</p>}
    {actions}
  </div>
);

export default SectionHeader;
