import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(uploadDir));

// Servir arquivos estáticos (frontend)
app.use(express.static(__dirname));

// Conexão com MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB conectado!'))
  .catch(err => console.error('❌ Erro MongoDB:', err));

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
    console.log(`🔐 Login: ${email}`);

    let user = await User.findOne({ email });

    if (!user) {
      console.log(`👤 Criando usuário: ${email}`);
      const senhaHash = await bcrypt.hash(senha, 10);
      user = await User.create({
        nome: 'Administrador',
        email,
        senhaHash,
        lider: true
      });
    }

    const valid = await bcrypt.compare(senha, user.senhaHash);
    if (!valid) return res.status(401).json({ error: 'Senha incorreta' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({ 
      token, 
      user: { id: user._id, nome: user.nome, email: user.email, lider: user.lider } 
    });
  } catch (err) {
    console.error('Erro login:', err);
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

    const lastOS = await OS.findOne().sort({ numero: -1 });
    const nextNum = lastOS ? parseInt(lastOS.numero.replace('OS-', '')) + 1 : 1001;
    const numero = 'OS-' + String(nextNum).padStart(5, '0');

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

    const update = { $set: {} };

    if (status) {
      update.$set.status = status;
    }

    if (status === 'resolved') {
      update.$set.dataFechamento = new Date();
    }

    if (observacao) {
      update.$push = {
        observacoes: { texto: observacao, data: new Date() }
      };
    }

    if (Object.keys(update.$set).length === 0) {
      delete update.$set;
    }

    const os = await OS.findByIdAndUpdate(req.params.id, update, { new: true });

    if (!os) return res.status(404).json({ error: 'OS não encontrada' });

    res.json(os);
  } catch (err) {
    console.error('Erro ao atualizar OS:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/os/:id', async (req, res) => {
  try {
    const os = await OS.findByIdAndDelete(req.params.id);
    if (!os) return res.status(404).json({ error: 'OS não encontrada' });

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
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📦 Uploads: ${uploadDir}`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
});
