import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { enterpriseEnvironment } from '../platform/config/environment';
import { createEnterpriseRepository } from '../platform/data/enterpriseDataArchitecture';
import { platformLogger } from '../platform/monitoring/observability';
import { shouldUseRealtime, REALTIME_CHANNELS } from '../platform/realtime/operationalRealtime';
import { buildSecurityPrincipal, protectQueryWithRoleScope } from '../platform/security/securityGuards';

export const useKPIData = ({ collectionKey, filters, errorMessage, realtime = false, pageSize = 250 }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const auth = useAuth();
  const principal = useMemo(() => buildSecurityPrincipal(auth), [auth]);
  const repository = useMemo(() => createEnterpriseRepository(collectionKey, { pageSize }), [collectionKey, pageSize]);
  const protectedFilters = useMemo(() => protectQueryWithRoleScope({ ...filters, limit: filters?.limit || pageSize }, principal), [filters, pageSize, principal]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await repository.listPage(protectedFilters);
      setRecords(data);
      return data;
    } catch (caughtError) {
      platformLogger.error('KPI data load failed', { collectionKey, caughtError });
      setError(caughtError);
      toast.error(errorMessage || 'Failed to load KPI data');
      return [];
    } finally {
      setLoading(false);
    }
  }, [collectionKey, errorMessage, protectedFilters, repository]);

  useEffect(() => {
    if (realtime && enterpriseEnvironment.featureFlags.realTimeKpiRefresh && shouldUseRealtime(REALTIME_CHANNELS.KPI_REFRESH)) {
      setLoading(true);
      const unsubscribe = repository.listen(protectedFilters, (data) => {
        setRecords(data);
        setLoading(false);
        setError(null);
      }, (caughtError) => {
        platformLogger.error('Realtime KPI subscription failed', { collectionKey, caughtError });
        setError(caughtError);
        setLoading(false);
        toast.error(errorMessage || 'Failed to subscribe to KPI updates');
      });

      return unsubscribe;
    }

    loadData();
    return undefined;
  }, [collectionKey, errorMessage, loadData, protectedFilters, realtime, repository]);

  return { loading, error, records, setRecords, reload: loadData, repository, protectedFilters };
};
