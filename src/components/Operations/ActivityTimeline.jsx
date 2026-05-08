import React from 'react';
import { Clock3 } from 'lucide-react';

const buildEvents = (records = []) => records
  .filter((record) => record.updatedAt || record.createdAt)
  .slice()
  .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
  .slice(0, 5)
  .map((record) => ({
    id: record.id || `${record.prospectName}-${record.updatedAt}`,
    title: record.prospectName || record.company || 'KPI record',
    actor: record.updatedBy || record.createdBy || 'system',
    time: record.updatedAt || record.createdAt,
    status: record.status || 'Updated',
  }));

const ActivityTimeline = ({ records = [] }) => {
  const events = buildEvents(records);

  return (
    <section className="glass-effect p-4">
      <div className="mb-3 flex items-center gap-2">
        <Clock3 size={16} className="text-teal" />
        <h3 className="text-sm font-semibold text-white">Operational Activity Timeline</h3>
      </div>
      <div className="space-y-3">
        {events.length === 0 && <p className="text-xs text-white/60">No auditable activity in the current filter range.</p>}
        {events.map((event) => (
          <div key={event.id} className="relative border-l border-teal/30 pl-4">
            <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-teal" />
            <p className="text-xs font-semibold text-white">{event.title} · {event.status}</p>
            <p className="text-[11px] text-white/55">{event.actor} · {event.time ? new Date(event.time).toLocaleString() : 'time unavailable'}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 border-t border-white/10 pt-3 text-[11px] text-white/45">TODO: Persist immutable record history, workflow approvals, task assignment events, AI-generated insights, and partner lifecycle score changes to a dedicated operational log stream.</p>
    </section>
  );
};

export default ActivityTimeline;
