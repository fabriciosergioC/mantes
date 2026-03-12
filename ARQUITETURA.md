# 🏗️ Arquitetura do Sistema

## Como o Mantes Funciona

---

## Visão Geral

```
┌─────────────────────────────────────────────────────┐
│                  NETLIFY                            │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  Frontend (HTML/CSS/JS)                     │   │
│  │  - index.html                               │   │
│  │  - lider.html                               │   │
│  │  - reset-senha.html                         │   │
│  │  - main.js                                  │   │
│  └─────────────────────────────────────────────┘   │
│                    │                                │
│                    │ chama /api/*                   │
│                    ▼                                │
│  ┌─────────────────────────────────────────────┐   │
│  │  Netlify Functions (Backend)                │   │
│  │  - netlify/functions/api.js                 │   │
│  │                                             │   │
│  │  Rotas:                                     │   │
│  │  POST /api/auth/login                       │   │
│  │  POST /api/auth/change-password             │   │
│  │  GET  /api/os                               │   │
│  │  GET  /api/os/stats                         │   │
│  │  GET  /api/os/next-number                   │   │
│  │  GET  /api/os/:id                           │   │
│  │  POST /api/os                               │   │
│  │  PUT  /api/os/:id                           │   │
│  │  DELETE /api/os/:id                         │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                       │
                       │ conexão PostgreSQL
                       ▼
         ┌─────────────────────────┐
         │      NEON               │
         │   (PostgreSQL)          │
         │                         │
         │  Tabelas:               │
         │  - users                │
         │  - orders               │
         └─────────────────────────┘
```

---

## Componentes

### 1. Frontend (Netlify Static Site)

**Arquivos:**
- `index.html` - Formulário de criação de OS
- `lider.html` - Painel do líder
- `reset-senha.html` - Reset de senha
- `main.js` - Lógica do frontend

**Função:** Interface com o usuário

**Como acessa:**
```
https://seu-site.netlify.app
```

---

### 2. Backend (Netlify Functions)

**Arquivo:**
- `netlify/functions/api.js`

**Função:** API REST completa

**Características:**
- ✅ Serverless (não precisa de servidor)
- ✅ Escala automaticamente
- ✅ Paga apenas pelo uso (free tier generoso)
- ✅ Timeout: 10 segundos

**Como funciona:**
```javascript
// Quando alguém chama /api/os/stats
export const handler = async (event, context) => {
  // 1. Conecta no banco
  // 2. Executa query
  // 3. Retorna JSON
}
```

**Acesso:**
```
https://seu-site.netlify.app/api/os/stats
```

---

### 3. Banco de Dados (Neon PostgreSQL)

**Serviço:** Neon (PostgreSQL serverless)

**Tabelas:**
- `users` - Usuários do sistema
- `orders` - Ordens de serviço

**Características:**
- ✅ Serverless (escala automática)
- ✅ 0.5 GB grátis
- ✅ Não expira
- ✅ SSL obrigatório

**Conexão:**
```
postgresql://user:senha@ep-xxx.neon.tech/dbname?sslmode=require
```

---

## Fluxo de Requisição

### Exemplo: Login

```
1. Usuário preenche email/senha no index.html
         │
         ▼
2. main.js chama: POST /api/auth/login
         │
         ▼
3. Netlify redirect: /.netlify/functions/api/auth/login
         │
         ▼
4. api.js recebe a requisição
         │
         ▼
5. Function consulta: SELECT * FROM users WHERE email = ?
         │
         ▼
6. Neon retorna dados do usuário
         │
         ▼
7. Function valida senha com bcrypt
         │
         ▼
8. Function gera token JWT
         │
         ▼
9. API retorna: { token, user }
         │
         ▼
10. Frontend salva token no localStorage
```

---

## Configuração (netlify.toml)

```toml
[build]
  publish = "."              # Pasta do frontend
  command = "echo 'Sem build'"

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"

# Redireciona /api/* para as functions
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200
  force = true

# SPA fallback
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Variáveis de Ambiente

Configuradas no Netlify Dashboard:

```
DATABASE_URL=postgresql://...   # Conexão com Neon
JWT_SECRET=mantes2024secretkey  # Chave do JWT
NODE_ENV=production             # Ambiente
```

**Como usar no código:**
```javascript
process.env.DATABASE_URL
process.env.JWT_SECRET
```

---

## Vantagens Dessa Arquitetura

| Vantagem | Descrição |
|----------|-----------|
| **Sem servidor** | Não precisa gerenciar EC2, VPS, etc. |
| **Escala automática** | Netlify Functions escala sob demanda |
| **Custo zero** | Free tier do Netlify + Neon |
| **Deploy automático** | Git push → deploy em 2 minutos |
| **HTTPS automático** | Certificado SSL incluso |
| **CDN global** | Frontend em edge locations |
| **Não expira** | Neon não tem limite de tempo |

---

## Limitações

| Limitação | Valor |
|-----------|-------|
| Functions timeout | 10 segundos |
| Functions/mês | 125.000 |
| Bandwidth | 100 GB/mês |
| Storage banco | 0.5 GB |

---

## Comparação com Outras Opções

### ❌ Render (antiga configuração)

```
Frontend: Netlify
Backend: Render Web Service
Banco: Render PostgreSQL

Problemas:
- Backend dorme após 15min inativo
- PostgreSQL expira em 90 dias
- Mais complexo (2 serviços)
```

### ✅ Configuração Atual

```
Frontend + Backend: Netlify (Functions)
Banco: Neon PostgreSQL

Vantagens:
- Não dorme (frontend estático)
- Neon não expira
- Mais simples (1 serviço principal)
```

---

## Segurança

### Autenticação

```javascript
// Token JWT assinado com JWT_SECRET
const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
  expiresIn: '7d'
});

// Middleware valida token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.userId = decoded.id;
```

### Senhas

```javascript
// Hash com bcrypt
const senhaHash = await bcrypt.hash(senha, 10);

// Validação
const valid = await bcrypt.compare(senha, senhaHash);
```

### SQL Injection

```javascript
// Prepared statements (seguro)
await pool.query('SELECT * FROM users WHERE email = $1', [email]);

// NÃO faça isso:
await pool.query(`SELECT * FROM users WHERE email = '${email}'`);
```

---

## Monitoramento

### Netlify Dashboard

```
1. Deploys → Histórico de deploys
2. Functions → Logs de cada function
3. Analytics → Bandwidth, requests
```

### Neon Dashboard

```
1. Dashboard → Storage, conexões
2. Activity → Queries recentes
3. History → Histórico de operações
```

---

## Desenvolvimento Local

### Opção 1: Netlify CLI (Completo)

```bash
netlify dev
# Roda frontend + functions
# http://localhost:8888
```

### Opção 2: Apenas Frontend

```bash
npx serve .
# Só frontend, API não funciona
# http://localhost:3000
```

---

## Deploy Contínuo

```
git push
   │
   ▼
GitHub notifica Netlify
   │
   ▼
Netlify faz build
   │
   ▼
Functions são implantadas
   │
   ▼
Frontend é publicado
   │
   ▼
Site atualizado (2-3 minutos)
```

---

**🎉 Arquitetura 100% serverless, gratuita e escalável!**
