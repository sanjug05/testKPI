import React from 'react';

const variants = {
  primary: 'bg-teal hover:bg-teal/90 text-navy font-semibold disabled:opacity-50',
  secondary: 'bg-white/10 hover:bg-white/15 text-teal border border-white/10 font-semibold disabled:opacity-50',
  link: 'text-teal hover:text-gold',
  danger: 'text-rose-300 hover:text-rose-400',
};

const ActionButton = ({ children, className = '', icon: Icon, variant = 'primary', ...props }) => (
  <button
    type="button"
    className={`${variants[variant] || variants.primary} flex items-center justify-center gap-1 rounded text-xs ${className}`}
    {...props}
  >
    {Icon && <Icon size={14} />}
    {children}
  </button>
);

export default ActionButton;
