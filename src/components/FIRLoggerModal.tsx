import React, { useState } from 'react';
import { X, PlusCircle, ShieldAlert, CheckCircle } from 'lucide-react';
import { Incident, CrimeCategory } from '../types';
import { KARNATAKA_DISTRICTS, POLICE_STATIONS } from '../data/karnatakaDistricts';

interface FIRLoggerModalProps {
  onClose: () => void;
  onSuccess: (newIncident: Incident) => void;
}

export const FIRLoggerModal: React.FC<FIRLoggerModalProps> = ({ onClose, onSuccess }) => {
  const [firNumber, setFirNumber] = useState<string>(
    `FIR-2026-BLR-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [district, setDistrict] = useState<string>('Bengaluru Urban');
  const [policeStation, setPoliceStation] = useState<string>('Whitefield CEN Cybercrime PS');
  const [crimeCategory, setCrimeCategory] = useState<CrimeCategory>('Cybercrime');
  const [modusOperandi, setModusOperandi] = useState<string>('');
  const [severity, setSeverity] = useState<'Minor' | 'Moderate' | 'Severe' | 'Critical'>('Severe');
  const [lossAmountINR, setLossAmountINR] = useState<number>(250000);
  const [victimDetails, setVictimDetails] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const categoriesList: CrimeCategory[] = [
    'Cybercrime',
    'Narcotics',
    'Property Crime',
    'Violent Crime',
    'Financial Fraud',
    'Organized Crime',
    'Human Trafficking',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modusOperandi.trim()) return;

    setIsSubmitting(true);

    const station = POLICE_STATIONS.find((p) => p.name === policeStation) || POLICE_STATIONS[0];

    const newInc: Partial<Incident> = {
      fir_number: firNumber,
      district,
      police_station: policeStation,
      crime_category: crimeCategory,
      modus_operandi: modusOperandi,
      severity,
      loss_amount_inr: lossAmountINR,
      victim_details: victimDetails,
      latitude: station.lat,
      longitude: station.lng,
      status: 'Under Investigation',
      suspect_ids: ['SUS-8091'],
      beat_name: `${district} Station Beat #1`,
    };

    try {
      const res = await fetch('/api/incidents/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInc),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess(data.incident);
        onClose();
      }
    } catch (err) {
      console.error('Error logging FIR:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-lg">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Log New FIR / Incident</h3>
              <p className="text-xs text-slate-400">Insert record into SCRB Database and Spatiotemporal Graph</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-200">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">FIR Number</label>
              <input
                type="text"
                value={firNumber}
                onChange={(e) => setFirNumber(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-300 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Crime Category</label>
              <select
                value={crimeCategory}
                onChange={(e) => setCrimeCategory(e.target.value as CrimeCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">District</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
              >
                {KARNATAKA_DISTRICTS.map((d) => (
                  <option key={d.code} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Police Station Jurisdiction</label>
              <select
                value={policeStation}
                onChange={(e) => setPoliceStation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
              >
                {POLICE_STATIONS.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Modus Operandi (MO) Description</label>
            <textarea
              value={modusOperandi}
              onChange={(e) => setModusOperandi(e.target.value)}
              placeholder="Detail specific criminal tactics, tools used, handles, or execution sequence..."
              rows={3}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 focus:outline-none focus:border-amber-500"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Severity Rating</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
              >
                <option value="Minor">Minor</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Estimated Financial Loss (INR)</label>
              <input
                type="number"
                value={lossAmountINR}
                onChange={(e) => setLossAmountINR(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Complainant / Victim Profile</label>
            <input
              type="text"
              placeholder="e.g. IT Executive (Age 34) / Commercial Store Owner"
              value={victimDetails}
              onChange={(e) => setVictimDetails(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-950/40 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Logging Record...' : 'Log FIR & Insert Graph'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
