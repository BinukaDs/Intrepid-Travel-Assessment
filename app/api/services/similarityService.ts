import { loadDestinationEmbeddings } from "./inventoryService";

const calculateCosineSimilarity = (vecA: number[], vecB: number[]): number => {
  if (vecA.length !== vecB.length) {
    throw new Error("Vectors must be of the same length");
  }

  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
};

export const findTopDestinations = async (queryEmbedding: number[]) => {
  try {
    const destinationEmbeddings = await loadDestinationEmbeddings();
    const similarities = destinationEmbeddings.map((destination) => ({
      id: destination.id,
      text: destination.text,
      similarity: calculateCosineSimilarity(
        queryEmbedding,
        destination.embedding
      ),
    }));

    similarities.sort((a, b) => b.similarity - a.similarity);
    return { status: 200, data: similarities.slice(0, 5) };
  } catch (error) {
    console.error("Error finding top destinations:", error);
    return { status: 500, error: "Failed to find similar destinations." };
  }
};
