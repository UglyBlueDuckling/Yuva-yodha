import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import {
  Lock,
  Check,
  Zap,
  Wind,
  Bed,
  Users,
  Moon,
  Sun,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const RulesEnginePage: React.FC = () => {
  const { rules, toggleRule, dailySummary } = useSimulation();

  const getRuleIcon = (id: string) => {
    switch (id) {
      case 'rule-empty-bed':
        return <Bed className="w-5 h-5 text-amber-500" />;
      case 'rule-fan-first':
        return <Wind className="w-5 h-5 text-teal-500" />;
      case 'rule-opd-queue':
        return <Users className="w-5 h-5 text-indigo-500" />;
      case 'rule-corridor-dimming':
        return <Moon className="w-5 h-5 text-purple-500" />;
      case 'rule-solar-shifting':
        return <Sun className="w-5 h-5 text-emerald-500" />;
      case 'rule-red-lockout':
      default:
        return <Lock className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Deterministic Rules Engine
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Plain-Language Clinician Approved Logic
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Every rule is transparent, deterministic, and backed by clinical comfort science. Toggle rules below to observe immediate recalculations in 24h demand curves.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Rule Savings</div>
            <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              ~{dailySummary.savedKwhTotal} kWh / day
            </div>
          </div>
          <div className="text-xs text-slate-500 border-l border-slate-200 dark:border-slate-700 pl-3">
            ₹{dailySummary.savedCostInr.toLocaleString('en-IN')} saved/day
          </div>
        </div>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rules.map((rule) => {
          const isRed = rule.tagApplied === 'RED';
          const isYellow = rule.tagApplied === 'YELLOW';
          const isGreen = rule.tagApplied === 'GREEN';

          return (
            <div
              key={rule.id}
              className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                isRed
                  ? 'bg-red-50/40 dark:bg-red-950/20 border-red-300 dark:border-red-900/60 shadow-xs'
                  : rule.enabled
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                  : 'bg-slate-50/60 dark:bg-slate-900/40 border-dashed border-slate-300 dark:border-slate-800 opacity-70'
              }`}
            >
              <div className="space-y-3">
                {/* Header with icon and tag badge */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2.5 rounded-xl ${
                        isRed
                          ? 'bg-red-100 dark:bg-red-950/80 text-red-600'
                          : isYellow
                          ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-600'
                          : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600'
                      }`}
                    >
                      {getRuleIcon(rule.id)}
                    </div>
                    <div>
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                          isRed
                            ? 'bg-red-500 text-white'
                            : isYellow
                            ? 'bg-amber-500 text-white'
                            : 'bg-emerald-500 text-white'
                        }`}
                      >
                        {rule.tagApplied} TIER
                      </span>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm mt-1 leading-snug">
                        {rule.name}
                      </h3>
                    </div>
                  </div>

                  {/* Toggle or Padlock */}
                  {rule.locked ? (
                    <div
                      className="p-2 rounded-xl bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 flex items-center space-x-1"
                      title="Locked by Clinical Protocol: Monitored only"
                    >
                      <Lock className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase">Locked</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => toggleRule(rule.id)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        rule.enabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                      role="switch"
                      aria-checked={rule.enabled}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          rule.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {rule.description}
                </p>

                {/* Clinical Boundary Guarantee */}
                <div
                  className={`p-3 rounded-xl border text-[11px] leading-normal ${
                    isRed
                      ? 'bg-red-100/60 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-900 dark:text-red-200 font-medium'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span className="font-bold text-slate-900 dark:text-slate-100 block mb-0.5">
                    Clinical Boundary Guarantee:
                  </span>
                  {rule.clinicalSafetyBoundary}
                </div>
              </div>

              {/* Bottom saving metric */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Estimated Impact</span>
                <span
                  className={`font-mono font-bold ${
                    rule.locked
                      ? 'text-red-600 dark:text-red-400'
                      : rule.enabled
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-400'
                  }`}
                >
                  {rule.locked
                    ? '0.0 kWh (Monitored Only)'
                    : rule.enabled
                    ? `~${rule.estSavingKwHPerDay} kWh / day`
                    : 'Bypassed (0 kWh)'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
