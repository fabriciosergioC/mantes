# Mantes — Sistema de Gestão de Manutenção

Sistema de abertura e gerenciamento de Ordens de Serviço (O.S.) para manutenção.

---

## 🚀 Stack Tecnológica

**Backend:**
- Node.js + Express
- MongoDB Atlas (banco de dados na nuvem)
- JWT (autenticação)
- Multer (upload de arquivos)

**Frontend:**
- HTML5, CSS3, JavaScript (vanilla)
- Design responsivo e moderno

**Deploy:**
- Render (backend + frontend)

---

## ⚡ Início Rápido

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar MongoDB Atlas

1. Crie conta em https://cloud.mongodb.com
2. Crie um cluster gratuito (M0)
3. Crie usuário em **Database Access**
4. Libere IP em **Network Access** → 0.0.0.0/0
5. Copie a string de conexão

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env` com sua string do MongoDB:
```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/mantes
JWT_SECRET=sua_chave_secreta
PORT=3000
```

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

O sistema abrirá em http://localhost:3000

---

## 📁 Estrutura do Projeto

```
mantes/
├── server.js           # Backend Express + MongoDB
├── main.js             # Lógica do frontend
├── index.html          # Formulário de abertura de O.S.
├── lider.html          # Painel do líder
├── reset-senha.html    # Reset de senha
├── package.json        # Dependências
├── render.yaml         # Configuração Render
├── .env.example        # Modelo de variáveis
└── README.md
```

---

## 🔌 API Endpoints

### Autenticação
```
POST /api/auth/login              - Login
POST /api/auth/change-password    - Alterar senha
```

### Ordens de Serviço
```
GET  /api/os                      - Listar todas
GET  /api/os/stats                - Estatísticas
GET  /api/os/next-number          - Próximo número
GET  /api/os/:id                  - Detalhes de uma OS
POST /api/os                      - Criar nova OS
PUT  /api/os/:id                  - Atualizar OS
DELETE /api/os/:id                - Remover OS
```

---

## 📊 Scripts

```bash
npm start          # Produção
npm run dev        # Desenvolvimento
```

---

## 🚀 Deploy no Render

### Opção 1: Usando render.yaml (Automático)

1. Acesse https://render.com
2. Login com GitHub
3. **New +** → **Blueprint**
4. Conecte seu repositório
5. O Render lê `render.yaml` automaticamente

### Opção 2: Manual

**Backend:**
1. **New +** → **Web Service**
2. Build: `npm install`
3. Start: `npm start`
4. Adicione variáveis: `MONGODB_URI`, `JWT_SECRET`

**Frontend:**
1. **New +** → **Static Site**
2. Build: `echo "Sem build"`
3. Publish: `.`

**Guia completo:** `DEPLOY-RENDER.md`

---

## 🔐 Login

No primeiro acesso, use qualquer email/senha. O sistema cria o usuário automaticamente.

---

## 📦 Dependências

```json
{
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.0.3",
  "multer": "^1.4.5-lts.1"
}
```

---

## 🎯 Funcionalidades

- ✅ MongoDB Atlas na nuvem
- ✅ Upload de arquivos (até 10MB)
- ✅ Autenticação JWT
- ✅ Status: Pendente, Aceita, Resolvida, Rejeitada
- ✅ Filtros e busca
- ✅ Observações/histórico
- ✅ Responsivo (mobile-first)

---

## ⚠️ Importante

- **Nunca commit o arquivo `.env`** no Git
- Em produção, use IPs específicos no MongoDB Atlas
- Use uma **JWT_SECRET** forte

---

## 📝 Deploy Rápido

```bash
# 1. MongoDB Atlas
https://cloud.mongodb.com → Criar cluster → Copiar URI

# 2. Render
https://render.com → Import projeto → Conectar MongoDB

# 3. Pronto!
```

---

**Desenvolvido com ❤️ | Powered by Render + MongoDB**
