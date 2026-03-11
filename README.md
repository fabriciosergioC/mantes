# Mantes - Sistema de Gestão de Manutenção

Sistema de abertura e gerenciamento de Ordens de Serviço (O.S.) para manutenção.

## ⚡ Teste Rápido (Sem MongoDB Atlas)

Para testar **imediatamente** sem configurar banco de dados:

```bash
# 1. Instale as dependências
npm install

# 2. Rode o servidor de teste (usa memória, não precisa de MongoDB)
npm run start:test

# 3. Abra o index.html no navegador
```

O servidor de teste roda em http://localhost:3000 e os dados são perdidos ao reiniciar.

---

## 🚀 Configuração com MongoDB Atlas

### 1. Criar conta no MongoDB Atlas

1. Acesse https://cloud.mongodb.com
2. Clique em **"Start for Free"** e crie sua conta
3. Crie um novo cluster (FREE tier disponível)
4. Aguarde a criação do cluster (pode levar alguns minutos)

### 2. Configurar acesso ao banco de dados

1. No menu lateral, clique em **"Database Access"**
2. Clique em **"+ ADD NEW DATABASE USER"**
3. Crie um usuário com:
   - **Username**: `mantes`
   - **Password**: (gerar senha segura e salvar)
   - **Database User Privileges**: "Read and write to any database"
4. Clique em **"Add User"**

### 3. Configurar whitelist de IPs

1. No menu lateral, clique em **"Network Access"**
2. Clique em **"+ ADD IP ADDRESS"**
3. Para desenvolvimento local, clique em **"ALLOW ACCESS FROM ANYWHERE"** (0.0.0.0/0)
   - ⚠️ Em produção, adicione apenas IPs específicos
4. Clique em **"Confirm"**

### 4. Obter string de conexão

1. No menu lateral, clique em **"Database"**
2. Clique em **"Connect"** no seu cluster
3. Escolha **"Connect your application"**
4. Copie a string de conexão (parecida com):
   ```
   mongodb+srv://mantes:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Substitua `<password>` pela senha que você criou

### 5. Configurar o projeto

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e cole sua string de conexão:
   ```env
   MONGODB_URI=mongodb+srv://mantes:sua_senha_aqui@cluster0.xxxxx.mongodb.net/mantes?retryWrites=true&w=majority
   JWT_SECRET=sua_chave_secreta_muito_segura_123456
   PORT=3000
   FRONTEND_URL=http://localhost:5500
   ```

### 6. Instalar dependências

```bash
npm install
```

### 7. Rodar o servidor

```bash
npm start
```

Ou para desenvolvimento com auto-reload:
```bash
npm run dev
```

### 8. Acessar o sistema

- **Frontend**: Abra `index.html` no navegador (use Live Server ou similar)
- **API**: http://localhost:3000

## 🧪 Scripts Disponíveis

```bash
# Servidor com MongoDB Atlas
npm start          # Produção
npm run dev        # Desenvolvimento (auto-reload)

# Servidor de teste (memória, sem MongoDB)
npm run start:test # Produção
npm run dev:test   # Desenvolvimento (auto-reload)

# Testar API via linha de comando
npm test

# Testar conexão com MongoDB Atlas
npm run test:db

# Gerenciar banco de dados
npm run db -- listar
npm run db -- stats
```

## 📁 Estrutura do Projeto

```
mantes/
├── server.js          # Servidor backend (Node.js + Express + MongoDB)
├── server-test.js     # Servidor de teste (apenas memória)
├── test-api.js        # Script para testar a API
├── index.html         # Formulário de abertura de O.S.
├── lider.html         # Painel do líder
├── package.json       # Dependências do projeto
├── .env               # Variáveis de ambiente (NÃO COMMITAR)
├── .env.example       # Exemplo de variáveis de ambiente
├── .gitignore         # Arquivos ignorados pelo Git
├── README.md          # Esta documentação
└── uploads/           # Arquivos anexados (criado automaticamente)
```

## 🔌 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login do usuário
- `POST /api/auth/change-password` - Alterar senha

### Ordens de Serviço
- `GET /api/os` - Listar todas as O.S.
- `GET /api/os/stats` - Estatísticas das O.S.
- `GET /api/os/next-number` - Próximo número de O.S.
- `GET /api/os/:id` - Detalhes de uma O.S.
- `POST /api/os` - Criar nova O.S.
- `PUT /api/os/:id` - Atualizar O.S. (status, observações)
- `DELETE /api/os/:id` - Remover O.S.

## 🔐 Login Padrão

No primeiro acesso, use:
- **Email**: `lider@mantes.com`
- **Senha**: `mantes2024` (ou a que estiver configurada no localStorage)

## 📦 Recursos

- ✅ Banco de dados MongoDB Atlas na nuvem
- ✅ Upload de arquivos (até 1GB por arquivo)
- ✅ Autenticação com JWT
- ✅ Status: Pendente, Enviada, Resolvida, Rejeitada
- ✅ Filtros por status, tipo e CNPJ
- ✅ Envio de e-mail via EmailJS (opcional)
- ✅ Responsivo (mobile-friendly)

## 🛠️ Tecnologias

**Backend:**
- Node.js
- Express
- MongoDB (Mongoose)
- JWT (autenticação)
- Bcrypt (hash de senha)
- Multer (upload de arquivos)

**Frontend:**
- HTML5, CSS3, JavaScript
- EmailJS (envio de e-mails)

## ⚠️ Importante

- **Nunca commit o arquivo `.env`** no Git (já está no `.gitignore`)
- Em produção, configure o **Network Access** do MongoDB Atlas para permitir apenas IPs específicos
- Use uma **JWT_SECRET** forte em produção
- Configure **CORS** no backend para permitir apenas seu domínio de produção

## 📝 Modo Offline

O sistema possui fallback para **localStorage**. Se a API estiver indisponível, os dados serão salvos localmente no navegador.

---

Desenvolvido com ❤️ para o Sistema Mantes
