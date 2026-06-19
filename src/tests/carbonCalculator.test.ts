import { describe, it, expect } from 'vitest';
import { calculateCarbonEmissions } from '../utils/calculations';
import { CarbonService } from '../services/carbonService';
import { 
  validateNonNegativeNumber, 
  sanitizeNumberInput, 
  sanitizeStringInput, 
  validateCarbonInputs 
} from '../utils/validators';
import { CarbonInputs } from '../types';

describe('Carbon Calculator & Validators & Service', () => {
  const getBaseInputs = (): CarbonInputs => ({
    vehicleType: 'petrol_car', // Petrol car: 0.21
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
    dietType: 'vegan', // 90 * 1.2 = 108
    meatMealsPerMonth: 0,
    foodWasteLevel: 'low', // 0
    shoppingLevel: 'light', // 5.0
    recyclesActive: true, // -12
    wasteBagsCount: 0
  });

  describe('calculateCarbonEmissions', () => {
    it('calculates valid emissions correctly (distance:100, petrol_car:0.21 => 21 kg CO2)', () => {
      const inputs = {
        ...getBaseInputs(),
        distanceCar: 100
      };
      const result = calculateCarbonEmissions(inputs);
      expect(result.transport).toBe(21);
      expect(result.food).toBe(108);
      expect(result.lifestyle).toBe(0);
      expect(result.total).toBe(129);
    });

    it('handles zero values cleanly', () => {
      const inputs = getBaseInputs();
      const result = calculateCarbonEmissions(inputs);
      expect(result.transport).toBe(0);
      expect(result.energy).toBe(0);
      expect(result.food).toBe(108);
      expect(result.lifestyle).toBe(0);
      expect(result.total).toBe(108);
    });

    it('calculates diesel and electric car emissions', () => {
      const dieselInputs = { ...getBaseInputs(), vehicleType: 'diesel_car' as const, distanceCar: 100 };
      expect(calculateCarbonEmissions(dieselInputs).transport).toBe(25); // 100 * 0.25

      const electricInputs = { ...getBaseInputs(), vehicleType: 'electric_car' as const, distanceCar: 100 };
      expect(calculateCarbonEmissions(electricInputs).transport).toBe(5); // 100 * 0.05
    });

    it('calculates transit details with bus, metro, train, flight, lpg, ac, and solar power', () => {
      const complexInputs: CarbonInputs = {
        ...getBaseInputs(),
        distanceBus: 100, // 100 * 0.08 = 8
        distanceMetro: 100, // 100 * 0.04 = 4
        distanceTrain: 100, // 100 * 0.03 = 3
        distanceFlight: 100, // 100 * 0.25 = 25
        electricityKwh: 100, // 100 * 0.82 = 82
        lpgKg: 10, // 10 * 2.1 = 21
        acHours: 2, // 2 * 30 * 0.6 = 36
        hasSolar: true,
        solarGenerationKwh: 50, // 50 * -0.5 = -25
        dietType: 'chicken_poultry' as const, // 40 * 6.9 + 50 * 2 = 276 + 100 = 376
        meatMealsPerMonth: 0,
        foodWasteLevel: 'high' as const, // 30
        shoppingLevel: 'heavy' as const, // 45
        wasteBagsCount: 5, // 5 * 4.3 * 6.2 = 133.3
        recyclesActive: false
      };

      const res = calculateCarbonEmissions(complexInputs);
      expect(res.transport).toBe(40); // 25 + 8 + 4 + 3
      expect(res.energy).toBe(114); // 82 + 21 + 36 - 25
      expect(res.food).toBe(406); // 376 + 30
      expect(res.lifestyle).toBe(178.3); // 45 + 133.3
    });

    it('throws validation error for negative values (e.g. distanceCar: -10)', () => {
      const inputs = {
        ...getBaseInputs(),
        distanceCar: -10
      };
      expect(() => calculateCarbonEmissions(inputs)).toThrow(RangeError);
    });

    it('throws validation error for invalid field types or invalid enums', () => {
      const inputs = {
        ...getBaseInputs(),
        vehicleType: 'invalid_vehicle' as unknown as 'petrol_car'
      };
      expect(() => calculateCarbonEmissions(inputs)).toThrow();
    });
  });

  describe('CarbonService Wrapper', () => {
    it('safely calculates emissions and falls back on error', () => {
      const inputs = getBaseInputs();
      const res = CarbonService.calculate(inputs);
      expect(res.total).toBe(108);

      const badInputs = { ...inputs, distanceCar: -99 };
      const fallbackRes = CarbonService.calculate(badInputs);
      expect(fallbackRes.total).toBe(0);
      expect(fallbackRes.sustainabilityScore).toBe(100);
    });

    it('safely compiles recommendations or returns backup plans on error', () => {
      const inputs = getBaseInputs();
      const recs = CarbonService.getRecommendations(inputs, { transport: 0, energy: 0, food: 108, lifestyle: 0 });
      expect(recs.length).toBeGreaterThan(0);

      const badRecs = CarbonService.getRecommendations(null as unknown as CarbonInputs, { transport: 0, energy: 0, food: 0, lifestyle: 0 });
      expect(badRecs).toEqual([]);
    });
  });

  describe('Validators Layer', () => {
    it('validates non negative numbers', () => {
      expect(validateNonNegativeNumber(123)).toBe(true);
      expect(validateNonNegativeNumber('45.5')).toBe(true);
      expect(validateNonNegativeNumber(-5)).toBe(false);
      expect(validateNonNegativeNumber(null)).toBe(false);
      expect(validateNonNegativeNumber(undefined)).toBe(false);
      expect(validateNonNegativeNumber('not-a-number')).toBe(false);
    });

    it('sanitizes number inputs to fallbacks properly', () => {
      expect(sanitizeNumberInput(5)).toBe(5);
      expect(sanitizeNumberInput('100', 10)).toBe(100);
      expect(sanitizeNumberInput('', 20)).toBe(20);
      expect(sanitizeNumberInput(null, 30)).toBe(30);
      expect(sanitizeNumberInput(undefined, 40)).toBe(40);
      expect(sanitizeNumberInput('bad', 50)).toBe(50);
      expect(sanitizeNumberInput(-10, 60)).toBe(60);
    });

    it('sanitizes string inputs nicely', () => {
      expect(sanitizeStringInput(' Hello World ', 'fallback')).toBe('Hello World');
      expect(sanitizeStringInput(123, 'fallback')).toBe('fallback');
      expect(sanitizeStringInput(null, 'fallback')).toBe('fallback');
    });

    it('validates complete input objects thoroughly', () => {
      expect(() => validateCarbonInputs({ distanceCar: 'not-num' as unknown as number })).toThrow(TypeError);
      expect(() => validateCarbonInputs({ distanceCar: NaN })).toThrow();
      expect(() => validateCarbonInputs({ vehicleType: 'invalid' as unknown as 'petrol_car' })).toThrow();
      expect(() => validateCarbonInputs({ dietType: 'invalid' as unknown as 'vegan' })).toThrow();
      expect(() => validateCarbonInputs({ foodWasteLevel: 'invalid' as unknown as 'none' })).toThrow();
      expect(() => validateCarbonInputs({ shoppingLevel: 'invalid' as unknown as 'average' })).toThrow();
    });
  });
});
