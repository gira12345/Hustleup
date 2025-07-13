require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware básico
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://hustleup-frontend.onrender.com' // URL do seu frontend no Render
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem origin (ex: mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend HustleUp funcionando!' });
});

console.log('HustleUp Backend - Iniciando...');

// Carregar rotas
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

const empresaRoutes = require('./routes/empresaRoutes');
app.use('/api/empresa', empresaRoutes);

const estudanteRoutes = require('./routes/estudanteRoutes');
app.use('/api/estudante', estudanteRoutes);

const gestorRoutes = require('./routes/gestorRoutes');
app.use('/api/gestor', gestorRoutes);

const propostaRoutes = require('./routes/propostaRoutes');
app.use('/api/propostas', propostaRoutes);

const candidaturaRoutes = require('./routes/candidaturaRoutes');
app.use('/api/candidaturas', candidaturaRoutes);

app.use('/api/setores', require('./routes/setorRoutes'));

console.log('Backend pronto com todas as rotas!');

// Middleware de erro
app.use((err, req, res, next) => {
  console.error('Erro no servidor:', err.stack);
  res.status(500).json({ 
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

module.exports = app;
