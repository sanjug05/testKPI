import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../config/rbac';

export const usePermissions = () => {
  const { profile } = useAuth();

  const can = useCallback((permission) => hasPermission(profile.role, permission), [profile.role]);
  const canAny = useCallback((permissions = []) => permissions.some((permission) => hasPermission(profile.role, permission)), [profile.role]);

  return { can, canAny, role: profile.role, profile };
};
