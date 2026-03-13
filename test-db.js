import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

async function test() {
  console.log('🔍 Testando conexão...');
  console.log('URI:', process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@'));
  
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Conectado!');
    
    const db = client.db();
    console.log('📦 Database:', db.databaseName);
    
    // Criar usuário
    const passwordHash = await bcrypt.hash('Mantes2026!', 10);
    
    const result = await db.collection('users').insertOne({
      email: 'admin@mantes.com',
      passwordHash,
      nome: 'Administrador',
      lider: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✅ Usuário criado com ID:', result.insertedId);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    if (error.codeName) console.error('Código:', error.codeName);
  } finally {
    await client.close();
  }
}

test();
