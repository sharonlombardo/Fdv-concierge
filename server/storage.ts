import { type User, type InsertUser, type JournalEntry, type JournalEntries } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getJournalEntries(): Promise<JournalEntries>;
  saveJournalEntry(id: string, data: Partial<JournalEntry>): Promise<JournalEntry>;
  getJournalEntry(id: string): Promise<JournalEntry | undefined>;
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
}

export const storage = new MemStorage();
