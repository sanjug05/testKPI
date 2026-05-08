import { Award, BarChart3, BrainCircuit, Building2, LayoutDashboard, Settings, Users } from 'lucide-react';
import { PERMISSIONS } from '../../config/rbac';

export const MODULE_STATUSES = {
  ACTIVE: 'active',
  READY: 'ready',
  PLANNED: 'planned',
};

export const ENTERPRISE_MODULES = [
  {
    id: 'executive',
    label: 'Executive Intelligence',
    domain: 'enterprise-intelligence',
    status: MODULE_STATUSES.ACTIVE,
    navigationGroup: 'Executive',
    routes: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard, permission: PERMISSIONS.DASHBOARD_READ },
      { id: 'analytics', label: 'Strategic Analytics', icon: BrainCircuit, permission: PERMISSIONS.DASHBOARD_READ },
    ],
    capabilities: ['executive-overview', 'strategic-analytics', 'alert-synthesis'],
  },
  {
    id: 'channelManagement',
    label: 'Channel Management',
    domain: 'channel-operations',
    status: MODULE_STATUSES.ACTIVE,
    navigationGroup: 'KPI Modules',
    basePath: '/dashboard/channel',
    kpiPlugins: ['prospectFunnel'],
    routes: [
      { id: 'prospects', label: 'Prospects & CFT', icon: Users, permission: PERMISSIONS.KPI_READ },
      { id: 'partners', label: 'Partners & Showrooms', icon: Building2, permission: PERMISSIONS.KPI_READ },
      { id: 'financials', label: 'Recoveries', icon: BarChart3, permission: PERMISSIONS.KPI_READ },
      { id: 'quality', label: 'Audits & Scores', icon: Award, permission: PERMISSIONS.KPI_READ },
    ],
    capabilities: ['kpi-entry', 'kpi-health', 'exports', 'activity-monitoring'],
  },
  ...[
    ['experienceCenter', 'Experience Center Management'],
    ['dealerLifecycle', 'Dealer Lifecycle'],
    ['recoveryManagement', 'Recovery Management'],
    ['incentiveManagement', 'Incentive Management'],
    ['architectEngagement', 'Architect Engagement'],
    ['auditGovernance', 'Audit Governance'],
    ['serviceOperations', 'Service Operations'],
    ['leadManagement', 'Lead Management'],
    ['salesOperations', 'Sales Operations'],
  ].map(([id, label]) => ({
    id,
    label,
    domain: id,
    status: MODULE_STATUSES.PLANNED,
    navigationGroup: 'Future Modules',
    routes: [],
    capabilities: ['registration-ready', 'domain-isolated', 'module-route-ready'],
  })),
  {
    id: 'platformAdmin',
    label: 'Platform Governance',
    domain: 'platform-governance',
    status: MODULE_STATUSES.READY,
    navigationGroup: 'Administration',
    routes: [{ id: 'settings', label: 'Settings', icon: Settings, permission: PERMISSIONS.GOVERNANCE_READ || PERMISSIONS.DASHBOARD_READ }],
    capabilities: ['configuration-governance', 'role-governance', 'kpi-governance'],
  },
];

export const getRegisteredModules = () => ENTERPRISE_MODULES;
export const getActiveModules = () => ENTERPRISE_MODULES.filter((module) => module.status !== MODULE_STATUSES.PLANNED);
export const getModuleById = (moduleId) => ENTERPRISE_MODULES.find((module) => module.id === moduleId);
export const getNavigationGroups = () => getActiveModules().reduce((groups, module) => {
  if (!module.routes?.length) return groups;
  const group = groups[module.navigationGroup] || { label: module.navigationGroup, items: [] };
  group.items.push(...module.routes.map((route) => ({ ...route, moduleId: module.id })));
  return { ...groups, [module.navigationGroup]: group };
}, {});
