import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { guardWrite } from '../utils/readonlyGuard';

export const useViewOnlyGuard = () => {
  const { viewOnly } = useAuth();
  const canWrite = useCallback(() => guardWrite(viewOnly), [viewOnly]);

  return { viewOnly, canWrite };
};
