import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDB } from './db.js';
import authRoutes from './routes/auth.js';
import osRoutes from './routes/os.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexão MongoDB
connectDB().then(() => {
  app.set('db', getDB());
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/os', osRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API Mantes rodando' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📦 MongoDB Atlas conectado`);
});
