import { useMemo } from 'react';

export const useEnterpriseNotifications = ({ records = [], health, insights = [] }) => useMemo(() => {
  const converted = records.filter((record) => record.status === 'Converted').length;
  const interested = records.filter((record) => record.status === 'Interested').length;
  const conversionRate = interested ? Math.round((converted / interested) * 100) : 0;
  const underperforming = insights.find((insight) => insight.id === 'weak-zone');
  const alerts = [];

  if (health?.atRisk) {
    alerts.push({ id: 'kpi-health-risk', priority: 'critical', title: 'KPI target risk', message: `Prospect funnel health is ${health.status}. Leadership intervention may be required.` });
  }

  if (records.length && conversionRate < 25) {
    alerts.push({ id: 'conversion-warning', priority: 'high', title: 'Conversion trend below threshold', message: `Current Interested → Converted trend is ${conversionRate}%. Review lead quality and follow-up aging.` });
  }

  if (underperforming?.value && underperforming.value !== 'No data') {
    alerts.push({ id: 'territory-underperformance', priority: 'medium', title: 'Underperforming territory/region', message: `${underperforming.value} has the lowest conversion contribution in the selected period.` });
  }

  if (!records.length) {
    alerts.push({ id: 'empty-period', priority: 'medium', title: 'No KPI activity in selected period', message: 'No records matched the current enterprise filters. Confirm reporting coverage or adjust filters.' });
  }

  // TODO: Replace derived local alerts with realtime notification-center documents and approval workflow events.
  return alerts;
}, [health?.atRisk, health?.status, insights, records]);
