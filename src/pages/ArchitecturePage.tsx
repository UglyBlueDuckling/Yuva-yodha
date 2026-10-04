import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import {
  Zap,
  GitFork,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  IndianRupee,
  Share2,
  Server,
  Smartphone,
  Info,
} from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'energy' | 'data' | 'money'>('energy');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              End-to-End System Architecture
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Hardware, Data & Commercial Flows
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Explore the physical electrical isolation, real-time edge computing pipeline, and recurring revenue business model designed for Indian healthcare.
          </p>
        </div>

        {/* Tab switch between 3 flows */}
        <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('energy')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === 'energy'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            1. Energy Flow
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === 'data'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            2. Data & IoT Flow
          </button>
          <button
            onClick={() => setActiveTab('money')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === 'money'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            3. Money Flow
          </button>
        </div>
      </div>

      {/* SVG Canvas Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md">
        {activeTab === 'energy' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-bold text-slate-900 dark:text-white">
                Physical Energy Distribution & Circuit Isolation Schematic
              </span>
              <span className="text-slate-500 font-mono">
                Red: Monitored only • Yellow: NC Contactors • Green: Time-shifted
              </span>
            </div>

            <div className="w-full aspect-[16/9] min-h-[380px] max-h-[520px]">
              <svg viewBox="0 0 940 500" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
                {/* Sources: Grid, Solar, Battery */}
                {/* 1. Grid */}
                <rect x="40" y="50" width="160" height="90" rx="12" fill="#f8fafc" stroke="#64748b" strokeWidth="2" className="dark:fill-slate-800" />
                <text x="120" y="85" textAnchor="middle" className="font-bold text-[13px] fill-slate-900 dark:fill-white">State Grid Feeder</text>
                <text x="120" y="105" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">11 kV / 415 V Transformer</text>
                <text x="120" y="125" textAnchor="middle" className="text-[10px] fill-emerald-600 font-bold">Commercial Tariff ₹9.50</text>

                {/* 2. Solar PV */}
                <rect x="40" y="180" width="160" height="90" rx="12" fill="#fffbeb" stroke="#f59e0b" strokeWidth="2" className="dark:fill-slate-800" />
                <text x="120" y="215" textAnchor="middle" className="font-bold text-[13px] fill-amber-600">Rooftop Solar PV</text>
                <text x="120" y="235" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">30 kWp Bi-facial Array</text>
                <text x="120" y="255" textAnchor="middle" className="text-[10px] fill-amber-500 font-bold">Zero Fuel Cost</text>

                {/* 3. Battery Storage */}
                <rect x="40" y="310" width="160" height="90" rx="12" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" className="dark:fill-slate-800" />
                <text x="120" y="345" textAnchor="middle" className="font-bold text-[13px] fill-emerald-600">LFP Battery Storage</text>
                <text x="120" y="365" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">45 kWh Energy Buffer</text>
                <text x="120" y="385" textAnchor="middle" className="text-[10px] fill-emerald-500 font-bold">Peak Shaving & Backup</text>

                {/* Main Hospital LT Panel Busbar */}
                <rect x="290" y="50" width="140" height="350" rx="16" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                <text x="360" y="85" textAnchor="middle" className="font-extrabold text-[12px] fill-white uppercase tracking-wider">Hospital Main</text>
                <text x="360" y="105" textAnchor="middle" className="font-extrabold text-[12px] fill-emerald-400 uppercase tracking-wider">LT Switchboard</text>
                <text x="360" y="130" textAnchor="middle" className="text-[9px] fill-slate-400">Copper Busbar 400A</text>
                <line x1="310" y1="145" x2="410" y2="145" stroke="#475569" strokeWidth="1" />
                <text x="360" y="220" textAnchor="middle" className="text-[10px] fill-slate-300 font-bold">Non-Invasive CTs</text>
                <text x="360" y="240" textAnchor="middle" className="text-[9px] fill-slate-400">Snapped on all feeders</text>
                <line x1="310" y1="260" x2="410" y2="260" stroke="#475569" strokeWidth="1" />
                <text x="360" y="330" textAnchor="middle" className="text-[10px] fill-emerald-300 font-bold">Auto Transfer</text>
                <text x="360" y="350" textAnchor="middle" className="text-[9px] fill-slate-400">&lt;15ms Transfer Time</text>

                {/* Arrows from Sources to Main Busbar */}
                <path d="M 200 95 L 290 95" stroke="#64748b" strokeWidth="3" markerEnd="url(#arrow)" />
                <path d="M 200 225 L 290 225" stroke="#f59e0b" strokeWidth="3" />
                <path d="M 200 355 L 290 355" stroke="#10b981" strokeWidth="3" />

                {/* Three Triage Circuits Distribution */}
                {/* RED TIER */}
                <path d="M 430 110 L 580 110" stroke="#ef4444" strokeWidth="4" />
                <rect x="580" y="60" width="310" height="100" rx="12" fill="#fef2f2" stroke="#ef4444" strokeWidth="2.5" className="dark:fill-slate-800" />
                <text x="735" y="90" textAnchor="middle" className="font-extrabold text-[13px] fill-red-600">RED CIRCUIT (PHYSICALLY ISOLATED)</text>
                <text x="735" y="110" textAnchor="middle" className="text-[11px] fill-slate-700 dark:fill-slate-300 font-medium">OT Complex • ICU • Vaccine Cold Chain • Emergency</text>
                <text x="735" y="130" textAnchor="middle" className="text-[10px] fill-red-700 dark:fill-red-400 font-bold">NO CONTACTORS • DIRECT BUSBAR WIRE • MONITORED ONLY</text>

                {/* YELLOW TIER */}
                <path d="M 430 225 L 520 225 L 520 225 L 580 225" stroke="#f59e0b" strokeWidth="3" />
                <rect x="580" y="180" width="310" height="100" rx="12" fill="#fffbeb" stroke="#f59e0b" strokeWidth="2" className="dark:fill-slate-800" />
                <text x="735" y="210" textAnchor="middle" className="font-extrabold text-[13px] fill-amber-600">YELLOW CIRCUIT (SAFE-BAND CONTROL)</text>
                <text x="735" y="230" textAnchor="middle" className="text-[11px] fill-slate-700 dark:fill-slate-300 font-medium">General Wards A & B • OPD Hall • Corridors • Admin</text>
                <text x="735" y="250" textAnchor="middle" className="text-[10px] fill-amber-700 dark:fill-amber-400 font-bold">NORMALLY-CLOSED (NC) CONTACTORS • REVERTS ON POWER LOSS</text>

                {/* GREEN TIER */}
                <path d="M 430 355 L 580 355" stroke="#10b981" strokeWidth="3" />
                <rect x="580" y="300" width="310" height="100" rx="12" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" className="dark:fill-slate-800" />
                <text x="735" y="330" textAnchor="middle" className="font-extrabold text-[13px] fill-emerald-600">GREEN CIRCUIT (TIME-SHIFTABLE UTILITY)</text>
                <text x="735" y="350" textAnchor="middle" className="text-[11px] fill-slate-700 dark:fill-slate-300 font-medium">Water Tank 5 HP Pump • Linen Laundry • Autoclave Boiler</text>
                <text x="735" y="370" textAnchor="middle" className="text-[10px] fill-emerald-700 dark:fill-emerald-400 font-bold">SMART VFD / RELAYS • RUNS UNDER MID-DAY SOLAR PEAK</text>
              </svg>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-bold text-slate-900 dark:text-white">
                Real-Time Edge-to-Cloud & WhatsApp Alert Data Pipeline
              </span>
              <span className="text-slate-500 font-mono">
                Modbus RTU / RS485 • Local Deterministic Engine • 4G LTE
              </span>
            </div>

            <div className="w-full aspect-[16/9] min-h-[380px] max-h-[520px]">
              <svg viewBox="0 0 940 480" className="w-full h-full select-none" preserveAspectRatio="xMidYMid meet">
                {/* 1. Sensors */}
                <rect x="40" y="100" width="180" height="280" rx="14" fill="#f8fafc" stroke="#64748b" strokeWidth="2" className="dark:fill-slate-800" />
                <text x="130" y="130" textAnchor="middle" className="font-bold text-[13px] fill-slate-900 dark:fill-white">Non-Invasive Sensors</text>
                <text x="130" y="150" textAnchor="middle" className="text-[10px] fill-slate-500">Sub-Second Sampling</text>
                <line x1="60" y1="165" x2="200" y2="165" stroke="#cbd5e1" strokeWidth="1" />
                <text x="130" y="195" textAnchor="middle" className="text-[11px] font-semibold fill-slate-700 dark:fill-slate-300">• 24x Clip-on CTs</text>
                <text x="130" y="225" textAnchor="middle" className="text-[11px] font-semibold fill-slate-700 dark:fill-slate-300">• Modbus Energy Meters</text>
                <text x="130" y="255" textAnchor="middle" className="text-[11px] font-semibold fill-slate-700 dark:fill-slate-300">• Zone Thermistors (PT100)</text>
                <text x="130" y="285" textAnchor="middle" className="text-[11px] font-semibold fill-slate-700 dark:fill-slate-300">• Ultrasonic Tank Sensor</text>
                <text x="130" y="315" textAnchor="middle" className="text-[11px] font-semibold fill-slate-700 dark:fill-slate-300">• Solar Inverter RS485</text>

                {/* Arrow to Gateway */}
                <path d="M 220 240 L 320 240" stroke="#059669" strokeWidth="3" strokeDasharray="5 5" />
                <text x="270" y="230" textAnchor="middle" className="text-[10px] fill-emerald-600 font-mono">RS485 Bus</text>

                {/* 2. Edge Gateway */}
                <rect x="320" y="80" width="220" height="320" rx="16" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
                <text x="430" y="115" textAnchor="middle" className="font-extrabold text-[14px] fill-white">Triage Edge Gateway</text>
                <text x="430" y="135" textAnchor="middle" className="text-[10px] fill-emerald-400 font-mono">DIN-Rail Linux Controller</text>
                <line x1="340" y1="150" x2="520" y2="150" stroke="#334155" strokeWidth="1" />
                <text x="430" y="180" textAnchor="middle" className="text-[11px] fill-slate-300 font-bold">Deterministic Engine</text>
                <text x="430" y="200" textAnchor="middle" className="text-[10px] fill-slate-400">Offline Autonomous Logic</text>
                <text x="430" y="230" textAnchor="middle" className="text-[11px] fill-red-400 font-bold">Hardwired CT Red Lockout</text>
                <text x="430" y="250" textAnchor="middle" className="text-[10px] fill-slate-400">No Relays Wired on Life Support</text>
                <text x="430" y="280" textAnchor="middle" className="text-[11px] fill-emerald-300 font-bold">NC Contactor Control</text>
                <text x="430" y="300" textAnchor="middle" className="text-[10px] fill-slate-400">Fail-Safe Hardware Watchdog</text>
                <text x="430" y="340" textAnchor="middle" className="text-[10px] fill-slate-400 font-mono">Secure 4G LTE Uplink</text>

                {/* Arrow to Cloud */}
                <path d="M 540 240 L 640 240" stroke="#059669" strokeWidth="3" />
                <text x="590" y="230" textAnchor="middle" className="text-[10px] fill-emerald-600 font-mono">MQTT / TLS</text>

                {/* 3. Cloud & WhatsApp */}
                <rect x="640" y="90" width="260" height="140" rx="14" fill="#f8fafc" stroke="#3b82f6" strokeWidth="2" className="dark:fill-slate-800" />
                <text x="770" y="125" textAnchor="middle" className="font-bold text-[13px] fill-slate-900 dark:fill-white">Triage Cloud Dashboard</text>
                <text x="770" y="145" textAnchor="middle" className="text-[10px] fill-slate-500">Live Hospital Digital Twin</text>
                <text x="770" y="175" textAnchor="middle" className="text-[11px] fill-slate-700 dark:fill-slate-300 font-medium">Recharts Demand Curves • NABH Reports</text>
                <text x="770" y="195" textAnchor="middle" className="text-[11px] fill-blue-600 dark:fill-blue-400 font-bold">Immutable Audit Trail • CFO View</text>

                {/* WhatsApp Bot Box */}
                <rect x="640" y="260" width="260" height="140" rx="14" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" className="dark:fill-slate-800" />
                <text x="770" y="295" textAnchor="middle" className="font-bold text-[13px] fill-emerald-700 dark:fill-emerald-400">WhatsApp Alert Gateway</text>
                <text x="770" y="315" textAnchor="middle" className="text-[10px] fill-slate-500">Meta Business API / Twilio</text>
                <text x="770" y="345" textAnchor="middle" className="text-[11px] fill-slate-700 dark:fill-slate-300 font-medium">Filter Clog Warnings • AC Idle Quenches</text>
                <text x="770" y="365" textAnchor="middle" className="text-[11px] fill-emerald-600 font-bold">Instant Delivery to Maintenance Techs</text>
              </svg>
            </div>
          </div>
        )}

        {activeTab === 'money' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-bold text-slate-900 dark:text-white">
                Commercial Flywheel & Value Distribution
              </span>
              <span className="text-slate-500 font-mono">
                Hardware Capex + SaaS Telemetry Model
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 space-y-3">
                <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-600 text-white">
                  1. Hospital Owner & CFO
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Substantial Electricity Savings
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Saves ₹3.8 Lakhs annually on grid electricity. Recovers ₹2.85 Lakh kit investment in 9.5 months with zero risk to clinical operations.
                </p>
                <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  + ₹21 Saved / Bed / Day
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900 space-y-3">
                <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-teal-600 text-white">
                  2. Triage Solution Provider
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Hardware Margin + Recurring SaaS
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Hardware kit sale (₹2.85 Lakhs at ~40% gross margin) plus ₹18,000/year recurring cloud telemetry, WhatsApp maintenance bots, and warranty SLA.
                </p>
                <div className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
                  High LTV / CAC in Private Healthcare
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 space-y-3">
                <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-blue-600 text-white">
                  3. Indian Healthcare Grid
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Avoided Peaker Plant Emissions
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Shifts hospital daytime peak demand to rooftop solar generation; reduces local diesel generator runtime during frequent suburban power cuts.
                </p>
                <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                  ~32 Metric Tonnes CO₂ Abated / Yr
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
