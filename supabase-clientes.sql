-- ============================================================
-- NESSART — Migração: clientes com planos personalizados
-- Execute no SQL Editor do Supabase
-- ============================================================

-- ── Tabela de clientes ───────────────────────────────────────
-- Substitui a tabela "paginas" antiga
CREATE TABLE IF NOT EXISTS clientes (
  id          BIGSERIAL PRIMARY KEY,
  slug        TEXT NOT NULL,
  nome        TEXT NOT NULL,
  url         TEXT NOT NULL,
  ativa       BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(slug)
);

-- ── Planos personalizados por cliente ────────────────────────
-- Se cliente não tiver planos aqui, usa os planos padrão
CREATE TABLE IF NOT EXISTS cliente_planos (
  id          BIGSERIAL PRIMARY KEY,
  cliente_id  BIGINT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  nome        TEXT NOT NULL,
  tagline     TEXT NOT NULL DEFAULT '',
  preco       NUMERIC(10,2) NOT NULL,
  entrada     NUMERIC(10,2) NOT NULL,
  prazo       TEXT NOT NULL DEFAULT '15 a 20 dias úteis',
  destaque    BOOLEAN NOT NULL DEFAULT FALSE,
  itens       JSONB NOT NULL DEFAULT '[]',
  brinde      TEXT,
  ordem       INTEGER NOT NULL DEFAULT 0,
  criado_em   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Desabilitar RLS ──────────────────────────────────────────
ALTER TABLE clientes       DISABLE ROW LEVEL SECURITY;
ALTER TABLE cliente_planos DISABLE ROW LEVEL SECURITY;

-- ── Índices ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_clientes_slug       ON clientes(slug);
CREATE INDEX IF NOT EXISTS idx_cliente_planos_cid  ON cliente_planos(cliente_id);

-- ── Verificar ────────────────────────────────────────────────
SELECT 'clientes' as tabela, COUNT(*) as registros FROM clientes
UNION ALL
SELECT 'cliente_planos', COUNT(*) FROM cliente_planos;
