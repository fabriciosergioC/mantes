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
