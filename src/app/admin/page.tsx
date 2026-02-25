"use client";

import { useState, useEffect, useCallback } from "react";

// ── Types ──────────────────────────────────────────────
interface Plano {
  id: string; nome: string; tagline: string;
  preco: number; entrada: number; prazo: string;
  destaque: boolean; itens: string[]; brinde: string | null; ordem: number;
}
interface ClientePlano {
  id?: number; clienteId: number; nome: string; tagline: string;
  preco: number; entrada: number; prazo: string;
  destaque: boolean; itens: string[]; brinde: string | null; ordem: number;
}
interface Cliente {
  id: number; slug: string; nome: string; url: string;
  ativa: boolean; criadoEm: string;
}

const PLANO_VAZIO = {
  nome: "", tagline: "", preco: 0, prazo: "15 a 20 dias úteis",
  destaque: false, itens: [""], brinde: null as string | null,
};

type Aba = "clientes" | "planos";

// ════════════════════════════════════════════════════════
export default function AdminPage() {
  const [aba, setAba]         = useState<Aba>("clientes");
  const [sucesso, setSucesso] = useState("");
  const [erro, setErro]       = useState("");

  // Clientes
  const [clientes, setClientes]             = useState<Cliente[]>([]);
  const [clientesLoading, setClientesLoading] = useState(false);
  const [novoNome, setNovoNome]             = useState("");
  const [criandoCliente, setCriandoCliente] = useState(false);

  // Planos padrão
  const [planos, setPlanos]               = useState<Plano[]>([]);
  const [planosLoading, setPlanosLoading] = useState(false);
  const [modalPlano, setModalPlano]       = useState(false);
  const [editandoPlano, setEditandoPlano] = useState<Plano | null>(null);
  const [formPlano, setFormPlano]         = useState({ ...PLANO_VAZIO });
  const [novoItem, setNovoItem]           = useState("");

  // Planos do cliente (modal)
  const [clienteSelecionado, setClienteSelecionado]   = useState<Cliente | null>(null);
  const [clientePlanos, setClientePlanos]             = useState<ClientePlano[]>([]);
  const [clientePlanosLoading, setClientePlanosLoading] = useState(false);
  const [modalClientePlano, setModalClientePlano]     = useState(false);
  const [editandoClientePlano, setEditandoClientePlano] = useState<ClientePlano | null>(null);
  const [formClientePlano, setFormClientePlano]       = useState({ ...PLANO_VAZIO });
  const [novoItemCliente, setNovoItemCliente]         = useState("");

  const msg = (tipo: "ok" | "erro", texto: string) => {
    tipo === "ok" ? setSucesso(texto) : setErro(texto);
    setTimeout(() => tipo === "ok" ? setSucesso("") : setErro(""), 4000);
  };

  // ── Carregar dados ──────────────────────────────────
  const carregarClientes = useCallback(async () => {
    setClientesLoading(true);
    try { setClientes(await fetch("/api/clientes").then(r => r.json())); }
    catch { msg("erro", "Erro ao carregar clientes"); }
    finally { setClientesLoading(false); }
  }, []);

  const carregarPlanos = useCallback(async () => {
    setPlanosLoading(true);
    try { setPlanos(await fetch("/api/planos").then(r => r.json())); }
    catch { msg("erro", "Erro ao carregar planos"); }
    finally { setPlanosLoading(false); }
  }, []);

  const carregarClientePlanos = useCallback(async (clienteId: number) => {
    setClientePlanosLoading(true);
    try {
      const data = await fetch(`/api/clientes/planos?clienteId=${clienteId}`).then(r => r.json());
      setClientePlanos(data);
    } catch { msg("erro", "Erro ao carregar planos do cliente"); }
    finally { setClientePlanosLoading(false); }
  }, []);

  useEffect(() => { carregarClientes(); carregarPlanos(); }, [carregarClientes, carregarPlanos]);

  // ── Criar cliente ───────────────────────────────────
  const criarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim()) return;
    setCriandoCliente(true);
    try {
      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: novoNome.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      msg("ok", `Cliente "${data.nome}" criado! URL: ${data.url}`);
      setNovoNome("");
      await carregarClientes();
    } catch (e: unknown) { msg("erro", e instanceof Error ? e.message : "Erro"); }
    finally { setCriandoCliente(false); }
  };

  const excluirCliente = async (id: number, nome: string) => {
    if (!confirm(`Excluir "${nome}"? Os planos personalizados serão removidos.`)) return;
    try {
      await fetch("/api/clientes", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      msg("ok", "Cliente excluído!");
      await carregarClientes();
    } catch { msg("erro", "Erro ao excluir"); }
  };

  // ── Modal planos do cliente ─────────────────────────
  const abrirClientePlanos = async (cliente: Cliente) => {
    setClienteSelecionado(cliente);
    await carregarClientePlanos(cliente.id);
  };

  const fecharClientePlanos = () => {
    setClienteSelecionado(null);
    setClientePlanos([]);
  };

  const copiarDePadrao = (plano: Plano) => {
    setFormClientePlano({
      nome: plano.nome, tagline: plano.tagline, preco: plano.preco,
      prazo: plano.prazo, destaque: plano.destaque,
      itens: [...plano.itens], brinde: plano.brinde,
    });
    setEditandoClientePlano(null);
    setModalClientePlano(true);
  };

  const salvarClientePlano = async () => {
    if (!clienteSelecionado) return;
    if (!formClientePlano.nome || formClientePlano.preco <= 0) {
      return msg("erro", "Nome e preço obrigatórios");
    }
    try {
      const plano: ClientePlano = {
        ...formClientePlano,
        id:        editandoClientePlano?.id,
        clienteId: clienteSelecionado.id,
        entrada:   Math.round((formClientePlano.preco / 2) * 100) / 100,
        itens:     formClientePlano.itens.filter(i => i.trim()),
        brinde:    formClientePlano.brinde?.trim() || null,
        ordem:     editandoClientePlano?.ordem ?? clientePlanos.length + 1,
      };
      const res = await fetch("/api/clientes/planos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plano),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      msg("ok", editandoClientePlano ? "Plano atualizado!" : "Plano adicionado!");
      setModalClientePlano(false);
      setEditandoClientePlano(null);
      setFormClientePlano({ ...PLANO_VAZIO });
      await carregarClientePlanos(clienteSelecionado.id);
    } catch (e: unknown) { msg("erro", e instanceof Error ? e.message : "Erro"); }
  };

  const excluirClientePlano = async (id: number) => {
    if (!clienteSelecionado || !confirm("Excluir este plano?")) return;
    try {
      await fetch("/api/clientes/planos", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      msg("ok", "Plano excluído!");
      await carregarClientePlanos(clienteSelecionado.id);
    } catch { msg("erro", "Erro ao excluir plano"); }
  };

  // ── Planos padrão CRUD ──────────────────────────────
  const salvarPlano = async () => {
    if (!formPlano.nome || formPlano.preco <= 0) return msg("erro", "Nome e preço obrigatórios");
    try {
      const plano: Plano = {
        ...formPlano,
        id:      editandoPlano?.id || formPlano.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,""),
        entrada: Math.round((formPlano.preco/2)*100)/100,
        itens:   formPlano.itens.filter(i=>i.trim()),
        brinde:  formPlano.brinde?.trim()||null,
        ordem:   editandoPlano?.ordem ?? planos.length+1,
      };
      const res = await fetch("/api/planos", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(plano) });
      if (!res.ok) throw new Error((await res.json()).error);
      msg("ok", editandoPlano ? "Plano atualizado!" : "Plano criado!");
      setModalPlano(false); setEditandoPlano(null); setFormPlano({...PLANO_VAZIO});
      await carregarPlanos();
    } catch (e: unknown) { msg("erro", e instanceof Error ? e.message : "Erro"); }
  };

  const excluirPlano = async (id: string) => {
    if (!confirm("Excluir este plano padrão?")) return;
    try {
      await fetch("/api/planos", { method:"DELETE", headers:{"Content-Type":"application/json"}, body:JSON.stringify({id}) });
      msg("ok","Plano excluído!"); await carregarPlanos();
    } catch { msg("erro","Erro ao excluir"); }
  };

  // ── Render ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0404] text-[#f0ebe0]" style={{fontFamily:"'Jost',system-ui,sans-serif"}}>

      {/* Header */}
      <div className="bg-[#1a0808] border-b border-[#8B1A1A]/30 px-6 md:px-12 py-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <MonoSVG />
          <div>
            <h1 className="font-display text-[#f0ebe0] text-xl font-light" style={{fontFamily:"'Cormorant Garamond',serif"}}>Nessart Design</h1>
            <p className="text-[#D4C4A8]/40 text-xs tracking-widest uppercase">Painel Admin</p>
          </div>
        </div>
        <button onClick={async () => { await fetch("/api/auth",{method:"DELETE"}); window.location.href="/login"; }}
          className="text-[#D4C4A8]/40 hover:text-[#f0ebe0] text-xs border border-[#8B1A1A]/40 px-4 py-2 hover:border-[#D4C4A8]/30 transition-colors uppercase tracking-wider">
          Sair
        </button>
      </div>

      {sucesso && <div className="bg-green-900/40 border-b border-green-700/40 px-8 py-3 text-green-300 text-sm">✓ {sucesso}</div>}
      {erro    && <div className="bg-red-900/40 border-b border-red-700/40 px-8 py-3 text-red-300 text-sm">⚠ {erro}</div>}

      {/* Tabs */}
      <div className="border-b border-[#8B1A1A]/20 px-6 md:px-12 flex">
        {([["clientes","👥 Clientes"],["planos","💎 Planos Padrão"]] as [Aba,string][]).map(([a,l]) => (
          <button key={a} onClick={() => setAba(a)}
            className={`px-6 py-4 text-sm tracking-wider uppercase transition-colors border-b-2 -mb-px ${aba===a?"border-[#f0ebe0] text-[#f0ebe0]":"border-transparent text-[#D4C4A8]/40 hover:text-[#D4C4A8]/70"}`}>
            {l}
          </button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* ══ ABA CLIENTES ══ */}
        {aba === "clientes" && <>
          {/* Criar cliente */}
          <div className="bg-[#150606] border border-[#8B1A1A]/30 p-6">
            <h2 className="font-display text-[#f0ebe0] text-xl mb-5" style={{fontFamily:"'Cormorant Garamond',serif"}}>
              ✨ Nova Proposta
            </h2>
            <form onSubmit={criarCliente} className="flex gap-3">
              <input type="text" value={novoNome} onChange={e => setNovoNome(e.target.value)}
                placeholder="Nome do cliente — ex: Ana Clara Souza"
                className="flex-1 bg-[#0a0404] border border-[#8B1A1A]/40 px-4 py-3 text-sm text-[#f0ebe0] placeholder:text-[#f0ebe0]/20 focus:outline-none focus:border-[#8B1A1A]/80 transition-colors" />
              <Btn type="submit" disabled={criandoCliente} primary>
                {criandoCliente ? "Criando..." : "Criar →"}
              </Btn>
            </form>
          </div>

          {/* Lista clientes */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-[#f0ebe0] text-2xl font-light" style={{fontFamily:"'Cormorant Garamond',serif"}}>
                Clientes ({clientes.length})
              </h2>
              <Btn sm onClick={carregarClientes}>↻</Btn>
            </div>

            {clientesLoading ? <p className="text-[#D4C4A8]/40 text-sm">Carregando...</p>
            : clientes.length === 0 ? <p className="text-[#D4C4A8]/40 text-sm">Nenhum cliente ainda.</p>
            : <div className="space-y-3">
                {clientes.map(c => (
                  <div key={c.id} className="bg-[#150606] border border-[#8B1A1A]/20 p-5 hover:border-[#8B1A1A]/40 transition-colors">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <span className="text-[#D4C4A8]/30 text-xs font-mono">#{c.id}</span>
                          <p className="font-display text-[#f0ebe0] text-lg" style={{fontFamily:"'Cormorant Garamond',serif"}}>{c.nome}</p>
                        </div>
                        <code className="text-[#D4C4A8]/30 text-xs break-all block">{c.url}</code>
                        <p className="text-[#D4C4A8]/25 text-xs mt-1">
                          {new Date(c.criadoEm).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-wrap flex-shrink-0">
                        <a href={c.url} target="_blank" rel="noopener noreferrer"><Btn sm>Ver →</Btn></a>
                        <Btn sm onClick={() => navigator.clipboard.writeText(c.url)}>📋</Btn>
                        <Btn sm onClick={() => navigator.clipboard.writeText(`Oi ${c.nome.split(" ")[0]}! 🌹\n\nCriei uma proposta exclusiva para você:\n\n${c.url}\n\n— Nessart Design`)}>💬</Btn>
                        <Btn sm onClick={() => abrirClientePlanos(c)}>🎯 Planos</Btn>
                        <Btn sm danger onClick={() => excluirCliente(c.id, c.nome)}>✕</Btn>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            }
          </div>
        </>}

        {/* ══ ABA PLANOS PADRÃO ══ */}
        {aba === "planos" && <>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[#f0ebe0] text-2xl font-light" style={{fontFamily:"'Cormorant Garamond',serif"}}>
              Planos Padrão ({planos.length})
            </h2>
            <Btn primary onClick={() => { setEditandoPlano(null); setFormPlano({...PLANO_VAZIO}); setModalPlano(true); }}>
              + Novo
            </Btn>
          </div>
          <p className="text-[#D4C4A8]/40 text-xs">Usados quando o cliente não tem planos personalizados.</p>

          {planosLoading ? <p className="text-[#D4C4A8]/40 text-sm">Carregando...</p>
          : planos.length === 0 ? <p className="text-[#D4C4A8]/40 text-sm">Nenhum plano.</p>
          : <div className="space-y-4">
              {planos.map(p => (
                <PlanoCard key={p.id} plano={p}
                  onEdit={() => { setEditandoPlano(p); setFormPlano({nome:p.nome,tagline:p.tagline,preco:p.preco,prazo:p.prazo,destaque:p.destaque,itens:[...p.itens],brinde:p.brinde}); setModalPlano(true); }}
                  onDelete={() => excluirPlano(p.id)} />
              ))}
            </div>
          }
        </>}
      </div>

      {/* ══ MODAL PLANOS DO CLIENTE ══ */}
      {clienteSelecionado && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#150606] border border-[#8B1A1A]/40 my-8">
            <div className="bg-[#1a0808] px-7 py-5 flex items-center justify-between border-b border-[#8B1A1A]/30">
              <div>
                <h3 className="font-display text-[#f0ebe0] text-2xl font-light" style={{fontFamily:"'Cormorant Garamond',serif"}}>
                  {clienteSelecionado.nome}
                </h3>
                <p className="text-[#D4C4A8]/40 text-xs mt-0.5">
                  {clientePlanos.length === 0 ? "Usando planos padrão" : `${clientePlanos.length} plano(s) personalizado(s)`}
                </p>
              </div>
              <button onClick={fecharClientePlanos} className="text-[#D4C4A8]/40 hover:text-[#f0ebe0] text-xl">✕</button>
            </div>

            <div className="p-7 space-y-6">

              {/* Planos existentes */}
              {clientePlanosLoading ? <p className="text-[#D4C4A8]/40 text-sm">Carregando...</p>
              : clientePlanos.length === 0 ? (
                <div className="border border-[#D4C4A8]/8 bg-[#0f0303] p-5 text-center">
                  <p className="text-[#D4C4A8]/40 text-sm mb-1">Sem planos personalizados</p>
                  <p className="text-[#D4C4A8]/25 text-xs">Este cliente está vendo os planos padrão</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {clientePlanos.map(p => (
                    <div key={p.id} className="border border-[#D4C4A8]/10 bg-[#0f0303] p-4 flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-display text-[#f0ebe0] text-lg" style={{fontFamily:"'Cormorant Garamond',serif"}}>{p.nome}</span>
                          {p.destaque && <span className="bg-[#8B1A1A] text-[#f0ebe0] text-xs px-2 py-0.5">Destaque</span>}
                        </div>
                        <p className="text-[#D4C4A8]/40 text-xs mb-1">{p.tagline}</p>
                        <p className="text-[#D4C4A8]/60 text-sm font-semibold">R$ {p.preco.toLocaleString("pt-BR")}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Btn sm onClick={() => { setEditandoClientePlano(p); setFormClientePlano({nome:p.nome,tagline:p.tagline,preco:p.preco,prazo:p.prazo,destaque:p.destaque,itens:[...p.itens],brinde:p.brinde}); setModalClientePlano(true); }}>✏</Btn>
                        <Btn sm danger onClick={() => p.id && excluirClientePlano(p.id)}>✕</Btn>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Ações */}
              <div className="border-t border-[#D4C4A8]/8 pt-5 space-y-3">
                <p className="text-[#D4C4A8]/40 text-xs uppercase tracking-widest">Adicionar plano</p>
                <div className="flex gap-2 flex-wrap">
                  <Btn primary onClick={() => { setEditandoClientePlano(null); setFormClientePlano({...PLANO_VAZIO}); setModalClientePlano(true); }}>
                    + Criar do zero
                  </Btn>
                  {planos.map(p => (
                    <Btn key={p.id} sm onClick={() => copiarDePadrao(p)}>
                      Copiar "{p.nome}"
                    </Btn>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL FORM PLANO CLIENTE ══ */}
      {modalClientePlano && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#150606] border border-[#8B1A1A]/40 my-8">
            <div className="bg-[#1a0808] px-7 py-5 flex items-center justify-between border-b border-[#8B1A1A]/30">
              <h3 className="font-display text-[#f0ebe0] text-xl font-light" style={{fontFamily:"'Cormorant Garamond',serif"}}>
                {editandoClientePlano ? "Editar plano" : "Novo plano personalizado"}
              </h3>
              <button onClick={() => setModalClientePlano(false)} className="text-[#D4C4A8]/40 hover:text-[#f0ebe0]">✕</button>
            </div>
            <PlanoForm
              form={formClientePlano}
              setForm={setFormClientePlano}
              novoItem={novoItemCliente}
              setNovoItem={setNovoItemCliente}
              onSave={salvarClientePlano}
              onCancel={() => setModalClientePlano(false)}
              editando={!!editandoClientePlano}
            />
          </div>
        </div>
      )}

      {/* ══ MODAL PLANO PADRÃO ══ */}
      {modalPlano && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#150606] border border-[#8B1A1A]/40 my-8">
            <div className="bg-[#1a0808] px-7 py-5 flex items-center justify-between border-b border-[#8B1A1A]/30">
              <h3 className="font-display text-[#f0ebe0] text-xl font-light" style={{fontFamily:"'Cormorant Garamond',serif"}}>
                {editandoPlano ? `Editar — ${editandoPlano.nome}` : "Novo Plano Padrão"}
              </h3>
              <button onClick={() => setModalPlano(false)} className="text-[#D4C4A8]/40 hover:text-[#f0ebe0]">✕</button>
            </div>
            <PlanoForm
              form={formPlano}
              setForm={setFormPlano}
              novoItem={novoItem}
              setNovoItem={setNovoItem}
              onSave={salvarPlano}
              onCancel={() => setModalPlano(false)}
              editando={!!editandoPlano}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Componente PlanoCard ─────────────────────
function PlanoCard({ plano, onEdit, onDelete }: { plano: Plano; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="bg-[#150606] border border-[#8B1A1A]/20 p-6 hover:border-[#8B1A1A]/40 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <span className="font-display text-[#f0ebe0] text-2xl font-light" style={{fontFamily:"'Cormorant Garamond',serif"}}>{plano.nome}</span>
            {plano.destaque && <span className="bg-[#8B1A1A] text-[#f0ebe0] text-xs px-2 py-0.5">Mais escolhido</span>}
          </div>
          <p className="text-[#D4C4A8]/40 text-sm mb-2">{plano.tagline}</p>
          <div className="flex gap-5 text-sm flex-wrap">
            <span className="text-[#f0ebe0] font-semibold">R$ {plano.preco.toLocaleString("pt-BR")}</span>
            <span className="text-[#D4C4A8]/40">Entrada R$ {plano.entrada.toLocaleString("pt-BR")}</span>
            <span className="text-[#D4C4A8]/40">⏱ {plano.prazo}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          <Btn sm onClick={onEdit}>✏ Editar</Btn>
          <Btn sm danger onClick={onDelete}>✕ Excluir</Btn>
        </div>
      </div>
    </div>
  );
}

// ── Componente PlanoForm ─────────────────────
function PlanoForm({ form, setForm, novoItem, setNovoItem, onSave, onCancel, editando }: {
  form: typeof PLANO_VAZIO;
  setForm: (f: typeof PLANO_VAZIO | ((p: typeof PLANO_VAZIO) => typeof PLANO_VAZIO)) => void;
  novoItem: string; setNovoItem: (v: string) => void;
  onSave: () => void; onCancel: () => void; editando: boolean;
}) {
  const addItem = () => {
    if (!novoItem.trim()) return;
    setForm(p => ({ ...p, itens: [...p.itens, novoItem.trim()] }));
    setNovoItem("");
  };

  return (
    <div className="p-7 space-y-5">
      <Field label="Nome *">
        <Input value={form.nome} onChange={v => setForm(p=>({...p,nome:v}))} placeholder="Ex: Profissional" />
      </Field>
      <Field label="Tagline">
        <Input value={form.tagline} onChange={v => setForm(p=>({...p,tagline:v}))} placeholder="Frase curta abaixo do nome" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Preço (R$) *">
          <Input type="number" value={String(form.preco||"")} onChange={v => setForm(p=>({...p,preco:Number(v)}))} placeholder="597.00" />
          {form.preco > 0 && <p className="text-[#D4C4A8]/30 text-xs mt-1">Entrada: R$ {(form.preco/2).toLocaleString("pt-BR",{minimumFractionDigits:2})}</p>}
        </Field>
        <Field label="Prazo">
          <Input value={form.prazo} onChange={v => setForm(p=>({...p,prazo:v}))} placeholder="15 a 20 dias úteis" />
        </Field>
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <div onClick={() => setForm(p=>({...p,destaque:!p.destaque}))}
          className={`w-10 h-5 rounded-full relative flex-shrink-0 transition-colors cursor-pointer ${form.destaque?"bg-[#8B1A1A]":"bg-[#1a0808] border border-[#8B1A1A]/40"}`}>
          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-[#f0ebe0] transition-transform ${form.destaque?"translate-x-5":"translate-x-0.5"}`} />
        </div>
        <span className="text-[#D4C4A8]/60 text-sm">Marcar como "Mais escolhido"</span>
      </label>
      <Field label="Itens inclusos *">
        <div className="space-y-2 mb-2">
          {form.itens.map((item,i) => (
            <div key={i} className="flex gap-2">
              <Input value={item} onChange={v => setForm(p=>({...p,itens:p.itens.map((it,idx)=>idx===i?v:it)}))} placeholder={`Item ${i+1}`} />
              <button onClick={() => setForm(p=>({...p,itens:p.itens.filter((_,idx)=>idx!==i)}))}
                className="text-[#D4C4A8]/30 hover:text-red-400 border border-[#8B1A1A]/30 px-3 transition-colors">✕</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={novoItem} onChange={setNovoItem} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addItem();}}} placeholder="Novo item — Enter para adicionar" />
          <Btn sm onClick={addItem}>+</Btn>
        </div>
      </Field>
      <Field label="Brinde" hint="Deixe vazio se não houver">
        <Input value={form.brinde??""} onChange={v => setForm(p=>({...p,brinde:v||null}))} placeholder="+2 peças de papelaria" />
      </Field>
      <div className="flex gap-3 pt-2">
        <Btn primary onClick={onSave} className="flex-1">{editando?"Salvar":"Criar plano"}</Btn>
        <Btn onClick={onCancel}>Cancelar</Btn>
      </div>
    </div>
  );
}

// ── UI helpers ───────────────────────────────
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[#D4C4A8]/50 text-xs tracking-[0.12em] uppercase block mb-1.5">
        {label}{hint && <span className="text-[#D4C4A8]/25 normal-case tracking-normal ml-2 text-xs">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type="text", onKeyDown }: {
  value: string; onChange: (v:string)=>void; placeholder?: string; type?: string;
  onKeyDown?: (e:React.KeyboardEvent) => void;
}) {
  return (
    <input type={type} value={value} onChange={e=>onChange(e.target.value)}
      placeholder={placeholder} onKeyDown={onKeyDown}
      className="w-full bg-[#0a0404] border border-[#8B1A1A]/40 px-4 py-3 text-sm text-[#f0ebe0] placeholder:text-[#f0ebe0]/20 focus:outline-none focus:border-[#8B1A1A]/80 transition-colors" />
  );
}

function Btn({ children, onClick, type="button", disabled, primary, danger, sm, className="" }: {
  children: React.ReactNode; onClick?: ()=>void; type?: "button"|"submit";
  disabled?: boolean; primary?: boolean; danger?: boolean; sm?: boolean; className?: string;
}) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`font-semibold tracking-wider uppercase transition-all disabled:opacity-50 whitespace-nowrap
        ${sm?"text-xs px-3 py-1.5":"text-sm px-5 py-3"}
        ${primary?"bg-[#f0ebe0] text-[#5C0A0A] hover:bg-[#D4C4A8]"
          :danger?"border border-red-800/40 text-red-400/70 hover:border-red-600 hover:text-red-400"
          :"border border-[#8B1A1A]/40 text-[#D4C4A8]/60 hover:border-[#D4C4A8]/30 hover:text-[#f0ebe0]"}
        ${className}`}>
      {children}
    </button>
  );
}

function MonoSVG() {
  return (
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="22" stroke="#D4C4A8" strokeWidth="1" opacity="0.5"/>
      <path d="M16 12 Q24 8 32 12 Q28 24 24 28 Q20 24 16 12Z" stroke="#D4C4A8" strokeWidth="1.2" fill="none"/>
      <path d="M16 36 Q24 40 32 36 Q28 24 24 20 Q20 24 16 36Z" stroke="#D4C4A8" strokeWidth="1.2" fill="none"/>
    </svg>
  );
}
