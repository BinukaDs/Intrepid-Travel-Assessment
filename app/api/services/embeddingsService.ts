import { loadInventory } from "./inventoryService";
const apiKey = process.env.GEMINI_API_KEY;

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey });

const createEmbedding = async (input: string) => {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: [{ parts: [{ text: input }] }],
  });
  return response;
};

export const createQueryEmbedding = async (query: string) => {
  try {
    const embedding = await createEmbedding(query);
    return embedding;
  } catch (error) {
    console.log("Error creating embedding:", error);
    return {
      status: 500,
      error: "Failed to create embedding.",
    };
  }
};

export const createDocumentEmbedding = async () => {
    try {
        const data = await loadInventory();
        const documents = data.map((item) => `${item.name} ${item.description}`);
        console.log("documents:", documents);
        return {status: 200, message: "Document embedding created successfully."};
    } catch (error) {
        console.log("Error creating document embedding:", error);
        return {
            status: 500,
            error: "Failed to create document embedding.",
        };
    }
}


