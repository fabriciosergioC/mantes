// Mantes Frontend - Nhost Integration
import { graphqlRequest, auth } from './nhost.js';

// Elementos DOM
const loginCard = document.getElementById('loginCard');
const mainCard = document.getElementById('mainCard');
const loginForm = document.getElementById('loginForm');
const osForm = document.getElementById('osForm');
const btnLogout = document.getElementById('btnLogout');
const btnLogin = document.getElementById('btnLogin');
const btnSubmit = document.getElementById('btnSubmit');
const loginAlert = document.getElementById('loginAlert');
const formAlert = document.getElementById('formAlert');
const userName = document.getElementById('userName');
const numeroInput = document.getElementById('numero');
const fileList = document.getElementById('fileList');
const fileUpload = document.getElementById('fileUpload');

// Estado
let arquivosSelecionados = [];
let currentUser = null;

// Verificar autenticação ao carregar
async function checkAuth() {
  const session = auth.getSession();
  
  if (session && session.accessToken) {
    try {
      // Buscar perfil do usuário
      const result = await graphqlRequest(`
        query GetProfile($id: uuid!) {
          profiles_by_pk(id: $id) {
            id
            nome
            email
            lider
          }
        }
      `, { id: session.user.id });
      
      if (result.profiles_by_pk) {
        currentUser = result.profiles_by_pk;
        userName.textContent = currentUser.nome;
        loginCard.style.display = 'none';
        mainCard.style.display = 'block';
        carregarProximoNumero();
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      logout();
    }
  } else {
    loginCard.style.display = 'block';
    mainCard.style.display = 'none';
  }
}

// Mostrar alerta
function showAlert(element, message, type = 'error') {
  element.textContent = message;
  element.className = `alert ${type}`;
  element.style.display = 'block';
  
  setTimeout(() => {
    element.style.display = 'none';
  }, 5000);
}

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginSenha').value;
  
  btnLogin.disabled = true;
  btnLogin.innerHTML = '<span class="loading"></span> Entrando...';
  
  try {
    // Login com Nhost Auth
    const result = await auth.signIn(email, password);
    
    if (!result.session) {
      throw new Error('Erro no login');
    }
    
    const session = result.session;
    const user = result.user;
    
    // Buscar ou criar perfil
    try {
      let profile = await graphqlRequest(`
        query GetProfile($id: uuid!) {
          profiles_by_pk(id: $id) {
            id
            nome
            email
            lider
          }
        }
      `, { id: user.id });
      
      // Se não existir, criar perfil
      if (!profile.profiles_by_pk) {
        const created = await graphqlRequest(`
          mutation CreateProfile($id: uuid!, $nome: String!, $email: String!) {
            insert_profiles_one(object: {
              id: $id,
              nome: $nome,
              email: $email,
              lider: true
            }) {
              id
              nome
              email
            }
          }
        `, { 
          id: user.id, 
          nome: user.email?.split('@')[0] || email.split('@')[0],
          email 
        });
        
        profile = { profiles_by_pk: created.insert_profiles_one };
      }
      
      currentUser = profile.profiles_by_pk;
      userName.textContent = currentUser.nome;
      loginCard.style.display = 'none';
      mainCard.style.display = 'block';
      carregarProximoNumero();
      
    } catch (profileError) {
      console.error('Erro ao criar perfil:', profileError);
    }
    
  } catch (error) {
    showAlert(loginAlert, error.message || 'Erro no login', 'error');
  }
  
  btnLogin.disabled = false;
  btnLogin.textContent = 'Entrar';
});

// Logout
btnLogout.addEventListener('click', () => {
  auth.signOut();
  currentUser = null;
  location.reload();
});

// Carregar próximo número da OS
async function carregarProximoNumero() {
  try {
    const result = await graphqlRequest(`
      query GetLastOS {
        orders(order_by: { numero: desc }, limit: 1) {
          numero
        }
      }
    `);
    
    let nextNum = 1001;
    if (result.orders.length > 0) {
      nextNum = parseInt(result.orders[0].numero.replace('OS-', '')) + 1;
    }
    
    numeroInput.value = `OS-${String(nextNum).padStart(5, '0')}`;
  } catch (error) {
    console.error('Erro ao carregar número:', error);
    const randomNum = Math.floor(Math.random() * 1000) + 1001;
    numeroInput.value = `OS-${String(randomNum).padStart(5, '0')}`;
  }
}

