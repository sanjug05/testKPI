import React from 'react';
import { Bell, TriangleAlert } from 'lucide-react';

const priorityClass = {
  critical: 'border-rose-400/40 bg-rose-500/10 text-rose-100',
  high: 'border-amber-400/40 bg-amber-500/10 text-amber-100',
  medium: 'border-teal/35 bg-teal/10 text-white/85',
  low: 'border-white/15 bg-white/5 text-white/70',
};

const NotificationPanel = ({ alerts = [] }) => (
  <section className="glass-effect p-4">
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Bell size={16} className="text-teal" />
        <h3 className="text-sm font-semibold text-white">Enterprise Alerts</h3>
      </div>
      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">{alerts.length} active</span>
    </div>
    <div className="space-y-2">
      {alerts.length === 0 && <p className="text-xs text-white/60">No active alerts. KPI conditions are within expected controls.</p>}
      {alerts.map((alert) => (
        <div key={alert.id} className={`rounded-xl border p-3 ${priorityClass[alert.priority] || priorityClass.low}`}>
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold"><TriangleAlert size={14} />{alert.title}</div>
          <p className="text-[11px] text-white/65">{alert.message}</p>
        </div>
      ))}
    </div>
  </section>
);

export default NotificationPanel;
