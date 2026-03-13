import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDB } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secreto';

export async function register(email, password, nome) {
  const db = getDB();
  
  const existingUser = await db.collection('users').findOne({ email });
  if (existingUser) {
    throw new Error('E-mail já cadastrado');
  }
  
  const passwordHash = await bcrypt.hash(password, 10);
  
  const result = await db.collection('users').insertOne({
    email,
    passwordHash,
    nome: nome || email.split('@')[0],
    lider: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  const token = jwt.sign({ userId: result.insertedId, email }, JWT_SECRET, { expiresIn: '7d' });
  
  return {
    userId: result.insertedId,
    email,
    nome: nome || email.split('@')[0],
    token
  };
}

export async function login(email, password) {
  const db = getDB();
  
  const user = await db.collection('users').findOne({ email });
  if (!user) {
    throw new Error('E-mail ou senha inválidos');
  }
  
  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    throw new Error('E-mail ou senha inválidos');
  }
  
  const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  
  return {
    userId: user._id,
    email: user.email,
    nome: user.nome,
    token
  };
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido');
  }
}
