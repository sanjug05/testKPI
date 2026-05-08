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

const readStoredFilters = () => {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

const persistFilters = (filters) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch {
    // Ignore storage failures; filters can still live in component state.
  }
};

export const useGlobalFilters = (profile) => {
  const [filters, setFilters] = useState(() => ({ ...DEFAULT_GLOBAL_FILTERS, ...readStoredFilters() }));

  useEffect(() => {
    persistFilters(filters);
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
