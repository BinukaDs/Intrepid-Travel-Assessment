import { createDocumentEmbedding } from "../services/embeddingsService";


export async function GET() {
  try {
    const embeddingResponse = await createDocumentEmbedding();
    return new Response(JSON.stringify({ embeddingResponse }), { status: embeddingResponse.status });
  } catch (error) {
    console.error("Error creating document embedding:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create document embedding" }),
      { status: 500 }
    );
  }
}

// const createDestinationEmbeddings = async (document: string) => {
//   try {
//     const 
//   }
// };
