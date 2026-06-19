import { CarbonInputs } from '../types';

/**
 * Checks if a value is a valid non-negative serial number.
 * @param value raw numeric or string input
 * @returns boolean validation response
 */
export function validateNonNegativeNumber(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  const num = typeof value === 'string' ? parseFloat(value) : (value as number);
  return typeof num === 'number' && !isNaN(num) && isFinite(num) && num >= 0;
}

/**
 * Validates and sanitizes a raw numeric input field to guarantee a valid safe float or integer.
 * @param input raw input from text boxes or slider elements
 * @param fallback default fallback number if input fails checks
 * @returns sanitized non-negative number
 */
export function sanitizeNumberInput(input: unknown, fallback = 0): number {
  if (input === null || input === undefined || input === '') return fallback;
  const parsed = typeof input === 'string' ? parseFloat(input) : Number(input);
  if (isNaN(parsed) || !isFinite(parsed) || parsed < 0) {
    return fallback;
  }
  return parsed;
}

/**
 * Ensures text lists or identifiers fit within general safe bounds.
 * @param name potential string identifier
 * @returns trimmed validated string
 */
export function sanitizeStringInput(name: unknown, fallback = ''): string {
  if (typeof name !== 'string') return fallback;
  return name.trim();
}

/**
 * Validates a complete CarbonInputs structure for safety and correctness.
 * Throws an Error if any constraint is breached.
 * @param inputs Carbon inputs structure to validate
 */
export function validateCarbonInputs(inputs: Partial<CarbonInputs>): void {
  const numericFields: (keyof CarbonInputs)[] = [
    'distanceCar',
    'distanceBus',
    'distanceMetro',
    'distanceTrain',
    'flightsCount',
    'distanceFlight',
    'electricityKwh',
    'lpgKg',
    'acHours',
    'solarGenerationKwh',
    'meatMealsPerMonth',
    'wasteBagsCount',
  ];

  for (const field of numericFields) {
    const val = inputs[field];
    if (val !== undefined) {
      if (typeof val !== 'number') {
        throw new TypeError(`Field ${field} must be of type number`);
      }
      if (isNaN(val)) {
        throw new Error(`Field ${field} cannot be NaN`);
      }
      if (val < 0) {
        throw new RangeError(`Field ${field} cannot be negative (${val})`);
      }
    }
  }

  if (inputs.vehicleType !== undefined) {
    const validVehicles = ['petrol_car', 'diesel_car', 'electric_car', 'none'];
    if (!validVehicles.includes(inputs.vehicleType)) {
      throw new Error(`Invalid vehicleType: ${inputs.vehicleType}`);
    }
  }

  if (inputs.dietType !== undefined) {
    const validDiets = ['beef_heavy', 'meat_moderate', 'chicken_poultry', 'vegetarian', 'vegan'];
    if (!validDiets.includes(inputs.dietType)) {
      throw new Error(`Invalid dietType: ${inputs.dietType}`);
    }
  }

  if (inputs.foodWasteLevel !== undefined) {
    const validWaste = ['high', 'medium', 'low'];
    if (!validWaste.includes(inputs.foodWasteLevel)) {
      throw new Error(`Invalid foodWasteLevel: ${inputs.foodWasteLevel}`);
    }
  }

  if (inputs.shoppingLevel !== undefined) {
    const validShopping = ['heavy', 'moderate', 'light'];
    if (!validShopping.includes(inputs.shoppingLevel)) {
      throw new Error(`Invalid shoppingLevel: ${inputs.shoppingLevel}`);
    }
  }
}
