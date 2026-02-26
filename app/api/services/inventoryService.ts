import fs from "fs/promises";
import path from "path";
import { Destination, DestinationEmbedding } from "../types";

export const loadInventory: () => Promise<Destination[]> = async () => {
  try {
    const filePath = path.join(process.cwd(), "app/data/destinations.json");
    const data = await fs.readFile(filePath, "utf-8");

    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading inventory:", error);
    throw new Error("Could not load inventory");
  }
};

export const saveToInventory = async (
  fileName: string,
  data: DestinationEmbedding[]
) => {
  try {
    const filePath = path.join(process.cwd(), `app/data/${fileName}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error saving inventory:", error);
  }
};

export const loadDestinationEmbeddings: () => Promise<
  DestinationEmbedding[]
> = async () => {
  try {
    const filePath = path.join(
      process.cwd(),
      "app/data/destinationEmbeddings.json"
    );
    const data = await fs.readFile(filePath, "utf-8");

    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading destination embeddings:", error);
    return [{ status: 500, error: "Failed to load destination embeddings." }];
  }
};
