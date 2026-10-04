import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { ShieldCheck, Zap, Thermometer, ArrowRight, X, Play } from 'lucide-react';

export const OnboardingTour: React.FC = () => {
  const { showWelcomeTour, setShowWelcomeTour, startGuidedDemo } = useSimulation();

  if (!showWelcomeTour) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 text-white relative">
          <button
            onClick={() => setShowWelcomeTour(false)}
            className="absolute top-4 right-4 text-emerald-100 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-white/20 rounded-full text-xs font-semibold tracking-wide uppercase mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive Hospital Simulation</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            Triage: Hospital Retrofit Energy Kit
          </h2>
          <p className="text-emerald-100 text-xs mt-1">
            Engineered for 50-bed Indian nursing homes & surgical facilities.
          </p>
        </div>

        {/* 3 Colors explanation */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Energy management in healthcare usually fails because facility directors fear turning off life support. <strong>Triage borrows patient triage rules</strong> to guarantee absolute patient safety:
          </p>

          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60">
              <div className="w-4 h-4 rounded-full bg-red-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-red-900 dark:text-red-300 uppercase tracking-wide">
                  RED: Clinical Lockout (Monitored Only)
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                  Operating Theatre AHU, ICU Ventilators, Vaccine Cold Chain, Medical Suction. Clip-on CT sensors only. No control relays physically exist. Zero energy curtailment permitted.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60">
              <div className="w-4 h-4 rounded-full bg-amber-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wide">
                  YELLOW: Comfort Bands (Clinician Approved)
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                  General Wards A & B, OPD Waiting, Corridors. Controlled exclusively within safe bands (23.5°C - 26.5°C) using fan-first cooling nudges and empty-bed standby.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60">
              <div className="w-4 h-4 rounded-full bg-emerald-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wide">
                  GREEN: Flexible Shifting (Zero Patient Contact)
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5">
                  Water overhead tank pump, laundry washers, sterilisation autoclave pre-heating. Automatically shifted to peak solar generation and off-peak tariff hours.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => {
                setShowWelcomeTour(false);
                startGuidedDemo();
              }}
              className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-emerald-600/20"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start 90s Guided Demo</span>
            </button>
            <button
              onClick={() => setShowWelcomeTour(false)}
              className="flex items-center space-x-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              <span>Explore Self-Guided</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
