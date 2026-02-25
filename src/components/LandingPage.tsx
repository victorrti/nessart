"use client";

import { useEffect, useRef, useState } from "react";
import CheckoutModal from "./CheckoutModal";

import type { Plano } from "@/lib/storage";

interface Props {
  nomeCliente: string;
  planos: Plano[];
}

const ETAPAS = [
  { num: "01", titulo: "Imersão Estratégica", desc: "Você me conta sua história, seus objetivos e onde quer chegar. Cada detalhe importa." },
  { num: "02", titulo: "Pesquisa & Planejamento", desc: "Mergulho no universo da sua marca e do seu nicho para construir um posicionamento único." },
  { num: "03", titulo: "Desenvolvimento Criativo", desc: "Crio uma identidade que representa sua alma e o que você quer transmitir ao mundo." },
  { num: "04", titulo: "Alinhamento & Refino", desc: "Até 5 rodadas de ajustes finos para que você se reconheça em cada detalhe." },
  { num: "05", titulo: "Entrega Final", desc: "Arquivos organizados por categoria, prontos para uso em impressão e digital." },
];

const ORIENTACOES = [
  {
    titulo: "Fluxo de Trabalho e Prazos",
    texto: "O prazo inicia-se apenas após a confirmação do pagamento e o envio do briefing completamente preenchido. Atrasos no feedback resultam no adiamento proporcional da entrega.",
  },
  {
    titulo: "Política de Alterações",
    texto: "Inclusos até 5 pedidos de ajustes finos sem custo adicional. Mudança total de conceito após o início da criação implica taxa de nova proposta estratégica.",
  },
  {
    titulo: "Condições de Pagamento",
    texto: "A reserva da vaga é feita com 50% de entrada. Este valor cobre análise estratégica e pesquisa, não sendo reembolsável após o início. Os arquivos finais são liberados após a quitação dos 50% restantes.",
  },
  {
    titulo: "Direitos de Uso",
    texto: "Após o pagamento total, a propriedade intelectual da marca é do cliente. O estúdio reserva-se o direito de usar o projeto no portfólio e redes sociais para divulgação.",
  },
];

