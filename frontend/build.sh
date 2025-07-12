#!/bin/bash

# Instalar dependências
npm install

# Build do projeto
npm run build

# Verificar se a build foi bem-sucedida
if [ -d "dist" ]; then
  echo "Build concluído com sucesso!"
  ls -la dist/
else
  echo "Erro: Diretório dist não foi criado!"
  exit 1
fi
