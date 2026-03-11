/**
 * Script de Gerenciamento do Banco Mantes
 * 
 * Uso:
 *   node db-manage.js listar          - Lista todas as O.S.
 *   node db-manage.js stats           - Mostra estatísticas
 *   node db-manage.js buscar OS-01001 - Busca O.S. por número
 *   node db-manage.js excluir OS-01001 - Exclui O.S.
 *   node db-manage.js limpar          - Remove todas as O.S.
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Esquema da O.S.
const osSchema = new mongoose.Schema({
  numero: String,
  clienteId: String,
  cnpj: String,
  nomeCliente: String,
  telefone: String,
  nomeTecnico: String,
  lider: String,
  emailLider: String,
  tipoSolicitacao: String,
  descricao: String,
  arquivos: Array,
  status: String,
  observacoes: Array,
  dataAbertura: Date,
  dataFechamento: Date
}, { timestamps: true });

const OS = mongoose.model('OS', osSchema);

async function conectar() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Conectado ao MongoDB Atlas\n');
}

async function listar() {
  await conectar();
  
  const osList = await OS.find().sort({ dataAbertura: -1 }).limit(20);
  
  console.log('📋 Últimas 20 Ordens de Serviço:\n');
  console.log('┌─────────┬──────────────┬─────────────────────┬───────────┬─────────┐');
  console.log('│ O.S.    │ Data         │ Cliente             │ Status    │ Tipo    │');
  console.log('├─────────┼──────────────┼─────────────────────┼───────────┼─────────┤');
  
  osList.forEach(os => {
    const statusIcon = {
      'pending': '⏳',
      'accepted': '📤',
      'resolved': '✅',
      'rejected': '❌'
    }[os.status] || '⏳';
    
    const tipoIcon = os.tipoSolicitacao === 'bug_mantes' ? '🐛' : '💡';
    
    console.log(
      `│ ${os.numero} │ ${new Date(os.dataAbertura).toLocaleDateString('pt-BR').padStart(10)} │ ${os.nomeCliente.substring(0, 19).padEnd(19)} │ ${statusIcon} ${os.status.padEnd(8)} │ ${tipoIcon} ${os.tipoSolicitacao?.padEnd(6)} │`
    );
  });
  
  console.log('└─────────┴──────────────┴─────────────────────┴───────────┴─────────┘');
  console.log(`\nTotal: ${osList.length} O.S.(s)\n`);
  
  await mongoose.connection.close();
}

async function stats() {
  await conectar();
  
  const total = await OS.countDocuments();
  const pending = await OS.countDocuments({ status: 'pending' });
  const accepted = await OS.countDocuments({ status: 'accepted' });
  const resolved = await OS.countDocuments({ status: 'resolved' });
  const rejected = await OS.countDocuments({ status: 'rejected' });
  
  console.log('📊 Estatísticas do Banco de Dados:\n');
  console.log('┌─────────────────────────────────┐');
  console.log('│ Status        │ Quantidade      │');
  console.log('├───────────────┼─────────────────┤');
  console.log(`│ Total         │ ${String(total).padEnd(15)} │`);
  console.log(`│ Pendentes     │ ${String(pending).padEnd(15)} │`);
  console.log(`│ Aceitas       │ ${String(accepted).padEnd(15)} │`);
  console.log(`│ Resolvidas    │ ${String(resolved).padEnd(15)} │`);
  console.log(`│ Rejeitadas    │ ${String(rejected).padEnd(15)} │`);
  console.log('└───────────────┴─────────────────┘\n');
  
  await mongoose.connection.close();
}

async function buscar(numero) {
  await conectar();
  
  const os = await OS.findOne({ numero });
  
  if (!os) {
    console.log(`❌ O.S. ${numero} não encontrada.\n`);
    await mongoose.connection.close();
    return;
  }
  
  console.log(`\n📄 Detalhes da O.S. ${numero}:\n`);
  console.log('Cliente:', os.nomeCliente);
  console.log('CNPJ:', os.cnpj);
  console.log('Telefone:', os.telefone);
  console.log('Técnico:', os.nomeTecnico);
  console.log('Líder:', os.lider);
  console.log('Email Líder:', os.emailLider);
  console.log('Tipo:', os.tipoSolicitacao);
  console.log('Descrição:', os.descricao);
  console.log('Status:', os.status);
  console.log('Data Abertura:', new Date(os.dataAbertura).toLocaleString('pt-BR'));
  console.log('Arquivos:', os.arquivos?.length || 0);
  console.log('Observações:', os.observacoes?.length || 0);
  console.log('');
  
  await mongoose.connection.close();
}

async function excluir(numero) {
  await conectar();
  
  const os = await OS.findOne({ numero });
  
  if (!os) {
    console.log(`❌ O.S. ${numero} não encontrada.\n`);
    await mongoose.connection.close();
    return;
  }
  
  await OS.deleteOne({ numero });
  console.log(`✅ O.S. ${numero} excluída com sucesso.\n`);
  
  await mongoose.connection.close();
}

async function limpar() {
  await conectar();
  
  const count = await OS.countDocuments();
  
  if (count === 0) {
    console.log('✅ Banco já está vazio.\n');
    await mongoose.connection.close();
    return;
  }
  
  console.log(`⚠️  Isso irá remover ${count} O.S.(s) permanentemente.`);
  console.log('Digite "CONFIRMAR" para continuar:');
  
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readline.question('> ', async (resposta) => {
    if (resposta === 'CONFIRMAR') {
      await OS.deleteMany({});
      console.log(`✅ ${count} O.S.(s) removidas.\n`);
    } else {
      console.log('❌ Operação cancelada.\n');
    }
    
    readline.close();
    await mongoose.connection.close();
  });
}

// Executar comando
const comando = process.argv[2];
const parametro = process.argv[3];

console.log('🔧 Mantes - Gerenciador de Banco de Dados\n');

switch (comando) {
  case 'listar':
    listar();
    break;
  case 'stats':
    stats();
    break;
  case 'buscar':
    buscar(parametro);
    break;
  case 'excluir':
    excluir(parametro);
    break;
  case 'limpar':
    limpar();
    break;
  default:
    console.log('Uso: node db-manage.js <comando> [parametro]');
    console.log('\nComandos disponíveis:');
    console.log('  listar              - Lista as últimas 20 O.S.');
    console.log('  stats               - Mostra estatísticas');
    console.log('  buscar <numero>     - Busca O.S. por número');
    console.log('  excluir <numero>    - Exclui uma O.S.');
    console.log('  limpar              - Remove todas as O.S.\n');
}
