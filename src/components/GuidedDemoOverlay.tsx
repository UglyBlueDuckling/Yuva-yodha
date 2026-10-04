import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { DEMO_STEPS } from '../constants/assumptions';
import { Play, Pause, SkipForward, X, Sparkles, Volume2 } from 'lucide-react';

export const GuidedDemoOverlay: React.FC = () => {
  const {
    guidedDemoRunning,
    stopGuidedDemo,
    demoStepIndex,
    isPlaying,
    togglePlay,
  } = useSimulation();

  if (!guidedDemoRunning) return null;

  const currentStep = DEMO_STEPS[demoStepIndex] || DEMO_STEPS[0];
  const progressPercent = ((demoStepIndex + 1) / DEMO_STEPS.length) * 100;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-3xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-5 shadow-2xl border border-emerald-500/50 shadow-emerald-950/40">
        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
          <div
            className="bg-emerald-400 h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold tracking-wide uppercase border border-emerald-500/30">
                <Sparkles className="w-3 h-3 text-emerald-400 mr-1" />
                90-Second Investor & Jury Pitch
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentStep.badge}
              </span>
            </div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              {currentStep.title}
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              {currentStep.narration}
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={togglePlay}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={stopGuidedDemo}
              className="flex items-center space-x-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold rounded-xl border border-red-500/40 transition"
            >
              <X className="w-3.5 h-3.5" />
              <span>Exit Demo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
