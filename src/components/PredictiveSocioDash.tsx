import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ScatterChart,
  Scatter,
  ZAxis,
  CartesianGrid,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  AlertOctagon,
  Users,
  Shield,
  Zap,
  Activity,
  Award,
  ChevronRight,
  Flame,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { KARNATAKA_DISTRICTS } from '../data/karnatakaDistricts';
import { MOCK_ANOMALIES, MOCK_PREDICTIVE_BEATS } from '../data/mockDatabase';

interface PredictiveSocioDashProps {
  onTriggerAIBrief?: (topic: string) => void;
}

export const PredictiveSocioDash: React.FC<PredictiveSocioDashProps> = ({ onTriggerAIBrief }) => {
  const [activeMetric, setActiveMetric] = useState<'urbanization' | 'unemployment' | 'literacy' | 'liquor'>(
    'urbanization'
  );

  // Prepare chart data comparing Cybercrime vs Urbanization / Unemployment
  const chartData = KARNATAKA_DISTRICTS.map((d) => ({
    name: d.name.replace('Dakshina Kannada (', '').replace(')', ''),
    totalIncidents: d.total_incidents,
    cybercrimeRate: d.cybercrime_rate,
    violentRate: d.violent_crime_rate,
    urbanization: d.urbanization_index,
    unemployment: d.youth_unemployment_rate,
    literacy: d.literacy_rate,
    liquor: d.liquor_license_density,
  }));

  return (
    <div className="w-full h-full bg-slate-950 p-6 overflow-y-auto space-y-6">
      {/* Top Banner Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-xl">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Sociological & AI Predictive Analytics Hub</span>
              <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Model AUC: 91.4%
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Cross-correlating Census data, urbanization indices & spatiotemporal moving averages
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (onTriggerAIBrief) {
              onTriggerAIBrief('Generate a predictive crime forecast briefing for high-risk beats across Karnataka for next week.');
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl text-xs transition shadow-lg shadow-cyan-950/40"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Strategic AI Forecast</span>
        </button>
      </div>

      {/* Grid Section: Anomaly Spikes & Predictive Beats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-Time Anomaly Spike Engine */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-red-500 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                Spatiotemporal Anomaly Detection Stream
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30">
              3 Threshold Breaches
            </span>
          </div>

          <div className="space-y-3">
            {MOCK_ANOMALIES.map((anomaly) => (
              <div
                key={anomaly.id}
                className="bg-slate-950 border border-slate-800 hover:border-slate-700 p-4 rounded-xl space-y-2 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                    <h4 className="text-xs font-bold text-slate-100">{anomaly.title}</h4>
                  </div>
                  <span className="text-[10px] font-bold text-red-400 bg-red-950 border border-red-500/40 px-2 py-0.5 rounded-md shrink-0">
                    +{anomaly.percentage_increase}% SPIKE
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{anomaly.description}</p>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800/80">
                  <div>
                    📍 Location: <span className="text-slate-200 font-medium">{anomaly.police_station}</span>
                  </div>
                  <div>
                    📊 Baseline: <span className="text-amber-400 font-mono">{anomaly.baseline_hourly_avg}/hr</span> →{' '}
                    <span className="text-red-400 font-mono font-bold">{anomaly.current_spike_value}/hr</span>
                  </div>
                </div>

                <div className="text-[11px] text-cyan-300 bg-cyan-950/40 p-2 rounded-lg border border-cyan-500/20 font-medium">
                  🛡️ Action: {anomaly.recommended_action}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Predictive Beat Risk Engine */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                High-Risk Beat Patrol Forecast
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Next 7 Days Window</span>
          </div>

          <div className="space-y-3">
            {MOCK_PREDICTIVE_BEATS.map((beat) => (
              <div
                key={beat.beat_id}
                className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono">{beat.beat_id}</span>
                    <h4 className="text-xs font-bold text-amber-300">{beat.beat_name}</h4>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-red-400 font-mono">{beat.risk_score}%</div>
                    <div className="text-[9px] text-slate-500">Predicted Risk</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    🕒 {beat.time_window}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                    🎯 {beat.predicted_crime_category}
                  </span>
                  <span className="ml-auto text-emerald-400 font-semibold">
                    🚓 Deploy {beat.recommended_patrol_units} Patrol Units
                  </span>
                </div>

                <div className="text-[10px] text-slate-400">
                  <span className="text-slate-500">Drivers:</span>{' '}
                  {beat.contributing_factors.join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Socio-Economic Correlation Layer Section */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Socio-Economic Correlation Layer
            </h3>
            <p className="text-xs text-slate-400">
              Correlating crime rates with urbanization, literacy & economic density across Karnataka
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 p-1 rounded-xl">
            {(
              [
                { id: 'urbanization', label: 'Urbanization Index' },
                { id: 'unemployment', label: 'Youth Unemployment' },
                { id: 'literacy', label: 'Literacy %' },
                { id: 'liquor', label: 'Liquor Density' },
              ] as const
            ).map((btn) => (
              <button
                key={btn.id}
                onClick={() => setActiveMetric(btn.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  activeMetric === btn.id
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
              />
              <Bar dataKey="cybercrimeRate" name="Cybercrime Rate %" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              <Bar
                dataKey={
                  activeMetric === 'urbanization'
                    ? 'urbanization'
                    : activeMetric === 'unemployment'
                    ? 'unemployment'
                    : activeMetric === 'literacy'
                    ? 'literacy'
                    : 'liquor'
                }
                name={
                  activeMetric === 'urbanization'
                    ? 'Urbanization %'
                    : activeMetric === 'unemployment'
                    ? 'Youth Unemployment %'
                    : activeMetric === 'literacy'
                    ? 'Literacy Rate %'
                    : 'Liquor Outlet Density'
                }
                fill="#f59e0b"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
