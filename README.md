# Mantes — Sistema de Gestão de Manutenção 2.0

Sistema moderno de abertura e gerenciamento de Ordens de Serviço (O.S.) para manutenção, agora com **Nhost** (PostgreSQL + GraphQL + Auth + Storage).

---

## 🚀 Stack Tecnológica

**Frontend:**
- Vite (build tool)
- JavaScript ES6+ (módulos nativos)
- CSS Custom Properties

**Backend (Nhost):**
- PostgreSQL (banco de dados)
- Hasura GraphQL Engine (API)
- Nhost Auth (autenticação)
- Nhost Storage (arquivos)

**Deploy:**
- Vercel (frontend estático)
- Nhost Cloud (backend completo)

---

## ⚡ Início Rápido

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Nhost

1. Crie conta em https://console.nhost.io
2. Crie um projeto gratuito
3. Copie `.env.example` para `.env`
4. Preencha com suas credenciais do Nhost

### 3. Criar tabelas no Hasura

Execute o SQL em `nhost/sql/create-tables.sql` no console do Nhost (Data → SQL)

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

O sistema abrirá em http://localhost:5500

---

## 📁 Estrutura do Projeto

```
mantes/
├── nhost/                    # Configuração Nhost
│   ├── schema.graphql        # Schema GraphQL
│   ├── sql/
│   │   └── create-tables.sql # SQL para criar tabelas
│   └── graphql/
│       └── queries.md        # Queries e mutations
├── src/
│   ├── lib/
│   │   └── nhost.js          # Configuração do cliente Nhost
│   └── services/
│       ├── auth.js           # Serviço de autenticação
│       ├── os.js             # Serviço de Ordens de Serviço
│       └── upload.js         # Serviço de upload
├── index.html                # Formulário de abertura de O.S.
├── lider.html                # Painel do líder
├── main.js                   # Lógica do frontend
├── package.json
├── vite.config.js            # Configuração Vite
├── .env.example              # Modelo de variáveis de ambiente
└── README.md
```

---

## 🔌 API Endpoints (GraphQL)

### Autenticação

```graphql
# Login
mutation {
  login(email: "user@example.com", password: "senha") {
    accessToken
    user { id email displayName }
  }
}

# Registro
mutation {
  register(email: "user@example.com", password: "senha") {
    accessToken
    user { id email }
  }
}
```

### Ordens de Serviço

```graphql
# Listar todas
query {
  order(order_by: { data_abertura: desc }) {
    id numero status nome_cliente tipo_solicitacao
  }
}

# Criar nova
mutation {
  insert_order_one(object: {
    numero: "OS-01001"
    nome_cliente: "Cliente X"
    status: "pending"
  }) {
    id numero
  }
}

# Atualizar
mutation {
  update_order_by_pk(
    pk_columns: { id: "uuid-aqui" }
    _set: { status: "resolved" }
  ) {
    id status
  }
}
```

---

## 📊 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Vite dev server

# Build
npm run build        # Build para produção
npm run preview      # Preview do build

# Deploy
npm run deploy       # Build + deploy na Vercel
```

---

## 🔐 Login

No primeiro acesso, use o formulário de login. O Nhost Auth criará o usuário automaticamente.

---

## 🚀 Deploy para Produção

### Vercel (Recomendado)

1. Push para GitHub
2. Importe na Vercel
3. Adicione variáveis de ambiente do Nhost
4. Deploy!

**Guia completo:** `DEPLOY-VERCEL-NHOST.md`

### Migração

**Guia de migração do MongoDB:** `MIGRACAO-NHOST.md`

---

## 📚 Documentação

- `MIGRACAO-NHOST.md` - Guia de migração do MongoDB Atlas
- `DEPLOY-VERCEL-NHOST.md` - Deploy na Vercel
- `nhost/README.md` - Configuração do Nhost
- `nhost/graphql/queries.md` - Queries e mutations GraphQL

---

## 🔧 Variáveis de Ambiente

```env
NHOST_SUBDOMAIN=seu-projeto
NHOST_REGION=us-east-1
NHOST_GRAPHQL_ENDPOINT=https://seu-projeto.nhost.app/v1/graphql
NHOST_ADMIN_SECRET=sua-admin-secret
NHOST_AUTH_URL=https://seu-projeto.nhost.app/auth
NHOST_STORAGE_URL=https://seu-projeto.nhost.app/storage
FRONTEND_URL=http://localhost:5500
```

---

## 📦 Dependências

```json
{
  "@nhost/nhost-js": "^2.2.21",
  "vite": "^5.0.0",
  "vercel": "^32.0.0"
}
```

---

## 🎯 Funcionalidades

- ✅ Autenticação com Nhost Auth
- ✅ Banco de dados PostgreSQL na nuvem
- ✅ API GraphQL com Hasura
- ✅ Upload de arquivos (Nhost Storage)
- ✅ Status: Pendente, Enviada, Resolvida, Rejeitada
- ✅ Filtros e busca
- ✅ Observações/histórico
- ✅ Responsivo (mobile-first)

---

## ⚠️ Importante

- **Nunca commit o arquivo `.env`** no Git
- Em produção, configure CORS no Nhost para seu domínio
- Use HTTPS em produção

---

## 📝 Changelog

### v2.0.0 (Nhost)
- Migração de MongoDB para PostgreSQL
- API REST → GraphQL
- Autenticação própria → Nhost Auth
- Upload local → Nhost Storage
- Webpack → Vite

### v1.0.0 (MongoDB)
- Node.js + Express
- MongoDB Atlas
- API REST
- JWT Auth

---

**Desenvolvido com ❤️ | Powered by Nhost + Vercel**
