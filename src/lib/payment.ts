/**
 * lib/payment.ts
 * Integração com Asaas — lê .env.local diretamente para evitar
 * problema do Windows com valores começando em $
 */

import fs from "fs";
import path from "path";

export interface CheckoutPayload {
  planoId: string;
  planoNome: string;
  valor: number;
  tipoCobranca: "entrada" | "total";
  cliente: {
    nome: string;
    email: string;
    cpf: string;
    whatsapp: string;
  };
}

export interface CheckoutResult {
  checkoutUrl?: string;
  paymentId?: string;
  status: "pending" | "success" | "error";
  message?: string;
}

function loadEnvManually(): Record<string, string> {
  const envVars: Record<string, string> = {};
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return envVars;
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key   = trimmed.slice(0, eqIndex).trim();
    let   value = trimmed.slice(eqIndex + 1).trim();
    if ((value.startsWith("'") && value.endsWith("'")) ||
        (value.startsWith('"') && value.endsWith('"'))) {
      value = value.slice(1, -1);
    }
    envVars[key] = value;
  }
  return envVars;
}

function getEnv(key: string): string {
  const fromProcess = process.env[key];
  if (fromProcess && fromProcess.trim() !== "") return fromProcess.trim();
  const manual = loadEnvManually();
  return manual[key] ?? "";
}

export async function createCheckout(payload: CheckoutPayload): Promise<CheckoutResult> {
  const API_KEY = getEnv("ASAAS_API_KEY");
  const ENV     = getEnv("ASAAS_ENV") || "sandbox";

  console.log("[asaas] ENV:", ENV);
  console.log("[asaas] API_KEY length:", API_KEY.length);

  if (!API_KEY) {
    throw new Error("ASAAS_API_KEY não encontrada no .env.local");
  }

  const BASE = ENV === "production"
    ? "https://api.asaas.com/v3"
    : "https://sandbox.asaas.com/api/v3";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "access_token": API_KEY,
  };

  // 1. Buscar ou criar cliente
  let customerId: string;
  const cpfLimpo = payload.cliente.cpf.replace(/\D/g, "");

  const searchRes = await fetch(`${BASE}/customers?cpfCnpj=${cpfLimpo}`, {
    method: "GET", headers,
  });

  if (!searchRes.ok) {
    const errText = await searchRes.text();
    throw new Error(`Asaas erro ${searchRes.status}: ${errText}`);
  }

  const searchData = await searchRes.json();

  if (searchData.data?.length > 0) {
    customerId = searchData.data[0].id;
  } else {
    const createRes = await fetch(`${BASE}/customers`, {
      method: "POST", headers,
      body: JSON.stringify({
        name:                 payload.cliente.nome,
        email:                payload.cliente.email,
        cpfCnpj:              cpfLimpo,
        mobilePhone:          payload.cliente.whatsapp.replace(/\D/g, ""),
        notificationDisabled: false,
      }),
    });
    const created = await createRes.json();
    if (!createRes.ok) throw new Error(created.errors?.[0]?.description ?? `Asaas erro ${createRes.status}`);
    customerId = created.id;
  }

  console.log("[asaas] customerId:", customerId);

  // 2. Criar link de pagamento
  const linkRes = await fetch(`${BASE}/paymentLinks`, {
    method: "POST", headers,
    body: JSON.stringify({
      name:                `Nessart Design — Plano ${payload.planoNome}`,
      value:               payload.valor,
      billingType:         "UNDEFINED",
      chargeType:          "DETACHED",
      dueDateLimitDays:    7,
      description:         `Identidade visual — Plano ${payload.planoNome}. Cliente: ${payload.cliente.nome}`,
      notificationEnabled: true,
    }),
  });

  const linkData = await linkRes.json();
  if (!linkRes.ok) throw new Error(linkData.errors?.[0]?.description ?? `Asaas erro ${linkRes.status}`);

  console.log("[asaas] Link criado:", linkData.url);

  return {
    checkoutUrl: linkData.url,
    paymentId:   linkData.id,
    status:      "pending",
  };
}
