-- Script SQL para criar tabelas no PostgreSQL (Render)
-- Execute no dashboard do Render → PostgreSQL → SQL

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  lider BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Ordens de Serviço
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  numero VARCHAR(50) UNIQUE NOT NULL,
  cliente_id VARCHAR(100),
  cnpj VARCHAR(20),
  nome_cliente VARCHAR(255),
  telefone VARCHAR(50),
  nome_tecnico VARCHAR(255),
  lider VARCHAR(255),
  email_lider VARCHAR(255),
  tipo_solicitacao VARCHAR(100),
  descricao TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  observacoes JSONB DEFAULT '[]'::jsonb,
  data_abertura TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_fechamento TIMESTAMP WITH TIME ZONE,
  arquivos JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_numero ON orders(numero);
CREATE INDEX IF NOT EXISTS idx_orders_cnpj ON orders(cnpj);
CREATE INDEX IF NOT EXISTS idx_orders_data_abertura ON orders(data_abertura DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
