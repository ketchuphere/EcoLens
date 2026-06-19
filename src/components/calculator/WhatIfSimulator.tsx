import React, { useState, useEffect } from 'react';
import { CarbonService } from '../../services/carbonService';
import { CarbonInputs } from '../../types';
import { Sliders, Sparkles, Info } from 'lucide-react';

interface WhatIfSimulatorProps {
  currentInputs: CarbonInputs;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ currentInputs }) => {
  // Simulators multipliers
  const [carReducePercent, setCarReducePercent] = useState(25);
  const [electricityReducePercent, setElectricityReducePercent] = useState(15);
  const [dietAdjustment, setDietAdjustment] = useState<'no_change' | 'half_veg' | 'all_vegan'>('half_veg');
  const [wasteHalved, setWasteHalved] = useState(true);
  const [installSolar, setInstallSolar] = useState(false);

  const [originalStats, setOriginalStats] = useState(() => CarbonService.calculate(currentInputs));
  const [simulatedStats, setSimulatedStats] = useState(() => CarbonService.calculate(currentInputs));

  useEffect(() => {
    // Re-trigger original stats in case currentInputs changed
    setOriginalStats(CarbonService.calculate(currentInputs));
  }, [currentInputs]);

  useEffect(() => {
    // Apply Simulated changes to inputs
    const simulatedInputs: CarbonInputs = {
      ...currentInputs,
      // 1. Car Distance reduction
      distanceCar: Math.round(currentInputs.distanceCar * (1 - carReducePercent / 100)),
      // 2. Electricity reduction
      electricityKwh: Math.round(currentInputs.electricityKwh * (1 - electricityReducePercent / 100)),
      // 3. Diet adjustment
      dietType: dietAdjustment === 'all_vegan' 
        ? 'vegan' 
        : dietAdjustment === 'half_veg'
          ? (currentInputs.dietType === 'beef_heavy' || currentInputs.dietType === 'meat_moderate') ? 'vegetarian' : currentInputs.dietType
          : currentInputs.dietType,
      // 4. Waste reduced
      wasteBagsCount: wasteHalved ? Math.max(1, Math.round(currentInputs.wasteBagsCount * 0.5)) : currentInputs.wasteBagsCount,
      recyclesActive: wasteHalved ? true : currentInputs.recyclesActive,
      // 5. Installed Solar
      hasSolar: installSolar ? true : currentInputs.hasSolar,
      solarGenerationKwh: installSolar ? Math.max(currentInputs.solarGenerationKwh, 150) : currentInputs.solarGenerationKwh
    };

    setSimulatedStats(CarbonService.calculate(simulatedInputs));
  }, [carReducePercent, electricityReducePercent, dietAdjustment, wasteHalved, installSolar, currentInputs]);

  const co2Saved = Math.max(0, originalStats.total - simulatedStats.total);
  const percentSaved = originalStats.total > 0 ? ((co2Saved / originalStats.total) * 100).toFixed(0) : '0';

  return (
    <div className="bg-white border border-slate-200/70 rounded-[32px] p-8 shadow-xs mr-auto" id="what_if_simulator_container">
      <div className="pb-5 border-b border-slate-100 mb-6 flex items-center justify-between font-sans">
        <div>
          <h2 className="text-xl font-bold text-slate-900">What-If Reduction Simulator</h2>
          <p className="text-xs text-slate-400 font-medium">Model lifestyle changes in real-time to preview potential footprint offsets</p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 text-emerald-600">
          <Sparkles className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
        {/* Left Hand: Interactive sliders simulations */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-slate-500" />
            <span>Calibrate Commute & Home Actions</span>
          </h3>

          <div className="space-y-5">
            {/* Action 1: Car reduce */}
            <div className="bg-slate-50/50 border border-slate-200/60 p-5 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800">Cut Car Commute distance</span>
                <span className="text-sm font-bold text-emerald-700 number-font">-{carReducePercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={carReducePercent}
                onChange={(e) => setCarReducePercent(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="text-[10px] text-slate-400 font-medium flex justify-between">
                <span>Rely on micro-mobility or public transit</span>
                <span className="number-font">Simulated: {Math.round(currentInputs.distanceCar * (1 - carReducePercent / 100))} km</span>
              </div>
            </div>

            {/* Action 2: Electricity Reduce */}
            <div className="bg-slate-50/50 border border-slate-200/60 p-5 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800">Trim Electricity usage (thermostat adjustment)</span>
                <span className="text-sm font-bold text-emerald-700 number-font">-{electricityReducePercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={electricityReducePercent}
                onChange={(e) => setElectricityReducePercent(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="text-[10px] text-slate-400 font-medium flex justify-between">
                <span>Power savings by shutting standby devices</span>
                <span className="number-font">Simulated: {Math.round(currentInputs.electricityKwh * (1 - electricityReducePercent / 100))} kWh</span>
              </div>
            </div>

            {/* Action 3: Diet adjustments */}
            <div className="bg-slate-50/50 border border-slate-200/60 p-5 rounded-2xl space-y-2.5">
              <span className="text-xs font-bold block text-slate-800">Transition Diet patterns</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {[
                  { key: 'no_change', label: 'Original Diet' },
                  { key: 'half_veg', label: 'Meatless Tiers' },
                  { key: 'all_vegan', label: '100% Vegan Plan' }
                ].map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setDietAdjustment(opt.key as any)}
                    className={`py-2 px-3 rounded-xl border text-[11px] font-bold transition-all cursor-pointer focus:outline-emerald-600 ${
                      dietAdjustment === opt.key
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow shadow-emerald-500/10'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action 4: Landfill waste offset */}
            <div className="flex items-center justify-between bg-slate-50/50 border border-slate-200/60 p-5 rounded-2xl">
              <div>
                <span className="text-xs font-bold block text-slate-800">Cut Household Waste bags by half</span>
                <span className="text-[10px] text-slate-400 font-medium font-sans">Enforces active composting and standard product reuse</span>
              </div>
              <input
                type="checkbox"
                checked={wasteHalved}
                onChange={(e) => setWasteHalved(e.target.checked)}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer focus:outline-emerald-600"
              />
            </div>

            {/* Action 5: Install Solar panels */}
            <div className="flex items-center justify-between bg-slate-50/50 border border-slate-200/60 p-5 rounded-2xl">
              <div>
                <span className="text-xs font-bold block text-slate-850">Install Residential Solar Photovoltaic Panels</span>
                <span className="text-[10px] text-slate-400 font-medium font-sans">Guarantees 150 kWh of net-zero electricity offsets</span>
              </div>
              <input
                type="checkbox"
                checked={installSolar}
                onChange={(e) => setInstallSolar(e.target.checked)}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer focus:outline-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Right Hand: Carbon offsets outputs card */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-between space-y-6">
          <div className="bg-emerald-800 text-white p-8 rounded-[32px] shadow-sm space-y-6 h-full flex flex-col justify-between">
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-300 font-mono">Simulation Metrics</h4>
              <p className="text-lg font-bold">Projected Carbon Yields</p>
            </div>

            <div className="space-y-4 my-4 font-sans pr-0.5">
              <div className="flex justify-between border-b border-emerald-700/60 pb-2.5 text-xs">
                <span className="text-emerald-100 font-medium">Original Emissions:</span>
                <span className="font-bold text-white number-font">{originalStats.total.toFixed(0)} kg CO₂/mo</span>
              </div>
              <div className="flex justify-between border-b border-emerald-700/60 pb-2.5 text-xs">
                <span className="text-emerald-100 font-medium">New Simulated Emissions:</span>
                <span className="font-bold text-white number-font">{simulatedStats.total.toFixed(0)} kg CO₂/mo</span>
              </div>
              <div className="flex justify-between text-emerald-300 font-semibold text-sm pt-2">
                <span>Net CO₂ Prevented:</span>
                <span className="text-white font-extrabold number-font">-{co2Saved.toFixed(0)} kg / mo</span>
              </div>
            </div>

            <div className="flex items-center justify-center flex-col py-4 bg-emerald-700/40 rounded-2xl border border-emerald-600/30">
              <div className="flex items-baseline gap-1 text-white">
                <span className="text-4xl font-extrabold tracking-tight number-font">{percentSaved}%</span>
                <span className="text-sm font-semibold select-none">Decarbonized</span>
              </div>
              <p className="text-[10px] text-emerald-250 mt-1 font-medium text-center px-4 leading-normal">
                Matches the global carbon sink of {Math.round(co2Saved / 22)} mature forest trees!
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-500 flex gap-2.5 items-start mt-3">
            <Info className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              These estimates represent rule-based models matching standard planetary carbon factors. Simulators are strictly sandboxed and do not modify your historical logging entries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
