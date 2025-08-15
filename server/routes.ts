import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFoodEntrySchema, insertCalorieGoalSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get food entries for a specific date
  app.get("/api/food-entries/:date", async (req, res) => {
    try {
      const { date } = req.params;
      const entries = await storage.getFoodEntries(date);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch food entries" });
    }
  });

  // Get food entries for a date range
  app.get("/api/food-entries", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }
      const entries = await storage.getFoodEntriesRange(startDate as string, endDate as string);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch food entries" });
    }
  });

  // Create a new food entry
  app.post("/api/food-entries", async (req, res) => {
    try {
      const validatedData = insertFoodEntrySchema.parse(req.body);
      const entry = await storage.createFoodEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create food entry" });
    }
  });

  // Update a food entry
  app.patch("/api/food-entries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertFoodEntrySchema.partial().parse(req.body);
      const entry = await storage.updateFoodEntry(id, validatedData);
      if (!entry) {
        return res.status(404).json({ message: "Food entry not found" });
      }
      res.json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update food entry" });
    }
  });

  // Delete a food entry
  app.delete("/api/food-entries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteFoodEntry(id);
      if (!deleted) {
        return res.status(404).json({ message: "Food entry not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete food entry" });
    }
  });

  // Get recent foods
  app.get("/api/recent-foods", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const recentFoods = await storage.getRecentFoods(limit);
      res.json(recentFoods);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent foods" });
    }
  });

  // Get calorie goal for a specific date
  app.get("/api/calorie-goals/:date", async (req, res) => {
    try {
      const { date } = req.params;
      const goal = await storage.getCalorieGoal(date);
      if (!goal) {
        // Return default goal if none set
        return res.json({ dailyCaloriesGoal: 2000, date });
      }
      res.json(goal);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch calorie goal" });
    }
  });

  // Set calorie goal for a specific date
  app.post("/api/calorie-goals", async (req, res) => {
    try {
      const validatedData = insertCalorieGoalSchema.parse(req.body);
      const goal = await storage.setCalorieGoal(validatedData);
      res.json(goal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to set calorie goal" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
