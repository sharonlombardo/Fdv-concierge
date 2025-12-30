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
