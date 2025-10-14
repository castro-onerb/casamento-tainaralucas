import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

interface Guest {
  nome: string;
  data: string;
}

interface ResponseBody {
  success: boolean;
  message: string;
}

export async function POST(req: Request) {
  try {
    const body: { nome?: string } = await req.json();
    const { nome } = body;

    if (!nome || !nome.trim()) {
      const res: ResponseBody = { success: false, message: "Nome inválido" };
      return NextResponse.json(res, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "src/app/data/guests.json");

    let data: Guest[] = [];
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      data = JSON.parse(raw) as Guest[];
    } catch {
      data = [];
    }

    if (data.some((g) => g.nome.toLowerCase() === nome.toLowerCase())) {
      const res: ResponseBody = { success: false, message: "Nome já confirmado" };
      return NextResponse.json(res, { status: 409 });
    }

    const newGuest: Guest = { nome, data: new Date().toISOString() };
    data.push(newGuest);

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

    const res: ResponseBody = { success: true, message: "Presença confirmada!" };
    return NextResponse.json(res);
  } catch (error) {
    console.error(error);
    const res: ResponseBody = { success: false, message: "Erro no servidor" };
    return NextResponse.json(res, { status: 500 });
  }
}
