import React from 'react';
import { format } from 'date-fns';
import { CalendarRange, ChevronRight, User2, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ activeSection = 'overview', dateRange, setDateRange, onJump }) => {
  const { user, viewOnly, profile, logout } = useAuth();
  const today = format(new Date(), 'dd MMM yyyy');

  return (
    <header className="glass-effect sticky top-[64px] z-20 mb-4 flex flex-col justify-between gap-4 px-4 py-3 transition md:top-3 xl:flex-row xl:items-center xl:px-6">
      <div>
        <div className="mb-1 flex items-center gap-1 text-[11px] text-white/45">
          AIS Enterprise <ChevronRight size={12} /> Dashboard <ChevronRight size={12} /> <span className="text-teal">{activeSection}</span>
        </div>
        <h2 className="text-lg font-semibold text-white">Channel Management KPIs</h2>
        <p className="text-xs text-teal/70">AIS Windows · Performance overview · {today}</p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-5">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <CalendarRange size={16} className="text-teal" />
            <span className="text-white/70">From</span>
            <input type="date" value={dateRange.from} onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))} className="glass-input rounded px-2 py-1 text-xs text-white outline-none focus:border-teal" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/70">To</span>
            <input type="date" value={dateRange.to} onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))} className="glass-input rounded px-2 py-1 text-xs text-white outline-none focus:border-teal" />
          </div>
          <label className="flex items-center gap-2 text-white/70">
            <Zap size={14} className="text-gold" /> Quick jump
            <select onChange={(event) => onJump?.(event.target.value)} className="glass-input rounded px-2 py-1 text-xs text-white outline-none focus:border-teal" defaultValue="">
              <option value="" disabled>Select KPI</option>
              <option value="overview">Executive overview</option>
              <option value="prospects">Prospect funnel</option>
              <option value="partners">Partner KPIs</option>
              <option value="financials">Recoveries</option>
              <option value="quality">Audits</option>
            </select>
          </label>
        </div>

        <div className="flex items-center gap-3 lg:border-l lg:border-white/10 lg:pl-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal/30">
            <User2 size={16} className="text-gold" />
          </div>
          <div className="text-xs">
            <div className="text-white/90">{user?.email || 'View Only User'}</div>
            <div className="text-teal/70">{viewOnly ? 'Read-only mode' : profile.roleLabel}</div>
          </div>
          {!viewOnly && user && <button type="button" onClick={logout} className="ml-2 text-[11px] text-teal hover:text-gold">Logout</button>}
        </div>
      </div>
    </header>
  );
};

export default Header;
