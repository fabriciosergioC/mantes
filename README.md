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

## 🌐 Deploy na Vercel (Grátis - Sem Cartão)

### 🚀 Deploy Automático (Recomendado)

```bash
# 1. Rode o deploy
npm run deploy
```

O script fará:
- ✅ Instalar Vercel CLI
- ✅ Login na Vercel
- ✅ Deploy automático

**Após o deploy:**
1. Acesse https://vercel.com/dashboard
2. Vá em **"Settings"** → **"Environment Variables"**
3. Adicione:
   - `MONGODB_URI` = `mongodb+srv://fabricio:root@cluster0.i6kny0w.mongodb.net/mantes?retryWrites=true&w=majority`
   - `JWT_SECRET` = `mantes-secret-2026`
4. Redeploy: `vercel --prod`
5. Crie admin: **Functions** → **Console** → `npm run seed`

---

### 📋 Deploy Manual (Pelo Site)

1. **Acesse** https://vercel.com e login com GitHub

2. **Importe o repositório**
   - Clique em **"Add New..."** → **"Project"**
   - Selecione `mantes`
   - Clique **"Import"**

3. **Configure (opcional)**
   - Framework Preset: `Other`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Adicione Variáveis de Ambiente**
   ```
   MONGODB_URI = mongodb+srv://fabricio:root@cluster0.i6kny0w.mongodb.net/mantes?retryWrites=true&w=majority
   JWT_SECRET = mantes-secret-2026
   NODE_ENV = production
   ```

5. **Deploy!**
   - Clique em **"Deploy"**
   - URL: `https://mantes-xxxx.vercel.app`

6. **Criar admin**
   - Vá em **Functions** → **Console**
   - Rode: `npm run seed`

---

### ⚠️ MongoDB Atlas (Importante)

Libere todos os IPs no Atlas:
1. **Network Access** → **Add IP Address**
2. **Allow Access from Anywhere** (`0.0.0.0/0`)

---

### 📊 Limites do Plano Free

| Recurso | Limite |
|---------|--------|
| **Bandwidth** | 100 GB/mês |
| **Serverless Executions** | 100 GB-horas |
| **Tempo máx. função** | 10 segundos |
| **Domínios** | Ilimitados |

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
