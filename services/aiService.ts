
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Simulates the offline LLaMA 1.2B task:
 * Only cleans grammar/structure, no hallucinations, minimal context.
 */
export const smoothTextWithAI = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Refine the following transcription to be grammatically correct. 
      DO NOT add new information. Keep it natural. 
      Input: "${text}"`,
      config: {
        systemInstruction: "You are an assistive speech cleaner. Your job is to take a raw transcript and output a single, polished, natural sentence. No chat, just the text.",
        temperature: 0.1, // Low temp for consistency
      }
    });

    return response.text?.trim() || text;
  } catch (error) {
    console.error("AI Smoothing failed:", error);
    return text; // Fallback to rule-cleaned text
  }
};
