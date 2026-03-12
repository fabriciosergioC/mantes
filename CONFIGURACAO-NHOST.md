# 🚀 Configuração do Nhost para Mantes

## Passo 1: Criar Projeto no Nhost

1. Acesse https://app.nhost.io
2. Clique em **"Create Project"**
3. Preencha:
   - **Project name:** mantes
   - **Region:** escolha o mais próximo (US East ou Europe)
   - **Database:** PostgreSQL
4. Clique em **"Create Project"**

---

## Passo 2: Obter Credenciais

Após criar o projeto, você verá:
- **Project URL:** `https://xxxxx.nhost.app`
- **GraphQL URL:** `https://xxxxx.nhost.app/v1/graphql`
- **Admin Secret:** (clique em "Show")

---

## Passo 3: Configurar `.env`

Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite `.env` com suas credenciais:

```env
# Produção (Nhost Cloud)
VITE_NHOST_BACKEND_URL=https://xxxxx.nhost.app
VITE_HASURA_ADMIN_SECRET=sua_admin_secret_aqui

# Local (opcional, para desenvolvimento offline)
# VITE_NHOST_BACKEND_URL=http://localhost:1337
# VITE_HASURA_ADMIN_SECRET=admin-secret-for-local-dev
```

---

## Passo 4: Aplicar Schema no Banco

No console do Hasura (https://xxxxx.nhost.app/console):

1. Vá em **"Data"** → **"SQL"**
2. Copie o conteúdo de `nhost/schema.sql`
3. Cole e execute
4. Marque **"Track this table"** para ambas as tabelas

Ou via CLI (se tiver Nhost local):
```bash
nhost db apply -f nhost/schema.sql
```

---

## Passo 5: Configurar Permissões (Hasura)

No console do Hasura:

### Tabela `orders`
1. Vá em **"Data"** → **"orders"** → **"Permissions"**
2. Para role `user`:
   - **Select:** ✅ Tudo
   - **Insert:** ✅ Tudo
   - **Update:** ✅ Tudo
   - **Delete:** ✅ Tudo

### Tabela `profiles`
1. Vá em **"Data"** → **"profiles"** → **"Permissions"**
2. Para role `user`:
   - **Select:** ✅ Tudo (com filter: `id = X-Hasura-User-Id`)
   - **Insert:** ✅ Tudo
   - **Update:** ✅ Tudo (com filter: `id = X-Hasura-User-Id`)
   - **Delete:** ❌ Não

---

## Passo 6: Configurar Auth (Nhost Auth)

No dashboard do Nhost:

1. Vá em **"Authentication"** → **"Settings"**
2. Em **"Email Password"**, ative:
   - ✅ Enable Email/Password
   - ✅ Enable Sign Up
3. Em **"Allowed Emails"**, deixe em branco (permite todos)

---

## Passo 7: Testar Localmente

### Iniciar servidor de desenvolvimento:
```bash
npm run dev
```

O Vite abrirá em http://localhost:5173

### Testar login:
1. Crie uma conta em https://app.nhost.io (ou use o dashboard)
2. No sistema, faça login com email/senha
3. Crie uma OS

---

## Passo 8: Deploy

### Frontend (Netlify/Vercel)

**Netlify:**
```bash
npm run build
netlify deploy --prod --dir=dist
```

**Vercel:**
```bash
vercel deploy --prod
```

### Variáveis no Deploy

No painel do Netlify/Vercel, adicione:
- `VITE_NHOST_BACKEND_URL` = `https://xxxxx.nhost.app`
- `VITE_HASURA_ADMIN_SECRET` = `sua_admin_secret`

---

## 📊 URLs Importantes

| Serviço | URL |
|---------|-----|
| Frontend (local) | http://localhost:5173 |
| Nhost Dashboard | https://app.nhost.io |
| Hasura Console | https://xxxxx.nhost.app/console |
| GraphQL API | https://xxxxx.nhost.app/v1/graphql |

---

## 🐛 Problemas Comuns

### Erro: "Cannot read property of undefined"
- Verifique se o `.env` está configurado corretamente
- Reinicie o servidor (`Ctrl+C` e `npm run dev`)

### Erro: "GraphQL error: permission denied"
- Configure as permissões no Hasura (Passo 5)
- Verifique se o usuário está logado

### Erro: "Network error"
- Verifique se a URL do backend está correta
- No production, use `https://` não `http://`

---

## 📞 Suporte

- Nhost Docs: https://docs.nhost.io
- Hasura Docs: https://hasura.io/docs
- Discord Nhost: https://discord.gg/nhost
