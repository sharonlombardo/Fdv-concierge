import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { saveJournalEntrySchema, journalEntrySchema, customImageSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/journal", async (req, res) => {
    try {
      const entries = await storage.getJournalEntries();
      res.json(entries);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      res.status(500).json({ error: "Failed to fetch journal entries" });
    }
  });

  app.get("/api/journal/:id", async (req, res) => {
    try {
      const entry = await storage.getJournalEntry(req.params.id);
      if (!entry) {
        return res.status(404).json({ error: "Entry not found" });
      }
      res.json(entry);
    } catch (error) {
      console.error("Error fetching journal entry:", error);
      res.status(500).json({ error: "Failed to fetch journal entry" });
    }
  });

  app.post("/api/journal/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const validationResult = journalEntrySchema.partial().safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid journal entry data", 
          details: validationResult.error.errors 
        });
      }

      const entry = await storage.saveJournalEntry(id, validationResult.data);
      res.json(entry);
    } catch (error) {
      console.error("Error saving journal entry:", error);
      res.status(500).json({ error: "Failed to save journal entry" });
    }
  });

  // Custom Images API
  app.get("/api/images", async (req, res) => {
    try {
      const images = await storage.getCustomImages();
      res.json(images);
    } catch (error) {
      console.error("Error fetching custom images:", error);
      res.status(500).json({ error: "Failed to fetch custom images" });
    }
  });

  app.post("/api/images/:imageKey", async (req, res) => {
    try {
      const imageKey = req.params.imageKey;
      const validationResult = customImageSchema.partial().safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid image data", 
          details: validationResult.error.errors 
        });
      }

      const data = validationResult.data;
      if (!data.customUrl) {
        return res.status(400).json({ error: "customUrl is required" });
      }

      const image = await storage.saveCustomImage(imageKey, {
        customUrl: data.customUrl,
        originalUrl: data.originalUrl,
        label: data.label,
      });
      res.json(image);
    } catch (error) {
      console.error("Error saving custom image:", error);
      res.status(500).json({ error: "Failed to save custom image" });
    }
  });

  app.delete("/api/images/:imageKey", async (req, res) => {
    try {
      const imageKey = req.params.imageKey;
      await storage.deleteCustomImage(imageKey);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting custom image:", error);
      res.status(500).json({ error: "Failed to delete custom image" });
    }
  });

  return httpServer;
}
