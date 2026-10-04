import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import {
  Send,
  CheckCheck,
  Bell,
  Smartphone,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  Wrench,
  Sparkles,
} from 'lucide-react';
import { WhatsAppAlert } from '../types';

export const AlertsPage: React.FC = () => {
  const { alerts, markAlertRead } = useSimulation();
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'INFO'>('ALL');
  const [customMsg, setCustomMsg] = useState('');
  const [localAlerts, setLocalAlerts] = useState<WhatsAppAlert[]>(alerts);

  const filteredAlerts = localAlerts.filter(
    (a) => selectedFilter === 'ALL' || a.severity === selectedFilter
  );

  const handleSendTestAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;

    const newAlert: WhatsAppAlert = {
      id: `alert-${Date.now()}`,
      timestamp: 'Just now',
      sender: 'Triage Gateway (+91 98201 44552)',
      title: 'Facility Maintenance Notice',
      message: customMsg,
      severity: 'WARNING',
      category: 'MAINTENANCE',
      actionable: true,
      read: false,
    };

    setLocalAlerts([newAlert, ...localAlerts]);
    setCustomMsg('');
  };

  const handleSimulateAbnormalCompressor = () => {
    const newAlert: WhatsAppAlert = {
      id: `alert-${Date.now()}`,
      timestamp: 'Just now',
      sender: 'Triage Gateway (+91 98201 44552)',
      title: 'Compressor Abnormal Current Surge',
      message: '🚨 Ward B AC-1 (CT-WDB-01): Compressor starting current peaked at 24.8A (normal &lt;14A). High head pressure or failing start capacitor detected. Dispatch technician before total lockout.',
      severity: 'CRITICAL',
      category: 'MAINTENANCE',
      actionable: true,
      read: false,
    };
    setLocalAlerts([newAlert, ...localAlerts]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              WhatsApp & SMS Maintenance Alerts
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Proactive Equipment Health Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Triage turns clip-on CT sensors into predictive maintenance bots. Technicians receive actionable WhatsApp messages before AC compressors burn out or vaccine freezers breach safe bounds.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSimulateAbnormalCompressor}
            className="flex items-center space-x-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Simulate Compressor Anomaly</span>
          </button>
        </div>
      </div>

      {/* Main Container: Mobile Phone Frame alongside Telemetry Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Phone Mockup Frame (5 cols on large screens) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-sm bg-slate-950 rounded-[42px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50">
            {/* Phone Screen */}
            <div className="bg-[#efeae2] dark:bg-[#0b141a] rounded-[34px] overflow-hidden flex flex-col h-[560px] relative">
              {/* WhatsApp App Header */}
              <div className="bg-[#008069] text-white px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                    TR
                  </div>
                  <div>
                    <h4 className="font-bold text-xs leading-tight">
                      Triage Hospital Gateway
                    </h4>
                    <span className="text-[10px] text-emerald-100 opacity-90 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block animate-pulse" />
                      <span>Online • Cellular LTE</span>
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-emerald-100 font-mono">
                  +91 98201
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
                {filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => markAlertRead(alert.id)}
                    className="cursor-pointer max-w-[90%] bg-white dark:bg-[#1f2c34] rounded-2xl rounded-tl-xs p-3 shadow-sm border border-slate-200/60 dark:border-slate-800 transition hover:shadow-md"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          alert.severity === 'CRITICAL'
                            ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                            : alert.severity === 'WARNING'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {alert.title}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {alert.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                      {alert.message}
                    </p>

                    <div className="flex items-center justify-end space-x-1 mt-1 text-[10px] text-slate-400">
                      <span>Delivered</span>
                      <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSendTestAlert}
                className="bg-[#f0f2f5] dark:bg-[#202c33] p-2 flex items-center space-x-2 border-t border-slate-200 dark:border-slate-800"
              >
                <input
                  type="text"
                  placeholder="Send engineer ping..."
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  className="flex-1 bg-white dark:bg-[#2a3942] text-xs px-3 py-2 rounded-full border-none focus:outline-none text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="p-2 rounded-full bg-[#008069] text-white hover:bg-[#00705c] transition"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Telemetry & Predictive Maintenance Explanations (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Why Indian Hospital Engineers Love WhatsApp Alerts
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Hospital maintenance engineers rarely sit at desktop SCADA consoles. By streaming intelligence directly to their personal WhatsApp via Twilio/Meta Business API, problems are resolved within minutes instead of causing patient complaints.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 shrink-0">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Fouled Air Filter Detection
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-normal">
                    When dust blocks an AC filter, the blower motor draws 15–20% more current to move the same CFM. Triage detects this gradual creep over 48 hours and sends a washing reminder before cooling drops.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Compressor Vibration & Bearing Seizure Warning
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-normal">
                    High current spikes during compressor startup reveal failing capacitors or locked rotors. Replacing a ₹450 capacitor prevents a ₹35,000 compressor burnout.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Idle Overnight Power Waste Intercept
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-normal">
                    Admin split ACs and conference displays accidentally left ON after staff departures are auto-quenched after 21:00 with a polite WhatsApp notification sent to the admin manager.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
