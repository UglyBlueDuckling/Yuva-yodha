import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingDown,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  HeartPulse,
  Play,
  ArrowRight,
  BatteryCharging,
  Cpu,
  Layers,
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const {
    startGuidedDemo,
    dailySummary,
    currentStepData,
    mode,
    setMode,
    setActiveTab,
  } = useSimulation();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Hero Pitch Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-8 lg:p-10 text-white shadow-xl border border-slate-700/50">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Healthcare-Specific Energy Retrofit</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Clinical Criticality Energy Kit for 50-Bed Indian Hospitals
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Indian nursing homes spend ₹1.2–₹2.5 Lakhs every month on electricity, yet standard BMS solutions are rejected because doctors fear accidental cutoffs to ICU ventilators and vaccine cold chains. <strong>Triage borrows emergency triage classification</strong>: RED life-support loads are monitored only via CT sensors with zero switching relays. Comfort loads (Yellow) and shiftable utilities (Green) deliver rapid 22–26% energy savings.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={startGuidedDemo}
              className="flex items-center space-x-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Start 90-Second Guided Demo</span>
            </button>

            <button
              onClick={() => setActiveTab('twin')}
              className="flex items-center space-x-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/15 transition-all cursor-pointer"
            >
              <span>Explore Live Digital Twin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* THREE HEADLINE KPIS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* KPI 1 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 transition group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              24-Hour Energy Reduction
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
              {dailySummary.savingPercent}%
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {dailySummary.savedKwhTotal} kWh / day
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Saves ₹{dailySummary.savedCostInr.toLocaleString('en-IN')} daily (₹{(dailySummary.savedCostInr * 365).toLocaleString('en-IN')} / year) by nudging yellow ACs and aligning green loads with rooftop solar.
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 transition group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Unit Economics
            </span>
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
              ₹{dailySummary.savedInrPerBedPerDay}
            </span>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
              Saved / Bed / Day
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Direct margin boost for the hospital. For a 50-bed facility, this recovers the entire ₹2.85 Lakh kit investment in under 9.5 months.
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-red-500/50 transition group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Clinical Safety & Comfort
            </span>
            <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
              100%
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Clinical Lockout
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Zero interruptions to OT laminar air, ICU life-support, or vaccine cold rooms. Comfort violations in yellow wards: {dailySummary.comfortViolationHoursYellow} hours.
          </p>
        </div>
      </div>

      {/* CORE TRIAGE TAXONOMY */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              The 3-Tier Clinical Criticality Framework
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              How non-invasive clip-on current sensors and bypass contactors secure trust with Chief Medical Officers
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500">Currently Simulating:</span>
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {mode === 'triage' ? 'Triage Energy Management' : 'Unmanaged Baseline'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* RED CARD */}
          <div className="rounded-xl p-5 bg-red-50/60 dark:bg-red-950/20 border-2 border-red-500/40 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 text-xs font-extrabold rounded-md bg-red-500 text-white tracking-wider">
                RED TIER
              </span>
              <span className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase">
                MONITORED ONLY
              </span>
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Critical Life Support & Infection Control
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Operating Theatre AHU, surgical gas scavengers, ICU multiparameter monitors, vaccine ILR refrigerators (2–8°C).
            </p>
            <div className="mt-4 pt-3 border-t border-red-200 dark:border-red-900/60 space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
              <div className="flex items-center space-x-1.5 font-semibold text-red-700 dark:text-red-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Zero control relays installed</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-400">
                <span>• Live draw: {currentStepData.redKw} kW</span>
              </div>
            </div>
          </div>

          {/* YELLOW CARD */}
          <div className="rounded-xl p-5 bg-amber-50/60 dark:bg-amber-950/20 border-2 border-amber-500/40 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 text-xs font-extrabold rounded-md bg-amber-500 text-white tracking-wider">
                YELLOW TIER
              </span>
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase">
                SAFE BAND CONTROL
              </span>
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Patient Comfort & Inpatient Recovery
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              General Wards A & B, OPD Waiting Hall, Stretcher Corridors, Billing & Administration office ACs.
            </p>
            <div className="mt-4 pt-3 border-t border-amber-200 dark:border-amber-900/60 space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
              <div className="flex items-center space-x-1.5 font-semibold text-amber-700 dark:text-amber-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Fan-first cooling nudge (+1°C)</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-400">
                <span>• Live draw: {currentStepData.yellowKw} kW</span>
              </div>
            </div>
          </div>

          {/* GREEN CARD */}
          <div className="rounded-xl p-5 bg-emerald-50/60 dark:bg-emerald-950/20 border-2 border-emerald-500/40 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 text-xs font-extrabold rounded-md bg-emerald-500 text-white tracking-wider">
                GREEN TIER
              </span>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                TIME SHIFTABLE
              </span>
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Flexible Hospital Infrastructure
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              5 HP overhead raw water tank pump, heavy linen wash & hydro-extractor, autoclave boiler pre-heating element.
            </p>
            <div className="mt-4 pt-3 border-t border-emerald-200 dark:border-emerald-900/60 space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
              <div className="flex items-center space-x-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Runs under rooftop solar generation</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-400">
                <span>• Live draw: {currentStepData.greenKw} kW</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK COMPARISON SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Retrofit Hardware Architecture
              </h4>
              <p className="text-xs text-slate-500">Fast 4-hour installation during hospital lull</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start space-x-3">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">01</span>
              <div>
                <strong>Non-Invasive Clip-On CT Sensors:</strong> Snapped directly over feeder cables without disconnecting wires or disrupting surgeries.
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start space-x-3">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">02</span>
              <div>
                <strong>Normally-Closed (NC) Bypass Relays:</strong> De-energized state connects loads directly to grid lines. If controller fails, everything reverts to 100% baseline.
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start space-x-3">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">03</span>
              <div>
                <strong>Edge Gateway with 4G LTE:</strong> Runs local deterministic thermal rules offline; reports telemetry to cloud dashboard and WhatsApp maintenance bots.
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
                <BatteryCharging className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Active Simulation Summary ({currentStepData.timeStr})
                </h4>
                <p className="text-xs text-slate-500">Live deterministic model outputs</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400">Rooftop Solar Gen</span>
                <div className="text-xl font-extrabold text-amber-500 font-mono mt-0.5">
                  {currentStepData.solarGenKw} kW
                </div>
                <span className="text-[10px] text-slate-500">30 kWp array</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400">Battery State</span>
                <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                  {currentStepData.batterySocPercent}%
                </div>
                <span className="text-[10px] text-slate-500">45 kWh LFP bank</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400">Outdoor Temperature</span>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">
                  {currentStepData.outdoorTemp}°C
                </div>
                <span className="text-[10px] text-slate-500">Diurnal heat peak</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-slate-400">Vaccine Safe Hours</span>
                <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400 font-mono mt-0.5">
                  {currentStepData.vaccineSafeHoursRemaining} hrs
                </div>
                <span className="text-[10px] text-slate-500">Cold chain reserve</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">Ready to examine the hospital layout?</span>
            <button
              onClick={() => setActiveTab('twin')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center space-x-1"
            >
              <span>View Floor Plan Digital Twin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
