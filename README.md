# 🚀 Mantes - Sistema de Gestão de Manutenção

Sistema moderno para gestão de ordens de serviço com **MongoDB Atlas**.

---

## 📦 Instalação

```bash
npm install
```

## ⚙️ Configuração

Edite o arquivo `.env` com suas credenciais do MongoDB Atlas:

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/mantes
JWT_SECRET=seu_secret_aqui
PORT=3000
```

## 🏃 Rodar o Projeto

```bash
npm run dev
```

- **Frontend:** http://localhost:5173
- **API:** http://localhost:3000

## 🗄️ Banco de Dados

### Inicializar (criar usuário admin)

```bash
npm run seed
```

**Usuário padrão:**
- Email: `admin@mantes.com`
- Senha: `Mantes2026!`

---

## 🌐 Deploy no Render (Grátis)

### 🚀 Opção 1: Deploy Automático (Via CLI)

```bash
# 1. Instale a Render CLI
npm install -g @render-cli/cli

# 2. Faça login
render login

# 3. Rode o deploy
npm run deploy
```

O script fará:
- ✅ Login no Render
- ✅ Deploy automático
- ✅ Configuração inicial

**Após o deploy:**
1. Acesse https://dashboard.render.com
2. Vá em **"Environment Variables"** do serviço
3. Adicione `MONGODB_URI` com sua connection string do MongoDB Atlas
4. No **Console** do serviço, rode: `npm run seed`

---

### 📋 Opção 2: Deploy Manual (Pelo Site)

**1. Crie sua conta**
- Acesse https://render.com
- Faça login com GitHub

**2. Crie um novo serviço**
- Clique em **"New +"** → **"Web Service"**
- Conecte seu repositório GitHub (`mantes`)

**3. Configure o serviço**
| Campo | Valor |
|-------|-------|
| **Name** | `mantes` |
| **Region** | Oregon (ou mais próximo) |
| **Branch** | `main` |
| **Root Directory** | (deixe vazio) |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | **Free** |

**4. Adicione as Variáveis de Ambiente**
Em **"Environment"**, adicione:
```
NODE_ENV=production
PORT=8080
CORS_ORIGIN=*
JWT_SECRET=secreto-producao-aleatorio
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/mantes
```

**5. Deploy!**
- Clique em **"Create Web Service"**
- Aguarde o deploy (3-5 minutos)
- URL: `https://mantes-xxxx.onrender.com`

**6. Criar usuário admin**
- Vá em **"Console"** no painel do Render
- Rode: `npm run seed`

---

### 🗄️ MongoDB Atlas (Configuração Necessária)

Para o deploy funcionar, configure o MongoDB Atlas:

1. **Libere todos os IPs**
   - Vá em **"Network Access"** no Atlas
   - Adicione `0.0.0.0/0` (permitir todos)

2. **Copie a Connection String**
   - Vá em **"Clusters"** → **"Connect"**
   - Escolha **"Connect your application"**
   - Copie a string (ex: `mongodb+srv://user:pass@cluster.mongodb.net/mantes`)

3. **Cole no Render**
   - Environment Variables → `MONGODB_URI`

---

### ⚠️ Limitações do Plano Free

| Recurso | Limite |
|---------|--------|
| **Horas/mês** | 750 horas (suficiente para 1 app 24/7) |
| **RAM** | 512 MB |
| **CPU** | 0.5 vCPU |
| **Sleep** | Após 15 min de inatividade |
| **Builds/mês** | 100 horas |

**Dica:** O app "dorme" após 15 min sem acesso. A primeira requisição após o sleep leva ~30 segundos para responder.

---

## 📁 Estrutura

```
mantes/
├── server/
│   ├── index.js        # Servidor Express
│   ├── db.js           # Conexão MongoDB
│   ├── auth.js         # Autenticação
│   ├── seed.js         # Script de inicialização
│   └── routes/
│       ├── auth.js     # Rotas de autenticação
│       └── os.js       # Rotas de OS
├── api.js              # Cliente API frontend
├── main.js             # Lógica frontend
├── index.html          # Página principal
└── .env                # Variáveis de ambiente
```

---

## 🔧 API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Registro |
| GET | `/api/auth/me` | Dados do usuário |
| GET | `/api/os` | Listar OS |
| POST | `/api/os` | Criar OS |
| GET | `/api/os/:id` | Buscar OS |
| PUT | `/api/os/:id` | Atualizar OS |
| DELETE | `/api/os/:id` | Deletar OS |

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript (Vite)
- **Backend:** Node.js, Express
- **Banco:** MongoDB Atlas
- **Auth:** JWT + bcrypt

---

## 📝 License

ISC
