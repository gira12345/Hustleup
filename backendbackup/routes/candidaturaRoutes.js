const express = require('express');
const router = express.Router();
const candidaturaController = require('../controllers/candidaturaController');
const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/upload');

// Rotas para estudantes
router.post('/criar', verifyToken, upload.single('cv'), candidaturaController.criarCandidatura);
router.get('/estudante', verifyToken, candidaturaController.listarCandidaturasEstudante);

// Rotas para empresas
router.get('/empresa', verifyToken, candidaturaController.listarCandidaturasEmpresa);
router.put('/:id/responder', verifyToken, candidaturaController.responderCandidatura);
router.get('/empresa/estatisticas', verifyToken, candidaturaController.estatisticasCandidaturas);

module.exports = router;
