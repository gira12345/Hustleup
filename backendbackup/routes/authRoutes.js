const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const debugController = require('../controllers/debugController');
const verifyToken = require('../middleware/verifyToken');

// Login de qualquer utilizador
router.post('/login', authController.login);

// DEBUG - Endpoint temporário para debug
router.post('/debug-login', debugController.debugLogin);

// DEBUG - Corrigir hash duplo
router.post('/corrigir-hash', debugController.corrigirHashDuplo);

// Registo de empresa (fica pendente)
router.post('/registar-empresa', authController.registarEmpresa);

// Verificar se o token ainda é válido
router.get('/verificar-token', verifyToken, authController.verificarToken);

// (Opcional) Ver dados do utilizador logado
router.get('/me', verifyToken, authController.utilizadorAtual);

module.exports = router;
