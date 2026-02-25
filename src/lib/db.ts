/**
 * lib/db.ts — Supabase JS SDK
 */

import { getSupabase } from "./supabase";
import bcrypt from "bcryptjs";

// ── Types ────────────────────────────────────
export interface Plano {
  id:       string;
  nome:     string;
  tagline:  string;
  preco:    number;
  entrada:  number;
  prazo:    string;
  destaque: boolean;
  itens:    string[];
  brinde:   string | null;
  ordem:    number;
}

export interface Cliente {
  id:       number;
  slug:     string;
  nome:     string;
  url:      string;
  ativa:    boolean;
  criadoEm: string;
}

export interface ClientePlano {
  id?:        number;
  clienteId:  number;
  nome:       string;
  tagline:    string;
  preco:      number;
  entrada:    number;
  prazo:      string;
  destaque:   boolean;
  itens:      string[];
  brinde:     string | null;
  ordem:      number;
}

// ════════════════════════════════════════════
//  USUÁRIOS
// ════════════════════════════════════════════
export async function verificarCredenciais(login: string, senha: string): Promise<boolean> {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("usuarios")
    .select("senha_hash")
    .eq("login", login)
    .single();

  if (error || !data) return false;
  const hash = data.senha_hash.replace(/^\$2b\$/, "$2a$");
  return bcrypt.compareSync(senha, hash);
}

// ════════════════════════════════════════════
//  PLANOS PADRÃO
// ════════════════════════════════════════════
export async function dbGetPlanos(): Promise<Plano[]> {
  const sb = getSupabase();
  const { data, error } = await sb
    .from("planos")
    .select("*")
    .order("ordem", { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []).map(rowToPlano);
}

export async function dbSavePlano(plano: Plano): Promise<void> {
  const sb = getSupabase();
  if (!plano.ordem) {
    const { count } = await sb.from("planos").select("*", { count: "exact", head: true });
    plano.ordem = (count ?? 0) + 1;
  }
  const { error } = await sb.from("planos").upsert(planoToRow(plano), { onConflict: "id" });
  if (error) throw new Error(error.message);
}

export async function dbDeletePlano(id: string): Promise<void> {
  const { error } = await getSupabase().from("planos").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ════════════════════════════════════════════
//  CLIENTES
// ════════════════════════════════════════════
export async function dbGetClientes(): Promise<Cliente[]> {
  const { data, error } = await getSupabase()
    .from("clientes")
    .select("*")
    .order("criado_em", { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map(rowToCliente);
}

export async function dbGetClienteById(id: number): Promise<Cliente | null> {
  const { data, error } = await getSupabase()
    .from("clientes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return rowToCliente(data);
}

export async function dbGetClienteBySlug(slug: string): Promise<Cliente | null> {
  const { data, error } = await getSupabase()
    .from("clientes")
    .select("*")
    .eq("slug", slug)
    .eq("ativa", true)
    .single();

  if (error || !data) return null;
  return rowToCliente(data);
}

export async function dbSaveCliente(p: { slug: string; nome: string; url: string }): Promise<Cliente> {
  const { data, error } = await getSupabase()
    .from("clientes")
    .upsert({ slug: p.slug, nome: p.nome, url: p.url, ativa: true }, { onConflict: "slug" })
    .select()
    .single();

  if (error || !data) throw new Error(error?.message || "Erro ao salvar cliente");
  return rowToCliente(data);
}

export async function dbDeleteCliente(id: number): Promise<void> {
  const { error } = await getSupabase().from("clientes").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ════════════════════════════════════════════
//  PLANOS DO CLIENTE
// ════════════════════════════════════════════
export async function dbGetClientePlanos(clienteId: number): Promise<ClientePlano[]> {
  const { data, error } = await getSupabase()
    .from("cliente_planos")
    .select("*")
    .eq("cliente_id", clienteId)
    .order("ordem", { ascending: true });

  if (error) throw new Error(error.message);
  return (data || []).map(rowToClientePlano);
}

export async function dbSaveClientePlano(plano: ClientePlano): Promise<void> {
  const sb = getSupabase();
  const row = {
    cliente_id: plano.clienteId,
    nome:       plano.nome,
    tagline:    plano.tagline,
    preco:      plano.preco,
    entrada:    Math.round((plano.preco / 2) * 100) / 100,
    prazo:      plano.prazo,
    destaque:   plano.destaque,
    itens:      plano.itens,
    brinde:     plano.brinde,
    ordem:      plano.ordem,
  };

  if (plano.id) {
    const { error } = await sb.from("cliente_planos").update(row).eq("id", plano.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await sb.from("cliente_planos").insert(row);
    if (error) throw new Error(error.message);
  }
}

export async function dbDeleteClientePlano(id: number): Promise<void> {
  const { error } = await getSupabase().from("cliente_planos").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function dbDeleteAllClientePlanos(clienteId: number): Promise<void> {
  const { error } = await getSupabase().from("cliente_planos").delete().eq("cliente_id", clienteId);
  if (error) throw new Error(error.message);
}

/**
 * Retorna os planos para exibir na proposta do cliente:
 * - Se tiver planos personalizados → usa eles
 * - Senão → usa os planos padrão
 */
export async function dbGetPlanosParaCliente(clienteId: number): Promise<Plano[]> {
  const personalizados = await dbGetClientePlanos(clienteId);

  if (personalizados.length > 0) {
    return personalizados.map(p => ({
      id:       String(p.id),
      nome:     p.nome,
      tagline:  p.tagline,
      preco:    p.preco,
      entrada:  p.entrada,
      prazo:    p.prazo,
      destaque: p.destaque,
      itens:    p.itens,
      brinde:   p.brinde,
      ordem:    p.ordem,
    }));
  }

  return dbGetPlanos();
}

// ── Helpers ──────────────────────────────────
function rowToPlano(r: Record<string, unknown>): Plano {
  return {
    id:       r.id as string,
    nome:     r.nome as string,
    tagline:  r.tagline as string,
    preco:    Number(r.preco),
    entrada:  Number(r.entrada),
    prazo:    r.prazo as string,
    destaque: Boolean(r.destaque),
    itens:    Array.isArray(r.itens) ? r.itens as string[] : JSON.parse(r.itens as string),
    brinde:   r.brinde as string | null,
    ordem:    r.ordem as number,
  };
}

function planoToRow(p: Plano) {
  return {
    id: p.id, nome: p.nome, tagline: p.tagline,
    preco: p.preco, entrada: p.entrada, prazo: p.prazo,
    destaque: p.destaque, itens: p.itens, brinde: p.brinde, ordem: p.ordem,
  };
}

function rowToCliente(r: Record<string, unknown>): Cliente {
  return {
    id:       r.id as number,
    slug:     r.slug as string,
    nome:     r.nome as string,
    url:      r.url as string,
    ativa:    Boolean(r.ativa),
    criadoEm: r.criado_em as string,
  };
}

function rowToClientePlano(r: Record<string, unknown>): ClientePlano {
  return {
    id:        r.id as number,
    clienteId: r.cliente_id as number,
    nome:      r.nome as string,
    tagline:   r.tagline as string,
    preco:     Number(r.preco),
    entrada:   Number(r.entrada),
    prazo:     r.prazo as string,
    destaque:  Boolean(r.destaque),
    itens:     Array.isArray(r.itens) ? r.itens as string[] : JSON.parse(r.itens as string),
    brinde:    r.brinde as string | null,
    ordem:     r.ordem as number,
  };
}
