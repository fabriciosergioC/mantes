import { execSync } from 'child_process';
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
    return true;
  } catch (error) {
    console.error(`❌ Erro: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('============================================');
  console.log('   🚀 Deploy Automático - Vercel');
  console.log('============================================\n');

  // Passo 1: Instalar Vercel CLI
  console.log('[1/6] Instalando Vercel CLI...');
  run('npm install -g vercel');

  // Passo 2: Login
  console.log('\n[2/6] Fazendo login na Vercel...');
  console.log('Siga as instruções no terminal');
  run('vercel login');

  // Passo 3: Deploy
  console.log('\n[3/6] 🚀 Fazendo deploy...');
  console.log('Isso pode levar alguns minutos...\n');
  
  const success = run('vercel --prod');
  
  if (!success) {
    console.log('\n❌ Falha no deploy. Tente manualmente: npm run deploy');
    rl.close();
    return;
  }

  console.log('\n============================================');
  console.log('   ✅ Deploy concluído!');
  console.log('============================================\n');
  
  console.log('📌 Próximos passos:');
  console.log('   1. Acesse https://vercel.com/dashboard');
  console.log('   2. Vá em "Settings" → "Environment Variables"');
  console.log('   3. Adicione as variáveis abaixo:\n');
  console.log('      MONGODB_URI = mongodb+srv://fabricio:root@cluster0.i6kny0w.mongodb.net/mantes?retryWrites=true&w=majority');
  console.log('      JWT_SECRET = mantes-secret-2026\n');
  console.log('   4. Redeploy: vercel --prod\n');
  console.log('   5. Criar admin (Functions → Console): npm run seed\n');

  rl.close();
}

main();
