# 🚀 Deploy Rápido - Mantes no Netlify

Guia **super rápido** para deploy usando **apenas Netlify** (frontend + backend) + **Neon** (banco).

> ✅ **Netlify puro**: Frontend + Backend (Functions)
> ✅ **Neon**: PostgreSQL serverless (grátis, não expira)

---

## ⚡ Resumo em 3 Passos

| Passo | O quê | Onde | Tempo |
|-------|-------|------|-------|
| **1** | Criar banco | Neon | 3 min |
| **2** | Criar tabelas | Neon SQL Editor | 1 min |
| **3** | Deploy | Netlify | 5 min |

---

## Passo 1: Criar Banco no Neon (3 minutos)

```
1. Acesse: https://neon.tech
2. Login com GitHub
3. Create a project
4. Nome: mantes
5. Region: Oregon
6. Click: Create project
7. Connect → Copy URI
```

**Salve a connection string!**
```
postgresql://user:senha@ep-xxx.us-east-2.aws.neon.tech/mantes?sslmode=require
```

---

## Passo 2: Criar Tabelas (1 minuto)

```
1. Neon → SQL Editor
2. Copie o conteúdo de database.sql
3. Cole no editor
4. Run ▶
5. Verifique: Tables → users, orders
```

---

## Passo 3: Deploy no Netlify (5 minutos)

### 3.1 Preparar GitHub

```bash
git init
git add .
git commit -m "Mantes no Netlify"
git remote add origin https://github.com/SEU-USUARIO/mantes.git
git push -u origin main
```

### 3.2 Deploy no Netlify

```
1. https://netlify.com → Login GitHub
2. Add new site → Import an existing project
3. Selecione: mantes
4. Build command: echo 'Sem build'
5. Publish directory: .
6. Environment variables:
   - DATABASE_URL = (URI do Neon)
   - JWT_SECRET = mantes2024secretkey
   - NODE_ENV = production
7. Deploy site
```

---

## ✅ Pronto!

**URLs:**
- Frontend: `https://seu-site.netlify.app`
- API: `https://seu-site.netlify.app/api/os/stats`
- Painel: `https://seu-site.netlify.app/lider.html`

**Teste:**
```
1. Acesse o site
2. Login: admin@mantes.com / admin123
3. Crie uma OS
4. Vá em /lider.html (senha: mantes2024)
```

---

## 📁 O Que Cada Arquivo Faz

| Arquivo | Função |
|---------|--------|
| `netlify/functions/api.js` | **Backend completo** (autenticação + CRUD) |
| `index.html` | Frontend (criação de OS) |
| `lider.html` | Painel do líder |
| `netlify.toml` | Configura o Netlify |
| `database.sql` | Cria tabelas no banco |

---

## 🔧 Como Funciona

```
┌─────────────────────────────────────┐
│         NETLIFY                     │
│  ┌───────────┐  ┌────────────────┐ │
│  │ Frontend  │  │ Netlify        │ │
│  │ (HTML/CSS)│  │ Functions      │ │
│  │           │─▶│ (Backend API)  │ │
│  └───────────┘  └───────┬────────┘ │
└─────────────────────────┼───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │    NEON (PostgreSQL)  │
              │  - users              │
              │  - orders             │
              └───────────────────────┘
```

**Fluxo:**
1. Usuário acessa `https://seu-site.netlify.app`
2. Frontend chama `/api/login`
3. Netlify Functions processa a requisição
4. Function consulta/salva no Neon PostgreSQL
5. Resposta volta para o frontend

---

## 🛠️ Desenvolvimento Local

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Rodar localmente
netlify dev

# Acesse: http://localhost:8888
```

---

## ⚠️ Limitações (Free)

**Netlify:**
- 100GB bandwidth/mês
- 125k functions/mês
- 10s timeout por function

**Neon:**
- 0.5 GB storage
- Não expira ✅

---

## 🐛 Problemas Comuns

| Erro | Solução |
|------|---------|
| 404 em /api/* | Verifique netlify.toml |
| Database connection failed | Confira DATABASE_URL |
| Token inválido | Adicione JWT_SECRET |

---

## 📊 Ver Logs

**Netlify:**
```
Dashboard → Site → Deploys → Click no deploy → Server log
```

**Neon:**
```
Projeto → Dashboard → Connections
```

---

## 🔄 Atualizar

```bash
git add .
git commit -m "Alterações"
git push
```

Netlify faz deploy automático!

---

**🎉 Sistema no ar usando apenas Netlify + Neon!**
