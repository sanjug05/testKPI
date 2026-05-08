export const ROLES = {
  SUPER_ADMIN: 'superAdmin',
  NATIONAL_HEAD: 'nationalHead',
  REGIONAL_MANAGER: 'regionalManager',
  AREA_SALES_MANAGER: 'areaSalesManager',
  VIEWER: 'viewer',
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.NATIONAL_HEAD]: 'National Head',
  [ROLES.REGIONAL_MANAGER]: 'Regional Manager',
  [ROLES.AREA_SALES_MANAGER]: 'ASM',
  [ROLES.VIEWER]: 'Viewer',
};

export const PERMISSIONS = {
  DASHBOARD_READ: 'dashboard:read',
  KPI_READ: 'kpi:read',
  KPI_CREATE: 'kpi:create',
  KPI_UPDATE: 'kpi:update',
  KPI_DELETE: 'kpi:delete',
  TARGET_READ: 'target:read',
  TARGET_MANAGE: 'target:manage',
  EXPORT: 'export:run',
  AUDIT_READ: 'audit:read',
  GOVERNANCE_READ: 'governance:read',
  GOVERNANCE_MANAGE: 'governance:manage',
  WORKFLOW_READ: 'workflow:read',
  WORKFLOW_MANAGE: 'workflow:manage',
};

export const ROLE_CONFIG = {
  [ROLES.SUPER_ADMIN]: {
    label: ROLE_LABELS[ROLES.SUPER_ADMIN],
    hierarchyLevel: 'country',
    scope: 'all',
    permissions: Object.values(PERMISSIONS),
  },
  [ROLES.NATIONAL_HEAD]: {
    label: ROLE_LABELS[ROLES.NATIONAL_HEAD],
    hierarchyLevel: 'country',
    scope: 'country',
    permissions: [PERMISSIONS.DASHBOARD_READ, PERMISSIONS.KPI_READ, PERMISSIONS.TARGET_READ, PERMISSIONS.EXPORT, PERMISSIONS.AUDIT_READ, PERMISSIONS.GOVERNANCE_READ, PERMISSIONS.WORKFLOW_READ],
  },
  [ROLES.REGIONAL_MANAGER]: {
    label: ROLE_LABELS[ROLES.REGIONAL_MANAGER],
    hierarchyLevel: 'region',
    scope: 'region',
    permissions: [PERMISSIONS.DASHBOARD_READ, PERMISSIONS.KPI_READ, PERMISSIONS.KPI_CREATE, PERMISSIONS.KPI_UPDATE, PERMISSIONS.TARGET_READ, PERMISSIONS.EXPORT, PERMISSIONS.WORKFLOW_READ],
  },
  [ROLES.AREA_SALES_MANAGER]: {
    label: ROLE_LABELS[ROLES.AREA_SALES_MANAGER],
    hierarchyLevel: 'territory',
    scope: 'territory',
    permissions: [PERMISSIONS.DASHBOARD_READ, PERMISSIONS.KPI_READ, PERMISSIONS.KPI_CREATE, PERMISSIONS.KPI_UPDATE, PERMISSIONS.TARGET_READ, PERMISSIONS.WORKFLOW_READ],
  },
  [ROLES.VIEWER]: {
    label: ROLE_LABELS[ROLES.VIEWER],
    hierarchyLevel: 'country',
    scope: 'readOnly',
    permissions: [PERMISSIONS.DASHBOARD_READ, PERMISSIONS.KPI_READ, PERMISSIONS.TARGET_READ],
  },
};

export const DEFAULT_ROLE = ROLES.VIEWER;

export const getRoleConfig = (role = DEFAULT_ROLE) => ROLE_CONFIG[role] || ROLE_CONFIG[DEFAULT_ROLE];

export const hasPermission = (role, permission) => getRoleConfig(role).permissions.includes(permission);

export const resolveRoleFromClaims = (claims = {}, viewOnly = false) => {
  if (viewOnly) return ROLES.VIEWER;
  return claims.role || claims.roles?.[0] || DEFAULT_ROLE;
};

export const buildRoleScopeFilters = (profile = {}) => {
  const role = profile.role || DEFAULT_ROLE;
  if ([ROLES.SUPER_ADMIN, ROLES.NATIONAL_HEAD].includes(role)) return {};
  if (role === ROLES.REGIONAL_MANAGER && profile.region) return { region: profile.region };
  if (role === ROLES.AREA_SALES_MANAGER && profile.territory) return { territory: profile.territory };
  if (role === ROLES.VIEWER) return {};
  return {};
};
