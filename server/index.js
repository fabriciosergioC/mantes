import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, getDB } from './db.js';
import authRoutes from './routes/auth.js';
import osRoutes from './routes/os.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// Middleware
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexão MongoDB
connectDB().then(() => {
  app.set('db', getDB());
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/os', osRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API Mantes rodando' });
});

// Servir frontend estático
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Fallback para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📦 MongoDB Atlas conectado`);
});
