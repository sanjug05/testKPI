import React from 'react';
import { Navigate } from 'react-router-dom';
import { PERMISSIONS } from '../../config/rbac';
import { useAuth } from '../../contexts/AuthContext';
import { buildSecurityPrincipal, enforceRouteAccess } from '../security/securityGuards';

const EnterpriseRouteGuard = ({ children, permission = PERMISSIONS.DASHBOARD_READ }) => {
  const auth = useAuth();
  const principal = buildSecurityPrincipal(auth);

  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <div className="glass-effect px-6 py-4">
          <div className="animate-spin h-6 w-6 border-2 border-teal border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-teal text-sm text-center">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const access = enforceRouteAccess(principal, permission);
  return access.allowed ? children : <Navigate to={access.redirectTo} replace />;
};

export default EnterpriseRouteGuard;
