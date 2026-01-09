import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, bigint, integer, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const journalEntrySchema = z.object({
  note: z.string().optional(),
  image: z.string().optional(),
  myLook: z.string().optional(),
  logImage: z.string().optional(),
  updatedAt: z.number().optional(),
});

export type JournalEntry = z.infer<typeof journalEntrySchema>;

export const journalEntriesSchema = z.record(z.string(), journalEntrySchema);

export type JournalEntries = z.infer<typeof journalEntriesSchema>;

export const saveJournalEntrySchema = z.object({
  id: z.string(),
  data: journalEntrySchema,
});

export type SaveJournalEntryInput = z.infer<typeof saveJournalEntrySchema>;

// Custom images table for replacing default itinerary images
export const customImages = pgTable("custom_images", {
  imageKey: varchar("image_key").primaryKey(), // e.g., "d1-cover", "d2-3", "cover-main"
  customUrl: text("custom_url").notNull(), // base64 or URL
  originalUrl: text("original_url"),
  label: text("label"), // Display name for the image
  updatedAt: bigint("updated_at", { mode: "number" }),
});

export const insertCustomImageSchema = createInsertSchema(customImages).omit({
  updatedAt: true,
});

export type InsertCustomImage = z.infer<typeof insertCustomImageSchema>;
export type CustomImage = typeof customImages.$inferSelect;

// For API validation
export const customImageSchema = z.object({
  imageKey: z.string(),
  customUrl: z.string(),
  originalUrl: z.string().optional(),
  label: z.string().optional(),
  updatedAt: z.number().optional(),
});

export const customImagesSchema = z.record(z.string(), customImageSchema);

export type CustomImages = z.infer<typeof customImagesSchema>;

// Image Library - stores all uploaded images with tags for automatic matching
export const imageLibrary = pgTable("image_library", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(), // base64 or URL
  name: text("name").notNull(), // Display name
  tags: text("tags").array().notNull().default([]), // e.g., ["marrakech", "morning", "dining"]
  category: text("category").notNull().default("general"), // general, location, activity, time
  priority: integer("priority").notNull().default(0), // Higher priority = preferred match
  createdAt: bigint("created_at", { mode: "number" }),
});

export const insertImageLibrarySchema = createInsertSchema(imageLibrary).omit({
  id: true,
  createdAt: true,
});

export type InsertImageLibrary = z.infer<typeof insertImageLibrarySchema>;
export type ImageLibraryItem = typeof imageLibrary.$inferSelect;

// Image Assignment Rules - defines automatic image matching criteria
export const imageRules = pgTable("image_rules", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // Rule display name
  imageType: text("image_type").notNull().default("item"), // "item", "wardrobe", "cover"
  matchLocation: text("match_location").array().default([]), // Match if item location contains any
  matchTime: text("match_time").array().default([]), // Match if time contains any (morning, afternoon, evening)
  matchKeywords: text("match_keywords").array().default([]), // Match if title/description contains any
  assignTags: text("assign_tags").array().notNull(), // Use images with these tags
  priority: integer("priority").notNull().default(0), // Rule priority - higher wins
  enabled: integer("enabled").notNull().default(1), // 1 = enabled, 0 = disabled
  createdAt: bigint("created_at", { mode: "number" }),
});

export const insertImageRuleSchema = createInsertSchema(imageRules).omit({
  id: true,
  createdAt: true,
});

export type InsertImageRule = z.infer<typeof insertImageRuleSchema>;
export type ImageRule = typeof imageRules.$inferSelect;

// Selfie images table for user uploaded photos with background removal
export const selfieImages = pgTable("selfie_images", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  originalUrl: text("original_url").notNull(), // Original image before processing
  processedUrl: text("processed_url").notNull(), // Image with background removed
  createdAt: bigint("created_at", { mode: "number" }),
});

export const insertSelfieImageSchema = createInsertSchema(selfieImages).omit({
  id: true,
  createdAt: true,
});

export type InsertSelfieImage = z.infer<typeof insertSelfieImageSchema>;
export type SelfieImage = typeof selfieImages.$inferSelect;

export const selfieImageSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  originalUrl: z.string(),
  processedUrl: z.string(),
  createdAt: z.number().optional(),
});

// Zod schemas for API validation
export const imageLibraryItemSchema = z.object({
  id: z.number().optional(),
  imageUrl: z.string(),
  name: z.string(),
  tags: z.array(z.string()),
  category: z.string().optional(),
  priority: z.number().optional(),
});