export default function LandingPage({ nomeCliente, planos: PLANOS }: Props) {
  const [planoSelecionado, setPlanoSelecionado] = useState<(typeof PLANOS)[0] | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Scroll reveal
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".anim-hidden").forEach((el) => {
      observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  const abrirCheckout = (plano: (typeof PLANOS)[0]) => {
    setPlanoSelecionado(plano);
    setModalAberto(true);
  };

  const primeiroNome = nomeCliente.split(" ")[0];

  return (
    <>
      {/* ══════════════════════════════════════
          HERO — IMPACTO EMOCIONAL
      ══════════════════════════════════════ */}
      <section className="wine-section grain relative min-h-screen flex flex-col justify-center items-start overflow-hidden px-6 md:px-16 lg:px-28">
        {/* Swirl decorations */}
        <div className="swirl-bg" />
        <SwirlSVG />

        <div className="relative z-10 max-w-3xl pt-24 pb-36">
          {/* Monogram */}
          <div className="mb-10 opacity-70">
            <MonogramSVG />
          </div>

          {/* Personalização pelo nome */}
          <p className="font-body text-cream/60 tracking-[0.25em] uppercase text-sm mb-4 animate-fade-in">
            Esta proposta foi criada especialmente para
          </p>
          <h2 className="font-display text-cream text-4xl md:text-5xl font-light italic mb-8 animate-fade-up">
            {nomeCliente} ✦
          </h2>

          <h1 className="font-display text-cream-50 font-light leading-[1.05] text-5xl md:text-7xl lg:text-8xl mb-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
            Sua marca<br />
            <em className="text-cream italic">com alma.</em>
          </h1>

          <p className="font-body text-cream/70 text-lg md:text-xl leading-relaxed max-w-xl mb-12 animate-fade-up" style={{ animationDelay: "200ms" }}>
            Criar uma identidade visual não é apenas ter um logotipo.
            É traduzir sua essência, sua história e a percepção que você
            quer gerar no mundo.
          </p>

          <a
            href="#planos"
            className="inline-flex items-center gap-3 bg-cream text-wine-700 font-body font-semibold px-8 py-4 rounded-sm hover:bg-cream-100 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(212,196,168,0.3)] animate-fade-up"
            style={{ animationDelay: "350ms" }}
          >
            Ver os planos
            <ArrowDown />
          </a>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0404] to-transparent" />
      </section>

      {/* ══════════════════════════════════════
          CONEXÃO — Oi, que bom te ver por aqui
      ══════════════════════════════════════ */}
      <section className="bg-[#f0ebe0] text-[#2a1010] py-24 px-6 md:px-16 lg:px-28">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Avatar with elegant frame */}
            <div className="flex justify-center anim-hidden">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-[3px] border-wine-500/40 shadow-[0_0_60px_rgba(139,26,26,0.2)]">
                  {/* Placeholder — substitua por <Image> com foto real */}
                  <div className="w-full h-full bg-gradient-to-br from-wine-200 to-cream-400 flex items-center justify-center">
                    <MonogramSVG color="#8B1A1A" size={80} />
                  </div>
                </div>
                {/* Stars decoration */}
                <span className="absolute top-4 right-2 text-wine-500 text-xl animate-pulse-soft">✦</span>
                <span className="absolute bottom-8 left-0 text-wine-500/60 text-sm animate-pulse-soft" style={{ animationDelay: "1s" }}>✦</span>
              </div>
            </div>

            <div className="anim-hidden" style={{ transitionDelay: "150ms" }}>
              <h2 className="font-display text-4xl md:text-5xl text-wine-700 font-light mb-8 leading-tight">
                Oi, {primeiroNome}!<br />
                <em>Que bom te ver por aqui.</em>
              </h2>
              <div className="space-y-5 text-[#3a1a1a]/80 font-body text-base md:text-lg leading-relaxed">
                <p>
                  Antes de falarmos sobre valores, quero te contar algo importante:
                  sua marca precisa comunicar quem você é de forma <strong className="text-wine-700">autêntica e estratégica.</strong>
                </p>
                <p>
                  Criar uma identidade visual vai muito além de entregar arquivos.
                  É traduzir a sua essência, alinhar o que você quer transmitir com
                  o que as pessoas vão <em>sentir</em> ao entrar em contato com a sua marca.
                </p>
                <p>
                  E é exatamente isso que eu faço: construo marcas com{" "}
                  <strong className="text-wine-700">empatia, estratégia e criatividade</strong>,
                  para que você se reconheça em cada detalhe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROCESSO — Como funciona
      ══════════════════════════════════════ */}
      <section className="bg-[#0f0505] py-28 px-6 md:px-16 lg:px-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="w-[600px] h-[600px] rounded-full border border-cream absolute -top-40 -right-40" />
          <div className="w-[400px] h-[400px] rounded-full border border-cream absolute -bottom-20 -left-20" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-20 anim-hidden">
            <p className="font-body text-cream/40 tracking-[0.3em] uppercase text-xs mb-4">Transparência do início ao fim</p>
            <h2 className="font-display text-cream-50 text-5xl md:text-6xl font-light">
              Como funciona<br /><em className="text-wine-400">o processo?</em>
            </h2>
          </div>

          <div className="space-y-0">
            {ETAPAS.map((etapa, i) => (
              <div
                key={etapa.num}
                className="anim-hidden flex gap-8 md:gap-12 py-10 border-b border-wine-800/30 group hover:border-cream/20 transition-colors duration-500"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex-shrink-0">
                  <span className="font-display text-6xl md:text-8xl text-wine-800/40 group-hover:text-wine-600/60 transition-colors duration-500 leading-none">
                    {etapa.num}
                  </span>
                </div>
                <div className="pt-2">
                  <h3 className="font-display text-cream-100 text-2xl md:text-3xl font-medium mb-3">
                    {etapa.titulo}
                  </h3>
                  <p className="font-body text-cream/55 text-base md:text-lg leading-relaxed max-w-xl">
                    {etapa.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PLANOS — Seção principal de conversão
      ══════════════════════════════════════ */}
      <section id="planos" className="wine-section grain py-28 px-6 md:px-16 lg:px-28 relative overflow-hidden">
        <SwirlSVG opacity={0.04} />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-6 anim-hidden">
            <p className="font-body text-cream/40 tracking-[0.3em] uppercase text-xs mb-4">Cada plano, uma jornada</p>
            <h2 className="font-display text-cream-50 text-5xl md:text-6xl font-light mb-4">
              Planos <em>com alma</em>
            </h2>
            <p className="font-body text-cream/60 text-lg max-w-xl mx-auto">
              Cada plano foi pensado para uma fase da sua jornada,
              da semente até a flor. Escolha o que mais conversa com o seu momento.
            </p>
          </div>

          {/* Urgência */}
          <div className="flex justify-center mb-16 anim-hidden">
            <div className="border border-cream/20 bg-cream/5 backdrop-blur-sm rounded-sm px-6 py-3 font-body text-cream/70 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-wine-400 animate-pulse inline-block" />
              Valores válidos por <strong className="text-cream">7 dias</strong> a partir do recebimento desta proposta
            </div>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {PLANOS.map((plano, i) => (
              <div
                key={plano.id}
                className={`anim-hidden relative rounded-sm flex flex-col transition-all duration-500 hover:-translate-y-1 ${
                  plano.destaque
                    ? "plan-popular bg-[#f0ebe0] text-[#2a1010]"
                    : "bg-wine-900/60 backdrop-blur-sm border border-cream/10 hover:border-cream/25"
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {plano.destaque && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-wine-700 text-cream font-body text-xs font-semibold tracking-[0.2em] uppercase px-5 py-1.5 rounded-sm">
                    Mais escolhido
                  </div>
                )}

                <div className={`p-8 pb-6 border-b ${plano.destaque ? "border-wine-200/30" : "border-cream/10"}`}>
                  <p className={`font-body text-xs tracking-[0.2em] uppercase mb-3 ${plano.destaque ? "text-wine-600" : "text-cream/40"}`}>
                    {plano.tagline.split(" ").slice(0, 3).join(" ")}
                  </p>
                  <h3 className={`font-display text-4xl font-light mb-1 ${plano.destaque ? "text-wine-800" : "text-cream-100"}`}>
                    {plano.nome}
                  </h3>
                  <p className={`font-body text-sm mb-6 leading-snug ${plano.destaque ? "text-wine-700/70" : "text-cream/50"}`}>
                    {plano.tagline}
                  </p>

                  <div className="mb-2">
                    <span className={`font-display text-5xl md:text-6xl font-semibold ${plano.destaque ? "text-wine-800" : "text-cream"}`}>
                      R$ {plano.preco.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <p className={`font-body text-sm ${plano.destaque ? "text-wine-600/70" : "text-cream/40"}`}>
                    ou 50% entrada (R${plano.entrada.toLocaleString("pt-BR")}) + 50% na entrega
                  </p>
                </div>

                <div className="p-8 flex-1 flex flex-col gap-6">
                  <ul className="space-y-3 flex-1">
                    {plano.itens.map((item) => (
                      <li key={item} className="flex gap-3 items-start">
                        <CheckIcon destaque={plano.destaque} />
                        <span className={`font-body text-sm leading-snug ${plano.destaque ? "text-[#3a1a1a]" : "text-cream/70"}`}>
                          {item}
                        </span>
                      </li>
                    ))}
                    {plano.brinde && (
                      <li className={`flex gap-3 items-start mt-4 pt-4 border-t ${plano.destaque ? "border-wine-200/40" : "border-cream/10"}`}>
                        <span className="text-lg flex-shrink-0">🎁</span>
                        <span className={`font-body text-sm font-medium leading-snug ${plano.destaque ? "text-wine-700" : "text-cream/90"}`}>
                          <strong>BRINDE: </strong>{plano.brinde}
                        </span>
                      </li>
                    )}
                  </ul>

                  <div className={`text-xs font-body space-y-1 ${plano.destaque ? "text-wine-600/60" : "text-cream/35"}`}>
                    <p>⏱ Prazo: {plano.prazo}</p>
                    <p>📦 Entrega via WeTransfer, organizada por categoria</p>
                  </div>

                  <button
                    onClick={() => abrirCheckout(plano)}
                    className={`w-full py-4 font-body font-semibold text-sm tracking-wider uppercase transition-all duration-300 hover:-translate-y-0.5 ${
                      plano.destaque
                        ? "bg-wine-600 text-cream hover:bg-wine-700 hover:shadow-[0_8px_32px_rgba(139,26,26,0.4)]"
                        : "bg-cream/10 text-cream hover:bg-cream/20 border border-cream/20 hover:border-cream/40"
                    }`}
                  >
                    Quero o {plano.nome}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SEGURANÇA — Orientações & Compromissos
      ══════════════════════════════════════ */}
      <section className="bg-[#f0ebe0] py-24 px-6 md:px-16 lg:px-28">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 anim-hidden">
            <p className="font-body text-wine-500/60 tracking-[0.3em] uppercase text-xs mb-4">Transparência total</p>
            <h2 className="font-display text-wine-800 text-5xl md:text-6xl font-light">
              Orientações &<br /><em>Compromissos</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {ORIENTACOES.map((item, i) => (
              <div
                key={item.titulo}
                className="anim-hidden bg-white/60 border border-wine-200/40 p-8 hover:shadow-[0_8px_40px_rgba(139,26,26,0.08)] transition-shadow duration-500"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 bg-wine-600 text-cream text-xs font-body font-bold flex items-center justify-center flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-wine-800 text-xl font-medium">{item.titulo}</h3>
                </div>
                <p className="font-body text-[#3a1a1a]/70 text-sm leading-relaxed">{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA FINAL — Fechamento emocional
      ══════════════════════════════════════ */}
      <section className="wine-section grain relative py-32 px-6 md:px-16 lg:px-28 overflow-hidden text-center">
        <SwirlSVG />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="mb-6 opacity-60 flex justify-center">
            <MonogramSVG />
          </div>

          <p className="font-body text-cream/50 tracking-[0.3em] uppercase text-xs mb-6 anim-hidden">
            O próximo passo é seu
          </p>

          <h2 className="font-display text-cream-50 text-5xl md:text-7xl font-light leading-tight mb-8 anim-hidden">
            {primeiroNome}, pronta{" "}
            <em className="text-cream">para elevar</em>
            <br />o nível da sua marca?
          </h2>

          <p className="font-body text-cream/60 text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-12 anim-hidden">
            Sua identidade visual é o primeiro contato com o mercado.
            Invista em uma marca que represente sua essência e gere
            reconhecimento imediato.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center anim-hidden">
            <a
              href="#planos"
              className="inline-flex items-center justify-center gap-3 bg-cream text-wine-700 font-body font-semibold px-10 py-5 hover:bg-cream-100 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(212,196,168,0.3)] text-base tracking-wide"
            >
              Quero transformar minha marca
            </a>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || "5521999999999"}?text=Oi!%20Recebi%20a%20proposta%20da%20Nessart%20e%20quero%20saber%20mais!`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 border border-cream/30 text-cream font-body font-medium px-10 py-5 hover:border-cream/60 hover:bg-cream/5 transition-all duration-300 text-base"
            >
              <WhatsappIcon />
              Falar pelo WhatsApp
            </a>
          </div>

          <p className="font-body text-cream/30 text-xs mt-10 anim-hidden">
            @nessart.design · Proposta criada com carinho para {nomeCliente}
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════
          MODAL DE CHECKOUT
      ══════════════════════════════════════ */}
      {modalAberto && planoSelecionado && (
        <CheckoutModal
          plano={planoSelecionado}
          nomeCliente={nomeCliente}
          onClose={() => setModalAberto(false)}
        />
      )}
    </>
  );
}

/* ── Sub-components ── */

function CheckIcon({ destaque }: { destaque: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
      <circle cx="8" cy="8" r="7.5" stroke={destaque ? "#8B1A1A" : "#D4C4A8"} strokeOpacity="0.4" />
      <path d="M4.5 8l2.5 2.5 4.5-5" stroke={destaque ? "#8B1A1A" : "#D4C4A8"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 3v12M3 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.523 5.845L.057 23.143a.75.75 0 00.924.924l5.297-1.466A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.734 9.734 0 01-4.962-1.355l-.357-.213-3.695 1.022 1.022-3.695-.213-.357A9.734 9.734 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
    </svg>
  );
}

function MonogramSVG({ color = "#D4C4A8", size = 48 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="22" stroke={color} strokeWidth="1" opacity="0.6" />
      <path d="M16 12 Q24 8 32 12 Q28 24 24 28 Q20 24 16 12Z" stroke={color} strokeWidth="1.2" fill="none" opacity="0.8" />
      <path d="M16 36 Q24 40 32 36 Q28 24 24 20 Q20 24 16 36Z" stroke={color} strokeWidth="1.2" fill="none" opacity="0.8" />
    </svg>
  );
}

function SwirlSVG({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 800 800"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity }}
    >
      <ellipse cx="600" cy="200" rx="350" ry="350" stroke="#D4C4A8" strokeWidth="1" fill="none" />
      <ellipse cx="200" cy="600" rx="280" ry="280" stroke="#D4C4A8" strokeWidth="1" fill="none" />
      <ellipse cx="400" cy="400" rx="200" ry="200" stroke="#D4C4A8" strokeWidth="0.5" fill="none" />
    </svg>
  );
}
