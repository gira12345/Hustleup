const fs = require('fs');
const path = require('path');

// Função para processar arquivos recursivamente
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      processFile(fullPath);
    }
  });
}

// Função para processar um arquivo
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Padrões para corrigir
  const patterns = [
    { from: /api\.(get|post|put|patch|delete)\('\/api\//g, to: "api.$1('/" },
    { from: /fetch\('\/api\//g, to: "fetch('/" },
    { from: /axios\.(get|post|put|patch|delete)\('\/api\//g, to: "axios.$1('/" }
  ];
  
  patterns.forEach(pattern => {
    const newContent = content.replace(pattern.from, pattern.to);
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Corrigido: ${filePath}`);
  }
}

// Processar diretório src
const srcPath = path.join(__dirname, 'frontend', 'src');
console.log('🔧 Corrigindo rotas duplicadas...');
processDirectory(srcPath);
console.log('🎉 Correção concluída!');
