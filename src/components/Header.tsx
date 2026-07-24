import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldAlert,
  PlusCircle,
  FileSpreadsheet,
  Bot,
  Activity,
  UserCheck,
  Building2,
  Bell,
  Search,
  X,
  User,
  FileText,
  ChevronRight,
  Shield,
  AlertTriangle,
  PanelLeft,
} from 'lucide-react';
import { UserRole, Incident, Suspect } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenFIRModal: () => void;
  onOpenReportModal: () => void;
  onToggleAICopilot: () => void;
  activeAnomaliesCount: number;
  incidents?: Incident[];
  suspects?: Suspect[];
  onOpenSuspectDossier?: (suspect: Suspect) => void;
  onSelectFIRIncident?: (incident: Incident) => void;
  onNavigateTab?: (tab: 'map' | 'network' | 'predictive' | 'registry' | 'ai_copilot') => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const USER_ROLES: UserRole[] = [
  {
    title: 'Director General of Police (DGP)',
    name: 'DGP Alok Mohan, IPS',
    badge_number: 'IPS-KA-1987-001',
    jurisdiction: 'Karnataka State Command Centre',
    level: 'State DGP Command',
  },
  {
    title: 'Superintendent of Police (SP)',
    name: 'SP Seema Latkar, IPS',
    badge_number: 'IPS-KA-2011-042',
    jurisdiction: 'Mysuru District HQ',
    level: 'District SP',
  },
  {
    title: 'Station House Officer (SHO)',
    name: 'Inspector R. V. Kulkarni',
    badge_number: 'KSP-INSP-4891',
    jurisdiction: 'Cubbon Park PS, Bengaluru Urban',
    level: 'Inspector SHO',
  },
  {
    title: 'Senior Intelligence Analyst',
    name: 'SCRB Lead Analyst Vikram Rao',
    badge_number: 'SCRB-ANL-2024',
    jurisdiction: 'State Crime Records Bureau (SCRB)',
    level: 'SCRB Analyst',
  },
];

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenFIRModal,
  onOpenReportModal,
  onToggleAICopilot,
  activeAnomaliesCount,
  incidents = [],
  suspects = [],
  onOpenSuspectDossier,
  onSelectFIRIncident,
  onNavigateTab,
  isSidebarCollapsed,
  onToggleSidebar,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl+K or Cmd+K to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close search popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cleanTerm = searchTerm.trim().toLowerCase();

  // Filter matching FIRs and Suspects
  const matchedIncidents = cleanTerm
    ? incidents
        .filter(
          (inc) =>
            inc.fir_number.toLowerCase().includes(cleanTerm) ||
            inc.police_station.toLowerCase().includes(cleanTerm) ||
            inc.crime_category.toLowerCase().includes(cleanTerm) ||
            inc.modus_operandi.toLowerCase().includes(cleanTerm)
        )
        .slice(0, 5)
    : [];

  const matchedSuspects = cleanTerm
    ? suspects
        .filter(
          (s) =>
            s.full_name.toLowerCase().includes(cleanTerm) ||
            s.aliases.some((a) => a.toLowerCase().includes(cleanTerm)) ||
            s.firs_involved.some((f) => f.toLowerCase().includes(cleanTerm)) ||
            s.primary_mo.toLowerCase().includes(cleanTerm)
        )
        .slice(0, 5)
    : [];

  const hasResults = matchedIncidents.length > 0 || matchedSuspects.length > 0;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 px-4 py-2.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40 shadow-xl">
      {/* Brand & Emblem */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition flex items-center justify-center shrink-0"
            title={isSidebarCollapsed ? 'Expand Navigation Sidebar' : 'Collapse Navigation Sidebar'}
          >
            <PanelLeft className={`w-4 h-4 ${isSidebarCollapsed ? 'text-indigo-400' : 'text-slate-400'}`} />
          </button>
        )}
        <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 border border-amber-500/40 shadow-md shadow-amber-950/50 shrink-0">
          <ShieldAlert className="w-6 h-6 text-amber-200" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-slate-100">
              KARNATAKA STATE POLICE
            </h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              SCRB Intelligence Hub
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-2">
            <span>Criminological Analytics & Predictive Command Platform</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] text-emerald-400 font-medium">LIVE TEL-FEED</span>
          </p>
        </div>
      </div>

      {/* Global Quick Lookup Search Bar */}
      <div
        ref={searchContainerRef}
        className="relative flex-1 max-w-md mx-2 min-w-[220px]"
      >
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search FIR (e.g. FIR-2024-001) or Suspect Name..."
            className="w-full bg-slate-950/90 border border-slate-700/80 focus:border-amber-500 rounded-xl pl-9 pr-16 py-1.5 text-xs text-slate-100 placeholder-slate-400 outline-none transition shadow-inner"
          />
          {searchTerm ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setIsOpen(false);
              }}
              className="absolute right-3 p-0.5 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 text-[9px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700 px-1.5 py-0.5 rounded">
              ⌘K
            </kbd>
          )}
        </div>

        {/* Quick Search Dropdown Popover */}
        {isOpen && cleanTerm.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#0a0f1e] border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800/80 max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
            {/* Suspect Matches Section */}
            {matchedSuspects.length > 0 && (
              <div className="p-2">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Suspect Dossiers ({matchedSuspects.length})</span>
                </div>
                <div className="space-y-1 mt-1">
                  {matchedSuspects.map((suspect) => (
                    <button
                      key={suspect.suspect_id}
                      onClick={() => {
                        if (onOpenSuspectDossier) {
                          onOpenSuspectDossier(suspect);
                        } else if (onNavigateTab) {
                          onNavigateTab('registry');
                        }
                        setIsOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-800/80 transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                          {suspect.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-100 group-hover:text-amber-300 flex items-center gap-1.5">
                            <span>{suspect.full_name}</span>
                            {suspect.aliases.length > 0 && (
                              <span className="text-[10px] text-slate-400 font-normal">
                                ({suspect.aliases.join(', ')})
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-2">
                            <span>Status: <strong className="text-amber-400">{suspect.status}</strong></span>
                            <span>•</span>
                            <span>FIRs: {suspect.firs_involved.slice(0, 2).join(', ')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                          suspect.risk_score >= 8.0
                            ? 'bg-red-500/20 text-red-300 border-red-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}>
                          Risk {suspect.risk_score.toFixed(1)}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* FIR Matches Section */}
            {matchedIncidents.length > 0 && (
              <div className="p-2">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-sky-400" />
                  <span>Matching FIR Records ({matchedIncidents.length})</span>
                </div>
                <div className="space-y-1 mt-1">
                  {matchedIncidents.map((inc) => (
                    <button
                      key={inc.incident_id}
                      onClick={() => {
                        if (onSelectFIRIncident) {
                          onSelectFIRIncident(inc);
                        }
                        if (onNavigateTab) {
                          onNavigateTab('registry');
                        }
                        setIsOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-800/80 transition flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-xs font-semibold text-sky-300 group-hover:text-sky-200 flex items-center gap-2">
                          <span>{inc.fir_number}</span>
                          <span className="text-[10px] font-medium text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.2 rounded">
                            {inc.crime_category}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-xs mt-0.5">
                          {inc.police_station}, {inc.district} — {inc.modus_operandi}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(inc.timestamp).toLocaleDateString()}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results Fallback */}
            {!hasResults && (
              <div className="p-6 text-center text-xs text-slate-400 space-y-1">
                <AlertTriangle className="w-5 h-5 text-amber-500/80 mx-auto mb-1" />
                <div className="font-semibold text-slate-300">No matching records found</div>
                <div className="text-[11px] text-slate-500">
                  Try searching for a full FIR ID (e.g., "KA-2024-") or suspect surname.
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Center Ticker / Anomaly Alert Warning */}
      {activeAnomaliesCount > 0 && (
        <div className="hidden xl:flex items-center gap-2 bg-red-950/60 border border-red-500/30 text-red-300 px-3 py-1 rounded-full text-xs animate-pulse">
          <Bell className="w-3.5 h-3.5 text-red-400" />
          <span className="font-semibold">{activeAnomaliesCount} Active Anomaly Spikes</span>
          <span className="text-slate-400 text-[11px]">| Baseline breach</span>
        </div>
      )}

      {/* Controls & Role Selector */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Role Selector Dropdown */}
        <div className="relative group">
          <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 hover:border-slate-600 px-3 py-1.5 rounded-lg text-xs cursor-pointer transition">
            <UserCheck className="w-4 h-4 text-amber-400" />
            <div className="text-left">
              <div className="font-medium text-slate-200">{currentRole.name}</div>
              <div className="text-[10px] text-slate-400">{currentRole.level}</div>
            </div>
          </div>
          
          <div className="absolute right-0 top-full mt-1 w-64 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl p-1 hidden group-hover:block z-50">
            <div className="px-2 py-1 text-[10px] uppercase font-semibold text-slate-400 border-b border-slate-800">
              Switch Authority Scope
            </div>
            {USER_ROLES.map((r) => (
              <button
                key={r.badge_number}
                onClick={() => onRoleChange(r)}
                className={`w-full text-left px-2.5 py-2 text-xs rounded-md transition flex flex-col gap-0.5 hover:bg-slate-800 ${
                  r.badge_number === currentRole.badge_number
                    ? 'bg-amber-500/10 text-amber-300 border-l-2 border-amber-500'
                    : 'text-slate-300'
                }`}
              >
                <span className="font-semibold">{r.title}</span>
                <span className="text-[10px] text-slate-400">{r.jurisdiction}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <button
          onClick={onOpenFIRModal}
          className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-3 py-1.5 rounded-lg text-xs transition shadow-md shadow-amber-900/30"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Log FIR</span>
        </button>

        <button
          onClick={onOpenReportModal}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs transition"
        >
          <FileSpreadsheet className="w-4 h-4 text-slate-400" />
          <span className="hidden sm:inline">Executive Brief</span>
        </button>

        <button
          onClick={onToggleAICopilot}
          className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium px-3 py-1.5 rounded-lg text-xs transition shadow-lg shadow-cyan-950/50"
        >
          <Bot className="w-4 h-4" />
          <span>AI Copilot</span>
        </button>
      </div>
    </header>
  );
};

