import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '../services/storageService';
import { FootprintRecord, UserGoal, DailyHabits, FamilyMember } from '../types';

describe('Storage Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and retrieves footprint records correctly', () => {
    const dummyRecord: FootprintRecord = {
      id: 'month-test-1',
      date: '2026-06',
      isDaily: false,
      transport: 120,
      energy: 80,
      food: 95,
      lifestyle: 40,
      total: 335,
      inputs: {
        vehicleType: 'petrol_car',
        distanceCar: 500,
        distanceBus: 0,
        distanceMetro: 0,
        distanceTrain: 0,
        flightsCount: 0,
        distanceFlight: 0,
        electricityKwh: 120,
        lpgKg: 10,
        acHours: 2,
        hasSolar: false,
        solarGenerationKwh: 0,
        dietType: 'meat_moderate',
        meatMealsPerMonth: 12,
        foodWasteLevel: 'medium',
        shoppingLevel: 'moderate',
        recyclesActive: true,
        wasteBagsCount: 2
      }
    };

    expect(StorageService.getRecords()).toEqual([]);
    StorageService.saveRecords([dummyRecord]);

    const records = StorageService.getRecords();
    expect(records.length).toBe(1);
    expect(records[0].id).toBe('month-test-1');

    StorageService.saveRecords([]);
    expect(StorageService.getRecords()).toEqual([]);
  });

  it('handles user goals read and write seamlessly', () => {
    const defaultGoal: UserGoal = {
      active: false,
      targetReductionPercent: 10,
      baselineEmissions: 400,
      targetEmissions: 360
    };

    const initialGoal = StorageService.getGoal(defaultGoal);
    expect(initialGoal).toEqual(defaultGoal);

    const updatedGoal: UserGoal = {
      active: true,
      targetReductionPercent: 20,
      baselineEmissions: 400,
      targetEmissions: 320
    };

    StorageService.saveGoal(updatedGoal);
    expect(StorageService.getGoal(defaultGoal)).toEqual(updatedGoal);
  });

  it('tracks points, streaks, badges and challenges correctly', () => {
    // Streak
    expect(StorageService.getStreak(1)).toBe(1);
    StorageService.saveStreak(5);
    expect(StorageService.getStreak()).toBe(5);

    // Points
    expect(StorageService.getPoints(10)).toBe(10);
    StorageService.savePoints(150);
    expect(StorageService.getPoints()).toBe(150);

    // Badges
    expect(StorageService.getBadges(['initial'])).toEqual(['initial']);
    StorageService.saveBadges(['eco_warrior', 'solar_power']);
    expect(StorageService.getBadges()).toEqual(['eco_warrior', 'solar_power']);

    // Challenges
    expect(StorageService.getChallenges([101])).toEqual([101]);
    StorageService.saveChallenges([201, 202]);
    expect(StorageService.getChallenges()).toEqual([201, 202]);
  });

  it('tracks family members data', () => {
    expect(StorageService.getFamily()).toEqual([]);
    const family: FamilyMember[] = [{
      id: 'fam-1',
      name: 'Emma',
      transport: 10,
      energy: 20,
      food: 30,
      lifestyle: 40,
      total: 100
    }];
    StorageService.saveFamily(family);
    expect(StorageService.getFamily()).toEqual(family);
  });

  it('tracks daily habits checklist progress', () => {
    const initialChecklist: DailyHabits = {
      date: '2026-06-19',
      usedPublicTransport: false,
      savedElectricity: false,
      recycledWaste: false,
      avoidedFoodWaste: false,
      usedBottleOrCup: false,
      atePlantBased: false,
      unpluggedVampireLoads: false,
      washedColdWater: false,
      compostedScraps: false,
      bikedOrWalked: false
    };

    const fallbackChecklist = StorageService.getHabits(initialChecklist);
    expect(fallbackChecklist).toEqual(initialChecklist);

    const savedChecklist = { ...initialChecklist, usedPublicTransport: true, atePlantBased: true };
    StorageService.saveHabits(savedChecklist);
    expect(StorageService.getHabits(initialChecklist).usedPublicTransport).toBe(true);
    expect(StorageService.getHabits(initialChecklist).atePlantBased).toBe(true);
  });

  it('gracefully handles and parses malformed local storage item entries and triggers fallbacks', () => {
    localStorage.setItem('ecolens_records', '{bad_json}');
    expect(StorageService.getRecords()).toEqual([]);

    localStorage.setItem('ecolens_goals', '{bad_json}');
    const fallbackGoal: UserGoal = { active: false, targetReductionPercent: 10, baselineEmissions: 100, targetEmissions: 90 };
    expect(StorageService.getGoal(fallbackGoal)).toEqual(fallbackGoal);

    localStorage.setItem('ecolens_streak', 'bad_streak');
    expect(StorageService.getStreak(2)).toBe(2);

    localStorage.setItem('ecolens_points', 'bad_points');
    expect(StorageService.getPoints(5)).toBe(5);

    localStorage.setItem('ecolens_badges', '{bad_json}');
    expect(StorageService.getBadges(['gold'])).toEqual(['gold']);

    localStorage.setItem('ecolens_challenges', '{bad_json}');
    expect(StorageService.getChallenges([1])).toEqual([1]);

    localStorage.setItem('ecolens_family', '{bad_json}');
    expect(StorageService.getFamily()).toEqual([]);

    localStorage.setItem('ecolens_habits', '{bad_json}');
    const habits: DailyHabits = { date: '2026', usedPublicTransport: false, savedElectricity: false, recycledWaste: false, avoidedFoodWaste: false, usedBottleOrCup: false, atePlantBased: false, unpluggedVampireLoads: false, washedColdWater: false, compostedScraps: false, bikedOrWalked: false };
    expect(StorageService.getHabits(habits)).toEqual(habits);
  });

  it('covers storage write errors completely', () => {
    const origSet = localStorage.setItem;
    localStorage.setItem = () => { throw new Error('Mock write error'); };

    // These should safely trigger the try/catch logging statements under StorageService
    StorageService.saveRecords([{ id: 'month-x' } as unknown as FootprintRecord]);
    StorageService.saveGoal({} as unknown as UserGoal);
    StorageService.saveBadges([]);
    StorageService.saveChallenges([]);
    StorageService.saveFamily([]);
    StorageService.saveHabits({} as unknown as DailyHabits);

    // Restore
    localStorage.setItem = origSet;
  });

  it('completely cleans storage state when clearAll is called', () => {
    StorageService.saveStreak(10);
    StorageService.savePoints(300);
    expect(StorageService.getStreak()).toBe(10);

    StorageService.clearAll();
    expect(StorageService.getStreak()).toBe(0);
    expect(StorageService.getPoints()).toBe(0);
  });
});
