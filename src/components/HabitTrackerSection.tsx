import React, { useState } from 'react';
import { DailyHabits } from '../types';
import { Flame, CheckCircle, RefreshCw, Milestone, Trophy } from 'lucide-react';

interface HabitTrackerSectionProps {
  currentHabits: DailyHabits;
  onToggleHabit: (habitKey: keyof Omit<DailyHabits, 'date'>) => void;
  streak: number;
  points: number;
  badgesEarned: string[];
  allBadges: Array<{ id: string; title: string; description: string; iconName: string; unlockedLabel: string }>;
}

export const HabitTrackerSection: React.FC<HabitTrackerSectionProps> = ({
  currentHabits,
  onToggleHabit,
  streak,
  points,
  badgesEarned,
  allBadges
}) => {
  const [habitConfetti, setHabitConfetti] = useState<string | null>(null);

  const habitsList = [
    {
      key: 'usedPublicTransport' as const,
      title: 'Swapped single car travel for Transit',
      description: 'Used public transport, micro-mobility, electric trains, or carpools for commutes.',
      points: 20
    },
    {
      key: 'bikedOrWalked' as const,
      title: 'Self-powered mobility (Walked / Biked)',
      description: 'Chose active transportation, walking, biking, or running for local trips to zero out vehicular carbon.',
      points: 20
    },
    {
      key: 'savedElectricity' as const,
      title: 'Shut off non-essential appliances & AC',
      description: 'Terminated phantom standby devices, or raised thermostat setting threshold to 24°C.',
      points: 10
    },
    {
      key: 'unpluggedVampireLoads' as const,
      title: 'Unplugged vampire & phantom loads',
      description: 'Unplugged phone chargers, microwave clocks, or sleeping laptops to eliminate idle power draw.',
      points: 10
    },
    {
      key: 'recycledWaste' as const,
      title: 'Sorted cardboard, metal, glass, and paper',
      description: 'Deliberately cleaned and organized household recyclables to support the circular economy.',
      points: 10
    },
    {
      key: 'compostedScraps' as const,
      title: 'Composted kitchen scrap organic waste',
      description: 'Diverted organic fruit and vegetable peels to household or community backyard compost systems.',
      points: 10
    },
    {
      key: 'avoidedFoodWaste' as const,
      title: 'Prevented food scraps & spoilage discards',
      description: 'Prepared meals meticulously from the pantry, stored leftovers, leaving zero organic decay bags.',
      points: 10
    },
    {
      key: 'usedBottleOrCup' as const,
      title: 'Brought reusable water bottle / coffee cup',
      description: 'Refused single-use PET bottles, plastic straws, or paper cups to halt production line extraction.',
      points: 10
    },
    {
      key: 'atePlantBased' as const,
      title: 'Chose entirely plant-based meals today',
      description: 'Opted for beans, nuts, plant-forward veggies, kelp, or whole grains, completely avoiding livestock products.',
      points: 10
    },
    {
      key: 'washedColdWater' as const,
      title: 'Washed laundry clothes in cold water',
      description: 'Skipped waterheating electricity cycles to reduce household energy draw by up to 90% per laundry cycle.',
      points: 10
    }
  ];

  const handleCheckboxChanged = (key: keyof Omit<DailyHabits, 'date'>, pts: number) => {
    onToggleHabit(key);
    if (!currentHabits[key]) {
      // User is checking the box
      setHabitConfetti(key);
      setTimeout(() => setHabitConfetti(null), 1500);
    }
  };
  return (
    <div className="space-y-6" id="habit_tracker_section_container">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Checklist */}
        <div className="lg:col-span-7 bg-white border border-slate-200/70 rounded-[32px] p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Daily Eco Action Checklist</h2>
              <p className="text-xs text-slate-400 font-medium">Earn daily environmental points by checking off micro-actions today</p>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 py-1.5 px-3 rounded-full font-bold text-xs">
              <Flame className="w-4 h-4 fill-current animate-bounce" />
              <span className="number-font">{streak} Day Streak</span>
            </div>
          </div>

          <div className="space-y-4">
            {habitsList.map(item => {
              const checked = !!currentHabits[item.key];
              const isAnimating = habitConfetti === item.key;
              
              return (
                <div
                  key={item.key}
                  onClick={() => handleCheckboxChanged(item.key, item.points)}
                  className={`border rounded-2xl p-4 flex items-start gap-4 transition-all cursor-pointer relative overflow-hidden select-none ${
                    checked 
                      ? 'border-emerald-200 bg-emerald-50/40 shadow-xs' 
                      : 'border-slate-200 hover:border-slate-405 hover:bg-slate-50'
                  }`}
                >
                  <div className="pt-0.5">
                    <div className={`w-5.5 h-5.5 rounded-md border flex items-center justify-center transition-all ${
                      checked 
                        ? 'bg-emerald-600 border-emerald-600 text-white' 
                        : 'border-slate-300 bg-white'
                    }`}>
                      {checked && <CheckCircle className="w-4.5 h-4.5 fill-current" />}
                    </div>
                  </div>

                  <div className="space-y-1 pr-12">
                    <p className={`text-xs font-bold leading-none ${checked ? 'text-emerald-950 font-black' : 'text-slate-850'}`}>
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium leading-normal font-sans2">
                      {item.description}
                    </p>
                  </div>

                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-right">
                    <span className={`text-[10px] font-bold py-1 px-2.5 rounded-full border transition-all ${
                      checked
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                        : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}>
                      +{item.points} pts
                    </span>
                  </div>

                  {isAnimating && (
                    <div className="absolute inset-0 bg-emerald-600/10 flex items-center justify-center animate-pulse pointer-events-none">
                      <span className="text-emerald-700 font-extrabold text-xs tracking-wider number-font animate-bounce">+ {item.points} POINTS RECORDED!</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl text-slate-500 text-xs flex gap-2.5 border border-slate-200/60 leading-relaxed font-sans">
            <RefreshCw className="w-4.5 h-4.5 text-slate-400 shrink-0 mt-0.5" />
            <p>
              Your habits checklist resets every night. Make sorting recycling, saving power, and taking public transit a repeated custom to unlock high-tier badges!
            </p>
          </div>
        </div>

        {/* Gamification, Milestones & Badges Shelf */}
        <div className="lg:col-span-5 bg-white border border-slate-200/70 rounded-[32px] p-8 shadow-xs flex flex-col justify-between">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your Badges</h2>
              <p className="text-xs text-slate-400 font-medium">Verify credentials and climate protector statuses earned</p>
            </div>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Trophy className="w-4.5 h-4.5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 my-6">
            {allBadges.map(badge => {
              const isEarned = badgesEarned.includes(badge.id);
              
              return (
                <div 
                  key={badge.id} 
                  title={badge.description}
                  className={`border rounded-2xl p-3.5 text-center flex flex-col items-center justify-center space-y-2 transition-all relative group cursor-help ${
                    isEarned
                      ? 'bg-white border-slate-250 shadow-xs'
                      : 'bg-slate-50/50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all ${
                    isEarned
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                      : 'bg-slate-200 text-slate-400 border-slate-300'
                  }`}>
                    {/* Display first letter of Badge as graphic */}
                    <span className="font-extrabold text-sm tracking-tighter uppercase">{badge.title.substring(0, 2)}</span>
                  </div>

                  <div>
                    <p className={`text-[11px] font-bold ${isEarned ? 'text-slate-800' : 'text-slate-500'}`}>{badge.title}</p>
                    <p className="text-[9px] text-slate-400 leading-tight mt-0.5 line-clamp-2">{badge.description}</p>
                  </div>

                  {isEarned && (
                    <span className="text-[8px] bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded-full uppercase scale-90">
                      {badge.unlockedLabel}
                    </span>
                  )}

                  {!isEarned && (
                    <span className="text-[8px] bg-slate-100 border border-slate-200 text-slate-450 font-semibold px-1.5 py-0.5 rounded-full uppercase scale-90">
                      Locked
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-4 flex gap-3 text-xs justify-between font-bold">
            <span className="text-slate-500">Current Total:</span>
            <span className="text-slate-800 font-black number-font">{points} / 500 Environment Points</span>
          </div>
        </div>
      </div>
    </div>
  );
};
