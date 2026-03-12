# 🚀 Passo a Passo Completo - Deploy no Netlify + Neon

Guia **detalhado** para colocar o sistema Mantes no ar usando **apenas Netlify** e **Neon PostgreSQL**.

> ✅ **Sem Render** - Tudo serverless e gratuito!

---

## 📋 Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────┐
│              NETLIFY (Gratuito)                 │
│  ┌─────────────┐    ┌─────────────────────┐    │
│  │  Frontend   │    │  Netlify Functions  │    │
│  │  (HTML/CSS) │───▶│  (Backend API)      │    │
│  │             │    │  - Auth             │    │
│  │             │    │  - CRUD OS          │    │
│  └─────────────┘    └─────────────────────┘    │
└─────────────────────────────────────────────────┘
                      │
                      ▼
         ┌─────────────────────────┐
         │    Neon PostgreSQL      │
         │   (Banco Serverless)    │
         │   - Não expira         │
         │   - 0.5 GB grátis      │
         └─────────────────────────┘
```

---

## ETAPA 1: Criar Banco no Neon (5 minutos)

### Passo 1.1 - Acessar Neon

```
1. Abra: https://neon.tech
2. Clique em "Try Neon for free"
3. Login com GitHub (autorize o acesso)
```

### Passo 1.2 - Criar Projeto

```
1. Clique em "Create a project"
2. Preencha:
   - Project name: mantes
   - Compute size: Free
   - Region: Oregon (US West) ← Mais próximo do Brasil
3. Clique em "Create project"
```

### Passo 1.3 - Aguardar Criação

```
⏳ Aguarde 30-60 segundos até aparecer o dashboard
```

### Passo 1.4 - Copiar Connection String

```
1. No canto superior direito, clique em "Connect"
2. Em "Connection string", selecione "URI" (aba)
3. Clique em "Copy"
4. Salve em um bloco de notas (você vai usar no Netlify)

Formato:
postgresql://user:senha@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
```

### Passo 1.5 - Verificar Dados da Conexão

```
Anote também:
- Host: ep-xxx.us-east-2.aws.neon.tech
- Database: dbname (geralmente "neondb" ou o nome do projeto)
- User: user
- Password: senha

Você pode precisar disso depois!
```

---

## ETAPA 2: Criar as Tabelas no Banco

### Passo 2.1 - Acessar Editor SQL

```
1. No menu lateral esquerdo, clique em "SQL Editor"
2. Uma área de texto em branco aparecerá
```

### Passo 2.2 - Executar Script

```
1. Abra o arquivo "database.sql" do projeto no Bloco de Notas
2. Copie TODO o conteúdo (Ctrl+A, Ctrl+C)
3. Cole no editor SQL do Neon
4. Clique em "Run" ou "Execute" (botão ▶ no topo)
```

### Passo 2.3 - Verificar Tabelas

```
1. Menu lateral → "Tables"
2. Devem aparecer:
   - users
   - orders
```

### Passo 2.4 - Verificar Estrutura (Opcional)

```
1. Clique em "users" → veja as colunas
2. Clique em "orders" → veja as colunas
```

✅ **Sucesso!** Se as tabelas aparecerem, o banco está pronto!

---

## ETAPA 3: Preparar o Projeto no GitHub

### Passo 3.1 - Verificar se tem Git

```bash
# No terminal do VS Code:
git status
```

Se aparecer "not a git repository":
```bash
git init
```

### Passo 3.2 - Adicionar Arquivos

```bash
git add .
git commit -m "Configuração inicial Mantes"
```

### Passo 3.3 - Criar Repositório no GitHub

```
1. Acesse: https://github.com/new
2. Preencha:
   - Repository name: mantes
   - Visibility: Public (ou Private se preferir)
   - NÃO marque "Initialize with README"
