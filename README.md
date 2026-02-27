# Intrepid-Travel-Assessment

Technical Assignment for the Software-Engineer Intern Position at Intrepid-Travel

## Q&A: Technical Reflection

### 1. The "Under the Hood" Moment

One technical hurdle was connecting the AI API to the frontend and handling the strict response schema. The LLM sometimes returned results with IDs as strings or extra fields, which broke my backend validation. I debugged this by logging the raw LLM output, coercing IDs to numbers, and enforcing schema validation with Zod. This ensured only valid inventory items were displayed and prevented frontend errors.

### 2. The Scalability Thought

If the dataset grew to 50,000 travel packages, I would precompute and store all destination embeddings in a vector database (like Pinecone or Qdrant) and use efficient vector search to retrieve the top matches. Only the most relevant candidates like 10, would be sent to the LLM for reasoning. This would keep costs low and prevent the AI from being overwhelmed by irrelevant data.

### 3. The AI Reflection

I used GitHub Copilot as my primary AI assistant. One buggy suggestion was Copilot instructing to parse the LLM response as a string without handling code block markers (```json). This caused JSON parsing errors. I fixed it by stripping code block markers before parsing and adding robust error handling.