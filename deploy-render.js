import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function run(cmd) {
  console.log(`\n📦 ${cmd}\n`);
  try {
    execSync(cmd, { stdio: 'inherit', shell: true });
  } catch (error) {
    console.error(`❌ Erro: ${error.message}`);
  }
}

async function main() {
  console.log('============================================');
  console.log('   🚀 Deploy Mantes no Render');
  console.log('============================================\n');

  // Passo 1: Verificar Render CLI
  console.log('[1/5] Verificando Render CLI...');
  try {
    execSync('render --version', { stdio: 'ignore' });
    console.log('✅ Render CLI já está instalada');
  } catch {
    console.log('⚠️  Instalando Render CLI...');
    run('npm install -g @render-cli/cli');
  }

  // Passo 2: Login
  console.log('\n[2/5] Fazendo login no Render...');
  console.log('Abra o link que aparecerá no terminal e faça login');
  run('render login');

  // Passo 3: Deploy
  console.log('\n[3/5] 🚀 Fazendo deploy...');
  console.log('Isso pode levar alguns minutos...');
  run('render deploy');

  console.log('\n============================================');
  console.log('   ⏳ Deploy em andamento!');
  console.log('============================================\n');
  
  console.log('📌 Próximos passos:');
  console.log('   1. Acesse https://dashboard.render.com');
  console.log('   2. Vá em "Environment Variables" do serviço');
  console.log('   3. Adicione MONGODB_URI com sua connection string do MongoDB Atlas\n');
  
  const mongoUri = await question('   Cole a MONGODB_URI (ou deixe vazio para pular): ');
  
  if (mongoUri) {
    console.log('\n[4/5] Configurando MONGODB_URI...');
    run(`render env set MONGODB_URI="${mongoUri}"`);
  }

  console.log('\n[5/5] Criando usuário admin...');
  console.log('Rode no Console do Render: npm run seed\n');

  rl.close();
  
  console.log('============================================');
  console.log('   ✅ Deploy concluído!');
  console.log('============================================\n');
}

main();
