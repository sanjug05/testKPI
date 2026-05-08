export const OPERATIONAL_EVENT_TYPES = {
  KPI_CREATED: 'kpi_created',
  KPI_UPDATED: 'kpi_updated',
  STATUS_CHANGED: 'status_changed',
  INSIGHT_GENERATED: 'insight_generated',
  WORKFLOW_ESCALATED: 'workflow_escalated',
};

export const buildOperationalEvent = ({ type, recordId, title, actor = 'system', metadata = {}, occurredAt = new Date().toISOString() }) => ({
  type,
  recordId,
  title,
  actor,
  metadata,
  occurredAt,
});

export const deriveActivityEvents = (records = []) => records.flatMap((record) => {
  const timestamp = record.updatedAt || record.createdAt || record.date;
  if (!timestamp) return [];
  return [buildOperationalEvent({
    type: record.createdAt === record.updatedAt ? OPERATIONAL_EVENT_TYPES.KPI_CREATED : OPERATIONAL_EVENT_TYPES.KPI_UPDATED,
    recordId: record.id,
    title: `${record.prospectName || record.company || 'KPI record'} · ${record.status || 'Updated'}`,
    actor: record.updatedBy || record.createdBy || record.salesperson || 'system',
    occurredAt: timestamp,
    metadata: { region: record.region, territory: record.territory, source: record.source, status: record.status },
  })];
}).sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt));

// TODO: Stream events to a dedicated operational_activity collection for audit trails, activity feeds, and AI context.
