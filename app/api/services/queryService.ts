import { createUserQueryEmbedding } from "./embeddingsService";
import { loadDestinationEmbeddings, loadInventory } from "./inventoryService";
import { findTopDestinations } from "./similarityService";

interface processQueryResponse {
  status: number;
  message?: string;
  error?: string;
}

export const processQuery = async (
  query: string
): Promise<processQueryResponse> => {
  const validationResponse = await validateQuery(query);

  if (validationResponse.status !== 200) {
    return {
      status: validationResponse.status,
      error: validationResponse.error,
    };
  } else if (validationResponse.status === 200) {
    const embeddingResponse = await createUserQueryEmbedding(query);
    if (embeddingResponse.status === 200) {
      const topDestinations = await findTopDestinations(embeddingResponse.data.embedding);
      console.log("Top Destinations:", topDestinations);
      return {
        status: 200,
        message: "Query processed successfully.",
      };
    }
    return {
      status: embeddingResponse.status,
      message: embeddingResponse.message,
    };
  }
  return { status: 500, error: "Unknown error occurred." };
};

const validateQuery = (query: string) => {
  if (query === "" || query === undefined || query === null) {
    return { status: 400, error: "Query cannot be empty." };
  } else if (query.length > 100) {
    return {
      status: 400,
      error: "Query must be less than 100 characters long.",
    };
  } else if (typeof query !== "string") {
    return { status: 400, error: "Query must be a string." };
  }

  return { status: 200, message: `You searched for: ${query}` };
};
