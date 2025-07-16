# HustleUp - Plataforma de Gestão de Estágios

## Visão Geral

O HustleUp é uma plataforma web completa para gestão de estágios que conecta estudantes, empresas e gestores académicos. O sistema permite a criação, gestão e candidatura a propostas de estágio, com diferentes níveis de acesso e permissões.

## Arquitetura do Sistema

### Backend (Node.js + Express + PostgreSQL)
- **Linguagem**: JavaScript (Node.js)
- **Framework**: Express.js
- **Base de Dados**: PostgreSQL
- **ORM**: Sequelize
- **Autenticação**: JWT (JSON Web Tokens)
- **Estrutura**: RESTful API

### Frontend (React + Vite)
- **Linguagem**: JavaScript (React)
- **Build Tool**: Vite
- **Roteamento**: React Router
- **HTTP Client**: Axios
- **UI**: CSS personalizado

---

## Backend - Estrutura e Código

### 1. Configuração do Servidor (`server.js`)

```javascript
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend HustleUp operacional na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  
  sequelize.authenticate()
    .then(() => {
      console.log('Conexão com base de dados estabelecida');
      
      if (process.env.NODE_ENV === 'production') {
        return sequelize.sync({ force: false, alter: true });
      } else {
        return sequelize.sync({ alter: true });
      }
    })
    .then(() => {
      console.log('Modelos sincronizados com a base de dados');
    })
    .catch((err) => {
      console.error('Erro na conexão com base de dados:', err.message);
    });
});
```

**Funcionalidades principais:**
- Inicialização do servidor Express
- Configuração da conexão com PostgreSQL
- Sincronização dos modelos Sequelize
- Tratamento de erros de conexão

### 2. Configuração da Base de Dados (`config/db.js`)

```javascript
const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.DATABASE_URL) {
  // Configuração para produção (Heroku/Railway)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  // Configuração para desenvolvimento local
  const config = require('./config.json')[process.env.NODE_ENV || 'development'];
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: false
  });
}

module.exports = sequelize;
```

### 3. Autenticação JWT (`middleware/verifyToken.js`)

```javascript
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido' });
  }
};

module.exports = verifyToken;
```

### 4. Controle de Acesso (`middleware/checkRole.js`)

```javascript
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Utilizador não autenticado' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    
    next();
  };
};

module.exports = checkRole;
```

### 5. Modelo de Utilizador (`models/user.js`)

```javascript
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'gestor', 'empresa', 'estudante'),
      allowNull: false,
      defaultValue: 'estudante'
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'users',
    timestamps: true
  });

  return User;
};
```

### 6. Controller de Autenticação (`controllers/authController.js`)

```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Estudante, Empresa } = require('../models');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Procurar utilizador
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    // Verificar password
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

module.exports = { login };
```

### 7. Rotas API (`routes/authRoutes.js`)

```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

// Rotas públicas
router.post('/login', authController.login);
router.post('/register', authController.register);

// Rotas protegidas
router.get('/profile', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, authController.updateProfile);

module.exports = router;
```

### 8. Gestão de Propostas (`controllers/propostaController.js`)

```javascript
const { Proposta, Empresa, Departamento, Setor } = require('../models');

const criarProposta = async (req, res) => {
  try {
    const {
      nome,
      descricao,
      requisitos,
      objetivos,
      duracao,
      remuneracao,
      departamento_id,
      setor_id
    } = req.body;
    
    const novaProposta = await Proposta.create({
      nome,
      descricao,
      requisitos,
      objetivos,
      duracao,
      remuneracao,
      empresa_id: req.user.empresaId,
      departamento_id,
      setor_id,
      estado: 'pendente'
    });
    
    res.status(201).json({
      message: 'Proposta criada com sucesso',
      proposta: novaProposta
    });
    
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao criar proposta', 
      error: error.message 
    });
  }
};

const listarPropostas = async (req, res) => {
  try {
    const propostas = await Proposta.findAll({
      include: [
        {
          model: Empresa,
          attributes: ['nome', 'setor']
        },
        {
          model: Departamento,
          attributes: ['nome']
        }
      ],
      where: { estado: 'ativa' },
      order: [['createdAt', 'DESC']]
    });
    
    res.json(propostas);
    
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao listar propostas', 
      error: error.message 
    });
  }
};

module.exports = { criarProposta, listarPropostas };
```

---

## Frontend - Estrutura e Código

### 1. Configuração Principal (`src/main.jsx`)

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

