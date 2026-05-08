export const TARGET_COLLECTIONS = {
  targetConfigs: {
    key: 'targetConfigs',
    path: 'ch_target_configs',
    dateField: 'periodStart',
    defaultOrder: { field: 'periodStart', direction: 'desc' },
  },
};

export const TARGET_PERIODS = ['monthly', 'quarterly', 'yearly'];

export const buildTargetQuery = ({ kpiKey, periodType = 'monthly', periodKey, territory, role }) => ({
  kpiKey,
  periodType,
  periodKey,
  territory,
  role,
});
