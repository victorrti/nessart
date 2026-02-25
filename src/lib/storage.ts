/**
 * lib/storage.ts
 * Persistência simples via arquivo JSON (local) ou variável de ambiente (Vercel/produção)
 */

import fs   from "fs";
import path from "path";

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
}

export interface PaginaCliente {
  slug:      string;
  nome:      string;
  url:       string;
  criadoEm: string;
}

export interface DB {
  planos:  Plano[];
  paginas: PaginaCliente[];
}

const DB_PATH = path.resolve(process.cwd(), "data", "db.json");

const PLANOS_DEFAULT: Plano[] = [
  {
    id:       "essencial",
    nome:     "Essencial",
    tagline:  "Para quem está plantando a semente da sua marca",
    preco:    447,
    entrada:  223.5,
    prazo:    "15 a 20 dias úteis",
    destaque: false,
    itens: [
      "Logotipo completo (principal, horizontal, redondo e alternativo)",
      "Ícone exclusivo da marca",
      "Marca d'água (preta, branca e colorida)",
      "Paleta de cores com códigos para impressão e digital",
      "Tipografia (nomes das fontes + arquivos)",
      "Estampa exclusiva da marca",
    ],
    brinde: null,
  },
  {
    id:       "profissional",
    nome:     "Profissional",
    tagline:  "Para marcas que querem presença e aplicação real",
    preco:    597,
    entrada:  298.5,
    prazo:    "15 a 20 dias úteis",
    destaque: true,
    itens: [
      "Logotipo completo (principal, horizontal, redondo e alternativo)",
      "Ícone exclusivo da marca",
      "Marca d'água (preta, branca e colorida)",
      "Paleta de cores com códigos para impressão e digital",
      "Tipografia (nomes das fontes + arquivos)",
      "Estampa exclusiva da marca",
    ],
    brinde: "+2 peças de papelaria personalizada (recibo, ficha de atendimento, assinatura de e-mail…)",
  },
  {
    id:       "autoridade",
    nome:     "Autoridade",
    tagline:  "Para marcas de alto impacto que dominam cada ponto de contato",
    preco:    897,
    entrada:  448.5,
    prazo:    "15 a 25 dias úteis",
    destaque: false,
    itens: [
      "Logotipo completo (principal, horizontal, redondo e alternativo)",
      "Ícone exclusivo da marca",
      "Marca d'água (preta, branca e colorida)",
      "Paleta de cores com códigos para impressão e digital",
      "Tipografia (nomes das fontes + arquivos)",
      "Estampa exclusiva da marca",
    ],
    brinde: "+6 peças de papelaria personalizada (recibo, ficha, atestados, receitas, envelopes, assinatura de e-mail…)",
  },
];

function readDB(): DB {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, "utf-8");
      return JSON.parse(raw) as DB;
    }
  } catch (e) {
    console.error("[storage] Erro ao ler db.json:", e);
  }
  return { planos: PLANOS_DEFAULT, paginas: [] };
}

function writeDB(db: DB): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

// ── Planos ────────────────────────────────────

export function getPlanos(): Plano[] {
  return readDB().planos;
}

export function savePlano(plano: Plano): void {
  const db = readDB();
  const idx = db.planos.findIndex((p) => p.id === plano.id);
  if (idx >= 0) db.planos[idx] = plano;
  else db.planos.push(plano);
  writeDB(db);
}

export function deletePlano(id: string): void {
  const db   = readDB();
  db.planos  = db.planos.filter((p) => p.id !== id);
  writeDB(db);
}

// ── Páginas ───────────────────────────────────

export function getPaginas(): PaginaCliente[] {
  return readDB().paginas;
}

export function savePagina(pagina: PaginaCliente): void {
  const db  = readDB();
  const idx = db.paginas.findIndex((p) => p.slug === pagina.slug);
  if (idx >= 0) db.paginas[idx] = pagina;
  else db.paginas.unshift(pagina);
  writeDB(db);
}

export function deletePagina(slug: string): void {
  const db   = readDB();
  db.paginas = db.paginas.filter((p) => p.slug !== slug);
  writeDB(db);
}
