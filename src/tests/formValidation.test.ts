import { describe, it, expect } from 'vitest';
import { calculateCarbonEmissions } from '../utils/calculations';
import { validateCarbonInputs, validateNonNegativeNumber, sanitizeNumberInput } from '../utils/validators';
import { CarbonInputs } from '../types';

describe('Calculator Form Input Validation TestSuite', () => {

  describe('1. validateNonNegativeNumber Utility', () => {
    it('accepts valid non-negative integer and decimal inputs', () => {
      expect(validateNonNegativeNumber(0)).toBe(true);
      expect(validateNonNegativeNumber(456)).toBe(true);
      expect(validateNonNegativeNumber('123.45')).toBe(true);
      expect(validateNonNegativeNumber(0.007)).toBe(true);
    });

    it('rejects negative numbers, alphabetical characters, infinity or NaN values', () => {
      expect(validateNonNegativeNumber(-500)).toBe(false);
      expect(validateNonNegativeNumber('-0.5')).toBe(false);
      expect(validateNonNegativeNumber('abc')).toBe(false);
      expect(validateNonNegativeNumber(NaN)).toBe(false);
      expect(validateNonNegativeNumber(Infinity)).toBe(false);
    });
  });

  describe('2. sanitizeNumberInput Wrapper', () => {
    it('returns sanitized inputs cropped or set to fallbacks on parsing errors', () => {
      expect(sanitizeNumberInput('45.2', 10)).toBe(45.2);
      expect(sanitizeNumberInput(-12.8, 100)).toBe(100); // underflow fallback
      expect(sanitizeNumberInput('bad-text-input', 200)).toBe(200); // parsing failure fallback
      expect(sanitizeNumberInput(null, 50)).toBe(50); // null default fallback
    });
  });

  describe('3. validateCarbonInputs Scheme', () => {
    const getBaseInputs = (): CarbonInputs => ({
      vehicleType: 'petrol_car',
      distanceCar: 400,
      distanceBus: 100,
      distanceMetro: 50,
      distanceTrain: 0,
      flightsCount: 0,
      distanceFlight: 0,
      electricityKwh: 200,
      lpgKg: 10,
      acHours: 2,
      hasSolar: false,
      solarGenerationKwh: 0,
      dietType: 'meat_moderate',
      meatMealsPerMonth: 15,
      foodWasteLevel: 'medium',
      shoppingLevel: 'moderate',
      recyclesActive: false,
      wasteBagsCount: 3
    });

    it('successfully permits well-formed inputs within standard boundary limits', () => {
      const valid = getBaseInputs();
      expect(() => validateCarbonInputs(valid)).not.toThrow();
    });

    it('strictly throws RangeError if crucial input variables have negative boundary values', () => {
      const badCar = { ...getBaseInputs(), distanceCar: -45 };
      expect(() => validateCarbonInputs(badCar)).toThrow(RangeError);

      const badElectricity = { ...getBaseInputs(), electricityKwh: -500 };
      expect(() => validateCarbonInputs(badElectricity)).toThrow(RangeError);

      const badAChours = { ...getBaseInputs(), acHours: -2 };
      expect(() => validateCarbonInputs(badAChours)).toThrow(RangeError);
    });

    it('strictly throws TypeError when non-numeric types are supplied into numeric schema fields', () => {
      const textCar = { ...getBaseInputs(), distanceCar: 'one-hundred' as unknown as number };
      expect(() => validateCarbonInputs(textCar)).toThrow(TypeError);
    });

    it('rejects invalid, unknown, or compromised enum values', () => {
      const badVehicle = { ...getBaseInputs(), vehicleType: 'intergalactic_rocket' as unknown as 'petrol_car' };
      expect(() => validateCarbonInputs(badVehicle)).toThrow(Error);

      const badDiet = { ...getBaseInputs(), dietType: 'unsupported_diet' as unknown as 'vegan' };
      expect(() => validateCarbonInputs(badDiet)).toThrow(Error);
    });
  });

  describe('4. Emissions computation with decimals & empty boundary states', () => {
    it('safely computes outputs with high precision when decimal figures are passed', () => {
      const inputs: CarbonInputs = {
        vehicleType: 'petrol_car',
        distanceCar: 100.5,
        distanceBus: 50.25,
        distanceMetro: 0,
        distanceTrain: 0,
        flightsCount: 0,
        distanceFlight: 0,
        electricityKwh: 120.75,
        lpgKg: 5.5,
        acHours: 1.5,
        hasSolar: true,
        solarGenerationKwh: 12.25,
        dietType: 'vegan',
        meatMealsPerMonth: 0,
        foodWasteLevel: 'low',
        shoppingLevel: 'light',
        recyclesActive: true,
        wasteBagsCount: 1
      };

      const result = calculateCarbonEmissions(inputs);
      expect(result.total).toBeGreaterThan(0);
      expect(result.sustainabilityScore).toBeGreaterThanOrEqual(10);
    });
  });
});
