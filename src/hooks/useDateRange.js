import { useState } from 'react';

export const DEFAULT_DASHBOARD_DATE_RANGE = { from: '2025-10-01', to: '2025-12-31' };

export const useDateRange = (initialRange = DEFAULT_DASHBOARD_DATE_RANGE) => {
  const [dateRange, setDateRange] = useState(initialRange);

  return { dateRange, setDateRange };
};
