import { NextRequest, NextResponse } from "next/server";
import { createCheckout, CheckoutPayload } from "@/lib/payment";

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutPayload = await req.json();

    if (!body.cliente?.nome || !body.cliente?.email || !body.cliente?.cpf) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }
    if (!body.valor || body.valor <= 0) {
      return NextResponse.json({ error: "Valor inválido" }, { status: 400 });
    }

    const result = await createCheckout(body);
    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    console.error("[checkout] Error:", err);
    const message = err instanceof Error ? err.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
