import { enterpriseEnvironment } from '../config/environment';

export const REALTIME_CHANNELS = {
  KPI_REFRESH: 'kpi-refresh',
  NOTIFICATIONS: 'notifications',
  ALERTS: 'operational-alerts',
  WORKFLOWS: 'workflows',
};

export const createSubscriptionRegistry = () => {
  const subscriptions = new Map();
  return {
    register: (key, unsubscribe) => {
      subscriptions.get(key)?.();
      subscriptions.set(key, unsubscribe);
      return () => {
        subscriptions.get(key)?.();
        subscriptions.delete(key);
      };
    },
    clear: () => {
      subscriptions.forEach((unsubscribe) => unsubscribe?.());
      subscriptions.clear();
    },
    size: () => subscriptions.size,
  };
};

export const buildOperationalAlert = ({ severity = 'info', title, message, source = REALTIME_CHANNELS.ALERTS, metadata = {} }) => ({
  id: `${source}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  severity,
  title,
  message,
  source,
  metadata,
  createdAt: new Date().toISOString(),
  acknowledged: false,
});

export const shouldUseRealtime = (channel) => Boolean(enterpriseEnvironment.featureFlags.realTimeKpiRefresh || channel === REALTIME_CHANNELS.NOTIFICATIONS);
