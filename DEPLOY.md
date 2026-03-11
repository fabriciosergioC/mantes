# Guia de Deploy - Sistema Mantes

Este guia explica como fazer deploy do Sistema Mantes usando:
- **Frontend**: Netlify (grátis)
- **Backend**: Render (grátis)
- **Banco de Dados**: MongoDB Atlas (grátis)

---

## 📋 Visão Geral da Arquitetura

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Netlify       │────▶│     Render       │────▶│  MongoDB Atlas  │
│  (Frontend)     │     │   (Backend)      │     │   (Database)    │
│  mantes.netlify │     │ mantes.onrender  │     │  cluster.mongodb│
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

---

## 🚀 Passo 1: Preparar o MongoDB Atlas

### 1.1 Criar Cluster (se ainda não tiver)
1. Acesse https://cloud.mongodb.com
2. Faça login e crie um cluster **FREE** (M0)
3. Aguarde a criação (3-5 minutos)

### 1.2 Criar Usuário do Banco
1. Menu lateral → **Database Access**
2. **+ ADD NEW DATABASE USER**
3. Preencha:
   - **Username**: `mantes`
   - **Password**: (clique em "Autogenerate Secure Password" e SALVE)
   - **Database Privileges**: "Read and write to any database"
4. **Add User**

### 1.3 Configurar Acesso de Rede
1. Menu lateral → **Network Access**
2. **+ ADD IP ADDRESS**
3. **ALLOW ACCESS FROM ANYWHERE** (0.0.0.0/0)
4. **Confirm**

### 1.4 Obter String de Conexão
1. Menu lateral → **Database**
2. **Connect** no seu cluster
3. **Connect your application**
4. Copie a string (exemplo):
   ```
   mongodb+srv://mantes:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Substitua `<password>` pela senha criada

---

## 🚀 Passo 2: Deploy do Backend no Render

### 2.1 Preparar o Código

1. **Crie um repositório no GitHub**:
   ```bash
   cd C:\Users\fabri\Documents\PROJETOS\mantes
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Suba para o GitHub**:
   ```bash
   git remote add origin https://github.com/SEU_USUARIO/mantes.git
   git push -u origin main
   ```

### 2.2 Criar Serviço no Render

1. Acesse https://render.com e crie conta (use o GitHub)
2. **New +** → **Web Service**
3. **Connect** seu repositório `mantes`
4. Configure:
   - **Name**: `mantes-backend`
   - **Region**: US East (N. Virginia) - mais próximo do Brasil
   - **Branch**: `main`
   - **Root Directory**: (deixe em branco)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: **Free**

5. **Environment Variables** (clique em "Advanced" e adicione):
   ```
   MONGODB_URI = mongodb+srv://mantes:SUA_SENHA@cluster0.xxxxx.mongodb.net/mantes?retryWrites=true&w=majority
   JWT_SECRET = sua_chave_secreta_muito_segura_123456
   PORT = 3000
   FRONTEND_URL = https://seu-site-nao-netlify.netlify.app
   NODE_ENV = production
   ```

6. **Create Web Service**

7. Aguarde o deploy (2-5 minutos)
8. Copie a URL do serviço (ex: `https://mantes-backend-xyz.onrender.com`)

---

## 🚀 Passo 3: Deploy do Frontend na Netlify

### 3.1 Atualizar URL da API no Frontend

Edite o arquivo `lider.html` e `index.html`:

**No `lider.html`** (linha ~1010), altere:
```javascript
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : 'https://mantes-backend-xyz.onrender.com';
```

**No `index.html`**, faça o mesmo.

### 3.2 Deploy na Netlify

**Opção A: Via GitHub (Recomendado)**

1. Acesse https://netlify.com e crie conta (use o GitHub)
2. **Add new site** → **Import an existing project**
3. **GitHub** → autorize e selecione `mantes`
4. Configure:
   - **Base directory**: (deixe em branco)
   - **Build command**: (deixe em branco)
   - **Publish directory**: `.` (ponto)
