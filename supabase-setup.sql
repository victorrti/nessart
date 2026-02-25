-- ============================================================
-- NESSART DESIGN — Setup do banco no Supabase
-- Execute no painel: SQL Editor → New Query → Cole e rode
-- ============================================================

-- ── Tabela de usuários ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuarios (
  id         BIGSERIAL PRIMARY KEY,
  login      TEXT UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  criado_em  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Tabela de planos ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS planos (
  id            TEXT PRIMARY KEY,
  nome          TEXT NOT NULL,
  tagline       TEXT NOT NULL DEFAULT '',
  preco         NUMERIC(10,2) NOT NULL,
  entrada       NUMERIC(10,2) NOT NULL,
  prazo         TEXT NOT NULL DEFAULT '15 a 20 dias úteis',
  destaque      BOOLEAN NOT NULL DEFAULT FALSE,
  itens         JSONB NOT NULL DEFAULT '[]',
  brinde        TEXT,
  ordem         INTEGER NOT NULL DEFAULT 0,
  criado_em     TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ── Tabela de páginas de clientes ───────────────────────────
CREATE TABLE IF NOT EXISTS paginas (
  slug      TEXT PRIMARY KEY,
  nome      TEXT NOT NULL,
  url       TEXT NOT NULL,
  ativa     BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- ── Desabilitar Row Level Security (acesso via service_role) ─
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE planos   DISABLE ROW LEVEL SECURITY;
ALTER TABLE paginas  DISABLE ROW LEVEL SECURITY;

-- ── Usuário admin padrão ─────────────────────────────────────
-- Senha: Nes745Ceu@ (hash bcrypt)
INSERT INTO usuarios (login, senha_hash)
VALUES (
  'nessart',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHuu'
)
ON CONFLICT (login) DO NOTHING;

-- ── Planos padrão ────────────────────────────────────────────
INSERT INTO planos (id, nome, tagline, preco, entrada, prazo, destaque, itens, brinde, ordem)
VALUES
(
  'essencial',
  'Essencial',
  'Para quem está plantando a semente da sua marca',
  447.00, 223.50,
  '15 a 20 dias úteis',
  FALSE,
  '["Logotipo completo (principal, horizontal, redondo e alternativo)","Ícone exclusivo da marca","Marca d''água (preta, branca e colorida)","Paleta de cores com códigos para impressão e digital","Tipografia (nomes das fontes + arquivos)","Estampa exclusiva da marca"]',
  NULL,
  1
),
(
  'profissional',
  'Profissional',
  'Para marcas que querem presença e aplicação real',
  597.00, 298.50,
  '15 a 20 dias úteis',
  TRUE,
  '["Logotipo completo (principal, horizontal, redondo e alternativo)","Ícone exclusivo da marca","Marca d''água (preta, branca e colorida)","Paleta de cores com códigos para impressão e digital","Tipografia (nomes das fontes + arquivos)","Estampa exclusiva da marca"]',
  '+2 peças de papelaria personalizada (recibo, ficha de atendimento, assinatura de e-mail…)',
  2
),
(
  'autoridade',
  'Autoridade',
  'Para marcas de alto impacto que dominam cada ponto de contato',
  897.00, 448.50,
  '15 a 25 dias úteis',
  FALSE,
  '["Logotipo completo (principal, horizontal, redondo e alternativo)","Ícone exclusivo da marca","Marca d''água (preta, branca e colorida)","Paleta de cores com códigos para impressão e digital","Tipografia (nomes das fontes + arquivos)","Estampa exclusiva da marca"]',
  '+6 peças de papelaria personalizada (recibo, ficha, atestados, receitas, envelopes, assinatura de e-mail…)',
  3
)
ON CONFLICT (id) DO NOTHING;

-- ── Verificar resultado ──────────────────────────────────────
SELECT 'usuarios' as tabela, COUNT(*) as registros FROM usuarios
UNION ALL
SELECT 'planos',  COUNT(*) FROM planos
UNION ALL
SELECT 'paginas', COUNT(*) FROM paginas;