3. Clique em "Create repository"
```

### Passo 3.4 - Enviar Código

```bash
# Copie o comando que o GitHub mostrar:
git remote add origin https://github.com/SEU-USUARIO/mantes.git
git branch -M main
git push -u origin main
```

### Passo 3.5 - Verificar no GitHub

```
1. Acesse: https://github.com/SEU-USUARIO/mantes
2. Verifique se os arquivos aparecem
```

---

## ETAPA 4: Deploy no Netlify

### Passo 4.1 - Criar Conta no Netlify

```
1. Acesse: https://app.netlify.com
2. Clique em "Sign up"
3. Login com GitHub (autorize o acesso)
```

### Passo 4.2 - Importar Projeto

```
1. Clique em "Add new site"
2. Selecione "Import an existing project"
3. Clique em "GitHub"
4. Autorize o Netlify a acessar seus repositórios
5. Encontre e clique em "mantes"
```

### Passo 4.3 - Configurar Build

```
Preencha assim:

┌─────────────────────────────────────────┐
│ Configure build settings                │
├─────────────────────────────────────────┤
│ Base directory:         [deixe vazio]   │
│ Build command:          echo 'Sem build'│
│ Publish directory:      .               │
│ Functions directory:    netlify/functions│
└─────────────────────────────────────────┘
```

### Passo 4.4 - Adicionar Variáveis de Ambiente

```
1. Clique em "Show advanced"
2. Role até "Environment variables"
3. Clique em "Add a variable"

Adicione UMA POR UMA (3 variáveis):

┌──────────────────────────────────────────┐
│ Key: DATABASE_URL                        │
│ Value: (cole a connection string do Neon)│
│       postgresql://user:senha@...        │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ Key: JWT_SECRET                          │
│ Value: mantes2024secretkey               │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ Key: NODE_ENV                            │
│ Value: production                        │
└──────────────────────────────────────────┘
```

### Passo 4.5 - Iniciar Deploy

```
1. Clique em "Deploy site"
2. Aguarde o build (2-5 minutos)
3. Você verá o log em tempo real
4. Quando aparecer "Site is live", está pronto!
```

### Passo 4.6 - Anotar URL do Site

```
No topo da página aparecerá:
https://seu-site-aleatorio.netlify.app

COPIE ESSA URL!
```

---

## ETAPA 5: Testar o Sistema

### Passo 5.1 - Acessar Frontend

```
1. Abra a URL: https://seu-site-aleatorio.netlify.app
2. Deve aparecer a tela de login do Mantes
```

### Passo 5.2 - Fazer Primeiro Login

```
Email: admin@mantes.com
Senha: admin123

(No primeiro login, o sistema cria o usuário automaticamente)
```

### Passo 5.3 - Testar Criação de OS

```
1. Preencha o formulário:
   - Cliente, CNPJ, Telefone
   - Técnico, Líder, Email
   - Tipo de solicitação
   - Descrição
2. Clique em "Criar Ordem de Serviço"
3. ✅ Deve aparecer: "OS criada com sucesso!"
```

### Passo 5.4 - Testar Painel do Líder

```
1. Acesse: https://seu-site-aleatorio.netlify.app/lider.html
2. Digite a senha: mantes2024
3. Clique em "Acessar Painel"
4. ✅ Deve aparecer a OS que você criou
```

### Passo 5.5 - Testar API

```
1. Acesse: https://seu-site-aleatorio.netlify.app/api/os/stats
2. ✅ Deve aparecer JSON com estatísticas:
   {"total":1,"pending":1,"accepted":0,...}
```

---

## ETAPA 6: Personalizar URL (Opcional)

### Passo 6.1 - Mudar Nome do Site

```
1. No Netlify → "Site settings"
2. Em "Site details", clique em "Change site name"
3. Digite: mantes-seunome
4. Clique em "Save"

