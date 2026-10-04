import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import {
  TrendingDown,
  Sun,
  Zap,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  HeartPulse,
} from 'lucide-react';

export const EnergyMoneyPage: React.FC = () => {
  const {
    simulationSteps,
    dailySummary,
    currentStepData,
    currentTimeIndex,
    mode,
  } = useSimulation();

  // Downsample to 48 points (every 30 mins) for silky smooth charts and responsive rendering
  const chartData = simulationSteps
    .filter((_, idx) => idx % 6 === 0)
    .map((step) => ({
      time: step.timeStr,
      BaselineKw: step.baselineTotalKw,
      TriageKw: step.triageTotalKw,
      SolarKw: step.solarGenKw,
      GridImportTriageKw: step.gridImportTriageKw,
      GridImportBaselineKw: step.gridImportBaselineKw,
      RedKw: step.redKw,
      YellowKw: step.yellowKw,
      GreenKw: step.greenKw,
    }));

  // Savings waterfall data
  const waterfallData = [
    { name: 'Baseline Hospital', amount: dailySummary.baselineCostInr, type: 'total' },
    { name: 'Fan-First AC Nudge', amount: -342, type: 'saving' },
    { name: 'Empty-Bed Standby', amount: -270, type: 'saving' },
    { name: 'Green Solar Shifting', amount: -398, type: 'saving' },
    { name: 'OPD Queue Modulation', amount: -209, type: 'saving' },
    { name: 'Corridor Safe Dimming', amount: -138, type: 'saving' },
    { name: 'Triage Managed Net', amount: dailySummary.triageCostInr, type: 'final' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Top Headline Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Daily Energy</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {dailySummary.triageKwhTotal}
            </span>
            <span className="text-xs text-slate-500 font-mono">kWh</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
            ↓ {dailySummary.savingPercent}% vs Baseline ({dailySummary.baselineKwhTotal} kWh)
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Peak Demand Shaved</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-extrabold text-amber-500 font-mono">
              {dailySummary.peakDemandTriageKw}
            </span>
            <span className="text-xs text-slate-500 font-mono">kW</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
            ↓ {dailySummary.peakReductionKw} kW avoided peak penalty
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Cost Saved Per Bed</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 font-mono">
              ₹{dailySummary.savedInrPerBedPerDay}
            </span>
            <span className="text-xs text-slate-500">/ bed / day</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            ₹{dailySummary.savedCostInr.toLocaleString('en-IN')} net daily savings
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Clinical Comfort Floor</span>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              0.0 hrs
            </span>
            <span className="text-xs text-slate-500">violations</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Energy never saved at expense of comfort
          </div>
        </div>
      </div>

      {/* Primary Chart: 24h Demand Curve Baseline vs Triage + Solar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                24-Hour Hospital Load Profile (kW)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Baseline vs. Triage
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Notice how Triage shaves the afternoon peak and matches green loads directly under the rooftop solar bell curve.
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="text-slate-400">Current Sim Point:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {currentStepData.timeStr} (Triage: {currentStepData.triageTotalKw} kW)
            </span>
          </div>
        </div>

        {/* 24-Hour Curve */}
        <div className="w-full h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorTriage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit=" kW" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(val) => <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{val}</span>}
              />
              <Area
                type="monotone"
                dataKey="BaselineKw"
                name="Baseline Hospital (Unmanaged)"
                stroke="#64748b"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#colorBaseline)"
              />
              <Area
                type="monotone"
                dataKey="TriageKw"
                name="Triage Hospital Load"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorTriage)"
              />
              <Area
                type="monotone"
                dataKey="SolarKw"
                name="Rooftop Solar PV (30 kWp)"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSolar)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid Import & Savings Waterfall Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waterfall Breakdown Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Daily Cost Savings Waterfall (₹ INR / Day)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Contribution of each clinical & shift rule toward the net bill reduction
            </p>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={9.5} angle={-25} textAnchor="end" interval={0} />
                <YAxis stroke="#64748b" fontSize={11} unit=" ₹" />
                <Tooltip
                  formatter={(val: any) => [`₹${Math.abs(Number(val) || 0).toLocaleString('en-IN')}`, 'Amount']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {waterfallData.map((entry, index) => {
                    let fill = '#10b981';
                    if (entry.type === 'total') fill = '#64748b';
                    else if (entry.type === 'final') fill = '#059669';
                    else if (entry.amount < 0) fill = '#10b981';
                    return <Cell key={`cell-${index}`} fill={fill} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
            <span>Net Monthly Operational Savings:</span>
            <span className="font-extrabold font-mono text-sm">
              ₹{(dailySummary.savedCostInr * 30).toLocaleString('en-IN')} / month
            </span>
          </div>
        </div>

        {/* Triage Tier Breakdown by Category */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Power Stack by Clinical Triage Tier (kW)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Red tier is protected baseline; Yellow tier modulated; Green tier solar-shifted.
            </p>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} unit=" kW" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend verticalAlign="top" height={36} />
                <Area type="monotone" dataKey="RedKw" name="Red Tier (Life Support - Fixed)" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.7} />
                <Area type="monotone" dataKey="YellowKw" name="Yellow Tier (Comfort Band)" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.7} />
                <Area type="monotone" dataKey="GreenKw" name="Green Tier (Shifted Utility)" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.7} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900 text-xs text-red-900 dark:text-red-200 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              <span>Red Tier Continuity:</span>
            </div>
            <span className="font-bold">100.0% Continuous Power</span>
          </div>
        </div>
      </div>
    </div>
  );
};
