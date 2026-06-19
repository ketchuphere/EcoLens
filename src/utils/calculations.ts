import { CarbonInputs } from '../types';
import { EMISSION_FACTORS, CARBON_LIMITS, SCORE_FACTORS } from './constants';
import { sanitizeNumberInput, validateCarbonInputs } from './validators';

export interface CalculationResult {
  transport: number;
  energy: number;
  food: number;
  lifestyle: number;
  total: number;
  sustainabilityScore: number;
}

export interface Recommendation {
  id: string;
  category: 'transport' | 'energy' | 'food' | 'lifestyle';
  title: string;
  description: string;
  expectedReduction: number;
}

/**
 * Calculates raw or sanitized compartmentalized carbon emissions.
 * @param inputs Carbon inputs entered by the user
 * @returns Combined categories and cumulative carbon score
 */
export function calculateCarbonEmissions(inputs: CarbonInputs): CalculationResult {
  validateCarbonInputs(inputs);
  // Sanitize each potential form parameter safely first
  const distanceCar = sanitizeNumberInput(inputs.distanceCar, 0);
  const distanceBus = sanitizeNumberInput(inputs.distanceBus, 0);
  const distanceMetro = sanitizeNumberInput(inputs.distanceMetro, 0);
  const distanceTrain = sanitizeNumberInput(inputs.distanceTrain, 0);
  const distanceFlight = sanitizeNumberInput(inputs.distanceFlight, 0);

  const electricityKwh = sanitizeNumberInput(inputs.electricityKwh, 0);
  const lpgKg = sanitizeNumberInput(inputs.lpgKg, 0);
  const acHours = sanitizeNumberInput(inputs.acHours, 0);
  const solarGen = sanitizeNumberInput(inputs.solarGenerationKwh, 0);

  const wasteBagsCount = sanitizeNumberInput(inputs.wasteBagsCount, 0);

  // 1. Transportation
  let carFactor = 0;
  if (inputs.vehicleType === 'petrol_car') {
    carFactor = EMISSION_FACTORS.PETROL_CAR;
  } else if (inputs.vehicleType === 'diesel_car') {
    carFactor = EMISSION_FACTORS.DIESEL_CAR;
  } else if (inputs.vehicleType === 'electric_car') {
    carFactor = EMISSION_FACTORS.ELECTRIC_CAR;
  }

  const transportVal =
    distanceCar * carFactor +
    distanceBus * EMISSION_FACTORS.BUS +
    distanceMetro * EMISSION_FACTORS.METRO +
    distanceTrain * EMISSION_FACTORS.TRAIN +
    distanceFlight * EMISSION_FACTORS.FLIGHT;

  // 2. Energy
  const baseElectricity = electricityKwh * EMISSION_FACTORS.ELECTRICITY;
  const lpgEmission = lpgKg * EMISSION_FACTORS.LPG_GAS;
  const acEmission = acHours * 30 * EMISSION_FACTORS.AC_HOUR;
  const solarCredit = inputs.hasSolar ? solarGen * EMISSION_FACTORS.SOLAR_SAVING : 0;

  const energyVal = Math.max(0, baseElectricity + lpgEmission + acEmission + solarCredit);

  // 3. Food
  let foodVal = 0;
  if (inputs.dietType === 'beef_heavy') {
    foodVal =
      25 * EMISSION_FACTORS.BEEF_MEAL +
      35 * EMISSION_FACTORS.CHICKEN_MEAL +
      30 * EMISSION_FACTORS.VEGETARIAN_MEAL;
  } else if (inputs.dietType === 'meat_moderate') {
    foodVal =
      10 * EMISSION_FACTORS.BEEF_MEAL +
      15 * EMISSION_FACTORS.PORK_MEAL +
      25 * EMISSION_FACTORS.CHICKEN_MEAL +
      40 * EMISSION_FACTORS.VEGETARIAN_MEAL;
  } else if (inputs.dietType === 'chicken_poultry') {
    foodVal = 
      40 * EMISSION_FACTORS.CHICKEN_MEAL + 
      50 * EMISSION_FACTORS.VEGETARIAN_MEAL;
  } else if (inputs.dietType === 'vegetarian') {
    foodVal = 90 * EMISSION_FACTORS.VEGETARIAN_MEAL;
  } else {
    foodVal = 90 * EMISSION_FACTORS.VEGAN_MEAL;
  }

  let wastePenalty: number = EMISSION_FACTORS.FOOD_WASTE_PENALTY_LOW;
  if (inputs.foodWasteLevel === 'high') {
    wastePenalty = EMISSION_FACTORS.FOOD_WASTE_PENALTY_HIGH;
  } else if (inputs.foodWasteLevel === 'medium') {
    wastePenalty = EMISSION_FACTORS.FOOD_WASTE_PENALTY_MEDIUM;
  }
  foodVal += wastePenalty;

  // 4. Lifestyle
  let shopVal = 0;
  if (inputs.shoppingLevel === 'heavy') {
    shopVal = EMISSION_FACTORS.SHOPPING_HEAVY;
  } else if (inputs.shoppingLevel === 'moderate') {
    shopVal = EMISSION_FACTORS.SHOPPING_MODERATE;
  } else {
    shopVal = EMISSION_FACTORS.SHOPPING_LIGHT;
  }

  const bagVal = wasteBagsCount * 4.3 * EMISSION_FACTORS.WASTE_BAG;
  const recyclingCredit = inputs.recyclesActive ? EMISSION_FACTORS.RECYCLING_OFFSET : 0;

  const lifestyleVal = Math.max(0, shopVal + bagVal + recyclingCredit);

  const total = transportVal + energyVal + foodVal + lifestyleVal;

  // Compute sustainability rating score (bounds 5 to 100)
  const score = Math.max(
    SCORE_FACTORS.MIN_SCORE,
    Math.min(
      SCORE_FACTORS.MAX_SCORE,
      Math.round(SCORE_FACTORS.MAX_SCORE - total / SCORE_FACTORS.SCORE_DIVIDER)
    )
  );

  return {
    transport: Number(transportVal.toFixed(1)),
    energy: Number(energyVal.toFixed(1)),
    food: Number(foodVal.toFixed(1)),
    lifestyle: Number(lifestyleVal.toFixed(1)),
    total: Number(total.toFixed(1)),
    sustainabilityScore: score
  };
}

