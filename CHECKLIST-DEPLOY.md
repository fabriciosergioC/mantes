# ✅ Sistema Mantes - Pronto para Deploy

## 📁 Arquivos Criados para Deploy

| Arquivo | Função |
|---------|--------|
| `netlify.toml` | Configuração do frontend na Netlify |
| `render.yaml` | Configuração do backend no Render |
| `DEPLOY.md` | Guia completo de deploy |
| `DEPLOY-RAPIDO.md` | Guia rápido em 5 passos |
| `uploads/.gitkeep` | Manter pasta uploads no Git |

## 🔄 Arquivos Modificados

| Arquivo | Alteração |
|---------|-----------|
| `lider.html` | URL da API dinâmica (localhost/produção) |
| `index.html` | URL da API dinâmica (localhost/produção) |
| `package.json` | Adicionado `engines.node` |
| `.gitignore` | Atualizado para uploads |

---

## 🚀 Checklist de Deploy

### 1. MongoDB Atlas
- [ ] Conta criada em https://cloud.mongodb.com
- [ ] Cluster M0 (free) criado
- [ ] Usuário do banco criado (salve a senha!)
- [ ] Network Access: 0.0.0.0/0
- [ ] String de conexão copiada

### 2. GitHub
- [ ] Conta criada em https://github.com
- [ ] Repositório criado
- [ ] Código enviado:
```bash
git init
git add .
git commit -m "Deploy inicial - Sistema Mantes"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/mantes.git
git push -u origin main
```

### 3. Render (Backend)
- [ ] Conta criada em https://render.com
- [ ] Web Service criado
- [ ] Repositório GitHub conectado
- [ ] Variáveis de ambiente configuradas:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `FRONTEND_URL` (preencher após deploy da Netlify)
  - `NODE_ENV = production`
- [ ] URL do backend anotada (ex: `https://mantes.onrender.com`)

### 4. Netlify (Frontend)
- [ ] Conta criada em https://netlify.com
- [ ] Site importado do GitHub
- [ ] Deploy realizado
- [ ] URL anotada (ex: `https://mantes.netlify.app`)

### 5. Configuração Final
- [ ] Atualizar `FRONTEND_URL` no Render com URL da Netlify
- [ ] Testar login no frontend
- [ ] Criar O.S. de teste
- [ ] Verificar se dados aparecem no painel

---

## 🧪 Testes Pós-Deploy

### Testar API
```bash
# Substitua pela URL do seu backend
curl https://mantes-backend.onrender.com/api/os
```
Deve retornar: `[]`

### Testar Frontend
1. Acesse: `https://mantes.netlify.app`
2. Login: `lider@mantes.com`
3. Senha: `mantes2024`
4. Crie uma O.S. com anexo
5. Verifique no painel do líder

---

## 📊 Arquitetura do Deploy

```
┌─────────────────────────┐
│   Usuário Acessa        │
│   mantes.netlify.app    │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   Netlify (Frontend)    │
│   - index.html          │
│   - lider.html          │
│   - CSS/JS              │
└───────────┬─────────────┘
            │ API Calls
            ▼
┌─────────────────────────┐
│   Render (Backend)      │
│   - server.js           │
│   - Express API         │
│   - JWT Auth            │
└───────────┬─────────────┘
            │ MongoDB Driver
            ▼
┌─────────────────────────┐
│   MongoDB Atlas         │
│   - Database mantes     │
│   - Coleção os          │
│   - Coleção users       │
└─────────────────────────┘
```

---

## 🔗 URLs Importantes

| Serviço | Sua URL |
|---------|---------|
| Frontend (Netlify) | `https://_____.netlify.app` |
| Backend (Render) | `https://_____.onrender.com` |
| Database (Atlas) | `mongodb+srv://_____.mongodb.net` |
| GitHub Repo | `https://github.com/_____/mantes` |

---

## ⚠️ Atenção

1. **Render Free Tier**: O serviço "dorme" após 15 min de inatividade
   - Primeira requisição pode levar 30-50 segundos
   - Solução: Use UptimeRobot (grátis) para manter ativo

2. **MongoDB Atlas**: Network Access 0.0.0.0/0 permite qualquer IP
   - Em produção, restrinja para IPs específicos se possível

3. **JWT_SECRET**: Use uma chave forte e única em produção
   - Gerador: https://generate-secret.vercel.app/32

4. **Variáveis de Ambiente**: Nunca commit `.env` no GitHub!

---

## 📞 Suporte

- **Netlify**: https://docs.netlify.com
- **Render**: https://render.com/docs
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas
- **EmailJS** (opcional): https://www.emailjs.com/docs

---

## 🎯 Próximos Melhorias

- [ ] Domínio personalizado
- [ ] HTTPS automático (já incluso na Netlify/Render)
- [ ] Backup automático do MongoDB
- [ ] Monitoramento com UptimeRobot
- [ ] Logs centralizados
- [ ] Rate limiting na API
- [ ] Cache de imagens

---

**Sistema Mantes** - Pronto para produção! 🚀
