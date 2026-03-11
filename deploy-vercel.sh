#!/bin/bash

# 🚀 Script de Deploy Rápido - Mantes na Vercel
# Uso: ./deploy-vercel.sh

echo "🔧 Preparando deploy do Mantes na Vercel..."

# Verifica se está em repo Git
if [ ! -d ".git" ]; then
    echo "📦 Inicializando Git..."
    git init
fi

# Adiciona todos os arquivos
echo "📦 Adicionando arquivos..."
git add .

# Commit
echo "💾 Criando commit..."
git commit -m "Deploy na Vercel - $(date +%Y-%m-%d-%H-%M)"

# Verifica se tem remote
if ! git remote | grep -q "origin"; then
    echo "❌ Adicione o remote do GitHub primeiro:"
    echo "   git remote add origin https://github.com/SEU_USUARIO/mantes.git"
    exit 1
fi

# Push
echo "🚀 Enviando para GitHub..."
git push -u origin main

echo ""
echo "✅ Código enviado para GitHub!"
echo ""
echo "📝 Agora na Vercel:"
echo "   1. Acesse https://vercel.com"
echo "   2. Import Project → mantes"
echo "   3. Environment Variables:"
echo "      - MONGODB_URI = (sua string do MongoDB)"
echo "      - JWT_SECRET = (senha segura)"
echo "   4. Deploy!"
echo ""
echo "🎉 Pronto!"
