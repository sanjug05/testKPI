import { useEffect, useMemo, useState } from 'react';
import { buildRoleScopeFilters } from '../config/rbac';

const STORAGE_KEY = 'aisEnterpriseFilters';

export const DEFAULT_GLOBAL_FILTERS = {
  region: 'All',
  state: 'All',
  territory: 'All',
  rm: 'All',
  asm: 'All',
  salesperson: 'All',
  source: 'All',
  kpiStatus: 'All',
};

export const useGlobalFilters = (profile) => {
  const [filters, setFilters] = useState(() => {
    try {
      return { ...DEFAULT_GLOBAL_FILTERS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
    } catch {
      return DEFAULT_GLOBAL_FILTERS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const setFilter = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
      ...(key === 'region' ? { state: 'All', territory: 'All' } : {}),
      ...(key === 'state' ? { territory: 'All' } : {}),
    }));
  };

  const resetFilters = () => setFilters(DEFAULT_GLOBAL_FILTERS);

  const queryFilters = useMemo(() => ({
    ...filters,
    ...buildRoleScopeFilters(profile),
  }), [filters, profile]);

  return { filters, queryFilters, setFilter, setFilters, resetFilters };
};
