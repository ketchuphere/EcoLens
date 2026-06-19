/**
 * Emission factors and carbon estimation constants for EcoLens.
 * Values are in kilograms of CO2 equivalent (kg CO2e).
 */
export const EMISSION_FACTORS = {
  // Transport (per km)
  PETROL_CAR: 0.21,
  DIESEL_CAR: 0.25,
  ELECTRIC_CAR: 0.05,
  BUS: 0.08,
  METRO: 0.04,
  FLIGHT: 0.25,
  TRAIN: 0.03,

  // Energy
  ELECTRICITY: 0.82,     // per kWh
  LPG_GAS: 2.1,          // per kg
  AC_HOUR: 0.6,          // per active hour
  SOLAR_SAVING: -0.5,    // offset credit per solar kWh generated

  // Food (per meal)
  BEEF_MEAL: 27.0,
  PORK_MEAL: 12.1,
  CHICKEN_MEAL: 6.9,
  VEGETARIAN_MEAL: 2.0,
  VEGAN_MEAL: 1.2,
  FOOD_WASTE_PENALTY_HIGH: 30,
  FOOD_WASTE_PENALTY_MEDIUM: 10,
  FOOD_WASTE_PENALTY_LOW: 0,

  // Lifestyle
  SHOPPING_HEAVY: 45.0,
  SHOPPING_MODERATE: 20.0,
  SHOPPING_LIGHT: 5.0,
  RECYCLING_OFFSET: -12.0, // monthly credit if recycling is active
  WASTE_BAG: 6.2           // per Standard trash bag
} as const;

/**
 * Bounds and thresholds to prevent magic literal checks across UI forms.
 */
export const CARBON_LIMITS = {
  HIGH_DISTANCE: 200,     // km threshold above which commute recommendations trigger
  LONG_FLIGHT_KM: 500,    // km flight threshold
  HIGH_ELECTRICITY: 150,  // kWh monthly threshold for electricity saving action
  HIGH_AC_HOURS: 4,       // AC hours daily threshold
  HIGH_WASTE_BAGS: 4      // Trash bags weekly threshold
} as const;

/**
 * Initial/Default Inputs for the Carbon Calculator form.
 */
export const INITIAL_INPUTS = {
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
} as const;

/**
 * Motivation indicators and score bounds
 */
export const SCORE_FACTORS = {
  MAX_SCORE: 100,
  MIN_SCORE: 5,
  SCORE_DIVIDER: 12,
  STREAK_EARNED_DEFAULT: 3,
  POINTS_EARNED_DEFAULT: 45
} as const;
