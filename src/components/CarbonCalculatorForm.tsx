import React, { useState, useEffect } from 'react';
import { CarbonInputs } from '../types';
import { calculateCarbon } from '../utils/calculator';
import { Bike, Car, Zap, Apple, ShoppingBag, Save, Info, ArrowRight, Eye } from 'lucide-react';

interface CarbonCalculatorFormProps {
  initialInputs?: CarbonInputs;
  onSave: (inputs: CarbonInputs) => void;
}

export const CarbonCalculatorForm: React.FC<CarbonCalculatorFormProps> = ({
  initialInputs,
  onSave
}) => {
  const [inputs, setInputs] = useState<CarbonInputs>(
    initialInputs || {
      vehicleType: 'petrol_car',
      distanceCar: 350,
      distanceBus: 80,
      distanceMetro: 50,
      distanceTrain: 0,
      flightsCount: 0,
      distanceFlight: 0,
      electricityKwh: 160,
      lpgKg: 5,
      acHours: 4,
      hasSolar: false,
      solarGenerationKwh: 0,
      dietType: 'meat_moderate',
      meatMealsPerMonth: 12,
      foodWasteLevel: 'medium',
      shoppingLevel: 'moderate',
      recyclesActive: true,
      wasteBagsCount: 3
    }
  );

  const [activeSubTab, setActiveSubTab] = useState<'transport' | 'energy' | 'food' | 'lifestyle'>('transport');
  const [realtimeStats, setRealtimeStats] = useState(() => calculateCarbon(inputs));
  const [saveSuccess, setSaveSuccess] = useState(false);

  // recalculate on input change
  useEffect(() => {
    setRealtimeStats(calculateCarbon(inputs));
  }, [inputs]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(inputs);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  const updateInput = <K extends keyof CarbonInputs>(key: K, value: CarbonInputs[K]) => {
    setInputs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="bg-white border border-slate-200/70 rounded-[32px] p-8 shadow-xs" id="calculator_form_container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-100 mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Carbon Footprint Calculator</h2>
          <p className="text-xs text-slate-400">Input your travel, home utility, food, and consumption parameters to get an environment audit</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 p-4 px-5 rounded-2xl flex items-center gap-4 text-right">
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Live Estimate</p>
            <span className="text-3xl font-black tracking-tight text-emerald-600 number-font">{realtimeStats.total.toFixed(0)}</span>
            <span className="text-xs font-semibold text-slate-400"> kg CO₂ / mo</span>
          </div>
        </div>
      </div>

      {/* Subcategory selectors */}
      <div className="flex border-b border-slate-100 gap-2 overflow-x-auto pb-1.5 no-print">
        {(['transport', 'energy', 'food', 'lifestyle'] as const).map(tab => {
          const isActive = activeSubTab === tab;
          let label = 'Transport';
          let icon = <Car className="w-4 h-4" />;
          let summaryVal = realtimeStats.transport;
          
          if (tab === 'energy') {
            label = 'Utilities';
            icon = <Zap className="w-4 h-4" />;
            summaryVal = realtimeStats.energy;
          } else if (tab === 'food') {
            label = 'Food diet';
            icon = <Apple className="w-4 h-4" />;
            summaryVal = realtimeStats.food;
          } else if (tab === 'lifestyle') {
            label = 'Lifestyle';
            icon = <ShoppingBag className="w-4 h-4" />;
            summaryVal = realtimeStats.lifestyle;
          }

          return (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              type="button"
              className={`flex items-center gap-2 px-5 py-3 text-xs font-extrabold rounded-2xl transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                isActive 
                  ? 'border-emerald-650 bg-emerald-50 text-emerald-800 font-black' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {icon}
              <span>{label}</span>
              <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-white border border-slate-200 text-slate-600 font-bold">
                {summaryVal.toFixed(0)} kg
              </span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="py-6 space-y-6">
        {activeSubTab === 'transport' && (
          <div className="space-y-6">
            <h3 className="font-bold text-stone-800 text-sm flex items-center gap-2">
              <Car className="w-4 h-4 text-emerald-600" />
              <span>Transportation & Commute Factors</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-700">Primary Commuted Vehicle</label>
                <select
                  value={inputs.vehicleType}
                  onChange={(e) => updateInput('vehicleType', e.target.value as any)}
                  className="w-full text-sm font-medium border border-stone-200 rounded-xl px-3 py-2 bg-white focus:outline-emerald-600"
                >
                  <option value="petrol_car">Petrol Car (~0.21 kg/km)</option>
                  <option value="diesel_car">Diesel Car (~0.25 kg/km)</option>
                  <option value="electric_car">Electric Car (~0.05 kg/km)</option>
                  <option value="none">No car / Walk & Bike only</option>
                </select>
              </div>

              {inputs.vehicleType !== 'none' && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-xs font-semibold text-stone-700">Car Mileage (Monthly)</label>
                    <span className="text-xs font-semibold text-emerald-700 number-font">{inputs.distanceCar} km</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3000"
                    step="50"
                    value={inputs.distanceCar}
                    onChange={(e) => updateInput('distanceCar', Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <p className="text-[10px] text-stone-400">Equivalent to roughly {(inputs.distanceCar * (inputs.vehicleType === 'petrol_car' ? 0.21 : inputs.vehicleType === 'diesel_car' ? 0.25 : 0.05)).toFixed(1)} kg CO₂</p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-stone-700">Public Bus Commute</label>
                  <span className="text-xs font-semibold text-emerald-700 number-font">{inputs.distanceBus} km/mo</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="20"
                  value={inputs.distanceBus}
                  onChange={(e) => updateInput('distanceBus', Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-stone-700">Metro / Subway Commute</label>
                  <span className="text-xs font-semibold text-emerald-700 number-font">{inputs.distanceMetro} km/mo</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="20"
                  value={inputs.distanceMetro}
                  onChange={(e) => updateInput('distanceMetro', Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-stone-700">Intercity Rail Trains</label>
                  <span className="text-xs font-semibold text-emerald-700 number-font">{inputs.distanceTrain} km/mo</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={inputs.distanceTrain}
                  onChange={(e) => updateInput('distanceTrain', Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-stone-700">Flights / Plane distance</label>
                  <span className="text-xs font-semibold text-emerald-700 number-font">{inputs.distanceFlight} km/mo</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="200"
                  value={inputs.distanceFlight}
                  onChange={(e) => updateInput('distanceFlight', Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <p className="text-[10px] text-stone-400">Long air travel releases approx 0.25 kg CO₂/km per flyer</p>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'energy' && (
          <div className="space-y-6">
            <h3 className="font-bold text-stone-800 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Electricity & Home Thermal Utilities</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-stone-700">Monthly Power Bill (kWh)</label>
                  <span className="text-xs font-semibold text-emerald-700 number-font">{inputs.electricityKwh} kWh</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="800"
                  step="10"
                  value={inputs.electricityKwh}
                  onChange={(e) => updateInput('electricityKwh', Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <p className="text-[10px] text-stone-400">Equivalent to {(inputs.electricityKwh * 0.82).toFixed(1)} kg CO₂ emissions</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-stone-700">LPG gas cylinders used</label>
                  <span className="text-xs font-semibold text-emerald-700 number-font">{inputs.lpgKg} kg / month</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={inputs.lpgKg}
                  onChange={(e) => updateInput('lpgKg', Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-stone-700">Air Conditioner usage time</label>
                  <span className="text-xs font-semibold text-emerald-700 number-font">{inputs.acHours} hours / day</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="0.5"
                  value={inputs.acHours}
                  onChange={(e) => updateInput('acHours', Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200/60 mt-4">
                  <input
                    type="checkbox"
                    id="hasSolar"
                    checked={inputs.hasSolar}
                    onChange={(e) => updateInput('hasSolar', e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                  />
                  <div className="cursor-pointer" onClick={() => updateInput('hasSolar', !inputs.hasSolar)}>
                    <label className="block text-xs font-bold text-stone-800 cursor-pointer">I have solar panels installed</label>
                    <span className="text-[10px] text-stone-500">Enable clean renewable power off-setting credits!</span>
                  </div>
                </div>

                {inputs.hasSolar && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-xs font-semibold text-stone-700">Solar generation offset</label>
                      <span className="text-xs font-semibold text-emerald-700 number-font">{inputs.solarGenerationKwh} kWh / month</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="400"
                      step="10"
                      value={inputs.solarGenerationKwh}
                      onChange={(e) => updateInput('solarGenerationKwh', Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'food' && (
          <div className="space-y-6">
            <h3 className="font-bold text-stone-800 text-sm flex items-center gap-2">
              <Apple className="w-4 h-4 text-emerald-600" />
              <span>Food choices & Agriculture Carbon factor</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-700">Standard diet profiles</label>
                <select
                  value={inputs.dietType}
                  onChange={(e) => updateInput('dietType', e.target.value as any)}
                  className="w-full text-sm font-medium border border-stone-200 rounded-xl px-3 py-2 bg-white focus:outline-emerald-600"
                >
                  <option value="beef_heavy">Beef Heavy (eating steak/cattle meat high frequency)</option>
                  <option value="meat_moderate">Meat Moderate (balanced pork, poultry, and vegetarian plates)</option>
                  <option value="chicken_poultry">Chicken/Poultry focus (avoiding heavy beef/lamb crops)</option>
                  <option value="vegetarian">Vegetarian (pure eggs, cheese, crops - no meat carcasses)</option>
                  <option value="vegan">Vegan (entirely plant-based organic meals)</option>
                </select>
                <p className="text-[10px] text-stone-400">Diet choices have a massive impact: Beef creates almost 15x more emissions than vegan options.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-700">Weekly organic food waste volume</label>
                <select
                  value={inputs.foodWasteLevel}
                  onChange={(e) => updateInput('foodWasteLevel', e.target.value as any)}
                  className="w-full text-sm font-medium border border-stone-200 rounded-xl px-3 py-2 bg-white focus:outline-emerald-600"
                >
                  <option value="high">High (throwing out leftovers, expired pantry items regularly)</option>
                  <option value="medium">Medium (some food rot, occasionally discarded crops)</option>
                  <option value="low">Low (meticulously meal planning, total composting, zero leftovers)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'lifestyle' && (
          <div className="space-y-6">
            <h3 className="font-bold text-stone-800 text-sm flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span>Consumption & Circular sorting habits</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-700">Monthly consumer shopping (garments, plastics, gadgets)</label>
                <select
                  value={inputs.shoppingLevel}
                  onChange={(e) => updateInput('shoppingLevel', e.target.value as any)}
                  className="w-full text-sm font-medium border border-stone-200 rounded-xl px-3 py-2 bg-white focus:outline-emerald-600"
                >
                  <option value="heavy">Heavy (frequent clothing lookups, electronics purchases)</option>
                  <option value="moderate">Moderate (standard wardrobe maintenance, deliberate tech buys)</option>
                  <option value="light">Light (minimalist, relying mostly on second-hand goods)</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-stone-700">Landfill Garbage bags thrown out</label>
                  <span className="text-xs font-semibold text-emerald-700 number-font">{inputs.wasteBagsCount} bag(s) / week</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="1"
                  value={inputs.wasteBagsCount}
                  onChange={(e) => updateInput('wasteBagsCount', Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200/60">
                  <input
                    type="checkbox"
                    id="recyclesActive"
                    checked={inputs.recyclesActive}
                    onChange={(e) => updateInput('recyclesActive', e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                  />
                  <div className="cursor-pointer" onClick={() => updateInput('recyclesActive', !inputs.recyclesActive)}>
                    <label className="block text-xs font-bold text-stone-800 cursor-pointer">I diligently sort cardboard, tin, glass and separate plastic waste</label>
                    <span className="text-[10px] text-stone-500">Recycling actively awards you credit offsetting solid waste footprints.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-stone-500 text-xs">
            <Info className="w-4.5 h-4.5 text-stone-400 shrink-0" />
            <span>Updates affect local records. Fill out other tabs before saving!</span>
          </div>

          <div className="flex gap-3 w-full sm:w-auto justify-end">
            {activeSubTab !== 'lifestyle' ? (
              <button
                type="button"
                onClick={() => {
                  const tabs: Array<'transport' | 'energy' | 'food' | 'lifestyle'> = ['transport', 'energy', 'food', 'lifestyle'];
                  const currentIndex = tabs.indexOf(activeSubTab);
                  setActiveSubTab(tabs[currentIndex + 1]);
                }}
                className="flex items-center justify-center gap-2 py-2 px-5 text-xs font-bold text-stone-700 bg-stone-100 rounded-xl hover:bg-stone-200 transition-all cursor-pointer"
              >
                <span>Next Section</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center justify-center gap-2 py-2.5 px-6 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-all cursor-pointer shadow-md shadow-emerald-600/15"
              >
                <Save className="w-4 h-4" />
                <span>Save Calculation Record</span>
              </button>
            )}
          </div>
        </div>
      </form>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs space-y-1 mt-4 animate-fade-in flex items-center justify-between gap-4">
          <div>
            <span className="font-bold block">🎉 Record Locked into History!</span>
            <span>Your calculated footprint of {realtimeStats.total.toFixed(0)} kg CO₂ has been recorded inside your local browser database. Check your tracker graph!</span>
          </div>
          <button 
            type="button" 
            onClick={() => setSaveSuccess(false)}
            className="text-emerald-500 hover:text-emerald-700 font-bold px-2"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
