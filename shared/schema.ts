import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const foodEntries = pgTable("food_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  calories: integer("calories").notNull(),
  serving: text("serving"),
  mealType: text("meal_type").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
  timestamp: timestamp("timestamp").defaultNow(),
});

export const calorieGoals = pgTable("calorie_goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dailyCaloriesGoal: integer("daily_calories_goal").notNull().default(2000),
  date: text("date").notNull(), // YYYY-MM-DD format
});

export const insertFoodEntrySchema = createInsertSchema(foodEntries).omit({
  id: true,
  timestamp: true,
}).extend({
  calories: z.number().min(0, "Calories must be a positive number"),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

export const insertCalorieGoalSchema = createInsertSchema(calorieGoals).omit({
  id: true,
}).extend({
  dailyCaloriesGoal: z.number().min(1, "Daily calorie goal must be at least 1"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

export type InsertFoodEntry = z.infer<typeof insertFoodEntrySchema>;
export type FoodEntry = typeof foodEntries.$inferSelect;
export type InsertCalorieGoal = z.infer<typeof insertCalorieGoalSchema>;
export type CalorieGoal = typeof calorieGoals.$inferSelect;
