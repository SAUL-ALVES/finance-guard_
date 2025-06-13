// src/backend/services/db.service.ts
export class DBService {
    static async read<T>(filename: string): Promise<T[]> {
      try {
        const response = await fetch('/api/db', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'read',
            filename,
          }),
        });
        return await response.json();
      } catch (error) {
        console.error('Erro ao ler dados:', error);
        return [];
      }
    }
  
    static async write<T>(filename: string, data: T[]): Promise<boolean> {
      try {
        const response = await fetch('/api/db', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'write',
            filename,
            data,
          }),
        });
        return (await response.json()).success;
      } catch (error) {
        console.error('Erro ao salvar dados:', error);
        return false;
      }
    }
  }