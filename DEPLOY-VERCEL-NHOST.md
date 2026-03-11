# 🚀 Deploy na Vercel - Mantes + Nhost

## Pré-requisitos

1. ✅ Projeto Nhost configurado
2. ✅ Conta na Vercel
3. ✅ Projeto no GitHub

---

## Passo 1: Push para GitHub

```bash
git add .
git commit -m "Migração para Nhost + Vite"
git push origin main
```

---

## Passo 2: Importar na Vercel

1. Acesse https://vercel.com
2. Clique em **"Add New Project"**
3. Importe o repositório `mantes` do GitHub
4. Em **Framework Preset**, selecione **Vite**

---

## Passo 3: Variáveis de Ambiente

Na Vercel, vá em **Settings** → **Environment Variables** e adicione:

```
NHOST_SUBDOMAIN=seu-projeto
NHOST_REGION=us-east-1
NHOST_GRAPHQL_ENDPOINT=https://seu-projeto.nhost.app/v1/graphql
NHOST_ADMIN_SECRET=sua-admin-secret
```

---

## Passo 4: Deploy

Clique em **"Deploy"**

A Vercel vai:
1. Instalar dependências (`npm install`)
2. Build (`npm run build`)
3. Deploy do `dist/`

---

## URLs

- **Produção:** `https://mantes-xxx.vercel.app`
- **Preview:** `https://mantes-git-branch-xxx.vercel.app`

---

## Configurar Domínio (Opcional)

1. Vercel → Settings → Domains
2. Adicione seu domínio
3. Configure DNS conforme instruções

---

## Atualizar Deploy

```bash
git push
```

A Vercel faz deploy automático!

---

## Comandos Úteis

```bash
# Build local
npm run build

# Preview local do build
npm run preview

# Deploy via CLI
vercel deploy --prod
```

---

## Troubleshooting

### Build falha
- Verifique logs em **Deployments** → **View Build Logs**
- Teste build local: `npm run build`

### Erro de CORS
- No Nhost: Settings → CORS → Adicione domínio da Vercel

### API não responde
- Verifique variáveis de ambiente
- Teste GraphQL endpoint no browser

---

**Pronto!** 🎉
