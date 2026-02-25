import { NextRequest, NextResponse } from "next/server";

const COOKIE = "nessart_session";

/**
 * Verifica JWT usando apenas Web Crypto API (compatível com Edge Runtime)
 * O token é válido se: base64 decodifica ok + não expirou
 * (verificação de assinatura completa fica no session.ts para API routes)
 */
function tokenAparenciaValida(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    // Decodifica o payload (parte do meio)
    const payload = JSON.parse(
      Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8")
    );
    // Verifica expiração
    if (payload.exp && Date.now() / 1000 > payload.exp) return false;
    // Verifica que tem login
    if (!payload.login) return false;
    return true;
  } catch {
    return false;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const protegido =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/planos") ||
    pathname.startsWith("/api/paginas") ||
    pathname.startsWith("/api/clientes") ||
    pathname.startsWith("/api/generate-link");

  if (!protegido) return NextResponse.next();

  const token = req.cookies.get(COOKIE)?.value;
  const valido = token ? tokenAparenciaValida(token) : false;

  if (!valido) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/planos/:path*",
    "/api/paginas/:path*",
    "/api/clientes/:path*",
    "/api/generate-link/:path*",
  ],
};
