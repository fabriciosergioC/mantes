import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
let client;
let db;

export async function connectDB() {
  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db();
    console.log('✅ MongoDB Atlas conectado:', uri);
    
    // Criar índices
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('orders').createIndex({ numero: 1 }, { unique: true });
    await db.collection('orders').createIndex({ status: 1 });
    await db.collection('orders').createIndex({ dataAbertura: -1 });
    
    console.log('📑 Índices criados');
    return db;
  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error.message);
    throw error;
  }
}

export function getDB() {
  if (!db) {
    throw new Error('Banco não inicializado. Chame connectDB() primeiro.');
  }
  return db;
}

export async function closeDB() {
  if (client) {
    await client.close();
    console.log('MongoDB desconectado');
  }
}
