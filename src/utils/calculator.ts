import { CarbonInputs, FootprintRecord } from '../types';
import { EXPORTED_EMISSION_DATASET } from '../data/emissions';

export const INITIAL_INPUTS: CarbonInputs = {
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
};

export function calculateCarbon(inputs: CarbonInputs): {
  transport: number;
  energy: number;
  food: number;
  lifestyle: number;
  total: number;
  sustainabilityScore: number;
} {
  // 1. Transportation
  let carFactor = 0;
  if (inputs.vehicleType === 'petrol_car') carFactor = EXPORTED_EMISSION_DATASET.petrol_car;
  else if (inputs.vehicleType === 'diesel_car') carFactor = EXPORTED_EMISSION_DATASET.diesel_car;
  else if (inputs.vehicleType === 'electric_car') carFactor = EXPORTED_EMISSION_DATASET.electric_car;

  const transportVal = 
    (inputs.distanceCar * carFactor) +
    (inputs.distanceBus * EXPORTED_EMISSION_DATASET.bus) +
    (inputs.distanceMetro * EXPORTED_EMISSION_DATASET.metro) +
    (inputs.distanceTrain * EXPORTED_EMISSION_DATASET.train) +
    (inputs.distanceFlight * EXPORTED_EMISSION_DATASET.flight);

  // 2. Energy
  const baseElectricity = inputs.electricityKwh * EXPORTED_EMISSION_DATASET.electricity;
  const lpgEmission = inputs.lpgKg * EXPORTED_EMISSION_DATASET.lpg_gas;
  const acEmission = inputs.acHours * 30 * EXPORTED_EMISSION_DATASET.ac_hour;
  const solarCredit = inputs.hasSolar ? (inputs.solarGenerationKwh * EXPORTED_EMISSION_DATASET.solar_saving) : 0;
  
  const energyVal = Math.max(0, baseElectricity + lpgEmission + acEmission + solarCredit);

  // 3. Food
  let foodVal = 0;
  // standard 90 meals in a month
  if (inputs.dietType === 'beef_heavy') {
    // 25 beef meals, 35 chicken, 30 veg
    foodVal = (25 * EXPORTED_EMISSION_DATASET.beef_meal) + (35 * EXPORTED_EMISSION_DATASET.chicken_meal) + (30 * EXPORTED_EMISSION_DATASET.vegetarian_meal);
  } else if (inputs.dietType === 'meat_moderate') {
    // 10 beef, 15 pork, 25 chicken, 40 veg
    foodVal = (10 * EXPORTED_EMISSION_DATASET.beef_meal) + (15 * 12.1) + (25 * EXPORTED_EMISSION_DATASET.chicken_meal) + (40 * EXPORTED_EMISSION_DATASET.vegetarian_meal);
  } else if (inputs.dietType === 'chicken_poultry') {
    // 40 chicken/fish, 50 veg
    foodVal = (40 * EXPORTED_EMISSION_DATASET.chicken_meal) + (50 * EXPORTED_EMISSION_DATASET.vegetarian_meal);
  } else if (inputs.dietType === 'vegetarian') {
    // 90 veg meals
    foodVal = (90 * EXPORTED_EMISSION_DATASET.vegetarian_meal);
  } else {
    // 90 vegan meals
    foodVal = (90 * EXPORTED_EMISSION_DATASET.vegan_meal);
  }

  // Add food waste penalty
  let wastePenalty = 0;
  if (inputs.foodWasteLevel === 'high') wastePenalty = 30;
  else if (inputs.foodWasteLevel === 'medium') wastePenalty = 10;

  foodVal += wastePenalty;

  // 4. Lifestyle
  let shopVal = 0;
  if (inputs.shoppingLevel === 'heavy') shopVal = EXPORTED_EMISSION_DATASET.shopping_heavy;
  else if (inputs.shoppingLevel === 'moderate') shopVal = EXPORTED_EMISSION_DATASET.shopping_moderate;
  else shopVal = EXPORTED_EMISSION_DATASET.shopping_light;

  const bagVal = inputs.wasteBagsCount * 4.3 * EXPORTED_EMISSION_DATASET.waste_bag;
  const recyclingCredit = inputs.recyclesActive ? EXPORTED_EMISSION_DATASET.recycling_active : 0;

  const lifestyleVal = Math.max(0, shopVal + bagVal + recyclingCredit);

  const total = transportVal + energyVal + foodVal + lifestyleVal;

  // Sustainability Score: 100 representing low footprint, 10 representing extreme footprint
  // Reference global average carbon footprint is about 400kg CO2 per passenger monthly for a standard eco conscious citizen.
  // 1500kg is very high. Formula: score = Math.max(10, Math.min(100, Math.round(100 - (total / 18))))
  const score = Math.max(5, Math.min(100, Math.round(100 - (total / 12))));

  return {
    transport: Number(transportVal.toFixed(1)),
    energy: Number(energyVal.toFixed(1)),
    food: Number(foodVal.toFixed(1)),
    lifestyle: Number(lifestyleVal.toFixed(1)),
    total: Number(total.toFixed(1)),
    sustainabilityScore: score
  };
}

