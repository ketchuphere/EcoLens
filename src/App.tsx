import { useState, useEffect } from 'react';
import { 
  Leaf, 
  LayoutDashboard, 
  Car, 
  Sparkles, 
  CheckSquare, 
  FileText, 
  Calendar, 
  Users, 
  BookOpen, 
  Award,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

import { CarbonInputs, FootprintRecord, DailyHabits, UserGoal, FamilyMember } from './types';
import { ScoreDashboard } from './components/ScoreDashboard';
import { CarbonCalculatorForm } from './components/CarbonCalculatorForm';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { HabitTrackerSection } from './components/HabitTrackerSection';
import { ActivityCalendar } from './components/ActivityCalendar';
import { FamilyMode } from './components/FamilyMode';
import { KnowledgeHub } from './components/KnowledgeHub';
import { AdminAnalytics } from './components/AdminAnalytics';
import { EcoChallengesAndReports } from './components/EcoChallengesAndReports';
import LandingPage from './components/LandingPage';

import { calculateCarbon } from './utils/calculator';
import { BADGES } from './data/sustainability';

// Today's YYYY-MM-DD date formatter
const getTodayDateString = () => new Date().toISOString().split('T')[0];

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Derive activeTab from the pathname, defaulting to 'dashboard'
  const activeTab = location.pathname.startsWith('/app/') ? location.pathname.substring(5) : 'dashboard';

  // Navigate dynamically on state updates
  const setActiveTab = (tabId: string) => {
    navigate(`/app/${tabId}`);
  };

  useEffect(() => {
    if (location.pathname === '/app' || location.pathname === '/app/') {
      navigate('/app/dashboard', { replace: true });
    }
  }, [location.pathname, navigate]);

  // Core App states
  const [records, setRecords] = useState<FootprintRecord[]>([]);
  const [goal, setGoal] = useState<UserGoal>({
    active: false,
    targetReductionPercent: 20,
    baselineEmissions: 0,
    targetEmissions: 0
  });
  const [streak, setStreak] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const [badgesEarned, setBadgesEarned] = useState<string[]>([]);
  const [completedChallengeDays, setCompletedChallengeDays] = useState<number[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  
  // Daily checklist habits
  const [currentHabits, setCurrentHabits] = useState<DailyHabits>({
    date: getTodayDateString(),
    usedPublicTransport: false,
    savedElectricity: false,
    recycledWaste: false,
    avoidedFoodWaste: false,
    usedBottleOrCup: false,
    atePlantBased: false,
    unpluggedVampireLoads: false,
    washedColdWater: false,
    compostedScraps: false,
    bikedOrWalked: false
  });

  // 1. Initial State Hydrator Lifecycle
  useEffect(() => {
    // Attempt local storage queries
    const storedRecords = localStorage.getItem('ecolens_records');
    const storedGoal = localStorage.getItem('ecolens_goals');
    const storedStreak = localStorage.getItem('ecolens_streak');
    const storedPoints = localStorage.getItem('ecolens_points');
    const storedBadges = localStorage.getItem('ecolens_badges');
    const storedChallenges = localStorage.getItem('ecolens_challenges');
    const storedFamily = localStorage.getItem('ecolens_family');
    const storedHabits = localStorage.getItem('ecolens_habits');

    if (storedRecords) {
      setRecords(JSON.parse(storedRecords));
    } else {
      // Preload baseline simulation on first ever mount so charts have gorgeous default look
      setRecords([]);
    }

    if (storedGoal) {
      setGoal(JSON.parse(storedGoal));
    } else {
      setGoal({
        active: true,
        targetReductionPercent: 20,
        baselineEmissions: 460,
        targetEmissions: 368
      });
    }

    if (storedStreak) setStreak(Number(storedStreak));
    else setStreak(3); // default motivator

    if (storedPoints) setPoints(Number(storedPoints));
    else setPoints(45); // welcome points

    if (storedBadges) setBadgesEarned(JSON.parse(storedBadges));
    else setBadgesEarned(['car_free_day']); // starter badge

    if (storedChallenges) setCompletedChallengeDays(JSON.parse(storedChallenges));
    else setCompletedChallengeDays([1, 2]);

    if (storedFamily) setFamilyMembers(JSON.parse(storedFamily));
    else setFamilyMembers([]);

    if (storedHabits) {
      const parsedHabits = JSON.parse(storedHabits);
      // Ensure daily reset
      if (parsedHabits.date === getTodayDateString()) {
        setCurrentHabits(parsedHabits);
      } else {
        // Reset checklist for new calendar day
        setCurrentHabits({
          date: getTodayDateString(),
          usedPublicTransport: false,
          savedElectricity: false,
          recycledWaste: false,
          avoidedFoodWaste: false
        });
      }
    }
  }, []);

  // 2. Synchronized Persistence Engine
  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('ecolens_records', JSON.stringify(records));
    } else {
      localStorage.removeItem('ecolens_records');
    }
  }, [records]);

  useEffect(() => {
    localStorage.setItem('ecolens_goals', JSON.stringify(goal));
  }, [goal]);

  useEffect(() => {
    localStorage.setItem('ecolens_streak', String(streak));
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('ecolens_points', String(points));
  }, [points]);

  useEffect(() => {
    localStorage.setItem('ecolens_badges', JSON.stringify(badgesEarned));
  }, [badgesEarned]);

  useEffect(() => {
    localStorage.setItem('ecolens_challenges', JSON.stringify(completedChallengeDays));
  }, [completedChallengeDays]);

  useEffect(() => {
    localStorage.setItem('ecolens_family', JSON.stringify(familyMembers));
  }, [familyMembers]);

  useEffect(() => {
    localStorage.setItem('ecolens_habits', JSON.stringify(currentHabits));
  }, [currentHabits]);


  // 3. Automated badge checking logic based on goals, streaks and entries
  const evaluateBadges = (
    currentRecords: FootprintRecord[],
    currentFamily: FamilyMember[],
    currentStreak: number,
    completedChallenges: number[],
    forceUnlockedQuiz = false
  ) => {
    const list = [...badgesEarned];

    // Badge A: Car Free Day (Logged standard driving <= 5km or checked public transit)
    if (!list.includes('car_free_day')) {
      const carFreeCommit = currentRecords.some(r => r.inputs.distanceCar <= 10) || currentHabits.usedPublicTransport;
      if (carFreeCommit) list.push('car_free_day');
    }

    // Badge B: Energy Saver (Power consumption below 120 kWh)
    if (!list.includes('energy_saver')) {
      const energySaverCommit = currentRecords.some(r => r.inputs.electricityKwh <= 120) || currentHabits.savedElectricity;
      if (energySaverCommit) list.push('energy_saver');
    }

    // Badge C: Zero Waste Hero (Sort active checked + minimal food waste)
    if (!list.includes('zero_waste_hero')) {
      const zeroWasteCommit = currentRecords.some(r => r.inputs.foodWasteLevel === 'low' && r.inputs.recyclesActive) || 
        (currentHabits.recycledWaste && currentHabits.avoidedFoodWaste);
      if (zeroWasteCommit) list.push('zero_waste_hero');
    }

    // Badge D: Streak Master (streak >= 5)
    if (!list.includes('streak_master') && currentStreak >= 5) {
      list.push('streak_master');
    }

    // Badge E: Family Captain (household enrollment > 0)
    if (!list.includes('family_captain') && currentFamily.length > 0) {
      list.push('family_captain');
    }

    // Badge F: Quiz Wizard
    if (!list.includes('quiz_wizard') && forceUnlockedQuiz) {
      list.push('quiz_wizard');
    }

    // Badge G: Water Guardian
    if (!list.includes('water_guardian')) {
      const waterCommit = currentHabits.compostedScraps || currentHabits.washedColdWater || currentHabits.avoidedFoodWaste;
      if (waterCommit) list.push('water_guardian');
    }

    // Badge H: Plant Pioneer
    if (!list.includes('plant_pioneer')) {
      const plantCommit = currentHabits.atePlantBased || currentRecords.some(r => r.inputs.dietType === 'vegan' || r.inputs.dietType === 'vegetarian');
      if (plantCommit) list.push('plant_pioneer');
    }

    // Badge I: Circular Champion
    if (!list.includes('circular_champion')) {
      const circCommit = currentHabits.usedBottleOrCup || currentHabits.unpluggedVampireLoads;
      if (circCommit) list.push('circular_champion');
    }

    // Badge J: Super Emissions Saver
    if (!list.includes('super_emissions_saver')) {
      const superSaverCommit = points >= 180 || currentRecords.some(r => r.total <= 250);
      if (superSaverCommit) list.push('super_emissions_saver');
    }

    // Clean duplicate badge assignments
    const uniqList = Array.from(new Set(list));
    if (uniqList.length !== badgesEarned.length) {
      setBadgesEarned(uniqList);
    }
  };


  // 4. Input interactions handlers
  const handleSaveMonthlyCalculation = (inputs: CarbonInputs) => {
    const stats = calculateCarbon(inputs);
    const dateFormatted = new Date().toLocaleDateString('en-US', { month: 'long' }); // e.g. "June"

    const newRecord: FootprintRecord = {
      id: Math.random().toString(36).substring(2, 9),
      date: dateFormatted,
      isDaily: false,
      transport: stats.transport,
      energy: stats.energy,
      food: stats.food,
      lifestyle: stats.lifestyle,
      total: stats.total,
      inputs: inputs
    };

    // Replace existing record of the same month if exists to prevent duplicates, or add
    const updatedRecords = [newRecord, ...records.filter(r => r.date !== dateFormatted)];
    setRecords(updatedRecords);

    // If goal baseline are unconfigured, set default baseline
    setGoal(prev => ({
      ...prev,
      baselineEmissions: stats.total,
      targetEmissions: Math.round(stats.total * (1 - prev.targetReductionPercent / 100))
    }));

    // Reward points for tracking
    setPoints(prev => prev + 40);

    // Evaluate credentials
    evaluateBadges(updatedRecords, familyMembers, streak, completedChallengeDays);
  };

  const handleAddDailyLog = (dateStr: string, t: number, eg: number, f: number, l: number) => {
    const total = t + eg + f + l;
    
    // Fake matching inputs structure to prevent null values in schemas
    const dummyInputs: CarbonInputs = {
      vehicleType: t > 10 ? 'petrol_car' : 'none',
      distanceCar: Math.round(t / 0.21),
      distanceBus: 0,
      distanceMetro: 0,
      distanceTrain: 0,
      flightsCount: 0,
      distanceFlight: 0,
      electricityKwh: Math.round(eg / 0.82),
      lpgKg: 0,
      acHours: 0,
      hasSolar: false,
      solarGenerationKwh: 0,
      dietType: f > 12 ? 'beef_heavy' : 'vegetarian',
      meatMealsPerMonth: 5,
      foodWasteLevel: f > 12 ? 'high' : 'low',
      shoppingLevel: 'light',
      recyclesActive: true,
      wasteBagsCount: Math.round(l / 6.2)
    };

    const dailyRecord: FootprintRecord = {
      id: Math.random().toString(36).substring(2, 9),
      date: dateStr,
      isDaily: true,
      transport: t,
      energy: eg,
      food: f,
      lifestyle: l,
      total: total,
      inputs: dummyInputs
    };

    const updated = [dailyRecord, ...records.filter(r => r.date !== dateStr)];
    setRecords(updated);
    setPoints(prev => prev + 15);

    // Increment habits streak
    const newStreak = streak + 1;
    setStreak(newStreak);

    evaluateBadges(updated, familyMembers, newStreak, completedChallengeDays);
  };

  const handleDeleteRecord = (id: string) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
  };

  const handleToggleHabit = (habitKey: keyof Omit<DailyHabits, 'date'>) => {
    const nextVal = !currentHabits[habitKey];
    setCurrentHabits(prev => ({
      ...prev,
      [habitKey]: nextVal
    }));

    const isHighReward = habitKey === 'usedPublicTransport' || habitKey === 'bikedOrWalked';
    const pointIncrement = isHighReward ? 20 : 10;

    if (nextVal) {
      setPoints(prev => prev + pointIncrement);
    } else {
      setPoints(prev => Math.max(0, prev - pointIncrement));
    }

    // check badges for daily toggles
    setTimeout(() => {
      evaluateBadges(records, familyMembers, streak, completedChallengeDays);
    }, 100);
  };

  const handleSetGoalPercentage = (percent: number) => {
    // Look at latest record or baseline 480 kg
    const base = records.length > 0 ? records[0].total : 480;
    setGoal({
      active: true,
      targetReductionPercent: percent,
      baselineEmissions: base,
      targetEmissions: Math.round(base * (1 - percent / 100))
    });
  };

  const handleAddFamilyMember = (name: string, t: number, eg: number, f: number, l: number) => {
    const newMember: FamilyMember = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      transport: t,
      energy: eg,
      food: f,
      lifestyle: l,
      total: t + eg + f + l
    };

    const nextFamily = [...familyMembers, newMember];
    setFamilyMembers(nextFamily);
    setPoints(prev => prev + 30);

    setTimeout(() => {
      evaluateBadges(records, nextFamily, streak, completedChallengeDays);
    }, 100);
  };

  const handleRemoveFamilyMember = (id: string) => {
    const nextFamily = familyMembers.filter(f => f.id !== id);
    setFamilyMembers(nextFamily);
  };

  const handleToggleChallengeDay = (day: number, ptsAwarded: number) => {
    let nextDays = [...completedChallengeDays];
    if (nextDays.includes(day)) {
      nextDays = nextDays.filter(d => d !== day);
      setPoints(prev => Math.max(0, prev + ptsAwarded));
    } else {
      nextDays.push(day);
      setPoints(prev => prev + ptsAwarded);
    }
    setCompletedChallengeDays(nextDays);
  };

  // 5. System Cleansing / Demo Population Handlers
  const handleClearAllLocalData = () => {
    localStorage.clear();
    setRecords([]);
    setStreak(0);
    setPoints(0);
    setBadgesEarned([]);
    setCompletedChallengeDays([]);
    setFamilyMembers([]);
    setGoal({
      active: false,
      targetReductionPercent: 20,
      baselineEmissions: 0,
      targetEmissions: 0
    });
    setCurrentHabits({
      date: getTodayDateString(),
      usedPublicTransport: false,
      savedElectricity: false,
      recycledWaste: false,
      avoidedFoodWaste: false,
      usedBottleOrCup: false,
      atePlantBased: false,
      unpluggedVampireLoads: false,
      washedColdWater: false,
      compostedScraps: false,
      bikedOrWalked: false
    });
    setActiveTab('dashboard');
  };

  const handleSetAllParametersToZero = () => {
    const zeroInputs: CarbonInputs = {
      vehicleType: 'none',
      distanceCar: 0,
      distanceBus: 0,
      distanceMetro: 0,
      distanceTrain: 0,
      flightsCount: 0,
      distanceFlight: 0,
      electricityKwh: 0,
      lpgKg: 0,
      acHours: 0,
      hasSolar: false,
      solarGenerationKwh: 0,
      dietType: 'vegan',
      meatMealsPerMonth: 0,
      foodWasteLevel: 'low',
      shoppingLevel: 'light',
      recyclesActive: true,
      wasteBagsCount: 0
    };

    const stats = calculateCarbon(zeroInputs);
    const dateFormatted = new Date().toLocaleDateString('en-US', { month: 'long' });

    const zeroRecord: FootprintRecord = {
      id: Math.random().toString(36).substring(2, 9),
      date: dateFormatted,
      isDaily: false,
      transport: stats.transport,
      energy: stats.energy,
      food: stats.food,
      lifestyle: stats.lifestyle,
      total: stats.total,
      inputs: zeroInputs
    };

    setRecords([zeroRecord]);
    setStreak(0);
    setPoints(0);
    setBadgesEarned([]);
    setCompletedChallengeDays([]);
    setFamilyMembers([]);
    setGoal({
      active: true,
      targetReductionPercent: 0,
      baselineEmissions: 0,
      targetEmissions: 0
    });
    setCurrentHabits({
      date: getTodayDateString(),
      usedPublicTransport: false,
      savedElectricity: false,
      recycledWaste: false,
      avoidedFoodWaste: false,
      usedBottleOrCup: false,
      atePlantBased: false,
      unpluggedVampireLoads: false,
      washedColdWater: false,
      compostedScraps: false,
      bikedOrWalked: false
    });
    setActiveTab('dashboard');
  };

  const handleLoadDemoData = () => {
    // Populate historic logs: June, May, April
    const JuneInputs: CarbonInputs = {
      vehicleType: 'petrol_car',
      distanceCar: 300,
      distanceBus: 50,
      distanceMetro: 80,
      distanceTrain: 0,
      flightsCount: 0,
      distanceFlight: 0,
      electricityKwh: 120,
      lpgKg: 5,
      acHours: 3,
      hasSolar: false,
      solarGenerationKwh: 0,
      dietType: 'meat_moderate',
      meatMealsPerMonth: 10,
      foodWasteLevel: 'medium',
      shoppingLevel: 'moderate',
      recyclesActive: true,
      wasteBagsCount: 2
    };

    const MayInputs: CarbonInputs = {
      ...JuneInputs,
      distanceCar: 400,
      electricityKwh: 170,
      acHours: 5,
      dietType: 'beef_heavy',
      wasteBagsCount: 3,
      recyclesActive: false
    };

    const AprilInputs: CarbonInputs = {
      ...MayInputs,
      distanceCar: 480,
      electricityKwh: 200,
      acHours: 6,
      wasteBagsCount: 4
    };

    const JuneStats = calculateCarbon(JuneInputs);
    const MayStats = calculateCarbon(MayInputs);
    const AprilStats = calculateCarbon(AprilInputs);

    const JuneRecord: FootprintRecord = {
      id: 'demo-june',
      date: 'June',
      isDaily: false,
      transport: JuneStats.transport,
      energy: JuneStats.energy,
      food: JuneStats.food,
      lifestyle: JuneStats.lifestyle,
      total: JuneStats.total,
      inputs: JuneInputs
    };

    const MayRecord: FootprintRecord = {
      id: 'demo-may',
      date: 'May',
      isDaily: false,
      transport: MayStats.transport,
      energy: MayStats.energy,
      food: MayStats.food,
      lifestyle: MayStats.lifestyle,
      total: MayStats.total,
      inputs: MayInputs
    };

    const AprilRecord: FootprintRecord = {
      id: 'demo-april',
      date: 'April',
      isDaily: false,
      transport: AprilStats.transport,
      energy: AprilStats.energy,
      food: AprilStats.food,
      lifestyle: AprilStats.lifestyle,
      total: AprilStats.total,
      inputs: AprilInputs
    };

    const demoRecords = [JuneRecord, MayRecord, AprilRecord];
    setRecords(demoRecords);

    // Update goals
    setGoal({
      active: true,
      targetReductionPercent: 20,
      baselineEmissions: JuneStats.total,
      targetEmissions: Math.round(JuneStats.total * 0.8)
    });

    // Populate Streak, Points, Challenges, and Badges
    setStreak(15);
    setPoints(290);
    setCompletedChallengeDays([1, 2, 3, 4, 5]);
    
    // Unfolded badges
    setBadgesEarned(['car_free_day', 'energy_saver', 'zero_waste_hero', 'streak_master']);
    
    // Enrolled some demo family members
    setFamilyMembers([
      { id: 'f1', name: 'Sister Emily', transport: 80, energy: 60, food: 70, lifestyle: 30, total: 240 },
      { id: 'f2', name: 'Roommate Mark', transport: 150, energy: 110, food: 140, lifestyle: 60, total: 460 }
    ]);

    setActiveTab('dashboard');
  };

  const handleQuizCompleted = () => {
    evaluateBadges(records, familyMembers, streak, completedChallengeDays, true);
  };

  if (location.pathname === '/' || location.pathname === '') {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-[#F1F5F1] text-slate-800 flex flex-col md:flex-row font-sans leading-normal">
      
      {/* Sidebar Navigation Panel */}
      <aside className="w-full md:w-64 bg-[#064e43] md:min-h-screen flex flex-col justify-between shrink-0 no-print border-b md:border-b-0 border-emerald-800/20 text-white">
        <div className="p-6">
          {/* Logo Frame */}
          <div className="flex items-center gap-2.5 text-white mb-8 select-none">
            <div className="h-9 w-9 rounded-xl bg-emerald-400 flex items-center justify-center text-emerald-900 font-extrabold shadow-md shadow-emerald-400/20">
              <Leaf className="w-5.5 h-5.5 fill-current" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight block">EcoLens</span>
              <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest block leading-none">Carbon Tracker</span>
            </div>
          </div>

          {/* Quick Back Nav Link to Landing Page */}
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 mb-6 rounded-2xl text-xs font-black bg-white/5 hover:bg-white/10 text-emerald-300 hover:text-white transition-all text-left border border-white/5 cursor-pointer"
            id="back_to_landing_btn"
          >
            <ArrowLeft className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Return to Landing Page</span>
          </button>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'calculator', label: 'Carbon Calculator', icon: Car },
              { id: 'simulator', label: 'What-If Simulator', icon: Sparkles },
              { id: 'habits', label: 'Habits & Badges', icon: CheckSquare },
              { id: 'challenges', label: 'Challenges & Reports', icon: FileText },
              { id: 'calendar', label: 'Carbon Calendar', icon: Calendar },
              { id: 'family', label: 'Family Group', icon: Users },
              { id: 'knowledge', label: 'Knowledge Hub', icon: BookOpen },
              { id: 'analytics', label: 'Diagnostics Page', icon: TrendingUp }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    isActive 
                      ? 'bg-white/10 text-white scale-[1.02] border-l-4 border-emerald-400 pl-3' 
                      : 'opacity-60 hover:opacity-100 text-emerald-100 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info pane in sidebar - updated to Bento emerald aesthetic */}
        <div className="p-6 border-t border-white/5 bg-black/10 text-emerald-200/50 text-[10px] leading-relaxed select-none">
          <p className="font-semibold text-emerald-200">EcoLens Local Workspace</p>
          <p className="font-medium">Rule-Based Calculator v2.1</p>
          <p className="mt-1">Zero Cloud Accounts. 100% Client-Side. Pure Sustainable Tracking.</p>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        {/* Render Active view */}
        <div className="space-y-8">
          
          {activeTab === 'dashboard' && (
            <ScoreDashboard
              records={records}
              goal={goal}
              streak={streak}
              points={points}
              badgesEarned={badgesEarned}
              allBadges={BADGES}
              onSetGoal={handleSetGoalPercentage}
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === 'calculator' && (
            <CarbonCalculatorForm
              initialInputs={records.length > 0 ? records[0].inputs : undefined}
              onSave={handleSaveMonthlyCalculation}
            />
          )}

          {activeTab === 'simulator' && (
            <WhatIfSimulator
              currentInputs={records.length > 0 ? records[0].inputs : {
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
              }}
            />
          )}

          {activeTab === 'habits' && (
            <HabitTrackerSection
              currentHabits={currentHabits}
              onToggleHabit={handleToggleHabit}
              streak={streak}
              points={points}
              badgesEarned={badgesEarned}
              allBadges={BADGES}
            />
          )}

          {activeTab === 'challenges' && (
            <EcoChallengesAndReports
              records={records}
              familyMembers={familyMembers}
              completedChallengeDays={completedChallengeDays}
              onToggleChallengeDay={handleToggleChallengeDay}
            />
          )}

          {activeTab === 'calendar' && (
            <ActivityCalendar
              records={records}
              onAddDailyLog={handleAddDailyLog}
              onDeleteRecord={handleDeleteRecord}
            />
          )}

          {activeTab === 'family' && (
            <FamilyMode
              familyMembers={familyMembers}
              onAddFamilyMember={handleAddFamilyMember}
              onRemoveFamilyMember={handleRemoveFamilyMember}
            />
          )}

          {activeTab === 'knowledge' && (
            <KnowledgeHub
              points={points}
              onAwardPoints={(pts) => setPoints(p => p + pts)}
              onQuizCompleted={handleQuizCompleted}
            />
          )}

          {activeTab === 'analytics' && (
            <AdminAnalytics
              records={records}
              familyMembers={familyMembers}
              badgesEarned={badgesEarned}
              allBadges={BADGES}
              onClearData={handleClearAllLocalData}
              onLoadDemoData={handleLoadDemoData}
              onSetAllParametersToZero={handleSetAllParametersToZero}
            />
          )}

        </div>
      </main>
    </div>
  );
}
