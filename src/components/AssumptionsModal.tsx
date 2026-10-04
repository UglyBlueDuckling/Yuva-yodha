import React, { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Sliders, X, RotateCcw, Check, Info } from 'lucide-react';
import { Assumptions } from '../types';

export const AssumptionsModal: React.FC = () => {
  const {
    assumptionsModalOpen,
    setAssumptionsModalOpen,
    assumptions,
    updateAssumptions,
    resetAssumptions,
  } = useSimulation();

  const [formValues, setFormValues] = useState<Assumptions>(assumptions);

  useEffect(() => {
    setFormValues(assumptions);
  }, [assumptions, assumptionsModalOpen]);

  if (!assumptionsModalOpen) return null;

  const handleChange = (key: keyof Assumptions, value: number) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    updateAssumptions(formValues);
    setAssumptionsModalOpen(false);
  };

  const handleReset = () => {
    resetAssumptions();
    setAssumptionsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                Simulation Assumptions & Constants
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calibrated for typical 50-bed Indian nursing homes & surgical hospitals
              </p>
            </div>
          </div>
          <button
            onClick={() => setAssumptionsModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition"
            aria-label="Close assumptions"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mandatory Visible Banner */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/50 px-6 py-3 flex items-start space-x-2 text-xs text-amber-900 dark:text-amber-200">
          <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <span>
            <strong>Visible Label:</strong> Simulated data using illustrative assumptions, not measurements. Figures reflect realistic empirical models from Indian tier-2 private healthcare facilities.
          </span>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Facility & Tariff */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3">
              Facility Scale & Power Tariffs
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Hospital Bed Count
                </label>
                <input
                  type="number"
                  min="10"
                  max="200"
                  value={formValues.numBeds}
                  onChange={(e) => handleChange('numBeds', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-500">Default: 50 beds</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Grid Commercial Tariff (₹ / kWh)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="4"
                  max="20"
                  value={formValues.gridTariffPerKwh}
                  onChange={(e) => handleChange('gridTariffPerKwh', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-500">MSEDCL/BESCOM average ~₹9.50</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Diesel Generator Running Cost (₹ / kWh)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="15"
                  max="50"
                  value={formValues.dieselGenTariffPerKwh}
                  onChange={(e) => handleChange('dieselGenTariffPerKwh', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-500">Fuel burn ~0.28 L/kWh + lube oil</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Peak Tariff Window Multiplier
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="1.0"
                  max="2.0"
                  value={formValues.peakTariffMultiplier}
                  onChange={(e) => handleChange('peakTariffMultiplier', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-500">1.35x surcharge between 18:00 - 22:00</span>
              </div>
            </div>
          </div>

          {/* Kit Economics */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3">
              Hardware Kit & Retrofit Capital Expenditure
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Total Kit Cost (₹ INR)
                </label>
                <input
                  type="number"
                  step="5000"
                  value={formValues.kitCostInr}
                  onChange={(e) => handleChange('kitCostInr', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-500">Gateway + 24 CT sensors + 8 contactors</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Annual Cloud & Maintenance (₹ INR)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={formValues.annualMaintenanceInr}
                  onChange={(e) => handleChange('annualMaintenanceInr', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-500">Cellular 4G IoT SIM + firmware updates</span>
              </div>
            </div>
          </div>

          {/* Clean Energy & Microgrid */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3">
              Solar & Energy Storage Buffer
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Rooftop Solar PV Array (kWp)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={formValues.solarCapacityKwp}
                  onChange={(e) => handleChange('solarCapacityKwp', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-500">Terrace mounted 30 kWp system</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Battery Storage Capacity (kWh)
                </label>
                <input
                  type="number"
                  step="5"
                  min="0"
                  max="120"
                  value={formValues.batteryCapacityKwh}
                  onChange={(e) => handleChange('batteryCapacityKwh', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-500">Lithium Ferro-Phosphate (LFP) 45 kWh</span>
              </div>
            </div>
          </div>

          {/* Clinical & Thermal Comfort Constraints */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3">
              Thermal Comfort & Patient Safety Standards
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Ceiling Fan Cooling Offset (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="2.0"
                  value={formValues.fanCoolingEquivalenceC}
                  onChange={(e) => handleChange('fanCoolingEquivalenceC', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-500">ASHRAE-55 skin velocity equivalent</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Corridor Night Safe Minimum Floor (Lux)
                </label>
                <input
                  type="number"
                  step="5"
                  min="50"
                  max="150"
                  value={formValues.corridorDimmingMinLux}
                  onChange={(e) => handleChange('corridorDimmingMinLux', Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-500">NABH standard: &gt;75 Lux required</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setAssumptionsModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Assumptions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
