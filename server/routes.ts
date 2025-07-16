import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getChatResponse, analyzeDisease, getPlantCareInfo } from "./services/gemini";
import { insertChatMessageSchema, insertDiseaseDetectionSchema, insertPlantCareRecordSchema, insertActivitySchema } from "@shared/schema";
import multer from "multer";
import fs from "fs";
import path from "path";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Chat endpoints
  app.get("/api/chat/history", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const messages = await storage.getChatHistory(userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  });

  app.post("/api/chat/message", async (req, res) => {
    try {
      const { message, language = "en", userId } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Get AI response
      const chatResponse = await getChatResponse(message, language);
      
      // Save to storage
      const savedMessage = await storage.saveChatMessage({
        userId: userId || null,
        message,
        response: chatResponse.message,
        language: chatResponse.language
      });

      // Save activity
      await storage.saveActivity({
        userId: userId || null,
        type: "chat",
        description: `Asked: ${message.substring(0, 50)}${message.length > 50 ? "..." : ""}`
      });

      res.json(savedMessage);
    } catch (error) {
      res.status(500).json({ error: "Failed to process chat message: " + (error as Error).message });
    }
  });

  // Disease detection endpoints
  app.get("/api/disease/detections", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const detections = await storage.getDiseaseDetections(userId);
      res.json(detections);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch disease detections" });
    }
  });

  app.post("/api/disease/analyze", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Image file is required" });
      }

      const userId = req.body.userId ? parseInt(req.body.userId) : null;

      // Read and convert image to base64
      const imageBuffer = fs.readFileSync(req.file.path);
      const base64Image = imageBuffer.toString('base64');

      // Analyze with AI
      const analysis = await analyzeDisease(base64Image);

      // Save detection result
      const detection = await storage.saveDiseaseDetection({
        userId,
        imagePath: req.file.path,
        detectedDisease: analysis.disease,
        confidence: analysis.confidence,
        treatment: analysis.treatment,
        prevention: analysis.prevention
      });

      // Save activity
      await storage.saveActivity({
        userId,
        type: "disease_detection",
        description: `Detected ${analysis.disease} with ${analysis.confidence}% confidence`
      });

      // Clean up uploaded file
      fs.unlinkSync(req.file.path);

      res.json(detection);
    } catch (error) {
      // Clean up file on error
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
          console.error("Failed to cleanup file:", cleanupError);
        }
      }
      res.status(500).json({ error: "Failed to analyze disease: " + (error as Error).message });
    }
  });

  // Plant care endpoints
  app.get("/api/plant-care/records", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const records = await storage.getPlantCareRecords(userId);
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plant care records" });
    }
  });

  app.post("/api/plant-care/search", async (req, res) => {
    try {
      const { plantQuery, userId } = req.body;
      
      if (!plantQuery) {
        return res.status(400).json({ error: "Plant query is required" });
      }

      // Get plant care info from AI
      const careInfo = await getPlantCareInfo(plantQuery);

      // Save to storage
      const record = await storage.savePlantCareRecord({
        userId: userId || null,
        plantName: careInfo.plantName,
        scientificName: careInfo.scientificName,
        careInstructions: {
          watering: careInfo.watering,
          sunlight: careInfo.sunlight,
          temperature: careInfo.temperature,
          soil: careInfo.soil,
          fertilizer: careInfo.fertilizer,
          commonIssues: careInfo.commonIssues
        }
      });

      // Save activity
      await storage.saveActivity({
        userId: userId || null,
        type: "plant_care",
        description: `Searched for ${careInfo.plantName} care information`
      });

      res.json(record);
    } catch (error) {
      res.status(500).json({ error: "Failed to get plant care info: " + (error as Error).message });
    }
  });

  // Activity endpoints
  app.get("/api/activities", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activities = await storage.getRecentActivities(userId, limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
