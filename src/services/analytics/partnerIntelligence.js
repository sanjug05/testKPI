import { SCORING_CONFIGS } from '../../config/enterpriseConfig';
import { clampScore, groupByDimension } from './analyticsEngine';

const daysSince = (dateValue) => {
  if (!dateValue) return 999;
  const time = new Date(dateValue).getTime();
  if (Number.isNaN(time)) return 999;
  return Math.floor((Date.now() - time) / 86400000);
};

export const calculatePartnerHealthScore = (records = []) => {
  const converted = records.filter((record) => record.status === 'Converted').length;
  const recent = records.filter((record) => daysSince(record.updatedAt || record.createdAt || record.date) <= 30).length;
  const progressed = records.filter((record) => ['Shortlisted', 'CFT Done', 'Converted'].includes(record.status)).length;
  const weights = SCORING_CONFIGS.partnerHealth;
  return clampScore(
    (records.length ? (converted / records.length) * 100 : 0) * weights.conversionContribution
    + (records.length ? (recent / records.length) * 100 : 0) * weights.recentActivity
    + clampScore(new Set(records.map((record) => record.source).filter(Boolean)).size * 18) * weights.engagement
    + (records.length ? (progressed / records.length) * 100 : 0) * weights.lifecycleProgress,
  );
};

export const buildPartnerIntelligence = (records = []) => Object.entries(groupByDimension(records, 'company')).map(([partner, values]) => {
  const latestActivity = values.map((record) => record.updatedAt || record.createdAt || record.date).filter(Boolean).sort().at(-1);
  const inactivityDays = daysSince(latestActivity);
  return {
    partner,
    healthScore: calculatePartnerHealthScore(values),
    onboardingVelocity: values.length ? Math.round((values.filter((record) => ['CFT Done', 'Converted'].includes(record.status)).length / values.length) * 100) : 0,
    inactivityDays,
    inactive: inactivityDays > 60,
    lifecycleStage: values.some((record) => record.status === 'Converted') ? 'Converted partner' : values.some((record) => record.status === 'CFT Done') ? 'Validation' : 'Prospecting',
    showroomReadiness: values.some((record) => record.status === 'Converted') ? 'Ready for showroom performance tracking' : 'Pending partner conversion',
    owner: values[0]?.asm || values[0]?.salesperson || 'Unassigned',
  };
}).sort((a, b) => a.healthScore - b.healthScore);

// TODO: Replace company-level proxy with canonical dealer/partner IDs when partner master data is introduced.
