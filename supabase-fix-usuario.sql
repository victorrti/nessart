-- ============================================================
-- NESSART — Corrigir usuário admin com hash gerado pelo Postgres
-- Execute no SQL Editor do Supabase
-- ============================================================

-- Habilita extensão pgcrypto (já vem no Supabase, só ativa)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Remove usuário existente (se houver com hash errado)
DELETE FROM usuarios WHERE login = 'nessart';

-- Insere com hash correto gerado pelo próprio Postgres
INSERT INTO usuarios (login, senha_hash)
VALUES (
  'nessart',
  crypt('Nes745Ceu@', gen_salt('bf', 10))
);

-- Confirma que foi criado
SELECT login, LEFT(senha_hash, 20) || '...' as hash_preview, criado_em
FROM usuarios
WHERE login = 'nessart';
