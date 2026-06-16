import React, { useState } from 'react';
import { Calendar, Plus, Info, Check, Trash2 } from 'lucide-react';
import { FootprintRecord, CarbonInputs } from '../types';

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
    let color = 'bg-stone-100 hover:bg-stone-200 text-stone-500 border-stone-200';
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

  return (
    <div className="bg-white border border-stone-200/85 rounded-2xl p-6 shadow-sm" id="carbon_calendar_container">
      <div className="pb-4 border-b border-stone-100 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Carbon Intensity Calendar</h2>
          <p className="text-xs text-stone-500 font-medium font-sans">Inspect daily emissions and add logs to track consistency parameters</p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 text-emerald-600">
          <Calendar className="w-5 h-5" />
        </div>
      </div>

      {/* Grid of the 7 Days of the Week */}
      <div className="grid grid-cols-2 sm:grid-cols-7 gap-3 mb-8">
        {daysOfWeek.map((day, idx) => {
          const isSelected = selectedDayOffset === idx;
          const cardInfo = dailyLogsMap[day.dateString];
          
          return (
            <button
              key={day.dateString}
              type="button"
              onClick={() => setSelectedDayOffset(idx)}
              className={`border rounded-xl p-3 flex flex-col items-center justify-between transition-all select-none gap-2 text-center relative ${cardInfo.color} ${
                isSelected 
                  ? 'ring-2 ring-emerald-600 ring-offset-2 scale-102 font-semibold shadow-sm' 
                  : ''
              }`}
            >
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{day.dayName}</span>
              <span className="text-2xl font-bold tracking-tight number-font leading-none">{day.dayNum}</span>
              <span className="text-[10px] opacity-75 font-semibold text-stone-500">{day.monthName}</span>
              <div className="text-sm mt-1">{cardInfo.indicator}</div>
              <span className="text-[10px] text-stone-500 block font-sans truncate w-full">{cardInfo.valStr}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Day Inspector & Log Panel */}
        <div className="lg:col-span-6 bg-stone-50 p-6 rounded-xl border border-stone-200/60 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-stone-200">
            <div>
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">{activeDay.dayName}, {activeDay.monthName} {activeDay.dayNum}</span>
              <h3 className="text-sm font-bold text-stone-800">Daily Footprint Summary</h3>
            </div>
            {currentDayLog && (
              <button
                type="button"
                onClick={() => onDeleteRecord(currentDayLog.id)}
                className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                title="Delete this daily record"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {currentDayLog ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg border border-stone-200 text-center">
                  <p className="text-[10px] text-stone-400 font-semibold uppercase">Commute</p>
                  <p className="text-base font-bold text-stone-800 number-font">{currentDayLog.transport} kg</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-stone-200 text-center">
                  <p className="text-[10px] text-stone-400 font-semibold uppercase">Power</p>
                  <p className="text-base font-bold text-stone-800 number-font">{currentDayLog.energy} kg</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-stone-200 text-center">
                  <p className="text-[10px] text-stone-400 font-semibold uppercase">Diet Crops</p>
                  <p className="text-base font-bold text-stone-800 number-font">{currentDayLog.food} kg</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-stone-200 text-center">
                  <p className="text-[10px] text-stone-400 font-semibold uppercase">Lifestyle</p>
                  <p className="text-base font-bold text-stone-800 number-font">{currentDayLog.lifestyle} kg</p>
                </div>
              </div>

              <div className="bg-emerald-600 text-white p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs opacity-75 font-medium">Daily Aggregate:</span>
                  <p className="text-lg font-bold number-font">{currentDayLog.total.toFixed(1)} kg CO₂</p>
                </div>
                <span className="text-sm font-bold bg-white-custom py-1 px-3 text-stone-900 rounded-lg">
                  {dailyLogsMap[activeDay.dateString].label}
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-stone-500 font-medium mb-1">No footprint recorded for this day. Enter raw parameters below to calculate:</p>

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
                    className="w-full text-xs border border-stone-200 rounded-lg p-2 bg-white font-medium"
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
                    className="w-full text-xs border border-stone-200 rounded-lg p-2 bg-white font-medium"
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
                    className="w-full text-xs border border-stone-200 rounded-lg p-2 bg-white font-medium"
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
                    className="w-full text-xs border border-stone-200 rounded-lg p-2 bg-white font-medium"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2  px-4 text-xs font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Save Daily Emission Entry</span>
              </button>

              {successMsg && (
                <p className="text-[10px] text-center text-emerald-600 font-semibold animate-pulse">
                  ✓ Daily footprint logged successfully!
                </p>
              )}
            </form>
          )}
        </div>

        {/* Legend / Info box */}
        <div className="lg:col-span-6 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Understanding Intensity Colors</h4>
          
          <div className="space-y-3">
            <div className="flex gap-3 items-start bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
              <span className="text-xl shrink-0">🟢</span>
              <div>
                <p className="text-xs font-bold text-stone-700">Under 8 kg CO₂ / day</p>
                <p className="text-[10px] text-stone-500">Exceptional rating. Indicates walking, high use of public transit, minimal organic carbon food plates, and strict energy savings.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
              <span className="text-xl shrink-0">🟡</span>
              <div>
                <p className="text-xs font-bold text-stone-700">8 to 20 kg CO₂ / day</p>
                <p className="text-[10px] text-stone-500">Standard range. Typical parameters for utility users who sort glass/plastic but occasionally commute in petrol/diesel engines.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start bg-rose-50/50 p-2.5 rounded-lg border border-rose-100">
              <span className="text-xl shrink-0">🔴</span>
              <div>
                <p className="text-xs font-bold text-stone-700">Above 20 kg CO₂ / day</p>
                <p className="text-[10px] text-stone-500">Elevated output. Caused by intensive airplane passenger flights, daily solo driving, or heavy red meat portions.</p>
              </div>
            </div>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl text-stone-500 text-[11px] leading-relaxed flex gap-2 border border-stone-200/60 mt-4">
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
