# 🚀 Deploy Ultra-Rápido - Mantes

## ⚡ Opção Mais Rápida: Vercel

**Tempo total: 5 minutos**

---

## 📋 Pré-requisitos (1 vez só)

1. **Conta no GitHub**: https://github.com
2. **Conta no MongoDB Atlas**: https://cloud.mongodb.com
3. **Conta na Vercel**: https://vercel.com (use login com GitHub)

---

## 🚀 Deploy em 3 Passos

### 1️⃣ MongoDB Atlas (2 minutos)

```
1. Acesse: https://cloud.mongodb.com
2. Database Access → ADD NEW DATABASE USER
   - Username: mantes
   - Password: (AUTO-GENERATE → SALVE!)
   - Privileges: Read and write
3. Network Access → ADD IP ADDRESS
   - ALLOW ACCESS FROM ANYWHERE (0.0.0.0/0)
4. Database → Connect → Connect your application
   - Copie a string de conexão
```

### 2️⃣ GitHub (1 minuto)

**Opção A: Script Automático**
```bash
# No terminal (Windows PowerShell ou Git Bash)
deploy-vercel.bat
```

**Opção B: Manual**
```bash
git init
git add .
git commit -m "Deploy Vercel"
git remote add origin https://github.com/SEU_USUARIO/mantes.git
git push -u origin main
```

### 3️⃣ Vercel (2 minutos)

```
1. Acesse: https://vercel.com
2. Clique em "Import Project"
3. Selecione "mantes"
4. Configure Environment Variables:
   - MONGODB_URI = mongodb+srv://mantes:SENHA@cluster0.xxxxx.mongodb.net/mantes
   - JWT_SECRET = qualquer_senha_segura_aqui
5. Clique em "Deploy"
```

---

## ✅ Pronto!

**URL do seu sistema:**
```
https://mantes-xxx.vercel.app
```

**Teste:**
```
https://mantes-xxx.vercel.app/index.html
```

**Login:**
- Email: `lider@mantes.com`
- Senha: `mantes2024`

---

## 📁 Arquivos de Deploy Incluídos

| Arquivo | Função |
|---------|--------|
| `vercel.json` | Configuração Vercel |
| `deploy-vercel.bat` | Script Windows |
| `deploy-vercel.sh` | Script Linux/Mac |
| `DEPLOY-VERCEL.md` | Guia completo |
| `COMPARAÇÃO-DEPLOY.md` | Comparação de serviços |

---

## 🔄 Atualizar Deploy

Sempre que modificar algo:

```bash
git add .
git commit -m "Atualização"
git push
```

A Vercel faz deploy automático!

---

## ⚠️ Problemas Comuns

### Erro: CORS
```
Solução: Frontend já está configurado para detectar Vercel
```

### Erro: MongoDB
```
Solução: Verifique MONGODB_URI e Network Access (0.0.0.0/0)
```

### Erro: 404
```
Solução: Acesse /index.html explicitamente
```

### Serverless Timeout
```
Uploads grandes podem timeout (limite: 10s)
Solução: Use arquivos menores ou Railway
```

---

## 🎯 Outras Opções

Se precisar de mais recursos:

| Serviço | Vantagem | URL |
|---------|----------|-----|
| **Railway** | Não tem timeout | railway.app |
| **Render** | Mais popular | render.com |
| **Heroku** | Mais estável | heroku.com (pago) |

---

## 📊 Arquitetura

```
┌──────────────┐
│   Vercel     │  (Frontend + Backend)
│  mantes.app  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ MongoDB      │  (Database)
│   Atlas      │
└──────────────┘
```

---

## 🆘 Suporte

- Vercel Docs: https://vercel.com/docs
- MongoDB Docs: https://mongodb.com/docs/atlas
- EmailJS: https://emailjs.com/docs

---

**Mantes no ar em 5 minutos!** 🚀
