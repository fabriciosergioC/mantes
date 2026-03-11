/**
 * Servidor de Teste Mantes (MODO OFFLINE)
 * 
 * Este servidor usa memória em vez do MongoDB Atlas.
 * Ideal para testes rápidos sem configuração de banco de dados.
 * 
 * Execute: node server-test.js
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ── BANCO EM MEMÓRIA ────────────────────────────────────────────
let osRecords = [];
let users = [];
let osCounter = 1000;

// Criar usuário padrão
(async () => {
  const senhaHash = await bcrypt.hash('mantes2024', 10);
  users.push({
    _id: 'user-1',
    nome: 'Administrador',
    email: 'lider@mantes.com',
    senhaHash,
    lider: true
  });
})();

// Simular ID do MongoDB
function generateId() {
  return 'os-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Configuração do multer para uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 } // 1GB
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(uploadDir));

console.log('🧪 MODO DE TESTE - Dados em memória (não persistem após reiniciar)');
console.log('📦 Uploads em:', uploadDir);

// ── ROTAS DE AUTENTICAÇÃO ─────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    let user = users.find(u => u.email === email);
    if (!user) {
      // Criar usuário se não existir
      const senhaHash = await bcrypt.hash(senha, 10);
      user = {
        _id: generateId(),
        nome: 'Usuário',
        email,
        senhaHash,
        lider: true
      };
      users.push(user);
    }

    const valid = await bcrypt.compare(senha, user.senhaHash);
    if (!valid) return res.status(401).json({ error: 'Senha incorreta' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'teste', {
      expiresIn: '7d'
    });

    res.json({ 
      token, 
      user: { id: user._id, nome: user.nome, email: user.email } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/change-password', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'teste');
    
    const user = users.find(u => u._id === decoded.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const { senhaAtual, novaSenha } = req.body;
    const valid = await bcrypt.compare(senhaAtual, user.senhaHash);
    if (!valid) return res.status(401).json({ error: 'Senha atual incorreta' });

    user.senhaHash = await bcrypt.hash(novaSenha, 10);
    res.json({ message: 'Senha alterada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ROTAS DE ORDENS DE SERVIÇO ────────────────────────────────
app.get('/api/os', async (req, res) => {
  try {
    const { status, tipo, cnpj } = req.query;
    let filtered = osRecords;

    if (status) filtered = filtered.filter(os => os.status === status);
    if (tipo) filtered = filtered.filter(os => os.tipoSolicitacao === tipo);
    if (cnpj) filtered = filtered.filter(os => os.cnpj?.includes(cnpj));

    res.json(filtered.sort((a, b) => new Date(b.dataAbertura) - new Date(a.dataAbertura)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/os/stats', async (req, res) => {
  try {
    const total = osRecords.length;
    const pending = osRecords.filter(os => os.status === 'pending').length;
    const accepted = osRecords.filter(os => os.status === 'accepted').length;
    const resolved = osRecords.filter(os => os.status === 'resolved').length;
    const rejected = osRecords.filter(os => os.status === 'rejected').length;

    res.json({ total, pending, accepted, resolved, rejected });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/os/next-number', async (req, res) => {
  try {
    const nextNum = osCounter + 1;
    res.json({ numero: 'OS-' + String(nextNum).padStart(5, '0') });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/os', upload.array('arquivos', 10), async (req, res) => {
  try {
    const {
      clienteId, cnpj, nomeCliente, telefone,
      nomeTecnico, lider, emailLider, tipoSolicitacao, descricao
    } = req.body;

    osCounter++;
    const numero = 'OS-' + String(osCounter).padStart(5, '0');

    const arquivos = req.files?.map(file => ({
      nome: file.originalname,
      tipo: file.mimetype,
      tamanho: file.size,
      caminho: file.path,
      url: `/uploads/${file.filename}`
    })) || [];

    const os = {
      _id: generateId(),
      numero,
      clienteId,
      cnpj,
      nomeCliente,
      telefone,
      nomeTecnico,
      lider,
      emailLider,
      tipoSolicitacao,
      descricao,
      arquivos,
      status: 'pending',
      observacoes: [],
      dataAbertura: new Date(),
      dataFechamento: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    osRecords.push(os);
    console.log(`✅ O.S. criada: ${numero} (${osRecords.length} total)`);

    res.status(201).json(os);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/os/:id', async (req, res) => {
  try {
    const os = osRecords.find(os => os._id === req.params.id);
    if (!os) return res.status(404).json({ error: 'OS não encontrada' });
    res.json(os);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/os/:id', async (req, res) => {
  try {
    const { status, observacao } = req.body;
    const os = osRecords.find(os => os._id === req.params.id);
    
    if (!os) return res.status(404).json({ error: 'OS não encontrada' });

    if (status) os.status = status;
    if (observacao) {
      os.observacoes.push({
        texto: observacao,
        data: new Date()
      });
    }
    if (status === 'resolved') os.dataFechamento = new Date();
    
    os.updatedAt = new Date();

    res.json(os);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/os/:id', async (req, res) => {
  try {
    const index = osRecords.findIndex(os => os._id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'OS não encontrada' });

    const os = osRecords[index];
    
    // Remover arquivos físicos
    os.arquivos?.forEach(file => {
      if (file.caminho && fs.existsSync(file.caminho)) {
        fs.unlinkSync(file.caminho);
      }
    });

    osRecords.splice(index, 1);
    res.json({ message: 'OS removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── INICIALIZAÇÃO ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor de teste rodando em http://localhost:${PORT}`);
  console.log(`📝 Login padrão: lider@mantes.com / mantes2024`);
  console.log(`⚠️  Dados em memória - serão perdidos ao reiniciar\n`);
});
