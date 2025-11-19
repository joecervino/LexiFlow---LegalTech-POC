import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DocumentAnalysis } from "../types";

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64," or "data:application/pdf;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    documentType: { type: Type.STRING, description: "The type of legal document (e.g., NDA, Lease, Service Agreement)" },
    summary: { type: Type.STRING, description: "A concise executive summary of the document (max 3 sentences)" },
    extractedText: { type: Type.STRING, description: "The full OCR text extracted from the document image." },
    partiesInvolved: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of names of people or entities involved."
    },
    executionDate: { type: Type.STRING, description: "Date of the agreement or null if not found.", nullable: true },
    risks: {
      type: Type.ARRAY,
      description: "A list of identified risks or notable clauses.",
      items: {
        type: Type.OBJECT,
        properties: {
          clause: { type: Type.STRING, description: "The specific text or section title of the clause." },
          issue: { type: Type.STRING, description: "Why this is a risk or requires attention." },
          severity: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
          recommendation: { type: Type.STRING, description: "Actionable advice for mitigation." }
        },
        required: ["clause", "issue", "severity", "recommendation"]
      }
    },
    checklist: {
      type: Type.ARRAY,
      description: "An actionable checklist for the legal team based on this document.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "A unique short ID (e.g. TASK-01)" },
          action: { type: Type.STRING, description: "Short action title." },
          description: { type: Type.STRING, description: "Detailed instruction." },
          priority: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
          role: { type: Type.STRING, description: "Who should perform this action (e.g., Attorney, Client)." },
          isCompleted: { type: Type.BOOLEAN, description: "Always false initially." }
        },
        required: ["id", "action", "description", "priority", "role", "isCompleted"]
      }
    }
  },
  required: ["documentType", "summary", "extractedText", "partiesInvolved", "risks", "checklist"]
};

export const analyzeLegalDocument = async (file: File): Promise<DocumentAnalysis> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set REACT_APP_GEMINI_API_KEY or process.env.API_KEY");
  }

  const ai = new GoogleGenAI({ apiKey });
  const base64Image = await fileToGenerativePart(file);

  // Using gemini-3-pro-preview for "Thinking Mode" to ensure high accuracy on legal text
  const modelName = "gemini-3-pro-preview";

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Image
            }
          },
          {
            text: `You are an expert Senior Legal Analyst and OCR specialist. 
            1. Perform precise text extraction from this document (OCR if image/PDF).
            2. Analyze the content for legal risks, obligations, and missing standard clauses.
            3. Create a structured checklist of next steps for a lawyer handling this document.
            
            Think deeply about the implications of specific wordings before generating the JSON.`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        thinkingConfig: {
            thinkingBudget: 32768 // Max budget for deep legal reasoning
        }
      }
    });

    const textResponse = response.text;
    if (!textResponse) throw new Error("No response from AI");

    return JSON.parse(textResponse) as DocumentAnalysis;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};