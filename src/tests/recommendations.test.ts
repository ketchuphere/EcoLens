import { describe, it, expect } from 'vitest';
import { generateRecommendations } from '../utils/calculations';
import { CarbonInputs } from '../types';

describe('Recommendations Engine', () => {
  const getBaseInputs = (): CarbonInputs => ({
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
    hasSolar: true,
    solarGenerationKwh: 0,
    dietType: 'vegan',
    meatMealsPerMonth: 0,
    foodWasteLevel: 'low',
    shoppingLevel: 'light',
    recyclesActive: true,
    wasteBagsCount: 0
  });

  it('provides public transport recommendations if user drives a petrol car', () => {
    const inputs: CarbonInputs = {
      ...getBaseInputs(),
      vehicleType: 'petrol_car',
      distanceCar: 200
    };

    const recs = generateRecommendations(inputs, { transport: 42, energy: 0, food: 36, lifestyle: 0 });
    const hasCarTransit = recs.some(r => r.id === 'car_transit');
    expect(hasCarTransit).toBe(true);
  });

  it('supplements standard lists with fallback indicators if user is already highly sustainable', () => {
    const inputs = getBaseInputs();
    const recs = generateRecommendations(inputs, { transport: 0, energy: 0, food: 36, lifestyle: 0 });
    
    expect(recs.length).toBeGreaterThan(0);
    expect(recs[0].id).toBe('low_footprint_ambassador');
  });

  it('triggers thermostat recommendations for high electricity or ac-intensive homes', () => {
    const inputs: CarbonInputs = {
      ...getBaseInputs(),
      electricityKwh: 800,
      acHours: 12
    };

    const recs = generateRecommendations(inputs, { transport: 0, energy: 300, food: 36, lifestyle: 0 });
    const hasThermostat = recs.some(r => r.id === 'thermostats_reduce');
    expect(hasThermostat).toBe(true);
  });

  it('flags red meat intensive habits with meat reduction targets', () => {
    const inputs: CarbonInputs = {
      ...getBaseInputs(),
      dietType: 'beef_heavy'
    };

    const recs = generateRecommendations(inputs, { transport: 0, energy: 0, food: 120, lifestyle: 0 });
    const hasBeefReduction = recs.some(r => r.id === 'beef_reduct');
    expect(hasBeefReduction).toBe(true);
  });

  it('recommends circular recycling and mindful apparel for heavy consumption', () => {
    const inputs: CarbonInputs = {
      ...getBaseInputs(),
      wasteBagsCount: 10,
      recyclesActive: false,
      shoppingLevel: 'heavy'
    };
    const recs = generateRecommendations(inputs, { transport: 0, energy: 0, food: 36, lifestyle: 100 });
    expect(recs.some(r => r.id === 'circular_recycling')).toBe(true);
    expect(recs.some(r => r.id === 'mindful_apparel')).toBe(true);
  });

  it('recommends reduce waste for medium food waste levels', () => {
    const inputs: CarbonInputs = {
      ...getBaseInputs(),
      foodWasteLevel: 'medium'
    };
    const recs = generateRecommendations(inputs, { transport: 0, energy: 0, food: 40, lifestyle: 0 });
    expect(recs.some(r => r.id === 'reduce_waste')).toBe(true);
  });

  it('recommends flight offset when distance flight is high', () => {
    const inputs: CarbonInputs = {
      ...getBaseInputs(),
      distanceFlight: 2000
    };
    const recs = generateRecommendations(inputs, { transport: 500, energy: 0, food: 0, lifestyle: 0 });
    expect(recs.some(r => r.id === 'flight_offset')).toBe(true);
  });

  it('recommends vampire loads when having no solar panels', () => {
    const inputs: CarbonInputs = {
      ...getBaseInputs(),
      hasSolar: false
    };
    const recs = generateRecommendations(inputs, { transport: 0, energy: 10, food: 0, lifestyle: 0 });
    expect(recs.some(r => r.id === 'vampire_load')).toBe(true);
  });
});
