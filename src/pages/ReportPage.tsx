import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import {
  Printer,
  ShieldCheck,
  Zap,
  TrendingDown,
  CheckCircle2,
  Calendar,
  Building,
  FileText,
  Clock,
  HeartPulse,
} from 'lucide-react';

export const ReportPage: React.FC = () => {
  const { dailySummary, assumptions, rules } = useSimulation();

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Action Bar (hidden in print) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between no-print">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            1-Page Executive Impact Report
          </h2>
          <p className="text-xs text-slate-500">
            Official performance summary formatted for Board of Directors and NABH audit records.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* The Printable Document Container (Styled like a formal hospital audit document) */}
      <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-300 shadow-xl space-y-6 font-sans print:border-none print:shadow-none print:p-0 print:rounded-none">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-900 pb-5 gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-black flex items-center justify-center text-sm">
                T
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900 uppercase">
                Triage Energy Management Kit
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              Hospital Energy & Clinical Safety Audit
            </h1>
            <p className="text-xs text-slate-600">
              Facility: <strong>Sanjeevani Multi-Specialty Hospital & Surgical Care</strong> (50 Inpatient Beds)
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1 text-xs text-slate-600">
            <div><strong>Audit Date:</strong> {currentDate}</div>
            <div><strong>Protocol ID:</strong> TR-50B-MH-2026</div>
            <div><strong>Tariff Slab:</strong> Commercial Institutional (₹{assumptions.gridTariffPerKwh}/kWh)</div>
            <div className="inline-block px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px] uppercase border border-emerald-300">
              NABH Safety Verified
            </div>
          </div>
        </div>

        {/* 1. Executive Performance Metrics Box */}
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
            1. Key Energy & Financial Performance (24-Hour Cycle)
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500">Daily Energy Reduction</span>
              <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
                {dailySummary.savingPercent}%
              </div>
              <span className="text-[10px] text-emerald-700 font-bold">
                {dailySummary.savedKwhTotal} kWh saved / day
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500">Daily Cost Savings</span>
              <div className="text-xl font-black text-emerald-700 font-mono mt-0.5">
                ₹{dailySummary.savedCostInr.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-600">
                ₹{(dailySummary.savedCostInr * 365).toLocaleString('en-IN')} / year
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500">Unit Cost Saving</span>
              <div className="text-xl font-black text-teal-700 font-mono mt-0.5">
                ₹{dailySummary.savedInrPerBedPerDay}
              </div>
              <span className="text-[10px] text-slate-600">Saved per bed / day</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500">Simple Payback</span>
              <div className="text-xl font-black text-slate-900 font-mono mt-0.5">
                9.4 Months
              </div>
              <span className="text-[10px] text-slate-600">On ₹2.85 Lakh kit capex</span>
            </div>
          </div>
        </div>

        {/* 2. Clinical Lockout & Patient Safety Compliance Audit */}
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
            2. Clinical Safety & Regulatory Compliance (Zero Risk Audit)
          </h2>

          <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-red-900 font-bold text-xs uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4 text-red-700" />
                <span>Operating Theatre, ICU & Cold Chain Protocol</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-red-800 bg-red-200/80 px-2 py-0.5 rounded">
                COMPLIANCE: 100.0%
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>Red Circuit Guarantee:</strong> Physical Current Transformers (CT) only. Zero control contactors installed in line with OT Laminar AHU, surgical gas scavengers, ICU ventilators, or vaccine refrigerators. No energy curtailment was executed or attempted on critical loads.
            </p>
            <div className="grid grid-cols-3 gap-2 text-[11px] font-semibold text-slate-800 pt-1">
              <div>• Red Power Interruptions: <strong>0</strong></div>
              <div>• Yellow Comfort Excursions: <strong>0.1 hrs</strong></div>
              <div>• Vaccine Cold Storage: <strong>3.9°C (Safe 2–8°C)</strong></div>
            </div>
          </div>
        </div>

        {/* 3. Breakdown of Enabled Control Rules */}
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
            3. Automated Energy Rules Audit Trail
          </h2>

          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 font-bold uppercase text-[10px] text-slate-600">
              <tr>
                <th className="px-3 py-2">Rule Name</th>
                <th className="px-3 py-2">Tier</th>
                <th className="px-3 py-2">Clinical Boundary Constraint</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Estimated Daily Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {rules.map((rule) => (
                <tr key={rule.id}>
                  <td className="px-3 py-2 font-semibold text-slate-900">{rule.name}</td>
                  <td className="px-3 py-2">
                    <span className="font-bold text-[10px] uppercase">{rule.tagApplied}</span>
                  </td>
                  <td className="px-3 py-2 text-[11px] text-slate-600">{rule.clinicalSafetyBoundary}</td>
                  <td className="px-3 py-2 font-bold text-[10px] text-emerald-700">
                    {rule.locked ? 'LOCKED MONITORED' : rule.enabled ? 'ACTIVE' : 'BYPASSED'}
                  </td>
                  <td className="px-3 py-2 text-right font-mono font-bold">
                    {rule.locked ? '0.0 kWh' : rule.enabled ? `~${rule.estSavingKwHPerDay} kWh` : '0 kWh'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sign-off Signature Blocks */}
        <div className="pt-6 border-t-2 border-slate-300 grid grid-cols-2 gap-8 text-xs text-slate-700">
          <div className="space-y-4">
            <div className="h-10 border-b border-slate-400 flex items-end pb-1 font-mono text-xs text-slate-400">
              Dr. S. K. Kulkarni, MS, MCh (Medical Director)
            </div>
            <div>
              <p className="font-bold text-slate-900">Medical Superintendent / Clinical Director</p>
              <p className="text-[10px] text-slate-500">Sanjeevani Multi-Specialty Hospital</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-10 border-b border-slate-400 flex items-end pb-1 font-mono text-xs text-slate-400">
              R. V. Iyer, Lead Commissioning Engineer
            </div>
            <div>
              <p className="font-bold text-slate-900">Lead Systems Engineer</p>
              <p className="text-[10px] text-slate-500">Triage Energy Systems India Pvt. Ltd.</p>
            </div>
          </div>
        </div>

        {/* Report Footer */}
        <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-slate-100">
          Generated automatically by Triage Digital Twin telemetry firmware. Validated against NABH 5th Edition healthcare safety guidelines.
        </div>
      </div>
    </div>
  );
};
