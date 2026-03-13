import express from 'express';
import { ObjectId } from 'mongodb';
import * as auth from '../auth.js';

const router = express.Router();

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = auth.verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
}

// GET /api/os - Listar todas
router.get('/', authMiddleware, async (req, res) => {
  try {
    const db = req.app.get('db');
    const orders = await db.collection('orders')
      .find()
      .sort({ dataAbertura: -1 })
      .toArray();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/os/:id - Buscar uma
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const db = req.app.get('db');
    const order = await db.collection('orders').findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (!order) {
      return res.status(404).json({ error: 'OS não encontrada' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/os - Criar nova
router.post('/', authMiddleware, async (req, res) => {
  try {
    const db = req.app.get('db');
    
    const lastOrder = await db.collection('orders').findOne({}, { sort: { numero: -1 } });
    let nextNum = 1001;
    if (lastOrder && lastOrder.numero) {
      nextNum = parseInt(lastOrder.numero.replace('OS-', '')) + 1;
    }
    const numero = `OS-${String(nextNum).padStart(5, '0')}`;
    
    const lastCliente = await db.collection('orders').findOne({ cliente_id: { $exists: true } }, { sort: { cliente_id: -1 } });
    let nextCliente = 1;
    if (lastCliente && lastCliente.cliente_id) {
      nextCliente = parseInt(lastCliente.cliente_id.replace('CLT-', '')) + 1;
    }
    const clienteId = `CLT-${String(nextCliente).padStart(5, '0')}`;
    
    const order = {
      numero,
      cliente_id: clienteId,
      cnpj: req.body.cnpj || '',
      nome_cliente: req.body.nome_cliente,
      telefone: req.body.telefone || '',
      nome_tecnico: req.body.nome_tecnico,
      lider: req.body.lider,
      email_lider: req.body.email_lider,
      tipo_solicitacao: req.body.tipo_solicitacao,
      descricao: req.body.descricao,
      status: 'pending',
      arquivos: req.body.arquivos || [],
      observacoes: [],
      dataAbertura: new Date(),
      dataFechamento: null,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const result = await db.collection('orders').insertOne(order);
    res.status(201).json({ _id: result.insertedId, ...order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/os/:id - Atualizar
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const db = req.app.get('db');
    const updateData = { ...req.body, updated_at: new Date() };
    
    const result = await db.collection('orders').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'OS não encontrada' });
    }
    res.json({ message: 'OS atualizada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/os/:id - Deletar
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const db = req.app.get('db');
    const result = await db.collection('orders').deleteOne({
      _id: new ObjectId(req.params.id)
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'OS não encontrada' });
    }
    res.json({ message: 'OS deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
