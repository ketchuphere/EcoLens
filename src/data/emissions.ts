export interface EmissionFactor {
  key: string;
  name: string;
  category: 'transport' | 'energy' | 'food' | 'lifestyle';
  value: number; // kg CO2
  unit: string;
}

export const EXPORTED_EMISSION_DATASET: Record<string, number> = {
  // Transport (per km)
  petrol_car: 0.21,
  diesel_car: 0.25,
  electric_car: 0.05,
  bus: 0.08,
  metro: 0.04,
  flight: 0.25,
  train: 0.03,

  // Energy
  electricity: 0.82, // per kWh
  lpg_gas: 2.1,      // per kg
  ac_hour: 0.6,      // per active hour
  solar_saving: -0.5, // offset per solar kWh

  // Food (per meal)
  beef_meal: 27.0,
  pork_meal: 12.1,
  chicken_meal: 6.9,
  vegetarian_meal: 2.0,
  vegan_meal: 1.2,
  food_waste_kg: 1.9, // CO2 per kg food waste

  // Lifestyle
  shopping_heavy: 45.0, // heavy shopping month equivalent
  shopping_moderate: 20.0,
  shopping_light: 5.0,
  recycling_active: -12.0, // monthly offset for recycling
  recycling_none: 0.0,
  waste_bag: 6.2 // CO2 per Standard trash bag
};

export const EMISSION_ITEMS: EmissionFactor[] = [
  { key: 'petrol_car', name: 'Petrol Car', category: 'transport', value: 0.21, unit: 'km' },
  { key: 'diesel_car', name: 'Diesel Car', category: 'transport', value: 0.25, unit: 'km' },
  { key: 'electric_car', name: 'Electric Car', category: 'transport', value: 0.05, unit: 'km' },
  { key: 'bus', name: 'Public Bus', category: 'transport', value: 0.08, unit: 'km' },
  { key: 'metro', name: 'Metro / Subway', category: 'transport', value: 0.04, unit: 'km' },
  { key: 'flight', name: 'Aviation Flight', category: 'transport', value: 0.25, unit: 'km' },
  { key: 'train', name: 'Intercity Train', category: 'transport', value: 0.03, unit: 'km' },

  { key: 'electricity', name: 'Electricity', category: 'energy', value: 0.82, unit: 'kWh' },
  { key: 'lpg_gas', name: 'LPG Gas Cylinder', category: 'energy', value: 2.10, unit: 'kg' },
  { key: 'ac_hour', name: 'Air Conditioning Usage', category: 'energy', value: 0.60, unit: 'hrs' },

  { key: 'beef_meal', name: 'Beef-based Meal', category: 'food', value: 27.0, unit: 'meal' },
  { key: 'pork_meal', name: 'Pork-based Meal', category: 'food', value: 12.1, unit: 'meal' },
  { key: 'chicken_meal', name: 'Chicken-based Meal', category: 'food', value: 6.9, unit: 'meal' },
  { key: 'vegetarian_meal', name: 'Vegetarian Meal', category: 'food', value: 2.0, unit: 'meal' },
  { key: 'vegan_meal', name: 'Vegan Meal', category: 'food', value: 1.2, unit: 'meal' },

  { key: 'shopping_heavy', name: 'Heavy Shopping Activity', category: 'lifestyle', value: 45.0, unit: 'event' },
  { key: 'shopping_moderate', name: 'Standard Shopping Activity', category: 'lifestyle', value: 20.0, unit: 'event' },
  { key: 'waste_bag', name: 'Standard Refuse Waste', category: 'lifestyle', value: 6.20, unit: 'bag' }
];
