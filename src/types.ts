export interface CarbonInputs {
  // Transport
  vehicleType: 'petrol_car' | 'diesel_car' | 'electric_car' | 'none';
  distanceCar: number; // km per month
  distanceBus: number; // km per month
  distanceMetro: number; // km per month
  distanceTrain: number; // km per month
  flightsCount: number; // flight hours or short/long flights equivalent km
  distanceFlight: number; // km per month

  // Energy
  electricityKwh: number; // kWh per month
  lpgKg: number; // kg per month
  acHours: number; // hours per day of active AC
  hasSolar: boolean;
  solarGenerationKwh: number; // monthly solar generation if hasSolar is true

  // Food
  dietType: 'beef_heavy' | 'meat_moderate' | 'chicken_poultry' | 'vegetarian' | 'vegan';
  meatMealsPerMonth: number; // times eating beef/pork/lamb per month
  foodWasteLevel: 'high' | 'medium' | 'low'; // low, medium, high food waste

  // Lifestyle
  shoppingLevel: 'heavy' | 'moderate' | 'light';
  recyclesActive: boolean;
  wasteBagsCount: number; // bags per week
}

export interface FootprintRecord {
  id: string;
  date: string; // YYYY-MM (or YYYY-MM-DD for daily logs)
  isDaily: boolean;
  transport: number; // kg CO2
  energy: number; // kg CO2
  food: number; // kg CO2
  lifestyle: number; // kg CO2
  total: number; // kg CO2
  inputs: CarbonInputs;
}

export interface DailyHabits {
  date: string; // YYYY-MM-DD
  usedPublicTransport: boolean;
  savedElectricity: boolean;
  recycledWaste: boolean;
  avoidedFoodWaste: boolean;
  usedBottleOrCup: boolean;
  atePlantBased: boolean;
  unpluggedVampireLoads: boolean;
  washedColdWater: boolean;
  compostedScraps: boolean;
  bikedOrWalked: boolean;
}

export interface UserGoal {
  active: boolean;
  targetReductionPercent: number; // e.g. 20 for 20%
  baselineEmissions: number; // kg CO2
  targetEmissions: number; // kg CO2
}

export interface FamilyMember {
  id: string;
  name: string;
  transport: number; // kg
  energy: number;
  food: number;
  lifestyle: number;
  total: number;
}
