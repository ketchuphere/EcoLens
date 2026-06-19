import React, { useState } from 'react';
import { Calendar, Plus, Info, Trash2, Car, Zap, Apple, ShoppingBag, HelpCircle } from 'lucide-react';
import { FootprintRecord } from '../../types';

interface ActivityCalendarProps {
  records: FootprintRecord[];
  onAddDailyLog: (date: string, transport: number, energy: number, food: number, lifestyle: number) => void;
  onDeleteRecord: (id: string) => void;
}

export const ActivityCalendar: React.FC<ActivityCalendarProps> = ({
  records,
  onAddDailyLog,
  onDeleteRecord
}) => {
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);
  const [customTransport, setCustomTransport] = useState<string>('5.0');
  const [customEnergy, setCustomEnergy] = useState<string>('4.0');
  const [customFood, setCustomFood] = useState<string>('3.5');
  const [customLifestyle, setCustomLifestyle] = useState<string>('2.5');
  const [successMsg, setSuccessMsg] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState<'commute' | 'utility' | 'diet' | 'goods'>('commute');

  // Generate last 7 calendar days
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return {
      dateString: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      monthName: d.toLocaleDateString('en-US', { month: 'short' })
    };
  }).reverse();

  const activeDay = daysOfWeek[selectedDayOffset];

  // Match existing daily records for the calendar dates
  const dailyLogsMap = daysOfWeek.reduce((acc, d) => {
    const record = records.find(r => r.isDaily && r.date === d.dateString);
    let color = 'bg-stone-50 hover:bg-stone-100 text-stone-500 border-stone-200/80';
    let label = 'No records log';
    let indicator = '⚪';
    let valStr = 'Logged: 0 kg';

    if (record) {
      valStr = `Total: ${record.total.toFixed(1)} kg`;
      if (record.total < 8) {
        color = 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100/70';
        label = 'Low Emissions 🟢';
        indicator = '🟢';
      } else if (record.total <= 20) {
        color = 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100/70';
        label = 'Moderate Emissions 🟡';
        indicator = '🟡';
      } else {
        color = 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100/70';
        label = 'High Emissions 🔴';
        indicator = '🔴';
      }
    }

    acc[d.dateString] = { record, color, label, indicator, valStr };
    return acc;
  }, {} as Record<string, { record?: FootprintRecord; color: string; label: string; indicator: string; valStr: string }>);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = Number(customTransport) || 0;
    const eg = Number(customEnergy) || 0;
    const f = Number(customFood) || 0;
    const l = Number(customLifestyle) || 0;

    onAddDailyLog(activeDay.dateString, t, eg, f, l);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const currentDayLog = dailyLogsMap[activeDay.dateString]?.record;

  const todayString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedActiveDate = new Date(activeDay.dateString + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white border border-stone-200/90 rounded-[24px] p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden" id="carbon_calendar_container">
      {/* Decorative top ambient bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-400 via-teal-500 to-amber-400" />
      
      <div className="pb-5 border-b border-stone-100 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">Carbon Intensity Calendar</h2>
            <span className="hidden sm:inline bg-stone-100 text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">7-Day Tracker</span>
          </div>
          <p className="text-xs text-stone-500 font-medium">Inspect daily emissions and add logs to track consistency parameters</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Real today's Date badge */}
          <div className="text-[11.5px] font-bold text-emerald-700 bg-emerald-50/80 border border-emerald-100 px-3.5 py-1.5 rounded-full shrink-0 flex items-center gap-1.5 shadow-3xs cursor-default">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Today is {todayString}</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 text-emerald-600">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid of the 7 Days of the Week */}
      <div className="grid grid-cols-2 sm:grid-cols-7 gap-3 mb-8 font-sans">
        {daysOfWeek.map((day, idx) => {
          const isSelected = selectedDayOffset === idx;
          const cardInfo = dailyLogsMap[day.dateString];
          
          return (
            <button
              key={day.dateString}
              type="button"
              onClick={() => setSelectedDayOffset(idx)}
              className={`border rounded-xl p-3 flex flex-col items-center justify-between transition-all select-none gap-2 text-center relative cursor-pointer ${cardInfo.color} ${
                isSelected 
                  ? 'ring-2 ring-emerald-600 ring-offset-2 scale-102 font-semibold shadow-xs' 
                  : 'opacity-90 hover:opacity-100 shadow-3xs'
              }`}
            >
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{day.dayName}</span>
              <span className="text-2xl font-black tracking-tight number-font leading-none">{day.dayNum}</span>
              <span className="text-[10px] opacity-75 font-semibold text-stone-500">{day.monthName}</span>
              <div className="text-sm mt-1">{cardInfo.indicator}</div>
              <span className="text-[10px] text-stone-500 block truncate w-full">{cardInfo.valStr}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
        {/* Day Inspector & Log Panel */}
        <div className="lg:col-span-6 bg-stone-50 p-6 rounded-2xl border border-stone-200/60 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-stone-200">
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">{formattedActiveDate}</span>
              <h3 className="text-sm font-extrabold text-stone-800">Daily Footprint Summary</h3>
            </div>
            {currentDayLog && (
              <button
                type="button"
                onClick={() => onDeleteRecord(currentDayLog.id)}
                className="text-stone-400 hover:text-rose-600 transition-colors p-1 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
                title="Delete this daily record"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {currentDayLog ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg border border-stone-200/80 text-center">
                  <p className="text-[10px] text-stone-400 font-semibold uppercase">Commute</p>
                  <p className="text-base font-bold text-stone-800 number-font">{currentDayLog.transport} kg</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-stone-200/80 text-center">
                  <p className="text-[10px] text-stone-400 font-semibold uppercase">Power</p>
                  <p className="text-base font-bold text-stone-800 number-font">{currentDayLog.energy} kg</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-stone-200/80 text-center">
                  <p className="text-[10px] text-stone-400 font-semibold uppercase">Diet Crops</p>
                  <p className="text-base font-bold text-stone-800 number-font">{currentDayLog.food} kg</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-stone-200/80 text-center">
                  <p className="text-[10px] text-stone-400 font-semibold uppercase">Lifestyle</p>
                  <p className="text-base font-bold text-stone-800 number-font">{currentDayLog.lifestyle} kg</p>
                </div>
              </div>

              <div className="bg-emerald-600 text-white p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] opacity-75 font-semibold block">DAILY AGGREGATE</span>
                  <p className="text-xl font-extrabold number-font">{currentDayLog.total.toFixed(1)} kg CO₂</p>
                </div>
                <span className="text-xs font-black bg-stone-900 border border-stone-800 py-1.5 px-3 text-emerald-300 rounded-lg">
                  {dailyLogsMap[activeDay.dateString].label}
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-stone-500 font-medium mb-1">No footprint recorded for this day. Enter raw parameters below (use our measurement formulas on the right to estimate accurately!):</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-stone-600">Transport/Driving CO₂ (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g. 5.1"
                    value={customTransport}
                    onChange={(e) => setCustomTransport(e.target.value)}
                    className="w-full text-xs border border-stone-200 rounded-lg p-2 bg-white font-medium focus:outline-emerald-600"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-stone-600">Electricity/AC CO₂ (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g. 3.0"
                    value={customEnergy}
                    onChange={(e) => setCustomEnergy(e.target.value)}
                    className="w-full text-xs border border-stone-200 rounded-lg p-2 bg-white font-medium focus:outline-emerald-600"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-stone-600">Dietary Choices CO₂ (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g. 4.0"
                    value={customFood}
                    onChange={(e) => setCustomFood(e.target.value)}
                    className="w-full text-xs border border-stone-200 rounded-lg p-2 bg-white font-medium focus:outline-emerald-600"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-stone-600">Goods/Shopping CO₂ (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g. 2.5"
                    value={customLifestyle}
                    onChange={(e) => setCustomLifestyle(e.target.value)}
                    className="w-full text-xs border border-stone-200 rounded-lg p-2 bg-white font-medium focus:outline-emerald-600"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-all cursor-pointer shadow-3xs"
              >
                <Plus className="w-4 h-4" />
                <span>Save Daily Emission Entry</span>
              </button>

              {successMsg && (
                <p className="text-[10px] text-center text-emerald-600 font-semibold animate-pulse font-sans">
                  ✓ Daily footprint logged successfully!
                </p>
              )}
            </form>
          )}
        </div>

        {/* Legend / Info box / Measurement Guide */}
        <div className="lg:col-span-6 space-y-5">
          {/* Interactive Parameters Measurement Guide */}
          <div className="bg-stone-50 border border-stone-200/70 p-5 rounded-2xl">
            <div className="flex items-center gap-1.5 pb-2 border-b border-stone-200 mb-3">
              <HelpCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-stone-800">How to Measure Parameters</h4>
            </div>
            
            <p className="text-[10.5px] text-stone-500 mb-3.5 leading-normal">
              Need help calculating your daily inputs? Choose a metric below to fetch standard values or calculate via regional conversion multipliers.
            </p>

            {/* Guide Tabs */}
            <div className="flex bg-stone-200/50 p-1 rounded-xl mb-4 gap-1">
              {[
                { id: 'commute', label: 'Commute', icon: Car },
                { id: 'utility', label: 'Utility', icon: Zap },
                { id: 'diet', label: 'Dietary', icon: Apple },
                { id: 'goods', label: 'Lifestyle', icon: ShoppingBag }
              ].map(tab => {
                const TabIcon = tab.icon;
                const isActive = activeGuideTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveGuideTab(tab.id as any)}
                    className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-[9.5px] font-extrabold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-white text-emerald-800 shadow-3xs border border-stone-200/10 font-bold' 
                        : 'text-stone-500 hover:text-stone-800 hover:bg-stone-200/30'
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Guide Content Display */}
            <div className="bg-white border border-stone-200/50 p-4 rounded-xl space-y-3">
              {activeGuideTab === 'commute' && (
                <div>
                  <h5 className="text-[11px] font-extrabold text-stone-800 mb-1 flex items-center justify-between">
                    <span>🚗 Commute & Transit Formula</span>
                    <span className="text-[10px] font-mono text-emerald-600 italic">kg = km travel × factor</span>
                  </h5>
                  <p className="text-[10px] text-stone-500 mb-2 leading-relaxed">
                    Estimate distance traveled utilizing various commuter options to evaluate transport impact:
                  </p>
                  <ul className="text-[10px] text-stone-600 space-y-1.5 list-disc pl-3">
                    <li><strong>Solo Petrol/Diesel Car:</strong> <span className="font-mono bg-stone-100 px-1 py-0.2 rounded font-bold">0.18 kg CO₂ per km</span> (e.g., 20 km = 3.6 kg CO₂)</li>
                    <li><strong>Hybrid/Small Car:</strong> <span className="font-mono bg-stone-100 px-1 py-0.2 rounded font-bold">0.10 kg CO₂ per km</span> (e.g., 20 km = 2.0 kg CO₂)</li>
                    <li><strong>Electric Train / Metro:</strong> <span className="font-mono bg-stone-100 px-1 py-0.2 rounded font-bold">0.05 kg CO₂ per km</span></li>
                    <li><strong>Public Bus Transit:</strong> <span className="font-mono bg-stone-100 px-1 py-0.2 rounded font-bold">0.08 kg CO₂ per km</span></li>
                    <li><strong>Walk, Run, Bicycle:</strong> <span className="text-emerald-600 font-bold">0.00 kg CO₂</span> (Extinguished output!)</li>
                  </ul>
                </div>
              )}

              {activeGuideTab === 'utility' && (
                <div>
                  <h5 className="text-[11px] font-extrabold text-stone-800 mb-1 flex items-center justify-between">
                    <span>⚡ Electricity & Appliance Formula</span>
                    <span className="text-[10px] font-mono text-emerald-600 italic">kg = kWh power × 0.40</span>
                  </h5>
                  <p className="text-[10px] text-stone-500 mb-2 leading-relaxed">
                    Calculate electricity consumption values or assess active HVAC cooling usage rates:
                  </p>
                  <ul className="text-[10px] text-stone-600 space-y-1.5 list-disc pl-3">
                    <li><strong>Standard grid electricity:</strong> <span className="font-mono bg-stone-100 px-1 py-0.2 rounded font-bold">0.40 kg CO₂ per kWh</span> (e.g., 10 kWh = 4.0 kg)</li>
                    <li><strong>Air Conditioner Run (AC):</strong> <span className="font-mono bg-stone-100 px-1 py-0.2 rounded font-bold">0.50 kg CO₂ per hour active</span> (based on average 1200W unit draw)</li>
                    <li><strong>Solar Panels offset credits:</strong> <span className="text-emerald-600 font-bold">-0.40 kg per kWh generated</span></li>
                  </ul>
                </div>
              )}

              {activeGuideTab === 'diet' && (
                <div>
                  <h5 className="text-[11px] font-extrabold text-stone-800 mb-1 flex items-center justify-between">
                    <span>🥗 Dietary Carbon footprint multipliers</span>
                    <span className="text-[10px] font-mono text-emerald-600 italic">Flat rate per day</span>
                  </h5>
                  <p className="text-[10px] text-stone-500 mb-2 leading-relaxed">
                    Plate composition footprint estimates based on livestock feed extraction rates:
                  </p>
                  <ul className="text-[10px] text-stone-600 space-y-1.5 list-disc pl-3">
                    <li><strong>Vegan (All plant-forward):</strong> <span className="font-mono bg-stone-100 px-1 py-0.2 rounded font-bold">2.5 kg CO₂ / day</span></li>
                    <li><strong>Vegetarian (Grains, eggs, cheese):</strong> <span className="font-mono bg-stone-100 px-1 py-0.2 rounded font-bold">3.8 kg CO₂ / day</span></li>
                    <li><strong>Moderate Meat (Poultry/Fish meals):</strong> <span className="font-mono bg-stone-100 px-1 py-0.2 rounded font-bold">5.5 kg CO₂ / day</span></li>
                    <li><strong>Heavy Meat (Beef/Lamb portions):</strong> <span className="font-mono bg-stone-100 px-1 py-0.2 rounded font-bold">7.2 kg CO₂ / day</span></li>
                  </ul>
                </div>
              )}

              {activeGuideTab === 'goods' && (
                <div>
                  <h5 className="text-[11px] font-extrabold text-stone-800 mb-1 flex items-center justify-between">
                    <span>🛍️ Goods & Consumption estimates</span>
                    <span className="text-[10px] font-mono text-emerald-600 italic">Incremental offsets</span>
                  </h5>
                  <p className="text-[10px] text-stone-500 mb-2 leading-relaxed">
                    Evaluate consumption levels and physical material disposal items:
                  </p>
                  <ul className="text-[10px] text-stone-600 space-y-1.5 list-disc pl-3">
                    <li><strong>Standard Trash Bag (30L bin):</strong> <span className="font-mono bg-stone-100 px-1 py-0.2 rounded font-bold">1.50 kg CO₂ per bag</span></li>
                    <li><strong>Composting waste diversion:</strong> <span className="text-emerald-600 font-bold">-0.50 kg check credit</span></li>
                    <li><strong>Fast Apparel shipping order:</strong> <span className="font-mono bg-stone-100 px-1 py-0.2 rounded font-bold">8.00 kg CO₂ per item package</span></li>
                    <li><strong>Consumer Electronics:</strong> <span className="font-mono bg-stone-100 px-1 py-0.2 rounded font-bold">50.00 kg CO₂ per item purchase</span></li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">Understanding Intensity Colors</h4>
            <div className="space-y-3">
              <div className="flex gap-3 items-start bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                <span className="text-xl shrink-0">🟢</span>
                <div>
                  <p className="text-xs font-bold text-stone-700">Under 8 kg CO₂ / day</p>
                  <p className="text-[10px] text-stone-500">Exceptional rating. Indicates walking, high use of public transit, minimal organic carbon food plates, and strict energy savings.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                <span className="text-xl shrink-0">🟡</span>
                <div>
                  <p className="text-xs font-bold text-stone-700">8 to 20 kg CO₂ / day</p>
                  <p className="text-[10px] text-stone-500">Standard range. Typical parameters for utility users who sort glass/plastic but occasionally commute in petrol/diesel engines.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start bg-rose-50/50 p-2.5 rounded-xl border border-rose-100">
                <span className="text-xl shrink-0">🔴</span>
                <div>
                  <p className="text-xs font-bold text-stone-700">Above 20 kg CO₂ / day</p>
                  <p className="text-[10px] text-stone-500">Elevated output. Caused by intensive airplane passenger flights, daily solo driving, or heavy red meat portions.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl text-stone-500 text-[11px] leading-relaxed flex gap-2 border border-stone-200/60">
            <Info className="w-4.5 h-4.5 text-stone-400 shrink-0 mt-0.5" />
            <p>
              Your weekly tracking is preserved locally. Accumulating green days triggers the <strong>Streak Master</strong> and <strong>Zero Waste Hero</strong> profile badges automatically!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
