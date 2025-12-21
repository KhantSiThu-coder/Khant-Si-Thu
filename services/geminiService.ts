
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiAnalysisResult } from "../types";

// Initialize Gemini client with proper named parameter
// Use process.env.API_KEY directly as required by guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a File object to a Base64 string for the Gemini API.
 */
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Analyzes an image of a shopping item using Gemini.
 */
export const analyzeItemImage = async (imageFile: File, currency: string = 'JPY'): Promise<GeminiAnalysisResult> => {
  if (!process.env.API_KEY) {
    console.warn("API Key is missing. Skipping AI analysis.");
    throw new Error("API Key is missing.");
  }

  try {
    const imagePart = await fileToGenerativePart(imageFile);

    // Using 'gemini-3-flash-preview' as it is recommended for basic multimodal tasks
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          imagePart,
          {
            text: `Analyze this image of a shopping item. 
            Identify the product name.
            Classify it strictly into one of these groups: 'Cooking Ingredients', 'Food & Drinks', 'Household products', 'Cosmetics', 'Medicine', 'Clothing', 'Electronics', 'Others'.
            Estimate price in ${currency} (numeric only). If price is not visible or unknown, return null.
            Provide a short visual description for notes.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            price: { type: Type.NUMBER, nullable: true },
            notes: { type: Type.STRING },
          },
          required: ["name", "category", "price", "notes"],
        }
      }
    });

    // Directly access the .text property from the response
    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as GeminiAnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};
