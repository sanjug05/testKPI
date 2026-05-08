import React, { useMemo } from 'react';
import { Clock3, GitBranch, ShieldCheck } from 'lucide-react';
import { deriveActivityEvents } from '../../services/activity/activityLog';
import { resolveEscalationStatus } from '../../services/workflow/workflowMetadata';
import { buildPartnerIntelligence } from '../../services/analytics/partnerIntelligence';

const ActivityTimeline = ({ records = [] }) => {
  const events = useMemo(() => deriveActivityEvents(records).slice(0, 6), [records]);
  const workflowSignals = useMemo(() => buildPartnerIntelligence(records).slice(0, 3).map((partner) => ({
    ...partner,
    escalationStatus: resolveEscalationStatus({ healthScore: partner.healthScore, inactivityDays: partner.inactivityDays }),
  })), [records]);

  return (
    <section className="glass-effect p-4">
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Clock3 size={16} className="text-teal" />
          <h3 className="text-sm font-semibold text-white">Operational Activity & Workflow Intelligence</h3>
        </div>
        <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-white/45">Audit-ready event structure</span>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="space-y-3 xl:col-span-2">
          {events.length === 0 && <p className="text-xs text-white/60">No auditable activity in the current filter range.</p>}
          {events.map((event) => (
            <div key={`${event.type}-${event.recordId}-${event.occurredAt}`} className="relative border-l border-teal/30 pl-4">
              <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-teal" />
              <p className="text-xs font-semibold text-white">{event.title}</p>
              <p className="text-[11px] text-white/55">{event.actor} · {event.occurredAt ? new Date(event.occurredAt).toLocaleString() : 'time unavailable'}</p>
              <p className="mt-1 text-[10px] uppercase tracking-wide text-white/35">{event.type}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-teal"><GitBranch size={14} /> Workflow readiness</div>
          <div className="space-y-2">
            {workflowSignals.map((signal) => (
              <div key={signal.partner} className="rounded-lg border border-white/10 bg-black/10 p-2 text-xs">
                <div className="flex items-center justify-between"><span className="text-white">{signal.partner}</span><span className="text-gold">{signal.escalationStatus}</span></div>
                <p className="mt-1 text-[11px] text-white/50">Owner: {signal.owner} · {signal.lifecycleStage}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 flex gap-2 border-t border-white/10 pt-3 text-[11px] text-white/45"><ShieldCheck size={14} className="shrink-0 text-emerald-300" /> Approval states, task statuses, assignments, escalation status, and lifecycle stages are now modeled for future routing.</p>
        </div>
      </div>
      <p className="mt-3 border-t border-white/10 pt-3 text-[11px] text-white/45">TODO: Persist immutable record history, workflow approvals, task assignment events, AI-generated insights, and partner lifecycle score changes to a dedicated operational log stream.</p>
    </section>
  );
};

export default ActivityTimeline;
