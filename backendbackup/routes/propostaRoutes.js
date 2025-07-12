const express = require('express');
const router = express.Router();

const propostaController = require('../controllers/propostaController');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

// Ver todas as propostas (modo público ou autenticado)
router.get('/', propostaController.listarPropostasPublicas);

// Filtros avançados (por setor, estado, texto, etc.)
router.get('/filtro/avancado', propostaController.filtrarPropostasAvancado);

// Buscar propostas compatíveis com as áreas do estudante autenticado
router.get('/match', verifyToken, propostaController.propostasMatchEstudante);

// Endpoint temporário para listar todas as propostas e depurar a base de dados
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

// Rotas protegidas (ex: aceitar proposta, marcar como atribuída...)
router.use(verifyToken);

// Marcar como atribuída (só para empresas ou gestores)
router.patch('/:id/atribuir', checkRole('admin', 'gestor'), propostaController.marcarComoAtribuida);

// Desativar proposta (admin, gestor, empresa)
router.patch('/:id/desativar', checkRole('admin', 'gestor', 'empresa'), propostaController.desativarProposta);

// Reativar proposta (admin, gestor, empresa)
router.patch('/:id/reativar', checkRole('admin', 'gestor', 'empresa'), propostaController.reativarProposta);

// Adiciona rota POST para criar proposta
router.post('/', checkRole('empresa'), propostaController.criarProposta);

module.exports = router;
