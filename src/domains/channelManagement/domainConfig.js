export const channelManagementDomain = {
  boundedContext: 'channel-operations',
  ownedEntities: ['prospect', 'shortlist', 'cft', 'partner', 'territoryActivity'],
  sharedDependencies: ['enterpriseHierarchy', 'rbac', 'reporting', 'workflow', 'audit'],
  invariants: [
    'Existing prospect funnel statuses and KPI calculations are preserved.',
    'Role scope filters must be applied before operational data is rendered.',
    'Exports and reports must include generation metadata for audit traceability.',
  ],
};
