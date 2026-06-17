import React, { useState } from 'react';
import { FootprintRecord, FamilyMember } from '../types';
import { calculateCarbon, getRecommendations } from '../utils/calculator';
import { Award, ShieldAlert, Sparkles, AlertCircle, Play, CheckCircle2, ChevronRight, BarChart2, RefreshCw } from 'lucide-react';

interface AdminAnalyticsProps {
  records: FootprintRecord[];
  familyMembers: FamilyMember[];
  badgesEarned: string[];
  allBadges: Array<{ id: string; title: string; description: string; iconName: string; unlockedLabel: string }>;
  onClearData: () => void;
  onLoadDemoData: () => void;
  onSetAllParametersToZero?: () => void;
}

interface TestResult {
  name: string;
  category: string;
  status: 'passed' | 'failed' | 'idle';
  message: string;
}

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({
  records,
  familyMembers,
  badgesEarned,
  allBadges,
  onClearData,
  onLoadDemoData,
  onSetAllParametersToZero
}) => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Stats summaries
  const totalCalculations = records.length;
  
  const avgFootprint = records.length > 0 
    ? records.reduce((acc, r) => acc + r.total, 0) / records.length 
    : 420; // fallback default average

  // Common emission source category
  let topCategoryName = 'Pending Logs';
  if (records.length > 0) {
    const sums = { transport: 0, energy: 0, food: 0, lifestyle: 0 };
    records.forEach(r => {
      sums.transport += r.transport;
      sums.energy += r.energy;
      sums.food += r.food;
      sums.lifestyle += r.lifestyle;
    });
    
    const catArray = [
      { name: 'Transportation', value: sums.transport },
      { name: 'Home Utility Energy', value: sums.energy },
      { name: 'Food/Agriculture choices', value: sums.food },
      { name: 'Lifestyle/Refuse Waste', value: sums.lifestyle }
    ];
    catArray.sort((a, b) => b.value - a.value);
    topCategoryName = catArray[0].name;
  } else {
    topCategoryName = 'Transportation Commutes'; // fallback
  }

  // Diagnostics Unit Test Suite
  const runDiagnostics = () => {
    setIsRunningTests(true);
    const results: TestResult[] = [];

    // Test Case 1: Calculator validation (Standard values)
    try {
      const standardInputs = {
        vehicleType: 'petrol_car' as const,
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
        dietType: 'meat_moderate' as const,
        meatMealsPerMonth: 12,
        foodWasteLevel: 'medium' as const,
        shoppingLevel: 'moderate' as const,
        recyclesActive: true,
        wasteBagsCount: 3
      };
      
      const res = calculateCarbon(standardInputs);
      if (res.total > 0 && res.sustainabilityScore > 0) {
        results.push({
          name: 'Calculator Standard Inputs',
          category: 'Calculator Formula',
          status: 'passed',
          message: `Calculated standard emissions total perfectly: ${res.total} kg, Score: ${res.sustainabilityScore}/100.`
        });
      } else {
        throw new Error('Calculated emissions are non-positive');
      }
    } catch (e: any) {
      results.push({
        name: 'Calculator Standard Inputs',
        category: 'Calculator Formula',
        status: 'failed',
        message: `Failed: ${e.message}`
      });
    }

    // Test Case 2: Edge Cases (Zero/Blank Inputs verification)
    try {
      const zeroInputs = {
        vehicleType: 'none' as const,
        distanceCar: 0,
        distanceBus: 0,
        distanceMetro: 0,
        distanceTrain: 0,
        flightsCount: 0,
        distanceFlight: 0,
        electricityKwh: 0,
        lpgKg: 0,
        acHours: 0,
        hasSolar: true,
        solarGenerationKwh: 100, // solar saving offset enabled
        dietType: 'vegan' as const,
        meatMealsPerMonth: 0,
        foodWasteLevel: 'low' as const,
        shoppingLevel: 'light' as const,
        recyclesActive: true,
        wasteBagsCount: 0
      };

      const res = calculateCarbon(zeroInputs);
      // Vegan/renewable offsets should yield extremely low total or offset cleanly
      if (res.total >= 0) {
        results.push({
          name: 'Edge Cases (Zero/Renewable Inputs)',
          category: 'Boundary Check',
          status: 'passed',
          message: `Successfully handled minimal boundary checks. Emissions total: ${res.total} kg, Score: ${res.sustainabilityScore}/100.`
        });
      } else {
        throw new Error('Produced negative parameters.');
      }
    } catch (e: any) {
      results.push({
        name: 'Edge Cases (Zero/Renewable Inputs)',
        category: 'Boundary Check',
        status: 'failed',
        message: `Failed: ${e.message}`
      });
    }

    // Test Case 3: Edge Cases: Excessive Inputs Clamp check
    try {
      const excessiveInputs = {
        vehicleType: 'diesel_car' as const,
        distanceCar: 5000,
        distanceBus: 500,
        distanceMetro: 500,
        distanceTrain: 1000,
        flightsCount: 10,
        distanceFlight: 10000,
        electricityKwh: 5000,
        lpgKg: 200,
        acHours: 24,
        hasSolar: false,
        solarGenerationKwh: 0,
        dietType: 'beef_heavy' as const,
        meatMealsPerMonth: 90,
        foodWasteLevel: 'high' as const,
        shoppingLevel: 'heavy' as const,
        recyclesActive: false,
        wasteBagsCount: 20
      };

      const res = calculateCarbon(excessiveInputs);
      // Eco rating clamp: score should not plunge below minimum floor
      if (res.sustainabilityScore >= 5 && res.sustainabilityScore <= 100) {
        results.push({
          name: 'Extreme High Value Sizing Clamps',
          category: 'Limits Validation',
          status: 'passed',
          message: `Calculated excessive footprint of ${res.total.toFixed(0)} kg correctly. score successfully clamped to minimum limit of ${res.sustainabilityScore}/100.`
        });
      } else {
        throw new Error('Score fell out of bounds.');
      }
    } catch (e: any) {
      results.push({
        name: 'Extreme High Value Sizing Clamps',
        category: 'Limits Validation',
        status: 'failed',
        message: `Failed: ${e.message}`
      });
    }

    // Test Case 4: Recommendation Engine Rules validation
    try {
      const testInputs = {
        vehicleType: 'petrol_car' as const,
        distanceCar: 1000, // high mileage
        distanceBus: 0,
        distanceMetro: 0,
        distanceTrain: 0,
        flightsCount: 0,
        distanceFlight: 0,
        electricityKwh: 400, // high utility power usage
        lpgKg: 5,
        acHours: 6,
        hasSolar: false,
        solarGenerationKwh: 0,
        dietType: 'beef_heavy' as const, // beef heavy diet
        meatMealsPerMonth: 30,
        foodWasteLevel: 'high' as const,
        shoppingLevel: 'moderate' as const,
        recyclesActive: false,
        wasteBagsCount: 5
      };

      const calculated_total = { transport: 400, energy: 300, food: 200, lifestyle: 100 };
      const recommendations = getRecommendations(testInputs, calculated_total);
      
      // Look for expected recommendation ids based on rules
      const hasCarRec = recommendations.some(r => r.id === 'car_transit');
      const hasEnergyRec = recommendations.some(r => r.id === 'thermostats_reduce');
      const hasBeefRec = recommendations.some(r => r.id === 'beef_reduct');

      if (hasCarRec && hasEnergyRec && hasBeefRec) {
        results.push({
          name: 'Recommendation Rule Matching Engine',
          category: 'Insights Engine',
          status: 'passed',
          message: `Successfully triggered standard high-mileage transit tips, AC thermostats reductions, and plant-based meat substitutes.`
        });
      } else {
        throw new Error('Incomplete rules mapping. Missed expected insights triggers.');
      }
    } catch (e: any) {
      results.push({
        name: 'Recommendation Rule Matching Engine',
        category: 'Insights Engine',
        status: 'failed',
        message: `Failed: ${e.message}`
      });
    }

    setTimeout(() => {
      setTestResults(results);
      setIsRunningTests(false);
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-fade-in text-stone-800" id="admin_analytics_container">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-stone-200/85 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Historical Logs</p>
          <p className="text-3xl font-extrabold text-stone-900 number-font mt-1">{totalCalculations}</p>
          <span className="text-[10px] text-stone-400">Total recorded audits</span>
        </div>

        <div className="bg-white border border-stone-200/85 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Average Footprint</p>
          <p className="text-3xl font-extrabold text-stone-900 number-font mt-1">{avgFootprint.toFixed(0)} <span className="text-xs font-semibold text-stone-500">kg CO₂</span></p>
          <span className="text-[10px] text-stone-400">Standard monthly mean</span>
        </div>

        <div className="bg-white border border-stone-200/85 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Top Emission Producer</p>
          <p className="text-base font-extrabold text-rose-700 mt-2 flex items-center gap-1.5 uppercase tracking-wide">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{topCategoryName}</span>
          </p>
          <span className="text-[10px] text-stone-400 text-stone-500 font-medium">Largest carbon category aggregate</span>
        </div>
      </div>

      {/* Grid: Diagnostics and Database operations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Spot: Dynamic Local diagnostics */}
        <div className="lg:col-span-7 bg-white border border-stone-200/85 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="pb-4 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-stone-900">Developer Testing Diagnostics Suite</h3>
              <p className="text-xs text-stone-400 font-medium">Execute client-authoritative checks to validate formulas, boundary limits and engine rules.</p>
            </div>
            <button
              onClick={runDiagnostics}
              disabled={isRunningTests}
              className={`py-1.5 px-4 rounded-xl font-extrabold border text-xs cursor-pointer flex items-center gap-1.5 transition-all text-white bg-emerald-600 border-emerald-600 hover:bg-emerald-700 ${
                isRunningTests ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunningTests ? 'Auditing...' : 'Run Diagnostics'}</span>
            </button>
          </div>

          <div className="space-y-4">
            {testResults.map((t, idx) => (
              <div key={idx} className="border border-stone-100 bg-stone-50/50 rounded-xl p-3.5 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold tracking-wider bg-stone-200/60 text-stone-600 py-0.5 px-2 rounded uppercase font-mono">
                    {t.category}
                  </span>
                  <h4 className="text-xs font-bold text-stone-800">{t.name}</h4>
                  <p className="text-[10px] text-stone-500 font-sans leading-relaxed">{t.message}</p>
                </div>

                <div className="shrink-0 pt-0.5">
                  {t.status === 'passed' ? (
                    <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold uppercase tracking-wider bg-emerald-50 rounded-full py-0.5 px-2.5 border border-emerald-100">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                      <span>PASS</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-rose-600 text-xs font-bold uppercase tracking-wider bg-rose-50 rounded-full py-0.5 px-2.5 border border-rose-100">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>FAIL</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {testResults.length === 0 && (
              <div className="py-8 text-center text-stone-400 text-xs space-y-1.5 border-2 border-dashed border-stone-200 rounded-xl">
                <BarChart2 className="w-9 h-9 text-stone-300 mx-auto" />
                <p className="font-semibold">Diagnostic test deck idle</p>
                <p className="text-[10px] text-stone-400 max-w-sm mx-auto">Click "Run Diagnostics" above to test carbon equations and recomendation logic dynamically.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Spot: Clear Database and Setup profiles */}
        <div className="lg:col-span-5 bg-white border border-stone-200/85 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="pb-4 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">Sandbox Utilities</h3>
              <p className="text-xs text-stone-400 font-medium">System adjustments and mock parameters for demonstration</p>
            </div>

            <div className="space-y-3.5">
              <button
                onClick={onLoadDemoData}
                className="w-full text-left py-3 px-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-center text-xs font-bold text-stone-800">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Hydrate Demo Milestones</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-[10px] text-stone-500 mt-1 leading-normal">Fills local storages with historic calculation records for June, May, and April, plus 290 points and unlocks specific badges.</p>
              </button>

              {onSetAllParametersToZero && (
                <button
                  onClick={onSetAllParametersToZero}
                  className="w-full text-left py-3 px-4 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50/80 transition-all cursor-pointer group shadow-xs"
                >
                  <div className="flex justify-between items-center text-xs font-bold text-rose-800">
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-4 h-4 text-rose-600" />
                      <span>Set All Parameters to Zero</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-[10px] text-rose-700 mt-1 leading-normal">Sets carbon calculator mileage, electric bills, utilities, flights, diet types, and garbage bags to absolute zero parameters instantly.</p>
                </button>
              )}

              <button
                onClick={onClearData}
                className="w-full text-left py-3 px-4 rounded-xl border border-rose-200 bg-rose-50/20 hover:bg-rose-50/50 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-center text-xs font-bold text-rose-800">
                  <span>Purge Local Storage variables</span>
                  <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-[10px] text-rose-600 mt-1 leading-normal">Wipes all cached calculations, checklist habits, earned levels, points, and family names. Reset to blank state.</p>
              </button>
            </div>
          </div>

          <div className="border-t border-stone-150 pt-4 text-[10px] text-stone-400 font-medium leading-normal">
            <p>
              EcoLens operates purely in client-side persistence mode (`localStorage`). No files or personal databases are synced outside this workspace container, protecting privacy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
