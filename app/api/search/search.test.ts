import { generateFinalResponse } from "../services/queryService";


describe("generateFinalResponse", () => {
  it("returns the expected response structure", () => {
    const llmResponse = {
      id: "4",
      reason:
        "Surf & Chill Retreat offers beach and surfing vibes in Arugam Bay for $80, fitting your budget and desire for a chilled weekend.",
    };
    const result = generateFinalResponse([llmResponse]);
    expect(result).toEqual([llmResponse]);
  });
}); 


