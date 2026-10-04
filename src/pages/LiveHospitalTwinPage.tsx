import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import {
  Thermometer,
  Zap,
  Users,
  ShieldCheck,
  Lock,
  X,
  Sliders,
  CheckCircle2,
  ChevronRight,
  Maximize2,
  Activity,
  Layers,
} from 'lucide-react';
import { Zone, ElectricalLoad } from '../types';

export const LiveHospitalTwinPage: React.FC = () => {
  const {
    zones,
    loads,
    rules,
    currentStepData,
    selectedZoneId,
    setSelectedZoneId,
    mode,
  } = useSimulation();

  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);

  const selectedZone = zones.find((z) => z.id === selectedZoneId) || null;
  const selectedZoneLoads = loads.filter((l) => l.zoneId === selectedZoneId);
  const activeRulesForZone = rules.filter((r) => r.enabled && selectedZone && (
    (selectedZone.tag === 'RED' && r.tagApplied === 'RED') ||
    (selectedZone.tag === 'YELLOW' && r.tagApplied === 'YELLOW') ||
    (selectedZone.tag === 'GREEN' && r.tagApplied === 'GREEN')
  ));

  // Compute live power draw for a zone
  const getZoneLiveKw = (zone: Zone) => {
    const zoneLoads = loads.filter((l) => l.zoneId === zone.id);
    const sumRated = zoneLoads.reduce((acc, l) => acc + l.ratedKw, 0);
    // Estimated real-time fraction based on current step
    const fraction = mode === 'triage'
      ? (zone.tag === 'RED' ? 0.72 : zone.tag === 'YELLOW' ? 0.48 : (currentStepData.solarGenKw > 15 ? 0.85 : 0.1))
      : (zone.tag === 'RED' ? 0.72 : zone.tag === 'YELLOW' ? 0.78 : 0.65);
    return Math.round(sumRated * fraction * 10) / 10;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Top Banner & Legend */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Live Hospital Digital Twin
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Interactive 50-Bed Floor Plan
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Click any zone on the architectural floor plan below to inspect electrical circuits, live temperatures, and active control rules.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 ring-2 ring-red-200 dark:ring-red-950" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Red: Clinical Lockout</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-200 dark:ring-amber-950" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Yellow: Safe Band Control</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-950" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Green: Solar Shiftable</span>
          </div>
        </div>
      </div>

      {/* Main Floor Plan SVG Canvas */}
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg p-4 sm:p-6 overflow-hidden">
        {/* Architectural Grid Watermark */}
        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-25 pointer-events-none" />

        <div className="relative w-full aspect-[16/10] min-h-[460px] max-h-[620px]">
          <svg
            viewBox="0 0 920 560"
            className="w-full h-full select-none"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Outer Perimeter Wall */}
            <rect
              x="15"
              y="15"
              width="890"
              height="530"
              rx="16"
              fill="none"
              stroke="#64748b"
              strokeWidth="4"
              className="dark:stroke-slate-700"
            />

            {/* Hospital Main Entryway & Ramp */}
            <path
              d="M 400 545 L 520 545"
              stroke="#10b981"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <text
              x="460"
              y="535"
              textAnchor="middle"
              className="fill-emerald-600 dark:fill-emerald-400 font-bold text-[10px] uppercase tracking-wider"
            >
              Main Hospital Triage Entry & Ambulance Bay
            </text>

            {/* Render Each Zone */}
            {zones.map((zone) => {
              const { x, y, w, h } = zone.svgCoords;
              const isSelected = selectedZoneId === zone.id;
              const isHovered = hoveredZoneId === zone.id;
              const liveKw = getZoneLiveKw(zone);
              const liveTemp =
                mode === 'triage'
                  ? currentStepData.zoneTempsTriage[zone.id] || zone.targetTemp
                  : currentStepData.zoneTempsBaseline[zone.id] || zone.targetTemp;
              const liveOccupancy = currentStepData.zoneOccupancy[zone.id] || 0;

              // Color style depending on triage tag
              let fillColor = 'fill-emerald-50 dark:fill-emerald-950/20';
              let strokeColor = 'stroke-emerald-500';
              let badgeBg = 'bg-emerald-500';

              if (zone.tag === 'RED') {
                fillColor = isSelected
                  ? 'fill-red-100/90 dark:fill-red-950/60'
                  : 'fill-red-50/70 dark:fill-red-950/30';
                strokeColor = 'stroke-red-500';
                badgeBg = 'bg-red-500';
              } else if (zone.tag === 'YELLOW') {
                fillColor = isSelected
                  ? 'fill-amber-100/90 dark:fill-amber-950/60'
                  : 'fill-amber-50/70 dark:fill-amber-950/30';
                strokeColor = 'stroke-amber-500';
                badgeBg = 'bg-amber-500';
              } else {
                fillColor = isSelected
                  ? 'fill-emerald-100/90 dark:fill-emerald-950/60'
                  : 'fill-emerald-50/70 dark:fill-emerald-950/30';
                strokeColor = 'stroke-emerald-500';
                badgeBg = 'bg-emerald-500';
              }

              return (
                <g
                  key={zone.id}
                  className="cursor-pointer transition-all duration-200"
                  onClick={() => setSelectedZoneId(zone.id)}
                  onMouseEnter={() => setHoveredZoneId(zone.id)}
                  onMouseLeave={() => setHoveredZoneId(null)}
                >
                  {/* Zone Box */}
                  <rect
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    rx="12"
                    className={`${fillColor} ${strokeColor} transition-all`}
                    strokeWidth={isSelected ? '3.5' : isHovered ? '2.5' : '1.5'}
                    strokeDasharray={zone.tag === 'RED' ? 'none' : undefined}
                  />

                  {/* Header Strip inside SVG zone */}
                  <foreignObject x={x + 10} y={y + 8} width={w - 20} height={h - 16}>
                    <div className="h-full flex flex-col justify-between p-1">
                      <div>
                        {/* Title and Tag */}
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-extrabold text-[12px] sm:text-[13px] text-slate-900 dark:text-white leading-tight truncate">
                            {zone.name}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 text-[9px] font-extrabold text-white rounded-md shrink-0 ${badgeBg}`}
                          >
                            {zone.tag}
                          </span>
                        </div>

                        {/* Beds or occupancy */}
                        <div className="flex items-center space-x-2 text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                          {zone.beds && (
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {zone.beds} Beds
                            </span>
                          )}
                          <span>• {zone.areaSqM} m²</span>
                          {zone.tag === 'RED' && (
                            <span className="inline-flex items-center text-red-600 dark:text-red-400 font-bold">
                              <Lock className="w-2.5 h-2.5 mr-0.5 inline" /> Lock
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Live Metrics Row inside Zone */}
                      <div className="grid grid-cols-3 gap-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs p-1.5 rounded-lg border border-slate-200/80 dark:border-slate-800/80 shadow-2xs text-[10px]">
                        {/* Temp */}
                        <div className="flex items-center space-x-1">
                          <Thermometer className="w-3 h-3 text-rose-500 shrink-0" />
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                            {liveTemp}°C
                          </span>
                        </div>

                        {/* Power */}
                        <div className="flex items-center space-x-1">
                          <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                            {liveKw} kW
                          </span>
                        </div>

                        {/* Occupancy */}
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3 text-blue-500 shrink-0" />
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                            {liveOccupancy} pax
                          </span>
                        </div>
                      </div>
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Slide-Over Drawer for Selected Zone */}
      {selectedZone && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-slate-300 dark:border-slate-700 shadow-xl space-y-5 animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2.5 py-0.5 text-xs font-bold text-white rounded-md uppercase ${
                    selectedZone.tag === 'RED'
                      ? 'bg-red-500'
                      : selectedZone.tag === 'YELLOW'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                >
                  {selectedZone.tag} TIER ZONE
                </span>
                <span className="text-xs font-mono text-slate-400">
                  ID: {selectedZone.id}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {selectedZone.name}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {selectedZone.description}
              </p>
            </div>

            <button
              onClick={() => setSelectedZoneId(null)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Clinical Policy Notice */}
          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed ${
              selectedZone.tag === 'RED'
                ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-900 dark:text-red-200'
                : selectedZone.tag === 'YELLOW'
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200'
                : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
            }`}
          >
            <div className="font-bold uppercase tracking-wider mb-1 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Clinical Mandate & Permitted Actions:</span>
            </div>
            {selectedZone.clinicalNote}
          </div>

          {/* Zone Metrics Quick Glance */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400">Current Inside Temp</span>
              <div className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                {mode === 'triage'
                  ? currentStepData.zoneTempsTriage[selectedZone.id] || selectedZone.targetTemp
                  : currentStepData.zoneTempsBaseline[selectedZone.id] || selectedZone.targetTemp}°C
              </div>
              <span className="text-[10px] text-slate-500">
                Safe Band: {selectedZone.safeTempBand[0]}°C – {selectedZone.safeTempBand[1]}°C
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400">Target Setpoint</span>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                {selectedZone.targetTemp}°C
              </div>
              <span className="text-[10px] text-slate-500">
                {selectedZone.tag === 'RED' ? 'Fixed clinical setpoint' : 'Adaptive +1°C fan nudge'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400">Current Zone Power</span>
              <div className="text-lg font-bold text-amber-500 font-mono mt-0.5">
                {getZoneLiveKw(selectedZone)} kW
              </div>
              <span className="text-[10px] text-slate-500">
                {selectedZoneLoads.length} electrical sub-loads
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400">Live Occupancy</span>
              <div className="text-lg font-bold text-blue-500 font-mono mt-0.5">
                {currentStepData.zoneOccupancy[selectedZone.id] || 0} / {selectedZone.occupancyMax}
              </div>
              <span className="text-[10px] text-slate-500">
                {selectedZone.beds ? `${selectedZone.beds} patient beds` : 'Patients & medical staff'}
              </span>
            </div>
          </div>

          {/* Connected Electrical Loads Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Connected Electrical Loads & Contactor States
            </h4>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="px-3 py-2.5">Load Name</th>
                    <th className="px-3 py-2.5">Rated kW</th>
                    <th className="px-3 py-2.5">Category</th>
                    <th className="px-3 py-2.5">Sensor ID</th>
                    <th className="px-3 py-2.5">Bypass Architecture</th>
                    <th className="px-3 py-2.5">Triage Strategy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {selectedZoneLoads.map((load) => (
                    <tr key={load.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="px-3 py-2.5 font-semibold text-slate-900 dark:text-white">
                        {load.name}
                      </td>
                      <td className="px-3 py-2.5 font-mono font-medium">
                        {load.ratedKw} kW
                      </td>
                      <td className="px-3 py-2.5 text-slate-500">
                        {load.category}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        {load.ctSensorId}
                      </td>
                      <td className="px-3 py-2.5">
                        {load.bypassRelay === 'NONE' ? (
                          <span className="inline-flex items-center text-red-600 dark:text-red-400 font-bold text-[11px]">
                            <Lock className="w-3 h-3 mr-1" /> No Relay (Safe)
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> NC Contactor
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">
                        {load.triageStrategy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Rules on this Zone */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Active Control Rules Acting on This Zone
            </h4>

            {activeRulesForZone.length === 0 ? (
              <p className="text-xs text-slate-500">No active rules applied to this zone.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeRulesForZone.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">
                        {r.name}
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        Saves ~{r.estSavingKwHPerDay} kWh/d
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      {r.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