Nova URL: https://mantes-seunome.netlify.app
```

---

## 🐛 Troubleshooting (Problemas Comuns)

### Erro: "Database connection failed"

**Causa:** DATABASE_URL incorreta

**Solução:**
```
1. Netlify → Site settings → Environment variables
2. Verifique se DATABASE_URL está correta
3. No Neon → Connect → copie novamente a URI
4. Netlify → Deploys → "Trigger deploy" para reiniciar
```

---

### Erro: "Function not found" ou 404 em /api/*

**Causa:** Functions não foram publicadas

**Solução:**
```
1. Verifique se a pasta netlify/functions/api.js existe
2. Netlify → Deploys → Verifique se há erros no build log
3. Procure por "functions" no log
4. Verifique o netlify.toml
```

---

### Erro: "CORS error" no console

**Causa:** Frontend chamando URL errada

**Solução:**
```
Verifique no main.js e lider.html:
- Em produção deve usar: '/api' (relativo)
- NÃO use URL absoluta externa
```

---

### Erro: "Token inválido" ao logar

**Causa:** JWT_SECRET não configurada

**Solução:**
```
1. Netlify → Site settings → Environment variables
2. Adicione: JWT_SECRET = mantes2024secretkey
3. Netlify → Deploys → "Trigger deploy"
```

---

### Site aparece em branco

**Causa:** Erro no JavaScript

**Solução:**
```
1. Pressione F12 no navegador
2. Vá em "Console"
3. Veja o erro e verifique:
   - API_URL está correto?
   - Funções estão sendo carregadas?
```

---

### Erro: "SSL error" ao conectar no banco

**Causa:** Falta sslmode=require na connection string

**Solução:**
```
No Neon → Connect → URI
Verifique se termina com: ?sslmode=require
```

---

## 📊 Verificar Status do Deploy

### No Netlify:

```
1. Dashboard → Clique no site
2. "Deploys" → Veja o histórico
3. Clique no deploy para ver logs
4. "Functions" → Veja logs das funções API
```

### Logs em Tempo Real:

```
1. Deploys → Clique no deploy atual
2. Role para ver "Server log"
3. Veja erros de functions
```

### No Neon:

```
1. Projeto → "Dashboard"
2. Veja:
   - Storage usage
   - Active connections
   - Compute time
```

---

## 🔄 Atualizar o Sistema

Sempre que fizer alterações:

```bash
# No VS Code:
git add .
git commit -m "Descrição da mudança"
git push
```

**O Netlify faz deploy automático!**

Para ver o progresso:
```
1. Netlify → Dashboard → Clique no site
2. "Deploys" → Veja o deploy em andamento
3. Aguarde 1-2 minutos
```

---

## 📱 URLs Finais

| Página | URL |
|--------|-----|
| Frontend | https://seu-site.netlify.app |
| Painel Líder | https://seu-site.netlify.app/lider.html |
| API | https://seu-site.netlify.app/api |
| Reset Senha | https://seu-site.netlify.app/reset-senha.html |

---

## ⚠️ Limitações (Plano Free)

### Netlify
- **100GB** bandwidth/mês
- **125k** function invocations/mês
- **Function timeout**: 10 segundos
- **Build minutes**: 300 minutos/mês

### Neon
- **0.5 GB** storage
- **Compute**: 0.25 vCPU
- **Não expira** ✅

---

## ✅ Checklist Final

- [ ] Conta Neon criada
- [ ] Projeto "mantes" criado no Neon
- [ ] Connection string copiada
- [ ] Tabelas users e orders criadas
- [ ] Repositório no GitHub
- [ ] Código enviado (push)
- [ ] Conta Netlify criada
- [ ] Site importado no Netlify
- [ ] Build configurado corretamente
- [ ] Variável DATABASE_URL configurada
- [ ] Variável JWT_SECRET configurada
- [ ] Variável NODE_ENV configurada
- [ ] Deploy realizado com sucesso
- [ ] Login funcionando
- [ ] Criação de OS funcionando
- [ ] Painel do líder funcionando
- [ ] API respondendo

---

## 💡 Dicas Importantes

1. **Nunca compartilhe** sua `DATABASE_URL`
2. **Sempre use HTTPS** nas URLs
3. **Faça backup** do banco periodicamente (Neon tem histórico)
4. **Monitore** o uso do Netlify e Neon
5. **Teste localmente** antes de fazer push

---

## 🎉 PARABÉNS!

Seu sistema Mantes está no ar usando:
- ✅ **Netlify** (frontend + backend serverless)
- ✅ **Neon** (PostgreSQL serverless)
- ✅ **100% gratuito**
- ✅ **Sem Render**

**Próximos passos:**
- Personalize a URL no Netlify
- Configure um domínio próprio (opcional)
- Monitore o uso nos dashboards

---

**Dúvidas?** Consulte os logs no Netlify Dashboard ou Neon Dashboard.
