import React from 'react';
import { Award, BarChart3, Building2, LayoutDashboard, Settings, Users } from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'prospects', label: 'Prospects & CFT', icon: Users },
  { id: 'partners', label: 'Partners & Showrooms', icon: Building2 },
  { id: 'financials', label: 'Recoveries', icon: BarChart3 },
  { id: 'quality', label: 'Audits & Scores', icon: Award },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const Sidebar = ({ active, onChange }) => {
  return (
    <aside className="h-screen sticky top-0 w-64 bg-navy/80 glass-effect flex flex-col rounded-none md:rounded-glass">
      <div className="px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-teal/20 flex items-center justify-center">
            <span className="text-teal font-semibold text-lg">AIS</span>
          </div>
          <div>
            <p className="text-sm text-teal/80">Channel Management</p>
            <p className="text-xs text-white/70">KPI Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                isActive ? 'bg-teal/20 text-teal' : 'text-white/70 hover:bg-white/5'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-white/10 text-[11px] text-white/50">
        AIS Windows · Channel Management
        <br />
        Internal KPI monitoring
      </div>
    </aside>
  );
};

export default Sidebar;
