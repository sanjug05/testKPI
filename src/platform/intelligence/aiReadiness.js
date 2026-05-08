import { AI_READINESS_CONFIG } from '../../config/enterpriseConfig';

export const buildInsightMetadata = ({ moduleId, kpiKey, filters = {}, dimensions = [], recordCount = 0 }) => ({
  schemaVersion: AI_READINESS_CONFIG.promptSchemaVersion,
  moduleId,
  kpiKey,
  filters,
  dimensions,
  recordCount,
  redactionPolicy: AI_READINESS_CONFIG.redactionPolicy,
  generatedAt: new Date().toISOString(),
});

export const createAutomationIntent = ({ intent, entityType, entityId, recommendedAction, confidence = 0, evidence = [] }) => ({
  intent,
  entityType,
  entityId,
  recommendedAction,
  confidence,
  evidence,
  status: 'ready-for-human-review',
  createdAt: new Date().toISOString(),
});

export const intelligenceApiContract = {
  summarizeExecutiveHealth: 'records[] -> redacted aggregate summary context',
  recommendOperationalActions: 'insights[] + workflow state -> reviewed recommendations',
  answerConversationalAnalytics: 'authorized query + scoped metrics -> role-aware answer',
  forecastOperationalRisk: 'historical snapshots -> predictive risk signals',
};
