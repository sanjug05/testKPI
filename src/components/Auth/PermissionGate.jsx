import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';

const PermissionGate = ({ permission, permissions, fallback = null, children }) => {
  const { can, canAny } = usePermissions();
  const allowed = permission ? can(permission) : canAny(permissions || []);
  return allowed ? children : fallback;
};

export default PermissionGate;
