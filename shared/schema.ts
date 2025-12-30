import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
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
