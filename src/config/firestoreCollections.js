export const KPI_COLLECTIONS = {
  prospectFunnel: {
    key: 'prospectFunnel',
    path: 'ch_prospect_funnel',
    dateField: 'date',
    defaultOrder: { field: 'date', direction: 'asc' },
    roleScopeFields: ['zone', 'salesperson'],
  },
  shortlisted: {
    key: 'shortlisted',
    path: 'ch_shortlisted',
    dateField: 'shortlistDate',
    defaultOrder: { field: 'shortlistDate', direction: 'asc' },
    roleScopeFields: ['zone', 'salesperson'],
  },
  // TODO: Register KPI 3–16 collection metadata here as modules are remounted.
};

export const getCollectionConfig = (collectionKey) => {
  const config = KPI_COLLECTIONS[collectionKey];

  if (!config) {
    throw new Error(`Unknown Firestore collection key: ${collectionKey}`);
  }

  return config;
};

export const collections = Object.fromEntries(
  Object.entries(KPI_COLLECTIONS).map(([key, config]) => [key, config.path]),
);
