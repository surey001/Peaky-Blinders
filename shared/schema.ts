import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  message: text("message").notNull(),
  response: text("response").notNull(),
  language: text("language").notNull().default("en"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const diseaseDetections = pgTable("disease_detections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  imagePath: text("image_path").notNull(),
  detectedDisease: text("detected_disease"),
  confidence: integer("confidence"), // 0-100
  treatment: text("treatment"),
  prevention: text("prevention"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const plantCareRecords = pgTable("plant_care_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  plantName: text("plant_name").notNull(),
  scientificName: text("scientific_name"),
  careInstructions: jsonb("care_instructions"), // watering, sunlight, temperature, etc.
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  type: text("type").notNull(), // 'chat', 'disease_detection', 'plant_care'
  description: text("description").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  userId: true,
  message: true,
  response: true,
  language: true,
});

export const insertDiseaseDetectionSchema = createInsertSchema(diseaseDetections).pick({
  userId: true,
  imagePath: true,
  detectedDisease: true,
  confidence: true,
  treatment: true,
  prevention: true,
});

export const insertPlantCareRecordSchema = createInsertSchema(plantCareRecords).pick({
  userId: true,
  plantName: true,
  scientificName: true,
  careInstructions: true,
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  userId: true,
  type: true,
  description: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type DiseaseDetection = typeof diseaseDetections.$inferSelect;
export type InsertDiseaseDetection = z.infer<typeof insertDiseaseDetectionSchema>;
export type PlantCareRecord = typeof plantCareRecords.$inferSelect;
export type InsertPlantCareRecord = z.infer<typeof insertPlantCareRecordSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
