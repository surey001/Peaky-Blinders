import * as fs from "fs";
import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ChatResponse {
  message: string;
  language: string;
}

export interface DiseaseAnalysis {
  disease: string;
  confidence: number;
  treatment: string;
  prevention: string;
}

export interface PlantCareInfo {
  plantName: string;
  scientificName: string;
  watering: string;
  sunlight: string;
  temperature: string;
  soil: string;
  fertilizer: string;
  commonIssues: string[];
}

export async function getChatResponse(message: string, language: string = "en"): Promise<ChatResponse> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured");
    }

    const languagePrompt = language === "en" ? "" : `Please respond in ${getLanguageName(language)}.`;
    
    const prompt = `You are an expert agricultural assistant helping farmers and gardeners. Provide practical, accurate farming advice based on agricultural best practices. Focus on sustainable farming methods, crop management, pest control, soil health, and plant care. ${languagePrompt}

Format your responses as follows:
- Keep responses concise and well-structured
- Use bullet points for lists and steps
- Provide clear, actionable advice
- Include specific recommendations when relevant
- Maximum 3-4 sentences per paragraph
- Use simple, clear language
- Avoid overly technical jargon unless necessary

Your response should be helpful, direct, and easy to understand like a professional agricultural consultant.

User question: ${message}`;

    console.log("Sending request to Gemini with message:", message.substring(0, 50));

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    console.log("Received response from Gemini");

    return {
      message: response.text || "I'm sorry, I couldn't generate a response. Please try again.",
      language
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to get chat response: " + (error as Error).message);
  }
}

export async function analyzeDisease(base64Image: string): Promise<DiseaseAnalysis> {
  try {
    const systemPrompt = `You are an expert plant pathologist. Analyze the plant image for diseases, pests, or health issues. Provide accurate diagnosis with confidence level, treatment recommendations, and prevention tips. Respond with JSON in this format: 
{'disease': 'disease name', 'confidence': number (0-100), 'treatment': 'treatment recommendations', 'prevention': 'prevention tips'}`;

    const contents = [
      {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg",
        },
      },
      `Analyze this plant image for diseases or health issues. Provide diagnosis, confidence level, treatment, and prevention advice.`,
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            disease: { type: "string" },
            confidence: { type: "number" },
            treatment: { type: "string" },
            prevention: { type: "string" },
          },
          required: ["disease", "confidence", "treatment", "prevention"],
        },
      },
      contents: contents,
    });

    const rawJson = response.text;

    if (rawJson) {
      const result = JSON.parse(rawJson);
      return {
        disease: result.disease || "Unknown condition",
        confidence: Math.max(0, Math.min(100, result.confidence || 0)),
        treatment: result.treatment || "Consult with a local agricultural expert",
        prevention: result.prevention || "Maintain good plant hygiene and monitoring"
      };
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    throw new Error("Failed to analyze disease: " + (error as Error).message);
  }
}

export async function getPlantCareInfo(plantQuery: string): Promise<PlantCareInfo> {
  try {
    const systemPrompt = `You are a plant care expert. Provide comprehensive care information for the requested plant. Include scientific name, watering needs, sunlight requirements, temperature range, soil preferences, fertilizer recommendations, and common issues. Respond with JSON in this format:
{'plantName': 'plant name', 'scientificName': 'scientific name', 'watering': 'watering instructions', 'sunlight': 'sunlight requirements', 'temperature': 'temperature range', 'soil': 'soil preferences', 'fertilizer': 'fertilizer recommendations', 'commonIssues': ['issue1', 'issue2', 'issue3']}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            plantName: { type: "string" },
            scientificName: { type: "string" },
            watering: { type: "string" },
            sunlight: { type: "string" },
            temperature: { type: "string" },
            soil: { type: "string" },
            fertilizer: { type: "string" },
            commonIssues: {
              type: "array",
              items: { type: "string" }
            },
          },
          required: ["plantName", "scientificName", "watering", "sunlight", "temperature", "soil", "fertilizer", "commonIssues"],
        },
      },
      contents: `Provide detailed care information for: ${plantQuery}`,
    });

    const rawJson = response.text;

    if (rawJson) {
      const result = JSON.parse(rawJson);
      return {
        plantName: result.plantName || plantQuery,
        scientificName: result.scientificName || "Scientific name not available",
        watering: result.watering || "Water regularly, keeping soil moist but not waterlogged",
        sunlight: result.sunlight || "Provide adequate sunlight as per plant requirements",
        temperature: result.temperature || "Maintain appropriate temperature range",
        soil: result.soil || "Use well-draining, nutrient-rich soil",
        fertilizer: result.fertilizer || "Apply balanced fertilizer as needed",
        commonIssues: result.commonIssues || ["Monitor for pests", "Check for proper drainage", "Ensure adequate light"]
      };
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    throw new Error("Failed to get plant care info: " + (error as Error).message);
  }
}

function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    "en": "English",
    "ta": "Tamil",
    "kn": "Kannada", 
    "hi": "Hindi",
    "ml": "Malayalam"
  };
  return languages[code] || "English";
}