5. **Deploy site**

**Opção B: Drag & Drop (Rápido)**

1. Crie uma pasta com todos os arquivos HTML/JS
2. Arraste para a área de deploy da Netlify
3. Pronto!

### 3.3 Configurar Domínio

1. No painel do site → **Domain settings**
2. **Add custom domain** (opcional)
3. Anote a URL: `https://seu-site.netlify.app`

---

## 🚀 Passo 4: Configurar CORS e Atualizar Variáveis

### 4.1 Atualizar FRONTEND_URL no Render

1. Volte ao Render → seu serviço
2. **Environment** → edite `FRONTEND_URL`
3. Coloque a URL da Netlify: `https://seu-site.netlify.app`
4. **Save Changes** (o serviço será reiniciado)

### 4.2 Testar a API

Acesse no navegador:
```
https://mantes-backend-xyz.onrender.com/api/os
```

Deve retornar `[]` (lista vazia) ou as O.S. cadastradas.

---

## 🚀 Passo 5: Testar o Sistema Completo

1. Acesse `https://seu-site.netlify.app`
2. Faça login com:
   - **Email**: `lider@mantes.com`
   - **Senha**: `mantes2024` (ou a configurada)
3. Crie uma O.S. de teste
4. Verifique se aparece no painel do líder

---

## 🔧 Configuração de Arquivos

### .gitignore (já incluso)
```
node_modules/
.env
uploads/*
!uploads/.gitkeep
*.log
.DS_Store
```

### Variáveis de Ambiente (.env)

**Desenvolvimento local:**
```env
MONGODB_URI=mongodb+srv://mantes:senha@cluster0.xxxxx.mongodb.net/mantes
JWT_SECRET=68e2fcef14586e99a9552e6e207f7dd0f94f46289f71d6184aa09f373bc69a3d
PORT=3000
FRONTEND_URL=http://localhost:5500
```

**Produção (Render):**
```env
MONGODB_URI=mongodb+srv://mantes:senha@cluster0.xxxxx.mongodb.net/mantes
JWT_SECRET=sua_chave_forte_de_producao
PORT=3000
FRONTEND_URL=https://seu-site.netlify.app
NODE_ENV=production
```

---

## 📊 Monitoramento

### Render (Backend)
- Logs em tempo real: **Logs** no painel do serviço
- Métricas: **Metrics** (CPU, Memória)

### Netlify (Frontend)
- Deploys: **Deploys** no painel do site
- Logs de build: clique no deploy → **Show deploy log**

### MongoDB Atlas (Database)
- Métricas: **Metrics** no cluster
- Logs: **Logs** → Cluster Logs

---

## ⚠️ Problemas Comuns e Soluções

### 1. Erro de CORS
**Sintoma**: Frontend não consegue acessar API

**Solução**: Verifique se `FRONTEND_URL` no Render está correto

### 2. Erro de Conexão com MongoDB
**Sintoma**: Backend não conecta ao banco

**Solução**: 
- Verifique se `MONGODB_URI` está correto
- Confirme Network Access no Atlas (0.0.0.0/0)

### 3. Deploy falha no Render
**Sintoma**: Build error

**Solução**:
- Verifique os logs em **Logs** → **Build**
- Confirme que `package.json` está correto

### 4. 404 na Netlify
**Sintoma**: Página não carrega

**Solução**:
- Verifique se os arquivos HTML estão na raiz
- Confira o **Publish directory** nas configurações

---

## 🎯 Próximos Passos

1. **Domínio Personalizado**: Compre um domínio e configure na Netlify
2. **HTTPS**: Automático na Netlify e Render
3. **Backup**: Configure backups automáticos no MongoDB Atlas
4. **Monitoramento**: Use UptimeRobot para monitorar o serviço

---

## 📞 Suporte

- **Netlify Docs**: https://docs.netlify.com
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas

---

Desenvolvido com ❤️ para o Sistema Mantes
