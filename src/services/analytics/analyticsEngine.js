import { ENTERPRISE_KPI_CONFIGS, ENTERPRISE_THRESHOLDS, SCORING_CONFIGS } from '../../config/enterpriseConfig';

export const clampScore = (value) => Math.max(0, Math.min(100, Math.round(Number.isFinite(value) ? value : 0)));

export const groupByDimension = (records = [], dimension = 'region', predicate = () => true) => records.reduce((acc, record) => {
  if (!predicate(record)) return acc;
  const key = record[dimension] || 'Unassigned';
  if (!acc[key]) acc[key] = [];
  acc[key].push(record);
  return acc;
}, {});

export const countByDimension = (records = [], dimension = 'region', predicate = () => true) => Object.fromEntries(
  Object.entries(groupByDimension(records, dimension, predicate)).map(([key, values]) => [key, values.length]),
);

export const getConversionRate = (records = []) => {
  const interested = records.filter((record) => record.status === 'Interested').length;
  const converted = records.filter((record) => record.status === 'Converted').length;
  return interested ? Math.round((converted / interested) * 100) : 0;
};

export const buildMonthlySeries = (records = [], valuePredicate = () => true) => Object.entries(countByDimension(records, 'monthKey', valuePredicate))
  .sort(([a], [b]) => String(a).localeCompare(String(b)))
  .map(([month, value]) => ({ month, value }));

export const calculateGrowthVelocity = (series = []) => {
  if (series.length < 2) return 0;
  const current = series.at(-1)?.value || 0;
  const previous = series.at(-2)?.value || 0;
  if (!previous) return current ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

export const calculateRollingAverage = (series = [], windowSize = 3) => series.map((point, index) => {
  const window = series.slice(Math.max(0, index - windowSize + 1), index + 1);
  const average = window.reduce((sum, item) => sum + (item.value || 0), 0) / (window.length || 1);
  return { ...point, rollingAverage: Math.round(average * 10) / 10 };
});

export const projectNextValue = (series = []) => {
  if (!series.length) return 0;
  if (series.length === 1) return series[0].value || 0;
  const current = series.at(-1)?.value || 0;
  const previous = series.at(-2)?.value || 0;
  return Math.max(0, Math.round(current + (current - previous)));
};

export const evaluateThreshold = (value, thresholdKey) => {
  const threshold = ENTERPRISE_THRESHOLDS[thresholdKey] || ENTERPRISE_THRESHOLDS.conversionRate;
  if (value >= threshold.green) return { status: 'Strong', tone: 'success' };
  if (value >= threshold.amber) return { status: 'Watch', tone: 'warning' };
  if (value >= threshold.red) return { status: 'Risk', tone: 'danger' };
  return { status: 'Critical', tone: 'danger' };
};

export const calculateDataConfidence = (records = [], kpiKey = 'prospectFunnel') => {
  const requiredFields = ENTERPRISE_KPI_CONFIGS[kpiKey]?.confidenceFields || [];
  if (!records.length || !requiredFields.length) return 0;
  const populated = records.reduce((sum, record) => sum + requiredFields.filter((field) => Boolean(record[field])).length, 0);
  return clampScore((populated / (records.length * requiredFields.length)) * 100);
};

export const buildDimensionAnalytics = (records = [], dimension = 'region') => Object.entries(groupByDimension(records, dimension)).map(([name, values]) => {
  const converted = values.filter((record) => record.status === 'Converted').length;
  const interested = values.filter((record) => record.status === 'Interested').length;
  return {
    name,
    records: values.length,
    converted,
    interested,
    conversionRate: interested ? Math.round((converted / interested) * 100) : 0,
    onboardingVelocity: values.length ? Math.round((values.filter((record) => ['Shortlisted', 'CFT Done', 'Converted'].includes(record.status)).length / values.length) * 100) : 0,
  };
}).sort((a, b) => b.converted - a.converted || b.records - a.records);

export const buildHistoricalComparison = (records = []) => {
  const series = buildMonthlySeries(records);
  const withRollingAverage = calculateRollingAverage(series);
  const growthVelocity = calculateGrowthVelocity(series);
  return {
    series: withRollingAverage,
    growthVelocity,
    projection: projectNextValue(series),
    direction: growthVelocity > 0 ? 'accelerating' : growthVelocity < 0 ? 'declining' : 'flat',
  };
};

export const calculateNationalHealthIndex = (records = []) => {
  const conversionRate = getConversionRate(records);
  const onboardingVelocity = records.length ? Math.round((records.filter((record) => ['Shortlisted', 'CFT Done', 'Converted'].includes(record.status)).length / records.length) * 100) : 0;
  const growthVelocity = calculateGrowthVelocity(buildMonthlySeries(records));
  const dataConfidence = calculateDataConfidence(records);
  const coverage = clampScore(new Set(records.map((record) => record.region || record.zone).filter(Boolean)).size * 20);
  const weights = SCORING_CONFIGS.nationalHealth;
  const score = clampScore(
    conversionRate * weights.conversionRate
    + onboardingVelocity * weights.onboardingVelocity
    + clampScore(50 + growthVelocity) * weights.growthVelocity
    + dataConfidence * weights.dataConfidence
    + coverage * weights.coverage,
  );
  return {
    score,
    status: score >= 80 ? 'Expansion ready' : score >= 65 ? 'Stable with watchpoints' : score >= 45 ? 'Leadership attention' : 'High intervention required',
    inputs: { conversionRate, onboardingVelocity, growthVelocity, dataConfidence, coverage },
  };
};

export const detectThresholdObservations = (records = []) => {
  const conversionRate = getConversionRate(records);
  const historical = buildHistoricalComparison(records);
  const confidence = calculateDataConfidence(records);
  return [
    { id: 'conversion-risk', metric: 'Conversion', value: conversionRate, ...evaluateThreshold(conversionRate, 'conversionRate') },
    { id: 'momentum-risk', metric: 'Momentum', value: historical.growthVelocity, ...evaluateThreshold(historical.growthVelocity, 'growthVelocity') },
    { id: 'confidence-risk', metric: 'KPI confidence', value: confidence, ...evaluateThreshold(confidence, 'confidence') },
  ];
};

// TODO: Connect anomaly detectors and ML-backed forecasts behind this analytics abstraction without changing dashboard components.