export const imageRuleSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  imageType: z.string().optional(),
  matchLocation: z.array(z.string()).optional(),
  matchTime: z.array(z.string()).optional(),
  matchKeywords: z.array(z.string()).optional(),
  assignTags: z.array(z.string()),
  priority: z.number().optional(),
  enabled: z.number().optional(),
});

// ============================================
// Save/Pin Feature Tables
// ============================================

// Saves table - stores user-pinned/saved items
export const saves = pgTable("saves", {
  id: serial("id").primaryKey(),
  itemType: text("item_type").notNull(), // 'image', 'product', 'article', 'quote', 'place', 'look', 'experience', 'ritual'
  itemId: text("item_id").notNull(), // reference to the actual content (assetKey)
  sourceContext: text("source_context"), // where it was saved from: 'the_current_issue_1', 'morocco_itinerary', etc.
  aestheticTags: text("aesthetic_tags").array(), // ['minimal', 'linen', 'desert', 'architectural']
  savedAt: bigint("saved_at", { mode: "number" }).notNull(),
  metadata: jsonb("metadata"), // flexible storage for item details (title, image url, etc.)
  editionTag: text("edition_tag"), // e.g., 'current-edition-1'
  storyTag: text("story_tag"), // e.g., 'morocco', 'hydra', 'slow-travel'
  editTag: text("edit_tag"), // e.g., 'morocco-edit', 'hydra-edit'
  purchaseStatus: text("purchase_status"), // 'in_cart', 'purchased', null
  title: text("title"), // display title
  assetUrl: text("asset_url"), // image/asset URL
});

export const insertSaveSchema = createInsertSchema(saves).omit({
  id: true,
});

export type InsertSave = z.infer<typeof insertSaveSchema>;
export type Save = typeof saves.$inferSelect;

export const saveSchema = z.object({
  id: z.number().optional(),
  itemType: z.string(),
  itemId: z.string(),
  sourceContext: z.string().optional(),
  aestheticTags: z.array(z.string()).optional(),
  savedAt: z.number(),
  metadata: z.any().optional(),
  editionTag: z.string().optional(),
  storyTag: z.string().optional(),
  editTag: z.string().optional(),
  purchaseStatus: z.string().optional(),
  title: z.string().optional(),
  assetUrl: z.string().optional(),
});

// SaveType mapping to category tabs
export const SAVE_TYPE_TO_CATEGORY: Record<string, string> = {
  'look': 'style',
  'image': 'inspiration',
  'quote': 'state-of-mind',
  'experience': 'places',
  'place': 'places',
  'product': 'items',
  'article': 'culture',
  'ritual': 'daily-rituals',
  'object': 'items',
};

// Capsules table - AI-generated or user-created collections based on saves
export const capsules = pgTable("capsules", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // "Desert Neutrals"
  description: text("description"), // "Based on your Morocco saves..."
  generatedFrom: text("generated_from").array(), // array of save IDs that informed this capsule
  aesthetic: text("aesthetic"), // "Refined Minimalism"
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
  metadata: jsonb("metadata"), // flexible storage for capsule data
});

export const insertCapsuleSchema = createInsertSchema(capsules).omit({
  id: true,
});

export type InsertCapsule = z.infer<typeof insertCapsuleSchema>;
export type Capsule = typeof capsules.$inferSelect;

export const capsuleSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  description: z.string().optional(),
  generatedFrom: z.array(z.string()).optional(),
  aesthetic: z.string().optional(),
  createdAt: z.number(),
  metadata: z.any().optional(),
});

// Current Feed Content table - editorial content for the feed
export const currentFeedContent = pgTable("current_feed_content", {
  id: serial("id").primaryKey(),
  contentType: text("content_type").notNull(), // 'article', 'guide', 'image', 'carousel'
  title: text("title"),
  subtitle: text("subtitle"),
  imageUrl: text("image_url"),
  content: jsonb("content"), // flexible content structure
  tags: text("tags").array(), // for personalization later
  publishedAt: bigint("published_at", { mode: "number" }).notNull(),
});

export const insertCurrentFeedContentSchema = createInsertSchema(currentFeedContent).omit({
  id: true,
});

export type InsertCurrentFeedContent = z.infer<typeof insertCurrentFeedContentSchema>;
export type CurrentFeedContent = typeof currentFeedContent.$inferSelect;

export const currentFeedContentSchema = z.object({
  id: z.number().optional(),
  contentType: z.string(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  imageUrl: z.string().optional(),
  content: z.any().optional(),
  tags: z.array(z.string()).optional(),
  publishedAt: z.number(),
});
