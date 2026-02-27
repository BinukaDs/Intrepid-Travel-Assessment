import { createUserQueryEmbedding } from "./embeddingsService";
import { loadDestinationEmbeddings, loadInventory } from "./inventoryService";
import { getLlmResponse } from "./llmService";
import { findTopDestinations } from "./similarityService";
import { processQueryResponse } from "../types";

// Main function to process user query and return matched destinations with reasons
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
      if (!embeddingResponse.data || !embeddingResponse.data.embedding) {
        return {
          status: 500,
          error: "Embedding data is missing.",
        };
      }
      const topDestinations = await findTopDestinations(
        embeddingResponse.data.embedding
      );

      const llmResponse = await getLlmResponse(query, topDestinations.data ?? []);
      const finalResponse = await generateFinalResponse(llmResponse);

      // console.log("matched: ", JSON.stringify(finalResponse.message));

      if (finalResponse.status === 200) {
        return {
          status: finalResponse.status,
          message: JSON.stringify(finalResponse.message),
        };
      } else {
        return {
          status: finalResponse.status,
          error: finalResponse.error,
        };
      }
    }
    return {
      status: embeddingResponse.status,
      message: embeddingResponse.message,
    };
  }
  return { status: 500, error: "Unknown error occurred." };
};

// generate final response by matching LLM results with inventory data and formatting the output
export const generateFinalResponse = async (
  response: [{ id: number; reason: string }]
) => {
  // console.log("LLM Response:", response);

  const destinations = await loadInventory();
  const matchedResults = Array.isArray(response)
    ? response
        .map((res) => {
          const destination = destinations.find(
            (d: { id: number }) => d.id === res.id
          );
          if (!destination) return null;
          return {
            ...destination,
            reason: res.reason,
          };
        })
        .filter(Boolean)
    : [];

  if (matchedResults.length > 0) {
    return { status: 200, message: matchedResults };
  } else {
    return { status: 400, error: "No matching results found." };
  }
};


// validate user query input
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
