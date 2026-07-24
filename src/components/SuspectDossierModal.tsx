import React from 'react';
import {
  X,
  ShieldAlert,
  User,
  AlertTriangle,
  Fingerprint,
  MapPin,
  FileText,
  Activity,
  Award,
  Sparkles,
} from 'lucide-react';
import { Suspect, Incident } from '../types';

interface SuspectDossierModalProps {
  suspect: Suspect | null;
  onClose: () => void;
  linkedIncidents?: Incident[];
  onTriggerAIBrief?: (topic: string) => void;
}

export const SuspectDossierModal: React.FC<SuspectDossierModalProps> = ({
  suspect,
  onClose,
  linkedIncidents = [],
  onTriggerAIBrief,
}) => {
  if (!suspect) return null;

  const isHighRisk = suspect.risk_score >= 8.5;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-950 border border-red-500/40 text-red-400 rounded-lg">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-100">{suspect.full_name}</h3>
                <span className="text-xs font-mono text-slate-400">({suspect.suspect_id})</span>
              </div>
              <p className="text-xs text-slate-400">
                State Crime Records Bureau (SCRB) Central Dossier File
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Top Key Metrics Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Risk Meter */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                Risk Score
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className={`text-2xl font-black ${isHighRisk ? 'text-red-400' : 'text-amber-400'}`}>
                  {suspect.risk_score}
                </span>
                <span className="text-xs text-slate-500 font-mono">/ 10.0</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full ${isHighRisk ? 'bg-red-500' : 'bg-amber-500'}`}
                  style={{ width: `${suspect.risk_score * 10}%` }}
                ></div>
              </div>
            </div>

            {/* Custody Status */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Fingerprint className="w-3.5 h-3.5 text-amber-400" />
                Custody Status
              </span>
              <div className="mt-2">
                <span className="text-sm font-bold text-amber-300 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg inline-block">
                  {suspect.status}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 mt-2">Active Lookout Circular</span>
            </div>

            {/* Centrality Index */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                Network Centrality
              </span>
              <div className="mt-2 text-2xl font-bold text-cyan-300 font-mono">
                {(suspect.degree_centrality || 0.78).toFixed(2)}
              </div>
              <span className="text-[10px] text-slate-500 mt-2">High Syndicate Connectivity</span>
            </div>

            {/* Total FIRs */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                Linked FIRs
              </span>
              <div className="mt-2 text-2xl font-bold text-indigo-300 font-mono">
                {suspect.firs_involved.length} FIRs
              </div>
              <span className="text-[10px] text-slate-500 mt-2">Cross-District Jurisdiction</span>
            </div>
          </div>

          {/* Detailed Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Primary Modus Operandi Traits */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                Primary Modus Operandi (MO) Signature
              </span>
              <p className="text-xs text-slate-200 leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800">
                {suspect.primary_mo}
              </p>
            </div>

            {/* Known Aliases & Digital Identities */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">
                Known Aliases & Digital Handles
              </span>
              <div className="flex flex-wrap gap-1.5 p-2 bg-slate-900 rounded-lg border border-slate-800 min-h-16">
                {suspect.aliases.map((alias) => (
                  <span
                    key={alias}
                    className="bg-purple-950/80 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-md text-xs font-mono"
                  >
                    {alias}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Active Districts */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              Active Operating Districts & Safehouse Zones
            </span>
            <div className="flex flex-wrap gap-2">
              {suspect.districts_active.map((dist) => (
                <span
                  key={dist}
                  className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-lg text-xs font-medium"
                >
                  📍 {dist}
                </span>
              ))}
            </div>
          </div>

          {/* Linked FIR History */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Associated FIR History
            </span>
            <div className="space-y-2">
              {suspect.firs_involved.map((fir) => (
                <div
                  key={fir}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-amber-300">{fir}</span>
                  </div>
                  <span className="text-slate-400">Charge: Cyber Fraud / Property Theft</span>
                  <span className="text-red-400 font-semibold px-2 py-0.5 bg-red-950 rounded border border-red-500/30">
                    Active Warrant
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-900 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
          >
            Close Dossier
          </button>

          <button
            onClick={() => {
              if (onTriggerAIBrief) {
                onTriggerAIBrief(`Generate comprehensive intelligence dossier synthesis for suspect ${suspect.full_name} (${suspect.suspect_id}).`);
                onClose();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-950/50 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate AI Dossier Synthesis</span>
          </button>
        </div>
      </div>
    </div>
  );
};
