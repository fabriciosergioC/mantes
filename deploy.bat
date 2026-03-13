@echo off
echo ============================================
echo   Deploy Mantes no Railway
echo ============================================
echo.

:: Verificar se Railway CLI esta instalado
where railway >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] Railway CLI nao encontrada. Instalando...
    npm install -g @railway/cli
)

:: Login
echo [1/5] Fazendo login no Railway...
railway login

:: Inicializar projeto
echo [2/5] Inicializando projeto...
railway init

:: Adicionar MongoDB
echo [3/5] Adicionando MongoDB...
railway add mongodb

:: Setar variaveis
echo [4/5] Configurando variaveis de ambiente...
railway variables set JWT_SECRET=mantes-secret-2026

:: Deploy
echo [5/5] Fazendo deploy...
railway up

echo.
echo ============================================
echo   Deploy concluido!
echo ============================================
echo.
echo Proximos passos:
echo 1. Acesse o painel do Railway
echo 2. Copie a MONGODB_URI do servico MongoDB
echo 3. Rode: railway variables set MONGODB_URI="sua-connection-string"
echo 4. Rode: railway run npm run seed (para criar usuario admin)
echo.
