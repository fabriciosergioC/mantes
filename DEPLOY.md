# 🚀 Deploy na Vercel

## Configuração Realizada

O projeto foi configurado para deploy na Vercel com:

- **Frontend**: Build estático via Vite (`dist/`)
- **Backend**: Serverless function em `/api/index.js`
- **Região**: `gru` (São Paulo) para menor latência

## Passo a Passo

### 1. Prepare as variáveis de ambiente

No painel da Vercel, configure as seguintes variáveis:

```
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/mantes?retryWrites=true&w=majority
JWT_SECRET=seu-segredo-forte
PORT=8080
CORS_ORIGIN=*
```

### 2. Conecte o repositório na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Add New Project"**
3. Importe o repositório do GitHub
4. Adicione as variáveis de ambiente
5. Clique em **"Deploy"**

### 3. Estrutura de rotas

- `/api/*` → Serverless function (backend)
- `/*` → Frontend estático (SPA com Vite)

### 4. Comandos

```bash
# Build local para teste
npm run build

# Preview local
npm run preview

# Deploy na Vercel (CLI)
vercel --prod
```

## Links Úteis

- [Dashboard Vercel](https://vercel.com/dashboard)
- [Docs Vercel](https://vercel.com/docs)
- [MongoDB Atlas](https://cloud.mongodb.com)
