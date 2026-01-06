import { 
  type User, type InsertUser, type JournalEntry, type JournalEntries, 
  type CustomImage, customImages,
  type ImageLibraryItem, type InsertImageLibrary, imageLibrary,
  type ImageRule, type InsertImageRule, imageRules,
  type SelfieImage, type InsertSelfieImage, selfieImages,
  type Save, type InsertSave, saves
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

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
  
  // Image Library
  getImageLibrary(): Promise<ImageLibraryItem[]>;
  addImageToLibrary(data: InsertImageLibrary): Promise<ImageLibraryItem>;
  updateImageInLibrary(id: number, data: Partial<InsertImageLibrary>): Promise<ImageLibraryItem | undefined>;
  deleteImageFromLibrary(id: number): Promise<void>;
  
  // Image Rules
  getImageRules(): Promise<ImageRule[]>;
  addImageRule(data: InsertImageRule): Promise<ImageRule>;
  updateImageRule(id: number, data: Partial<InsertImageRule>): Promise<ImageRule | undefined>;
  deleteImageRule(id: number): Promise<void>;
  
  // Selfie Images
  getSelfieImages(): Promise<SelfieImage[]>;
  addSelfieImage(data: InsertSelfieImage): Promise<SelfieImage>;
  updateSelfieImage(id: number, data: Partial<InsertSelfieImage>): Promise<SelfieImage | undefined>;
  deleteSelfieImage(id: number): Promise<void>;
  
  // Saves
  getSaves(): Promise<Save[]>;
  getSaveByItemId(itemId: string): Promise<Save | undefined>;
  addSave(data: InsertSave): Promise<Save>;
  updateSaveByItemId(itemId: string, data: { metadata?: any }): Promise<Save | undefined>;
  deleteSaveByItemId(itemId: string): Promise<void>;
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

  // Image Library methods
  async getImageLibrary(): Promise<ImageLibraryItem[]> {
    return await db.select().from(imageLibrary).orderBy(desc(imageLibrary.priority));
  }

  async addImageToLibrary(data: InsertImageLibrary): Promise<ImageLibraryItem> {
    const [created] = await db
      .insert(imageLibrary)
      .values({
        ...data,
        createdAt: Date.now(),
      })
      .returning();
    return created;
  }

  async updateImageInLibrary(id: number, data: Partial<InsertImageLibrary>): Promise<ImageLibraryItem | undefined> {
    const [updated] = await db
      .update(imageLibrary)
      .set(data)
      .where(eq(imageLibrary.id, id))
      .returning();
    return updated;
  }

  async deleteImageFromLibrary(id: number): Promise<void> {
    await db.delete(imageLibrary).where(eq(imageLibrary.id, id));
  }

  // Image Rules methods
  async getImageRules(): Promise<ImageRule[]> {
    return await db.select().from(imageRules).orderBy(desc(imageRules.priority));
  }

  async addImageRule(data: InsertImageRule): Promise<ImageRule> {
    const [created] = await db
      .insert(imageRules)
      .values({
        ...data,
        createdAt: Date.now(),
      })
      .returning();
    return created;
  }

  async updateImageRule(id: number, data: Partial<InsertImageRule>): Promise<ImageRule | undefined> {
    const [updated] = await db
      .update(imageRules)
      .set(data)
      .where(eq(imageRules.id, id))
      .returning();
    return updated;
  }

  async deleteImageRule(id: number): Promise<void> {
    await db.delete(imageRules).where(eq(imageRules.id, id));
  }

  // Selfie Image methods
  async getSelfieImages(): Promise<SelfieImage[]> {
    return await db.select().from(selfieImages).orderBy(desc(selfieImages.createdAt));
  }

  async addSelfieImage(data: InsertSelfieImage): Promise<SelfieImage> {
    const [created] = await db
      .insert(selfieImages)
      .values({
        ...data,
        createdAt: Date.now(),
      })
      .returning();
    return created;
  }

  async updateSelfieImage(id: number, data: Partial<InsertSelfieImage>): Promise<SelfieImage | undefined> {
    const [updated] = await db
      .update(selfieImages)
      .set(data)
      .where(eq(selfieImages.id, id))
      .returning();
    return updated;
  }

  async deleteSelfieImage(id: number): Promise<void> {
    await db.delete(selfieImages).where(eq(selfieImages.id, id));
  }

  // Saves methods
  async getSaves(): Promise<Save[]> {
    return await db.select().from(saves).orderBy(desc(saves.savedAt));
  }

  async getSaveByItemId(itemId: string): Promise<Save | undefined> {
    const [save] = await db.select().from(saves).where(eq(saves.itemId, itemId));
    return save;
  }

  async addSave(data: InsertSave): Promise<Save> {
    const [created] = await db
      .insert(saves)
      .values(data)
      .returning();
    return created;
  }

  async updateSaveByItemId(itemId: string, data: { metadata?: any }): Promise<Save | undefined> {
    const existing = await this.getSaveByItemId(itemId);
    if (!existing) return undefined;
    
    const updatedMetadata = {
      ...(existing.metadata || {}),
      ...data.metadata
    };
    
    const [updated] = await db
      .update(saves)
      .set({ metadata: updatedMetadata })
      .where(eq(saves.itemId, itemId))
      .returning();
    return updated;
  }

  async deleteSaveByItemId(itemId: string): Promise<void> {
    await db.delete(saves).where(eq(saves.itemId, itemId));
  }
}

export const storage = new MemStorage();
