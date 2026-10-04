import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import {
  Play,
  Pause,
  Sun,
  Moon,
  Zap,
  Sliders,
  Sparkles,
  HelpCircle,
  Flame,
  PowerOff,
  CloudSun,
} from 'lucide-react';
import { ScenarioType } from '../types';

export const Header: React.FC = () => {
  const {
    mode,
    setMode,
    scenario,
    setScenario,
    currentTimeIndex,
    setCurrentTimeIndex,
    isPlaying,
    togglePlay,
    playbackSpeed,
    setPlaybackSpeed,
    currentStepData,
    startGuidedDemo,
    setAssumptionsModalOpen,
    setShowWelcomeTour,
    isDarkMode,
    toggleDarkMode,
    isKitFailed,
    isOutageSimulated,
  } = useSimulation();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTimeIndex(Number(e.target.value));
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-6 py-2.5 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Branding & Baseline/Triage Switch */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 font-extrabold text-lg">
              T
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  Triage
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  50-Bed Hospital Kit
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">
                Clinical Criticality Energy Retrofit
              </p>
            </div>
          </div>

          {/* GLOBAL BASELINE VS TRIAGE SWITCH */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center shadow-inner border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setMode('baseline')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === 'baseline'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Baseline (Unmanaged)
            </button>
            <button
              onClick={() => setMode('triage')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === 'triage'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Triage Active</span>
            </button>
          </div>

          {/* Hardware Fail-safe / Outage Indicator Badge */}
          {isKitFailed && (
            <span className="animate-pulse px-2 py-0.5 text-[11px] font-bold rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800">
              ⚡ KIT FAILED: REVERTED TO BASELINE
            </span>
          )}
          {isOutageSimulated && (
            <span className="animate-pulse px-2 py-0.5 text-[11px] font-bold rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              🔌 GRID OUTAGE: ISLAND MICROGRID
            </span>
          )}
        </div>

        {/* Center: Clock, Play/Pause, Speed, 24h Scrubber */}
        <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className={`p-1.5 rounded-lg text-white transition shadow-sm ${
              isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
            title={isPlaying ? 'Pause Simulation' : 'Play 24h Simulation'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
          </button>

          {/* Time display */}
          <div className="flex flex-col items-center">
            <span className="font-mono font-bold text-sm text-slate-900 dark:text-white leading-tight">
              {currentStepData.timeStr}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400">
              Sim Time
            </span>
          </div>

          {/* Scrubber slider */}
          <div className="w-28 sm:w-40 flex items-center">
            <input
              type="range"
              min="0"
              max="287"
              value={currentTimeIndex}
              onChange={handleSliderChange}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              title="Drag to inspect any 5-minute interval in the 24-hour cycle"
            />
          </div>

          {/* Speed toggles */}
          <div className="flex items-center space-x-1 text-[11px] font-semibold bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            {[1, 10, 60].map((s) => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                className={`px-1.5 py-0.5 rounded ${
                  playbackSpeed === s
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Ambient Outdoor Temp */}
          <div className="hidden xl:flex items-center space-x-1 pl-2 border-l border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
            <span className="text-[10px] text-slate-400">Amb:</span>
            <span className="font-mono font-semibold">{currentStepData.outdoorTemp}°C</span>
          </div>
        </div>

        {/* Right: Scenario dropdown, Guided Demo CTA, Assumptions, Dark Mode */}
        <div className="flex items-center space-x-2">
          {/* Scenario selector */}
          <div className="relative">
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value as ScenarioType)}
              className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="summer">☀️ Normal Summer Day</option>
              <option value="heatwave">🔥 Heatwave Day (44.5°C)</option>
              <option value="outage">🔌 Grid Outage (13:00 - 17:00)</option>
            </select>
          </div>

          {/* Guided 90-sec pitch button */}
          <button
            onClick={startGuidedDemo}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
            title="Auto-plays through key pages with investor/jury narration"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Start 90s Demo</span>
          </button>

          {/* Assumptions drawer toggle */}
          <button
            onClick={() => setAssumptionsModalOpen(true)}
            className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition border border-slate-200 dark:border-slate-700"
            title="Edit Assumptions & Constants"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Help / Tour modal toggle */}
          <button
            onClick={() => setShowWelcomeTour(true)}
            className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition border border-slate-200 dark:border-slate-700"
            title="Clinical Triage Concept Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Dark mode switch */}
          <button
            onClick={toggleDarkMode}
            className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition border border-slate-200 dark:border-slate-700"
            title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
