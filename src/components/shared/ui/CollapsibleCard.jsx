import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SectionHeader from './SectionHeader';

const CollapsibleCard = ({ title, description, toolbar, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="glass-effect p-4">
      <div className="flex items-center justify-between cursor-pointer gap-4" onClick={() => setOpen((value) => !value)}>
        <SectionHeader title={title} description={description} />
        <div className="flex items-center gap-3">
          {toolbar}
          <button
            type="button"
            className="flex items-center gap-1 text-xs text-teal"
            onClick={(event) => {
              event.stopPropagation();
              setOpen((value) => !value);
            }}
          >
            <span>{open ? 'Collapse' : 'Expand'}</span>
            <ChevronDown size={14} className={`transition-transform ${open ? '' : '-rotate-90'}`} />
          </button>
        </div>
      </div>

      {open && <div className="mt-4 space-y-4">{children}</div>}
    </section>
  );
};

export default CollapsibleCard;
