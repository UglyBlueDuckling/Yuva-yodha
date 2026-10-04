import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { ShieldAlert, Lock, AlertTriangle, X, CheckCircle2 } from 'lucide-react';

export const SafetyLockModal: React.FC = () => {
  const { safetyLockModalOpen, setSafetyLockModalOpen, safetyLockLoad } = useSimulation();

  if (!safetyLockModalOpen || !safetyLockLoad) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border-2 border-red-500 overflow-hidden">
        {/* Header strip */}
        <div className="bg-red-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-700/80 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">CLINICAL SAFETY LOCKOUT</h3>
              <p className="text-xs text-red-100 font-mono">ACTION REJECTED BY PATIENT SAFETY FIRMWARE</p>
            </div>
          </div>
          <button
            onClick={() => setSafetyLockModalOpen(false)}
            className="text-red-100 hover:text-white hover:bg-red-700/60 p-1.5 rounded-lg transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Lock className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  {safetyLockLoad.name} is permanently tagged RED
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Zone: <span className="font-medium">{safetyLockLoad.zoneName}</span> • Rated: {safetyLockLoad.ratedKw} kW • Sensor: {safetyLockLoad.ctSensorId}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Clinical Justification & Regulatory Lockout:
            </p>
            <div className="text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed">
              {safetyLockLoad.lockoutReason}
            </div>
          </div>

          {/* Physical Hardware Guarantee */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-3.5">
            <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-medium text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>Hardware Physical Architecture Guarantee:</span>
            </div>
            <p className="text-xs text-amber-900/80 dark:text-amber-200/80 mt-1 leading-normal">
              Red circuits are physically installed with clip-on Current Transformers (CT) only. No relay, contactor, or inline switch is wired to this circuit. Even if the Triage cloud or gateway is compromised, power to this critical life-support circuit physically cannot be interrupted.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Logged to immutable audit trail</span>
            </div>
            <button
              onClick={() => setSafetyLockModalOpen(false)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl transition shadow-sm"
            >
              Acknowledge & Keep Locked
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
