import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ZapOff,
  PowerOff,
  RotateCcw,
  BatteryCharging,
  ThermometerSnowflake,
  Search,
  CheckCircle2,
  FileText,
  Lock,
} from 'lucide-react';

export const SafetyFailSafePage: React.FC = () => {
  const {
    isKitFailed,
    simulateKitFailure,
    isOutageSimulated,
    simulateGridOutage,
    auditLogs,
    currentStepData,
  } = useSimulation();

  const [auditSearch, setAuditSearch] = useState('');

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.loadOrZone.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.justification.toLowerCase().includes(auditSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Safety, Fail-Safe & Outage Resilience
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
              Zero Risk Guarantee
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Test the physical fail-safe architecture: trigger a simulated gateway failure or grid blackout to observe automatic reversion to grid bypass and vaccine cold chain protection.
          </p>
        </div>

        {/* Live Safety Badge */}
        <div className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 shrink-0">
          <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider">Clinical Lockout Audit</div>
            <div className="text-xs font-bold font-mono">0 Red Loads Ever Touched</div>
          </div>
        </div>
      </div>

      {/* TWO INTERACTIVE SIMULATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* SIMULATE KIT FAILURE */}
        <div
          className={`rounded-3xl p-6 border-2 transition-all flex flex-col justify-between ${
            isKitFailed
              ? 'bg-red-50/60 dark:bg-red-950/30 border-red-500 shadow-lg'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2.5 rounded-xl ${
                    isKitFailed
                      ? 'bg-red-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <PowerOff className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Simulate Kit Hardware Failure
                  </h3>
                  <p className="text-xs text-slate-500">
                    Normally-Closed (NC) Contactor De-energization
                  </p>
                </div>
              </div>

              {isKitFailed && (
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-red-500 text-white animate-pulse">
                  Reverted to Grid
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              If the Triage edge gateway loses power, crashes, or suffers a firmware watchdog trip, all control relays are spring-loaded <strong>Normally-Closed (NC)</strong>. Within 15 milliseconds, hospital circuits snap back to direct grid line power.
            </p>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span>Contactor State:</span>
                <span className="font-mono font-bold">
                  {isKitFailed ? 'DE-ENERGIZED (GRID PASS-THROUGH)' : 'ACTIVE (INTELLIGENT MODULATION)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span>Controlled Zones Reversion:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {isKitFailed ? '100% BASELINE SETPOINTS' : 'TRIAGE OPTIMIZED'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => simulateKitFailure(!isKitFailed)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                isKitFailed
                  ? 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
              }`}
            >
              {isKitFailed ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Restore Triage Kit Operation</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span>Simulate Kit Failure</span>
                </>
              )}
            </button>
            <span className="text-[11px] text-slate-400 font-mono">Fail-safe time: &lt;15ms</span>
          </div>
        </div>

        {/* SIMULATE GRID OUTAGE */}
        <div
          className={`rounded-3xl p-6 border-2 transition-all flex flex-col justify-between ${
            isOutageSimulated
              ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-500 shadow-lg'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2.5 rounded-xl ${
                    isOutageSimulated
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <ZapOff className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Simulate Grid Blackout (Island Mode)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Solar + Battery Microgrid Prioritization
                  </p>
                </div>
              </div>

              {isOutageSimulated && (
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500 text-white animate-pulse">
                  Islanded
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              When grid feeder trips, Triage instantly sheds Green utility loads (pumps, laundry), dials down non-essential Yellow ACs, and guarantees continuous power to the Red circuit (ICU + OT + Vaccine Cold Chain).
            </p>

            {/* Vaccine safety & battery remaining */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Vaccine Cold Temp</span>
                <div className="text-base font-bold text-blue-600 dark:text-blue-400 font-mono mt-0.5 flex items-center space-x-1">
                  <ThermometerSnowflake className="w-4 h-4 shrink-0" />
                  <span>{currentStepData.vaccineFridgeTemp}°C</span>
                </div>
                <span className="text-[10px] text-slate-500">Safe: 2.0°C – 8.0°C</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Vaccine Safe Reserve</span>
                <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 flex items-center space-x-1">
                  <BatteryCharging className="w-4 h-4 shrink-0" />
                  <span>{currentStepData.vaccineSafeHoursRemaining} Hours</span>
                </div>
                <span className="text-[10px] text-slate-500">Battery SOC: {currentStepData.batterySocPercent}%</span>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => simulateGridOutage(!isOutageSimulated)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                isOutageSimulated
                  ? 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900'
                  : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
              }`}
            >
              {isOutageSimulated ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Restore Main Grid Feeder</span>
                </>
              ) : (
                <>
                  <ZapOff className="w-4 h-4" />
                  <span>Simulate Grid Outage</span>
                </>
              )}
            </button>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Red circuits uninterrupted
            </span>
          </div>
        </div>
      </div>

      {/* IMMUTABLE AUDIT LOG */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Clinical Safety Action Audit Trail
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Immutable chronological record of every automated adjustment, showing Red loads are permanently protected.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={auditSearch}
              onChange={(e) => setAuditSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 max-h-80 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold sticky top-0">
              <tr>
                <th className="px-4 py-2.5">Time</th>
                <th className="px-4 py-2.5">Load / System</th>
                <th className="px-4 py-2.5">Tier</th>
                <th className="px-4 py-2.5">Action Executed</th>
                <th className="px-4 py-2.5">Justification & Regulatory Check</th>
                <th className="px-4 py-2.5">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map((log) => {
                const isRed = log.tag === 'RED';
                return (
                  <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      {log.loadOrZone}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                          log.tag === 'RED'
                            ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                            : log.tag === 'YELLOW'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {log.tag}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-800 dark:text-slate-200 font-medium">
                      {log.action}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-[11px]">
                      {log.justification}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {log.safetyCheck === 'LOCKED_BY_CLINICAL_PROTOCOL' ? (
                        <span className="inline-flex items-center text-red-600 dark:text-red-400 font-bold text-[10px]">
                          <Lock className="w-3 h-3 mr-1" /> CLINICAL LOCKOUT
                        </span>
                      ) : log.safetyCheck === 'FAILSAFE_REVERT' ? (
                        <span className="inline-flex items-center text-amber-600 dark:text-amber-400 font-bold text-[10px]">
                          <RotateCcw className="w-3 h-3 mr-1" /> REVERTED TO LINE
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium text-[10px]">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> VERIFIED SAFE
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
