import { 
  users, 
  chatMessages, 
  diseaseDetections, 
  plantCareRecords, 
  activities,
  type User, 
  type InsertUser,
  type ChatMessage,
  type InsertChatMessage,
  type DiseaseDetection,
  type InsertDiseaseDetection,
  type PlantCareRecord,
  type InsertPlantCareRecord,
  type Activity,
  type InsertActivity
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Chat operations
  getChatHistory(userId?: number): Promise<ChatMessage[]>;
  saveChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Disease detection operations
  getDiseaseDetections(userId?: number): Promise<DiseaseDetection[]>;
  saveDiseaseDetection(detection: InsertDiseaseDetection): Promise<DiseaseDetection>;
  
  // Plant care operations
  getPlantCareRecords(userId?: number): Promise<PlantCareRecord[]>;
  savePlantCareRecord(record: InsertPlantCareRecord): Promise<PlantCareRecord>;
  
  // Activity operations
  getRecentActivities(userId?: number, limit?: number): Promise<Activity[]>;
  saveActivity(activity: InsertActivity): Promise<Activity>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private chatMessages: Map<number, ChatMessage>;
  private diseaseDetections: Map<number, DiseaseDetection>;
  private plantCareRecords: Map<number, PlantCareRecord>;
  private activities: Map<number, Activity>;
  private currentUserId: number;
  private currentChatId: number;
  private currentDetectionId: number;
  private currentRecordId: number;
  private currentActivityId: number;

  constructor() {
    this.users = new Map();
    this.chatMessages = new Map();
    this.diseaseDetections = new Map();
    this.plantCareRecords = new Map();
    this.activities = new Map();
    this.currentUserId = 1;
    this.currentChatId = 1;
    this.currentDetectionId = 1;
    this.currentRecordId = 1;
    this.currentActivityId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getChatHistory(userId?: number): Promise<ChatMessage[]> {
    const messages = Array.from(this.chatMessages.values());
    if (userId) {
      return messages.filter(msg => msg.userId === userId);
    }
    return messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async saveChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatId++;
    const chatMessage: ChatMessage = { 
      id,
      userId: message.userId ?? null,
      message: message.message,
      response: message.response,
      language: message.language ?? "en",
      timestamp: new Date() 
    };
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }

  async getDiseaseDetections(userId?: number): Promise<DiseaseDetection[]> {
    const detections = Array.from(this.diseaseDetections.values());
    if (userId) {
      return detections.filter(detection => detection.userId === userId);
    }
    return detections.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async saveDiseaseDetection(detection: InsertDiseaseDetection): Promise<DiseaseDetection> {
    const id = this.currentDetectionId++;
    const diseaseDetection: DiseaseDetection = { 
      id,
      userId: detection.userId ?? null,
      imagePath: detection.imagePath,
      detectedDisease: detection.detectedDisease ?? null,
      confidence: detection.confidence ?? null,
      treatment: detection.treatment ?? null,
      prevention: detection.prevention ?? null,
      timestamp: new Date() 
    };
    this.diseaseDetections.set(id, diseaseDetection);
    return diseaseDetection;
  }

  async getPlantCareRecords(userId?: number): Promise<PlantCareRecord[]> {
    const records = Array.from(this.plantCareRecords.values());
    if (userId) {
      return records.filter(record => record.userId === userId);
    }
    return records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async savePlantCareRecord(record: InsertPlantCareRecord): Promise<PlantCareRecord> {
    const id = this.currentRecordId++;
    const plantCareRecord: PlantCareRecord = { 
      id,
      userId: record.userId ?? null,
      plantName: record.plantName,
      scientificName: record.scientificName ?? null,
      careInstructions: record.careInstructions ?? null,
      timestamp: new Date() 
    };
    this.plantCareRecords.set(id, plantCareRecord);
    return plantCareRecord;
  }

  async getRecentActivities(userId?: number, limit = 10): Promise<Activity[]> {
    const activities = Array.from(this.activities.values());
    let filteredActivities = activities;
    
    if (userId) {
      filteredActivities = activities.filter(activity => activity.userId === userId);
    }
    
    return filteredActivities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  async saveActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.currentActivityId++;
    const newActivity: Activity = { 
      id,
      userId: activity.userId ?? null,
      type: activity.type,
      description: activity.description,
      timestamp: new Date() 
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }
}

export const storage = new MemStorage();
