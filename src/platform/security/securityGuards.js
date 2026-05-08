import { buildRoleScopeFilters, DEFAULT_ROLE, hasPermission, PERMISSIONS, ROLES } from '../../config/rbac';

export const AUTH_CONTEXTS = {
  ROUTE: 'route',
  QUERY: 'query',
  ACTION: 'action',
  REPORT: 'report',
};

export const buildSecurityPrincipal = ({ user, profile = {}, viewOnly = false } = {}) => ({
  uid: user?.uid || profile.uid || (viewOnly ? 'view-only' : null),
  authenticated: Boolean(user?.uid || profile.uid),
  role: profile.role || DEFAULT_ROLE,
  claims: profile.claims || {},
  viewOnly,
  scope: buildRoleScopeFilters(profile),
  region: profile.region,
  territory: profile.territory,
});

export const canAccessPermission = (principal, permission = PERMISSIONS.DASHBOARD_READ) => (
  Boolean(principal?.viewOnly || principal?.authenticated) && hasPermission(principal.role, permission)
);

export const enforceRouteAccess = (principal, permission) => ({
  allowed: canAccessPermission(principal, permission),
  redirectTo: '/',
  reason: canAccessPermission(principal, permission) ? 'allowed' : 'missing-permission',
});

export const protectQueryWithRoleScope = (filters = {}, principal = {}) => ({
  ...filters,
  ...principal.scope,
  roleScope: principal.scope
    ? Object.entries(principal.scope).map(([field, value]) => ({ field, value }))[0]
    : filters.roleScope,
});

export const validateSensitiveAction = ({ principal, permission, action, payload = {} }) => {
  const allowed = canAccessPermission(principal, permission);
  const writeBlockedForViewer = principal.role === ROLES.VIEWER && [PERMISSIONS.KPI_CREATE, PERMISSIONS.KPI_UPDATE, PERMISSIONS.KPI_DELETE].includes(permission);

  return {
    allowed: allowed && !writeBlockedForViewer,
    action,
    payloadId: payload.id,
    reason: !allowed ? 'missing-permission' : writeBlockedForViewer ? 'viewer-write-blocked' : 'validated',
    auditMetadata: {
      actorId: principal.uid,
      actorRole: principal.role,
      action,
      validatedAt: new Date().toISOString(),
      context: AUTH_CONTEXTS.ACTION,
    },
  };
};

export const firestoreRulePreparation = {
  customClaims: ['role', 'region', 'territory', 'permissions'],
  collectionPatterns: ['enterpriseModules/{moduleId}', 'kpis/{kpiKey}/records/{recordId}', 'reports/{reportId}', 'workflows/{workflowId}'],
  strategy: 'Mirror client route/query/action guards with Firebase rules using custom claims and role scope fields.',
};