// Manipular seleção de arquivos
fileUpload.addEventListener('dragover', (e) => {
  e.preventDefault();
  fileUpload.style.borderColor = 'var(--accent)';
  fileUpload.style.background = 'rgba(255, 107, 43, 0.1)';
});

fileUpload.addEventListener('dragleave', () => {
  fileUpload.style.borderColor = 'var(--border)';
  fileUpload.style.background = 'var(--card)';
});

fileUpload.addEventListener('drop', (e) => {
  e.preventDefault();
  fileUpload.style.borderColor = 'var(--border)';
  fileUpload.style.background = 'var(--card)';
  
  const files = Array.from(e.dataTransfer.files);
  arquivosSelecionados = [...arquivosSelecionados, ...files];
  renderFileList();
});

fileUpload.addEventListener('click', () => {
  document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', (e) => {
  arquivosSelecionados = [...arquivosSelecionados, ...Array.from(e.target.files)];
  renderFileList();
});

function renderFileList() {
  fileList.innerHTML = '';
  
  arquivosSelecionados.forEach((file, index) => {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.innerHTML = `
      <span class="file-name">${file.name}</span>
      <button type="button" class="remove-file" onclick="removeFile(${index})">×</button>
    `;
    fileList.appendChild(fileItem);
  });
}

window.removeFile = (index) => {
  arquivosSelecionados.splice(index, 1);
  renderFileList();
};

// Criar OS
osForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = '<span class="loading"></span> Criando...';
  
  try {
    // Gerar próximo número
    const lastOS = await graphqlRequest(`
      query GetLastOS {
        orders(order_by: { numero: desc }, limit: 1) {
          numero
        }
      }
    `);
    
    let nextNum = 1001;
    if (lastOS.orders.length > 0) {
      nextNum = parseInt(lastOS.orders[0].numero.replace('OS-', '')) + 1;
    }
    const numero = `OS-${String(nextNum).padStart(5, '0')}`;
    
    // Gerar cliente_id automático
    const lastCliente = await graphqlRequest(`
      query GetLastCliente {
        orders(order_by: { cliente_id: desc }, limit: 1) {
          cliente_id
        }
      }
    `);
    
    let nextCliente = 1;
    if (lastCliente.orders.length > 0 && lastCliente.orders[0].cliente_id) {
      nextCliente = parseInt(lastCliente.orders[0].cliente_id.replace('CLT-', '')) + 1;
    }
    const clienteId = `CLT-${String(nextCliente).padStart(5, '0')}`;
    
    // Criar OS
    const result = await graphqlRequest(`
      mutation CreateOS($object: orders_insert_input!) {
        insert_orders_one(object: $object) {
          id
          numero
          cliente_id
          status
          created_at
        }
      }
    `, {
      object: {
        numero,
        cliente_id: clienteId,
        cnpj: document.getElementById('cnpj').value.replace(/\D/g, ''),
        nome_cliente: document.getElementById('nomeCliente').value,
        telefone: document.getElementById('telefone').value,
        nome_tecnico: document.getElementById('nomeTecnico').value,
        lider: document.getElementById('lider').value,
        email_lider: document.getElementById('emailLider').value,
        tipo_solicitacao: document.getElementById('tipoSolicitacao').value,
        descricao: document.getElementById('descricao').value,
        status: 'pending',
        arquivos: []
      }
    });
    
    showAlert(formAlert, 'OS criada com sucesso!', 'success');
    osForm.reset();
    arquivosSelecionados = [];
    renderFileList();
    carregarProximoNumero();
    
  } catch (error) {
    showAlert(formAlert, `Erro ao criar OS: ${error.message}`, 'error');
  }
  
  btnSubmit.disabled = false;
  btnSubmit.textContent = 'Criar OS';
});

// Carregar OSes
window.carregarOS = async () => {
  try {
    const result = await graphqlRequest(`
      query GetOS {
        orders(order_by: { data_abertura: desc }) {
          id
          numero
          cliente_id
          nome_cliente
          status
          tipo_solicitacao
          data_abertura
        }
      }
    `);
    
    console.log('OS carregadas:', result.orders);
    return result.orders;
  } catch (error) {
    console.error('Erro ao carregar OS:', error);
    return [];
  }
};

// Inicializar
checkAuth();
