import React from 'react';
import {
  Map,
  Network,
  TrendingUp,
  FileText,
  Bot,
  Layers,
  Shield,
  HelpCircle,
} from 'lucide-react';

export type TabType = 'map' | 'network' | 'predictive' | 'registry' | 'ai_copilot';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  incidentsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  incidentsCount,
}) => {
  const menuItems = [
    {
      id: 'map' as TabType,
      label: 'Geospatial & Hotspots',
      subLabel: 'Karnataka District Map & Red-Zones',
      icon: Map,
      badge: '5,000+ Incidents',
    },
    {
      id: 'network' as TabType,
      label: 'Link Analysis Graph',
      subLabel: 'Suspect, MO & Syndicate Mapping',
      icon: Network,
      badge: 'D3 Graph',
    },
    {
      id: 'predictive' as TabType,
      label: 'Predictive & Socio AI',
      subLabel: 'Socio-Economic Correlations & Beats',
      icon: TrendingUp,
      badge: '91% AUC',
    },
    {
      id: 'registry' as TabType,
      label: 'FIR & Dossier Registry',
      subLabel: 'Search FIRs & Repeat Offenders',
      icon: FileText,
      badge: `${incidentsCount} FIRs`,
    },
    {
      id: 'ai_copilot' as TabType,
      label: 'AI Intelligence Copilot',
      subLabel: 'Gemini Natural Language Queries',
      icon: Bot,
      badge: 'AI Gen',
    },
  ];

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800/80 text-slate-300 flex flex-col justify-between shrink-0 select-none">
      <div className="p-3">
        <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center justify-between">
          <span>Strategic Modules</span>
          <Shield className="w-3.5 h-3.5 text-amber-500/60" />
        </div>

        <nav className="space-y-1 mt-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full text-left p-2.5 rounded-lg transition-all duration-150 flex items-center justify-between group ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-200 border border-amber-500/30 shadow-md shadow-amber-950/20'
                    : 'hover:bg-slate-800/70 text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-md transition ${
                      isActive
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
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
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-slate-800/80 text-slate-500 border-slate-700/50'
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
      <div className="p-3 border-t border-slate-800/80 text-xs bg-slate-950/40">
        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2 text-slate-400">
          <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="text-[11px] leading-tight">
            <span className="font-semibold text-slate-200 block">SCRB Node #482</span>
            <span>Karnataka Police Grid v4.2</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
