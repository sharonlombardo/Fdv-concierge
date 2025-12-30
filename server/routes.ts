import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { saveJournalEntrySchema, journalEntrySchema, customImageSchema, imageLibraryItemSchema, imageRuleSchema } from "@shared/schema";

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

  // Image Library API
  app.get("/api/library", async (req, res) => {
    try {
      const images = await storage.getImageLibrary();
      res.json(images);
    } catch (error) {
      console.error("Error fetching image library:", error);
      res.status(500).json({ error: "Failed to fetch image library" });
    }
  });

  app.post("/api/library", async (req, res) => {
    try {
      const validationResult = imageLibraryItemSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid image data", 
          details: validationResult.error.errors 
        });
      }

      const data = validationResult.data;
      const image = await storage.addImageToLibrary({
        imageUrl: data.imageUrl,
        name: data.name,
        tags: data.tags,
        category: data.category || "general",
        priority: data.priority || 0,
      });
      res.json(image);
    } catch (error) {
      console.error("Error adding image to library:", error);
      res.status(500).json({ error: "Failed to add image to library" });
    }
  });

  app.patch("/api/library/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validationResult = imageLibraryItemSchema.partial().safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid image data", 
          details: validationResult.error.errors 
        });
      }

      const image = await storage.updateImageInLibrary(id, validationResult.data);
      if (!image) {
        return res.status(404).json({ error: "Image not found" });
      }
      res.json(image);
    } catch (error) {
      console.error("Error updating image:", error);
      res.status(500).json({ error: "Failed to update image" });
    }
  });

  app.delete("/api/library/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteImageFromLibrary(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ error: "Failed to delete image" });
    }
  });

  // Image Rules API
  app.get("/api/rules", async (req, res) => {
    try {
      const rules = await storage.getImageRules();
      res.json(rules);
    } catch (error) {
      console.error("Error fetching image rules:", error);
      res.status(500).json({ error: "Failed to fetch image rules" });
    }
  });

  app.post("/api/rules", async (req, res) => {
    try {
      const validationResult = imageRuleSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid rule data", 
          details: validationResult.error.errors 
        });
      }

      const data = validationResult.data;
      const rule = await storage.addImageRule({
        name: data.name,
        imageType: data.imageType || "item",
        matchLocation: data.matchLocation || [],
        matchTime: data.matchTime || [],
        matchKeywords: data.matchKeywords || [],
        assignTags: data.assignTags,
        priority: data.priority || 0,
        enabled: data.enabled ?? 1,
      });
      res.json(rule);
    } catch (error) {
      console.error("Error adding rule:", error);
      res.status(500).json({ error: "Failed to add rule" });
    }
  });

  app.patch("/api/rules/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validationResult = imageRuleSchema.partial().safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid rule data", 
          details: validationResult.error.errors 
        });
      }

      const rule = await storage.updateImageRule(id, validationResult.data);
      if (!rule) {
        return res.status(404).json({ error: "Rule not found" });
      }
      res.json(rule);
    } catch (error) {
      console.error("Error updating rule:", error);
      res.status(500).json({ error: "Failed to update rule" });
    }
  });

  app.delete("/api/rules/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteImageRule(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting rule:", error);
      res.status(500).json({ error: "Failed to delete rule" });
    }
  });

  return httpServer;
}