export interface Recommendation {
  id: string;
  category: 'transport' | 'energy' | 'food' | 'lifestyle';
  title: string;
  description: string;
  expectedReduction: number; // kg saved per month
}

export function getRecommendations(inputs: CarbonInputs, totals: { transport: number; energy: number; food: number; lifestyle: number }): Recommendation[] {
  const list: Recommendation[] = [];

  // Transport Rule
  if (inputs.distanceCar > 200 || inputs.vehicleType === 'petrol_car' || inputs.vehicleType === 'diesel_car') {
    list.push({
      id: 'car_transit',
      category: 'transport',
      title: 'Substitute Car commutes with Public Transport',
      description: 'By substituting standard car commutes with high-capacity light rails or public buses just twice a week, you reduce congestion and clear air emissions.',
      expectedReduction: 40
    });
  }
  if (inputs.distanceFlight > 500) {
    list.push({
      id: 'flight_offset',
      category: 'transport',
      title: 'Prefer High-Speed Trains over flight wings',
      description: 'Regional flights carry a massive carbon overhead. Transitioning standard regional travel to trains saves huge fuel emissions.',
      expectedReduction: 50
    });
  }

  // Energy Rule
  if (inputs.electricityKwh > 150 || inputs.acHours > 4) {
    list.push({
      id: 'thermostats_reduce',
      category: 'energy',
      title: 'Increase Air Conditioner Thermostat to 24°C',
      description: 'Every single degree higher on your chiller active setting cuts compressor electric load by almost 7-8%. Pair with window sails or fan currents.',
      expectedReduction: 25
    });
  }
  if (!inputs.hasSolar) {
    list.push({
      id: 'vampire_load',
      category: 'energy',
      title: 'Terminate Phantom Standby Loads',
      description: 'Pruning smart speaker, router, computer, and media wall plug adapters at night eliminates constant standby leaks.',
      expectedReduction: 12
    });
  }

  // Food Rule
  if (inputs.dietType === 'beef_heavy' || inputs.dietType === 'meat_moderate') {
    list.push({
      id: 'beef_reduct',
      category: 'food',
      title: 'Introduce Plant-Based Meal Schedules',
      description: 'Replacing intensive red meat crops with fresh seasonal lentils, legumes, grains, or non-dairy substitutes twice a week shrinks diet footprint significantly.',
      expectedReduction: 45
    });
  }
  if (inputs.foodWasteLevel === 'high' || inputs.foodWasteLevel === 'medium') {
    list.push({
      id: 'reduce_waste',
      category: 'food',
      title: 'Smart Grocery Checklist & Leftover Recipes',
      description: 'Meticulously review contents before shopping. Freezing extras and turning wilting greens into stews avoids methane-spewing landfill organic dump.',
      expectedReduction: 15
    });
  }

  // Lifestyle Rule
  if (inputs.wasteBagsCount >= 4 || !inputs.recyclesActive) {
    list.push({
      id: 'circular_recycling',
      category: 'lifestyle',
      title: 'Initiate Cardboard, Aluminum, and Glass Sorting',
      description: 'Ensuring pure separate recyclable piles saves processing fuel. Clean up glass and tin cans to prevent landfill burden.',
      expectedReduction: 18
    });
  }
  if (inputs.shoppingLevel === 'heavy') {
    list.push({
      id: 'mindful_apparel',
      category: 'lifestyle',
      title: 'Adopt standard 30-Day Delay on non-essential purchases',
      description: 'Fast consumption generates mass microplastic waste. Waiting 30 days before checkout reduces impulse buying drastically.',
      expectedReduction: 20
    });
  }

  // Fallback if low footprint
  if (list.length === 0) {
    list.push({
      id: 'low_footprint_ambassador',
      category: 'lifestyle',
      title: 'Empower neighbors to record carbon ratings',
      description: 'Become a climate communicator. Share your high score and encourage friends to test local calculator parameters.',
      expectedReduction: 10
    });
  }

  return list;
}
