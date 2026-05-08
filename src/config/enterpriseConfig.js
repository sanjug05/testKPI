import { ROLE_CONFIG } from './rbac';

export const ENTERPRISE_KPI_CONFIGS = {
  prospectFunnel: {
    label: 'Prospect Funnel',
    businessOwner: 'Channel Expansion',
    stages: ['Interested', 'Shortlisted', 'CFT Done', 'Converted'],
    successStatus: 'Converted',
    confidenceFields: ['date', 'region', 'territory', 'source', 'status'],
    dimensions: ['region', 'state', 'territory', 'rm', 'asm', 'salesperson', 'source'],
    charts: ['funnel', 'monthlyTrend', 'regionalComparison', 'sourcePerformance'],
    strategicWeight: 0.42,
    aiContext: 'Lead-to-partner conversion health for AIS channel expansion.',
  },
  partnerLifecycle: {
    label: 'Partner Lifecycle',
    businessOwner: 'Dealer Operations',
    stages: ['Identified', 'Onboarded', 'Active', 'At Risk', 'Inactive'],
    successStatus: 'Active',
    confidenceFields: ['region', 'territory', 'lifecycleStage', 'owner'],
    dimensions: ['region', 'territory', 'partnerType', 'owner'],
    charts: ['partnerHealth', 'onboardingVelocity', 'engagementTrend'],
    strategicWeight: 0.34,
    aiContext: 'Dealer and showroom lifecycle quality, engagement, and expansion readiness.',
  },
};

export const ENTERPRISE_THRESHOLDS = {
  conversionRate: { green: 30, amber: 20, red: 10 },
  onboardingVelocity: { green: 60, amber: 40, red: 20 },
  growthVelocity: { green: 10, amber: 0, red: -10 },
  confidence: { green: 85, amber: 65, red: 45 },
  partnerHealth: { green: 80, amber: 60, red: 40 },
  inactivityDays: { amber: 30, red: 60, critical: 90 },
};

export const SCORING_CONFIGS = {
  nationalHealth: {
    conversionRate: 0.3,
    onboardingVelocity: 0.22,
    growthVelocity: 0.18,
    dataConfidence: 0.15,
    coverage: 0.15,
  },
  partnerHealth: {
    conversionContribution: 0.35,
    recentActivity: 0.25,
    engagement: 0.2,
    lifecycleProgress: 0.2,
  },
};

export const FILTER_CONFIGS = {
  global: ['region', 'state', 'territory', 'rm', 'asm', 'salesperson', 'source', 'kpiStatus'],
  analytics: ['region', 'territory', 'source', 'status', 'monthKey'],
};

export const CHART_CONFIGS = {
  executiveMomentum: { type: 'line', xKey: 'month', yKey: 'value', color: '#00B4D8' },
  regionalAnalytics: { type: 'bar', xKey: 'name', yKey: 'converted', color: '#2DD4BF' },
  conversionAnalytics: { type: 'bar', xKey: 'name', yKey: 'conversionRate', color: '#F4C430' },
};

export const ROLE_CONFIGS = ROLE_CONFIG;

export const AI_READINESS_CONFIG = {
  promptSchemaVersion: 'phase5-operational-intelligence-v1',
  supportedContexts: ['executive-summary', 'risk-review', 'territory-comparison', 'partner-health'],
  redactionPolicy: 'Use aggregated KPI metadata unless an authorized user explicitly opens record-level detail.',
};

// TODO: Externalize these configs into a Firestore-backed admin console when enterprise governance is enabled.

export const ENTERPRISE_PLATFORM_CONFIG = {
  platformName: 'AIS Operations Platform',
  currentBusinessDomain: 'channelManagement',
  architectureVersion: 'phase6-platformization-v1',
  moduleStrategy: 'Domain-driven modules register navigation, KPI plugins, routing, data contracts, workflows, reports, and governance metadata independently.',
  supportedFutureBusinesses: [
    'experienceCenterManagement',
    'dealerLifecycle',
    'recoveryManagement',
    'incentiveManagement',
    'architectEngagement',
    'auditGovernance',
    'serviceOperations',
    'leadManagement',
    'salesOperations',
  ],
};
