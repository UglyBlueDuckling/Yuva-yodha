import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import {
  ResponsiveContainer,
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
  Calculator,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  IndianRupee,
  Layers,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RoiCalculatorPage: React.FC = () => {
  const { assumptions, updateAssumptions, dailySummary } = useSimulation();

  // Editable ROI state
  const [beds, setBeds] = useState<number>(assumptions.numBeds || 50);
  const [tariff, setTariff] = useState<number>(assumptions.gridTariffPerKwh || 9.5);
  const [kitCost, setKitCost] = useState<number>(assumptions.kitCostInr || 285000);
  const [savingPercent, setSavingPercent] = useState<number>(22); // 22% expected
  const [annualMaintenance, setAnnualMaintenance] = useState<number>(18000);

  // Typical hospital baseline electricity consumption: ~18-22 kWh per bed per day
  const baselineKwhPerBedDay = 20.5;
  const totalDailyBaselineKwh = beds * baselineKwhPerBedDay;
  const annualBaselineKwh = totalDailyBaselineKwh * 365;
  const annualBaselineCostInr = annualBaselineKwh * tariff;

  // Annual savings
  const annualSavingsKwh = annualBaselineKwh * (savingPercent / 100);
  const grossAnnualSavingInr = annualSavingsKwh * tariff;
  const netAnnualSavingInr = grossAnnualSavingInr - annualMaintenance;

  // Payback in months
  const paybackMonths = Math.max(
    1,
    Math.round((kitCost / (netAnnualSavingInr / 12)) * 10) / 10
  );

  // 5-Year Cumulative Savings: (Net Annual * 5) - Kit Cost
  const fiveYearNetSavingsInr = Math.round(netAnnualSavingInr * 5 - kitCost);

  // Sensitivity comparison at Low, Medium, High savings
  const sensitivityData = [
    {
      scenario: 'Conservative (16%)',
      savingPercent: 16,
      paybackMonths: Math.round((kitCost / ((annualBaselineKwh * 0.16 * tariff - annualMaintenance) / 12)) * 10) / 10,
      fiveYearNetInr: Math.round((annualBaselineKwh * 0.16 * tariff - annualMaintenance) * 5 - kitCost),
    },
    {
      scenario: 'Expected Triage (22%)',
      savingPercent: 22,
      paybackMonths: paybackMonths,
      fiveYearNetInr: fiveYearNetSavingsInr,
    },
    {
      scenario: 'High Optimization (28%)',
      savingPercent: 28,
      paybackMonths: Math.round((kitCost / ((annualBaselineKwh * 0.28 * tariff - annualMaintenance) / 12)) * 10) / 10,
      fiveYearNetInr: Math.round((annualBaselineKwh * 0.28 * tariff - annualMaintenance) * 5 - kitCost),
    },
  ];

  const triggerCelebrate = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Hospital ROI & Payback Calculator
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              CFO & Hospital Director Financial Model
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Simulate investment payback across your facility’s specific bed count, grid electricity tariff, and retrofit kit expenses.
          </p>
        </div>

        <button
          onClick={triggerCelebrate}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-emerald-600/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Validate Investment Case</span>
        </button>
      </div>

      {/* Main Grid: Inputs Column & Key Output Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Facility & Financial Parameters
            </h3>
          </div>

          {/* Beds Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <label className="text-slate-700 dark:text-slate-300">Hospital Bed Count</label>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{beds} Beds</span>
            </div>
            <input
              type="range"
              min="15"
              max="150"
              step="5"
              value={beds}
              onChange={(e) => setBeds(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <span className="text-[10px] text-slate-400">Typical Indian nursing home: 30–75 beds</span>
          </div>

          {/* Electricity Tariff */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <label className="text-slate-700 dark:text-slate-300">Grid Commercial Tariff</label>
              <span className="font-mono font-bold text-slate-900 dark:text-white">₹{tariff} / kWh</span>
            </div>
            <input
              type="range"
              min="6.0"
              max="15.0"
              step="0.5"
              value={tariff}
              onChange={(e) => setTariff(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <span className="text-[10px] text-slate-400">DISCOM commercial hospital tariff slab</span>
          </div>

          {/* Kit Retrofit Cost */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <label className="text-slate-700 dark:text-slate-300">Total Installed Kit Cost</label>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                ₹{kitCost.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="150000"
              max="600000"
              step="15000"
              value={kitCost}
              onChange={(e) => setKitCost(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <span className="text-[10px] text-slate-400">Includes 24 CT sensors, 8 NC contactors, IoT gateway, commissioning</span>
          </div>

          {/* Expected Saving Percent */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <label className="text-slate-700 dark:text-slate-300">Expected Energy Reduction</label>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {savingPercent}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="35"
              step="1"
              value={savingPercent}
              onChange={(e) => setSavingPercent(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <span className="text-[10px] text-slate-400">Empirical benchmark: 21–25% in Indian hospitals</span>
          </div>

          {/* Annual Cloud & Maintenance */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <label className="text-slate-700 dark:text-slate-300">Annual Cloud Maintenance (SaaS)</label>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                ₹{annualMaintenance.toLocaleString('en-IN')} / yr
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="40000"
              step="2000"
              value={annualMaintenance}
              onChange={(e) => setAnnualMaintenance(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <span className="text-[10px] text-slate-400">Cellular 4G SIM, WhatsApp bot, predictive health alerts</span>
          </div>
        </div>

        {/* Right Output Dashboard (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 3 Main Output KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Payback Months */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center space-x-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Simple Payback</span>
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {paybackMonths}
                </span>
                <span className="text-xs font-semibold text-slate-500">Months</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Fully paid off before end of Year 1
              </p>
            </div>

            {/* Annual Net Savings */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center space-x-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                <IndianRupee className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Net Annual Saving</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                ₹{Math.round(netAnnualSavingInr / 1000)}k
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                ₹{Math.round(netAnnualSavingInr / 12).toLocaleString('en-IN')} saved every month
              </p>
            </div>

            {/* 5-Year Cumulative Net */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center space-x-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>5-Year Net Profit</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                ₹{Math.round(fiveYearNetSavingsInr / 100000 * 10) / 10} L
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Net gain after kit cost + 5y maintenance
              </p>
            </div>
          </div>

          {/* SENSITIVITY CHART */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  5-Year Net Profit Sensitivity Comparison
                </h4>
                <p className="text-xs text-slate-500">
                  Conservative (16%) vs Expected (22%) vs High Optimization (28%)
                </p>
              </div>
            </div>

            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sensitivityData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
                  <XAxis dataKey="scenario" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} unit=" ₹" />
                  <Tooltip
                    formatter={(val: any) => [`₹${(Number(val) || 0).toLocaleString('en-IN')}`, '5-Year Net Savings']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="fiveYearNetInr" radius={[6, 6, 0, 0]}>
                    <Cell fill="#64748b" />
                    <Cell fill="#10b981" />
                    <Cell fill="#059669" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              {sensitivityData.map((s) => (
                <div key={s.scenario} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-[10px] text-slate-400 block font-semibold">{s.scenario}</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-100 text-xs">
                    Payback: {s.paybackMonths} mo
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
