export const targetCollectionSchema = {
  collection: 'ch_target_configs',
  requiredFields: [
    'kpiKey',
    'periodType',
    'periodKey',
    'periodStart',
    'periodEnd',
    'targetValue',
    'territory',
    'role',
  ],
};

// Static monthly plan objects were removed in Phase 3. Targets are now loaded from Firestore through useTargets().
