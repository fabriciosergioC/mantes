# 🚀 Guia Rápido de Deploy - Mantes

## Resumo em 5 Passos

### 1️⃣ MongoDB Atlas (Banco de Dados)
```
1. Acesse: https://cloud.mongodb.com
2. Crie conta grátis e um cluster M0
3. Database Access → Criar usuário (salve a senha!)
4. Network Access → Adicionar IP 0.0.0.0/0
5. Database → Connect → Copiar string de conexão
```

### 2️⃣ GitHub (Repositório)
```bash
cd C:\Users\fabri\Documents\PROJETOS\mantes
git init
git add .
git commit -m "Deploy inicial"
# Crie repo no GitHub e siga instruções para push
```

### 3️⃣ Render (Backend)
```
1. Acesse: https://render.com
2. New + → Web Service
3. Conecte seu repositório GitHub
4. Configurar:
   - Build: npm install
   - Start: npm start
5. Environment Variables:
   - MONGODB_URI: (sua string do Atlas)
   - JWT_SECRET: (gerar senha segura)
   - FRONTEND_URL: (URL da Netlify - passo 4)
   - NODE_ENV: production
```

### 4️⃣ Netlify (Frontend)
```
1. Acesse: https://netlify.com
2. Add new site → Import from GitHub
3. Selecione seu repositório
4. Deploy (sem build command)
5. Copie a URL: https://seu-site.netlify.app
```

### 5️⃣ Configurar CORS
```
1. Volte ao Render
2. Atualize FRONTEND_URL com URL da Netlify
3. Save Changes (reinicia o serviço)
```

---

## 📝 URLs Importantes

| Serviço | URL Exemplo | Onde Configurar |
|---------|-------------|-----------------|
| Frontend | https://mantes.netlify.app | Netlify |
| Backend | https://mantes.onrender.com | Render |
| Database | mongodb+srv://... | MongoDB Atlas |

---

## ✅ Testes

1. Acesse: `https://mantes.netlify.app`
2. Login: `lider@mantes.com` / `mantes2024`
3. Crie uma O.S.
4. Verifique em: `https://mantes.onrender.com/api/os`

---

## 🆘 Problemas Comuns

**CORS Error**: Verifique FRONTEND_URL no Render
**MongoDB Error**: Confira MONGODB_URI e Network Access
**404 Netlify**: Arquivos HTML devem estar na raiz

---

## 📚 Documentação Completa

Veja `DEPLOY.md` para instruções detalhadas.
