import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, bigint } from "drizzle-orm/pg-core";
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
