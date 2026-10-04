import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import {
  Lock,
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { TriageTag, ElectricalLoad } from '../types';

export const LoadTaggingPage: React.FC = () => {
  const { loads, updateLoadTag, currentStepData } = useSimulation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredLoads = loads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.zoneName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.ctSensorId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'ALL' || l.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const redCount = loads.filter((l) => l.tag === 'RED').length;
  const yellowCount = loads.filter((l) => l.tag === 'YELLOW').length;
  const greenCount = loads.filter((l) => l.tag === 'GREEN').length;

  const totalKw = loads.reduce((acc, l) => acc + l.ratedKw, 0);
  const redKw = loads.filter((l) => l.tag === 'RED').reduce((acc, l) => acc + l.ratedKw, 0);

  const handleTagChange = (load: ElectricalLoad, newTag: TriageTag) => {
    updateLoadTag(load.id, newTag);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Load Triage Classification & Tagging
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
                Firmware Clinical Lockout Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Assign loads into clinical criticality tiers. Try changing an <strong>Operating Theatre or ICU load to Yellow or Green</strong> to see the automated patient safety lockout intercept.
            </p>
          </div>

          {/* Quick Counter Chips */}
          <div className="flex items-center space-x-2">
            <div className="px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Red Tier</div>
                <div className="text-sm font-extrabold text-red-600 dark:text-red-400 font-mono">
                  {redCount} loads ({Math.round(redKw)} kW)
                </div>
              </div>
            </div>

            <div className="px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Yellow Tier</div>
                <div className="text-sm font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                  {yellowCount} loads
                </div>
              </div>
            </div>

            <div className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Green Tier</div>
                <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {greenCount} loads
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search load name, zone, or CT ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {['ALL', 'HVAC', 'LIGHTING', 'CRITICAL_MEDICAL', 'WATER', 'REFRIGERATION'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Loads Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Load Details</th>
                <th className="px-4 py-3">Zone</th>
                <th className="px-4 py-3">Rated Power</th>
                <th className="px-4 py-3">Sensor CT</th>
                <th className="px-4 py-3">Assigned Triage Tag</th>
                <th className="px-4 py-3">Bypass Architecture</th>
                <th className="px-4 py-3">Safety & Lockout Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLoads.map((load) => {
                const isRed = load.tag === 'RED';
                const isOriginalRed = load.originalTag === 'RED';

                return (
                  <tr
                    key={load.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {/* Name & Strategy */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900 dark:text-white text-xs">
                        {load.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {load.triageStrategy}
                      </div>
                    </td>

                    {/* Zone */}
                    <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">
                      {load.zoneName}
                    </td>

                    {/* Rated kW */}
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {load.ratedKw} kW
                    </td>

                    {/* Sensor ID */}
                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {load.ctSensorId}
                    </td>

                    {/* Interactive Triage Tag Selector */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => handleTagChange(load, 'RED')}
                          className={`px-2 py-1 rounded-md text-[10px] font-extrabold uppercase transition ${
                            load.tag === 'RED'
                              ? 'bg-red-500 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-red-100 hover:text-red-700'
                          }`}
                        >
                          RED
                        </button>
                        <button
                          onClick={() => handleTagChange(load, 'YELLOW')}
                          className={`px-2 py-1 rounded-md text-[10px] font-extrabold uppercase transition ${
                            load.tag === 'YELLOW'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-amber-100 hover:text-amber-700'
                          }`}
                        >
                          YELLOW
                        </button>
                        <button
                          onClick={() => handleTagChange(load, 'GREEN')}
                          className={`px-2 py-1 rounded-md text-[10px] font-extrabold uppercase transition ${
                            load.tag === 'GREEN'
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-emerald-100 hover:text-emerald-700'
                          }`}
                        >
                          GREEN
                        </button>
                      </div>
                    </td>

                    {/* Bypass Relay Architecture */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {load.bypassRelay === 'NONE' ? (
                        <span className="inline-flex items-center text-red-600 dark:text-red-400 font-bold text-[11px]">
                          <Lock className="w-3 h-3 mr-1" /> No Relay (Physically Isolated)
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> NC Contactor Fail-Safe
                        </span>
                      )}
                    </td>

                    {/* Safety Status */}
                    <td className="px-4 py-3.5">
                      {isOriginalRed ? (
                        <div className="flex items-center space-x-1.5 text-red-700 dark:text-red-300 font-bold text-[11px]">
                          <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                          <span>Locked by Clinical Protocol</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-slate-500 text-[11px]">
                          <span>Configurable within safe bands</span>
                        </div>
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
