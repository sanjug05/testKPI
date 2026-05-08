import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { createCrudRepository } from '../services/firestore/crud';

export const useKPIData = ({ collectionKey, filters, errorMessage }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const repository = useMemo(() => createCrudRepository(collectionKey), [collectionKey]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await repository.list(filters);
      setRecords(data);
      return data;
    } catch (caughtError) {
      console.error(caughtError);
      setError(caughtError);
      toast.error(errorMessage || 'Failed to load KPI data');
      return [];
    } finally {
      setLoading(false);
    }
  }, [errorMessage, filters, repository]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { loading, error, records, setRecords, reload: loadData, repository };
};
