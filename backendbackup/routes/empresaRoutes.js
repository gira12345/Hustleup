const express = require('express');
const router = express.Router();

const empresaController = require('../controllers/empresaController');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');
const upload = require('../middleware/upload');

router.use(verifyToken);
router.use(checkRole('empresa'));

// Ver e editar o próprio perfil
router.get('/perfil', empresaController.getPerfil);
router.patch('/perfil', upload.single('logo'), empresaController.editarPerfil);

// Submeter nova proposta
router.post('/propostas', empresaController.submeterProposta);

// Editar proposta existente
router.patch('/propostas/:id', empresaController.editarProposta);

// Desativar proposta
router.patch('/propostas/:id/desativar', empresaController.desativarProposta);

// Reativar proposta antiga
router.patch('/propostas/:id/reativar', empresaController.reativarProposta);

// Ver propostas da empresa
router.get('/propostas', empresaController.listarPropostas);

// Ver proposta específica
router.get('/propostas/:id', empresaController.obterProposta);

// Apagar proposta
router.delete('/propostas/:id', empresaController.apagarProposta);

// Listar departamentos (para dropdown)
router.get('/departamentos', empresaController.listarDepartamentos);

module.exports = router;
