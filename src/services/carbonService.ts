import { CarbonInputs } from '../types';
import { calculateCarbonEmissions, generateRecommendations, CalculationResult, Recommendation } from '../utils/calculations';
import { EcoLensErrorHandler } from '../utils/errorHandler';

/**
 * Service to manage carbon calculations and recommendation retrieval operations.
 */
export const CarbonService = {
  /**
   * Evaluates inputs to return comprehensive carbon category values and scores.
   */
  calculate: (inputs: CarbonInputs): CalculationResult => {
    try {
      return calculateCarbonEmissions(inputs);
    } catch (error) {
      EcoLensErrorHandler.handleError(error, 'Calculation burst failed, using empty baseline');
      return {
        transport: 0,
        energy: 0,
        food: 0,
        lifestyle: 0,
        total: 0,
        sustainabilityScore: 100
      };
    }
  },

  /**
   * Generates dynamic actionable carbon offset recommendations.
   */
  getRecommendations: (
    inputs: CarbonInputs,
    totals: { transport: number; energy: number; food: number; lifestyle: number }
  ): Recommendation[] => {
    try {
      return generateRecommendations(inputs, totals);
    } catch (error) {
      EcoLensErrorHandler.handleError(error, 'Failed to compile recommendation insights');
      return [];
    }
  }
};
