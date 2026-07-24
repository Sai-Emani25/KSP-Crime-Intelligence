import React, { useState } from 'react';
import { X, FileSpreadsheet, Printer, Download, ShieldCheck, FileText } from 'lucide-react';
import { UserRole, Incident } from '../types';
import { KARNATAKA_DISTRICTS } from '../data/karnatakaDistricts';

interface ReportExportModalProps {
  currentRole: UserRole;
  onClose: () => void;
  incidentsCount: number;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  currentRole,
  onClose,
  incidentsCount,
}) => {
  const [timeframe, setTimeframe] = useState<string>('Last 7 Days');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All Karnataka State');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 text-amber-400 rounded-lg border border-slate-700">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Executive Briefing Report Generator</h3>
              <p className="text-xs text-slate-400">Formal Intelligence Report for DGP Command & SCRB Cabinet Briefing</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Preview Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Controls */}
          <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Timeframe Window</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
              >
                <option value="Last 24 Hours">Last 24 Hours</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Year to Date">Year to Date (2026)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Jurisdiction Scope</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200"
              >
                <option value="All Karnataka State">All Karnataka State</option>
                {KARNATAKA_DISTRICTS.map((d) => (
                  <option key={d.code} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Printable Report Document Card */}
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-xs space-y-4 font-sans text-slate-200">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-amber-400 text-sm">KARNATAKA STATE POLICE & SCRB</div>
                <div className="text-[10px] text-slate-400">STATE CRIME RECORDS BUREAU BRIEFING #2026-07</div>
              </div>
              <div className="text-right text-[10px] text-slate-400">
                <div>Date: {new Date().toLocaleDateString()}</div>
                <div>Author: {currentRole.name}</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-100 uppercase tracking-wider text-[11px]">1. Executive Summary</h4>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                During the evaluated period ({timeframe}), state telemetry registered an active volume of {incidentsCount.toLocaleString()} total incidents across {selectedDistrict}. Spatiotemporal clustering indicates a heightened concentration of Cyber Fraud (42.5%) in Bengaluru Urban (Whitefield CEN PS & Koramangala PS) and Commercial Safe Breaches in Belagavi.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-100 uppercase tracking-wider text-[11px]">2. Key Anomaly Spikes & Red-Zones</h4>
              <ul className="list-disc pl-4 text-slate-300 space-y-1 text-[11px]">
                <li><span className="text-red-400 font-semibold">+422% Spike</span> in WhatsApp Digital Arrest Video Call Scams in Whitefield Tech Corridor.</li>
                <li><span className="text-purple-400 font-semibold">+675% Interception Surge</span> of Darknet MDMA Postal Packages in Mangaluru Port.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-100 uppercase tracking-wider text-[11px]">3. Recommended Tactical Interventions</h4>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                - Deploy 4 mobile high-visibility patrol units to Tech Corridor Beat #4 between 11:00 AM and 05:00 PM.
                <br />
                - Coordinate with Reserve Bank of India (RBI) and cyber cell desk to freeze 18 flagged mule bank accounts.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-slate-900 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-amber-950/40"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Export PDF Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
