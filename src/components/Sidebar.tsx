import React, { useState } from 'react';
import {
  Map,
  Network,
  TrendingUp,
  FileText,
  Bot,
  Layers,
  Shield,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export type TabType = 'map' | 'network' | 'predictive' | 'registry' | 'ai_copilot';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  incidentsCount: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  incidentsCount,
  isCollapsed: externalIsCollapsed,
  onToggleCollapse,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(false);
  
  const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalCollapsed;

  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed(!internalCollapsed);
    }
  };

  const menuItems = [
    {
      id: 'map' as TabType,
      label: 'Geospatial Dashboard',
      subLabel: 'Karnataka Map & Hotspots',
      icon: Map,
      badge: '5,000+ Records',
    },
    {
      id: 'network' as TabType,
      label: 'Link Analysis Graph',
      subLabel: 'Syndicate & Network Links',
      icon: Network,
      badge: 'D3 Graph',
    },
    {
      id: 'predictive' as TabType,
      label: 'Predictive Forecaster',
      subLabel: 'Socio-Economic Risk Beats',
      icon: TrendingUp,
      badge: '91% AUC',
    },
    {
      id: 'registry' as TabType,
      label: 'Suspect Dossiers & FIRs',
      subLabel: 'Search FIRs & Repeat Offenders',
      icon: FileText,
      badge: `${incidentsCount} FIRs`,
    },
    {
      id: 'ai_copilot' as TabType,
      label: 'AI Strategic Copilot',
      subLabel: 'Gemini Natural Language Intelligence',
      icon: Bot,
      badge: 'AI Gen',
    },
  ];

  return (
    <aside
      className={`bg-[#0a0f1e] border-r border-slate-800 text-slate-300 flex flex-col justify-between shrink-0 select-none transition-all duration-300 relative ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-3">
        {/* Header Title / Toggle Bar */}
        <div className="px-1 py-1.5 mb-2 text-[10px] uppercase font-bold tracking-widest text-slate-500 flex items-center justify-between border-b border-slate-800/80 pb-2">
          {!isCollapsed && (
            <span className="flex items-center gap-1.5 text-slate-400 font-bold">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              Intelligence Modules
            </span>
          )}
          <button
            onClick={handleToggle}
            className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition border border-slate-800/80 ${
              isCollapsed ? 'mx-auto' : ''
            }`}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-indigo-400" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1 mt-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            if (isCollapsed) {
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  title={`${item.label} (${item.badge})`}
                  className={`w-full p-2.5 rounded-xl transition-all duration-150 flex items-center justify-center relative group ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border-l-2 border-indigo-500'
                      : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 border-l-2 border-transparent'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg transition ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/50'
                        : 'bg-slate-900 text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Hover Tooltip Popup when collapsed */}
                  <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#0a0f1e] text-slate-100 text-xs rounded-lg border border-slate-700 shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-50 flex items-center gap-2">
                    <div>
                      <div className="font-semibold text-amber-300">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{item.subLabel}</div>
                    </div>
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                      {item.badge}
                    </span>
                  </div>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full text-left p-2.5 rounded-xl transition-all duration-150 flex items-center justify-between group ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border-l-2 border-indigo-500 font-semibold'
                    : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-lg transition ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold tracking-wide">{item.label}</div>
                    <div className="text-[10px] text-slate-500 group-hover:text-slate-400">
                      {item.subLabel}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                    isActive
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  {item.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 text-xs bg-[#020617]/60 space-y-2">
        {isCollapsed ? (
          <div className="flex items-center justify-center p-2 rounded-xl bg-[#0f172a] border border-slate-800 text-indigo-400" title="PostgreSQL-GIS Active Synced">
            <Layers className="w-4 h-4" />
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-[#0f172a] border border-slate-800 flex items-center gap-2.5 text-slate-400">
            <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
            <div className="text-[11px] leading-tight">
              <span className="font-semibold text-slate-200 block">PostgreSQL-GIS</span>
              <span className="text-[10px] text-emerald-400">● Active Synced</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
