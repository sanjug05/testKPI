import { buildPromptReadyAnalyticsContext } from '../analytics/insightsEngine';

export const REPORT_TYPES = {
  EXECUTIVE_SUMMARY: 'executive_summary',
  ANALYTICS_SNAPSHOT: 'analytics_snapshot',
  ROLE_BASED: 'role_based',
};

export const buildAnalyticsSnapshotReport = ({ records = [], role = 'viewer', filters = {}, title = 'AIS Executive Analytics Snapshot' } = {}) => ({
  type: REPORT_TYPES.ANALYTICS_SNAPSHOT,
  title,
  generatedAt: new Date().toISOString(),
  audienceRole: role,
  filters,
  analytics: buildPromptReadyAnalyticsContext(records),
  sections: ['Executive Health', 'Smart Insights', 'Risk Indicators', 'Trend Projection', 'Territory Comparison'],
  delivery: { scheduled: false, channels: [] },
});

export const preparePresentationExportRows = (snapshot) => [
  ['Report', snapshot.title],
  ['Generated At', snapshot.generatedAt],
  ['Audience Role', snapshot.audienceRole],
  ['Record Count', snapshot.analytics.recordCount],
  ['Health Index', snapshot.analytics.healthIndex.score],
  ['Health Status', snapshot.analytics.healthIndex.status],
];

// TODO: Add scheduled email delivery, branded slide exports, and saved executive summary templates.