### 2. Configuração do Axios (`src/config/axios.js`)

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratamento de respostas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 3. Componente de Login (`src/pages/Login.jsx`)

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/auth/login', formData);
      
      // Guardar token e dados do utilizador
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirecionar baseado no role
      const { role } = response.data.user;
      switch (role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'empresa':
          navigate('/empresa/dashboard');
          break;
        case 'estudante':
          navigate('/utilizador/dashboard');
          break;
        case 'gestor':
          navigate('/gestor/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Erro no login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login - HustleUp</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
```

### 4. Dashboard do Estudante (`src/pages/utilizador/DashboardEstudante.jsx`)

```javascript
import React, { useState, useEffect } from 'react';
import api from '../../config/axios';

const DashboardEstudante = () => {
  const [propostas, setPropostas] = useState([]);
  const [candidaturas, setCandidaturas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [propostasRes, candidaturasRes] = await Promise.all([
        api.get('/api/propostas'),
        api.get('/api/candidaturas/minhas')
      ]);
      
      setPropostas(propostasRes.data);
      setCandidaturas(candidaturasRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const candidatar = async (propostaId) => {
    try {
      await api.post('/api/candidaturas', { proposta_id: propostaId });
      alert('Candidatura enviada com sucesso!');
      carregarDados();
    } catch (error) {
      alert('Erro ao enviar candidatura');
    }
  };

  if (loading) return <div>A carregar...</div>;

  return (
    <div className="dashboard-estudante">
      <h1>Dashboard do Estudante</h1>
      
      <section className="propostas-section">
        <h2>Propostas Disponíveis</h2>
        <div className="propostas-grid">
          {propostas.map(proposta => (
            <div key={proposta.id} className="proposta-card">
              <h3>{proposta.nome}</h3>
              <p><strong>Empresa:</strong> {proposta.Empresa?.nome}</p>
              <p><strong>Departamento:</strong> {proposta.Departamento?.nome}</p>
              <p><strong>Duração:</strong> {proposta.duracao} meses</p>
              <p><strong>Remuneração:</strong> €{proposta.remuneracao}</p>
              <p>{proposta.descricao}</p>
              <button onClick={() => candidatar(proposta.id)}>
                Candidatar-me
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="candidaturas-section">
        <h2>Minhas Candidaturas</h2>
        <div className="candidaturas-list">
          {candidaturas.map(candidatura => (
            <div key={candidatura.id} className="candidatura-item">
              <h4>{candidatura.Proposta?.nome}</h4>
              <span className={`status ${candidatura.estado}`}>
                {candidatura.estado}
              </span>
              <p>Data: {new Date(candidatura.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardEstudante;
```

### 5. Serviços API (`src/services/api.js`)

```javascript
import axios from '../config/axios';

export const authService = {
  login: (credentials) => axios.post('/api/auth/login', credentials),
  register: (userData) => axios.post('/api/auth/register', userData),
  getProfile: () => axios.get('/api/auth/profile'),
  updateProfile: (data) => axios.put('/api/auth/profile', data)
};

export const propostaService = {
  listar: () => axios.get('/api/propostas'),
  obter: (id) => axios.get(`/api/propostas/${id}`),
  criar: (data) => axios.post('/api/propostas', data),
  atualizar: (id, data) => axios.put(`/api/propostas/${id}`, data),
  eliminar: (id) => axios.delete(`/api/propostas/${id}`)
};

export const candidaturaService = {
  listar: () => axios.get('/api/candidaturas'),
  minhas: () => axios.get('/api/candidaturas/minhas'),
  criar: (data) => axios.post('/api/candidaturas', data),
  atualizar: (id, data) => axios.put(`/api/candidaturas/${id}`, data)
};

export const empresaService = {
  listar: () => axios.get('/api/empresas'),
  obter: (id) => axios.get(`/api/empresas/${id}`),
  criar: (data) => axios.post('/api/empresas', data),
  atualizar: (id, data) => axios.put(`/api/empresas/${id}`, data)
};
```

### 6. Layout Principal (`src/layouts/PainelLayout.jsx`)

```javascript
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const PainelLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="painel-layout">
      <Sidebar user={user} onLogout={logout} />
      <main className="main-content">
        <header className="header">
          <h1>HustleUp - {user.role}</h1>
          <div className="user-info">
            <span>Bem-vindo, {user.nome}</span>
            <button onClick={logout}>Sair</button>
          </div>
        </header>
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PainelLayout;
```

---

## Estrutura de Ficheiros

### Backend
```
backendbackup/
├── config/
│   ├── config.json          # Configurações da base de dados
│   └── db.js               # Configuração do Sequelize
├── controllers/
│   ├── adminController.js   # Gestão administrativa
│   ├── authController.js    # Autenticação
│   ├── empresaController.js # Gestão de empresas
│   ├── estudanteController.js # Gestão de estudantes
│   └── propostaController.js # Gestão de propostas
├── middleware/
│   ├── verifyToken.js      # Verificação JWT
│   ├── checkRole.js        # Controlo de acesso
│   └── upload.js           # Upload de ficheiros
├── models/
│   ├── user.js             # Modelo do utilizador
│   ├── empresa.js          # Modelo da empresa
│   ├── estudante.js        # Modelo do estudante
│   ├── proposta.js         # Modelo da proposta
│   └── candidatura.js      # Modelo da candidatura
├── routes/
│   ├── authRoutes.js       # Rotas de autenticação
│   ├── empresaRoutes.js    # Rotas das empresas
│   └── propostaRoutes.js   # Rotas das propostas
├── app.js                  # Configuração do Express
└── server.js              # Servidor principal
```

### Frontend
```
frontend/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   └── PainelKPIs.jsx
│   ├── config/
│   │   └── axios.js
│   ├── layouts/
│   │   └── PainelLayout.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── admin/
│   │   ├── empresa/
│   │   ├── gestor/
│   │   └── utilizador/
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   └── main.jsx
├── public/
└── package.json
```

---

## Funcionalidades Principais

### 1. **Sistema de Autenticação**
- Login/Logout com JWT
- Controlo de acesso baseado em roles
- Sessões persistentes

### 2. **Gestão de Utilizadores**
- Criação de contas (Admin, Gestor, Empresa, Estudante)
- Perfis personalizados por tipo de utilizador
- Ativação/desativação de contas

### 3. **Gestão de Propostas**
- Criação de propostas de estágio
- Aprovação/rejeição pelo gestor
- Candidaturas dos estudantes
- Estados: pendente, ativa, arquivada

### 4. **Dashboard por Role**
- **Admin**: Gestão completa do sistema
- **Gestor**: Aprovação de propostas e gestão de departamentos
- **Empresa**: Criação e gestão de propostas
- **Estudante**: Visualização e candidatura a propostas

### 5. **Relatórios e KPIs**
- Estatísticas de utilizadores
- Métricas de propostas
- Relatórios de candidaturas

---

## Instalação e Configuração

### Backend
```bash
cd backendbackup
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Variáveis de Ambiente
```env
# Backend
DATABASE_URL=postgresql://username:password@localhost:5432/hustleup
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
PORT=3001

# Frontend
VITE_API_URL=http://localhost:3001
```

---

## Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM para PostgreSQL
- **JWT** - Autenticação
- **bcrypt** - Hashing de passwords
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Gestão de variáveis de ambiente

### Frontend
- **React** - Biblioteca UI
- **Vite** - Build tool
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **CSS3** - Estilização

### Base de Dados
- **PostgreSQL** - Sistema de gestão de base de dados

---

## Deployment e Resolução de Problemas

### Deployment no Render

O backend está configurado para deployment automático na plataforma Render. As principais configurações incluem:

#### Build Command
```bash
npm install
```

#### Start Command
```bash
npm start
```

#### Variáveis de Ambiente (Production)
```env
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your_production_jwt_secret
NODE_ENV=production
```

### Problemas Comuns e Soluções

#### 1. **Erro: "Route.get() requires a callback function but got a [object Undefined]"**

**Causa**: Funções não existentes sendo referenciadas nas rotas.

**Solução**:
```javascript
// routes/adminRoutes.js - Remover rotas que referenciam funções inexistentes
// ❌ Função não existe no controller
router.get('/propostas/:id/teste', adminController.testeObterProposta);
router.get('/debug/empresas', adminController.debugEmpresas);

// ✅ Verificar se a função existe no controller antes de criar a rota
// No adminController.js
exports.testeObterProposta = async (req, res) => {
  // Implementação da função
};
```

#### 2. **Erro de Conexão com Base de Dados**

**Verificações**:
- Confirmar que `DATABASE_URL` está definida
- Verificar se o SSL está configurado corretamente para produção
- Testar conexão local vs produção

```javascript
// config/db.js
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Para produção
      }
    }
  });
}
```

#### 3. **Middleware de Autenticação**

**Verificar sintaxe do checkRole**:
```javascript
// middleware/checkRole.js
module.exports = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    next();
  };
};

// routes/adminRoutes.js
router.use(checkRole('admin')); // ✅ Correto
```

### Processo de Deploy

1. **Verificar Código**:
   ```bash
   node -c server.js  # Verificar sintaxe
   npm test          # Executar testes (se existirem)
   ```

2. **Configurar Variáveis de Ambiente**:
   - `DATABASE_URL`: String de conexão PostgreSQL
   - `JWT_SECRET`: Chave secreta para tokens
   - `NODE_ENV`: `production`

3. **Deploy Automático**:
   - Push para branch `main` no GitHub
   - Render detecta mudanças e faz deploy automático
   - Verifica logs de build e runtime

### Monitorização

#### Logs de Produção
```javascript
// server.js
console.log(`Backend HustleUp operacional na porta ${PORT}`);
console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
console.log('Conexão com base de dados estabelecida');
```

#### Health Check
```javascript
// routes/testRoutes.js
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});
```

### Estrutura de Logs

```javascript
// Exemplo de log estruturado
const logInfo = {
  timestamp: new Date().toISOString(),
  level: 'INFO',
  message: 'Servidor iniciado',
  port: PORT,
  environment: process.env.NODE_ENV
};
console.log(JSON.stringify(logInfo));
```

---

## Contribuição

Este projeto foi desenvolvido como parte do sistema de gestão de estágios da instituição académica, implementando as melhores práticas de desenvolvimento web moderno.
