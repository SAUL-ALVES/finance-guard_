// src/app/api/db/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'backend/data');

export async function POST(request: Request) {
  const { action, filename, data } = await request.json();

  try {
    switch (action) {
      case 'read':
        const filePath = path.join(DATA_DIR, `${filename}.json`);

        if (!fs.existsSync(filePath)) {
          return NextResponse.json([]);
        }

        const fileData = fs.readFileSync(filePath, 'utf-8');

        // ✅ CORREÇÃO: Verifica se o arquivo está vazio antes de fazer o parse.
        // Se estiver vazio, retorna um array vazio para evitar o erro.
        if (!fileData) {
          return NextResponse.json([]);
        }

        return NextResponse.json(JSON.parse(fileData));

      case 'write':
        fs.mkdirSync(DATA_DIR, { recursive: true });
        fs.writeFileSync(
          path.join(DATA_DIR, `${filename}.json`),
          JSON.stringify(data, null, 2),
          'utf-8'
        );
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json(
          { error: 'Ação inválida' },
          { status: 400 }
        );
    }
  } catch (error) {
    // Adicionado um log do erro para facilitar a depuração no futuro
    console.error(`Erro na API /api/db:`, error);
    return NextResponse.json(
      { error: 'Erro no servidor' },
      { status: 500 }
    );
  }
}