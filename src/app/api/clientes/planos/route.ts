export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { dbGetClientePlanos, dbSaveClientePlano, dbDeleteClientePlano, ClientePlano } from "@/lib/db";
import { autenticado } from "@/lib/session";

export async function GET(req: NextRequest) {
  if (!autenticado(req)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
    const clienteId = Number(req.nextUrl.searchParams.get("clienteId"));
    if (!clienteId) return NextResponse.json({ error: "clienteId obrigatório" }, { status: 400 });
    return NextResponse.json(await dbGetClientePlanos(clienteId));
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  if (!autenticado(req)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
    const plano: ClientePlano = await req.json();
    plano.entrada = Math.round((plano.preco / 2) * 100) / 100;
    await dbSaveClientePlano(plano);
    return NextResponse.json({ ok: true });
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}

export async function DELETE(req: NextRequest) {
  if (!autenticado(req)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
    const { id } = await req.json();
    await dbDeleteClientePlano(Number(id));
    return NextResponse.json({ ok: true });
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}
