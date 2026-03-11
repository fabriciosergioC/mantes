# 🚀 Deploy no Render - Mantes

Guia completo para deploy do sistema Mantes no Render com PostgreSQL.

---

## 📋 Visão Geral

**Stack:**
- Backend: Node.js + Express
- Banco: PostgreSQL (Render)
- Frontend: HTML/CSS/JS

---

## Passo 1: Criar Banco PostgreSQL no Render

1. Acesse https://render.com
2. Login com GitHub
3. **New +** → **PostgreSQL**
4. Configure:
   - **Name**: `mantesdb`
   - **Region**: Oregon (free)
   - **Plan**: Free
5. Clique em **Create Database**

### Copiar Connection String

Após criar:
1. Vá em **Connection** → **External connection string**
2. Copie a string (começa com `postgresql://`)
3. Salve para usar depois

---

## Passo 2: Criar Tabelas

1. No dashboard do PostgreSQL, clique em **SQL**
2. Cole o conteúdo de `database.sql`
3. Clique em **Run**

Isso cria as tabelas `users` e `orders`.

---

## Passo 3: Criar Backend (Web Service)

1. **New +** → **Web Service**
2. Conecte repositório `mantes` do GitHub
3. Configure:

| Campo | Valor |
|-------|-------|
| Name | `mantes-api` |
| Region | Oregon |
| Branch | main |
| Root Directory | (vazio) |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | Free |

4. Em **Environment Variables**, adicione:

```
DATABASE_URL=postgresql://mantesdb_user:SENHA@dpg-xxxx/mantesdb
JWT_SECRET=mantes2024secretkey
NODE_ENV=production
FRONTEND_URL=https://mantes-web.onrender.com
PORT=3000
```

5. Clique em **Create Web Service**

---

## Passo 4: Criar Frontend (Static Site)

1. **New +** → **Static Site**
2. Conecte repositório `mantes`
3. Configure:

| Campo | Valor |
|-------|-------|
| Name | `mantes-web` |
| Branch | main |
| Build Command | `echo "Sem build"` |
| Publish Directory | `.` |

4. Clique em **Create Static Site**

---

## Passo 5: Atualizar CORS

No backend, atualize `FRONTEND_URL` com a URL do frontend estático:
```
FRONTEND_URL=https://mantes-web.onrender.com
```

---

## 🎯 URLs Finais

- **API**: `https://mantes-api.onrender.com`
- **Frontend**: `https://mantes-web.onrender.com`
- **PostgreSQL**: (interno do Render)

---

## 🧪 Testar

```bash
# Testar API
curl https://mantes-api.onrender.com/api/os/stats

# Testar frontend
https://mantes-web.onrender.com
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

## ⚠️ Limitações Free

- **Web Service**: Dorme após 15min inativo
- **PostgreSQL**: 90 dias, 1GB storage
- **Static Site**: Sempre ativo

---

## 🐛 Troubleshooting

### Erro de conexão PostgreSQL
- Verifique `DATABASE_URL` nas variáveis
- Confirme se as tabelas foram criadas

### Serviço dormindo
- Acesse a URL para "acordar"
- Use https://cron-job.org para ping (grátis)

### CORS error
- Confira `FRONTEND_URL`
- Verifique se bate com URL do Static Site

---

**Pronto!** 🎉
