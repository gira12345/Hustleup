const express = require('express');
const router = express.Router();

const gestorController = require('../controllers/gestorController');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

router.use(verifyToken);
router.use(checkRole('gestor'));

// Validar propostas pendentes
router.get('/propostas/pendentes', gestorController.listarPropostasPendentes);
router.get('/propostas/departamento/:depId', gestorController.listarPropostasPorDepartamento);
router.get('/propostas/pendentes/departamento/:depId', gestorController.listarPropostasPendentesPorDepartamento);

// Gestor cria proposta
router.post('/propostas', gestorController.criarProposta);

// Submeter propostas em nome de empresas (deve vir depois)
router.post('/propostas/:empresaId', gestorController.submeterPropostaPorEmpresa);

// Get proposta específica e edição de proposta
router.get('/propostas/:id', gestorController.getPropostaPorId);
router.put('/propostas/:id', gestorController.editarProposta);
// Rota adicional para edição simples (aceita vários métodos HTTP)
router.post('/propostas/:id/editar', gestorController.editarPropostaSimples);
router.patch('/propostas/:id/editar', gestorController.editarPropostaSimples);

// Rotas para validar, reativar e eliminar propostas pelo gestor
router.post('/propostas/:id/validar', gestorController.validarProposta);
router.post('/propostas/:id/reativar', gestorController.reativarProposta);
router.delete('/propostas/:id', gestorController.eliminarProposta);
// Rota de validação já está implementada acima: /propostas/:id/validar

// Mudar estado da proposta
router.patch('/propostas/:id/estado', gestorController.alterarEstadoProposta);

// Notificações personalizadas para estudantes
// router.post('/notificacoes', gestorController.enviarNotificacao);

// Dashboard
router.get('/dashboard', gestorController.dashboard);

// Pedidos de remoção
router.get('/test-simple', (req, res) => {
  res.json({ message: 'Rota de teste operacional!', user: req.user });
});
router.get('/pedidos-remocao', gestorController.listarPedidosRemocaoNova);
router.get('/pedidos-remocao/simples', gestorController.listarPedidosRemocaoSimples); // Versão simples
router.get('/pedidos-remocao/debug', gestorController.debugPedidosRemocao); // Nova rota de debug
router.get('/pedidos-remocao/nova', gestorController.listarPedidosRemocaoNova); // Nova implementação baseada no admin
router.post('/pedidos-remocao/:id/aprovar', gestorController.aprovarPedidoRemocaoNova);
router.post('/pedidos-remocao/:id/rejeitar', gestorController.rejeitarPedidoRemocao);
router.post('/pedidos-remocao/:id/nova', gestorController.aprovarPedidoRemocaoNova); // Nova implementação aprovar/rejeitar

// Endpoint para retornar os departamentos do gestor logado
router.get('/departamentos', gestorController.getDepartamentosDoGestor);

// Lista propostas do gestor logado
router.get('/propostas', gestorController.listarPropostas);

// Endpoint para listar empresas visíveis ao gestor
router.get('/empresas', gestorController.listarEmpresas);
// Endpoint para obter empresa por id (para edição)
router.get('/empresas/:id', require('../controllers/gestorController').getEmpresaPorId);

// Endpoint para utilizadores do gestor (criação, listagem, etc)
router.post('/utilizadores', gestorController.criarUtilizador); // criar utilizador
router.get('/utilizadores', gestorController.listarUtilizadores); // listar utilizadores
router.get('/utilizadores/:id', gestorController.getUtilizadorPorId); // obter utilizador por ID
router.delete('/utilizadores/:id', gestorController.removerUtilizador); // remover utilizador
router.put('/utilizadores/:id', gestorController.editarUtilizador); // editar utilizador

// Endpoint para listar estudantes (apenas estudantes, igual ao admin)
router.get('/estudantes', gestorController.listarEstudantes);

// Aprovar empresa
router.patch('/empresas/:id/aprovar', gestorController.aprovarEmpresa);
// Desativar empresa
router.patch('/empresas/:id/desativar', gestorController.desativarEmpresa);
// Apagar empresa
router.delete('/empresas/:id', gestorController.apagarEmpresa);

// Aprovar proposta
router.patch('/propostas/:id/aprovar', gestorController.aprovarProposta);
// Desativar proposta
router.patch('/propostas/:id/desativar', gestorController.desativarProposta);
// Ativar proposta
router.patch('/propostas/:id/ativar', gestorController.ativarProposta);
// Arquivar proposta
router.patch('/propostas/:id/arquivar', gestorController.arquivarProposta);
// Apagar proposta
router.delete('/propostas/:id', gestorController.apagarProposta);

module.exports = router;
