import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    
    console.log('📦 Conectado ao MongoDB Atlas');
    
    // Criar usuário administrador
    const existingUser = await db.collection('users').findOne({ email: 'admin@mantes.com' });
    
    if (existingUser) {
      console.log('⚠️  Usuário admin já existe');
    } else {
      const passwordHash = await bcrypt.hash('Mantes2026!', 10);
      
      await db.collection('users').insertOne({
        email: 'admin@mantes.com',
        passwordHash,
        nome: 'Administrador',
        lider: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('✅ Usuário admin criado:');
      console.log('   Email: admin@mantes.com');
      console.log('   Senha: Mantes2026!');
    }
    
    // Criar índices
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('orders').createIndex({ numero: 1 }, { unique: true });
    await db.collection('orders').createIndex({ status: 1 });
    await db.collection('orders').createIndex({ dataAbertura: -1 });
    
    console.log('📑 Índices criados');
    console.log('✅ Seed concluído!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await client.close();
  }
}

seed();
