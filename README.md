# Mantes — Sistema de Gestão de Manutenção

Sistema de abertura e gerenciamento de Ordens de Serviço (O.S.) para manutenção.

---

## 🚀 Stack Tecnológica

**Backend:**
- Node.js + Express
- PostgreSQL (Render)
- JWT (autenticação)
- Multer (upload de arquivos)

**Frontend:**
- HTML5, CSS3, JavaScript (vanilla)
- Design responsivo e moderno

**Deploy:**
- Render (backend + frontend + banco)

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
DATABASE_URL=postgresql://usuario:senha@host/mantes
JWT_SECRET=sua_chave_secreta
PORT=3000
```

### 3. Criar tabelas no banco

Execute o conteúdo de `database.sql` no seu PostgreSQL.

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

O sistema abrirá em http://localhost:3000

---

## 📁 Estrutura do Projeto

```
mantes/
├── server.js           # Backend Express + PostgreSQL
├── main.js             # Lógica do frontend
├── index.html          # Formulário de abertura de O.S.
├── lider.html          # Painel do líder
├── database.sql        # Script para criar tabelas
├── package.json        # Dependências
├── render.yaml         # Configuração Render
├── .env.example        # Modelo de variáveis
└── README.md
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
npm start          # Produção
npm run dev        # Desenvolvimento
```

---

## 🚀 Deploy no Render

### 1. Criar PostgreSQL

1. https://render.com → Login
2. **New +** → **PostgreSQL**
3. Nome: `mantesdb`, Region: Oregon, Plan: Free

### 2. Criar Tabelas

1. Dashboard do PostgreSQL → **SQL**
2. Cole o conteúdo de `database.sql`
3. Run

### 3. Deploy Backend

1. **New +** → **Web Service**
2. Conecte repositório `mantes`
3. Build: `npm install`, Start: `npm start`
4. Variáveis: `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV`

### 4. Deploy Frontend

1. **New +** → **Static Site**
2. Build: `echo "Sem build"`, Publish: `.`

**Guia completo:** `DEPLOY-RENDER.md`

---

## 🔐 Login

No primeiro acesso, use qualquer email/senha. O sistema cria o usuário automaticamente.

---

## 📦 Dependências

```json
{
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "jsonwebtoken": "^9.0.2",
  "multer": "^1.4.5-lts.1",
  "pg": "^8.11.3"
}
```

---

## 🎯 Funcionalidades

- ✅ PostgreSQL no Render
- ✅ Upload de arquivos (até 10MB)
- ✅ Autenticação JWT
- ✅ Status: Pendente, Aceita, Resolvida, Rejeitada
- ✅ Filtros e busca
- ✅ Observações/histórico
- ✅ Responsivo (mobile-first)

---

## ⚠️ Importante

- **Nunca commit o arquivo `.env`** no Git
- Use uma **JWT_SECRET** forte
- Backup do banco periodicamente

---

## 📝 Deploy Rápido

```bash
# 1. Render PostgreSQL
https://render.com → New PostgreSQL

# 2. Criar tabelas
database.sql → SQL tab

# 3. Deploy
Web Service + Static Site
```

---

**Desenvolvido com ❤️ | Powered by Render + PostgreSQL**
