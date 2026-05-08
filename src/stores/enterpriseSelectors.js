import { buildDimensionAnalytics, buildHistoricalComparison, calculateNationalHealthIndex } from '../services/analytics/analyticsEngine';
import { generateSmartInsights } from '../services/analytics/insightsEngine';

export const selectExecutiveIntelligence = (records = []) => ({
  healthIndex: calculateNationalHealthIndex(records),
  insights: generateSmartInsights(records),
  history: buildHistoricalComparison(records),
});

export const selectStrategicAnalytics = (records = []) => ({
  regional: buildDimensionAnalytics(records, 'region'),
  conversion: buildDimensionAnalytics(records, 'territory'),
  onboarding: buildDimensionAnalytics(records, 'rm'),
  source: buildDimensionAnalytics(records, 'source'),
  salesEfficiency: buildDimensionAnalytics(records, 'salesperson'),
  territory: buildDimensionAnalytics(records, 'territory'),
});

// TODO: Promote selectors into a shared Zustand enterprise store when more KPI modules share cross-page state.
