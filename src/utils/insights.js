import { generateSmartInsights } from '../services/analytics/insightsEngine';

export const buildProspectInsights = (records) => generateSmartInsights(records).highlights;
