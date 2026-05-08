export const designTokens = {
  color: {
    navy: '#0A1628',
    teal: '#00B4D8',
    gold: '#FFD700',
    glass: 'rgba(255, 255, 255, 0.12)',
    glassBorder: 'rgba(255, 255, 255, 0.18)',
    success: '#2DD4BF',
    warning: '#F4C430',
    danger: '#FB7185',
  },
  typography: {
    family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    scale: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem' },
    weight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  },
  spacing: { 1: '0.25rem', 2: '0.5rem', 3: '0.75rem', 4: '1rem', 6: '1.5rem', 8: '2rem' },
  radius: { card: '16px', control: '0.75rem', pill: '999px' },
  shadow: { glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)' },
  interaction: {
    focusRing: 'focus:outline-none focus:ring-2 focus:ring-teal',
    transition: 'transition duration-200 ease-out',
  },
};

export const componentStandards = {
  card: 'glass-effect p-4',
  sectionTitle: 'text-sm font-semibold text-teal',
  mutedText: 'text-xs text-white/60',
  control: 'glass-input rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal',
};
