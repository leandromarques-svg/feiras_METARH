-- Tabela de usuários/perfis para autenticação
CREATE TABLE IF NOT EXISTS usuarios (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha_hash TEXT NOT NULL,
    perfil TEXT NOT NULL, -- exemplo: 'admin', 'participante', 'organizador'
    criado_em TIMESTAMP DEFAULT now()
);

-- Índice para busca rápida por email
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);