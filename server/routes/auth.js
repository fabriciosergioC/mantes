import express from 'express';
import * as auth from '../auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, nome } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
    }
    
    const result = await auth.register(email, password, nome);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
    }
    
    const result = await auth.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = auth.verifyToken(token);
    
    const db = req.app.get('db');
    const user = await db.collection('users').findOne({ _id: decoded.userId });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json({
      userId: user._id,
      email: user.email,
      nome: user.nome,
      lider: user.lider
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

export default router;
