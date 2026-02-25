import { NextRequest, NextResponse } from "next/server";
import { dbGetClientes, dbSaveCliente, dbDeleteCliente } from "@/lib/db";
import { autenticado } from "@/lib/session";

export async function GET(req: NextRequest) {
  if (!autenticado(req)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
    return NextResponse.json(await dbGetClientes());
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!autenticado(req)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
    const p = await req.json();
    await dbSaveCliente(p);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!autenticado(req)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
    const { slug } = await req.json();
    await dbDeleteCliente(slug);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
