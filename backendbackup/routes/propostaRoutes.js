const express = require('express');
const router = express.Router();

const propostaController = require('../controllers/propostaController');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

router.get('/', propostaController.listarPropostasPublicas);
router.patch('/debug/corrigir-estados', propostaController.corrigirEstadosPropostas);
router.get('/filtro/avancado', propostaController.filtrarPropostasAvancado);
router.get('/match', verifyToken, propostaController.propostasMatchEstudante);

router.get('/todas', async (req, res) => {
  const { Proposta } = require('../models');
  try {
    const propostas = await Proposta.findAll();
    res.json(propostas);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar propostas', error: err.message });
  }
});

// Ver uma proposta específica (deve vir depois das rotas específicas)
router.get('/:id', propostaController.verPropostaPorId);

router.use(verifyToken);

router.patch('/:id/atribuir', checkRole('admin', 'gestor'), propostaController.marcarComoAtribuida);
router.patch('/:id/desativar', checkRole('admin', 'gestor', 'empresa'), propostaController.desativarProposta);
router.patch('/:id/reativar', checkRole('admin', 'gestor', 'empresa'), propostaController.reativarProposta);
router.post('/', checkRole('empresa'), propostaController.criarProposta);

module.exports = router;
