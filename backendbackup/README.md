# 🚀 HustleUp Backend

## 📋 Descrição
Backend da plataforma HustleUp - Sistema de gestão de propostas de emprego para estudantes universitários. API RESTful construída com Node.js, Express e PostgreSQL.

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Base de dados relacional
- **Sequelize** - ORM (Object-Relational Mapping)
- **JWT** - Autenticação e autorização
- **bcryptjs** - Encriptação de passwords
- **Multer** - Upload de arquivos
- **CORS** - Cross-Origin Resource Sharing

## 🏗️ Estrutura do Projeto

```
backendbackup/
├── 📁 config/           # Configurações da aplicação
├── 📁 controllers/      # Lógica de negócio
├── 📁 middleware/       # Middlewares personalizados
├── 📁 models/          # Modelos da base de dados
├── 📁 routes/          # Rotas da API
├── 📁 utils/           # Utilitários
├── 📄 app.js           # Configuração da aplicação
├── 📄 server.js        # Servidor principal
├── 📄 package.json     # Dependências e scripts
└── 📄 .env            # Variáveis de ambiente
```

## 📁 Detalhamento das Pastas

### 🔧 `/config`
Configurações da aplicação e base de dados.

- **`config.json`** - Configurações do Sequelize (desenvolvimento, teste, produção)
- **`db.js`** - Configuração da conexão com PostgreSQL

### 🎮 `/controllers`
Contém a lógica de negócio para cada entidade do sistema.

- **`adminController.js`** - Gestão de administradores
  - Dashboard com KPIs
  - Gestão de utilizadores, empresas e propostas
  - Validação de empresas e propostas
  
- **`authController.js`** - Autenticação e autorização
  - Login e logout
  - Registo de empresas
  - Verificação de tokens JWT
  
- **`candidaturaController.js`** - Gestão de candidaturas
  - Criação de candidaturas por estudantes
  - Resposta às candidaturas por empresas
  - Listagem e estatísticas
  
- **`empresaController.js`** - Gestão de empresas
  - Perfil da empresa
  - Dashboard empresarial
  - Gestão de propostas da empresa
  
- **`estudanteController.js`** - Gestão de estudantes
  - Perfil do estudante
  - Sistema de favoritos
  - Propostas compatíveis
  
- **`gestorController.js`** - Gestão de gestores
  - Validação de propostas
  - Gestão por departamento
  - Relatórios e estatísticas
  
- **`propostaController.js`** - Gestão de propostas
  - CRUD de propostas
  - Filtros e pesquisa
  - Validação e aprovação

### 🛡️ `/middleware`
Middlewares para validação e segurança.

- **`verifyToken.js`** - Verificação de tokens JWT
- **`checkRole.js`** - Validação de roles/permissões
- **`upload.js`** - Upload de ficheiros (CVs, documentos)

### 🗄️ `/models`
Modelos Sequelize para a base de dados.

#### Modelos Principais:
- **`user.js`** - Utilizadores do sistema
- **`empresa.js`** - Empresas registadas
- **`estudante.js`** - Estudantes universitários
- **`proposta.js`** - Propostas de emprego/estágio
- **`candidatura.js`** - Candidaturas dos estudantes
- **`departamento.js`** - Departamentos universitários
- **`setor.js`** - Setores empresariais

#### Modelos de Relacionamento:
- **`empresa_departamento.js`** - Relação empresa-departamento
- **`empresa_setor.js`** - Relação empresa-setor
- **`estudante_departamento.js`** - Relação estudante-departamento
- **`estudante_setor.js`** - Relação estudante-setor
- **`estudante_favorito.js`** - Propostas favoritas dos estudantes
- **`gestor_departamento.js`** - Relação gestor-departamento
- **`gestorPermissoes.js`** - Permissões dos gestores
- **`pedidoRemocao.js`** - Pedidos de remoção de conta

### 🛣️ `/routes`
Definição das rotas da API.

- **`authRoutes.js`** - Rotas de autenticação
  - `POST /auth/login` - Login
  - `POST /auth/registar-empresa` - Registo de empresa
  - `POST /auth/logout` - Logout
  
- **`adminRoutes.js`** - Rotas administrativas
  - `GET /admin/dashboard` - Dashboard
  - `GET /admin/usuarios` - Gestão de utilizadores
  - `PATCH /admin/empresas/:id/validar` - Validar empresa
  
- **`empresaRoutes.js`** - Rotas das empresas
  - `GET /empresa/perfil` - Perfil da empresa
  - `GET /empresa/dashboard` - Dashboard empresarial
  - `GET /empresa/propostas` - Propostas da empresa
  
- **`estudanteRoutes.js`** - Rotas dos estudantes
  - `GET /estudante/perfil` - Perfil do estudante
  - `GET /estudante/favoritos` - Propostas favoritas
  - `GET /estudante/propostas-compativeis` - Propostas compatíveis
  
- **`gestorRoutes.js`** - Rotas dos gestores
  - `GET /gestor/propostas` - Propostas para validação
  - `PATCH /gestor/propostas/:id/validar` - Validar proposta
  
