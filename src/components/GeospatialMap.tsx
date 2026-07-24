import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Filter,
  Clock,
  MapPin,
  ShieldAlert,
  Flame,
  Building,
  Info,
  X,
  Search,
  Sparkles,
} from 'lucide-react';
import { Incident, CrimeCategory, DistrictSummary } from '../types';
import { KARNATAKA_DISTRICTS, POLICE_STATIONS } from '../data/karnatakaDistricts';

interface GeospatialMapProps {
  incidents: Incident[];
  selectedDistrict: string;
  onDistrictSelect: (district: string) => void;
  selectedCategory: string;
  onCategorySelect: (cat: string) => void;
  onSelectIncident?: (inc: Incident) => void;
  onTriggerAIBrief?: (topic: string) => void;
}

export const GeospatialMap: React.FC<GeospatialMapProps> = ({
  incidents,
  selectedDistrict,
  onDistrictSelect,
  selectedCategory,
  onCategorySelect,
  onSelectIncident,
  onTriggerAIBrief,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [timeHour, setTimeHour] = useState<number>(14);
  const [filterByTime, setFilterByTime] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeDrawerItem, setActiveDrawerItem] = useState<any>(null);

  const categoriesList: CrimeCategory[] = [
    'Cybercrime',
    'Narcotics',
    'Property Crime',
    'Violent Crime',
    'Financial Fraud',
    'Organized Crime',
    'Human Trafficking',
  ];

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create map centered on Karnataka (15.3, 75.7)
      const map = L.map(mapContainerRef.current, {
        center: [15.3173, 75.7139],
        zoom: 7,
        zoomControl: false,
      });

      // CartoDB Dark Matter tile layer for law enforcement aesthetics
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup on unmount
    };
  }, []);

  // Center map when district changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (selectedDistrict === 'All Districts') {
      mapInstanceRef.current.flyTo([15.3173, 75.7139], 7, { duration: 1 });
    } else {
      const distData = KARNATAKA_DISTRICTS.find((d) => d.name === selectedDistrict);
      if (distData) {
        mapInstanceRef.current.flyTo([distData.centerLat, distData.centerLng], 11, { duration: 1.2 });
      }
    }
  }, [selectedDistrict]);

  // Update map markers when filters or time slider change
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    // Filter incidents
    let filtered = incidents;

    if (selectedDistrict !== 'All Districts') {
      filtered = filtered.filter((inc) => inc.district.toLowerCase() === selectedDistrict.toLowerCase());
    }

    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter((inc) => inc.crime_category === selectedCategory);
    }

    if (filterByTime) {
      filtered = filtered.filter((inc) => inc.time_of_day_hour === timeHour);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (inc) =>
          inc.fir_number.toLowerCase().includes(term) ||
          inc.modus_operandi.toLowerCase().includes(term) ||
          inc.police_station.toLowerCase().includes(term)
      );
    }

    // Limit visible points on map for performance (sample up to 400 points)
    const displayIncidents = filtered.slice(0, 400);

    // Render Police Stations
    POLICE_STATIONS.forEach((ps) => {
      if (selectedDistrict !== 'All Districts' && ps.district !== selectedDistrict) return;

      const stationIcon = L.divIcon({
        className: 'custom-station-icon',
        html: `
          <div class="relative group cursor-pointer">
            <div class="w-8 h-8 rounded-lg bg-slate-900 border-2 border-amber-500 flex items-center justify-center text-amber-400 font-bold text-xs shadow-lg shadow-amber-950/80">
              🏛️
            </div>
            <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-amber-300 text-[9px] px-1.5 py-0.5 rounded border border-amber-500/30">
              ${ps.name.split(' ')[0]}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([ps.lat, ps.lng], { icon: stationIcon });
      marker.on('click', () => {
        setActiveDrawerItem({ type: 'station', data: ps });
      });
      layerGroup.addLayer(marker);
    });

    // Render Incident Points & Red-Zone Clusters
    displayIncidents.forEach((inc) => {
      const isCritical = inc.severity === 'Critical' || inc.crime_category === 'Cybercrime';

      const colorMap: Record<CrimeCategory, string> = {
        Cybercrime: '#06b6d4', // Cyan
        Narcotics: '#a855f7', // Purple
        'Property Crime': '#eab308', // Amber
        'Violent Crime': '#ef4444', // Red
        'Financial Fraud': '#3b82f6', // Blue
        'Organized Crime': '#f97316', // Orange
        'Human Trafficking': '#ec4899', // Pink
      };

      const pointColor = colorMap[inc.crime_category] || '#94a3b8';

      // Circle marker for heatmap effect
      const circle = L.circleMarker([inc.latitude, inc.longitude], {
        radius: isCritical ? 8 : 5,
        fillColor: pointColor,
        color: isCritical ? '#ffffff' : pointColor,
        weight: isCritical ? 2 : 1,
        opacity: 0.9,
        fillOpacity: 0.7,
      });

      circle.on('click', () => {
        setActiveDrawerItem({ type: 'incident', data: inc });
        if (onSelectIncident) onSelectIncident(inc);
      });

      layerGroup.addLayer(circle);
    });

    // Render Pulsing Red-Zone Hotspot for High-Risk Alerts
    if (selectedDistrict === 'Bengaluru Urban' || selectedDistrict === 'All Districts') {
      const pulsingZone = L.divIcon({
        className: 'pulsing-hotspot-container',
        html: `
          <div class="w-12 h-12 pulsing-hotspot bg-red-600/30 border-2 border-red-500 flex items-center justify-center text-white font-bold text-xs shadow-2xl">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            🚨
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
      });

      const alertMarker = L.marker([12.9698, 77.75], { icon: pulsingZone });
      alertMarker.on('click', () => {
        setActiveDrawerItem({
          type: 'alert',
          data: {
            title: 'Whitefield Cybercrime Red-Zone Spike',
            district: 'Bengaluru Urban',
            station: 'Whitefield CEN Cybercrime PS',
            detail: '+422% Spike in WhatsApp Digital Arrest Scams',
            timestamp: 'Detected at 08:15 AM today',
          },
        });
      });
      layerGroup.addLayer(alertMarker);
    }
  }, [incidents, selectedDistrict, selectedCategory, timeHour, filterByTime, searchTerm]);

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 overflow-hidden">
      {/* Top Filter Bar Overlay */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 shadow-2xl">
        {/* District Selection Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none max-w-full">
          <span className="text-[10px] uppercase font-bold text-slate-400 mr-1 flex items-center gap-1 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-amber-500" />
            District:
          </span>

          <button
            onClick={() => onDistrictSelect('All Districts')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              selectedDistrict === 'All Districts'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-950/40'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Karnataka
          </button>

          {KARNATAKA_DISTRICTS.map((dist) => (
            <button
              key={dist.code}
              onClick={() => onDistrictSelect(dist.name)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedDistrict === dist.name
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-950/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {dist.name}
            </button>
          ))}
        </div>

        {/* Search & Category Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search FIR / MO / Station..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 w-44"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1">
            <Filter className="w-3.5 h-3.5 text-amber-500" />
            <select
              value={selectedCategory}
              onChange={(e) => onCategorySelect(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All Categories" className="bg-slate-900 text-slate-200">
                All Categories
              </option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-slate-200">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Bottom Spatiotemporal Time Slider & Legend Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-30 flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 shadow-2xl">
        {/* Time of Day Slider */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-1 max-w-xl">
          <button
            onClick={() => setFilterByTime(!filterByTime)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
              filterByTime
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{filterByTime ? `Hour: ${String(timeHour).padStart(2, '0')}:00` : 'All Hours'}</span>
          </button>

          {filterByTime && (
            <div className="flex items-center gap-2 flex-1">
              <span className="text-[10px] text-slate-500 font-mono">00:00</span>
              <input
                type="range"
                min="0"
                max="23"
                value={timeHour}
                onChange={(e) => setTimeHour(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 font-mono">23:00</span>
            </div>
          )}
        </div>

        {/* Crime Category Color Legend */}
        <div className="flex items-center gap-3 text-[11px] overflow-x-auto py-1 scrollbar-none">
          <span className="flex items-center gap-1 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Cyber
          </span>
          <span className="flex items-center gap-1 text-purple-400">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span> Narcotics
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> Property
          </span>
          <span className="flex items-center gap-1 text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-400"></span> Violent
          </span>
          <span className="flex items-center gap-1 text-blue-400">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span> Financial
          </span>
        </div>
      </div>

      {/* Slide-over Detail Drawer when clicking Marker */}
      {activeDrawerItem && (
        <div className="absolute right-4 top-20 bottom-20 z-40 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 flex flex-col justify-between animate-in slide-in-from-right duration-200">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                {activeDrawerItem.type === 'incident'
                  ? 'FIR Intelligence Details'
                  : activeDrawerItem.type === 'station'
                  ? 'Police Station Command'
                  : 'Anomalous Red-Zone Alert'}
              </span>
              <button
                onClick={() => setActiveDrawerItem(null)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Incident Drawer Body */}
            {activeDrawerItem.type === 'incident' && (
              <div className="space-y-3 text-xs text-slate-300">
                <div>
                  <div className="text-[10px] text-slate-500 font-mono">FIR NUMBER</div>
                  <div className="font-bold text-amber-300 text-sm">{activeDrawerItem.data.fir_number}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Category</span>
                    <span className="font-semibold text-cyan-300">{activeDrawerItem.data.crime_category}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Severity</span>
                    <span className="font-semibold text-red-400">{activeDrawerItem.data.severity}</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 font-mono">MODUS OPERANDI (MO)</div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800 text-slate-200">
                    {activeDrawerItem.data.modus_operandi}
                  </div>
                </div>

                <div className="space-y-1 text-slate-400">
                  <div>📍 Jurisdiction: {activeDrawerItem.data.police_station}, {activeDrawerItem.data.district}</div>
                  <div>🕒 Reported Time: {new Date(activeDrawerItem.data.timestamp).toLocaleString()}</div>
                  {activeDrawerItem.data.loss_amount_inr > 0 && (
                    <div className="text-emerald-400 font-semibold">
                      💰 Loss Amount: ₹{(activeDrawerItem.data.loss_amount_inr / 100000).toFixed(2)} Lakhs
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Station Drawer Body */}
            {activeDrawerItem.type === 'station' && (
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-amber-500" />
                  <div>
                    <div className="font-bold text-slate-100 text-sm">{activeDrawerItem.data.name}</div>
                    <div className="text-[10px] text-slate-400">{activeDrawerItem.data.district}</div>
                  </div>
                </div>

                <div className="space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Station Head:</span>
                    <span className="font-semibold text-slate-200">{activeDrawerItem.data.station_head}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Jurisdiction Area:</span>
                    <span className="font-semibold text-slate-200">{activeDrawerItem.data.jurisdiction_area_sqkm} sq.km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Incidents:</span>
                    <span className="font-bold text-amber-400">{activeDrawerItem.data.active_incidents_count}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Alert Drawer Body */}
            {activeDrawerItem.type === 'alert' && (
              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-200">
                  <div className="font-bold text-sm">{activeDrawerItem.data.title}</div>
                  <div className="text-[11px] mt-1">{activeDrawerItem.data.detail}</div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={() => {
                if (onTriggerAIBrief) {
                  const topic =
                    activeDrawerItem.type === 'incident'
                      ? `Analyze FIR ${activeDrawerItem.data.fir_number} and advise suspect interception strategy.`
                      : `Provide tactical patrol plan for ${activeDrawerItem.data.name || 'this area'}.`;
                  onTriggerAIBrief(topic);
                }
              }}
              className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 rounded-lg text-xs transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Trigger AI Tactical Synthesis</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
