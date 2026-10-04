import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import {
  Home,
  LayoutGrid,
  Tag,
  Cpu,
  BarChart3,
  ShieldCheck,
  Bell,
  Calculator,
  GitFork,
  Printer,
  Lock,
  Zap,
} from 'lucide-react';

interface NavItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', name: 'Overview & Pitch', icon: Home },
  { id: 'twin', name: 'Live Hospital Twin', icon: LayoutGrid, badge: 'SVG' },
  { id: 'tagging', name: 'Load Triage Tagging', icon: Tag },
  { id: 'rules', name: 'Rules Engine', icon: Cpu },
  { id: 'charts', name: 'Energy & Money', icon: BarChart3 },
  { id: 'safety', name: 'Safety & Fail-Safe', icon: ShieldCheck, badge: 'Lock' },
  { id: 'alerts', name: 'WhatsApp Alerts', icon: Bell, badge: 'Live' },
  { id: 'roi', name: 'ROI Calculator', icon: Calculator },
  { id: 'architecture', name: 'System Architecture', icon: GitFork },
  { id: 'report', name: '1-Page Impact Report', icon: Printer, badge: 'PDF' },
];

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentStepData, alerts } = useSimulation();

  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between h-[calc(100vh-57px)] sticky top-[57px] no-print">
      {/* Navigation list */}
      <div className="p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Hospital Energy Navigation
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/80 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </div>

              {item.id === 'alerts' && unreadAlertsCount > 0 ? (
                <span className="px-1.5 py-0.2 bg-red-500 text-white text-[10px] font-bold rounded-full">
                  {unreadAlertsCount}
                </span>
              ) : item.badge ? (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-medium ${
                    isActive
                      ? 'bg-emerald-200 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Bottom Live Telemetry Widget */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
        <div className="p-3 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Live Total Power
            </span>
            <span className="flex items-center space-x-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Real-time</span>
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
              {currentStepData.triageTotalKw} <span className="text-xs font-normal text-slate-400">kW</span>
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Base: {currentStepData.baselineTotalKw} kW
            </span>
          </div>

          {/* Clinical Lock Status */}
          <div className="flex items-center space-x-1.5 text-[11px] text-red-600 dark:text-red-400 font-medium pt-1 border-t border-slate-100 dark:border-slate-700">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Red Circuit: Hardware Locked</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
