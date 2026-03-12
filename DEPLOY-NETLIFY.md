# 🚀 Deploy do Mantes no Netlify + Neon

Deploy do sistema Mantes usando **apenas Netlify** (frontend + backend via Functions) e **Neon PostgreSQL**.

> ✅ **Sem Render** - Arquitetura 100% serverless e gratuita!

---

## 📋 Visão Geral

**Arquitetura:**
- **Frontend**: HTML/CSS/JS estático (Netlify)
- **Backend**: Netlify Functions (serverless)
- **Banco**: Neon PostgreSQL (serverless, não expira)

---

## Passo 1: Criar Banco no Neon (5 minutos)

### 1.1 - Acessar Neon

1. Acesse https://neon.tech
2. Clique em **"Try Neon for free"**
3. Login com **GitHub** (autorize o acesso)

### 1.2 - Criar Projeto

1. Clique em **"Create a project"**
2. Preencha:
   - **Project name**: `mantes`
   - **Compute size**: `Free`
   - **Region**: `Oregon (US West)` ← Mais próximo do Brasil
3. Clique em **"Create project"**

### 1.3 - Copiar Connection String

1. Na página do projeto, clique em **"Connect"** (canto superior direito)
2. Em **"Connection string"**, selecione **"URI"**
3. Clique em **"Copy"**
4. **Salve em um bloco de notas** (você vai usar no Netlify)

```
Formato: postgresql://user:senha@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
```

### 1.4 - Criar Tabelas

1. No menu lateral, clique em **"SQL Editor"**
2. Abra o arquivo `database.sql` do projeto
3. Copie **TODO** o conteúdo
4. Cole no editor SQL do Neon
5. Clique em **"Run"** (botão ▶)

### 1.5 - Verificar Tabelas

1. Menu lateral → **"Tables"**
2. Devem aparecer: `users` e `orders`

✅ **Banco pronto!**

---

## Passo 2: Preparar Repositório no GitHub

### 2.1 - Verificar Git

```bash
# No terminal do VS Code:
git status
```

Se não for repositório git:
```bash
git init
git add .
git commit -m "Configuração inicial Mantes"
```

### 2.2 - Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name**: `mantes`
   - **Visibility**: Público ou Privado
3. **NÃO** marque "Initialize with README"
4. Clique em **"Create repository"**

### 2.3 - Enviar Código

```bash
git remote add origin https://github.com/SEU-USUARIO/mantes.git
git branch -M main
git push -u origin main
```

---

## Passo 3: Deploy no Netlify

### 3.1 - Criar Conta

1. Acesse https://app.netlify.com
2. Clique em **"Sign up"**
3. Login com **GitHub**

### 3.2 - Importar Projeto

1. Clique em **"Add new site"**
2. Selecione **"Import an existing project"**
3. Clique em **"GitHub"**
4. Autorize o Netlify
5. Encontre e clique em **"mantes"**

### 3.3 - Configurar Build

Preencha assim:

| Campo | Valor |
|-------|-------|
| **Base directory** | (deixe vazio) |
| **Build command** | `echo 'Sem build'` |
| **Publish directory** | `.` |
| **Functions directory** | `netlify/functions` |

### 3.4 - Variáveis de Ambiente

1. Clique em **"Show advanced"**
2. Role até **"Environment variables"**
3. Clique em **"Add a variable"**

Adicione **UMA POR UMA**:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | (cole a connection string do Neon) |
| `JWT_SECRET` | `mantes2024secretkey` |
| `NODE_ENV` | `production` |

### 3.5 - Iniciar Deploy

1. Clique em **"Deploy site"**
2. Aguarde o build (2-5 minutos)
3. Quando aparecer **"Site is live"**, está pronto!

### 3.6 - Anotar URL

No topo aparecerá:
```
https://seu-site-aleatorio.netlify.app
```

**COPIE ESSA URL!**

---

## Passo 4: Testar

### 4.1 - Acessar Frontend

```
https://seu-site-aleatorio.netlify.app
```

### 4.2 - Primeiro Login

Use qualquer email e senha:
- **Email**: `admin@mantes.com`
- **Senha**: `admin123`

O sistema cria o usuário automaticamente.

### 4.3 - Testar Criação de OS

1. Preencha o formulário
2. Clique em "Criar Ordem de Serviço"
3. ✅ Deve aparecer mensagem de sucesso

### 4.4 - Testar Painel do Líder

```
https://seu-site-aleatorio.netlify.app/lider.html
```

Senha: `mantes2024`

---

## Passo 5: Personalizar URL (Opcional)

1. Netlify → **"Site settings"**
2. Clique em **"Change site name"**
3. Digite: `mantes-seunome`
4. Clique em **"Save"**

