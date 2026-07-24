import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import {
  Filter,
  Clock,
  MapPin,
  ShieldAlert,
  Flame,
  Building,
  X,
  Search,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Calendar,
  BarChart2,
  TrendingUp,
  FastForward,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Incident, CrimeCategory } from '../types';
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

  // Temporal Filter State
  const [timeMode, setTimeMode] = useState<'single' | 'shift' | 'all'>('single');
  const [selectedHour, setSelectedHour] = useState<number>(14);
  const [activeShift, setActiveShift] = useState<'all' | 'night' | 'morning' | 'afternoon' | 'evening'>('all');
  
  // Date Range Filter State
  const [datePreset, setDatePreset] = useState<'all' | '24h' | '7d' | '30d' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  // Auto-Play temporal simulation state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeedMs, setPlaySpeedMs] = useState<number>(1000); // 1 sec per hour

  // General Filter & Drawer State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeDrawerItem, setActiveDrawerItem] = useState<any>(null);
  const [showTemporalPanel, setShowTemporalPanel] = useState<boolean>(true);

  const categoriesList: CrimeCategory[] = [
    'Cybercrime',
    'Narcotics',
    'Property Crime',
    'Violent Crime',
    'Financial Fraud',
    'Organized Crime',
    'Human Trafficking',
  ];

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [15.3173, 75.7139],
        zoom: 7,
        zoomControl: false,
      });

      // CartoDB Dark Matter tile layer for Sophisticated Dark theme
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }
  }, []);

  const isValidLatLng = (lat: any, lng: any): boolean => {
    const nLat = Number(lat);
    const nLng = Number(lng);
    return !isNaN(nLat) && !isNaN(nLng) && isFinite(nLat) && isFinite(nLng) && nLat !== 0 && nLng !== 0;
  };

  // Center map when district changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (selectedDistrict === 'All Districts') {
      mapInstanceRef.current.flyTo([15.3173, 75.7139], 7, { duration: 1 });
    } else {
      const distData = KARNATAKA_DISTRICTS.find((d) => d.name === selectedDistrict);
      if (distData && isValidLatLng(distData.centerLat, distData.centerLng)) {
        mapInstanceRef.current.flyTo([Number(distData.centerLat), Number(distData.centerLng)], 11, { duration: 1.2 });
      }
    }
  }, [selectedDistrict]);

  // Compute 24-Hour Incident Histogram for Current District & Category
  const hourlyHistogram = useMemo(() => {
    const counts = new Array(24).fill(0);
    incidents.forEach((inc) => {
      if (selectedDistrict !== 'All Districts' && inc.district.toLowerCase() !== selectedDistrict.toLowerCase()) return;
      if (selectedCategory !== 'All Categories' && inc.crime_category !== selectedCategory) return;
      
      const h = inc.time_of_day_hour ?? 0;
      if (h >= 0 && h < 24) {
        counts[h]++;
      }
    });
    return counts;
  }, [incidents, selectedDistrict, selectedCategory]);

  const maxHourlyCount = useMemo(() => Math.max(...hourlyHistogram, 1), [hourlyHistogram]);

  // Peak hour calculation
  const peakHour = useMemo(() => {
    let maxIdx = 0;
    hourlyHistogram.forEach((val, idx) => {
      if (val > hourlyHistogram[maxIdx]) maxIdx = idx;
    });
    return maxIdx;
  }, [hourlyHistogram]);

  // Auto-play timer for temporal slider playback
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setSelectedHour((prev) => (prev + 1) % 24);
      }, playSpeedMs);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playSpeedMs]);

  // Filter logic helper
  const filterIncidents = () => {
    let filtered = incidents;

    // 1. District filter
    if (selectedDistrict !== 'All Districts') {
      filtered = filtered.filter((inc) => inc.district.toLowerCase() === selectedDistrict.toLowerCase());
    }

    // 2. Category filter
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter((inc) => inc.crime_category === selectedCategory);
    }

    // 3. Search term filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (inc) =>
          inc.fir_number.toLowerCase().includes(term) ||
          inc.modus_operandi.toLowerCase().includes(term) ||
          inc.police_station.toLowerCase().includes(term)
      );
    }

    // 4. Date Range filter
    if (datePreset !== 'all') {
      const now = new Date();
      filtered = filtered.filter((inc) => {
        const incDate = new Date(inc.timestamp);
        if (isNaN(incDate.getTime())) return true;

        if (datePreset === '24h') {
          return now.getTime() - incDate.getTime() <= 24 * 60 * 60 * 1000;
        }
        if (datePreset === '7d') {
          return now.getTime() - incDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
        }
        if (datePreset === '30d') {
          return now.getTime() - incDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
        }
        if (datePreset === 'custom') {
          if (customStartDate && new Date(customStartDate) > incDate) return false;
          if (customEndDate && new Date(customEndDate) < incDate) return false;
          return true;
        }
        return true;
      });
    }

    // 5. Time of Day / Hour filter
    if (timeMode === 'single') {
      filtered = filtered.filter((inc) => inc.time_of_day_hour === selectedHour);
    } else if (timeMode === 'shift') {
      if (activeShift === 'night') {
        filtered = filtered.filter((inc) => inc.time_of_day_hour >= 22 || inc.time_of_day_hour < 6);
      } else if (activeShift === 'morning') {
        filtered = filtered.filter((inc) => inc.time_of_day_hour >= 6 && inc.time_of_day_hour < 12);
      } else if (activeShift === 'afternoon') {
        filtered = filtered.filter((inc) => inc.time_of_day_hour >= 12 && inc.time_of_day_hour < 18);
      } else if (activeShift === 'evening') {
        filtered = filtered.filter((inc) => inc.time_of_day_hour >= 18 && inc.time_of_day_hour < 22);
      }
    }

    return filtered;
  };

  const currentFilteredIncidents = useMemo(filterIncidents, [
    incidents,
    selectedDistrict,
    selectedCategory,
    searchTerm,
    datePreset,
    customStartDate,
    customEndDate,
    timeMode,
    selectedHour,
    activeShift,
  ]);

  // Update map markers when filter variables change
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    const displayIncidents = currentFilteredIncidents.slice(0, 450);

    // Render Police Station markers
    POLICE_STATIONS.forEach((ps) => {
      if (selectedDistrict !== 'All Districts' && ps.district !== selectedDistrict) return;
      if (!isValidLatLng(ps.lat, ps.lng)) return;

      const stationIcon = L.divIcon({
        className: 'custom-station-icon',
        html: `
          <div class="relative group cursor-pointer">
            <div class="w-7 h-7 rounded-lg bg-[#0a0f1e] border-2 border-indigo-500 flex items-center justify-center text-indigo-400 font-bold text-xs shadow-lg shadow-indigo-950/80 hover:scale-110 transition">
              🏛️
            </div>
            <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0a0f1e]/90 text-indigo-300 text-[9px] px-1.5 py-0.5 rounded border border-indigo-500/30">
              ${ps.name.split(' ')[0]}
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([Number(ps.lat), Number(ps.lng)], { icon: stationIcon });
      marker.on('click', () => {
        setActiveDrawerItem({ type: 'station', data: ps });
      });
      layerGroup.addLayer(marker);
    });

    // Render Incident Points & Hotspots
    displayIncidents.forEach((inc) => {
      if (!isValidLatLng(inc.latitude, inc.longitude)) return;
      const lat = Number(inc.latitude);
      const lng = Number(inc.longitude);

      const isCritical = inc.severity === 'Critical' || inc.crime_category === 'Cybercrime';

      const colorMap: Record<CrimeCategory, string> = {
        Cybercrime: '#38bdf8', // Sky / Cyan
        Narcotics: '#c084fc', // Purple
        'Property Crime': '#f59e0b', // Amber
        'Violent Crime': '#f87171', // Red
        'Financial Fraud': '#818cf8', // Indigo
        'Organized Crime': '#fb923c', // Orange
        'Human Trafficking': '#f472b6', // Pink
      };

      const pointColor = colorMap[inc.crime_category] || '#94a3b8';

      const circle = L.circleMarker([lat, lng], {
        radius: isCritical ? 8 : 5,
        fillColor: pointColor,
        color: isCritical ? '#ffffff' : pointColor,
        weight: isCritical ? 2 : 1,
        opacity: 0.9,
        fillOpacity: 0.8,
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
  }, [currentFilteredIncidents, selectedDistrict]);

  return (
    <div className="relative w-full h-full flex flex-col bg-[#020617] overflow-hidden">
      {/* Top Filter Bar Overlay */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-3 bg-[#0a0f1e]/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 shadow-2xl">
        {/* District Selection Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none max-w-full">
          <span className="text-[10px] uppercase font-bold text-slate-400 mr-1 flex items-center gap-1 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            District:
          </span>

          <button
            onClick={() => onDistrictSelect('All Districts')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              selectedDistrict === 'All Districts'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-950/50'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
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
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-950/50'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {dist.name}
            </button>
          ))}
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search FIR / MO / Station..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#020617] border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-44"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#020617] border border-slate-800 rounded-lg px-2 py-1">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={selectedCategory}
              onChange={(e) => onCategorySelect(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All Categories" className="bg-[#0a0f1e] text-slate-200">
                All Categories
              </option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat} className="bg-[#0a0f1e] text-slate-200">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Spatiotemporal Control Panel (Bottom Floating Overlay) */}
      {!showTemporalPanel ? (
        <div className="absolute bottom-3 left-3 z-30 flex items-center justify-between gap-4 bg-[#0a0f1e]/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-800 shadow-2xl text-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Spatiotemporal Density Controller
                </span>
                <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-semibold">
                  {currentFilteredIncidents.length.toLocaleString()} Incidents
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Active Mode: <span className="text-indigo-400 font-mono font-bold">{timeMode === 'single' ? `${String(selectedHour).padStart(2, '0')}:00 HRS` : timeMode === 'shift' ? `${activeShift.toUpperCase()} Shift` : '24-Hour Overview'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowTemporalPanel(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition shadow-md shadow-indigo-950/50 shrink-0"
            title="Expand Spatiotemporal Density Controller"
          >
            <ChevronUp className="w-3.5 h-3.5" />
            <span>Expand Controller</span>
          </button>
        </div>
      ) : (
        <div className="absolute bottom-3 left-3 right-3 z-30 flex flex-col gap-2.5 bg-[#0a0f1e]/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-800 shadow-2xl text-slate-200">
          {/* Top Control Bar inside Panel */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Spatiotemporal Density Controller
                  </span>
                  <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-semibold">
                    {currentFilteredIncidents.length.toLocaleString()} Incidents Mapped
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Peak Density Hour: <span className="text-indigo-400 font-mono font-bold">{String(peakHour).padStart(2, '0')}:00 HRS</span> ({hourlyHistogram[peakHour]} incidents)
                </p>
              </div>
            </div>

            {/* Mode Switcher & Minimize Buttons */}
            <div className="flex items-center gap-2">
              {/* Time Mode Buttons */}
              <div className="flex items-center bg-[#020617] border border-slate-800 rounded-lg p-0.5">
                <button
                  onClick={() => setTimeMode('single')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition ${
                    timeMode === 'single'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Hourly Slider
                </button>
                <button
                  onClick={() => setTimeMode('shift')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition ${
                    timeMode === 'shift'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Shift Preset
                </button>
                <button
                  onClick={() => setTimeMode('all')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition ${
                    timeMode === 'all'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Full 24-Hrs
                </button>
              </div>

              {/* Date Preset Selector */}
              <div className="flex items-center gap-1.5 bg-[#020617] border border-slate-800 rounded-lg px-2 py-1 text-xs">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <select
                  value={datePreset}
                  onChange={(e) => setDatePreset(e.target.value as any)}
                  className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="all" className="bg-[#0a0f1e]">All Date Records</option>
                  <option value="24h" className="bg-[#0a0f1e]">Last 24 Hours</option>
                  <option value="7d" className="bg-[#0a0f1e]">Last 7 Days</option>
                  <option value="30d" className="bg-[#0a0f1e]">Last 30 Days</option>
                  <option value="custom" className="bg-[#0a0f1e]">Custom Date Range</option>
                </select>
              </div>

              {/* Minimize Button */}
              <button
                onClick={() => setShowTemporalPanel(false)}
                className="p-1.5 bg-[#020617] hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-lg transition flex items-center gap-1 text-[11px] font-semibold ml-1 shrink-0"
                title="Minimize Spatiotemporal Density Controller"
              >
                <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Minimize</span>
              </button>
            </div>
          </div>

        {/* Custom Date Range Picker Input */}
        {datePreset === 'custom' && (
          <div className="flex items-center gap-3 bg-[#020617] p-2 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 text-[11px]">Filter Date Range:</span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="bg-[#0a0f1e] border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <span className="text-slate-500">to</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="bg-[#0a0f1e] border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            {(customStartDate || customEndDate) && (
              <button
                onClick={() => {
                  setCustomStartDate('');
                  setCustomEndDate('');
                }}
                className="text-xs text-indigo-400 hover:underline"
              >
                Clear Range
              </button>
            )}
          </div>
        )}

        {/* Shift Presets Bar */}
        {timeMode === 'shift' && (
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold shrink-0">Select Shift Window:</span>
            <button
              onClick={() => setActiveShift('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activeShift === 'all'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-[#020617] text-slate-300 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              All Shifts
            </button>
            <button
              onClick={() => setActiveShift('night')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activeShift === 'night'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#020617] text-slate-300 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              🌙 Night Shift (22:00 - 06:00)
            </button>
            <button
              onClick={() => setActiveShift('morning')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activeShift === 'morning'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#020617] text-slate-300 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              🌅 Morning Shift (06:00 - 12:00)
            </button>
            <button
              onClick={() => setActiveShift('afternoon')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activeShift === 'afternoon'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#020617] text-slate-300 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              ☀️ Afternoon Shift (12:00 - 18:00)
            </button>
            <button
              onClick={() => setActiveShift('evening')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                activeShift === 'evening'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#020617] text-slate-300 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              🌆 Evening Peak (18:00 - 22:00)
            </button>
          </div>
        )}

        {/* 24-Hour Incident Volume Histogram Bar Chart */}
        {timeMode === 'single' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1 text-slate-300 font-bold">
                <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
                Hourly Crime Volume Distribution (00:00 - 23:00 HRS)
              </span>
              <span>
                Active Hour: <strong className="text-indigo-300 font-bold text-xs">{String(selectedHour).padStart(2, '0')}:00 HRS</strong> ({hourlyHistogram[selectedHour]} incidents)
              </span>
            </div>

            {/* Histogram Bars */}
            <div className="h-12 bg-[#020617] p-1.5 rounded-xl border border-slate-800 flex items-end gap-1 relative">
              {hourlyHistogram.map((count, hr) => {
                const heightPct = Math.max((count / maxHourlyCount) * 100, 8);
                const isSelected = selectedHour === hr;
                const isPeak = hr === peakHour;

                return (
                  <div
                    key={hr}
                    onClick={() => {
                      setSelectedHour(hr);
                      setTimeMode('single');
                    }}
                    title={`Hour ${String(hr).padStart(2, '0')}:00 - ${count} incidents`}
                    className="flex-1 h-full flex flex-col justify-end items-center cursor-pointer group relative"
                  >
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t transition-all duration-200 ${
                        isSelected
                          ? 'bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]'
                          : isPeak
                          ? 'bg-amber-500/80 hover:bg-amber-400'
                          : 'bg-slate-700/60 group-hover:bg-indigo-400/50'
                      }`}
                    />
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-7 z-50 bg-[#0a0f1e] text-[9px] text-indigo-300 border border-slate-700 px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap">
                      {String(hr).padStart(2, '0')}:00 ({count})
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Slider Track with Play/Pause Animation Controller */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-2 rounded-xl flex items-center justify-center text-xs font-bold transition ${
                  isPlaying
                    ? 'bg-red-500 text-white shadow-lg shadow-red-950/50'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950/50'
                }`}
                title={isPlaying ? 'Pause Simulation' : 'Play 24-Hour Simulation'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <div className="flex-1 flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-mono">00:00</span>
                <input
                  type="range"
                  min="0"
                  max="23"
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <span className="text-[10px] text-slate-500 font-mono">23:00</span>
              </div>

              {/* Playback speed selector */}
              <div className="flex items-center gap-1 text-[10px] bg-[#020617] border border-slate-800 px-2 py-1 rounded-lg">
                <FastForward className="w-3 h-3 text-indigo-400" />
                <button
                  onClick={() => setPlaySpeedMs(1500)}
                  className={`px-1 rounded ${playSpeedMs === 1500 ? 'text-indigo-400 font-bold' : 'text-slate-500'}`}
                >
                  1x
                </button>
                <button
                  onClick={() => setPlaySpeedMs(750)}
                  className={`px-1 rounded ${playSpeedMs === 750 ? 'text-indigo-400 font-bold' : 'text-slate-500'}`}
                >
                  2x
                </button>
                <button
                  onClick={() => setPlaySpeedMs(300)}
                  className={`px-1 rounded ${playSpeedMs === 300 ? 'text-indigo-400 font-bold' : 'text-slate-500'}`}
                >
                  5x
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category Color Legend */}
        <div className="flex items-center justify-between text-[10px] border-t border-slate-800/80 pt-2 text-slate-400">
          <div className="flex items-center gap-3 overflow-x-auto py-0.5 scrollbar-none">
            <span className="flex items-center gap-1 text-sky-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span> Cyber
            </span>
            <span className="flex items-center gap-1 text-purple-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span> Narcotics
            </span>
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> Property
            </span>
            <span className="flex items-center gap-1 text-red-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-red-400"></span> Violent
            </span>
            <span className="flex items-center gap-1 text-indigo-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span> Financial
            </span>
          </div>

          <div className="text-[10px] text-slate-500 hidden md:block">
            CartoDB GIS Vector Map Engine | State Telemetry Synced
          </div>
        </div>
      </div>
    )}

      {/* Slide-over Detail Drawer when clicking Marker */}
      {activeDrawerItem && (
        <div className="absolute right-4 top-20 bottom-24 z-40 w-80 bg-[#0a0f1e] border border-slate-800 rounded-2xl shadow-2xl p-4 flex flex-col justify-between animate-in slide-in-from-right duration-200">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
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

                <div className="grid grid-cols-2 gap-2 bg-[#020617] p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Category</span>
                    <span className="font-semibold text-sky-300">{activeDrawerItem.data.crime_category}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Severity</span>
                    <span className="font-semibold text-red-400">{activeDrawerItem.data.severity}</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 font-mono">MODUS OPERANDI (MO)</div>
                  <div className="p-2.5 bg-[#020617] rounded-xl border border-slate-800 text-slate-200 leading-relaxed">
                    {activeDrawerItem.data.modus_operandi}
                  </div>
                </div>

                <div className="space-y-1 text-slate-400">
                  <div>📍 Jurisdiction: {activeDrawerItem.data.police_station}, {activeDrawerItem.data.district}</div>
                  <div>🕒 Time Window: {String(activeDrawerItem.data.time_of_day_hour).padStart(2, '0')}:00 HRS ({new Date(activeDrawerItem.data.timestamp).toLocaleDateString()})</div>
                  {activeDrawerItem.data.loss_amount_inr > 0 && (
                    <div className="text-emerald-400 font-semibold">
                      💰 Financial Loss: ₹{(activeDrawerItem.data.loss_amount_inr / 100000).toFixed(2)} Lakhs
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Station Drawer Body */}
            {activeDrawerItem.type === 'station' && (
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="font-bold text-slate-100 text-sm">{activeDrawerItem.data.name}</div>
                    <div className="text-[10px] text-slate-400">{activeDrawerItem.data.district}</div>
                  </div>
                </div>

                <div className="space-y-2 bg-[#020617] p-3 rounded-xl border border-slate-800">
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
                    <span className="font-bold text-indigo-400">{activeDrawerItem.data.active_incidents_count}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Alert Drawer Body */}
            {activeDrawerItem.type === 'alert' && (
              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200">
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
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-xl text-xs transition shadow-lg shadow-indigo-950/50"
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