- **`propostaRoutes.js`** - Rotas das propostas
  - `GET /propostas` - Listar propostas
  - `POST /propostas` - Criar proposta
  - `GET /propostas/:id` - Detalhe da proposta
  
- **`candidaturaRoutes.js`** - Rotas das candidaturas
  - `POST /candidaturas` - Criar candidatura
  - `GET /candidaturas/estudante` - Candidaturas do estudante
  - `GET /candidaturas/empresa` - Candidaturas da empresa

### 🔧 `/utils`
Utilitários e funções auxiliares.

- **`generateToken.js`** - Geração de tokens JWT

## 🎯 Funcionalidades Principais

### 👥 Sistema de Utilizadores
- **Administradores**: Gestão completa da plataforma
- **Empresas**: Criação e gestão de propostas
- **Estudantes**: Candidaturas e pesquisa de propostas
- **Gestores**: Validação de propostas por departamento

### 🔐 Autenticação e Autorização
- Login/logout com JWT
- Controlo de acesso baseado em roles
- Middleware de verificação de permissões

### 📊 Dashboard e Estatísticas
- KPIs para administradores
- Métricas empresariais
- Relatórios de candidaturas

### 🔍 Sistema de Propostas
- CRUD completo
- Filtros avançados
- Sistema de validação
- Compatibilidade com perfis

### 📝 Sistema de Candidaturas
- Upload de CVs
- Cartas de motivação
- Gestão de estados
- Notificações

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js >= 18.0.0
- PostgreSQL >= 12
- npm >= 8.0.0

### Passos de Instalação

1. **Clone o repositório**
   ```bash
   git clone [url-do-repositorio]
   cd backendbackup
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
   PORT=3001
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_here
   DATABASE_URL=postgresql://user:password@localhost:5432/hustleup
   ```

4. **Execute as migrações**
   ```bash
   npx sequelize-cli db:migrate
   ```

5. **Execute os seeders (opcional)**
   ```bash
   npx sequelize-cli db:seed:all
   ```

6. **Inicie o servidor**
   ```bash
   # Desenvolvimento
   npm run dev
   
   # Produção
   npm start
   ```

## 📡 API Endpoints

### 🔐 Autenticação
```
POST /api/auth/login           # Login
POST /api/auth/registar-empresa # Registo de empresa
POST /api/auth/logout          # Logout
GET  /api/auth/me             # Perfil do utilizador
```

### 👨‍💼 Administração
```
GET  /api/admin/dashboard      # Dashboard
GET  /api/admin/usuarios       # Listar utilizadores
GET  /api/admin/empresas       # Listar empresas
PATCH /api/admin/empresas/:id/validar # Validar empresa
```

### 🏢 Empresas
```
GET  /api/empresa/perfil       # Perfil da empresa
PUT  /api/empresa/perfil       # Atualizar perfil
GET  /api/empresa/dashboard    # Dashboard
GET  /api/empresa/propostas    # Propostas da empresa
```

### 🎓 Estudantes
```
GET  /api/estudante/perfil     # Perfil do estudante
PUT  /api/estudante/perfil     # Atualizar perfil
GET  /api/estudante/favoritos  # Propostas favoritas
POST /api/estudante/favoritos  # Adicionar favorito
```

### 📋 Propostas
```
GET  /api/propostas           # Listar propostas
POST /api/propostas           # Criar proposta
GET  /api/propostas/:id       # Detalhe da proposta
PUT  /api/propostas/:id       # Atualizar proposta
DELETE /api/propostas/:id     # Eliminar proposta
```

### 📝 Candidaturas
```
POST /api/candidaturas        # Criar candidatura
GET  /api/candidaturas/estudante # Candidaturas do estudante
GET  /api/candidaturas/empresa   # Candidaturas da empresa
PUT  /api/candidaturas/:id/responder # Responder candidatura
```

## 🔧 Scripts NPM

```bash
npm run dev      # Desenvolvimento com nodemon
npm start        # Produção
npm run build    # Build (não necessário para Node.js)
```

## 🗄️ Base de Dados

O sistema utiliza PostgreSQL com as seguintes tabelas principais:

- **users** - Utilizadores do sistema
- **empresas** - Empresas registadas
- **estudantes** - Estudantes universitários
- **propostas** - Propostas de emprego/estágio
- **candidaturas** - Candidaturas dos estudantes
- **departamentos** - Departamentos universitários
- **setores** - Setores empresariais

## 🔒 Segurança

- **JWT** para autenticação
- **bcryptjs** para hash de passwords
- **CORS** configurado para domínios específicos
- **Validação** de dados de entrada
- **Controlo de acesso** baseado em roles

## 📈 Monitorização

- **Morgan** para logging de requests
- **Console logs** para debugging
- **Error handling** centralizado

## 🌐 Deploy

O backend está preparado para deploy em:
- **Render.com** (configuração incluída)
- **Heroku**
- **Railway**
- **DigitalOcean**

## 👥 Contribuição

1. Fork o projeto
2. Crie uma branch para a feature (`git checkout -b feature/AmazingFeature`)
3. Commit as mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, contacte a equipa de desenvolvimento ou crie uma issue no repositório.

---

**Desenvolvido pela equipa HustleUp** 🚀
