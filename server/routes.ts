import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { saveJournalEntrySchema, journalEntrySchema, customImageSchema, imageLibraryItemSchema, imageRuleSchema, selfieImageSchema, saveSchema } from "@shared/schema";
import { IMAGE_SLOTS, getSlotsBySection } from "@shared/image-slots";
import { generateMoroccoSeedItems, MOROCCO_SEED_ITEM_COUNT } from "@shared/morocco-seed-data";
import { EMBEDDED_IMAGE_MAPPINGS } from "@shared/embedded-image-mappings";
import { registerObjectStorageRoutes, ObjectStorageService } from "./replit_integrations/object_storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Register object storage routes for file uploads
  registerObjectStorageRoutes(app);
  
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

  // Helper to fix HTML entity encoding in URLs (production build can encode & as &amp;)
  const sanitizeUrl = (url: string): string => {
    if (!url) return url;
    return url.replace(/&amp;/g, '&');
  };

  // Image Slots API - centralized image management
  app.get("/api/image-slots", async (req, res) => {
    try {
      let customImageMap = new Map<string, string>();
      
      try {
        const customImages = await storage.getCustomImages();
        if (customImages.length > 0) {
          customImageMap = new Map(customImages.map(img => [img.imageKey, img.customUrl]));
        }
      } catch (dbError) {
        console.warn("Database unavailable for custom images:", dbError);
      }
      
      // Use embedded mappings as fallback when database is empty or unavailable
      if (customImageMap.size === 0) {
        console.log("Using embedded image mappings (database empty or unavailable)");
        customImageMap = new Map(Object.entries(EMBEDDED_IMAGE_MAPPINGS));
      }
      
      const slotsWithOverrides = IMAGE_SLOTS.map(slot => ({
        ...slot,
        defaultUrl: sanitizeUrl(slot.defaultUrl),
        currentUrl: sanitizeUrl(customImageMap.get(slot.key) || slot.defaultUrl),
        hasCustomImage: customImageMap.has(slot.key)
      }));
      
      res.json({
        slots: slotsWithOverrides,
        grouped: getSlotsBySection()
      });
    } catch (error) {
      console.error("Error fetching image slots:", error);
      res.status(500).json({ error: "Failed to fetch image slots" });
    }
  });

  // Custom Images API
  app.get("/api/images", async (req, res) => {
    try {
      const images = await storage.getCustomImages();
      res.json(images);
    } catch (error) {
      console.warn("Database unavailable for custom images, returning empty:", error);
      res.json([]);
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
      console.warn("Database unavailable for image library, returning empty:", error);
      res.json([]);
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
      console.warn("Database unavailable for image rules, returning empty:", error);
      res.json([]);
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

  // Selfie Images API
  app.get("/api/selfies", async (req, res) => {
    try {
      const selfies = await storage.getSelfieImages();
      res.json(selfies);
    } catch (error) {
      console.error("Error fetching selfies:", error);
      res.status(500).json({ error: "Failed to fetch selfies" });
    }
  });

  app.post("/api/selfies", async (req, res) => {
    try {
      const validationResult = selfieImageSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid selfie data", 
          details: validationResult.error.errors 
        });
      }

      const data = validationResult.data;
      const selfie = await storage.addSelfieImage({
        name: data.name,
        originalUrl: data.originalUrl,
        processedUrl: data.processedUrl,
      });
      res.json(selfie);
    } catch (error) {
      console.error("Error adding selfie:", error);
      res.status(500).json({ error: "Failed to add selfie" });
    }
  });

  app.patch("/api/selfies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validationResult = selfieImageSchema.partial().safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid selfie data", 
          details: validationResult.error.errors 
        });
      }

      const selfie = await storage.updateSelfieImage(id, validationResult.data);
      if (!selfie) {
        return res.status(404).json({ error: "Selfie not found" });
      }
      res.json(selfie);
    } catch (error) {
      console.error("Error updating selfie:", error);
      res.status(500).json({ error: "Failed to update selfie" });
    }
  });

  app.delete("/api/selfies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSelfieImage(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting selfie:", error);
      res.status(500).json({ error: "Failed to delete selfie" });
    }
  });

  // Helper function to auto-seed morocco data when missing
  async function autoSeedMoroccoIfEmpty() {
    try {
      const allSaves = await storage.getSaves();
      
      // Check if Morocco Edit items already exist
      const moroccoSaves = allSaves.filter(s => 
        s.editTag === 'morocco-edit' || 
        s.storyTag === 'morocco' || 
        (s.sourceContext && s.sourceContext.includes('morocco'))
      );
      
      const canonicalItems = generateMoroccoSeedItems();
      const THRESHOLD = Math.floor(canonicalItems.length * 0.5); // 50% threshold
      
      // Skip seeding if we already have most Morocco items
      if (moroccoSaves.length >= THRESHOLD) {
        return allSaves;
      }
      
      console.log(`Auto-seeding Morocco Edit data (found ${moroccoSaves.length} of ${canonicalItems.length} items)...`);
      const now = Date.now();
      
      // Get existing item IDs to avoid duplicates
      const existingItemIds = new Set(allSaves.map(s => s.itemId));
      
      let seededCount = 0;
      for (const item of canonicalItems) {
        // Skip if item already exists
        if (existingItemIds.has(item.itemId)) continue;
        
        await storage.addSave({
          itemType: item.itemType,
          itemId: item.itemId,
          sourceContext: 'morocco_itinerary',
          aestheticTags: ['morocco', item.time.toLowerCase()],
          savedAt: now,
          metadata: {
            seeded: true,
            day: item.day,
            time: item.time,
            flowTitle: item.flowTitle,
            isPlaceholder: item.isPlaceholder || false,
            description: item.description,
            shopLink: item.shopLink,
          },
          editionTag: 'morocco-2026',
          storyTag: 'morocco',
          editTag: 'morocco-edit',
          purchaseStatus: null,
          title: item.title,
          assetUrl: item.assetUrl,
        });
        seededCount++;
      }
      
      console.log(`Auto-seeded ${seededCount} new Morocco Edit items`);
      return await storage.getSaves();
    } catch (error) {
      console.error("Error auto-seeding:", error);
      return [];
    }
  }

  // Saves/Pin API
  app.get("/api/saves", async (req, res) => {
    try {
      const allSaves = await autoSeedMoroccoIfEmpty();
      res.json(allSaves);
    } catch (error) {
      console.error("Error fetching saves:", error);
      res.status(500).json({ error: "Failed to fetch saves" });
    }
  });

  app.get("/api/saves/check/:itemId", async (req, res) => {
    try {
      const { itemId } = req.params;
      const saved = await storage.getSaveByItemId(itemId);
      res.json({ isPinned: !!saved });
    } catch (error) {
      console.error("Error checking save:", error);
      res.status(500).json({ error: "Failed to check save status" });
    }
  });

  app.post("/api/saves", async (req, res) => {
    try {
      const validationResult = saveSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid save data", 
          details: validationResult.error.errors 
        });
      }

      const data = validationResult.data;
      
      const existing = await storage.getSaveByItemId(data.itemId);
      if (existing) {
        return res.status(400).json({ error: "Already pinned" });
      }

      const newSave = await storage.addSave({
        itemType: data.itemType,
        itemId: data.itemId,
        sourceContext: data.sourceContext || null,
        aestheticTags: data.aestheticTags || null,
        savedAt: data.savedAt || Date.now(),
        metadata: data.metadata || null,
        editionTag: data.editionTag || data.metadata?.editionTag || null,
        storyTag: data.storyTag || data.metadata?.storyTag || null,
        editTag: data.editTag || data.metadata?.editTag || null,
        purchaseStatus: data.purchaseStatus || null,
        title: data.title || data.metadata?.title || null,
        assetUrl: data.assetUrl || data.metadata?.assetUrl || data.metadata?.imageUrl || null,
      });
      res.json(newSave);
    } catch (error) {
      console.error("Error creating save:", error);
      res.status(500).json({ error: "Failed to create save" });
    }
  });

  app.patch("/api/saves/:itemId", async (req, res) => {
    try {
      const { itemId } = req.params;
      const { metadata, purchaseStatus } = req.body;
      
      const updated = await storage.updateSaveByItemId(itemId, { metadata, purchaseStatus });
      if (!updated) {
        return res.status(404).json({ error: "Save not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating save:", error);
      res.status(500).json({ error: "Failed to update save" });
    }
  });

  app.delete("/api/saves/:itemId", async (req, res) => {
    try {
      const { itemId } = req.params;
      await storage.deleteSaveByItemId(itemId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting save:", error);
      res.status(500).json({ error: "Failed to delete save" });
    }
  });

  // Debug: Get all saves with count (temporary - for testing)
  app.get("/api/saves/debug", async (req, res) => {
    try {
      const allSaves = await storage.getSaves();
      res.json({
        count: allSaves.length,
        saves: allSaves
      });
    } catch (error) {
      console.error("Error fetching debug saves:", error);
      res.status(500).json({ error: "Failed to fetch saves" });
    }
  });

  // Debug: Clear all saves (temporary - for testing)
  app.delete("/api/saves/all", async (req, res) => {
    try {
      await storage.clearAllSaves();
      res.json({ success: true, message: "All saves cleared" });
    } catch (error) {
      console.error("Error clearing saves:", error);
      res.status(500).json({ error: "Failed to clear saves" });
    }
  });

  // Seed endpoint for Morocco Edit - uses server-generated canonical data
  app.post("/api/saves/seed/morocco-edit", async (req, res) => {
    try {
      const THRESHOLD = MOROCCO_SEED_ITEM_COUNT - 10;

      // Check existing morocco-edit saves count
      const allSaves = await storage.getSaves();
      const moroccoSaves = allSaves.filter(s => 
        s.editTag === 'morocco-edit' || 
        s.storyTag === 'morocco' || 
        s.sourceContext?.includes('morocco')
      );

      if (moroccoSaves.length >= THRESHOLD) {
        return res.json({ 
          seeded: false, 
          reason: 'threshold_met',
          existingCount: moroccoSaves.length,
          threshold: THRESHOLD,
          expectedCount: MOROCCO_SEED_ITEM_COUNT
        });
      }

      // Generate canonical seed items from server-side data
      const canonicalItems = generateMoroccoSeedItems();
      
      // Get existing item IDs to avoid duplicates
      const existingIds = new Set(allSaves.map(s => s.itemId));
      
      let insertedCount = 0;
      const now = Date.now();

      for (const item of canonicalItems) {
        if (existingIds.has(item.itemId)) {
          continue;
        }

        await storage.addSave({
          itemType: item.itemType,
          itemId: item.itemId,
          sourceContext: 'morocco_itinerary',
          aestheticTags: ['morocco', item.time.toLowerCase()],
          savedAt: now,
          metadata: {
            seeded: true,
            day: item.day,
            time: item.time,
            flowTitle: item.flowTitle,
            isPlaceholder: item.isPlaceholder || false,
            description: item.description,
            shopLink: item.shopLink,
          },
          editionTag: 'morocco-2026',
          storyTag: 'morocco',
          editTag: 'morocco-edit',
          purchaseStatus: null,
          title: item.title,
          assetUrl: item.assetUrl,
        });
        
        existingIds.add(item.itemId);
        insertedCount++;
      }

      res.json({ 
        seeded: true, 
        insertedCount,
        totalCanonicalItems: canonicalItems.length,
        previousCount: moroccoSaves.length,
        newCount: moroccoSaves.length + insertedCount
      });
    } catch (error) {
      console.error("Error seeding morocco-edit:", error);
      res.status(500).json({ error: "Failed to seed morocco-edit" });
    }
  });

  // Migration endpoint: Move base64 images from database to object storage
  // This solves the production image issue by storing images in shared object storage
  app.post("/api/migrate/images-to-storage", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const customImages = await storage.getCustomImages();
      
      if (customImages.length === 0) {
        return res.json({ 
          message: "No custom images to migrate", 
          migrated: 0 
        });
      }
      
      const results: { key: string; success: boolean; objectPath?: string; error?: string }[] = [];
      
      for (const img of customImages) {
        try {
          // Check if it's a base64 image
          if (!img.customUrl.startsWith('data:image')) {
            results.push({ 
              key: img.imageKey, 
              success: true, 
              objectPath: img.customUrl,
              error: 'Already a URL, skipping'
            });
            continue;
          }
          
          // Extract the base64 data and content type
          const matches = img.customUrl.match(/^data:image\/(\w+);base64,(.+)$/);
          if (!matches) {
            results.push({ 
              key: img.imageKey, 
              success: false, 
              error: 'Invalid base64 format' 
            });
            continue;
          }
          
          const [, format, base64Data] = matches;
          const contentType = `image/${format}`;
          const buffer = Buffer.from(base64Data, 'base64');
          
          // Get presigned URL for upload
          const uploadURL = await objectStorageService.getObjectEntityUploadURL();
          
          // Upload directly to object storage
          const uploadResponse = await fetch(uploadURL, {
            method: 'PUT',
            body: buffer,
            headers: {
              'Content-Type': contentType,
              'Content-Length': buffer.length.toString(),
            },
          });
          
          if (!uploadResponse.ok) {
            results.push({ 
              key: img.imageKey, 
              success: false, 
              error: `Upload failed: ${uploadResponse.status}` 
            });
            continue;
          }
          
          // Get the normalized object path
          const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);
          
          // Update the database with the new object storage path
          await storage.saveCustomImage(img.imageKey, {
            customUrl: objectPath,
            originalUrl: img.originalUrl || undefined,
            label: img.label || undefined,
          });
          
          results.push({ 
            key: img.imageKey, 
            success: true, 
            objectPath 
          });
          
        } catch (imgError) {
          results.push({ 
            key: img.imageKey, 
            success: false, 
            error: imgError instanceof Error ? imgError.message : 'Unknown error' 
          });
        }
      }
      
      const successCount = results.filter(r => r.success && r.objectPath?.startsWith('/objects/')).length;
      const skipCount = results.filter(r => r.success && !r.objectPath?.startsWith('/objects/')).length;
      const failCount = results.filter(r => !r.success).length;
      
      res.json({
        message: `Migration complete: ${successCount} migrated, ${skipCount} skipped, ${failCount} failed`,
        migrated: successCount,
        skipped: skipCount,
        failed: failCount,
        results
      });
      
    } catch (error) {
      console.error("Error migrating images:", error);
      res.status(500).json({ error: "Failed to migrate images" });
    }
  });

  // Status endpoint: Check migration status
  app.get("/api/migrate/status", async (req, res) => {
    try {
      const customImages = await storage.getCustomImages();
      
      const base64Count = customImages.filter(img => img.customUrl.startsWith('data:image')).length;
      const objectStorageCount = customImages.filter(img => img.customUrl.startsWith('/objects/')).length;
      const externalUrlCount = customImages.filter(img => 
        !img.customUrl.startsWith('data:image') && !img.customUrl.startsWith('/objects/')
      ).length;
      
      res.json({
        total: customImages.length,
        base64: base64Count,
        objectStorage: objectStorageCount,
        externalUrls: externalUrlCount,
        needsMigration: base64Count > 0
      });
      
    } catch (error) {
      console.error("Error checking migration status:", error);
      res.status(500).json({ error: "Failed to check migration status" });
    }
  });

  return httpServer;
}
