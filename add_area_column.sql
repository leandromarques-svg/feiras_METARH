-- ============================================
-- IMPORTANTE: Execute este script no Supabase
-- ============================================
-- SQL para adicionar a coluna 'area' na tabela 'participantes'
-- Execute este script no SQL Editor do Supabase Dashboard

ALTER TABLE participantes 
ADD COLUMN IF NOT EXISTS area TEXT;

-- Comentário: Esta coluna armazenará a área/departamento do participante 
-- Exemplos: "Comercial", "Marketing", "Vendas", "RH", etc.

-- Após executar este script, a área dos participantes será salva corretamente no banco de dados.
