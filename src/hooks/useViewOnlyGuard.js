import { useCallback } from 'react';
import { PERMISSIONS } from '../config/rbac';
import { useAuth } from '../contexts/AuthContext';
import { guardWrite } from '../utils/readonlyGuard';
import { usePermissions } from './usePermissions';

export const useViewOnlyGuard = () => {
  const { viewOnly, profile } = useAuth();
  const { can } = usePermissions();
  const readOnly = viewOnly || !can(PERMISSIONS.KPI_UPDATE);
  const canWrite = useCallback((permission = PERMISSIONS.KPI_UPDATE) => guardWrite(readOnly || !can(permission), profile.roleLabel), [can, profile.roleLabel, readOnly]);

  return { viewOnly: readOnly, readOnly, canWrite };
};