/**
 * Returns tailored list of strategic climate recommendation cards.
 * @param inputs User's carbon inputs structure
 * @param totals Calculated categorical totals
 * @returns Array of structural recommendations
 */
export function generateRecommendations(
  inputs: CarbonInputs,
  _totals: { transport: number; energy: number; food: number; lifestyle: number }
): Recommendation[] {
  const list: Recommendation[] = [];

  // Transport Rule
  if (
    inputs.distanceCar > CARBON_LIMITS.HIGH_DISTANCE ||
    inputs.vehicleType === 'petrol_car' ||
    inputs.vehicleType === 'diesel_car'
  ) {
    list.push({
      id: 'car_transit',
      category: 'transport',
      title: 'Substitute Car commutes with Public Transport',
      description:
        'By substituting standard car commutes with high-capacity light rails or public buses just twice a week, you reduce congestion and clear air emissions.',
      expectedReduction: 40
    });
  }

  if (inputs.distanceFlight > CARBON_LIMITS.LONG_FLIGHT_KM) {
    list.push({
      id: 'flight_offset',
      category: 'transport',
      title: 'Prefer High-Speed Trains over flight wings',
      description:
        'Regional flights carry a massive carbon overhead. Transitioning standard regional travel to trains saves huge fuel emissions.',
      expectedReduction: 50
    });
  }

  // Energy Rule
  if (inputs.electricityKwh > CARBON_LIMITS.HIGH_ELECTRICITY || inputs.acHours > CARBON_LIMITS.HIGH_AC_HOURS) {
    list.push({
      id: 'thermostats_reduce',
      category: 'energy',
      title: 'Increase Air Conditioner Thermostat to 24°C',
      description:
        'Every single degree higher on your chiller active setting cuts compressor electric load by almost 7-8%. Pair with window sails or fan currents.',
      expectedReduction: 25
    });
  }

  if (!inputs.hasSolar) {
    list.push({
      id: 'vampire_load',
      category: 'energy',
      title: 'Terminate Phantom Standby Loads',
      description:
        'Pruning smart speaker, router, computer, and media wall plug adapters at night eliminates constant standby leaks.',
      expectedReduction: 12
    });
  }

  // Food Rule
  if (inputs.dietType === 'beef_heavy' || inputs.dietType === 'meat_moderate') {
    list.push({
      id: 'beef_reduct',
      category: 'food',
      title: 'Introduce Plant-Based Meal Schedules',
      description:
        'Replacing intensive red meat crops with fresh seasonal lentils, legumes, grains, or non-dairy substitutes twice a week shrinks diet footprint significantly.',
      expectedReduction: 45
    });
  }

  if (inputs.foodWasteLevel === 'high' || inputs.foodWasteLevel === 'medium') {
    list.push({
      id: 'reduce_waste',
      category: 'food',
      title: 'Smart Grocery Checklist & Leftover Recipes',
      description:
        'Meticulously review contents before shopping. Freezing extras and turning wilting greens into stews avoids methane-spewing landfill organic dump.',
      expectedReduction: 15
    });
  }

  // Lifestyle Rule
  if (inputs.wasteBagsCount >= CARBON_LIMITS.HIGH_WASTE_BAGS || !inputs.recyclesActive) {
    list.push({
      id: 'circular_recycling',
      category: 'lifestyle',
      title: 'Initiate Cardboard, Aluminum, and Glass Sorting',
      description:
        'Ensuring pure separate recyclable piles saves processing fuel. Clean up glass and tin cans to prevent landfill burden.',
      expectedReduction: 18
    });
  }

  if (inputs.shoppingLevel === 'heavy') {
    list.push({
      id: 'mindful_apparel',
      category: 'lifestyle',
      title: 'Adopt standard 30-Day Delay on non-essential purchases',
      description:
        'Fast consumption generates mass microplastic waste. Waiting 30 days before checkout reduces impulse buying drastically.',
      expectedReduction: 20
    });
  }

  // Fallback if low footprint
  if (list.length === 0) {
    list.push({
      id: 'low_footprint_ambassador',
      category: 'lifestyle',
      title: 'Empower neighbors to record carbon ratings',
      description:
        'Become a climate communicator. Share your high score and encourage friends to test local calculator parameters.',
      expectedReduction: 10
    });
  }

  return list;
}
