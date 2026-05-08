import React from 'react';
import { Filter } from 'lucide-react';

const FilterBar = ({ filters }) => (
  <div className="flex items-center gap-2 text-xs text-white/60">
    <Filter size={14} className="text-teal" />
    {filters.map((filter) => (
      <select
        key={filter.id}
        value={filter.value}
        onChange={(event) => filter.onChange(event.target.value)}
        className="glass-input px-2 py-1 rounded text-xs focus:outline-none"
        onClick={(event) => event.stopPropagation()}
      >
        {filter.options.map((option) => (
          <option key={option.value ?? option} value={option.value ?? option}>
            {option.label ?? option}
          </option>
        ))}
      </select>
    ))}
  </div>
);

export default FilterBar;
