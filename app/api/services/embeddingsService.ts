import { loadInventory, saveToInventory } from "./inventoryService";
const apiKey = process.env.GEMINI_API_KEY;

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey });

const createEmbedding = async (input: string) => {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: [{ parts: [{ text: input }] }],
  });

  if (
    response.embeddings &&
    response.embeddings.length > 0 &&
    response.embeddings[0].values
  ) {
    return response.embeddings[0].values;
  } else {
    throw new Error("Embeddings not found in response.");
  }
};

export const createUserQueryEmbedding = async (query: string) => {
  try {
    const embedding = await createEmbedding(query);
    return { status: 200,message: "Created user query embedding successfully.", data: { userQuery: query, embedding: embedding } };
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
    const destinations = await loadInventory();
    const formattedDestinations = formatDestinations(destinations);

    const embeddingsWithIds = [];
    for (const destination of formattedDestinations) {
      const embedding = await createEmbedding(destination.text);
      embeddingsWithIds.push({
        id: destination.id,
        text: destination.text,
        embedding,
      });
    }

    await saveToInventory("destinationEmbeddings", embeddingsWithIds);

    return { status: 200, message: "Document embedding created successfully." };
  } catch (error) {
    console.log("Error creating document embedding:", error);
    return {
      status: 500,
      error: "Failed to create document embedding.",
    };
  }
};

const formatDestinations = (destinations: []) => {
  function getPriceCategory(price: number) {
    if (price <= 50) return "budget-friendly";
    else if (price <= 100) return "affordable";
    else if (price <= 200) return "mid-range";
    else if (price <= 500) return "premium";
    else if (price > 500) return "luxury";
  }

  function formatTags(tags: string[]) {
    if (tags.length === 1) return tags[0];
    if (tags.length === 2) return `${tags[0]} and ${tags[1]}`;
    return `${tags.slice(0, -1).join(", ")}, and ${tags[tags.length - 1]}`;
  }

  const formatted = destinations.map((destination) => {
    const { id, title, location, tags, price } = destination;
    const text = `${title} is a travel destination in ${location}. This experience is ideal for travelers interested in ${formatTags(
      tags
    )}. Price: $${price} (${getPriceCategory(price)})`;
    return { id, text };
  });

  return formatted;
};
