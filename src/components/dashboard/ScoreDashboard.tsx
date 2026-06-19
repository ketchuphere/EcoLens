import React from 'react';
import { ResponsiveContainer, AreaChart, Area, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { FootprintRecord, UserGoal } from '../../types';
import { CarbonService } from '../../services/carbonService';
import { Target, Award, Leaf, ShieldAlert } from 'lucide-react';

interface ScoreDashboardProps {
  records: FootprintRecord[];
  goal: UserGoal;
  streak: number;
  points: number;
  badgesEarned: string[];
  allBadges: Array<{ id: string; title: string; description: string; iconName: string; unlockedLabel: string }>;
  onSetGoal: (percent: number) => void;
  onNavigateToTab: (tab: string) => void;
}

export const ScoreDashboard: React.FC<ScoreDashboardProps> = ({
  records,
  goal,
  streak,
  points,
  badgesEarned,
  allBadges,
  onSetGoal,
  onNavigateToTab
}) => {
  const latestRecord = records[0];

  // Calculate current score via centralized CarbonService
  const sustainabilityScore = latestRecord
    ? CarbonService.calculate(latestRecord.inputs).sustainabilityScore
    : 70; // fallback standard score

  // Determine levels
  let level = "Green Beginner";
  let nextLevelPoints = 100;
  
  if (points >= 250) {
    level = "Planet Protector";
    nextLevelPoints = 500;
  } else if (points >= 100) {
    level = "Eco Explorer";
    nextLevelPoints = 250;
  }

  // Categories Breakdown data
  const pieData = latestRecord
    ? [
        { name: 'Transport', value: latestRecord.transport, color: '#10b981' },
        { name: 'Energy', value: latestRecord.energy, color: '#3b82f6' },
        { name: 'Food', value: latestRecord.food, color: '#f59e0b' },
        { name: 'Lifestyle', value: latestRecord.lifestyle, color: '#ec4899' },
      ]
    : [
        { name: 'Transport', value: 180, color: '#10b981' },
        { name: 'Energy', value: 140, color: '#3b82f6' },
        { name: 'Food', value: 120, color: '#f59e0b' },
        { name: 'Lifestyle', value: 60, color: '#ec4899' },
      ];

  // Monthly trends data (reversing order to show chronologically left-to-right)
  const sortedRecords = [...records].reverse();
  const trendData = sortedRecords.length > 0
    ? sortedRecords.map(r => ({
        name: r.date,
        Total: r.total,
        Transport: r.transport,
        Energy: r.energy,
        Food: r.food,
        Lifestyle: r.lifestyle,
      }))
    : [
        { name: 'April', Total: 560, Transport: 210, Energy: 180, Food: 120, Lifestyle: 50 },
        { name: 'May', Total: 510, Transport: 190, Energy: 160, Food: 110, Lifestyle: 50 },
        { name: 'June', Total: 420, Transport: 150, Energy: 130, Food: 95, Lifestyle: 45 },
      ];

  // Compare to national average: e.g. 520 kg CO2 / month
  const averageMonthlyCO2 = 520;
  const _carbonStatus = latestRecord 
    ? latestRecord.total < averageMonthlyCO2 
      ? { text: 'Below average', color: 'text-emerald-700 bg-emerald-50 border-emerald-100', icon: Leaf }
      : { text: 'Above average', color: 'text-rose-700 bg-rose-50 border-rose-100', icon: ShieldAlert }
    : { text: 'Optimal status', color: 'text-stone-700 bg-stone-50 border-stone-100', icon: Target };

  const reductionPercent = records.length > 1
    ? (((records[1].total - records[0].total) / records[1].total) * 100).toFixed(1)
    : null;

  // Render score ring radial representation inside canvas
  const percentageScore = sustainabilityScore;

  // Dynamic Bento recommendations trigger
  let recommendationText = "Transportation accounts for 45% of your footprint. Shifting some drives to public transit or metro trains could save up to 40kg CO₂ this month.";
  let recommendationCategory = "Transportation Commutes";

  if (latestRecord) {
    const sumsArr = [
      { name: 'Transportation Commutes', value: latestRecord.transport, text: 'Transportation represents your highest emissions source. Shifting some drives to metro trains or bus transit saves substantial fuel bills.' },
      { name: 'Home Utility Energy', value: latestRecord.energy, text: 'Home utility grid power represents your top carbon output. Installing solar offsets or configuring eco thermostats can prevent up to 80kg CO₂.' },
      { name: 'Food & Nutrition', value: latestRecord.food, text: 'Food nutrition choices dominate your footprint. Transitioning to vegetable-focused meals or limiting heavy meat intake produces healthy carbon targets.' },
      { name: 'Lifestyle waste', value: latestRecord.lifestyle, text: 'Lifestyle solid wastes rate high. Mindful material sorting and composting organic food leftovers helps minimize landfill refuse methane.' }
    ];
    sumsArr.sort((a, b) => b.value - a.value);
    recommendationCategory = sumsArr[0].name;
    recommendationText = sumsArr[0].text;
  }

  // World rank indicator
  const rankText = sustainabilityScore >= 80 ? "Top 12%" : sustainabilityScore >= 60 ? "Top 22%" : "Top 38%";

  // Calculate goal parameters
  const currentVal = latestRecord ? latestRecord.total : goal.baselineEmissions;
  const original = goal.baselineEmissions || 480;
  const target = goal.targetEmissions || 380;
  const range = original - target;
  
  // A profile is unconfigured if there are no records, if the latest record is 0 kg, or if baseline emissions are set to 0.
  const isUnconfigured = !latestRecord || latestRecord.total === 0 || goal.baselineEmissions === 0;

  let progressPercent = 0;
  if (isUnconfigured) {
    progressPercent = 0;
  } else if (original > 0 && range > 0) {
    if (currentVal <= target) {
      progressPercent = 100;
    } else if (currentVal >= original) {
      progressPercent = 0;
    } else {
      progressPercent = Math.round(((original - currentVal) / range) * 100);
    }
  } else {
    progressPercent = 0;
  }

  return (
    <div className="space-y-6" id="score_dashboard_container">
      
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome to EcoLens</h1>
          <p className="text-slate-500 font-medium font-sans">
            {reductionPercent && Number(reductionPercent) > 0 
              ? `Your carbon footprint is ${reductionPercent}% lower than index average.` 
              : "Track, simulate, and optimize your monthly environmental output."}
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 px-4 rounded-full border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Sustainability Score</span>
          <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
            {sustainabilityScore} / 100
          </div>
        </div>
      </header>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* 1. Large Featured Card: Monthly Footprint Share Breakdown */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white rounded-[32px] p-8 shadow-xs border border-slate-200/70 flex flex-col justify-between min-h-[380px]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Monthly Footprint Share</h2>
              <p className="text-xs text-slate-400">Carbon share of transportation, utilities, food, and lifestyle</p>
            </div>
            <div className="bg-slate-100 p-2 rounded-xl text-slate-500 text-[10px] font-bold font-mono">
              v1.0.42
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 flex-grow">
            <div className="relative flex items-center justify-center w-40 h-40 shrink-0">
              {/* Responsive SVG radial ring gauge */}
              <svg className="w-full h-full -rotate-90">
                <circle cx="80" cy="80" r="70" fill="transparent" stroke="#f1f5f9" strokeWidth="11" />
                <circle 
                  cx="80" 
                  cy="80" 
                  r="70" 
                  fill="transparent" 
                  stroke="#10b981" 
                  strokeWidth="13" 
                  strokeDasharray="440" 
                  strokeDashoffset={440 - (440 * percentageScore) / 100} 
                  strokeLinecap="round" 
                  className="transition-all duration-1000" 
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-slate-900">{latestRecord ? latestRecord.total.toFixed(0) : '420'}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">kg CO₂</span>
              </div>
            </div>
            
            <div className="flex-grow w-full space-y-3">
              {pieData.map((item) => {
                const totalEmissions = pieData.reduce((acc, curr) => acc + curr.value, 0);
                const percent = totalEmissions > 0 ? ((item.value / totalEmissions) * 100).toFixed(0) : '25';
                return (
                  <div key={item.name} className="group">
                    <div className="flex justify-between text-xs mb-1 font-semibold">
                      <span className="text-slate-500 group-hover:text-slate-800 transition-colors">{item.name}</span>
                      <span className="font-bold text-slate-700">{item.value.toFixed(0)}kg <span className="text-slate-400 font-normal">({percent}%)</span></span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ backgroundColor: item.color, width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. Medium Card: Goal Progress (emerald-600 background) */}
        <div className="col-span-1 bg-emerald-800 rounded-[32px] p-6 text-white shadow-md flex flex-col justify-between min-h-[380px] transition-all hover:translate-y-[-2px]">
          <div>
            <h2 className="text-lg font-bold mb-1 flex items-center gap-1.5">
              <Target className="w-5 h-5 text-emerald-300" />
              <span>Reduction Goal</span>
            </h2>
            <p className="text-emerald-100 text-xs opacity-90 leading-normal">
              {isUnconfigured ? "No carbon parameters configured yet." : `Baseline: ${original.toFixed(0)}kg • Target: ${target.toFixed(0)}kg`}
            </p>
          </div>

          <div className="my-4">
            <div className="flex justify-between items-end mb-1">
              <span className="text-3xl font-black tracking-tight">{progressPercent}%</span>
              <span className={`text-[10px] uppercase font-mono tracking-wider font-extrabold ${isUnconfigured ? 'text-amber-300 animate-pulse' : 'text-emerald-300'}`}>
                {isUnconfigured ? 'Unconfigured' : progressPercent >= 100 ? 'Achieved!' : 'On Track'}
              </span>
            </div>
            <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden p-0.5">
              <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>

          <div className="space-y-3">
            {isUnconfigured ? (
              <button
                onClick={() => onNavigateToTab('calculator')}
                className="w-full text-center bg-white text-emerald-900 hover:bg-emerald-50 font-extrabold text-[11px] py-2 px-3 rounded-xl transition-all shadow-xs cursor-pointer select-none"
              >
                Configure Carbon Profile
              </button>
            ) : (
              <>
                <div className="flex text-[10px] items-center gap-1 justify-center bg-white/10 py-1.5 px-3 rounded-xl border border-white/10">
                  <span>Goal tier:</span>
                  <span className="font-bold text-emerald-100">-{goal.targetReductionPercent}% Reductions</span>
                </div>
                
                <div className="flex gap-1 justify-between">
                  {[10, 20, 30].map(p => (
                    <button
                      key={p}
                      onClick={() => onSetGoal(p)}
                      className={`flex-1 py-1 rounded-lg text-[9px] font-bold border transition-all cursor-pointer ${
                        goal.active && goal.targetReductionPercent === p
                          ? 'bg-white text-emerald-900 border-white'
                          : 'bg-emerald-700/50 border-emerald-600/50 text-emerald-100 hover:bg-emerald-700'
                      }`}
                    >
                      -{p}%
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 3. Small Card: Habit Streak */}
        <div className="col-span-1 bg-white rounded-[32px] p-6 border border-slate-200/70 shadow-xs flex flex-col items-center justify-center text-center min-h-[380px] transition-all hover:translate-y-[-2px]">
          <div className="text-4xl mb-2 animate-bounce">🔥</div>
          <h3 className="text-4xl font-extrabold text-slate-800 tracking-tight">{streak}</h3>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Day Eco Streak</p>
          <p className="text-[10px] text-slate-400 mt-2 max-w-[150px] leading-normal font-sans">
            Log everyday habits in the Habits tab to accumulate multipliers.
          </p>
          <button 
            onClick={() => onNavigateToTab('habits')}
            className="mt-6 w-full py-2.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors rounded-2xl text-[11px] font-bold cursor-pointer"
          >
            Track Daily Checklist
          </button>
        </div>

        {/* 4. Medium Card: Quick Recommendations */}
        <div className="col-span-1 md:col-span-2 bg-white rounded-[32px] p-6 border border-slate-200/70 shadow-xs flex flex-col justify-between min-h-[220px] transition-all hover:translate-y-[-2px]">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-xl text-amber-500 border border-amber-100 shrink-0">
                💡
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Tailored Carbon Recommendation</h2>
                <span className="text-[9px] font-extrabold tracking-wide uppercase bg-amber-100 text-amber-800 py-0.5 px-2 rounded-md font-sans">
                  {recommendationCategory}
                </span>
              </div>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed font-sans pr-2">
              {recommendationText} Let our mathematical What-If simulator evaluate the savings accurately.
            </p>
          </div>
          
          <button 
            onClick={() => onNavigateToTab('simulator')}
            className="mt-4 w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-2xl font-bold text-xs transition-colors cursor-pointer"
          >
            Launch What-If Simulator
          </button>
        </div>

        {/* 5. Sustainability Level & Points */}
        <div className="col-span-1 bg-white rounded-[32px] p-6 border border-slate-200/70 shadow-xs flex flex-col justify-between min-h-[260px] transition-all hover:translate-y-[-2px]">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Sustainability Level</p>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
              <Award className="w-5 h-5 text-indigo-500" />
              <span>{level}</span>
            </h3>
            
            <p className="text-[10px] text-slate-400 mt-2">
              Total Points: <span className="font-bold text-slate-700">{points}</span> / {nextLevelPoints}
            </p>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="bg-indigo-600 h-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (points / nextLevelPoints) * 100)}%` }}
              />
            </div>
          </div>

          <button 
            onClick={() => onNavigateToTab('knowledge')}
            className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-2xl font-bold text-xs transition-colors mt-4 cursor-pointer"
          >
            Test Quiz & Earn Points
          </button>
        </div>

        {/* 6. Recent Badges Card */}
        <div className="col-span-1 bg-amber-50 rounded-[32px] p-6 border border-amber-100 flex flex-col items-center justify-between text-center min-h-[260px] transition-all hover:translate-y-[-2px]">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-white rounded-full shadow-xs border border-amber-105 flex items-center justify-center text-2.5xl mb-2 animate-pulse">
              🏅
            </div>
            <p className="text-[10px] font-extrabold text-amber-500 uppercase tracking-wider">Recent Honor</p>
            <h4 className="text-xs font-bold text-amber-900 mt-0.5">
              {badgesEarned.length > 0 
                ? allBadges.find(x => x.id === badgesEarned[badgesEarned.length - 1])?.title || 'Eco Starter'
                : 'Eco Champion Starter'}
            </h4>
            <p className="text-[10px] text-amber-800/70 leading-normal max-w-[150px] mt-1.5 font-sans">
              Collect {6 - badgesEarned.length} more badges by checking challenge items.
            </p>
          </div>

          <div className="flex gap-1 justify-center">
            {badgesEarned.slice(-3).map(bId => (
              <span key={bId} className="h-6 w-6 rounded-full bg-amber-200 border border-amber-300 text-[10px] font-bold flex items-center justify-center text-amber-800" title={bId}>
                ★
              </span>
            ))}
          </div>
        </div>

        {/* 7. Global Comparison Card */}
        <div className="col-span-1 bg-slate-900 rounded-[32px] p-6 text-white flex flex-col justify-between min-h-[260px] transition-all hover:translate-y-[-2px]">
          <div>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Global Scale Index</p>
            <h3 className="text-lg font-bold text-emerald-400">{rankText} Sustainable</h3>
            <p className="text-[10px] text-slate-400 mt-1 font-sans">Lower than regional global targets.</p>
          </div>
          
          <div className="flex items-end gap-1.5 h-16 pt-3 select-none">
            <div className="w-2.5 bg-slate-800 h-8 rounded-full"></div>
            <div className="w-2.5 bg-slate-800 h-12 rounded-full"></div>
            <div className="w-2.5 bg-emerald-500 h-16 rounded-full animate-pulse"></div>
            <div className="w-2.5 bg-slate-800 h-10 rounded-full"></div>
            <div className="w-2.5 bg-slate-800 h-6 rounded-full"></div>
            <span className="text-[9px] font-bold ml-1 text-slate-500">World Avg.</span>
          </div>
        </div>

      </div>

      {/* Trajectory history chart in clean wide Bento structure */}
      <div className="bg-white rounded-[32px] p-8 border border-slate-200/70 shadow-xs">
        <div className="pb-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-[17px] font-bold text-slate-900">Carbon Trajectory History</h3>
            <p className="text-xs text-slate-400">Longitudinal emissions tracking showing seasonal reduction habits</p>
          </div>
          {reductionPercent && Number(reductionPercent) > 0 && (
            <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 py-1 px-3 rounded-full uppercase tracking-wider font-sans">
              -{reductionPercent}% Lower than baseline
            </span>
          )}
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="totalColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip formatter={(value) => [`${value} kg CO₂`, 'Emissions']} />
              <Legend verticalAlign="top" height={36}/>
              <Area type="monotone" dataKey="Total" stroke="#10b981" fillOpacity={1} fill="url(#totalColor)" strokeWidth={2.5} />
              <Bar dataKey="Transport" stackId="a" fill="#34d399" />
              <Bar dataKey="Energy" stackId="a" fill="#60a5fa" />
              <Bar dataKey="Food" stackId="a" fill="#fbbf24" />
              <Bar dataKey="Lifestyle" stackId="a" fill="#f472b6" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
