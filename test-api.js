/**
 * Script de Teste da API Mantes
 * 
 * Este script testa os endpoints da API sem precisar do frontend.
 * Execute após iniciar o servidor com: npm start
 */

const API_URL = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🧪 Iniciando testes da API Mantes...\n');

  try {
    // Teste 1: Verificar se o servidor está no ar
    console.log('1️⃣ Testando conexão com o servidor...');
    try {
      const res = await fetch(`${API_URL}/os/next-number`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log('   ✅ Servidor online!');
        console.log(`   📌 Próximo número: ${data.numero}\n`);
      } else {
        console.log('   ⚠️ Servidor respondeu com erro:', res.status);
      }
    } catch (err) {
      console.log('   ❌ Servidor offline. Execute: npm start\n');
      return;
    }

    // Teste 2: Criar uma O.S.
    console.log('2️⃣ Criando uma O.S. de teste...');
    const formData = new FormData();
    formData.append('clienteId', '000001');
    formData.append('cnpj', '12.345.678/0001-90');
    formData.append('nomeCliente', 'Empresa Teste LTDA');
    formData.append('telefone', '(11) 99999-9999');
    formData.append('nomeTecnico', 'João Silva');
    formData.append('lider', 'Carlos Silva');
    formData.append('emailLider', 'carlos@teste.com');
    formData.append('tipoSolicitacao', 'bug_mantes');
    formData.append('descricao', 'Bug de teste criado pelo script de testes.');

    const createRes = await fetch(`${API_URL}/os`, {
      method: 'POST',
      body: formData
    });

    if (createRes.ok) {
      const os = await createRes.json();
      console.log('   ✅ O.S. criada com sucesso!');
      console.log(`   📌 Número: ${os.numero}`);
      console.log(`   📌 ID: ${os._id}\n`);

      // Teste 3: Listar O.S.
      console.log('3️⃣ Listando todas as O.S....');
      const listRes = await fetch(`${API_URL}/os`);
      if (listRes.ok) {
        const osList = await listRes.json();
        console.log(`   ✅ ${osList.length} O.S.(s) encontrada(s)\n`);

        // Teste 4: Estatísticas
        console.log('4️⃣ Buscando estatísticas...');
        const statsRes = await fetch(`${API_URL}/os/stats`);
        if (statsRes.ok) {
          const stats = await statsRes.json();
          console.log('   ✅ Estatísticas:');
          console.log(`      • Total: ${stats.total}`);
          console.log(`      • Pendentes: ${stats.pending}`);
          console.log(`      • Aceitas: ${stats.accepted}`);
          console.log(`      • Resolvidas: ${stats.resolved}`);
          console.log(`      • Rejeitadas: ${stats.rejected}\n`);
        }

        // Teste 5: Atualizar status
        console.log('5️⃣ Testando atualização de status...');
        const updateRes = await fetch(`${API_URL}/os/${os._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            status: 'accepted',
            observacao: 'O.S. aceita via script de teste'
          })
        });

        if (updateRes.ok) {
          const updated = await updateRes.json();
          console.log(`   ✅ Status atualizado para: ${updated.status}\n`);
        }

        // Teste 6: Login
        console.log('6️⃣ Testando login...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'lider@mantes.com',
            senha: 'mantes2024'
          })
        });

        if (loginRes.ok) {
          const loginData = await loginRes.json();
          console.log('   ✅ Login realizado!');
          console.log(`   📌 Token: ${loginData.token.substring(0, 20)}...\n`);
        } else {
          console.log('   ⚠️ Login falhou (usuário será criado no primeiro login)\n');
        }
      }
    } else {
      const error = await createRes.json();
      console.log('   ❌ Erro ao criar O.S.:', error.error);
    }

  } catch (err) {
    console.log('   ❌ Erro:', err.message);
  }

  console.log('\n✅ Testes finalizados!\n');
}

// Executar testes
testAPI();
