const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

// Login de qualquer utilizador
router.post('/login', authController.login);

// Registo de empresa (fica pendente)
router.post('/registar-empresa', authController.registarEmpresa);

// Verificar se o token ainda é válido
router.get('/verificar-token', verifyToken, authController.verificarToken);

// (Opcional) Ver dados do utilizador logado
router.get('/me', verifyToken, authController.utilizadorAtual);

module.exports = router;
