export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
};

const readEnv = (key, fallback = '') => import.meta.env[key] || fallback;

export const enterpriseEnvironment = {
  appName: readEnv('VITE_PLATFORM_NAME', 'AIS Operations Platform'),
  legacyProductName: 'AIS Channel Management KPI Dashboard',
  environment: readEnv('VITE_APP_ENV', import.meta.env.MODE || ENVIRONMENTS.DEVELOPMENT),
  firebase: {
    apiKey: readEnv('VITE_FIREBASE_API_KEY', 'YOUR_API_KEY'),
    authDomain: readEnv('VITE_FIREBASE_AUTH_DOMAIN', 'YOUR_AUTH_DOMAIN'),
    projectId: readEnv('VITE_FIREBASE_PROJECT_ID', 'YOUR_PROJECT_ID'),
    storageBucket: readEnv('VITE_FIREBASE_STORAGE_BUCKET', 'YOUR_STORAGE_BUCKET'),
    messagingSenderId: readEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', 'YOUR_MESSAGING_SENDER_ID'),
    appId: readEnv('VITE_FIREBASE_APP_ID', 'YOUR_APP_ID'),
  },
  featureFlags: {
    realTimeKpiRefresh: readEnv('VITE_ENABLE_REALTIME_KPIS', 'false') === 'true',
    auditSafeWrites: readEnv('VITE_ENABLE_AUDIT_SAFE_WRITES', 'true') === 'true',
    scheduledReports: readEnv('VITE_ENABLE_SCHEDULED_REPORTS', 'false') === 'true',
    aiInsights: readEnv('VITE_ENABLE_AI_INSIGHTS', 'false') === 'true',
  },
  reliability: {
    logLevel: readEnv('VITE_LOG_LEVEL', import.meta.env.PROD ? 'warn' : 'debug'),
    sentryDsn: readEnv('VITE_SENTRY_DSN'),
    analyticsKey: readEnv('VITE_ANALYTICS_KEY'),
  },
};

export const isProductionEnvironment = enterpriseEnvironment.environment === ENVIRONMENTS.PRODUCTION;

const PLACEHOLDER_VALUES = new Set([
  '',
  'YOUR_API_KEY',
  'YOUR_AUTH_DOMAIN',
  'YOUR_PROJECT_ID',
  'YOUR_STORAGE_BUCKET',
  'YOUR_MESSAGING_SENDER_ID',
  'YOUR_APP_ID',
]);

export const isFirebaseConfigured = (firebaseConfig = enterpriseEnvironment.firebase) => (
  Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId)
  && !Object.values(firebaseConfig).some((value) => PLACEHOLDER_VALUES.has(value))
);
