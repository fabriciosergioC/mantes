# 🚀 Comparação: Opções de Deploy

## ⚡ Mais Rápido ao Mais Lento

| Opção | Tempo | Complexidade | Custo |
|-------|-------|--------------|-------|
| **Vercel** | 5 min | ⭐ Muito Fácil | Grátis |
| **Railway** | 10 min | ⭐⭐ Fácil | Grátis (US$5 crédito) |
| **Netlify + Render** | 15 min | ⭐⭐⭐ Médio | Grátis |
| **Heroku** | 20 min | ⭐⭐⭐ Médio | Pago (US$5+) |

---

## 🏆 Recomendado: Vercel

**Por quê?**
- ✅ 1 único deploy (frontend + backend juntos)
- ✅ Não precisa configurar 2 serviços
- ✅ HTTPS automático
- ✅ Mais rápido para subir
- ✅ Domínio `vercel.app` grátis

**Limitação:**
- Serverless timeout: 10 segundos (suficiente para Mantes)

---

## 📝 Passo a Passo Vercel (5 minutos)

### 1. MongoDB Atlas (2 min)
```
https://cloud.mongodb.com
→ Database Access → Criar usuário
→ Network Access → 0.0.0.0/0
→ Connect → Copiar string
```

### 2. GitHub (1 min)
```bash
git init
git add .
git commit -m "Deploy Vercel"
git remote add origin https://github.com/SEU_USUARIO/mantes.git
git push -u origin main
```

### 3. Vercel (2 min)
```
https://vercel.com
→ Login com GitHub
→ Import Project → mantes
→ Environment Variables:
   - MONGODB_URI = (sua string)
   - JWT_SECRET = (senha segura)
→ Deploy
```

**Pronto!** 🎉

---

## 🧪 Testar

```
https://mantes-xxx.vercel.app/index.html
```

---

## 🔄 Outras Opções

### Railway (Alternativa boa)
```
https://railway.app
→ New Project → Deploy from GitHub
→ Variables: MONGODB_URI, JWT_SECRET
→ Mais estável que Render (não dorme)
```

### Render (Grátis mas lento)
```
https://render.com
→ Web Service → Conectar GitHub
→ Dorme após 15 min inativo
```

### Netlify + Render (2 deploys)
```
Mais trabalho: configurar 2 serviços
Backend dorme no Render free
```

---

## 🎯 Veredito

**Use Vercel se:** Quer rapidez e simplicidade ✅

**Use Railway se:** Precisa de mais estabilidade (não dorme)

**Use Render se:** Não se importa com sleep time

---

## 📊 Comparação Técnica

| Recurso | Vercel | Railway | Render |
|---------|--------|---------|--------|
| Deploy | 1 clique | 1 clique | 1 clique |
| Sleep | Não | Não | Sim (15min) |
| Timeout | 10s | Ilimitado | Ilimitado |
| Upload | 4.5MB | 100MB | 100MB |
| Domínio | vercel.app | railway.app | onrender.com |

---

**Mantes está configurado para Vercel!** 🚀

Arquivos prontos:
- `vercel.json` (configuração)
- `server.js` (compatível serverless)
- Frontend (detecta Vercel automaticamente)
