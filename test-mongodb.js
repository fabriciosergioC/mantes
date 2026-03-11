/**
 * Script para Testar Conexão com MongoDB Atlas
 * 
 * Execute: node test-mongodb.js
 * 
 * Antes de rodar:
 * 1. Copie .env.example para .env
 * 2. Edite .env com sua string de conexão do MongoDB Atlas
 */

require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  console.log('🧪 Testando conexão com MongoDB Atlas...\n');
  
  if (!process.env.MONGODB_URI) {
    console.log('❌ Erro: MONGODB_URI não configurada no arquivo .env');
    console.log('\n1. Copie o arquivo .env.example para .env');
    console.log('2. Edite o .env e adicione sua string de conexão do MongoDB Atlas\n');
    return;
  }

  // Máscarar a senha para exibição
  const maskedUri = process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
  console.log('📡 Conectando em:', maskedUri, '\n');

  try {
    // Tentar conectar
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000 // Timeout de 10 segundos
    });

    console.log('✅ CONEXÃO BEM-SUCEDIDA!\n');
    console.log('📌 Detalhes:');
    console.log('   • Host:', conn.connection.host);
    console.log('   • Porta:', conn.connection.port);
    console.log('   • Banco:', conn.connection.name);
    console.log('   • Estado:', conn.connection.readyState === 1 ? 'Conectado' : 'Desconectado');

    // Listar coleções
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📂 Coleções existentes:');
    if (collections.length === 0) {
      console.log('   (nenhuma coleção - banco vazio)');
    } else {
      collections.forEach(col => {
        console.log(`   • ${col.name}`);
      });
    }

    // Testar leitura/escrita
    console.log('\n🧪 Testando leitura/escrita...');
    const testCollection = mongoose.connection.collection('teste_conexao');
    const testDoc = { teste: true, data: new Date() };
    
    await testCollection.insertOne(testDoc);
    console.log('   ✅ Documento inserido');
    
    const found = await testCollection.findOne({ teste: true });
    console.log('   ✅ Documento encontrado:', found);
    
    await testCollection.deleteOne({ teste: true });
    console.log('   ✅ Documento removido');

    console.log('\n✅ Todos os testes passaram! Conexão OK.\n');

    // Fechar conexão
    await mongoose.connection.close();
    console.log('🔌 Conexão fechada.\n');

  } catch (err) {
    console.log('❌ ERRO NA CONEXÃO!\n');
    console.log('Erro:', err.message);
    console.log('\n🔍 Possíveis causas:');
    console.log('   1. String de conexão incorreta');
    console.log('   2. Usuário/senha inválidos');
    console.log('   3. IP não autorizado no MongoDB Atlas');
    console.log('   4. Cluster indisponível');
    console.log('\n💡 Soluções:');
    console.log('   • Verifique se a MONGODB_URI no .env está correta');
    console.log('   • No MongoDB Atlas, em "Network Access", permita seu IP');
    console.log('   • Verifique usuário e senha em "Database Access"');
    console.log('   • Aguarde alguns minutos se o cluster foi criado agora\n');
  }
}

testConnection();
