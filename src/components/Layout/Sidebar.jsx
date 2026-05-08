import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { hasPermission } from '../../config/rbac';
import { useAuth } from '../../contexts/AuthContext';
import { enterpriseEnvironment } from '../../platform/config/environment';
import { getNavigationGroups } from '../../platform/modules/moduleRegistry';

const Sidebar = ({ active, onChange }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { profile } = useAuth();
  const navGroups = useMemo(() => Object.values(getNavigationGroups()).map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.permission || hasPermission(profile.role, item.permission)),
  })).filter((group) => group.items.length > 0), [profile.role]);

  return (
    <aside className={`fixed inset-x-0 top-0 z-30 h-auto border-b border-white/10 bg-navy/95 backdrop-blur transition-all duration-300 md:sticky md:inset-auto md:top-0 md:h-screen md:border-b-0 ${collapsed ? 'md:w-20' : 'md:w-64'} glass-effect flex flex-col rounded-none md:rounded-glass`}>
      <div className="flex items-center justify-between gap-2 px-4 py-3 md:px-5 md:py-4 md:border-b md:border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal/20">
            <span className="text-lg font-semibold text-teal">AIS</span>
          </div>
          {!collapsed && (
            <div className="hidden md:block">
              <p className="text-sm text-teal/80">Operations Platform</p>
              <p className="text-xs text-white/70">Channel Management</p>
            </div>
          )}
        </div>
        <button type="button" aria-label="Toggle sidebar" onClick={() => setCollapsed((value) => !value)} className="hidden rounded-lg border border-white/10 p-1 text-white/60 transition hover:border-teal hover:text-teal focus:outline-none focus:ring-2 focus:ring-teal md:inline-flex">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-2 py-2 md:flex-1 md:flex-col md:gap-4 md:overflow-y-auto md:py-4">
        {navGroups.map((group) => (
          <div key={group.label} className="flex shrink-0 gap-1 md:block md:space-y-1">
            {!collapsed && <p className="hidden px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-white/35 md:block">{group.label}</p>}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onChange(item.id)}
                  title={item.label}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-teal md:w-full ${
                    isActive ? 'bg-teal/20 text-teal' : 'text-white/70 hover:bg-white/5 hover:text-white'
                  } ${collapsed ? 'md:justify-center' : ''}`}
                >
                  <Icon size={18} />
                  {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="hidden border-t border-white/10 px-4 py-3 text-[11px] text-white/50 md:block">
          {enterpriseEnvironment.appName}
          <br />
          Enterprise operations ecosystem
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
