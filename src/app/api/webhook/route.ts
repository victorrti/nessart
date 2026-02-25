import { NextRequest, NextResponse } from "next/server";

// Webhook Asaas — recebe confirmações de pagamento
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[webhook/asaas] Event:", body.event, body.payment?.id);

    if (body.event === "PAYMENT_RECEIVED" || body.event === "PAYMENT_CONFIRMED") {
      console.log("[webhook/asaas] Pagamento confirmado:", body.payment?.id);
      // TODO: notificar cliente, enviar briefing por e-mail, etc.
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[webhook/asaas] Error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
