"use client";

import { useState } from "react";

export default function LoginPage() {
  const [login, setLogin]     = useState("");
  const [senha, setSenha]     = useState("");
  const [erro, setErro]       = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Credenciais incorretas");
        return;
      }

      // Redireciona com navegação completa para garantir que o cookie seja lido
      window.location.href = "/admin";
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0404] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Decorações de fundo */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
          <ellipse cx="600" cy="200" rx="380" ry="380" stroke="#D4C4A8" strokeWidth="1" fill="none"/>
          <ellipse cx="150" cy="650" rx="280" ry="280" stroke="#D4C4A8" strokeWidth="1" fill="none"/>
          <ellipse cx="400" cy="400" rx="180" ry="180" stroke="#D4C4A8" strokeWidth="0.5" fill="none"/>
        </svg>
        {/* Glow vinho sutil */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(92,10,10,0.15) 0%, transparent 70%)" }} />
      </div>

      <div className="w-full max-w-sm relative z-10">

        {/* Logo / Monograma */}
        <div className="flex flex-col items-center mb-10">
          <svg width="64" height="64" viewBox="0 0 48 48" fill="none" className="mb-4">
            <circle cx="24" cy="24" r="22" stroke="#D4C4A8" strokeWidth="1" opacity="0.5"/>
            <path d="M16 12 Q24 8 32 12 Q28 24 24 28 Q20 24 16 12Z" stroke="#D4C4A8" strokeWidth="1.2" fill="none"/>
            <path d="M16 36 Q24 40 32 36 Q28 24 24 20 Q20 24 16 36Z" stroke="#D4C4A8" strokeWidth="1.2" fill="none"/>
          </svg>
          <h1 className="font-display text-cream text-3xl font-light tracking-wide">Nessart Design</h1>
          <p className="font-body text-cream/35 text-xs tracking-[0.3em] uppercase mt-1">Painel Administrativo</p>
        </div>

        {/* Card de login */}
        <div className="bg-[#150606] border border-wine-800/30 p-8">
          <h2 className="font-display text-cream text-xl font-light mb-6 text-center">Entrar</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-body text-cream/50 text-xs tracking-[0.15em] uppercase block mb-2">
                Login
              </label>
              <input
                type="text"
                value={login}
                onChange={e => setLogin(e.target.value)}
                placeholder="Seu login"
                required
                autoComplete="username"
                className="w-full bg-[#0a0404] border border-wine-800/40 px-4 py-3 text-sm text-cream placeholder:text-cream/20 focus:outline-none focus:border-wine-600/80 transition-colors font-body"
              />
            </div>

            <div>
              <label className="font-body text-cream/50 text-xs tracking-[0.15em] uppercase block mb-2">
                Senha
              </label>
              <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="••••••••••"
                required
                autoComplete="current-password"
                className="w-full bg-[#0a0404] border border-wine-800/40 px-4 py-3 text-sm text-cream placeholder:text-cream/20 focus:outline-none focus:border-wine-600/80 transition-colors font-body"
              />
            </div>

            {erro && (
              <div className="bg-red-900/30 border border-red-800/40 px-4 py-3 font-body text-red-300 text-sm">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-wine-700 text-cream font-body font-semibold py-4 text-sm tracking-[0.2em] uppercase hover:bg-wine-600 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner /> Entrando...
                </span>
              ) : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-center font-body text-cream/20 text-xs mt-6">
          @nessart.design · Área restrita
        </p>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  );
}
