-- Nhost/Hasura Schema para Mantes

-- Tabela de Ordens de Serviço
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero varchar(50) UNIQUE NOT NULL,
  cliente_id varchar(50) NOT NULL,
  cnpj varchar(20),
  nome_cliente varchar(255),
  telefone varchar(50),
  nome_tecnico varchar(255),
  lider varchar(255),
  email_lider varchar(255),
  tipo_solicitacao varchar(100),
  descricao text,
  status varchar(50) DEFAULT 'pending',
  observacoes jsonb DEFAULT '[]'::jsonb,
  data_abertura timestamptz DEFAULT now(),
  data_fechamento timestamptz,
  arquivos jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de Usuários (extendendo auth.users do Nhost)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome varchar(255) NOT NULL,
  email varchar(255) UNIQUE NOT NULL,
  lider boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_numero ON orders(numero);
CREATE INDEX IF NOT EXISTS idx_orders_cnpj ON orders(cnpj);
CREATE INDEX IF NOT EXISTS idx_orders_data_abertura ON orders(data_abertura DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Permissões Hasura (segurança a nível de linha)
-- Estas serão configuradas via metadata do Hasura
