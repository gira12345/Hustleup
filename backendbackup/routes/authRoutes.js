const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

router.post('/login', authController.login);
router.post('/registar-empresa', authController.registarEmpresa);
router.get('/verificar-token', verifyToken, authController.verificarToken);
router.get('/me', verifyToken, authController.utilizadorAtual);

module.exports = router;
