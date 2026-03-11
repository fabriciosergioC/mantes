@echo off
REM 🚀 Script de Deploy Rápido - Mantes na Vercel (Windows)
REM Uso: deploy-vercel.bat

echo.
echo 🔧 Preparando deploy do Mantes na Vercel...
echo.

REM Verifica se está em repo Git
if not exist ".git" (
    echo 📦 Inicializando Git...
    git init
)

REM Adiciona todos os arquivos
echo 📦 Adicionando arquivos...
git add .

REM Commit
echo 💾 Criando commit...
git commit -m "Deploy na Vercel - %date% %time%"

REM Verifica se tem remote
git remote | findstr "origin" >nul
if errorlevel 1 (
    echo.
    echo ❌ Adicione o remote do GitHub primeiro:
    echo    git remote add origin https://github.com/SEU_USUARIO/mantes.git
    echo.
    pause
    exit /b 1
)

REM Push
echo.
echo 🚀 Enviando para GitHub...
git push -u origin main

echo.
echo ✅ Código enviado para GitHub!
echo.
echo 📝 Agora na Vercel:
echo    1. Acesse https://vercel.com
echo    2. Import Project → mantes
echo    3. Environment Variables:
echo       - MONGODB_URI = ^^(sua string do MongoDB^^)
echo       - JWT_SECRET = ^^(senha segura^^)
echo    4. Deploy!
echo.
echo 🎉 Pronto!
echo.
pause
