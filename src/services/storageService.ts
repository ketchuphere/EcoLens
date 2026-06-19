import { FootprintRecord, UserGoal, FamilyMember, DailyHabits } from '../types';
import { EcoLensErrorHandler } from '../utils/errorHandler';

/**
 * Storage service keys for consistency.
 */
const KEYS = {
  RECORDS: 'ecolens_records',
  GOALS: 'ecolens_goals',
  STREAK: 'ecolens_streak',
  POINTS: 'ecolens_points',
  BADGES: 'ecolens_badges',
  CHALLENGES: 'ecolens_challenges',
  FAMILY: 'ecolens_family',
  HABITS: 'ecolens_habits'
} as const;

/**
 * Type-safe storage helper utility.
 */
export const StorageService = {
  // --- Records ---
  getRecords: (): FootprintRecord[] => {
    try {
      const data = localStorage.getItem(KEYS.RECORDS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      EcoLensErrorHandler.handleError(e, 'Error parsing records');
      return [];
    }
  },

  saveRecords: (records: FootprintRecord[]): void => {
    try {
      if (records.length > 0) {
        localStorage.setItem(KEYS.RECORDS, JSON.stringify(records));
      } else {
        localStorage.removeItem(KEYS.RECORDS);
      }
    } catch (e) {
      EcoLensErrorHandler.handleError(e, 'Error saving records');
    }
  },

  // --- Goals ---
  getGoal: (defaultGoal: UserGoal): UserGoal => {
    try {
      const data = localStorage.getItem(KEYS.GOALS);
      return data ? JSON.parse(data) : defaultGoal;
    } catch (e) {
      EcoLensErrorHandler.handleError(e, 'Error parsing goals');
      return defaultGoal;
    }
  },

  saveGoal: (goal: UserGoal): void => {
    try {
      localStorage.setItem(KEYS.GOALS, JSON.stringify(goal));
    } catch (e) {
      EcoLensErrorHandler.handleError(e, 'Error saving goal');
    }
  },

  // --- Streak ---
  getStreak: (fallback = 0): number => {
    try {
      const data = localStorage.getItem(KEYS.STREAK);
      if (!data) return fallback;
      const parsed = parseInt(data, 10);
      return isNaN(parsed) ? fallback : parsed;
    } catch (e) {
      EcoLensErrorHandler.handleError(e, 'Error reading streak');
      return fallback;
    }
  },

  saveStreak: (streak: number): void => {
    localStorage.setItem(KEYS.STREAK, String(streak));
  },

  // --- Points ---
  getPoints: (fallback = 0): number => {
    try {
      const data = localStorage.getItem(KEYS.POINTS);
      if (!data) return fallback;
      const parsed = parseInt(data, 10);
      return isNaN(parsed) ? fallback : parsed;
    } catch (e) {
      EcoLensErrorHandler.handleError(e, 'Error reading points');
      return fallback;
    }
  },

  savePoints: (points: number): void => {
    localStorage.setItem(KEYS.POINTS, String(points));
  },

  // --- Badges ---
  getBadges: (fallback: string[] = []): string[] => {
    try {
      const data = localStorage.getItem(KEYS.BADGES);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      EcoLensErrorHandler.handleError(e, 'Error reading badges');
      return fallback;
    }
  },

  saveBadges: (badges: string[]): void => {
    try {
      localStorage.setItem(KEYS.BADGES, JSON.stringify(badges));
    } catch (e) {
      EcoLensErrorHandler.handleError(e, 'Error saving badges');
    }
  },

  // --- Challenges ---
  getChallenges: (fallback: number[] = []): number[] => {
    try {
      const data = localStorage.getItem(KEYS.CHALLENGES);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      EcoLensErrorHandler.handleError(e, 'Error reading challenges');
      return fallback;
    }
  },

  saveChallenges: (challenges: number[]): void => {
    try {
      localStorage.setItem(KEYS.CHALLENGES, JSON.stringify(challenges));
    } catch (e) {
      EcoLensErrorHandler.handleError(e, 'Error saving challenges');
    }
  },

  // --- Family ---
  getFamily: (): FamilyMember[] => {
    try {
      const data = localStorage.getItem(KEYS.FAMILY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      EcoLensErrorHandler.handleError(e, 'Error reading family members');
      return [];
    }
  },

  saveFamily: (family: FamilyMember[]): void => {
    try {
      localStorage.setItem(KEYS.FAMILY, JSON.stringify(family));
    } catch (e) {
      EcoLensErrorHandler.handleError(e, 'Error saving family members');
    }
  },

  // --- Habits ---
  getHabits: (fallback: DailyHabits): DailyHabits => {
    try {
      const data = localStorage.getItem(KEYS.HABITS);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      EcoLensErrorHandler.handleError(e, 'Error reading daily checklist habits');
      return fallback;
    }
  },

  saveHabits: (habits: DailyHabits): void => {
    try {
      localStorage.setItem(KEYS.HABITS, JSON.stringify(habits));
    } catch (e) {
      EcoLensErrorHandler.handleError(e, 'Error saving habits');
    }
  },

  // --- Clear ---
  clearAll: (): void => {
    try {
      localStorage.clear();
    } catch (e) {
      EcoLensErrorHandler.handleError(e, 'Failure clearing LocalStorage cache');
    }
  }
};
