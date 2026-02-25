export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { dbGetClientes, dbSaveCliente, dbDeleteCliente } from "@/lib/db";
import { autenticado } from "@/lib/session";

export async function GET(req: NextRequest) {
  if (!autenticado(req)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
    return NextResponse.json(await dbGetClientes());
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  if (!autenticado(req)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
    const { nome } = await req.json();
    if (!nome) return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 });

    const slug = nome.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    // URL será atualizada com o ID após criação
    const cliente = await dbSaveCliente({ slug, nome, url: `${baseUrl}/placeholder/${slug}` });
    const url = `${baseUrl}/${cliente.id}/${slug}`;

    // Atualiza URL com ID real
    await dbSaveCliente({ slug, nome, url });
    const atualizado = await dbSaveCliente({ slug, nome, url });

    return NextResponse.json(atualizado);
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}

export async function DELETE(req: NextRequest) {
  if (!autenticado(req)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
    const { id } = await req.json();
    await dbDeleteCliente(Number(id));
    return NextResponse.json({ ok: true });
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}
