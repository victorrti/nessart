import { NextRequest, NextResponse } from "next/server";
import { dbSaveCliente } from "@/lib/db";
import { autenticado } from "@/lib/session";

export async function POST(req: NextRequest) {
  if (!autenticado(req)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
    const { nome } = await req.json();
    if (!nome || typeof nome !== "string") {
      return NextResponse.json({ error: "Nome inválido" }, { status: 400 });
    }

    const slug = nome
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const url     = `${baseUrl}/${slug}`;

    await dbSaveCliente({ slug, nome, url });
    return NextResponse.json({ slug, url, nome });
  } catch (err) {
    console.error("[generate-link]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
