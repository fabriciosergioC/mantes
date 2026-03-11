-- SQL para criar as tabelas no PostgreSQL (Hasura)
-- Execute no Data tab do Hasura Console ou via Nhost CLI

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  nome text NOT NULL,
  lider boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de Ordens de Serviço
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text UNIQUE NOT NULL,
  cliente_id text,
  cnpj text,
  nome_cliente text,
  telefone text,
  nome_tecnico text,
  lider text,
  email_lider text,
  tipo_solicitacao text,
  descricao text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'resolved', 'rejected')),
  observacoes jsonb DEFAULT '[]'::jsonb,
  data_abertura timestamptz DEFAULT now(),
  data_fechamento timestamptz,
  arquivos jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_numero ON orders(numero);
CREATE INDEX IF NOT EXISTS idx_orders_cnpj ON orders(cnpj);
CREATE INDEX IF NOT EXISTS idx_orders_data_abertura ON orders(data_abertura DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
