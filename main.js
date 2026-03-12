// Mantes Frontend - API Integration

// Configuração da API
// Netlify Dev serve functions em /api/* localmente e em produção
const API_BASE = '/api';

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

// Verificar autenticação ao carregar
function checkAuth() {
  const token = localStorage.getItem('@mantes:token');
  const user = localStorage.getItem('@mantes:user');
  
  if (token && user) {
    userName.textContent = JSON.parse(user).nome;
    loginCard.style.display = 'none';
    mainCard.style.display = 'block';
    carregarProximoNumero();
  } else {
    loginCard.style.display = 'block';
    mainCard.style.display = 'none';
  }
}

// Mostrar alerta
function showAlert(element, message, type) {
  element.textContent = message;
  element.className = `alert alert-${type} show`;
  setTimeout(() => {
    element.className = 'alert';
  }, 5000);
}

// Formatadores
const formatadores = {
  cnpj: (value) => {
    value = value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
    return value.substring(0, 18);
  },
  telefone: (value) => {
    value = value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    return value.substring(0, 15);
  }
};

// Carregar próximo número da OS
async function carregarProximoNumero() {
  try {
    const res = await fetch(`${API_BASE}/os/next-number`);
    const data = await res.json();
    numeroInput.value = data.numero;
  } catch (error) {
    console.error('Erro ao carregar número:', error);
    // Fallback
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
  fileUpload.style.background = '';
});

fileUpload.addEventListener('drop', (e) => {
  e.preventDefault();
  fileUpload.style.borderColor = 'var(--border)';
  fileUpload.style.background = '';
  handleFiles(e.dataTransfer.files);
});

document.getElementById('arquivos').addEventListener('change', (e) => {
  handleFiles(e.target.files);
});

function handleFiles(files) {
  const maxArquivos = 10;
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (arquivosSelecionados.length + files.length > maxArquivos) {
    showAlert(formAlert, `Máximo de ${maxArquivos} arquivos permitidos`, 'error');
    return;
  }

  Array.from(files).forEach(file => {
    if (file.size > maxSize) {
      showAlert(formAlert, `Arquivo ${file.name} excede 10MB`, 'error');
      return;
    }
    arquivosSelecionados.push(file);
  });

  renderFileList();
}

function renderFileList() {
  fileList.innerHTML = arquivosSelecionados.map((file, index) => `
    <div class="file-item">
      <span>📄 ${file.name} (${(file.size / 1024).toFixed(1)} KB)</span>
      <span class="remove" onclick="removerArquivo(${index})">✕ Remover</span>
    </div>
  `).join('');
}

window.removerArquivo = (index) => {
  arquivosSelecionados.splice(index, 1);
  renderFileList();
};

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const senha = document.getElementById('loginSenha').value;

  btnLogin.disabled = true;
  btnLogin.innerHTML = '<span class="loading"></span> Entrando...';

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || 'Erro no login');
    }

    localStorage.setItem('@mantes:user', JSON.stringify(result.user));
    localStorage.setItem('@mantes:token', result.token);

    userName.textContent = result.user.nome;
    loginCard.style.display = 'none';
    mainCard.style.display = 'block';
    carregarProximoNumero();

  } catch (error) {
    showAlert(loginAlert, error.message, 'error');
  }

  btnLogin.disabled = false;
  btnLogin.textContent = 'Entrar';
});

// Logout
btnLogout.addEventListener('click', () => {
  localStorage.removeItem('@mantes:user');
  localStorage.removeItem('@mantes:token');
  location.reload();
});

// Criar OS
osForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  btnSubmit.disabled = true;
  btnSubmit.innerHTML = '<span class="loading"></span> Criando...';

  try {
    const formData = new FormData();
    formData.append('clienteId', document.getElementById('clienteId').value);
    formData.append('cnpj', document.getElementById('cnpj').value.replace(/\D/g, ''));
    formData.append('nomeCliente', document.getElementById('nomeCliente').value);
    formData.append('telefone', document.getElementById('telefone').value);
    formData.append('nomeTecnico', document.getElementById('nomeTecnico').value);
    formData.append('lider', document.getElementById('lider').value);
    formData.append('emailLider', document.getElementById('emailLider').value);
    formData.append('tipoSolicitacao', document.getElementById('tipoSolicitacao').value);
    formData.append('descricao', document.getElementById('descricao').value);

    arquivosSelecionados.forEach(file => {
      formData.append('arquivos', file);
    });

    const token = localStorage.getItem('@mantes:token');
    const res = await fetch(`${API_BASE}/os`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const os = await res.json();

    if (!res.ok) {
      throw new Error(os.error || 'Erro ao criar OS');
    }

    showAlert(formAlert, `OS ${os.numero} criada com sucesso!`, 'success');
    
    osForm.reset();
    arquivosSelecionados = [];
    fileList.innerHTML = '';
    carregarProximoNumero();

  } catch (error) {
    showAlert(formAlert, error.message, 'error');
  }

  btnSubmit.disabled = false;
  btnSubmit.textContent = 'Criar Ordem de Serviço';
});

// Máscaras de input
document.getElementById('cnpj').addEventListener('input', (e) => {
  e.target.value = formatadores.cnpj(e.target.value);
});

document.getElementById('telefone').addEventListener('input', (e) => {
  e.target.value = formatadores.telefone(e.target.value);
});

// Inicializar
checkAuth();
