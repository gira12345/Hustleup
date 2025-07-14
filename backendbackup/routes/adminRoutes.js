const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const adminEditController = require('../controllers/adminEditController');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

router.use(verifyToken);
router.use(checkRole('admin'));

// Gestão de departamentos
router.post('/setores', adminController.criarSetor);
router.get('/setores', adminController.listarSetores);

// Departamentos
router.get('/departamentos', adminController.listarDepartamentos);
router.get('/departamentos/:id', adminController.obterDepartamento);
router.post('/departamentos', adminController.criarDepartamento);
router.put('/departamentos/:id', adminController.editarDepartamento);
router.delete('/departamentos/:id', adminController.removerDepartamento);
// Listar departamentos de um gestor
router.get('/gestores/:id/departamentos', adminController.departamentosDoGestor);
// Associar departamentos a um gestor
router.post('/gestores/:id/departamentos', adminController.associarDepartamentosGestor);

// Aprovar empresa (registo pendente)
router.get('/empresas/pendentes', adminController.listarEmpresasPendentes);
router.patch('/empresas/:id/aprovar', adminController.aprovarEmpresa);
// Remover permanentemente uma empresa
router.delete('/empresas/:id', adminController.removerEmpresa);
// Desativar empresa (soft delete)
router.patch('/empresas/:id/desativar', adminController.desativarEmpresa);
// Listar todas as empresas
router.get('/empresas', adminController.listarEmpresas);
// Criar empresa (admin)
router.post('/empresas', adminController.criarEmpresa);
// Obter empresa por ID (admin)
router.get('/empresas/:id', adminController.obterEmpresa);

// Submeter proposta em nome da empresa
router.post('/propostas/:empresaId', adminController.submeterPropostaPorEmpresa);

// Dashboards
router.get('/dashboard', adminController.dashboard);

// Gestão de estudantes
router.get('/estudantes', adminController.listarEstudantes);
router.get('/estudantes/:id', adminController.obterEstudante);
router.post('/estudantes', adminController.criarEstudante);
router.delete('/estudantes/:id', adminController.removerEstudante);
// Editar estudante (admin)
router.put('/estudantes/:id', adminEditController.editarEstudante);

// Alias para utilizadores (admin)
router.get('/utilizadores', adminController.listarEstudantes);
router.get('/utilizadores/:id', adminController.obterEstudante);
router.post('/utilizadores', adminController.criarEstudante);
router.put('/utilizadores/:id', adminEditController.editarEstudante);
router.delete('/utilizadores/:id', adminController.removerEstudante);

// Validação de propostas
router.patch('/propostas/:id/validar', adminController.validarProposta);
router.patch('/propostas/:id/estado', adminController.alterarEstadoProposta);

// Validação de pedidos de remoção
router.get('/remocoes', adminController.listarPedidosRemocao);
router.patch('/remocoes/:id/aprovar', adminController.aprovarPedidoRemocao);

// 👤 Criar gestor (apenas admin)
router.post('/gestores', adminController.criarGestor);
// Listar gestores
router.get('/gestores', adminController.listarGestores);
// Editar gestor
router.put('/gestores/:id', adminController.editarGestor);
// Remover gestor
router.delete('/gestores/:id', adminController.removerGestor);
// Editar empresa (admin)
router.put('/empresas/:id', adminEditController.editarEmpresa);

// Propostas (admin)
router.get('/propostas', adminController.listarPropostas);
router.get('/propostas/:id', adminController.obterProposta);
router.get('/propostas/:id/teste', adminController.testeObterProposta); // Rota de teste
router.post('/propostas', adminController.criarProposta);
router.put('/propostas/:id', adminController.editarProposta);
router.delete('/propostas/:id', adminController.eliminarProposta);

// Ações específicas das propostas
router.patch('/propostas/:id/aprovar', adminController.aprovarProposta);
router.patch('/propostas/:id/desativar', adminController.desativarProposta);
router.patch('/propostas/:id/arquivar', adminController.arquivarProposta);
router.patch('/propostas/:id/ativar', adminController.ativarProposta);

// Rotas legacy (manter compatibilidade)
router.post('/propostas/:id/validar', adminController.validarProposta);
router.post('/propostas/:id/reativar', adminController.reativarProposta);

// Rotas para KPIs do Dashboard Admin
router.get('/kpi/utilizadores', adminController.getKPIUtilizadores);
router.get('/kpi/empresas', adminController.getKPIEmpresas);
router.get('/kpi/propostas', adminController.getKPIPropostas);
router.get('/kpi/departamentos', adminController.getKPIDepartamentos);

// Rotas de correção/migração
router.post('/corrigir/empresas', adminController.corrigirEmpresasSemUser);
router.post('/corrigir/estudantes', adminController.corrigirEstudantesSemRegisto);
router.post('/corrigir/gestores', adminController.associarGestoresATodosDepartamentos);

module.exports = router;
