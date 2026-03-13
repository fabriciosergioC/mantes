// Mantes Frontend - MongoDB API Integration
import { auth, api } from './api.js';

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
  if (auth.isAuthenticated()) {
    try {
      currentUser = auth.getUser();
      userName.textContent = currentUser.nome;
      loginCard.style.display = 'none';
      mainCard.style.display = 'block';
      carregarProximoNumero();
    } catch (error) {
      console.error('Erro ao validar sessão:', error);
      auth.logout();
      loginCard.style.display = 'block';
      mainCard.style.display = 'none';
    }
  } else {
    loginCard.style.display = 'block';
    mainCard.style.display = 'none';
  }
}

// Mostrar alerta
function showAlert(element, message, type = 'error') {
  element.textContent = message;
  element.className = `alert ${type} show`;
  setTimeout(() => element.classList.remove('show'), 5000);
}

// Login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginSenha').value;

  btnLogin.disabled = true;
  btnLogin.innerHTML = '<span class="loading"></span> Entrando...';

  try {
    const result = await auth.login(email, password);
    currentUser = { userId: result.userId, email: result.email, nome: result.nome };
    userName.textContent = currentUser.nome;
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
  auth.logout();
  currentUser = null;
  location.reload();
});

// Carregar próximo número da OS
async function carregarProximoNumero() {
  try {
    const orders = await api.getOS();
    let nextNum = 1001;
    if (orders.length > 0) {
      const lastNum = parseInt(orders[0].numero.replace('OS-', ''));
      nextNum = lastNum + 1;
    }
    numeroInput.value = `OS-${String(nextNum).padStart(5, '0')}`;
  } catch (error) {
    console.error('Erro ao carregar número:', error);
    numeroInput.value = `OS-${String(1001).padStart(5, '0')}`;
  }
}

// Manipular arquivos
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
  const files = Array.from(e.dataTransfer.files);
  arquivosSelecionados = [...arquivosSelecionados, ...files];
  renderFileList();
});

document.getElementById('fileInput')?.addEventListener('change', (e) => {
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
      <button type="button" class="remove" onclick="removeFile(${index})">×</button>
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
    await api.createOS({
      cnpj: document.getElementById('cnpj').value.replace(/\D/g, ''),
      nome_cliente: document.getElementById('nomeCliente').value,
      telefone: document.getElementById('telefone').value,
      nome_tecnico: document.getElementById('nomeTecnico').value,
      lider: document.getElementById('lider').value,
      email_lider: document.getElementById('emailLider').value,
      tipo_solicitacao: document.getElementById('tipoSolicitacao').value,
      descricao: document.getElementById('descricao').value,
      arquivos: arquivosSelecionados.map(f => f.name)
    });

    showAlert(formAlert, 'OS criada com sucesso!', 'success');
    osForm.reset();
    arquivosSelecionados = [];
    renderFileList();
    carregarProximoNumero();
  } catch (error) {
    showAlert(formAlert, `Erro: ${error.message}`, 'error');
  }

  btnSubmit.disabled = false;
  btnSubmit.textContent = 'Criar OS';
});

// Inicializar
checkAuth();
