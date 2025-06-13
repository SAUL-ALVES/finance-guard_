// backend/services/storage.service.ts
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'backend/data');

export class StorageService {
  private static ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  static readData<T>(filename: string): T | null {
    this.ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    
    try {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data) as T;
      }
      return null;
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
      return null;
    }
  }

  static writeData<T>(filename: string, data: T): boolean {
    this.ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (error) {
      console.error(`Error writing ${filename}:`, error);
      return false;
    }
  }
}