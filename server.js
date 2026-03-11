require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

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

// Conexão com MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Atlas conectado!'))
  .catch(err => console.error('❌ Erro ao conectar MongoDB:', err));

// ── MODELOS ────────────────────────────────────────────────────
const osSchema = new mongoose.Schema({
  numero: { type: String, required: true, unique: true },
  clienteId: String,
  cnpj: String,
  nomeCliente: String,
  telefone: String,
  nomeTecnico: String,
  lider: String,
  emailLider: String,
  tipoSolicitacao: String,
  descricao: String,
  arquivos: [{
    nome: String,
    tipo: String,
    tamanho: Number,
    caminho: String,
    url: String
  }],
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'resolved', 'rejected'],
    default: 'pending'
  },
  observacoes: [{
    texto: String,
    data: { type: Date, default: Date.now }
  }],
  dataAbertura: { type: Date, default: Date.now },
  dataFechamento: Date
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senhaHash: { type: String, required: true },
  lider: { type: Boolean, default: true }
});

const OS = mongoose.model('OS', osSchema);
const User = mongoose.model('User', userSchema);

// ── MIDDLEWARE DE AUTENTICAÇÃO ────────────────────────────────
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// ── ROTAS DE AUTENTICAÇÃO ─────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    console.log(`🔐 Login attempt - Email: ${email}`);

    // Primeiro login: cria usuário admin se não existir
    let user = await User.findOne({ email });
    
    if (!user) {
      console.log(`👤 Usuário não encontrado, criando: ${email}`);
      const senhaHash = await bcrypt.hash(senha, 10);
      user = await User.create({
        nome: 'Administrador',
        email,
        senhaHash,
        lider: true
      });
      console.log(`✅ Usuário criado com ID: ${user._id}`);
    } else {
      console.log(`✅ Usuário encontrado: ${user._id}`);
    }

    const valid = await bcrypt.compare(senha, user.senhaHash);
    console.log(`🔑 Senha válida: ${valid}`);
    
    if (!valid) {
      console.log(`❌ Senha incorreta para ${email}`);
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    console.log(`✅ Login bem-sucedido: ${email}`);
    res.json({ token, user: { id: user._id, nome: user.nome, email: user.email } });
  } catch (err) {
    console.error(`❌ Erro no login:`, err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/change-password', authMiddleware, async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body;
    const user = await User.findById(req.userId);

    const valid = await bcrypt.compare(senhaAtual, user.senhaHash);
    if (!valid) return res.status(401).json({ error: 'Senha atual incorreta' });

    user.senhaHash = await bcrypt.hash(novaSenha, 10);
    await user.save();

    res.json({ message: 'Senha alterada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ROTAS DE ORDENS DE SERVIÇO ────────────────────────────────
app.get('/api/os', async (req, res) => {
  try {
    const { status, tipo, cnpj } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (tipo) filter.tipoSolicitacao = tipo;
    if (cnpj) filter.cnpj = { $regex: cnpj.replace(/\D/g, '') };

    const osList = await OS.find(filter).sort({ dataAbertura: -1 });
    res.json(osList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/os/stats', async (req, res) => {
  try {
    const total = await OS.countDocuments();
    const pending = await OS.countDocuments({ status: 'pending' });
    const accepted = await OS.countDocuments({ status: 'accepted' });
    const resolved = await OS.countDocuments({ status: 'resolved' });
    const rejected = await OS.countDocuments({ status: 'rejected' });

    res.json({ total, pending, accepted, resolved, rejected });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/os/next-number', async (req, res) => {
  try {
    const lastOS = await OS.findOne().sort({ numero: -1 });
    const nextNum = lastOS ? parseInt(lastOS.numero.replace('OS-', '')) + 1 : 1001;
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

    // Gera número da OS
    const lastOS = await OS.findOne().sort({ numero: -1 });
    const nextNum = lastOS ? parseInt(lastOS.numero.replace('OS-', '')) + 1 : 1001;
    const numero = 'OS-' + String(nextNum).padStart(5, '0');

    // Processa arquivos
    const arquivos = req.files?.map(file => ({
      nome: file.originalname,
      tipo: file.mimetype,
      tamanho: file.size,
      caminho: file.path,
      url: `/uploads/${file.filename}`
    })) || [];

    const os = await OS.create({
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
      status: 'pending'
    });

    res.status(201).json(os);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/os/:id', async (req, res) => {
  try {
    const os = await OS.findById(req.params.id);
    if (!os) return res.status(404).json({ error: 'OS não encontrada' });
    res.json(os);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/os/:id', async (req, res) => {
  try {
    const { status, observacao } = req.body;

    console.log(`📝 Recebida atualização para O.S. ${req.params.id}:`, { status, observacao });

    // Build update object usando $set para campos diretos
    const update = { $set: {} };

    if (status) {
      update.$set.status = status;
    }
    
    if (status === 'resolved') {
      update.$set.dataFechamento = new Date();
    }

    // Use $push para observacoes array
    if (observacao) {
      update.$push = {
        observacoes: { texto: observacao, data: new Date() }
      };
    }

    // Remove $set vazio
    if (Object.keys(update.$set).length === 0) {
      delete update.$set;
    }

    console.log('🔧 Update enviado ao MongoDB:', JSON.stringify(update));

    const os = await OS.findByIdAndUpdate(req.params.id, update, { new: true });

    if (!os) return res.status(404).json({ error: 'OS não encontrada' });

    console.log(`✅ O.S. ${os.numero} atualizada para status: ${os.status}`);
    console.log(`📝 Observações adicionadas: ${observacao ? 'SIM' : 'NÃO'}`);
    res.json(os);
  } catch (err) {
    console.error('Erro ao atualizar O.S.:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/os/:id', async (req, res) => {
  try {
    const os = await OS.findByIdAndDelete(req.params.id);
    if (!os) return res.status(404).json({ error: 'OS não encontrada' });

    // Remove arquivos físicos
    os.arquivos?.forEach(file => {
      if (file.caminho && fs.existsSync(file.caminho)) {
        fs.unlinkSync(file.caminho);
      }
    });

    res.json({ message: 'OS removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── INICIALIZAÇÃO ─────────────────────────────────────────────
// Exporta para Vercel (serverless) e mantém compatibilidade local
if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  module.exports = app;
  console.log('🔧 Modo serverless (Vercel)');
} else {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📦 Uploads em: ${uploadDir}`);
  });
}