Nova URL: `https://mantes-seunome.netlify.app`

---

## 🧪 Testar API

```bash
# Testar endpoint
curl https://seu-site.netlify.app/api/os/stats

# Deve retornar:
{"total":0,"pending":0,"accepted":0,"resolved":0,"rejected":0}
```

---

## 🔄 Atualizar

Sempre que fizer alterações:

```bash
git add .
git commit -m "Descrição da mudança"
git push
```

**O Netlify faz deploy automático!** (1-2 minutos)

---

## 🛠️ Desenvolvimento Local

### Opção A: Netlify CLI (Recomendado)

```bash
# Instalar
npm install -g netlify-cli

# Login
netlify login

# Rodar (frontend + functions)
netlify dev
```

Acesse: `http://localhost:8888`

### Opção B: Apenas Frontend

```bash
npx serve .
```

Acesse: `http://localhost:3000`

---

## ⚠️ Limitações (Plano Free)

### Netlify
- **100GB** bandwidth/mês
- **125k** function invocations/mês
- **Function timeout**: 10 segundos
- **Build minutes**: 300 minutos/mês

### Neon
- **0.5 GB** storage
- **Compute**: 0.25 vCPU
- **Não expira** (diferente do Render!)

---

## 🐛 Troubleshooting

### Erro: "Database connection failed"

**Solução:**
1. Netlify → Site settings → Environment variables
2. Verifique se `DATABASE_URL` está correta
3. No Neon → Connect → copie novamente
4. Netlify → Deploys → "Trigger deploy"

---

### Erro: "Function not found" ou 404 em /api/*

**Solução:**
1. Verifique se `netlify/functions/api.js` existe
2. Netlify → Deploys → veja erros no build log
3. Procure por "functions" no log

---

### Erro: "CORS error" no console

**Solução:**
Verifique no `main.js` e `lider.html`:
- Em produção deve usar: `/api` (relativo)
- NÃO use URL absoluta externa

---

### Erro: "Token inválido" ao logar

**Solução:**
1. Netlify → Site settings → Environment variables
2. Adicione: `JWT_SECRET = mantes2024secretkey`
3. Reinicie o deploy

---

### Site aparece em branco

**Solução:**
1. Pressione **F12** no navegador
2. Vá em **"Console"**
3. Veja o erro
4. Verifique se `API_URL` está correto

---

## 📊 Monitorar

### Netlify Dashboard
1. Dashboard → Clique no site
2. **"Deploys"** → Histórico
3. **"Functions"** → Logs das funções API

### Neon Dashboard
1. Projeto → **"Dashboard"**
2. Veja uso de storage e conexões

---

## 📦 Estrutura do Projeto

```
mantes/
├── netlify/
│   └── functions/
│       └── api.js       # Backend serverless
├── index.html           # Frontend principal
├── lider.html           # Painel do líder
├── reset-senha.html     # Reset de senha
├── main.js              # Lógica frontend
├── netlify.toml         # Configuração Netlify
├── package.json         # Dependências
├── database.sql         # Script do banco
└── .env.example         # Variáveis exemplo
```

---

## 🔐 Segurança

- ✅ **JWT_SECRET**: Use chave forte e única
- ✅ **DATABASE_URL**: Nunca exponha no frontend
- ✅ **HTTPS**: Automático no Netlify
- ✅ `.env`: Nunca commit no Git

---

## 📱 URLs Finais

| Serviço | URL |
|---------|-----|
| **Frontend** | `https://seu-site.netlify.app` |
| **Painel Líder** | `https://seu-site.netlify.app/lider.html` |
| **API** | `https://seu-site.netlify.app/api` |
| **Reset Senha** | `https://seu-site.netlify.app/reset-senha.html` |
| **Neon** | (interno - não acessível publicamente) |

---

## ✅ Checklist

- [ ] Conta Neon criada
- [ ] Projeto Neon criado
- [ ] Connection string copiada
- [ ] Tabelas `users` e `orders` criadas
- [ ] Repositório no GitHub
- [ ] Conta Netlify criada
- [ ] Site importado no Netlify
- [ ] Variáveis `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV` configuradas
- [ ] Deploy realizado com sucesso
- [ ] Login funcionando
- [ ] Criação de OS funcionando
- [ ] Painel do líder funcionando

---

## 🎉 Pronto!

Seu sistema Mantes está rodando **100% no Netlify + Neon** - sem Render, sem custos!

**Stack:**
- Frontend: Netlify (estático)
- Backend: Netlify Functions (serverless)
- Banco: Neon PostgreSQL (serverless)

---

**Dúvidas?** Consulte os logs no Netlify Dashboard ou Neon Dashboard.
