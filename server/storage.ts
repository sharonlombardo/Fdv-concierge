import { type User, type InsertUser, type JournalEntry, type JournalEntries, type CustomImage, customImages } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getJournalEntries(): Promise<JournalEntries>;
  saveJournalEntry(id: string, data: Partial<JournalEntry>): Promise<JournalEntry>;
  getJournalEntry(id: string): Promise<JournalEntry | undefined>;
  
  getCustomImages(): Promise<CustomImage[]>;
  saveCustomImage(imageKey: string, data: { customUrl: string; originalUrl?: string; label?: string }): Promise<CustomImage>;
  deleteCustomImage(imageKey: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private journalEntries: JournalEntries;

  constructor() {
    this.users = new Map();
    this.journalEntries = {};
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getJournalEntries(): Promise<JournalEntries> {
    return this.journalEntries;
  }

  async saveJournalEntry(id: string, data: Partial<JournalEntry>): Promise<JournalEntry> {
    const currentEntry = this.journalEntries[id] || {};
    const updatedEntry: JournalEntry = {
      ...currentEntry,
      ...data,
      updatedAt: Date.now(),
    };
    this.journalEntries[id] = updatedEntry;
    return updatedEntry;
  }

  async getJournalEntry(id: string): Promise<JournalEntry | undefined> {
    return this.journalEntries[id];
  }

  async getCustomImages(): Promise<CustomImage[]> {
    return await db.select().from(customImages);
  }

  async saveCustomImage(imageKey: string, data: { customUrl: string; originalUrl?: string; label?: string }): Promise<CustomImage> {
    const existing = await db.select().from(customImages).where(eq(customImages.imageKey, imageKey));
    
    if (existing.length > 0) {
      const [updated] = await db
        .update(customImages)
        .set({
          customUrl: data.customUrl,
          originalUrl: data.originalUrl || existing[0].originalUrl,
          label: data.label || existing[0].label,
          updatedAt: Date.now(),
        })
        .where(eq(customImages.imageKey, imageKey))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(customImages)
        .values({
          imageKey,
          customUrl: data.customUrl,
          originalUrl: data.originalUrl,
          label: data.label,
          updatedAt: Date.now(),
        })
        .returning();
      return created;
    }
  }

  async deleteCustomImage(imageKey: string): Promise<void> {
    await db.delete(customImages).where(eq(customImages.imageKey, imageKey));
  }
}

export const storage = new MemStorage();
