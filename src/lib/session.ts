/**
 * lib/session.ts
 * JWT para autenticação do admin — roda apenas em Node.js (API routes)
 * NÃO use em middleware (Edge Runtime)
 */

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const COOKIE  = "nessart_session";
export const MAX_AGE = 60 * 60 * 8; // 8 horas

function getSecret(): string {
  return process.env.JWT_SECRET || "nessart-jwt-secret-troque-em-producao";
}

export function criarToken(login: string): string {
  return jwt.sign({ login }, getSecret(), { expiresIn: MAX_AGE });
}

export function verificarToken(token: string): { login: string } | null {
  try {
    return jwt.verify(token, getSecret()) as { login: string };
  } catch {
    return null;
  }
}

/** Verifica autenticação em API Routes (NextRequest) */
export function autenticado(req: NextRequest): boolean {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token) return false;
  return verificarToken(token) !== null;
}

/** Verifica sessão em Server Components */
export async function getSession(): Promise<{ login: string } | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE)?.value;
    if (!token) return null;
    return verificarToken(token);
  } catch {
    return null;
  }
}
