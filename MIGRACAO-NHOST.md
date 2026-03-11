# 🚀 Guia de Migração - MongoDB para Nhost

## Visão Geral

Este documento descreve o processo de migração do sistema Mantes de MongoDB Atlas para Nhost (PostgreSQL + Hasura).

---

## 📋 Passo a Passo

### 1. Criar Conta no Nhost

1. Acesse https://console.nhost.io
2. Clique em **"Start for Free"**
3. Crie sua conta com GitHub/Google/Email
4. Crie um novo projeto:
   - Nome: `mantes`
   - Região: Escolha a mais próxima (us-east-1 para EUA)
   - Plano: Free (suficiente para desenvolvimento)

### 2. Obter Credenciais

No console do Nhost:

1. Vá em **Settings** → **API**
2. Copie as seguintes informações:
   - **GraphQL Endpoint**: `https://xxxxx.nhost.app/v1/graphql`
   - **Admin Secret**: (chave secreta)
   - **App ID**: (identificador do projeto)

### 3. Configurar Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite .env com suas credenciais
NHOST_SUBDOMAIN=seu-projeto
NHOST_REGION=us-east-1
NHOST_GRAPHQL_ENDPOINT=https://seu-projeto.nhost.app/v1/graphql
NHOST_ADMIN_SECRET=sua-admin-secret
```

### 4. Criar Tabelas no Hasura

1. No console do Nhost, vá em **Data**
2. Clique em **SQL** na barra lateral
3. Copie e cole o conteúdo de `nhost/sql/create-tables.sql`
4. Execute o SQL

**Ou use a interface visual:**

1. Vá em **Data** → **Create Table**
2. Crie a tabela `users`:
   - `id` (uuid, primary key, default: gen_random_uuid())
   - `email` (text, unique)
   - `nome` (text)
   - `lider` (boolean, default: true)
   - `created_at` (timestamptz, default: now())
   - `updated_at` (timestamptz, default: now())

3. Crie a tabela `orders`:
   - `id` (uuid, primary key, default: gen_random_uuid())
   - `numero` (text, unique)
   - `cliente_id` (text)
   - `cnpj` (text)
   - `nome_cliente` (text)
   - `telefone` (text)
   - `nome_tecnico` (text)
   - `lider` (text)
   - `email_lider` (text)
   - `tipo_solicitacao` (text)
   - `descricao` (text)
   - `status` (text, default: 'pending')
   - `observacoes` (jsonb, default: [])
   - `data_abertura` (timestamptz, default: now())
   - `data_fechamento` (timestamptz)
   - `arquivos` (jsonb, default: [])
   - `user_id` (uuid, foreign key → users.id)

### 5. Configurar Permissões (Hasura)

1. Vá em **Settings** → **Roles**
2. Para a role `user` (pública):
   - **users**: SELECT (apenas próprio usuário)
   - **orders**: SELECT, INSERT, UPDATE, DELETE

### 6. Configurar Storage

1. Vá em **Storage** → **Buckets**
2. Crie um bucket chamado `os-arquivos`
3. Configure as permissões:
   - Upload: autenticado
   - Download: público

### 7. Instalar Dependências

```bash
npm install
```

### 8. Rodar em Desenvolvimento

```bash
npm run dev
```

O sistema abrirá em http://localhost:5500

---

## 🔧 Primeiro Login

No primeiro acesso, você precisa criar um usuário:

1. Use o formulário de login
2. O Nhost Auth criará o usuário automaticamente
3. Use qualquer email/senha válidos

---

## 📊 Migração de Dados (Opcional)

Se você tem dados no MongoDB e quer migrar:

```javascript
// Script de migração (exemplo)
const mongoData = await mongodb.collection('oses').find().toArray();

for (const os of mongoData) {
  await graphqlRequest(`
    mutation InsertOrder($object: order_insert_input!) {
      insert_order_one(object: $object) { id }
    }
  `, {
    object: {
      numero: os.numero,
      cnpj: os.cnpj,
      nome_cliente: os.nomeCliente,
      // ... mapear campos
    }
  });
}
```

---

## 🚀 Deploy para Produção

### Vercel

1. Push para GitHub
2. Importe o projeto na Vercel
3. Adicione as variáveis de ambiente
4. Deploy automático

### Netlify

1. `npm run build`
2. Arraste a pasta `dist` para Netlify Drop
3. Configure variáveis de ambiente

---

## 🧪 Testar Integração

```bash
# Testar conexão GraphQL
curl -X POST https://seu-projeto.nhost.app/v1/graphql \
  -H "Content-Type: application/json" \
  -H "x-hasura-admin-secret: sua-admin-secret" \
  -d '{"query": "{ order { id numero } }"}'
```

---

## ⚠️ Problemas Comuns

### Erro de CORS
- Verifique se `FRONTEND_URL` está configurado corretamente
- No Nhost, vá em **Settings** → **CORS** e adicione seu domínio

### Erro de Autenticação
- Verifique se o token está sendo enviado no header `Authorization: Bearer <token>`
- Tokens expiram em 7 dias (configurável)

### Upload não funciona
- Verifique se o bucket `os-arquivos` existe
- Confira as permissões do bucket

---

## 📚 Recursos

- [Docs Nhost](https://docs.nhost.io)
- [Hasura GraphQL](https://hasura.io/docs/latest/graphql/core/)
- [Nhost JS SDK](https://docs.nhost.io/libraries/nhost-js)

---

**Dúvidas?** Consulte a documentação oficial ou abra uma issue.
