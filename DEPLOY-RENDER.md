# 🚀 Deploy no Render - Mantes

Guia completo para deploy do sistema Mantes no Render.

---

## 📋 Visão Geral

O Render oferece:
- ✅ Backend Node.js gratuito
- ✅ Frontend estático gratuito
- ✅ MongoDB Atlas integrado
- ✅ HTTPS automático
- ✅ Deploy contínuo do GitHub

---

## Passo 1: MongoDB Atlas

1. Acesse https://cloud.mongodb.com
2. Crie conta gratuita
3. Crie um cluster (M0 Free)
4. Crie usuário em **Database Access**
5. Libere IP em **Network Access** → 0.0.0.0/0
6. Copie a string de conexão

---

## Passo 2: Configurar Render

### Opção A: Usando render.yaml (Recomendado)

1. Acesse https://render.com
2. Login com GitHub
3. Clique em **"New +"** → **"Blueprint"**
4. Conecte seu repositório GitHub
5. O Render lerá o `render.yaml` automaticamente

### Opção B: Manual

#### Backend API

1. **New +** → **Web Service**
2. Conecte repositório `mantes`
3. Configure:
   - **Name**: `mantes-api`
   - **Region**: Oregon (free)
   - **Branch**: main
   - **Root Directory**: (deixe vazio)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

4. Em **Environment**, adicione:
   ```
   NODE_ENV=production
   MONGODB_URI=sua_string_mongodb
   JWT_SECRET=chave_secreta_segura
   FRONTEND_URL=https://mantes-web.onrender.com
   ```

#### Frontend

1. **New +** → **Static Site**
2. Conecte repositório `mantes`
3. Configure:
   - **Name**: `mantes-web`
   - **Branch**: main
   - **Build Command**: `echo "Sem build"`
   - **Publish Directory**: `.`

---

## Passo 3: URLs

Após deploy:
- **API**: `https://mantes-api.onrender.com`
- **Frontend**: `https://mantes-web.onrender.com`

---

## Passo 4: Testar API

```bash
# Testar endpoint
curl https://mantes-api.onrender.com/api/os/stats

# Testar frontend
https://mantes-web.onrender.com
```

---

## ⚙️ Configurar CORS

No backend, atualize `FRONTEND_URL` no `.env`:
```env
FRONTEND_URL=https://mantes-web.onrender.com
```

---

## 🔄 Atualizar Deploy

Push para main = deploy automático!

```bash
git add .
git commit -m "Atualização"
git push
```

---

## 📊 Logs

No dashboard do Render:
- **Logs** → Ver logs em tempo real
- **Events** → Histórico de deploys

---

## ⚠️ Limitações Free

- **Web Service**: Dorme após 15min inativo
- **Static Site**: Sempre ativo
- **Build**: 750 horas/mês grátis

---

## 🐛 Troubleshooting

### Serviço dormindo
- Acesse a URL para "acordar"
- Use https://cron-job.org para ping

### Erro de MongoDB
- Verifique string de conexão
- Libere IP no Atlas

### CORS error
- Confira FRONTEND_URL
- Verifique CORS no server.js

---

**Pronto!** 🎉
