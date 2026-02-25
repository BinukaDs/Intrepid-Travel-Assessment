import fs from 'fs/promises';
import path from 'path';

export const loadInventory = async () => {
  try {
    const filePath = path.join(process.cwd(), 'app/data/destinations.json');
    const data = await fs.readFile(filePath, 'utf-8');

    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading inventory:', error);
    throw new Error('Could not load inventory');
  }
};
