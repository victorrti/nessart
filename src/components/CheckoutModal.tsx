"use client";

import { useState } from "react";

interface Plano {
  id: string;
  nome: string;
  preco: number;
  entrada: number;
}

interface Props {
  plano: Plano;
  nomeCliente: string;
  onClose: () => void;
}

type Etapa = "dados" | "pagamento" | "sucesso" | "erro";

export default function CheckoutModal({ plano, nomeCliente, onClose }: Props) {
  const [etapa, setEtapa] = useState<Etapa>("dados");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState("");

  const [form, setForm] = useState({
    nome: nomeCliente,
    email: "",
    cpf: "",
    whatsapp: "",
    tipoCobranca: "entrada" as "entrada" | "total",
  });

  const valor = form.tipoCobranca === "entrada" ? plano.entrada : plano.preco;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planoId: plano.id,
          planoNome: plano.nome,
          valor,
          tipoCobranca: form.tipoCobranca,
          cliente: {
            nome: form.nome,
            email: form.email,
            cpf: form.cpf.replace(/\D/g, ""),
            whatsapp: form.whatsapp.replace(/\D/g, ""),
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erro ao processar pagamento");

      if (data.checkoutUrl) {
        setCheckoutUrl(data.checkoutUrl);
        setEtapa("pagamento");
      } else {
        setEtapa("sucesso");
      }
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : "Erro inesperado");
      setEtapa("erro");
    } finally {
      setLoading(false);
    }
  };

  const formatCPF = (v: string) =>
    v.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4").slice(0, 14);

  const formatPhone = (v: string) =>
    v.replace(/\D/g, "").replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3").slice(0, 15);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#f0ebe0] text-[#2a1010] overflow-y-auto max-h-[90vh] shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
        {/* Header */}
        <div className="bg-wine-700 px-8 py-6 flex items-center justify-between">
          <div>
            <p className="font-body text-cream/60 text-xs tracking-[0.2em] uppercase">Plano selecionado</p>
            <h3 className="font-display text-cream text-2xl font-light">{plano.nome}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-cream/50 hover:text-cream transition-colors text-2xl leading-none"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        <div className="p-8">
          {/* ── ETAPA: DADOS ── */}
          {etapa === "dados" && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="font-body text-wine-700/70 text-sm mb-2">
                Preencha seus dados para prosseguir com o pagamento seguro.
              </p>

              {/* Tipo de cobrança */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <label className={`cursor-pointer border-2 p-4 text-center transition-all ${form.tipoCobranca === "entrada" ? "border-wine-600 bg-wine-50" : "border-wine-200/50"}`}>
                  <input type="radio" name="tipoCobranca" value="entrada" checked={form.tipoCobranca === "entrada"} onChange={handleChange} className="sr-only" />
                  <p className="font-body font-semibold text-wine-800 text-lg">R$ {plano.entrada.toLocaleString("pt-BR")}</p>
                  <p className="font-body text-wine-600/70 text-xs mt-1">50% Entrada agora</p>
                </label>
                <label className={`cursor-pointer border-2 p-4 text-center transition-all ${form.tipoCobranca === "total" ? "border-wine-600 bg-wine-50" : "border-wine-200/50"}`}>
                  <input type="radio" name="tipoCobranca" value="total" checked={form.tipoCobranca === "total"} onChange={handleChange} className="sr-only" />
                  <p className="font-body font-semibold text-wine-800 text-lg">R$ {plano.preco.toLocaleString("pt-BR")}</p>
                  <p className="font-body text-wine-600/70 text-xs mt-1">Valor total</p>
                </label>
              </div>

              <Field label="Nome completo" name="nome" value={form.nome} onChange={(v) => setForm(p => ({ ...p, nome: v }))} required />
              <Field label="E-mail" name="email" type="email" value={form.email} onChange={(v) => setForm(p => ({ ...p, email: v }))} required />
              <Field
                label="CPF"
                name="cpf"
                value={form.cpf}
                onChange={(v) => setForm(p => ({ ...p, cpf: formatCPF(v) }))}
                placeholder="000.000.000-00"
                required
              />
              <Field
                label="WhatsApp"
                name="whatsapp"
                value={form.whatsapp}
                onChange={(v) => setForm(p => ({ ...p, whatsapp: formatPhone(v) }))}
                placeholder="(00) 00000-0000"
                required
              />

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-wine-700 text-cream font-body font-semibold py-4 tracking-wider uppercase text-sm hover:bg-wine-800 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Processando..." : `Pagar R$ ${valor.toLocaleString("pt-BR")}`}
                </button>
                <p className="font-body text-[#3a1a1a]/40 text-xs text-center mt-3">
                  🔒 Pagamento 100% seguro via Asaas
                </p>
              </div>
            </form>
          )}

          {/* ── ETAPA: PAGAMENTO (redirect) ── */}
          {etapa === "pagamento" && (
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-wine-100 flex items-center justify-center mx-auto text-3xl">
                💳
              </div>
              <h3 className="font-display text-wine-800 text-3xl font-light">Quase lá!</h3>
              <p className="font-body text-wine-700/70 text-sm leading-relaxed">
                Clique no botão abaixo para concluir o pagamento de forma segura.
                Você será redirecionado para a página de checkout.
              </p>
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full bg-wine-700 text-cream font-body font-semibold py-4 tracking-wider uppercase text-sm hover:bg-wine-800 transition-all duration-300 text-center"
              >
                Ir para o pagamento →
              </a>
              <button
                onClick={onClose}
                className="font-body text-wine-500/60 text-sm hover:text-wine-700 transition-colors"
              >
                Voltar à proposta
              </button>
            </div>
          )}

          {/* ── ETAPA: SUCESSO ── */}
          {etapa === "sucesso" && (
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto text-4xl">
                ✨
              </div>
              <h3 className="font-display text-wine-800 text-3xl font-light">
                Que alegria, {nomeCliente.split(" ")[0]}!
              </h3>
              <p className="font-body text-wine-700/70 text-base leading-relaxed">
                Seu pedido foi processado com sucesso! Em breve você receberá
                o briefing por e-mail para iniciarmos sua jornada de marca.
              </p>
              <p className="font-body text-wine-600/60 text-sm">
                📬 Confirme também seu WhatsApp para receber atualizações do projeto.
              </p>
              <button
                onClick={onClose}
                className="inline-block w-full bg-wine-700 text-cream font-body font-semibold py-4 tracking-wider uppercase text-sm hover:bg-wine-800 transition-all"
              >
                Fechar
              </button>
            </div>
          )}

          {/* ── ETAPA: ERRO ── */}
          {etapa === "erro" && (
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto text-4xl">⚠️</div>
              <h3 className="font-display text-wine-800 text-2xl font-light">Algo deu errado</h3>
              <p className="font-body text-wine-700/70 text-sm">{erro}</p>
              <button
                onClick={() => setEtapa("dados")}
                className="w-full bg-wine-700 text-cream font-body font-semibold py-4 tracking-wider uppercase text-sm hover:bg-wine-800 transition-all"
              >
                Tentar novamente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label, name, value, onChange, type = "text", placeholder, required,
}: {
  label: string; name: string; value: string;
  onChange: (v: string) => void; type?: string;
  placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="font-body text-wine-800/80 text-xs tracking-[0.1em] uppercase block mb-1.5">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-white border border-wine-200/60 px-4 py-3 font-body text-sm text-[#2a1010] placeholder:text-wine-300/50 focus:outline-none focus:border-wine-600 transition-colors"
      />
    </div>
  );
}
