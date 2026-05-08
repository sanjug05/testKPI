import React from 'react';

export const Field = ({ label, type = 'text', value, disabled, onChange }) => (
  <div>
    <label className="block text-teal/70 mb-1">{label}</label>
    <input
      type={type}
      className="w-full glass-input px-2 py-1 rounded focus:outline-none"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
    />
  </div>
);

export const SelectField = ({ label, value, disabled, options, onChange, getLabel = (option) => option }) => (
  <div>
    <label className="block text-teal/70 mb-1">{label}</label>
    <select
      className="w-full glass-input px-2 py-1 rounded focus:outline-none"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
    >
      {options.map((option) => (
        <option key={option} value={option}>{getLabel(option)}</option>
      ))}
    </select>
  </div>
);
