import { NextRequest, NextResponse } from "next/server";
import { verificarCredenciais } from "@/lib/db";
import { criarToken, COOKIE, MAX_AGE } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { login, senha } = await req.json();
    if (!login || !senha) {
      return NextResponse.json({ error: "Login e senha obrigatórios" }, { status: 400 });
    }

    const ok = await verificarCredenciais(login, senha);
    if (!ok) {
      return NextResponse.json({ error: "Login ou senha incorretos" }, { status: 401 });
    }

    const token = criarToken(login);
    const res   = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   MAX_AGE,
      path:     "/",
    });
    return res;
  } catch (err) {
    console.error("[auth]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE);
  return res;
}
