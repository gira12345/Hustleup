# 🎨 HustleUp Frontend

## 📋 Descrição
Frontend da plataforma HustleUp - Interface moderna e responsiva para sistema de gestão de propostas de emprego para estudantes universitários. Aplicação React construída com Vite e Bootstrap.

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para interfaces
- **Vite** - Build tool e bundler moderno
- **React Router DOM** - Roteamento SPA
- **Bootstrap 5.3** - Framework CSS
- **React Bootstrap** - Componentes Bootstrap para React
- **Axios** - Cliente HTTP para API
- **Lucide React** - Ícones modernos
- **Tailwind CSS** - Framework CSS utilitário

## 🏗️ Estrutura do Projeto

```
frontend/
├── 📁 public/              # Arquivos estáticos
├── 📁 src/                 # Código fonte
│   ├── 📁 components/      # Componentes reutilizáveis
│   ├── 📁 config/          # Configurações
│   ├── 📁 pages/           # Páginas da aplicação
│   ├── 📁 services/        # Serviços e APIs
│   ├── 📁 styles/          # Estilos CSS
│   ├── 📄 App.jsx          # Componente principal
│   └── 📄 main.jsx         # Ponto de entrada
├── 📄 index.html           # Template HTML
├── 📄 package.json         # Dependências e scripts
├── 📄 vite.config.js       # Configuração do Vite
└── 📄 .env                 # Variáveis de ambiente
```

## 📁 Detalhamento das Pastas

### 📂 `/public`
Arquivos estáticos servidos diretamente.

- **`favicon.ico`** - Ícone da aplicação
- **`hustleup-logo.png`** - Logotipo da plataforma
- **`fundo1.png, fundo2.png, fundo3.png`** - Imagens de fundo
- **`vercel.json`** - Configuração para deploy no Vercel

### 📂 `/src/components`
Componentes reutilizáveis da aplicação.

- **`Sidebar.jsx`** - Barra lateral de navegação
- **`PainelKPIs.jsx`** - Painel de indicadores (KPIs)
- **`AdminDashboardKPIs.jsx`** - KPIs específicos do admin
- **`AdminDepartamentosSection.jsx`** - Seção de departamentos
- **`AdminEmpresasSection.jsx`** - Seção de empresas
- **`AdminGestoresSection.jsx`** - Seção de gestores
- **`AdminPropostasSection.jsx`** - Seção de propostas
- **`AdminUtilizadoresSection.jsx`** - Seção de utilizadores

### 📂 `/src/config`
Configurações da aplicação.

- **`axios.js`** - Configuração do cliente HTTP

### 📂 `/src/pages`
Páginas organizadas por tipo de utilizador.

#### 🔐 Autenticação
- **`Login.jsx`** - Página de login
- **`Registar.jsx`** - Registo de empresas

#### 👨‍💼 Administração (`/admin`)
- **`DashboardAdmin.jsx`** - Dashboard administrativo
- **`Utilizadores.jsx`** - Gestão de utilizadores
- **`CriarUtilizador.jsx`** - Criação de utilizadores
- **`EditarUtilizador.jsx`** - Edição de utilizadores
- **`Empresas.jsx`** - Gestão de empresas
- **`CriarEmpresa.jsx`** - Criação de empresas
- **`EditarEmpresa.jsx`** - Edição de empresas
- **`Gestores.jsx`** - Gestão de gestores
- **`CriarGestor.jsx`** - Criação de gestores
- **`EditarGestor.jsx`** - Edição de gestores
- **`Propostas.jsx`** - Gestão de propostas
- **`VerProposta.jsx`** - Visualização de propostas
- **`Departamentos.jsx`** - Gestão de departamentos
- **`CriarDepartamento.jsx`** - Criação de departamentos
- **`EditarDepartamento.jsx`** - Edição de departamentos

#### 🏢 Empresas (`/empresa`)
- **`DashboardEmpresa.jsx`** - Dashboard empresarial
- **`PerfilEmpresa.jsx`** - Perfil da empresa
- **`LayoutEmpresa.jsx`** - Layout específico
- **`CriarProposta.jsx`** - Criação de propostas
- **`EditarProposta.jsx`** - Edição de propostas
- **`Propostas.jsx`** - Gestão de propostas
- **`PropostasNova.jsx`** - Nova interface de propostas
- **`VerProposta.jsx`** - Visualização de propostas

