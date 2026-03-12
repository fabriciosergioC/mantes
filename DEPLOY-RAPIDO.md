# 🚀 GUIA RÁPIDO DE DEPLOY - MANTES

## ✅ O que já está pronto:
- [x] Código no GitHub: https://github.com/fabriciosergioC/mantes
- [x] Banco Neon configurado
- [x] Netlify.toml configurado
- [x] API funcional testada localmente

---

## 🎯 DEPLOY EM 3 PASSOS:

### **PASSO 1: Criar site no Netlify**

1. **Acesse:** https://app.netlify.com/start
2. **Clique:** "Add new site" → "Import an existing project"
3. **Autorize** o Netlify a acessar seu GitHub
4. **Selecione** o repositório: `fabriciosergioC/mantes`
5. **Configure:**
   ```
   Base directory: (deixe em branco)
   Build command: echo 'Sem build'
   Publish directory: .
   Functions directory: netlify/functions
   ```
6. **Clique:** "Deploy site"

---

### **PASSO 2: Adicionar Variáveis de Ambiente**

No painel do Netlify:

1. **Vá em:** Site settings → Environment variables
2. **Clique:** "Add a variable"
3. **Adicione estas 3 variáveis:**

| Nome | Valor |
|------|-------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_SOX1qVtCHnR4@ep-autumn-sun-adsj6mve-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require` |
| `JWT_SECRET` | `mantes-production-secret-key-2024` |
| `NODE_ENV` | `production` |

---

### **PASSO 3: Aguardar Deploy**

1. O Netlify vai fazer o deploy automático (~2 minutos)
2. **Acesse:** `https://seu-site-aqui.netlify.app`
3. **Teste:**
   - Login: `meydya@mantes.com` / `123456`
   - Crie uma OS

---

## 🔄 DEPOIS DO DEPLOY:

### Atualizar o site:
```bash
git add .
git commit -m "sua mensagem"
git push
```
O Netlify atualiza automaticamente em ~1 minuto!

### Ver logs:
- **Deploy:** https://app.netlify.com/sites/seu-site/deploys
- **API:** https://app.netlify.com/sites/seu-site/functions → api → Logs

---

## 🎁 BÔNUS: Domínio Personalizado

1. Vá em **Domain settings** no Netlify
2. Clique em **"Add custom domain"**
3. Digite: `mantes.seudominio.com.br`
4. Configure o DNS no seu provedor:
   ```
   Tipo: CNAME
   Nome: mantes (ou @)
   Valor: seu-site.netlify.app
   ```

---

## ✅ CHECKLIST FINAL:

- [ ] Site criado no Netlify
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy inicial concluído
- [ ] Login testado
- [ ] Criação de OS testada
- [ ] Logs verificados

---

## 🆘 PRECISA DE AJUDA?

1. **Erro 500:** Verifique as variáveis de ambiente
2. **Banco não conecta:** Libere IP no Neon (0.0.0.0/0)
3. **API não responde:** Confira os logs das Functions

---

**📝 Anote a URL do seu site:** _____________________________
