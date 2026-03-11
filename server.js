import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
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

// Pool de conexão PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Testar conexão
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Erro ao conectar PostgreSQL:', err.stack);
  } else {
    console.log('✅ PostgreSQL conectado!');
    release();
  }
});

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

    let user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      console.log(`👤 Criando usuário: ${email}`);
      const senhaHash = await bcrypt.hash(senha, 10);
      const newUser = await pool.query(
        'INSERT INTO users (nome, email, senha_hash, lider) VALUES ($1, $2, $3, $4) RETURNING *',
        ['Administrador', email, senhaHash, true]
      );
      user = newUser;
    }

    const valid = await bcrypt.compare(senha, user.rows[0].senha_hash);
    if (!valid) return res.status(401).json({ error: 'Senha incorreta' });

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({ 
      token, 
      user: { 
        id: user.rows[0].id, 
        nome: user.rows[0].nome, 
        email: user.rows[0].email, 
        lider: user.rows[0].lider 
      } 
    });
  } catch (err) {
    console.error('Erro login:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/change-password', authMiddleware, async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body;
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [req.userId]);

    const valid = await bcrypt.compare(senhaAtual, user.rows[0].senha_hash);
    if (!valid) return res.status(401).json({ error: 'Senha atual incorreta' });

    const senhaHash = await bcrypt.hash(novaSenha, 10);
    await pool.query('UPDATE users SET senha_hash = $1 WHERE id = $2', [senhaHash, req.userId]);

    res.json({ message: 'Senha alterada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ROTAS DE ORDENS DE SERVIÇO ────────────────────────────────
app.get('/api/os', async (req, res) => {
  try {
    const { status, tipo, cnpj } = req.query;
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    if (tipo) {
      query += ` AND tipo_solicitacao = $${paramIndex}`;
      params.push(tipo);
      paramIndex++;
    }
    if (cnpj) {
      query += ` AND cnpj LIKE $${paramIndex}`;
      params.push(`%${cnpj.replace(/\D/g, '')}%`);
      paramIndex++;
    }

    query += ' ORDER BY data_abertura DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/os/stats', async (req, res) => {
  try {
    const total = await pool.query('SELECT COUNT(*) FROM orders');
    const pending = await pool.query("SELECT COUNT(*) FROM orders WHERE status = 'pending'");
    const accepted = await pool.query("SELECT COUNT(*) FROM orders WHERE status = 'accepted'");
    const resolved = await pool.query("SELECT COUNT(*) FROM orders WHERE status = 'resolved'");
    const rejected = await pool.query("SELECT COUNT(*) FROM orders WHERE status = 'rejected'");

    res.json({
      total: parseInt(total.rows[0].count),
      pending: parseInt(pending.rows[0].count),
      accepted: parseInt(accepted.rows[0].count),
      resolved: parseInt(resolved.rows[0].count),
      rejected: parseInt(rejected.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/os/next-number', async (req, res) => {
  try {
    const lastOS = await pool.query('SELECT numero FROM orders ORDER BY numero DESC LIMIT 1');
    
    let nextNum = 1001;
    if (lastOS.rows.length > 0) {
      const lastNum = parseInt(lastOS.rows[0].numero.replace('OS-', ''));
      nextNum = lastNum + 1;
    }
    
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

    // Gerar número
    const lastOS = await pool.query('SELECT numero FROM orders ORDER BY numero DESC LIMIT 1');
    let nextNum = 1001;
    if (lastOS.rows.length > 0) {
      const lastNum = parseInt(lastOS.rows[0].numero.replace('OS-', ''));
      nextNum = lastNum + 1;
    }
    const numero = 'OS-' + String(nextNum).padStart(5, '0');

    // Processar arquivos
    const arquivos = req.files?.map(file => ({
      nome: file.originalname,
      tipo: file.mimetype,
      tamanho: file.size,
      caminho: file.path,
      url: `/uploads/${file.filename}`
    })) || [];

    const result = await pool.query(
      `INSERT INTO orders (
        numero, cliente_id, cnpj, nome_cliente, telefone,
        nome_tecnico, lider, email_lider, tipo_solicitacao, descricao,
        arquivos, status, observacoes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [
        numero, clienteId, cnpj, nomeCliente, telefone,
        nomeTecnico, lider, emailLider, tipoSolicitacao, descricao,
        JSON.stringify(arquivos), 'pending', JSON.stringify([])
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/os/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'OS não encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/os/:id', async (req, res) => {
  try {
    const { status, observacao } = req.body;

    const os = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (os.rows.length === 0) return res.status(404).json({ error: 'OS não encontrada' });

    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (status) {
      updates.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
      
      if (status === 'resolved') {
        updates.push(`data_fechamento = NOW()`);
      }
    }

    if (observacao) {
      const obsArray = os.rows[0].observacoes || [];
      obsArray.push({ texto: observacao, data: new Date().toISOString() });
      updates.push(`observacoes = $${paramIndex}`);
      params.push(JSON.stringify(obsArray));
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.json(os.rows[0]);
    }

    updates.push(`updated_at = NOW()`);
    params.push(req.params.id);

    const result = await pool.query(
      `UPDATE orders SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      params
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar OS:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/os/:id', async (req, res) => {
  try {
    const os = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (os.rows.length === 0) return res.status(404).json({ error: 'OS não encontrada' });

    // Remover arquivos físicos
    const arquivos = os.rows[0].arquivos || [];
    arquivos.forEach(file => {
      if (file.caminho && fs.existsSync(file.caminho)) {
        fs.unlinkSync(file.caminho);
      }
    });

    await pool.query('DELETE FROM orders WHERE id = $1', [req.params.id]);

    res.json({ message: 'OS removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── INICIALIZAÇÃO ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📦 Uploads: ${uploadDir}`);
  console.log(`🗄️  Banco: PostgreSQL (Render)`);
});
