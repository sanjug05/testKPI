import { buildDimensionAnalytics, buildHistoricalComparison, calculateDataConfidence, calculateNationalHealthIndex, detectThresholdObservations } from './analyticsEngine';

const percent = (value) => `${value}%`;

export const generateSmartInsights = (records = []) => {
  const regions = buildDimensionAnalytics(records, 'region');
  const territories = buildDimensionAnalytics(records, 'territory');
  const sources = buildDimensionAnalytics(records, 'source');
  const history = buildHistoricalComparison(records);
  const nationalHealth = calculateNationalHealthIndex(records);
  const observations = detectThresholdObservations(records);

  const strongestRegion = regions[0] || { name: 'No data', converted: 0, conversionRate: 0 };
  const weakestTerritory = [...territories].filter((item) => item.records > 0).sort((a, b) => a.conversionRate - b.conversionRate)[0] || { name: 'No data', conversionRate: 0 };
  const bestSource = sources[0] || { name: 'No data', conversionRate: 0, records: 0 };
  const riskWarnings = observations.filter((item) => ['Risk', 'Critical'].includes(item.status));

  return {
    highlights: [
      { id: 'strongest-growth-region', label: 'Strongest growth region', value: strongestRegion.name, detail: `${strongestRegion.converted} conversions · ${percent(strongestRegion.conversionRate)} rate`, tone: 'text-emerald-300' },
      { id: 'weakest-conversion-territory', label: 'Weakest conversion territory', value: weakestTerritory.name, detail: `${percent(weakestTerritory.conversionRate)} conversion rate`, tone: 'text-amber-300' },
      { id: 'source-performance', label: 'Highest conversion source', value: bestSource.name, detail: `${bestSource.records} records analyzed`, tone: 'text-teal' },
      { id: 'projection', label: 'Target projection signal', value: history.projection, detail: `Next period projected records · ${history.direction}`, tone: history.growthVelocity >= 0 ? 'text-emerald-300' : 'text-rose-300' },
      { id: 'confidence', label: 'KPI confidence', value: percent(calculateDataConfidence(records)), detail: 'Required metadata completeness', tone: 'text-gold' },
    ],
    narrative: [
      `${strongestRegion.name} is currently the strongest conversion region with ${strongestRegion.converted} converted prospects.`,
      `${weakestTerritory.name} needs leadership review due to a ${percent(weakestTerritory.conversionRate)} conversion signal.`,
      history.growthVelocity < 0 ? `Visible activity is declining ${Math.abs(history.growthVelocity)}% versus the previous month.` : `Visible activity improved ${history.growthVelocity}% versus the previous month.`,
    ],
    risks: riskWarnings.map((warning) => ({
      id: warning.id,
      title: `${warning.metric} ${warning.status}`,
      detail: `${warning.metric} is at ${warning.value} and requires ${warning.status === 'Critical' ? 'immediate intervention' : 'monitoring'}.`,
      tone: warning.tone,
    })),
    nationalHealth,
    history,
  };
};

export const buildPromptReadyAnalyticsContext = (records = []) => {
  const insights = generateSmartInsights(records);
  return {
    schema: 'ais-operational-intelligence-v1',
    generatedAt: new Date().toISOString(),
    recordCount: records.length,
    healthIndex: insights.nationalHealth,
    highlights: insights.highlights.map(({ id, label, value, detail }) => ({ id, label, value, detail })),
    risks: insights.risks,
    trend: insights.history,
  };
};
