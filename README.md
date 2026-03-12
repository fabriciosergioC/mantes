# 🚀 Mantes - Sistema de Gestão de Manutenção

## Stack Tecnológica

- **Frontend:** HTML, CSS, JavaScript (ES Modules)
- **Backend:** Nhost (PostgreSQL + Hasura GraphQL + Auth + Storage)
- **Deploy:** Netlify (frontend estático) + Nhost (backend)

---

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- Nhost CLI (`npm install -g nhost`)

### 1. Clonar repositório
```bash
git clone https://github.com/fabriciosergioC/mantes.git
cd mantes
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env
```

Edite `.env` com suas credenciais do Nhost.

---

## 🏃 Desenvolvimento Local

### Iniciar Nhost (Backend)
```bash
nhost up
```

Isso inicia:
- PostgreSQL (porta 5432)
- Hasura GraphQL (porta 8080)
- Nhost Auth (porta 4000)
- Nhost Storage (porta 8000)
- Gateway (porta 1337)

### Acessar Console
- **Hasura:** http://localhost:8080
- **Nhost:** http://localhost:3000

### Iniciar Frontend
```bash
# Com Vite (recomendado)
npm run dev

# Ou sirva os arquivos estáticos
npx http-server -p 8080
```

---

## 🗄️ Banco de Dados

### Aplicar Schema
```bash
nhost db apply -f nhost/schema.sql
```

### Tabelas
- `orders` - Ordens de Serviço
- `profiles` - Perfis de Usuários (vinculado a auth.users)

---

## 🔐 Autenticação

O Nhost Auth gerencia:
- Registro de usuários
- Login/Logout
- Recuperação de senha
- JWT tokens

### Login
```javascript
import { nhost } from './nhost.js';

const { session, user } = await nhost.auth.signIn({
  email: 'usuario@email.com',
  password: 'senha123'
});
```

---

## 📡 API GraphQL

### Exemplos

#### Listar OS
```graphql
query GetOS {
  orders(order_by: { data_abertura: desc }) {
    id
    numero
    cliente_id
    nome_cliente
    status
    tipo_solicitacao
    data_abertura
  }
}
```

#### Criar OS
```graphql
mutation CreateOS($object: orders_insert_input!) {
  insert_orders_one(object: $object) {
    id
    numero
    cliente_id
    status
  }
}
```

#### Buscar Perfil
```graphql
query GetProfile($id: uuid!) {
  profiles_by_pk(id: $id) {
    id
    nome
    email
    lider
  }
}
```

---

## 🌐 Deploy

### Frontend (Netlify/Vercel)
1. Build: `npm run build`
2. Publique a pasta raiz
3. Configure as variáveis de ambiente

### Backend (Nhost Cloud)
1. Crie projeto em https://app.nhost.io
2. Obtenha as credenciais
3. Atualize `.env` com:
   - `VITE_NHOST_BACKEND_URL`
   - `VITE_HASURA_ADMIN_SECRET`

---

## 📋 Variáveis de Ambiente

| Variável | Descrição | Padrão (dev) |
|----------|-----------|--------------|
| `VITE_NHOST_BACKEND_URL` | URL do backend Nhost | `http://localhost:1337` |
| `VITE_HASURA_ADMIN_SECRET` | Segredo do Hasura | `admin-secret-for-local-dev` |

---

## 🛠️ Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia Nhost local |
| `npm run build` | Build (sem build necessário) |
| `npm run seed` | Aplica seeds no banco |

---

## 📁 Estrutura

```
mantes/
├── nhost/
│   ├── nhost.yaml       # Config Nhost
│   └── schema.sql       # Schema do banco
├── nhost.js             # Config do cliente Nhost
├── main.js              # Lógica frontend
├── index.html           # Página principal
├── lider.html           # Área do líder
├── .env.example         # Exemplo de variáveis
└── package.json
```

---

## 📞 Suporte

- Nhost Docs: https://docs.nhost.io
- Hasura Docs: https://hasura.io/docs

---

## 📄 Licença

ISC
