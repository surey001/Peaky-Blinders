import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || ""
});

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
    const languagePrompt = language === "en" ? "" : `Please respond in ${getLanguageName(language)}.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert agricultural assistant helping farmers and gardeners. Provide practical, accurate farming advice based on agricultural best practices. Focus on sustainable farming methods, crop management, pest control, soil health, and plant care. ${languagePrompt}

Format your responses as follows:
- Keep responses concise and well-structured
- Use bullet points for lists and steps
- Provide clear, actionable advice
- Include specific recommendations when relevant
- Maximum 3-4 sentences per paragraph
- Use simple, clear language
- Avoid overly technical jargon unless necessary

Your response should be helpful, direct, and easy to understand like a professional agricultural consultant.`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 400,
    });

    return {
      message: response.choices[0].message.content || "I'm sorry, I couldn't generate a response. Please try again.",
      language
    };
  } catch (error) {
    throw new Error("Failed to get chat response: " + (error as Error).message);
  }
}

export async function analyzeDisease(base64Image: string): Promise<DiseaseAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert plant pathologist. Analyze the plant image for diseases, pests, or health issues. Provide accurate diagnosis with confidence level, treatment recommendations, and prevention tips. Respond in JSON format with fields: disease, confidence (0-100), treatment, prevention."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this plant image for diseases or health issues. Provide diagnosis, confidence level, treatment, and prevention advice."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      disease: result.disease || "Unknown condition",
      confidence: Math.max(0, Math.min(100, result.confidence || 0)),
      treatment: result.treatment || "Consult with a local agricultural expert",
      prevention: result.prevention || "Maintain good plant hygiene and monitoring"
    };
  } catch (error) {
    throw new Error("Failed to analyze disease: " + (error as Error).message);
  }
}

export async function getPlantCareInfo(plantQuery: string): Promise<PlantCareInfo> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a plant care expert. Provide comprehensive care information for the requested plant. Include scientific name, watering needs, sunlight requirements, temperature range, soil preferences, fertilizer recommendations, and common issues. Respond in JSON format with fields: plantName, scientificName, watering, sunlight, temperature, soil, fertilizer, commonIssues (array)."
        },
        {
          role: "user",
          content: `Provide detailed care information for: ${plantQuery}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 600,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
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
