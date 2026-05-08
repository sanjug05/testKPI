import React from 'react';
import { format } from 'date-fns';
import { CalendarRange, User2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ dateRange, setDateRange }) => {
  const { user, viewOnly, logout } = useAuth();
  const today = format(new Date(), 'dd MMM yyyy');

  return (
    <header className="glass-effect px-6 py-3 flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-4">
      <div>
        <h2 className="text-lg font-semibold text-white">Channel Management KPIs</h2>
        <p className="text-xs text-teal/70">AIS Windows · Performance overview · {today}</p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-5">
        <div className="flex items-center gap-3 text-xs flex-wrap">
          <div className="flex items-center gap-2">
            <CalendarRange size={16} className="text-teal" />
            <span className="text-white/70">From</span>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
              className="glass-input px-2 py-1 rounded text-xs text-white focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/70">To</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
              className="glass-input px-2 py-1 rounded text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 lg:pl-4 lg:border-l border-white/10">
          <div className="h-8 w-8 rounded-full bg-teal/30 flex items-center justify-center">
            <User2 size={16} className="text-gold" />
          </div>
          <div className="text-xs">
            <div className="text-white/90">{user?.email || 'View Only User'}</div>
            <div className="text-teal/70">{viewOnly ? 'Read-only mode' : 'Channel Manager'}</div>
          </div>
          {!viewOnly && user && (
            <button type="button" onClick={logout} className="ml-2 text-[11px] text-teal hover:text-gold">
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
