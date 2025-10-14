import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

interface ResponseBody {
  success: boolean;
  message: string;
}

// Cria o pool globalmente pra evitar recriar em cada request
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  connectionLimit: 5, // limite de conexões simultâneas
});

export async function POST(req: Request) {
  try {
    const body: { nome?: string } = await req.json();
    const { nome } = body;

    if (!nome || !nome.trim()) {
      return NextResponse.json({ success: false, message: "Nome inválido" }, { status: 400 });
    }

    const conn = await pool.getConnection();

    // Verifica duplicidade
    const [rows] = await conn.execute(
      "SELECT id FROM convidados WHERE LOWER(name) = LOWER(?) AND deleted_at IS NULL",
      [nome]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      conn.release();
      return NextResponse.json({ success: false, message: "Nome já confirmado" }, { status: 409 });
    }

    // Insere novo convidado
    await conn.execute("INSERT INTO convidados (name, created_at) VALUES (?, NOW())", [nome]);
    conn.release();

    return NextResponse.json({ success: true, message: "Presença confirmada!" });
  } catch (error) {
    console.error("Erro no POST /api/guests:", error);
    return NextResponse.json({ success: false, message: "Erro no servidor" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute(
      "SELECT id, name, created_at FROM convidados WHERE deleted_at IS NULL ORDER BY created_at DESC"
    );
    conn.release();

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Erro no GET /api/guests:", error);
    return NextResponse.json({ success: false, message: "Erro ao buscar convidados" }, { status: 500 });
  }
}
