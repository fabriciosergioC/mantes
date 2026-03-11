# 🚀 Deploy Rápido na Vercel - Mantes

## ⚡ Em 3 Passos (5 minutos!)

### Passo 1: MongoDB Atlas (2 min)
```
1. https://cloud.mongodb.com → Login
2. Database → Connect → Copiar string
3. Network Access → 0.0.0.0/0
```

### Passo 2: GitHub (1 min)
```bash
cd C:\Users\fabri\Documents\PROJETOS\mantes
git init
git add .
git commit -m "Deploy Vercel"
git push -u origin main
```

### Passo 3: Vercel (2 min)
```
1. https://vercel.com → Login com GitHub
2. Import Project → Selecionar "mantes"
3. Environment Variables:
   - MONGODB_URI: (sua string do Atlas)
   - JWT_SECRET: (qualquer senha segura)
4. Deploy!
```

**Pronto!** 🎉

URL: `https://mantes-xxx.vercel.app`

---

## 📝 Ajuste Necessário

A Vercel usa serverless. Seu `server.js` funciona, mas precisa de pequenos ajustes:

### Opção A: Manter server.js atual (funciona!)
Sua API já está compatível.

### Opção B: Criar api/index.js (recomendado)
```javascript
// api/index.js
const app = require('../server');
module.exports = app;
```

---

## 🧪 Testar

```bash
# API
https://mantes-xxx.vercel.app/api/os

# Frontend
https://mantes-xxx.vercel.app/index.html
```

---

## ⚠️ Limitações Vercel Free

- Serverless: 10s timeout máximo
- 100GB bandwidth/mês
- Pode "dormir" após inatividade

---

## 🔄 Atualizar Variáveis

Painel Vercel → Settings → Environment Variables

---

**Mais rápido que isso, só local!** 🚀
