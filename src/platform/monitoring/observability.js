import { enterpriseEnvironment } from '../config/environment';

const levels = ['debug', 'info', 'warn', 'error'];
const shouldLog = (level) => levels.indexOf(level) >= levels.indexOf(enterpriseEnvironment.reliability.logLevel || 'warn');

export const platformLogger = {
  debug: (message, metadata) => shouldLog('debug') && console.debug(`[AIS Platform] ${message}`, metadata || ''),
  info: (message, metadata) => shouldLog('info') && console.info(`[AIS Platform] ${message}`, metadata || ''),
  warn: (message, metadata) => shouldLog('warn') && console.warn(`[AIS Platform] ${message}`, metadata || ''),
  error: (message, metadata) => shouldLog('error') && console.error(`[AIS Platform] ${message}`, metadata || ''),
};

export const createPerformanceMetric = ({ name, value, unit = 'ms', tags = {} }) => ({
  name,
  value,
  unit,
  tags,
  capturedAt: new Date().toISOString(),
});

export const monitorAsyncOperation = async (name, operation, metadata = {}) => {
  const startedAt = performance.now();
  try {
    const result = await operation();
    platformLogger.debug(`${name} completed`, createPerformanceMetric({ name, value: performance.now() - startedAt, tags: metadata }));
    return result;
  } catch (error) {
    platformLogger.error(`${name} failed`, { error, metadata });
    throw error;
  }
};

export const resiliencePolicy = {
  queryFallback: 'show-last-known-client-state',
  exportFallback: 'download-json-snapshot',
  routeFallback: 'redirect-login-or-safe-dashboard',
  thirdPartyFallback: 'disable-integration-and-continue-core-operations',
};
