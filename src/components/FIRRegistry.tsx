import React, { useState } from 'react';
import {
  Search,
  Filter,
  FileText,
  User,
  ShieldAlert,
  Calendar,
  DollarSign,
  ChevronRight,
  PlusCircle,
  Eye,
} from 'lucide-react';
import { Incident, Suspect, CrimeCategory } from '../types';
import { KARNATAKA_DISTRICTS } from '../data/karnatakaDistricts';

interface FIRRegistryProps {
  incidents: Incident[];
  suspects: Suspect[];
  onOpenSuspectDossier: (suspect: Suspect) => void;
  onOpenFIRModal: () => void;
}

export const FIRRegistry: React.FC<FIRRegistryProps> = ({
  incidents,
  suspects,
  onOpenSuspectDossier,
  onOpenFIRModal,
}) => {
  const [activeTab, setActiveTab] = useState<'firs' | 'suspects'>('firs');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All Districts');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');

  const categoriesList: CrimeCategory[] = [
    'Cybercrime',
    'Narcotics',
    'Property Crime',
    'Violent Crime',
    'Financial Fraud',
    'Organized Crime',
    'Human Trafficking',
  ];

  // Filter FIRs
  const filteredIncidents = incidents.filter((inc) => {
    if (selectedDistrict !== 'All Districts' && inc.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
      return false;
    }
    if (selectedCategory !== 'All Categories' && inc.crime_category !== selectedCategory) {
      return false;
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        inc.fir_number.toLowerCase().includes(term) ||
        inc.modus_operandi.toLowerCase().includes(term) ||
        inc.police_station.toLowerCase().includes(term)
      );
    }
    return true;
  });

  // Filter Suspects
  const filteredSuspects = suspects.filter((s) => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        s.full_name.toLowerCase().includes(term) ||
        s.primary_mo.toLowerCase().includes(term) ||
        s.aliases.some((a) => a.toLowerCase().includes(term))
      );
    }
    return true;
  });

  return (
    <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider">
              State Crime Records Registry (SCRB Database)
            </h2>
            <p className="text-xs text-slate-400">
              Centralized repository of {incidents.length.toLocaleString()} active FIRs & Repeat Offender Dossiers
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-950 border border-slate-800 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setActiveTab('firs')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'firs' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              FIR Records ({filteredIncidents.length})
            </button>
            <button
              onClick={() => setActiveTab('suspects')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'suspects' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Suspect Registry ({filteredSuspects.length})
            </button>
          </div>

          <button
            onClick={onOpenFIRModal}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Log New FIR</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by FIR #, Suspect Name, Modus Operandi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {activeTab === 'firs' && (
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
            >
              <option value="All Districts">All Districts</option>
              {KARNATAKA_DISTRICTS.map((d) => (
                <option key={d.code} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
            >
              <option value="All Categories">All Categories</option>
              {categoriesList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* FIRs Tab Table View */}
      {activeTab === 'firs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3.5">FIR Number</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Station & District</th>
                  <th className="p-3.5">Modus Operandi (MO)</th>
                  <th className="p-3.5">Severity</th>
                  <th className="p-3.5">Loss (INR)</th>
                  <th className="p-3.5">Reported Date</th>
                  <th className="p-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredIncidents.slice(0, 100).map((inc) => (
                  <tr key={inc.incident_id} className="hover:bg-slate-850/60 transition">
                    <td className="p-3.5 font-bold text-amber-300 font-mono">{inc.fir_number}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-medium">
                        {inc.crime_category}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-200">{inc.police_station}</div>
                      <div className="text-[10px] text-slate-500">{inc.district}</div>
                    </td>
                    <td className="p-3.5 max-w-xs truncate text-slate-300">{inc.modus_operandi}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          inc.severity === 'Critical'
                            ? 'bg-red-950 text-red-400 border border-red-500/40'
                            : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {inc.severity}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-emerald-400">
                      {inc.loss_amount_inr && inc.loss_amount_inr > 0
                        ? `₹${(inc.loss_amount_inr / 100000).toFixed(2)} L`
                        : '—'}
                    </td>
                    <td className="p-3.5 text-slate-400">{new Date(inc.timestamp).toLocaleDateString()}</td>
                    <td className="p-3.5 text-right">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {inc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Suspects Tab Grid View */}
      {activeTab === 'suspects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuspects.map((s) => (
            <div
              key={s.suspect_id}
              className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-4 rounded-2xl shadow-xl space-y-3 transition flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono">{s.suspect_id}</span>
                    <h3 className="text-sm font-bold text-slate-100">{s.full_name}</h3>
                  </div>
                  <span className="text-xs font-bold text-red-400 px-2 py-0.5 bg-red-950 border border-red-500/30 rounded-md">
                    Risk {s.risk_score}
                  </span>
                </div>

                <div className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">PRIMARY MO</span>
                  {s.primary_mo}
                </div>

                <div className="flex flex-wrap gap-1">
                  {s.aliases.map((a) => (
                    <span
                      key={a}
                      className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-400">{s.status}</span>
                <button
                  onClick={() => onOpenSuspectDossier(s)}
                  className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Dossier</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
