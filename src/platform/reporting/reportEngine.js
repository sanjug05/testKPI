import { hasPermission, PERMISSIONS } from '../../config/rbac';
import { buildAnalyticsSnapshotReport } from '../../services/reporting/reportingEngine';

export const REPORT_FORMATS = { CSV: 'csv', PDF_READY: 'pdf-ready', PRINT: 'print', JSON: 'json' };
export const REPORT_FREQUENCY = { ON_DEMAND: 'on-demand', WEEKLY: 'weekly', MONTHLY: 'monthly' };

export const reportTemplates = {
  executiveSnapshot: {
    key: 'executiveSnapshot',
    label: 'Executive Intelligence Snapshot',
    format: REPORT_FORMATS.PDF_READY,
    permission: PERMISSIONS.EXPORT,
    sections: ['summary', 'kpi-health', 'alerts', 'insights', 'risks'],
  },
  operationalDetail: {
    key: 'operationalDetail',
    label: 'Operational Detail Export',
    format: REPORT_FORMATS.CSV,
    permission: PERMISSIONS.EXPORT,
    sections: ['filters', 'records', 'audit-metadata'],
  },
};

export const createReportSchedule = ({ templateKey, audienceRole, frequency = REPORT_FREQUENCY.WEEKLY, recipients = [], filters = {} }) => ({
  templateKey,
  audienceRole,
  frequency,
  recipients,
  filters,
  enabled: false,
  delivery: { email: true, download: true, dashboardInbox: true },
  nextRunStrategy: 'future-ci-or-cloud-function',
});

export const generateRoleAwareReport = ({ templateKey = 'executiveSnapshot', records = [], profile = {}, filters = {} }) => {
  const template = reportTemplates[templateKey];
  const allowed = hasPermission(profile.role, template.permission);
  if (!allowed) throw new Error(`Role ${profile.role} cannot generate ${template.label}`);

  return {
    ...buildAnalyticsSnapshotReport({ records, role: profile.role, filters, title: template.label }),
    template,
    printReady: template.format === REPORT_FORMATS.PDF_READY || template.format === REPORT_FORMATS.PRINT,
  };
};
