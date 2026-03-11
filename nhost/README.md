# Configuração do Nhost

## Variáveis de Ambiente

Copie `.env.example` para `.env` e preencha com os dados do seu projeto Nhost:

```env
# Nhost Config
NHOST_APP_ID=seu-app-id
NHOST_GRAPHQL_ENDPOINT=https://seu-projeto.nhost.app/v1/graphql
NHOST_ADMIN_SECRET=sua-admin-secret
NHOST_AUTH_URL=https://seu-projeto.nhost.app/auth
NHOST_STORAGE_URL=https://seu-projeto.nhost.app/storage

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:5500

# Para produção
PRODUCTION_URL=https://seu-site.vercel.app
```

## Como obter as credenciais do Nhost

1. Acesse https://console.nhost.io
2. Crie um novo projeto (ou selecione um existente)
3. Vá em **Settings** → **API**
4. Copie:
   - GraphQL Endpoint
   - Admin Secret
   - App ID

## Schema

O schema GraphQL está em `nhost/schema.graphql`

Para aplicar o schema:
1. No console do Nhost, vá em **Data** → **Data API**
2. Use a interface do Hasura para criar as tabelas
3. Ou importe o schema via CLI do Nhost

## Storage

Para configurar o bucket de arquivos:
1. Vá em **Storage** → **Buckets**
2. Crie um bucket chamado `os-arquivos`
3. Configure as permissões de acesso
