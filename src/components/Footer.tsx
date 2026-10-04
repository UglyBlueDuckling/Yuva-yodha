import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { ShieldCheck, HeartPulse, Sparkles, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  const { currentStepData, dailySummary, mode } = useSimulation();

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-2.5 transition-colors no-print">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <p className="font-medium text-slate-700 dark:text-slate-300">
            Prototype simulation for demonstration. Figures are illustrative.
          </p>
          <span className="hidden md:inline text-slate-300 dark:text-slate-700">•</span>
          <span className="hidden md:inline">
            50-Bed Small Hospital & Nursing Home Retrofit
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Red Lockout: 100% Safe</span>
          </div>

          <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300 font-mono">
            <HeartPulse className="w-4 h-4 text-rose-500" />
            <span>Comfort Violations: {dailySummary.comfortViolationHoursYellow} hrs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
