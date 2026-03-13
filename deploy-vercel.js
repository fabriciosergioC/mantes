import { execSync } from 'child_process';

console.log('============================================');
console.log('   🚀 Deploy Rápido - Vercel');
console.log('============================================\n');

console.log('📌 Siga estes 3 passos:\n');

console.log('1️⃣  INSTALE A VERCEL CLI:');
console.log('   npm install -g vercel\n');

console.log('2️⃣  FAÇA LOGIN:');
console.log('   vercel login\n');

console.log('3️⃣  DEPLOY:');
console.log('   vercel --prod\n');

console.log('============================================');
console.log('   Após o deploy:');
console.log('============================================\n');

console.log('📝 Configure as variáveis em:');
console.log('   https://vercel.com/dashboard → Settings → Environment Variables\n');
console.log('   MONGODB_URI = mongodb+srv://fabricio:root@cluster0.i6kny0w.mongodb.net/mantes?retryWrites=true&w=majority');
console.log('   JWT_SECRET = mantes-secret-2026\n');

console.log('🔧 Criar usuário admin:');
console.log('   Functions → Console → npm run seed\n');

console.log('✅ Pronto!');
