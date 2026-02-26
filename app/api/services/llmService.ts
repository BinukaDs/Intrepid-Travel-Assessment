import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const apiKey = process.env.GEMINI_API_KEY;

const llmResponseSchema = z.array(
  z.object({
    id: z.number(),
    reason: z.string(),
  })
);

const fetchLlm = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: query,
      config: { temperature: 0 },
    });
    return {
      status: 200,
      response: response.candidates[0].content.parts[0].text,
    };
  } catch (error) {
    return { status: 500, error: "Failed to fetch LLM response." };
  }
};

export const getLlmResponse = async (query: string, topDestinations: []) => {
  //   console.log(topDestinations.map((d) => `{id: ${d.id}, query: "${d.text}"}`));

  //   const prompt = `You are a helpful travel assistant. When given a user question and the best matching destinations with their corresponding IDs,
  //       you must find the most suitable destination/destinations only from the provided destinations and

  //       When deciding:
  //       - consider the best destinations mostly based on the user's interest
  //       - prioritize destinations that align with the user's budget.
  //       - choose only 3 maximum destinations as the best matches.

  //       Your response must:
  //       - contain the ID of the destination/destinations that best match the user query.
  //       - A brief explanation(30 words max) of why they match.
  //       - If there are more than 1 destinations, separate them with a line break.
  //       - Format the JSON answer like this:
  //           {id: 1, reason: "Yala is the best destination for <user's interests> because of <brief reason> <price if user mentions their budget>"}
  //           {id: 2, reason: "Galle Fort is the best destination for <user's interests> because of <brief reason> <price if user mentions their budget>"}
  //       - Provide the answer in JSON format.
  //       - Do not summarize or guess destinations that are not in the provided list.
  //       - If the answer is not found, respond with: "No suitable destination found for the query"

  //       User Query: ${query}

  //     Best Matching Destinations:
  //     ${topDestinations
  //       .map((d) => `{id: ${d.id}, description: "${d.text}"}`)
  //       .join("\n")}

  //       .`;

  const prompt = `
    You are a helpful travel assistant. Given a user query and a list of destinations, 
return ONLY a JSON array of objects with "id" and "reason" fields for the best matches.

Schema:
[
  { "id": 1, "reason": "... <price if user mentions the budget>" },
  { "id": 2, "reason": "... <price if user mentions the budget>" }
]

Rules:
- Only use IDs from the provided list.
- Maximum 3 results.
- No extra text or fields.
- reason: 30 words max.
- If no match, return: []

User Query: ${query}

Destinations:
${topDestinations
  .map(
    (d: { id: string; text: string }) =>
      `{id: ${d.id}, description: "${d.text}"}`
  )
  .join("\n")}
`;

  const llmResponse = await fetchLlm(prompt);
  const formattedResponse = formatLlmResponse(llmResponse.response);
  const validationResponse = validateSchema(topDestinations, formattedResponse);

  if (validationResponse.status !== 200) {
    return {
      status: validationResponse.status,
      error: validationResponse.error,
    };
  }
  return formattedResponse;
};

const formatLlmResponse = (response: string) => {
  try {
    const formatted = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const arr = JSON.parse(formatted);
    return arr;
  } catch (e) {
    return null;
  }
};

const validateSchema = (topDestinations: [], llmResponse: string) => {
  const validIds = topDestinations.map((d: { id: number }) => d.id);

  // Validate LLM response
  let parsedResults;
//   console.log("LLM Response:", llmResponse);
  
  try {
    // console.log("Valid IDs:", validationSchema);
    parsedResults = llmResponseSchema.parse(llmResponse);

    // Filter out any results with invalid IDs
    parsedResults = parsedResults.filter((r) => validIds.includes(r.id));
    return { status: 200, data: parsedResults };
  } catch (e) {
    return { status: 500, error: "invalid LLM response schema." };
  }
};