#### 🎓 Gestores (`/gestor`)
- **`DashboardGestor.jsx`** - Dashboard de gestores
- **`GestorLayout.jsx`** - Layout específico
- **`CriarEmpresaGestor.jsx`** - Criação de empresas
- **`CriarPropostaGestor.jsx`** - Criação de propostas
- **`CriarUtilizador.jsx`** - Criação de utilizadores
- **`EditarEmpresa.jsx`** - Edição de empresas
- **`EditarProposta.jsx`** - Edição de propostas
- **`EditarPropostaGestor.jsx`** - Edição específica
- **`EditarUtilizador.jsx`** - Edição de utilizadores
- **`EmpresaGestor.jsx`** - Gestão de empresas
- **`PropostasGestor.jsx`** - Gestão de propostas
- **`UtilizadoresGestor.jsx`** - Gestão de utilizadores
- **`VerProposta.jsx`** - Visualização de propostas
- **`VerPropostaGestor.jsx`** - Visualização específica
- **`DepartamentosDropdown.jsx`** - Dropdown de departamentos

#### 🎓 Estudantes (`/utilizador`)
- **`DashboardUtilizador.jsx`** - Dashboard do estudante
- **`UserLayout.jsx`** - Layout específico
- **`PerfilUtilizador.jsx`** - Perfil do utilizador
- **`ExplorarPropostas.jsx`** - Exploração de propostas
- **`PropostasCompativeis.jsx`** - Propostas compatíveis
- **`Favoritos.jsx`** - Propostas favoritas
- **`VerProposta.jsx`** - Visualização de propostas

### 📂 `/src/services`
Serviços e comunicação com API.

- **`api.js`** - Configuração e endpoints da API

### 📂 `/src/styles`
Estilos da aplicação.

- **`global.css`** - Estilos globais consolidados
- **`README.md`** - Documentação dos estilos

## 🎯 Funcionalidades Principais

### 🔐 Autenticação
- **Login** com validação de credenciais
- **Registo** de empresas com validação
- **Logout** automático por timeout
- **Proteção** de rotas por role

### 👨‍💼 Painel Administrativo
- **Dashboard** com KPIs e métricas
- **Gestão** completa de utilizadores
- **Validação** de empresas registadas
- **Supervisão** de propostas
- **Gestão** de departamentos

### 🏢 Painel Empresarial
- **Dashboard** com estatísticas
- **Gestão** de perfil empresarial
- **Criação** e edição de propostas
- **Gestão** de candidaturas
- **Relatórios** e métricas

### 🎓 Painel de Gestores
- **Validação** de propostas por departamento
- **Gestão** de utilizadores do departamento
- **Supervisão** de empresas associadas
- **Relatórios** departamentais

### 🎓 Painel de Estudantes
- **Exploração** de propostas
- **Sistema** de favoritos
- **Propostas** compatíveis com perfil
- **Gestão** de candidaturas
- **Perfil** personalizável

## 🎨 Design e Interface

### 🎭 Temas e Estilos
- **Bootstrap 5.3** para componentes
- **Tailwind CSS** para utilitários
- **Design responsivo** para todos os dispositivos
- **Cores** personalizadas da marca HustleUp

### 📱 Responsividade
- **Mobile-first** design
- **Breakpoints** otimizados
- **Navegação** adaptativa
- **Componentes** flexíveis

### 🖼️ Recursos Visuais
- **Ícones** modernos com Lucide React
- **Imagens** de fundo rotativas
- **Animações** suaves
- **Feedback** visual para ações

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js >= 18.0.0
- npm >= 8.0.0

### Passos de Instalação

1. **Clone o repositório**
   ```bash
   git clone [url-do-repositorio]
   cd frontend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env`:
   ```env
   VITE_API_URL=https://hustleup-backend.onrender.com/api
   VITE_APP_NAME=HustleUp
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   ```
   http://localhost:3000
   ```

## 🔧 Scripts NPM

```bash
npm run dev      # Desenvolvimento (localhost:3000)
npm run build    # Build para produção
npm run preview  # Preview da build
npm start        # Servidor de produção
```

## 🛣️ Roteamento

### Rotas Públicas
- `/` - Redirecionamento para login
- `/login` - Página de login
- `/registar` - Registo de empresas

### Rotas Protegidas por Role

#### 👨‍💼 Administrador (`/admin`)
- `/admin` - Dashboard administrativo
- `/admin/utilizadores` - Gestão de utilizadores
- `/admin/empresas` - Gestão de empresas
- `/admin/gestores` - Gestão de gestores
- `/admin/propostas` - Gestão de propostas
- `/admin/departamentos` - Gestão de departamentos

#### 🏢 Empresa (`/empresa`)
- `/empresa` - Dashboard empresarial
- `/empresa/perfil` - Perfil da empresa
- `/empresa/propostas` - Gestão de propostas
- `/empresa/criar-proposta` - Criação de propostas

#### 🎓 Gestor (`/gestor`)
- `/gestor` - Dashboard de gestores
- `/gestor/propostas` - Validação de propostas
- `/gestor/utilizadores` - Gestão de utilizadores
- `/gestor/empresas` - Gestão de empresas

#### 🎓 Estudante (`/utilizador`)
- `/utilizador` - Dashboard do estudante
- `/utilizador/perfil` - Perfil do utilizador
- `/utilizador/explorar` - Explorar propostas
- `/utilizador/favoritos` - Propostas favoritas
- `/utilizador/compativeis` - Propostas compatíveis

## 🔧 Configuração do Vite

### Funcionalidades
- **Hot Module Replacement (HMR)** para desenvolvimento
- **Build otimizado** para produção
- **Servidor de desenvolvimento** rápido
- **Suporte** a JSX e CSS

### Configurações
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: false
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

## 📡 Integração com API

### Configuração Axios
```javascript
// src/config/axios.js
const API_BASE = '/api';

