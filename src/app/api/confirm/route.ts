import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome } = body;

    if (!nome || !nome.trim()) {
      return NextResponse.json({ success: false, message: "Nome inválido" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "src/app/data/guests.json");

    let data: any[] = [];
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      data = JSON.parse(raw);
    } catch {
      data = [];
    }

    if (data.some((g) => g.nome.toLowerCase() === nome.toLowerCase())) {
      return NextResponse.json({ success: false, message: "Nome já confirmado" }, { status: 409 });
    }

    data.push({ nome, data: new Date().toISOString() });

    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

    return NextResponse.json({ success: true, message: "Presença confirmada!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Erro no servidor" }, { status: 500 });
  }
}
