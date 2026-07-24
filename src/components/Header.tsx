import React from 'react';
import {
  ShieldAlert,
  PlusCircle,
  FileSpreadsheet,
  Bot,
  Activity,
  UserCheck,
  Building2,
  Bell,
} from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenFIRModal: () => void;
  onOpenReportModal: () => void;
  onToggleAICopilot: () => void;
  activeAnomaliesCount: number;
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
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 px-4 py-2.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40 shadow-xl">
      {/* Brand & Emblem */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 border border-amber-500/40 shadow-md shadow-amber-950/50">
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

      {/* Center Ticker / Anomaly Alert Warning */}
      {activeAnomaliesCount > 0 && (
        <div className="hidden lg:flex items-center gap-2 bg-red-950/60 border border-red-500/30 text-red-300 px-3 py-1 rounded-full text-xs animate-pulse">
          <Bell className="w-3.5 h-3.5 text-red-400" />
          <span className="font-semibold">{activeAnomaliesCount} Active Anomaly Spikes</span>
          <span className="text-slate-400 text-[11px]">| Real-time baseline threshold breach</span>
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
