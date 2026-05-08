import { limit as firestoreLimit, onSnapshot, query, startAfter } from 'firebase/firestore';
import { createCrudRepository } from '../../services/firestore/crud';

export const DATA_LIFECYCLE = {
  HOT: 'hot-operational',
  WARM: 'warm-reporting',
  COLD: 'cold-archive',
};

export const firestoreSchemaStrategy = {
  version: 'enterprise-schema-v1',
  rootCollections: {
    modules: 'enterprise_modules',
    kpiRecords: 'enterprise_kpi_records',
    workflows: 'enterprise_workflows',
    reports: 'enterprise_reports',
    audit: 'enterprise_audit_events',
  },
  currentCompatibilityCollections: ['ch_prospect_funnel', 'ch_shortlisted', 'ch_activity_log'],
  normalization: {
    partnerMaster: 'shared partner/dealer identities should live once and be referenced by KPI records',
    territoryMaster: 'hierarchy metadata should be keyed by territory and denormalized into operational snapshots',
    userOwnership: 'owner ids should reference enterprise user profiles while keeping display names for reports',
  },
  indexes: [
    ['date', 'region', 'territory'],
    ['date', 'source', 'status'],
    ['monthKey', 'region', 'salesperson'],
    ['workflowStatus', 'ownerId', 'slaDueAt'],
  ],
  archival: { hotRetentionMonths: 18, warmRetentionMonths: 60, coldStorage: 'export-ready' },
};

export const createEnterpriseRepository = (collectionKey, { pageSize = 100 } = {}) => {
  const crud = createCrudRepository(collectionKey);

  return {
    ...crud,
    listPage: async (filters = {}) => crud.list({ ...filters, limit: filters.limit || pageSize }),
    listen: (filters = {}, onData, onError) => crud.listen(filters, onData, onError),
    lifecycle: DATA_LIFECYCLE.HOT,
  };
};

export const appendPaginationConstraints = (constraints = [], { pageSize = 100, cursor } = {}) => {
  const pagedConstraints = [...constraints, firestoreLimit(pageSize)];
  if (cursor) pagedConstraints.push(startAfter(cursor));
  return pagedConstraints;
};

export const subscribeToEnterpriseQuery = ({ collectionRef, constraints = [], onData, onError }) => (
  onSnapshot(query(collectionRef, ...constraints), onData, onError)
);
