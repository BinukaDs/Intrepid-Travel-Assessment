import { processQuery } from "../services/queryService";

export async function POST(request: Request) {
  const body = await request.json();
  const { query } = body;

  const validationResponse = await processQuery(query);
//   console.log("response:", validationResponse);

  return new Response(JSON.stringify(validationResponse), {
    status: validationResponse.status,
    headers: { "Content-Type": "application/json" },
  });
}
