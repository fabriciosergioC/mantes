import { execSync } from 'child_process';
import { platform } from 'os';

const isWindows = platform() === 'win32';

function run(cmd) {
  console.log(`\n📦 ${cmd}\n`);
  try {
    execSync(cmd, { stdio: 'inherit', shell: true });
  } catch (error) {
    console.error(`❌ Erro: ${error.message}`);
    process.exit(1);
  }
}

console.log('============================================');
console.log('   🚀 Deploy Mantes no Railway');
console.log('============================================\n');

// Passo 1: Verificar/installar Railway CLI
console.log('[1/6] Verificando Railway CLI...');
try {
  execSync('railway --version', { stdio: 'ignore' });
  console.log('✅ Railway CLI já está instalada');
} catch {
  console.log('⚠️  Instalando Railway CLI...');
  run('npm install -g @railway/cli');
}

// Passo 2: Login
console.log('\n[2/6] Fazendo login no Railway...');
run('railway login');

// Passo 3: Inicializar projeto
console.log('\n[3/6] Inicializando projeto...');
run('railway init');

// Passo 4: Adicionar MongoDB
console.log('\n[4/6] Adicionando MongoDB...');
run('railway add mongodb');

// Passo 5: Setar variáveis
console.log('\n[5/6] Configurando variáveis de ambiente...');
run('railway variables set JWT_SECRET=mantes-secret-2026');
run('railway variables set PORT=8080');
run('railway variables set NODE_ENV=production');
run('railway variables set CORS_ORIGIN=*');

// Passo 6: Deploy
console.log('\n[6/6] 🚀 Fazendo deploy...');
run('railway up');

console.log('\n============================================');
console.log('   ✅ Deploy concluído!');
console.log('============================================\n');
console.log('📌 Próximos passos:');
console.log('   1. Acesse https://railway.app/dashboard');
console.log('   2. Copie a MONGODB_URI do serviço MongoDB');
console.log('   3. Rode: railway variables set MONGODB_URI="sua-connection-string"');
console.log('   4. Rode: railway run npm run seed (criar usuário admin)\n');
