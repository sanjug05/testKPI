import { ENTERPRISE_THRESHOLDS } from './enterpriseConfig';

export const KPI_HEALTH_STATUS = {
  GREEN: 'Green',
  AMBER: 'Amber',
  RED: 'Red',
  CRITICAL: 'Critical',
};

export const KPI_THRESHOLDS = {
  default: { green: 90, amber: 70, red: 40 },
  prospectFunnel: { green: 90, amber: 70, red: 40 },
  conversionRate: ENTERPRISE_THRESHOLDS.conversionRate,
  onboardingVelocity: ENTERPRISE_THRESHOLDS.onboardingVelocity,
  confidence: ENTERPRISE_THRESHOLDS.confidence,
};

export const getKpiHealth = (achievementPercentage = 0, kpiKey = 'default') => {
  const thresholds = KPI_THRESHOLDS[kpiKey] || KPI_THRESHOLDS.default;
  if (achievementPercentage >= thresholds.green) return KPI_HEALTH_STATUS.GREEN;
  if (achievementPercentage >= thresholds.amber) return KPI_HEALTH_STATUS.AMBER;
  if (achievementPercentage >= thresholds.red) return KPI_HEALTH_STATUS.RED;
  return KPI_HEALTH_STATUS.CRITICAL;
};

export const calculateAchievement = (achievement = 0, target = 0) => {
  if (!target) return achievement ? 100 : 0;
  return Math.round((achievement / target) * 100);
};

export const evaluateKpi = ({ kpiKey, achievement, target, dueDate }) => {
  const achievementPercentage = calculateAchievement(achievement, target);
  const status = getKpiHealth(achievementPercentage, kpiKey);
  const overdue = dueDate ? new Date(dueDate) < new Date() && achievementPercentage < 100 : false;
  return { achievementPercentage, status, overdue, atRisk: [KPI_HEALTH_STATUS.RED, KPI_HEALTH_STATUS.CRITICAL].includes(status) || overdue };
};
