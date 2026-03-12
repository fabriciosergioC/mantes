# 🚀 Deploy Rápido - Mantes + Nhost

## ✅ Pré-requisitos

- Conta no GitHub
- Conta no Nhost (https://app.nhost.io)
- Conta no Netlify ou Vercel

---

## 📦 1. Backend (Nhost)

### Criar Projeto
1. Acesse https://app.nhost.io
2. **"Create Project"**
3. Nome: `mantes`
4. Escolha região (US East ou Europe)

### Configurar Banco
1. No dashboard, clique em **"Hasura Console"**
2. Vá em **"Data"** → **"SQL"**
3. Cole o conteúdo de `nhost/schema.sql`
4. Execute e marque **"Track tables"**

### Obter Credenciais
- **Backend URL:** `https://xxxxx.nhost.app`
- **Admin Secret:** (em Settings → API)

---

## 🌐 2. Frontend (Netlify)

### Preparar
```bash
# Editar .env com credenciais do Nhost
cp .env.example .env

# Build
npm run build
```

### Deploy no Netlify
1. Acesse https://app.netlify.com
2. **"Add new site"** → **"Deploy manually"**
3. Arraste a pasta `dist`
4. Site publicado!

### Configurar Variáveis
No Netlify: **Site settings** → **Environment variables**
- `VITE_NHOST_BACKEND_URL` = `https://xxxxx.nhost.app`
- `VITE_HASURA_ADMIN_SECRET` = `sua_secret`

---

## 🔄 Deploy Automático (GitHub)

### No Netlify:
1. **"Add new site"** → **"Import an existing project"**
2. Conecte GitHub
3. Selecione `fabriciosergioC/mantes`
4. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Adicione variáveis de ambiente

### Automatismo:
Todo `git push` atualiza o site automaticamente!

---

## 📝 Comandos Úteis

```bash
# Desenvolvimento local
npm run dev

# Build para produção
npm run build

# Preview local da build
npm run preview
```

---

## ✅ Checklist

- [ ] Projeto Nhost criado
- [ ] Schema aplicado no banco
- [ ] Permissões configuradas no Hasura
- [ ] .env com credenciais corretas
- [ ] Frontend deployado
- [ ] Login testado
- [ ] Criação de OS testada

---

## 🔗 URLs

| Serviço | URL |
|---------|-----|
| Nhost Dashboard | https://app.nhost.io |
| Hasura Console | https://xxxxx.nhost.app/console |
| Seu Site | https://seu-site.netlify.app |

---

## 🆘 Problemas?

Veja `CONFIGURACAO-NHOST.md` para detalhes completos.