const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  // Configuração automática de headers
  // Gestão de erros centralizada
  // Logout automático em caso de 401
}
```

### Endpoints Principais
- **Autenticação**: `/auth/login`, `/auth/register`
- **Utilizadores**: `/admin/users`, `/estudante/perfil`
- **Empresas**: `/empresa/perfil`, `/admin/empresas`
- **Propostas**: `/propostas`, `/empresa/propostas`
- **Candidaturas**: `/candidaturas`

## 🔒 Segurança

### Autenticação
- **JWT tokens** armazenados em localStorage
- **Verificação** automática de tokens
- **Logout** automático em caso de token inválido
- **Proteção** de rotas por role

### Validação
- **Validação** de formulários
- **Sanitização** de dados
- **Prevenção** de XSS
- **Validação** de permissões

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Componentes Adaptativos
- **Sidebar** colapsável em mobile
- **Tables** com scroll horizontal
- **Cards** responsivos
- **Forms** otimizados para mobile

## 🎨 Customização de Estilos

### CSS Global
```css
/* src/styles/global.css */
:root {
  --primary-color: #112D4E;
  --secondary-color: #0b1a2d;
  --accent-color: #007bff;
}
```

### Bootstrap Customizado
- **Cores** personalizadas
- **Componentes** estilizados
- **Utilities** customizadas
- **Responsive** breakpoints

## 🚀 Build e Deploy

### Build para Produção
```bash
npm run build
```

### Deploy Automático
- **Vercel** (configuração incluída)
- **Netlify** compatível
- **GitHub Pages** suportado
- **Render** preparado

### Configuração de Deploy
```json
// vercel.json
{
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

## 🧪 Testes

### Estrutura de Testes
```bash
# Executar testes (quando implementados)
npm run test
```

### Tipos de Testes
- **Unit tests** para componentes
- **Integration tests** para fluxos
- **E2E tests** para cenários completos

## 📊 Monitorização

### Performance
- **Lighthouse** scores otimizados
- **Bundle size** otimizado
- **Lazy loading** implementado
- **Code splitting** automático

### Analytics
- **User interactions** tracking
- **Error monitoring** implementado
- **Performance metrics** coletadas

## 🔄 Estado da Aplicação

### Gestão de Estado
- **Local state** com useState
- **Global state** via Context API
- **Cached data** com localStorage
- **Form state** com formulários controlados

### Persistência
- **Token** em localStorage
- **User data** cached
- **Preferences** persistidas
- **Form data** temporária

## 🌐 Internacionalização

### Idiomas Suportados
- **Português** (padrão)
- **Inglês** (preparado)

### Estrutura i18n
```javascript
// Preparado para implementação futura
const translations = {
  pt: { /* traduções em português */ },
  en: { /* traduções em inglês */ }
}
```

## 📚 Documentação Adicional

### Guias de Desenvolvimento
- **Component Guidelines** - Padrões de componentes
- **Styling Guide** - Guia de estilos
- **API Integration** - Integração com backend
- **Deployment Guide** - Guia de deploy

### Recursos Externos
- [React Documentation](https://reactjs.org/)
- [Bootstrap Documentation](https://getbootstrap.com/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)

## 🐛 Troubleshooting

### Problemas Comuns
1. **Erro de CORS**: Verificar configuração do backend
2. **Token expirado**: Fazer login novamente
3. **Build falha**: Verificar dependências
4. **Rotas não funcionam**: Verificar configuração do servidor

### Logs e Debug
```bash
# Modo desenvolvimento com logs
npm run dev

# Build com sourcemaps
npm run build
```

## 👥 Contribuição

### Padrões de Código
- **ESLint** configurado
- **Prettier** para formatação
- **Conventional commits** recomendado
- **Component patterns** definidos

### Fluxo de Contribuição
1. Fork o projeto
2. Crie uma branch para a feature
3. Implemente e teste
4. Submeta um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte técnico:
- Crie uma **issue** no repositório
- Contacte a equipa de desenvolvimento
- Consulte a documentação

---

**Desenvolvido com ❤️ pela equipa HustleUp** 🚀
