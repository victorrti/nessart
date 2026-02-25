export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { dbGetPlanos, dbSavePlano, dbDeletePlano, Plano } from "@/lib/db";
import { autenticado } from "@/lib/session";

export async function GET() {
  try {
    return NextResponse.json(await dbGetPlanos());
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!autenticado(req)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
    const plano: Plano = await req.json();
    if (!plano.id) plano.id = plano.nome.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    plano.entrada = Math.round((plano.preco / 2) * 100) / 100;
    await dbSavePlano(plano);
    return NextResponse.json({ ok: true, plano });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!autenticado(req)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
    const { id } = await req.json();
    await dbDeletePlano(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
