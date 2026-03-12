# Mantes — Sistema de Gestão de Manutenção

Sistema de abertura e gerenciamento de Ordens de Serviço (O.S.) para manutenção.

---

## 🚀 Stack Tecnológica

**Backend:**
- Netlify Functions (serverless)
- Neon PostgreSQL (serverless)
- JWT (autenticação)

**Frontend:**
- HTML5, CSS3, JavaScript (vanilla)
- Design responsivo e moderno

**Deploy:**
- Netlify (frontend + backend serverless)
- Neon (PostgreSQL serverless - não expira)

---

## ⚡ Início Rápido

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env` com sua conexão PostgreSQL:
```env
DATABASE_URL=postgresql://usuario:senha@host.neon.tech/mantes?sslmode=require
JWT_SECRET=sua_chave_secreta
NODE_ENV=production
```

### 3. Criar tabelas no banco

Execute o conteúdo de `database.sql` no seu PostgreSQL (Neon).

### 4. Rodar em desenvolvimento

```bash
# Com Netlify CLI (recomendado - inclui functions)
netlify dev

# Ou apenas frontend
npx serve .
```

O sistema abrirá em http://localhost:8888 (Netlify) ou http://localhost:3000

---

## 📁 Estrutura do Projeto

```
mantes/
├── netlify/
│   └── functions/
│       └── api.js          # Backend serverless
├── index.html              # Formulário de abertura de O.S.
├── lider.html              # Painel do líder
├── reset-senha.html        # Reset de senha
├── main.js                 # Lógica do frontend
├── database.sql            # Script para criar tabelas
├── netlify.toml            # Configuração Netlify
├── package.json            # Dependências
├── .env.example            # Modelo de variáveis
├── README.md               # Este arquivo
├── DEPLOY-NETLIFY.md       # Guia de deploy
└── PASSO-A-PASSO.md        # Guia detalhado passo a passo
```

---

## 🔌 API Endpoints

### Autenticação
```
POST /api/auth/login              - Login
POST /api/auth/change-password    - Alterar senha
```

### Ordens de Serviço
```
GET  /api/os                      - Listar todas
GET  /api/os/stats                - Estatísticas
GET  /api/os/next-number          - Próximo número
GET  /api/os/:id                  - Detalhes de uma OS
POST /api/os                      - Criar nova OS
PUT  /api/os/:id                  - Atualizar OS
DELETE /api/os/:id                - Remover OS
```

---

## 📊 Scripts

```bash
npm start          # Produção (não usado no Netlify)
netlify dev        # Desenvolvimento local com functions
```

---

## 🚀 Deploy (Netlify + Neon)

### 1. Criar Banco no Neon

1. https://neon.tech → Login com GitHub
2. **Create a project**
3. Nome: `mantes`, Region: Oregon
4. Copie a connection string (URI)

### 2. Criar Tabelas

1. Neon → SQL Editor
2. Cole o conteúdo de `database.sql`
3. Execute

### 3. Deploy no Netlify

1. https://netlify.com → Login com GitHub
2. **Add new site** → **Import an existing project**
3. Conecte repositório `mantes`
4. Configure:
   - **Build command**: `echo 'Sem build'`
   - **Publish directory**: `.`
5. Em **Environment variables**, adicione:
   - `DATABASE_URL` (connection string do Neon)
   - `JWT_SECRET`
   - `NODE_ENV=production`
6. **Deploy site**

**Guia completo:** `DEPLOY-NETLIFY.md` ou `PASSO-A-PASSO.md`

---

## 🔐 Login

No primeiro acesso, use qualquer email/senha. O sistema cria o usuário automaticamente.

---

## 📦 Dependências

```json
{
  "bcryptjs": "^2.4.3",
  "dotenv": "^16.3.1",
  "jsonwebtoken": "^9.0.2",
  "pg": "^8.11.3"
}
```

---

## 🎯 Funcionalidades

- ✅ PostgreSQL serverless (Neon)
- ✅ Autenticação JWT
- ✅ Status: Pendente, Aceita, Resolvida, Rejeitada
- ✅ Filtros e busca por CNPJ
- ✅ Observações/histórico
- ✅ Responsivo (mobile-first)
- ✅ Backend serverless (Netlify Functions)
- ✅ Não expira (Neon free tier)

---

## ⚠️ Importante

- **Nunca commit o arquivo `.env`** no Git
- Use uma **JWT_SECRET** forte
- Backup do banco periodicamente (Neon tem histórico)
- Netlify Functions tem limite de 10s de timeout

---

## 📝 Deploy Rápido

```bash
# 1. Criar banco no Neon
https://neon.tech → Create project

# 2. Criar tabelas
database.sql → SQL Editor

# 3. Deploy no Netlify
netlify deploy --prod
```

---

**Desenvolvido com ❤️ | Powered by Netlify + Neon**
