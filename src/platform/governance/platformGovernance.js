export const GOVERNANCE_AREAS = {
  CONFIGURATION: 'configuration',
  AUDIT: 'audit',
  ROLE: 'role',
  KPI: 'kpi',
  POLICY: 'policy',
  MODULE: 'module',
};

export const governanceControls = {
  configuration: { owner: 'Platform Admin', reviewCadence: 'monthly', approvalRequired: true },
  audit: { owner: 'Audit Governance', reviewCadence: 'weekly', immutableEvents: true },
  role: { owner: 'Enterprise Security', reviewCadence: 'quarterly', customClaimsReady: true },
  kpi: { owner: 'Business Operations', reviewCadence: 'monthly', pluginGoverned: true },
  policy: { owner: 'Operations Leadership', reviewCadence: 'quarterly', workflowLinked: true },
  module: { owner: 'AIS Platform Council', reviewCadence: 'quarterly', registryRequired: true },
};

export const createGovernanceEvent = ({ area, action, actorId, targetId, metadata = {} }) => ({
  area,
  action,
  actorId,
  targetId,
  metadata,
  createdAt: new Date().toISOString(),
  retention: 'audit-safe',
});
