"use client";

import { useState, useEffect } from "react";
import type { Plano } from "@/lib/db";
import CheckoutModal from "./CheckoutModal";

interface Props { planos: Plano[]; }

export default function AdsLanding({ planos }: Props) {
  const [planoSelecionado, setPlanoSelecionado] = useState<Plano | null>(null);
  const [checkoutAberto, setCheckoutAberto]     = useState(false);
  const [menuAberto, setMenuAberto]             = useState(false);
  const [scrolled, setScrolled]                 = useState(false);
  const [visivel, setVisivel]                   = useState<Set<string>>(new Set());

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting && e.target.id)
          setVisivel(p => new Set([...p, e.target.id]));
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll("[data-reveal]").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const r = (id: string, delay = 0) =>
    `reveal-base ${visivel.has(id) ? "reveal-in" : ""} ${delay ? `delay-${delay}` : ""}`;

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuAberto(false);
  };

  const whats = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || "5521999999999"}?text=${encodeURIComponent("Oi Vanessa! Vi seu site e quero saber mais sobre identidade visual 🌹")}`;

  return (
    <div id="top" className="root">
      <style>{CSS}</style>

      {/* ══════════ NAV ══════════ */}
      <header className={`nav ${scrolled ? "nav--solid" : ""}`}>
        <div className="nav__inner">
          <button onClick={() => go("hero")} className="nav__brand">
            <Glyph s={36} />
            <span>Nessart</span>
          </button>

          <nav className="nav__menu">
            {NAV_LINKS.map(([id, l]) => (
              <button key={id} onClick={() => go(id)} className="nav__item">{l}</button>
            ))}
            <button onClick={() => go("planos")} className="nav__pill">Investimento</button>
          </nav>

          <button className={`nav__burger ${menuAberto ? "is-open" : ""}`} onClick={() => setMenuAberto(!menuAberto)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>

        {menuAberto && (
          <div className="nav__drawer">
            {NAV_LINKS.map(([id, l]) => (
              <button key={id} onClick={() => go(id)} className="drawer__item">{l}</button>
            ))}
            <button onClick={() => go("planos")} className="drawer__cta">Ver investimento →</button>
          </div>
        )}
      </header>

      {/* ══════════ HERO ══════════ */}
      <section id="hero" className="hero">
        {/* fundo */}
        <div className="hero__bg">
          <div className="blob blob--a" />
          <div className="blob blob--b" />
          <div className="blob blob--c" />
          <div className="noise" />
          <GridLines />
        </div>

        {/* conteúdo */}
        <div className="hero__body">
          <p className="hero__eyebrow">
            <span className="rule" />
            Identidade Visual · Nessart Design
            <span className="rule" />
          </p>

          <h1 className="hero__h1">
            <span className="h1__a">Sua marca</span>
            <span className="h1__b">merece ser<em> lembrada.</em></span>
            <span className="h1__c">Para sempre.</span>
          </h1>

          <p className="hero__sub">
            Identidades visuais com alma — que contam a história do seu negócio
            e conquistam clientes antes mesmo de você falar uma palavra.
          </p>

          <div className="hero__ctas">
            <button onClick={() => go("planos")} className="btn btn--solid">
              Quero minha marca <Arrow />
            </button>
            <button onClick={() => go("sobre")} className="btn btn--ghost">
              Conhecer a Vanessa
            </button>
          </div>

          <div className="hero__nums">
            <Num v="200+" l="marcas criadas" />
            <div className="sep" />
            <Num v="5 anos" l="de experiência" />
            <div className="sep" />
            <Num v="98%" l="de aprovação" />
          </div>
        </div>

        {/* ornamento flutuante */}
        <div className="hero__ornament" aria-hidden>
          <div className="ornament__ring">
            <Glyph s={96} op={0.18} />
          </div>
        </div>

        <ScrollHint onClick={() => go("servicos")} />
      </section>

      {/* ══════════ TICKER ══════════ */}
      <div className="ticker" aria-hidden>
        <div className="ticker__track">
          {[0,1,2].map(k => (
            <span key={k} className="ticker__row">
              {TICKER_ITEMS.map(t => (
                <span key={t} className="ticker__item">{t}<span className="ticker__dot">◆</span></span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════ SERVIÇOS ══════════ */}
      <section id="servicos" className="section">
        <div className="wrap">
          <div id="rv-srv-h" data-reveal className={r("rv-srv-h")}>
            <Tag>O que entregamos</Tag>
            <H2>Tudo que sua marca<br /><em>precisa existir.</em></H2>
          </div>

          <div className="grid-srv">
            {SERVICOS.map((s, i) => (
              <div key={i} id={`rv-srv-${i}`} data-reveal
                className={`srv-card ${r(`rv-srv-${i}`, (i % 3 + 1) as 1|2|3)}`}>
                <span className="srv-glyph">{s.icon}</span>
                <strong className="srv-nome">{s.nome}</strong>
                <p className="srv-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ SOBRE ══════════ */}
      <section id="sobre" className="section sobre">
        <div className="noise" />
        <div className="wrap sobre__inner">

          <div id="rv-sobre-v" data-reveal className={`sobre__visual ${r("rv-sobre-v")}`}>
            <div className="foto-frame">
              {/* ↓ substitua por <Image> quando tiver a foto */}
              <div className="foto-placeholder">
                <Glyph s={110} op={0.15} />
                <span>Vanessa · Nessart</span>
              </div>
              <div className="foto-badge">✦ Design com alma</div>
            </div>
            <aside className="sobre__aside">
              {[["200+","marcas"],["5★","avaliação"],["2019","fundação"]].map(([v,l]) => (
                <div key={l} className="aside-stat">
                  <strong>{v}</strong><span>{l}</span>
                </div>
              ))}
            </aside>
          </div>

          <div id="rv-sobre-t" data-reveal className={`sobre__texto ${r("rv-sobre-t", 2)}`}>
            <Tag>Sobre mim</Tag>
            <H2>Oi! Eu sou a<br /><em>Vanessa.</em></H2>

            <div className="sobre__copy">
              <p>
                Sagitariana, apaixonada por liberdade e criatividade — e é exatamente isso que coloco
                em cada projeto. Sou a criadora da <strong>Nessart</strong>: uma junção do meu nome
                com "arte", porque pra mim a arte está em tudo, especialmente quando o assunto é dar
                alma e personalidade às marcas.
              </p>
              <p>
                Sem identidade visual forte, uma empresa é como um navio à deriva.
                Meu trabalho é garantir que a sua tenha um{" "}
                <strong>destino claro e inesquecível.</strong>
              </p>
              <p>
                Aqui não tem fórmula pronta — só originalidade, leveza e muito cuidado.
                Do conceito ao material impresso e digital, entrego uma identidade
                completa, feita sob medida e cheia de personalidade.
              </p>
              <p className="sobre__cta-text">
                Se você quer aquele toque de <em>"uau"</em>, a Nessart é pra você. 🚀✨
              </p>
            </div>

            <div className="sobre__tags">
              {["Originalidade","Criatividade","Profissionalismo","Entrega completa"].map(v => (
                <span key={v} className="vtag">✓ {v}</span>
              ))}
            </div>

            <button onClick={() => go("planos")} className="btn btn--solid mt-btn">
              Quero trabalhar com a Vanessa <Arrow />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════ PROCESSO ══════════ */}
      <section id="processo" className="section">
        <div className="wrap">
          <div id="rv-proc-h" data-reveal className={r("rv-proc-h")}>
            <Tag>Como funciona</Tag>
            <H2>Do briefing à entrega —<br /><em>sem surpresas.</em></H2>
          </div>

          <div className="steps">
            {PROCESSO.map((p, i) => (
              <div key={i} id={`rv-step-${i}`} data-reveal
                className={`step ${r(`rv-step-${i}`, (i % 3 + 1) as 1|2|3)}`}>
                <div className="step__num">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="step__titulo">{p.titulo}</h3>
                <p className="step__desc">{p.desc}</p>
                {i < PROCESSO.length - 1 && <div className="step__divider" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ DEPOIMENTOS ══════════ */}
      <section className="section deps">
        <div className="noise" />
        <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
          <div id="rv-dep-h" data-reveal className={r("rv-dep-h")}>
            <Tag>Quem já transformou</Tag>
            <H2>O que dizem<br /><em>as clientes.</em></H2>
          </div>

          <div className="grid-deps">
            {DEPOIMENTOS.map((d, i) => (
              <div key={i} id={`rv-dep-${i}`} data-reveal
                className={`dep-card ${r(`rv-dep-${i}`, (i % 3 + 1) as 1|2|3)}`}>
                <div className="dep__stars">★★★★★</div>
                <blockquote className="dep__quote">"{d.texto}"</blockquote>
                <footer className="dep__footer">
                  <strong>{d.nome}</strong>
                  <span>{d.nicho}</span>
                </footer>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ PLANOS ══════════ */}
      <section id="planos" className="section planos">
        <div className="wrap">
          <div id="rv-plan-h" data-reveal className={r("rv-plan-h")}>
            <Tag>Investimento</Tag>
            <H2>Escolha o plano<br /><em>da sua marca.</em></H2>
            <p className="plan-sub">
              Todos os planos incluem até <strong>5 rodadas de ajuste</strong> e
              arquivos organizados para impressão e digital.
            </p>
          </div>

          {planos.length === 0 ? (
            <p className="plan-loading">Carregando planos...</p>
          ) : (
            <div className="grid-plans">
              {planos.map((p, i) => (
                <div key={p.id} id={`rv-plan-${i}`} data-reveal
                  className={`plan-card ${p.destaque ? "plan-card--hi" : ""} ${r(`rv-plan-${i}`, (i % 3 + 1) as 1|2|3)}`}>

                  {p.destaque && <div className="plan-badge">Mais escolhido</div>}

                  <header className="plan-head">
                    <h3 className="plan-nome">{p.nome}</h3>
                    <p className="plan-tagline">{p.tagline}</p>
                  </header>

                  <div className="plan-price">
                    <span className="price-cur">R$</span>
                    <span className="price-val">{p.preco.toLocaleString("pt-BR")}</span>
                  </div>
                  <p className="price-split">
                    50% entrada (R$ {p.entrada.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}) + 50% na entrega
                  </p>
                  <p className="plan-prazo">⏱ {p.prazo}</p>

                  <ul className="plan-itens">
                    {p.itens.map((it, j) => (
                      <li key={j}><Check /> {it}</li>
                    ))}
                    {p.brinde && (
                      <li className="plan-brinde">🎁 <strong>Brinde:</strong> {p.brinde}</li>
                    )}
                  </ul>

                  <button
                    onClick={() => { setPlanoSelecionado(p); setCheckoutAberto(true); }}
                    className={`btn w100 ${p.destaque ? "btn--solid" : "btn--outline"}`}>
                    Quero este plano <Arrow />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div id="rv-gar" data-reveal className={`garantia ${r("rv-gar")}`}>
            <span className="gar-icon">🛡️</span>
            <div>
              <strong>Compromisso de qualidade</strong>
              <p>
                Até 5 rodadas de ajuste incluídas em todos os planos. Se ao final você não
                se reconhecer na marca, conversamos — o resultado precisa representar você,
                não só parecer bonito.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ CTA FINAL ══════════ */}
      <section className="cta-final">
        <div className="blob blob--a" style={{ opacity: .12 }} />
        <div className="noise" />
        <div id="rv-cta" data-reveal className={`cta-final__inner ${r("rv-cta")}`}>
          <Glyph s={52} op={0.35} />
          <h2 className="cta-h2">
            Pronta para ter uma marca<br /><em>com alma?</em>
          </h2>
          <p className="cta-sub">
            Escolha seu plano ou converse com a Vanessa antes de decidir —
            sem pressão, só resultado.
          </p>
          <div className="cta-btns">
            <button onClick={() => go("planos")} className="btn btn--solid">
              Ver planos <Arrow />
            </button>
            <a href={whats} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
              <WhatsApp /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="footer">
        <Glyph s={26} op={0.3} />
        <p>© {new Date().getFullYear()} Nessart Design · Todos os direitos reservados</p>
        <p className="footer__sub">Criado com alma por Vanessa ✦</p>
      </footer>

      {/* Checkout */}
      {planoSelecionado && checkoutAberto && (
        <CheckoutModal
          plano={planoSelecionado}
          nomeCliente=""
          onClose={() => { setCheckoutAberto(false); setPlanoSelecionado(null); }}
        />
      )}
    </div>
  );
}

// ─── Dados ───────────────────────────────────────────────────────
const NAV_LINKS: [string, string][] = [
  ["servicos", "Serviços"], ["sobre", "Sobre"],
  ["processo", "Processo"], ["planos",  "Planos"],
];

const TICKER_ITEMS = [
  "Logotipo", "Identidade Visual", "Paleta de Cores",
  "Tipografia", "Papelaria", "Estampa da Marca", "Manual da Marca",
];

const SERVICOS = [
  { icon: "◈", nome: "Logotipo Completo",  desc: "Principal, horizontal, redondo e alternativo — sua marca em todas as versões necessárias." },
  { icon: "◉", nome: "Identidade Visual",  desc: "Paleta de cores, tipografia e estampa exclusiva que criam um sistema coeso e marcante." },
  { icon: "◐", nome: "Papelaria",          desc: "Recibo, ficha de atendimento, assinatura de e-mail — sua marca em cada detalhe." },
  { icon: "◑", nome: "Arquivos Completos", desc: "Todos os arquivos organizados para impressão (CMYK) e digital (RGB, PNG, SVG)." },
  { icon: "◒", nome: "Manual da Marca",    desc: "Guia completo para aplicar sua identidade com consistência em todos os materiais." },
  { icon: "◓", nome: "Suporte Dedicado",   desc: "Atendimento próximo do início ao fim, com até 5 rodadas de ajuste em todos os planos." },
];

const PROCESSO = [
  { titulo: "Imersão Estratégica",       desc: "Você me conta sua história e onde quer chegar. Cada detalhe importa para criar algo verdadeiro." },
  { titulo: "Pesquisa & Posicionamento", desc: "Mergulho no universo da sua marca para construir um posicionamento único e relevante." },
  { titulo: "Desenvolvimento Criativo",  desc: "Crio a identidade com originalidade e intenção — nada genérico, tudo sob medida." },
  { titulo: "Alinhamento & Refino",      desc: "Até 5 rodadas de ajustes finos até você se reconhecer em cada detalhe." },
  { titulo: "Entrega Final",             desc: "Arquivos organizados prontos para impressão e digital, com manual de uso completo." },
];

const DEPOIMENTOS = [
  { texto: "Minha marca finalmente representa quem eu sou. As clientes me reconhecem antes mesmo de eu falar. Valeu cada centavo.", nome: "Camila R.", nicho: "Nutricionista" },
  { texto: "Profissionalismo impecável do início ao fim. O resultado superou tudo que eu esperava. Recomendo de olhos fechados!", nome: "Juliana M.", nicho: "Estúdio de Pilates" },
  { texto: "Eu chorei quando vi o resultado. É exatamente o que eu sonhava. A Vanessa tem um talento fora do comum!", nome: "Fernanda S.", nicho: "Confeitaria Artesanal" },
];

// ─── Micro-componentes ───────────────────────────────────────────
function Glyph({ s = 40, op = 0.6 }: { s?: number; op?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none" style={{ opacity: op, flexShrink: 0 }}>
      <circle cx="24" cy="24" r="22" stroke="#D4C4A8" strokeWidth="1" />
      <path d="M16 12 Q24 8 32 12 Q28 24 24 28 Q20 24 16 12Z" stroke="#D4C4A8" strokeWidth="1.2" fill="none" />
      <path d="M16 36 Q24 40 32 36 Q28 24 24 20 Q20 24 16 36Z" stroke="#D4C4A8" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

function GridLines() {
  return (
    <svg className="grid-svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {[...Array(9)].map((_,i) => <line key={`v${i}`} x1={i*150} y1="0" x2={i*150} y2="800" stroke="#D4C4A8" strokeOpacity="0.03" strokeWidth="1"/>)}
      {[...Array(7)].map((_,i) => <line key={`h${i}`} x1="0" y1={i*133} x2="1200" y2={i*133} stroke="#D4C4A8" strokeOpacity="0.03" strokeWidth="1"/>)}
    </svg>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <p className="tag">{children}</p>;
}
function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="sh2">{children}</h2>;
}
function Num({ v, l }: { v: string; l: string }) {
  return <div className="num"><strong>{v}</strong><span>{l}</span></div>;
}
function Arrow() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
}
function Check() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{flexShrink:0,marginTop:"2px"}}><path d="M20 6L9 17l-5-5"/></svg>;
}
function ScrollHint({ onClick }: { onClick: () => void }) {
  return (
    <button className="scroll-hint" onClick={onClick} aria-label="Rolar para baixo">
      <span>scroll</span>
      <div className="scroll-bar" />
    </button>
  );
}
function WhatsApp() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.549 4.109 1.514 5.842L.057 23.25a.75.75 0 00.918.908l5.451-1.585A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.93 0-3.74-.524-5.287-1.435l-.38-.225-3.94 1.146 1.09-3.858-.247-.396A9.712 9.712 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
    </svg>
  );
}

// ─── CSS ─────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

/* ── tokens ── */
:root {
  --bg:    #070101;
  --bg2:   #100202;
  --bg3:   #190404;
  --wine:  #8B1A1A;
  --wine2: #5c0a0a;
  --cream: #d4c4a8;
  --cream2:#f0ebe0;
  --gold:  #c4956a;
  --r: 'Cormorant Garamond', Georgia, serif;
  --s: 'DM Sans', system-ui, sans-serif;
}

/* ── reset / base ── */
.root *, .root *::before, .root *::after { box-sizing: border-box; margin: 0; padding: 0; }
.root {
  background: var(--bg);
  color: var(--cream2);
  font-family: var(--s);
  overflow-x: hidden;
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
}
.root button { font-family: var(--s); }
.root em { font-style: italic; color: var(--gold); }
.root strong { font-weight: 600; color: var(--cream2); }

/* ── noise ── */
.noise, .root .noise {
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
}

/* ── reveal ── */
.reveal-base {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity .75s ease, transform .75s ease;
}
.reveal-in { opacity: 1 !important; transform: none !important; }
.delay-1 { transition-delay: .1s; }
.delay-2 { transition-delay: .22s; }
.delay-3 { transition-delay: .34s; }

/* ── nav ── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  transition: background .35s ease, border-color .35s ease, backdrop-filter .35s ease;
  border-bottom: 1px solid transparent;
}
.nav--solid {
  background: rgba(7,1,1,.9);
  backdrop-filter: blur(18px);
  border-color: rgba(212,196,168,.07);
}
.nav__inner {
  max-width: 1160px; margin: 0 auto;
  padding: 1.1rem 2rem;
  display: flex; align-items: center; justify-content: space-between; gap: 2rem;
}
.nav__brand {
  display: flex; align-items: center; gap: .7rem;
  background: none; border: none; cursor: pointer;
  color: var(--cream2); font-family: var(--r);
  font-size: 1.35rem; font-weight: 400; letter-spacing: .04em;
}
.nav__menu { display: flex; align-items: center; gap: 1.75rem; }
.nav__item {
  background: none; border: none; cursor: pointer;
  color: rgba(240,235,224,.45); font-size: .78rem;
  letter-spacing: .14em; text-transform: uppercase;
  transition: color .25s;
}
.nav__item:hover { color: var(--cream2); }
.nav__pill {
  background: none; border: 1px solid rgba(139,26,26,.55);
  color: var(--cream); padding: .55rem 1.3rem; cursor: pointer;
  font-size: .75rem; letter-spacing: .14em; text-transform: uppercase;
  transition: all .25s;
}
.nav__pill:hover { background: var(--wine); border-color: var(--wine); color: var(--cream2); }

/* burger */
.nav__burger {
  display: none; flex-direction: column; gap: 5px;
  background: none; border: none; cursor: pointer; padding: .4rem;
}
.nav__burger span {
  display: block; width: 22px; height: 1.5px;
  background: var(--cream); transition: all .3s ease;
  transform-origin: center;
}
.nav__burger.is-open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.nav__burger.is-open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.nav__burger.is-open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

.nav__drawer {
  background: rgba(7,1,1,.97);
  border-top: 1px solid rgba(212,196,168,.07);
  padding: 1.5rem 2rem 2rem;
  display: flex; flex-direction: column; gap: 1rem;
}
.drawer__item {
  background: none; border: none; cursor: pointer;
  color: rgba(240,235,224,.6); text-align: left;
  font-size: .95rem; letter-spacing: .1em; text-transform: uppercase;
  padding: .6rem 0; border-bottom: 1px solid rgba(212,196,168,.05);
  transition: color .25s;
}
.drawer__item:hover { color: var(--cream2); }
.drawer__cta {
  background: var(--wine); border: none; cursor: pointer;
  color: var(--cream2); padding: .9rem 1.5rem; margin-top: .5rem;
  font-size: .85rem; letter-spacing: .12em; text-transform: uppercase;
  transition: background .25s;
}
.drawer__cta:hover { background: #a02020; }

@media (max-width: 760px) {
  .nav__menu { display: none; }
  .nav__burger { display: flex; }
}

/* ── hero ── */
.hero {
  position: relative; min-height: 100svh;
  display: flex; align-items: center; justify-content: center;
  padding: 7rem 2rem 5rem; text-align: center; overflow: hidden;
}
.hero__bg { position: absolute; inset: 0; }
.blob {
  position: absolute; border-radius: 50%;
  filter: blur(90px); pointer-events: none;
}
.blob--a { width: 700px; height: 700px; top: -25%; right: -20%; background: radial-gradient(circle, rgba(139,26,26,.16) 0%, transparent 70%); }
.blob--b { width: 450px; height: 450px; bottom: -15%; left: -12%; background: radial-gradient(circle, rgba(92,10,10,.11) 0%, transparent 70%); }
.blob--c { width: 320px; height: 320px; top: 35%; left: 15%; background: radial-gradient(circle, rgba(196,149,106,.055) 0%, transparent 70%); }
.grid-svg { position: absolute; inset: 0; width: 100%; height: 100%; }

.hero__body { position: relative; z-index: 2; max-width: 860px; }

.hero__eyebrow {
  display: flex; align-items: center; gap: 1rem; justify-content: center;
  font-size: .68rem; letter-spacing: .3em; text-transform: uppercase;
  color: rgba(212,196,168,.4); margin-bottom: 2.5rem;
  animation: up .7s ease both;
}
.rule { flex: 0 0 36px; height: 1px; background: rgba(212,196,168,.2); }

.hero__h1 {
  font-family: var(--r); font-weight: 300; line-height: 1.05;
  display: flex; flex-direction: column; gap: .1em; margin-bottom: 1.75rem;
}
.h1__a { font-size: clamp(2.8rem,6.5vw,5.2rem); animation: up .7s .1s ease both; }
.h1__b { font-size: clamp(2.8rem,6.5vw,5.2rem); animation: up .7s .2s ease both; }
.h1__c { font-size: clamp(1.5rem,3.5vw,2.6rem); color: rgba(240,235,224,.3); animation: up .7s .3s ease both; }

.hero__sub {
  max-width: 560px; margin: 0 auto 2.25rem;
  font-size: clamp(.88rem,1.8vw,1rem);
  color: rgba(212,196,168,.55); line-height: 1.8;
  animation: up .7s .4s ease both;
}

.hero__ctas {
  display: flex; gap: .9rem; justify-content: center; flex-wrap: wrap;
  margin-bottom: 3rem; animation: up .7s .5s ease both;
}

.hero__nums {
  display: flex; align-items: center; gap: 2.25rem; justify-content: center;
  flex-wrap: wrap; animation: up .7s .6s ease both;
}
.num { text-align: center; }
.num strong {
  display: block; font-family: var(--r);
  font-size: 1.75rem; font-weight: 400; color: var(--cream2);
}
.num span {
  font-size: .68rem; letter-spacing: .14em;
  text-transform: uppercase; color: rgba(212,196,168,.38);
}
.sep { width: 1px; height: 34px; background: rgba(212,196,168,.1); }

.hero__ornament {
  position: absolute; right: 5%; top: 50%; transform: translateY(-50%);
  animation: float 6s ease-in-out infinite; z-index: 1;
}
.ornament__ring {
  width: 200px; height: 200px; border-radius: 50%;
  border: 1px solid rgba(212,196,168,.12);
  display: flex; align-items: center; justify-content: center;
}

.scroll-hint {
  position: absolute; bottom: 2.25rem; left: 50%; transform: translateX(-50%);
  background: none; border: none; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: .65rem;
  color: rgba(212,196,168,.28); font-size: .6rem;
  letter-spacing: .28em; text-transform: uppercase;
  animation: up 1s 1.4s ease both;
}
.scroll-bar {
  width: 1px; height: 46px;
  background: linear-gradient(to bottom, rgba(212,196,168,.35), transparent);
  animation: pulse-bar 2.2s ease-in-out infinite;
}

/* ── ticker ── */
.ticker {
  overflow: hidden;
  border-top: 1px solid rgba(139,26,26,.18);
  border-bottom: 1px solid rgba(139,26,26,.18);
  background: rgba(139,26,26,.055);
  padding: .8rem 0;
}
.ticker__track {
  display: flex; width: max-content;
  animation: ticker 38s linear infinite;
}
.ticker__track:hover { animation-play-state: paused; }
.ticker__row {
  display: flex; align-items: center; padding: 0 2.5rem; gap: 0;
}
.ticker__item {
  font-size: .68rem; letter-spacing: .24em; text-transform: uppercase;
  color: rgba(212,196,168,.32); display: flex; align-items: center;
}
.ticker__dot { color: var(--wine); margin: 0 1.25rem; font-size: .45rem; }

/* ── layout / section ── */
.section { padding: 7rem 2rem; }
.wrap { max-width: 1160px; margin: 0 auto; }

/* ── section-header ── */
.tag {
  display: block; font-size: .68rem;
  letter-spacing: .32em; text-transform: uppercase;
  color: var(--wine); margin-bottom: 1.1rem;
}
.sh2 {
  font-family: var(--r);
  font-size: clamp(2rem,4.5vw,3.6rem);
  font-weight: 300; line-height: 1.1; color: var(--cream2);
  margin-bottom: 1.25rem;
}
.sh2 em { font-style: italic; color: var(--gold); }

/* ── serviços ── */
#rv-srv-h { text-align: center; margin-bottom: 4.5rem; }
.grid-srv {
  display: grid; grid-template-columns: repeat(3,1fr);
  border: 1px solid rgba(212,196,168,.06);
  gap: 1px; background: rgba(212,196,168,.06);
}
@media (max-width: 880px) { .grid-srv { grid-template-columns: repeat(2,1fr); } }
@media (max-width: 520px) { .grid-srv { grid-template-columns: 1fr; } }
.srv-card {
  background: var(--bg); padding: 2.25rem 1.85rem;
  transition: background .3s ease;
}
.srv-card:hover { background: var(--bg2); }
.srv-glyph {
  display: block; font-family: var(--r);
  font-size: 2.1rem; color: rgba(139,26,26,.6);
  margin-bottom: 1.15rem; line-height: 1;
}
.srv-nome {
  display: block; font-family: var(--r);
  font-size: 1.35rem; font-weight: 400; color: var(--cream2);
  margin-bottom: .65rem;
}
.srv-desc { font-size: .84rem; color: rgba(212,196,168,.48); line-height: 1.72; }

/* ── sobre ── */
.sobre { background: var(--bg2); position: relative; overflow: hidden; }
.sobre__inner {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 6rem; align-items: center;
  position: relative; z-index: 1;
}
@media (max-width: 860px) {
  .sobre__inner { grid-template-columns: 1fr; gap: 3rem; }
  .sobre__visual { order: -1; }
}
.sobre__visual { position: relative; }
.foto-frame {
  aspect-ratio: 4/5; max-height: 500px;
  background: var(--bg3); border: 1px solid rgba(212,196,168,.07);
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
}
.foto-placeholder {
  display: flex; flex-direction: column; align-items: center; gap: 1.25rem;
  font-size: .75rem; letter-spacing: .15em; text-transform: uppercase;
  color: rgba(212,196,168,.18);
}
.foto-badge {
  position: absolute; bottom: 1.4rem; left: 1.4rem;
  background: var(--bg); border: 1px solid rgba(212,196,168,.1);
  padding: .65rem 1.15rem; font-size: .72rem;
  letter-spacing: .14em; color: rgba(212,196,168,.55);
}
.sobre__aside {
  position: absolute; right: -1.75rem; top: 50%; transform: translateY(-50%);
  display: flex; flex-direction: column; gap: 1px;
  background: rgba(212,196,168,.05);
}
.aside-stat {
  background: var(--bg); padding: 1.1rem 1.4rem; text-align: center; min-width: 78px;
}
.aside-stat strong {
  display: block; font-family: var(--r);
  font-size: 1.5rem; font-weight: 400; color: var(--cream2);
}
.aside-stat span {
  font-size: .58rem; letter-spacing: .14em;
  text-transform: uppercase; color: rgba(212,196,168,.32);
}
.sobre__texto { padding-left: .75rem; }
.sobre__copy {
  margin: 1.4rem 0 1.75rem;
  display: flex; flex-direction: column; gap: 1.1rem;
}
.sobre__copy p {
  font-size: .93rem; color: rgba(212,196,168,.58); line-height: 1.82;
}
.sobre__cta-text { font-family: var(--r); font-size: 1.08rem !important; color: rgba(212,196,168,.75) !important; font-style: italic; }
.sobre__tags { display: flex; flex-wrap: wrap; gap: .65rem; }
.vtag {
  border: 1px solid rgba(139,26,26,.3);
  padding: .4rem .85rem; font-size: .7rem;
  letter-spacing: .11em; text-transform: uppercase;
  color: rgba(212,196,168,.55);
}
.mt-btn { margin-top: 1.85rem; }

/* ── processo ── */
#rv-proc-h { text-align: center; margin-bottom: 4.5rem; }
.steps {
  display: grid; grid-template-columns: repeat(5,1fr); gap: 0;
  position: relative;
}
@media (max-width: 980px) {
  .steps {
    grid-template-columns: 1fr 1fr;
    gap: 1px; background: rgba(212,196,168,.05);
  }
}
@media (max-width: 500px) { .steps { grid-template-columns: 1fr; } }
.step {
  padding: 2.25rem 1.6rem; position: relative;
  background: var(--bg);
}
.step:hover { background: var(--bg2); }
.step__num {
  font-family: var(--r); font-size: 3.8rem; font-weight: 300;
  color: rgba(139,26,26,.18); line-height: 1; margin-bottom: .9rem;
}
.step__titulo {
  font-family: var(--r); font-size: 1.15rem; font-weight: 400;
  color: var(--cream2); margin-bottom: .65rem;
}
.step__desc { font-size: .8rem; color: rgba(212,196,168,.43); line-height: 1.72; }
.step__divider {
  position: absolute; top: 3.2rem; right: 0;
  width: 1px; height: 38px; background: rgba(212,196,168,.07);
}
@media (max-width: 980px) { .step__divider { display: none; } }

/* ── depoimentos ── */
.deps { position: relative; background: var(--bg2); }
#rv-dep-h { text-align: center; margin-bottom: 4.5rem; }
.grid-deps {
  display: grid; grid-template-columns: repeat(3,1fr);
  gap: 1px; background: rgba(212,196,168,.05);
}
@media (max-width: 860px) { .grid-deps { grid-template-columns: 1fr; } }
.dep-card { background: var(--bg2); padding: 2.25rem 1.85rem; }
.dep__stars { color: var(--gold); font-size: .82rem; letter-spacing: .08em; margin-bottom: 1.1rem; }
.dep__quote {
  font-family: var(--r); font-size: 1.08rem; font-style: italic;
  color: rgba(212,196,168,.7); line-height: 1.72; margin-bottom: 1.4rem;
}
.dep__footer { display: flex; flex-direction: column; gap: .2rem; }
.dep__footer strong { font-size: .82rem; color: var(--cream2); font-weight: 500; }
.dep__footer span {
  font-size: .72rem; color: rgba(212,196,168,.32);
  letter-spacing: .1em; text-transform: uppercase;
}

/* ── planos ── */
.planos { background: var(--bg); }
#rv-plan-h { text-align: center; margin-bottom: 4.5rem; }
.plan-sub {
  margin-top: 1rem; font-size: .9rem;
  color: rgba(212,196,168,.48); max-width: 480px;
  margin-left: auto; margin-right: auto; line-height: 1.7;
}
.plan-loading { text-align: center; padding: 5rem; color: rgba(212,196,168,.28); }
.grid-plans {
  display: grid; grid-template-columns: repeat(3,1fr);
  gap: 1px; background: rgba(212,196,168,.06); margin-bottom: 2.5rem;
}
@media (max-width: 860px) { .grid-plans { grid-template-columns: 1fr; } }
.plan-card {
  background: var(--bg); padding: 2.5rem 2rem;
  display: flex; flex-direction: column;
  position: relative; transition: background .3s;
}
.plan-card:hover { background: var(--bg2); }
.plan-card--hi { background: var(--bg3) !important; }
.plan-badge {
  position: absolute; top: -1px; left: 50%;
  transform: translateX(-50%);
  background: var(--wine); color: var(--cream2);
  font-size: .62rem; letter-spacing: .2em; text-transform: uppercase;
  padding: .38rem 1.15rem; white-space: nowrap;
}
.plan-head { padding-top: 1.2rem; margin-bottom: 1.4rem; }
.plan-nome {
  font-family: var(--r); font-size: 1.9rem; font-weight: 400;
  color: var(--cream2); margin-bottom: .3rem;
}
.plan-tagline { font-size: .78rem; color: rgba(212,196,168,.38); line-height: 1.5; }
.plan-price { display: flex; align-items: flex-end; gap: .3rem; margin-bottom: .4rem; }
.price-cur { font-size: .88rem; color: var(--wine); margin-bottom: .3rem; }
.price-val {
  font-family: var(--r); font-size: 3.2rem; font-weight: 300;
  color: var(--cream2); line-height: 1;
}
.price-split { font-size: .7rem; color: rgba(212,196,168,.28); margin-bottom: .3rem; }
.plan-prazo { font-size: .7rem; color: rgba(212,196,168,.32); margin-bottom: 1.6rem; }
.plan-itens {
  list-style: none; flex: 1;
  display: flex; flex-direction: column; gap: .7rem;
  margin-bottom: 1.9rem;
}
.plan-itens li {
  display: flex; gap: .7rem; align-items: flex-start;
  font-size: .8rem; color: rgba(212,196,168,.52); line-height: 1.5;
}
.plan-itens li svg { color: var(--wine); }
.plan-brinde {
  font-size: .78rem !important;
  color: rgba(196,149,106,.72) !important;
  padding-top: .7rem !important;
  border-top: 1px solid rgba(212,196,168,.06);
  gap: .5rem !important;
}
.w100 { width: 100%; justify-content: center; }

.garantia {
  border: 1px solid rgba(139,26,26,.22);
  background: rgba(139,26,26,.055);
  padding: 1.85rem 2.25rem;
  display: flex; gap: 1.5rem; align-items: flex-start;
}
.gar-icon { font-size: 1.9rem; flex-shrink: 0; margin-top: .1rem; }
.garantia strong { display: block; color: var(--cream2); font-size: .9rem; margin-bottom: .45rem; }
.garantia p { font-size: .82rem; color: rgba(212,196,168,.48); line-height: 1.72; }

/* ── botões ── */
.btn {
  display: inline-flex; align-items: center; gap: .55rem;
  padding: .9rem 1.85rem; font-size: .78rem; font-weight: 500;
  letter-spacing: .14em; text-transform: uppercase;
  cursor: pointer; border: none; transition: all .25s; text-decoration: none;
  white-space: nowrap;
}
.btn--solid { background: var(--cream2); color: var(--wine2); }
.btn--solid:hover { background: var(--cream); }
.btn--ghost {
  background: none; color: rgba(212,196,168,.6);
  border: 1px solid rgba(212,196,168,.2);
}
.btn--ghost:hover { border-color: rgba(212,196,168,.48); color: var(--cream2); }
.btn--outline {
  background: none; color: rgba(212,196,168,.6);
  border: 1px solid rgba(212,196,168,.18);
}
.btn--outline:hover { border-color: var(--wine); color: var(--cream2); }

/* ── cta final ── */
.cta-final { position: relative; padding: 9rem 2rem; text-align: center; overflow: hidden; }
.cta-final__inner {
  position: relative; z-index: 2;
  max-width: 640px; margin: 0 auto;
  display: flex; flex-direction: column; align-items: center; gap: 1.4rem;
}
.cta-h2 {
  font-family: var(--r); font-size: clamp(2.2rem,5vw,3.8rem);
  font-weight: 300; color: var(--cream2); line-height: 1.1;
}
.cta-h2 em { font-style: italic; color: var(--gold); }
.cta-sub { font-size: .92rem; color: rgba(212,196,168,.48); line-height: 1.78; max-width: 460px; }
.cta-btns { display: flex; gap: .9rem; flex-wrap: wrap; justify-content: center; margin-top: .4rem; }

/* ── footer ── */
.footer {
  border-top: 1px solid rgba(212,196,168,.055);
  padding: 2.25rem 2rem; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: .65rem;
}
.footer p { font-size: .72rem; color: rgba(212,196,168,.22); letter-spacing: .05em; }
.footer__sub { color: rgba(212,196,168,.13) !important; }

/* ── keyframes ── */
@keyframes up {
  from { opacity: 0; transform: translateY(26px); }
  to   { opacity: 1; transform: none; }
}
@keyframes float {
  0%, 100% { transform: translateY(-50%); }
  50%       { transform: translateY(calc(-50% - 16px)); }
}
@keyframes pulse-bar {
  0%   { opacity: 0; transform: scaleY(0); transform-origin: top; }
  40%  { opacity: 1; transform: scaleY(1); transform-origin: top; }
  60%  { opacity: 1; transform: scaleY(1); transform-origin: bottom; }
  100% { opacity: 0; transform: scaleY(0); transform-origin: bottom; }
}
@keyframes ticker {
  from { transform: translateX(0); }
  to   { transform: translateX(-33.333%); }
}
`;