import { execSync } from 'child_process';
import readline from 'readline';
import { open } from 'child_process';

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
    const result = execSync(cmd, { encoding: 'utf8', shell: true });
    return result;
  } catch (error) {
    return null;
  }
}

async function main() {
  console.log('============================================');
  console.log('   🚀 Deploy Automático - Mantes no Render');
  console.log('============================================\n');

  // Passo 1: Verificar Git
  console.log('[1/7] Verificando repositório Git...');
  const gitStatus = run('git status');
  if (!gitStatus) {
    console.log('❌ Erro: Este não é um repositório Git válido');
    return;
  }
  console.log('✅ Repositório OK');

  // Passo 2: Push para GitHub
  console.log('\n[2/7] Enviando código para GitHub...');
  const pushResult = run('git push origin main');
  if (pushResult === null) {
    console.log('⚠️  Falha no push. Verifique se está logado no GitHub.');
    const retry = await question('   Tentar novamente? (s/n): ');
    if (retry.toLowerCase() === 's') {
      run('git push origin main');
    }
  } else {
    console.log('✅ Código enviado para GitHub!');
  }

  // Passo 3: Abrir Render
  console.log('\n[3/7] Abrindo Render.com...');
  console.log('📌 Siga as instruções na tela do navegador!\n');
  
  try {
    // Abre o navegador
    if (process.platform === 'win32') {
      execSync('start https://dashboard.render.com');
    } else if (process.platform === 'darwin') {
      execSync('open https://dashboard.render.com');
    } else {
      execSync('xdg-open https://dashboard.render.com');
    }
  } catch {
    console.log('Abra manualmente: https://dashboard.render.com');
  }

  // Instruções
  console.log('============================================');
  console.log('   📋 Siga estes passos no Render:');
  console.log('============================================\n');
  
  console.log('1. Clique em "New +" → "Web Service"');
  console.log('2. Conecte o repositório: fabriciosergioC/mantes');
  console.log('3. Preencha assim:\n');
  console.log('   ┌─────────────────────────────────────────┐');
  console.log('   │ Name: mantes                            │');
  console.log('   │ Region: Oregon                          │');
  console.log('   │ Branch: main                            │');
  console.log('   │ Runtime: Node                           │');
  console.log('   │ Build: npm install && npm run build     │');
  console.log('   │ Start: npm start                        │');
  console.log('   │ Instance: Free                          │');
  console.log('   └─────────────────────────────────────────┘\n');
  
  console.log('4. Adicione as Variáveis de Ambiente:\n');
  console.log('   ┌─────────────────────────────────────────┐');
  console.log('   │ NODE_ENV = production                   │');
  console.log('   │ PORT = 8080                             │');
  console.log('   │ CORS_ORIGIN = *                         │');
  console.log('   │ JWT_SECRET = mantes-secret-2026         │');
  console.log('   │ MONGODB_URI = mongodb+srv://fabricio:   │');
  console.log('   │   root@cluster0.i6kny0w.mongodb.net/    │');
  console.log('   │   mantes?retryWrites=true&w=majority    │');
  console.log('   └─────────────────────────────────────────┘\n');
  
  console.log('5. Clique em "Create Web Service"\n');
  
  const url = await question('   Quando estiver no ar, cole a URL do serviço: ');
  
  if (url) {
    console.log('\n============================================');
    console.log('   ✅ Deploy realizado!');
    console.log('============================================\n');
    console.log(`🌐 Seu site: ${url}`);
    console.log(`📝 API: ${url}/api/health`);
    console.log('\n📌 Último passo: Criar usuário admin');
    console.log('   1. No painel do Render, vá em "Console"');
    console.log('   2. Digite: npm run seed');
    console.log('   3. Login: admin@mantes.com / Mantes2026!\n');
  }

  rl.close();
}

main();
