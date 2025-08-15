import { type FoodEntry, type InsertFoodEntry, type CalorieGoal, type InsertCalorieGoal } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Food entries
  getFoodEntries(date: string): Promise<FoodEntry[]>;
  getFoodEntriesRange(startDate: string, endDate: string): Promise<FoodEntry[]>;
  createFoodEntry(entry: InsertFoodEntry): Promise<FoodEntry>;
  updateFoodEntry(id: string, entry: Partial<InsertFoodEntry>): Promise<FoodEntry | undefined>;
  deleteFoodEntry(id: string): Promise<boolean>;
  getRecentFoods(limit?: number): Promise<FoodEntry[]>;
  
  // Calorie goals
  getCalorieGoal(date: string): Promise<CalorieGoal | undefined>;
  setCalorieGoal(goal: InsertCalorieGoal): Promise<CalorieGoal>;
}

export class MemStorage implements IStorage {
  private foodEntries: Map<string, FoodEntry>;
  private calorieGoals: Map<string, CalorieGoal>;

  constructor() {
    this.foodEntries = new Map();
    this.calorieGoals = new Map();
  }

  async getFoodEntries(date: string): Promise<FoodEntry[]> {
    return Array.from(this.foodEntries.values())
      .filter(entry => entry.date === date)
      .sort((a, b) => new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime());
  }

  async getFoodEntriesRange(startDate: string, endDate: string): Promise<FoodEntry[]> {
    return Array.from(this.foodEntries.values())
      .filter(entry => entry.date >= startDate && entry.date <= endDate)
      .sort((a, b) => new Date(a.timestamp!).getTime() - new Date(b.timestamp!).getTime());
  }

  async createFoodEntry(insertEntry: InsertFoodEntry): Promise<FoodEntry> {
    const id = randomUUID();
    const entry: FoodEntry = {
      ...insertEntry,
      id,
      serving: insertEntry.serving || null,
      timestamp: new Date(),
    };
    this.foodEntries.set(id, entry);
    return entry;
  }

  async updateFoodEntry(id: string, updateData: Partial<InsertFoodEntry>): Promise<FoodEntry | undefined> {
    const existing = this.foodEntries.get(id);
    if (!existing) return undefined;

    const updated: FoodEntry = {
      ...existing,
      ...updateData,
    };
    this.foodEntries.set(id, updated);
    return updated;
  }

  async deleteFoodEntry(id: string): Promise<boolean> {
    return this.foodEntries.delete(id);
  }

  async getRecentFoods(limit: number = 10): Promise<FoodEntry[]> {
    const uniqueFoods = new Map<string, FoodEntry>();
    
    // Get all entries sorted by timestamp descending
    const sortedEntries = Array.from(this.foodEntries.values())
      .sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime());

    // Keep only the most recent entry for each unique food name
    for (const entry of sortedEntries) {
      const key = `${entry.name}-${entry.serving}`;
      if (!uniqueFoods.has(key)) {
        uniqueFoods.set(key, entry);
      }
    }

    return Array.from(uniqueFoods.values()).slice(0, limit);
  }

  async getCalorieGoal(date: string): Promise<CalorieGoal | undefined> {
    return this.calorieGoals.get(date);
  }

  async setCalorieGoal(insertGoal: InsertCalorieGoal): Promise<CalorieGoal> {
    const id = randomUUID();
    const goal: CalorieGoal = {
      ...insertGoal,
      id,
    };
    this.calorieGoals.set(insertGoal.date, goal);
    return goal;
  }
}

export const storage = new MemStorage();
