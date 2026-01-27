-- SQL para adicionar a coluna 'area' na tabela 'participantes'
-- Execute este script no SQL Editor do Supabase

ALTER TABLE participantes 
ADD COLUMN IF NOT EXISTS area TEXT;

-- Comentário: Esta coluna armazenará a área/departamento do participante (ex: "Comercial", "Marketing")
