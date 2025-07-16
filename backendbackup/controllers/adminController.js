const db = require('../models');
const { Op } = require('sequelize');
const { Empresa, Estudante, Proposta, PedidoRemocao, User } = require('../models');
const bcrypt = require('bcrypt');

// Ver empresas pendentes
exports.getEmpresasPendentes = async (req, res) => {
  try {
    const empresas = await Empresa.findAll({ where: { validado: false } });
    res.json(empresas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar empresas pendentes', error: error.message });
  }
};

// Validar empresa
exports.validarEmpresa = async (req, res) => {
  try {
    const empresa = await Empresa.findByPk(req.params.id);
    if (!empresa) return res.status(404).json({ message: 'Empresa não encontrada' });

    empresa.validado = true;
    await empresa.save();

    res.json({ message: 'Empresa validada com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao validar empresa', error: error.message });
  }
};

// Ver propostas pendentes
exports.getPropostasPendentes = async (req, res) => {
  try {
    const propostas = await Proposta.findAll({ where: { estado: 'pendente' } });
    res.json(propostas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar propostas pendentes', error: error.message });
  }
};

// Validar proposta
exports.validarProposta = async (req, res) => {
  try {
    const propostaId = req.params.id;
    const proposta = await Proposta.findByPk(propostaId);
    if (!proposta) {
      return res.status(404).json({ message: 'Proposta não encontrada' });
    }
    proposta.estado = 'ativa';
    // Atualiza data_limite_ativacao para 30 dias à frente
    proposta.data_limite_ativacao = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await proposta.save();
    res.status(200).json({ message: 'Proposta validada com sucesso', proposta });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao validar proposta', error: err.message });
  }
};

// Ver pedidos de remoção
exports.getPedidosRemocao = async (req, res) => {
  try {
    const pedidos = await PedidoRemocao.findAll({
      where: { estado: 'pendente' },
      include: [
        {
          model: require('../models').Estudante,
          as: 'Estudante',
          attributes: ['id', 'nome', 'contacto']
        }
      ]
    });
    // Formatar os dados para o frontend
    const pedidosFormatados = pedidos.map(p => ({
      id: p.id,
      nome: p.Estudante ? p.Estudante.nome : 'N/A',
      email: p.Estudante ? p.Estudante.contacto : 'N/A',
      motivo: p.motivo || 'Pedido de remoção de conta',
      estado: p.estado
    }));
    res.json(pedidosFormatados);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pedidos de remoção', error: error.message });
  }
};

// Validar pedido de remoção (apagar estudante)
exports.validarRemocaoEstudante = async (req, res) => {
  try {
    const pedido = await PedidoRemocao.findByPk(req.params.id);
    if (!pedido) return res.status(404).json({ message: 'Pedido não encontrado' });

    const estudante = await Estudante.findByPk(pedido.estudanteId);
    if (estudante) await estudante.destroy();

    pedido.estado = 'aprovado';
    await pedido.save();

    res.json({ message: 'Estudante removido com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover estudante', error: error.message });
  }
};

exports.criarSetor = async (req, res) => {
  try {
    const { nome } = req.body;
    if (!nome) {
      return res.status(400).json({ message: 'Nome do setor é obrigatório.' });
    }
    const setor = await db.Setor.create({ nome });
    res.status(201).json(setor);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Já existe um setor com esse nome.' });
    }
    res.status(500).json({ message: 'Erro ao criar setor', error: error.message });
  }
};
exports.listarSetores = async (req, res) => {
  try {
    const setores = await db.Setor.findAll();
    res.status(200).json(setores);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar setores', error: error.message });
  }
};
exports.listarEmpresasPendentes = async (req, res) => {
  try {
    const empresas = await Empresa.findAll({
      where: { validado: false },
      include: [{ model: User, as: 'user', attributes: ['id', 'email', 'role'] }]
    });
    res.status(200).json(empresas);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar empresas pendentes', error: err.message });
  }
};
exports.aprovarEmpresa = async (req, res) => {
  const { id } = req.params;
  try {
    const empresa = await Empresa.findByPk(id);
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada.' });
    }
    empresa.validado = true;
    await empresa.save();
    res.status(200).json({ message: 'Empresa aprovada com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao aprovar empresa', error: err.message });
  }
};
exports.submeterPropostaPorEmpresa = (req, res) => res.status(200).json({ message: 'submeterPropostaPorEmpresa não implementado' });
// Dashboard estatístico para admin
exports.dashboard = async (req, res) => {
  try {
    const totalEmpresas = await db.Empresa.count();
    const totalEstudantes = await db.User.count({ where: { role: 'estudante' } });
    const totalGestores = await db.User.count({ where: { role: 'gestor' } });
    const totalPropostas = await db.Proposta.count();
    const propostasPendentes = await db.Proposta.count({ where: { estado: 'pendente' } });
    const propostasAtivas = await db.Proposta.count({ where: { estado: { [Op.in]: ['ativa', 'ativo'] } } });
    const pedidosRemocaoPendentes = await db.PedidoRemocao.count({ where: { estado: 'pendente' } });
    res.json({
      totalEmpresas,
      totalEstudantes,
      totalGestores,
      totalPropostas,
      propostasPendentes,
      propostasAtivas,
      pedidosRemocaoPendentes
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar estatísticas', error: err.message });
  }
};
exports.listarEstudantes = async (req, res) => {
  try {
    const { User } = require('../models');
    if (!User) {
      throw new Error('Modelo User não encontrado');
    }
    
    const utilizadores = await User.findAll({ 
      where: { role: 'estudante' },
      attributes: ['id', 'nome', 'email', 'role', 'createdAt']
    });
    
    res.status(200).json({ utilizadores });
  } catch (err) {
    console.error('Erro ao listar estudantes:', err);
    res.status(500).json({ 
      message: 'Erro ao listar utilizadores', 
      error: err.message,
      details: err.stack
    });
  }
};

exports.obterEstudante = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('[obterEstudante] Buscando utilizador com ID:', id);
    
    const { User } = require('../models');
    const utilizador = await User.findOne({
      where: { 
        id: id,
        role: 'estudante' 
      },
      attributes: ['id', 'nome', 'email', 'role', 'createdAt']
    });
    
    if (!utilizador) {
      console.log('[obterEstudante] Utilizador não encontrado');
      return res.status(404).json({ message: 'Utilizador não encontrado.' });
    }
    
    console.log('[obterEstudante] Utilizador encontrado:', utilizador.nome);
    res.status(200).json(utilizador);
  } catch (err) {
    console.error('[obterEstudante] Erro:', err);
    res.status(500).json({ 
      message: 'Erro ao obter utilizador', 
      error: err.message 
    });
  }
};
exports.criarEstudante = async (req, res) => {
  try {
    console.log('Tentando criar utilizador:', req.body);
    const { nome, email, password } = req.body;
    
    if (!nome || !email || !password) {
      return res.status(400).json({ message: 'Nome, email e password são obrigatórios.' });
    }
    
    const existente = await User.findOne({ where: { email } });
    if (existente) {
      return res.status(400).json({ message: 'Email já está registado.' });
    }
    
    const novoUser = await User.create({ 
      nome, 
      email, 
      password, 
      role: 'estudante' 
    });
    
    // Criar também o registo na tabela Estudante
    const estudante = await db.Estudante.create({
      userId: novoUser.id,
      nome: novoUser.nome,
      contacto: novoUser.email,
      curso: '',
      competencias: '',
      sobreMim: '',
      objetivo: '',
      disponibilidade: '',
      tipoProjeto: '',
      instituicao: '',
      anoConclusao: null,
      idiomas: '',
      linkedin: '',
      areasInteresse: '',
      descricao: '',
      telefone: ''
    });
    
    console.log('Utilizador e estudante criados:', novoUser.id, novoUser.email);
    res.status(201).json({ 
      message: 'Utilizador criado com sucesso!', 
      utilizador: {
        id: novoUser.id,
        nome: novoUser.nome,
        email: novoUser.email,
        role: novoUser.role
      }
    });
  } catch (err) {
    console.error('Erro ao criar utilizador:', err);
    res.status(500).json({ message: 'Erro ao criar utilizador', error: err.message });
  }
};
exports.removerEstudante = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await db.User.findByPk(id);
    if (!user || user.role !== 'estudante') {
      return res.status(404).json({ message: 'Utilizador não encontrado.' });
    }
    await db.Estudante.destroy({ where: { userId: user.id } });
    await user.destroy();
    res.status(200).json({ message: 'Utilizador removido com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao remover utilizador', error: err.message });
  }
};
// Alterar estado de proposta
exports.alterarEstadoProposta = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    
    // Estados válidos (conforme a base de dados)
    const estadosValidos = ['pendente', 'ativa', 'inativa', 'arquivado'];
    
    if (!estado || !estadosValidos.includes(estado)) {
      return res.status(400).json({ 
        message: 'Estado inválido. Estados válidos: ' + estadosValidos.join(', ') 
      });
    }
    
    const proposta = await Proposta.findByPk(id);
    if (!proposta) {
      return res.status(404).json({ message: 'Proposta não encontrada' });
    }
    
    const estadoAnterior = proposta.estado;
    proposta.estado = estado;
    
    // Se ativando, atualizar data limite
    if (estado === 'ativa' && estadoAnterior !== 'ativa') {
      proposta.data_limite_ativacao = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
    
    await proposta.save();
    
    console.log(`Proposta ${id} alterada de '${estadoAnterior}' para '${estado}'`);
    res.json({ 
      message: `Proposta ${estado} com sucesso`, 
      proposta,
      estadoAnterior 
    });
  } catch (err) {
    console.error('Erro ao alterar estado da proposta:', err);
    res.status(500).json({ message: 'Erro ao alterar estado da proposta', error: err.message });
  }
};
exports.listarPedidosRemocao = async (req, res) => {
  try {
    console.log('[listarPedidosRemocao] Iniciando...');
    
    const { PedidoRemocao, Estudante } = require('../models');
    if (!PedidoRemocao) {
      throw new Error('Modelo PedidoRemocao não encontrado');
    }
    if (!Estudante) {
      throw new Error('Modelo Estudante não encontrado');
    }
    console.log('[listarPedidosRemocao] Modelos carregados');
    
    console.log('[listarPedidosRemocao] Fazendo query...');
    const pedidos = await PedidoRemocao.findAll({
      where: { estado: 'pendente' },
      include: [
        {
          model: Estudante,
          as: 'Estudante',
          attributes: ['id', 'nome', 'contacto']
        }
      ]
    });
    
    console.log('[listarPedidosRemocao] Query executada, encontrados:', pedidos.length, 'pedidos');
    
    // Formatar os dados para o frontend
    const pedidosFormatados = pedidos.map(p => ({
      id: p.id,
      nome: p.Estudante ? p.Estudante.nome : 'N/A',
      email: p.Estudante ? p.Estudante.contacto : 'N/A',
      motivo: p.motivo || 'Pedido de remoção de conta',
      estado: p.estado
    }));
    
    console.log('[listarPedidosRemocao] Dados formatados:', pedidosFormatados.length);
    res.status(200).json(pedidosFormatados);
  } catch (err) {
    console.error('[listarPedidosRemocao] Erro:', err);
    console.error('[listarPedidosRemocao] Stack:', err.stack);
    res.status(500).json({ 
      message: 'Erro ao listar pedidos de remoção', 
      error: err.message,
      details: err.stack
    });
  }
};
exports.aprovarPedidoRemocao = async (req, res) => {
  try {
    const { id } = req.params;
    const { PedidoRemocao, User } = require('../models');
    
    // Encontrar o pedido de remoção
    const pedido = await PedidoRemocao.findByPk(id);
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido de remoção não encontrado' });
    }
    
    // Remover o utilizador
    await User.destroy({ where: { id: pedido.estudanteId } });
    
    // Marcar o pedido como aprovado
    await pedido.update({ estado: 'aprovado' });
    
    res.status(200).json({ message: 'Pedido de remoção aprovado e utilizador removido com sucesso' });
  } catch (err) {
    console.error('Erro ao aprovar pedido de remoção:', err);
    res.status(500).json({ message: 'Erro ao aprovar pedido de remoção', error: err.message });
  }
};
// Remover permanentemente uma empresa
exports.removerEmpresa = async (req, res) => {
  const { id } = req.params;
  try {
    const empresa = await db.Empresa.findByPk(id);
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada.' });
    }
    // Remove propostas associadas
    await db.Proposta.destroy({ where: { empresaId: empresa.id } });
    // Remove o utilizador associado
    await db.User.destroy({ where: { id: empresa.userId } });
    // Remove a empresa
    await empresa.destroy();
    res.status(200).json({ message: 'Empresa removida com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao remover empresa', error: err.message });
  }
};

// Desativar empresa (soft delete)
exports.desativarEmpresa = async (req, res) => {
  const { id } = req.params;
  try {
    const empresa = await db.Empresa.findByPk(id);
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada.' });
    }
    empresa.validado = false;
    await empresa.save();
    res.status(200).json({ message: 'Empresa desativada com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao desativar empresa', error: err.message });
  }
};

// Criar gestor (apenas admin)
exports.criarGestor = async (req, res) => {
  try {
    const { nome, email, password, departamentos } = req.body;
    if (!nome || !email || !password) {
      return res.status(400).json({ message: 'Nome, email e password são obrigatórios.' });
    }
    
    // Verificar se o email já existe
    const userExistente = await User.findOne({ where: { email } });
    if (userExistente) {
      return res.status(400).json({ message: 'Este email já está registado.' });
    }
    
    // Criar utilizador - o modelo User já faz hash da password
    const gestor = await User.create({
      nome,
      email,
      password: password, // Será hashada pelo hook beforeCreate
      role: 'gestor'
    });
    
    // Se foram fornecidos departamentos, associar o gestor
    if (departamentos && Array.isArray(departamentos) && departamentos.length > 0) {
      const { GestorDepartamento } = require('../models');
      for (const depId of departamentos) {
        await GestorDepartamento.create({
          gestorId: gestor.id,
          departamentoId: depId
        });
      }
    }
    
    res.status(201).json({ 
      message: 'Gestor criado com sucesso', 
      gestor: {
        id: gestor.id,
        nome: gestor.nome,
        email: gestor.email,
        role: gestor.role
      },
      departamentosAssociados: departamentos ? departamentos.length : 0
    });
  } catch (err) {
    console.error('Erro ao criar gestor:', err);
    res.status(500).json({ message: 'Erro ao criar gestor', error: err.message });
  }
};

// Listar todas as empresas (admin)
exports.listarEmpresas = async (req, res) => {
  try {
    // Buscar todas as empresas e incluir info do utilizador se existir
    const empresas = await Empresa.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'role'],
        required: false
      }]
    });
    res.status(200).json(empresas);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar empresas', error: err.message });
  }
};

// Listar gestores (admin)
exports.listarGestores = async (req, res) => {
  try {
    const gestores = await User.findAll({ where: { role: 'gestor' } });
    res.status(200).json({ gestores });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar gestores', error: err.message });
  }
};

// Editar gestor (admin)
exports.editarGestor = async (req, res) => {
  try {
    const { nome, email, password } = req.body;
    const gestor = await User.findByPk(req.params.id);
    if (!gestor || gestor.role !== 'gestor') {
      return res.status(404).json({ message: 'Gestor não encontrado.' });
    }
    
    gestor.nome = nome;
    gestor.email = email;
    if (password) {
      gestor.password = password; // Será hashada pelo hook beforeUpdate
    }
    await gestor.save();
    
    res.status(200).json({ 
      message: 'Gestor editado com sucesso!', 
      gestor: {
        id: gestor.id,
        nome: gestor.nome,
        email: gestor.email,
        role: gestor.role
      }
    });
  } catch (err) {
    console.error('Erro ao editar gestor:', err);
    res.status(500).json({ message: 'Erro ao editar gestor', error: err.message });
  }
};

// Remover gestor (admin)
exports.removerGestor = async (req, res) => {
  try {
    const gestor = await User.findByPk(req.params.id);
    if (!gestor || gestor.role !== 'gestor') {
      return res.status(404).json({ message: 'Gestor não encontrado.' });
    }
    await gestor.destroy();
    res.status(200).json({ message: 'Gestor removido com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao remover gestor', error: err.message });
  }
};

// Listar todos os departamentos
exports.listarDepartamentos = async (req, res) => {
  try {
    const departamentos = await db.Departamento.findAll();
    res.status(200).json(departamentos);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar departamentos', error: err.message });
  }
};

// Obter um departamento específico
exports.obterDepartamento = async (req, res) => {
  try {
    const { id } = req.params;
    const departamento = await db.Departamento.findByPk(id);
    if (!departamento) {
      return res.status(404).json({ message: 'Departamento não encontrado.' });
    }
    res.status(200).json(departamento);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter departamento', error: err.message });
  }
};

// Criar departamento
exports.criarDepartamento = async (req, res) => {
  try {
    const { nome } = req.body;
    if (!nome) {
      return res.status(400).json({ message: 'Nome do departamento é obrigatório.' });
    }
    const departamento = await db.Departamento.create({ nome });
    res.status(201).json(departamento);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Já existe um departamento com esse nome.' });
    }
    res.status(500).json({ message: 'Erro ao criar departamento', error: err.message });
  }
};

// Editar departamento
exports.editarDepartamento = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;
    
    const departamento = await db.Departamento.findByPk(id);
    if (!departamento) {
      return res.status(404).json({ message: 'Departamento não encontrado.' });
    }
    
    if (nome) departamento.nome = nome;
    await departamento.save();
    
    res.status(200).json({ message: 'Departamento atualizado com sucesso!', departamento });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Já existe um departamento com esse nome.' });
    }
    res.status(500).json({ message: 'Erro ao editar departamento', error: err.message });
  }
};

// Remover departamento
exports.removerDepartamento = async (req, res) => {
  try {
    const { id } = req.params;
    const departamento = await db.Departamento.findByPk(id);
    if (!departamento) {
      return res.status(404).json({ message: 'Departamento não encontrado.' });
    }
    
    await departamento.destroy();
    res.status(200).json({ message: 'Departamento removido com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao remover departamento', error: err.message });
  }
};
// Listar departamentos de um gestor
exports.departamentosDoGestor = async (req, res) => {
  try {
    const gestor = await db.User.findByPk(req.params.id, {
      include: [{ model: db.Departamento, as: 'Departamentos', through: { attributes: [] } }]
    });
    if (!gestor) return res.status(404).json({ message: 'Gestor não encontrado.' });
    res.status(200).json(gestor.Departamentos);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar departamentos do gestor', error: err.message });
  }
};
// Associar departamentos a um gestor
exports.associarDepartamentosGestor = async (req, res) => {
  try {
    const { departamentoIds } = req.body; // array de ids
    const gestor = await db.User.findByPk(req.params.id);
    if (!gestor || gestor.role !== 'gestor') return res.status(404).json({ message: 'Gestor não encontrado.' });
    console.log('Associando departamentos ao gestor:', {
      gestorId: gestor.id,
      departamentoIds
    });
    await gestor.setDepartamentos(departamentoIds);
    // Confirma associação
    const deps = await gestor.getDepartamentos();
    console.log('Departamentos associados agora:', deps.map(d => ({ id: d.id, nome: d.nome })));
    res.status(200).json({ message: 'Departamentos associados ao gestor!', departamentos: deps });
  } catch (err) {
    console.error('Erro ao associar departamentos:', err);
    res.status(500).json({ message: 'Erro ao associar departamentos', error: err.message });
  }
};

// Função para associar gestores a todos os departamentos
exports.associarGestoresATodosDepartamentos = async (req, res) => {
  try {
    console.log('[associarGestoresATodosDepartamentos] Iniciando...');
    
    // Buscar todos os gestores
    const gestores = await User.findAll({
      where: { role: 'gestor' }
    });
    
    // Buscar todos os departamentos
    const departamentos = await db.Departamento.findAll();
    
    console.log('Encontrados', gestores.length, 'gestores e', departamentos.length, 'departamentos');
    
    const { GestorDepartamento } = require('../models');
    let associacoesCriadas = 0;
    
    for (const gestor of gestores) {
      for (const departamento of departamentos) {
        // Verificar se já existe associação
        const existente = await GestorDepartamento.findOne({
          where: {
            gestorId: gestor.id,
            departamentoId: departamento.id
          }
        });
        
        if (!existente) {
          await GestorDepartamento.create({
            gestorId: gestor.id,
            departamentoId: departamento.id
          });
          associacoesCriadas++;
        }
      }
    }
    
    res.json({
      message: `Associação concluída. ${associacoesCriadas} associações criadas.`,
      gestores: gestores.length,
      departamentos: departamentos.length,
      associacoesCriadas: associacoesCriadas
    });
    
  } catch (err) {
    console.error('Erro na associação:', err);
    res.status(500).json({ 
      message: 'Erro ao associar gestores', 
      error: err.message 
    });
  }
};

// Listar todas as propostas
exports.listarPropostas = async (req, res) => {
  try {
    const propostas = await Proposta.findAll({
      include: [
        { model: Empresa, as: 'empresa' }
      ],
      order: [['createdAt', 'DESC']]
    });
    console.log(`Admin endpoint: retornando ${propostas.length} propostas`);
    res.json(propostas);
  } catch (err) {
    console.error('Erro ao listar propostas:', err);
    res.status(500).json({ message: 'Erro ao listar propostas', error: err.message });
  }
};

// Obter proposta específica
exports.obterProposta = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('[obterProposta] Buscando proposta com ID:', id);
    
    const proposta = await Proposta.findByPk(id);
    
    if (!proposta) {
      console.log('[obterProposta] Proposta não encontrada com ID:', id);
      return res.status(404).json({ message: 'Proposta não encontrada' });
    }
    
    // Agora tentar obter a empresa separadamente
    let empresa = null;
    if (proposta.empresaId) {
      try {
        empresa = await Empresa.findByPk(proposta.empresaId, {
          attributes: ['id', 'nome', 'setor', 'localizacao', 'descricao']
        });
      } catch (empresaErr) {
        console.warn('[obterProposta] Erro ao carregar empresa:', empresaErr.message);
      }
    }
    
    // Criar resposta com empresa incluída
    const propostaComEmpresa = {
      ...proposta.toJSON(),
      empresa: empresa ? empresa.toJSON() : null
    };
    
    console.log('[obterProposta] Proposta encontrada:', proposta.nome);
    res.json(propostaComEmpresa);
  } catch (err) {
    console.error('[obterProposta] Erro:', err);
    res.status(500).json({ message: 'Erro ao obter proposta', error: err.message });
  }
};

// Criar proposta
exports.criarProposta = async (req, res) => {
  try {
    const proposta = await Proposta.create(req.body);
    res.status(201).json(proposta);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar proposta', error: err.message });
  }
};

// Editar proposta
exports.editarProposta = async (req, res) => {
  try {
    const proposta = await Proposta.findByPk(req.params.id);
    if (!proposta) return res.status(404).json({ message: 'Proposta não encontrada' });
    await proposta.update(req.body);
    res.json(proposta);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao editar proposta', error: err.message });
  }
};

// Eliminar proposta
exports.eliminarProposta = async (req, res) => {
  try {
    const proposta = await Proposta.findByPk(req.params.id);
    if (!proposta) return res.status(404).json({ message: 'Proposta não encontrada' });
    await proposta.destroy();
    res.json({ message: 'Proposta deletada com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao eliminar proposta', error: err.message });
  }
};

// Reativar proposta
exports.reativarProposta = async (req, res) => {
  try {
    const proposta = await Proposta.findByPk(req.params.id);
    if (!proposta) return res.status(404).json({ message: 'Proposta não encontrada' });
    proposta.estado = 'ativa';
    await proposta.save();
    res.json({ message: 'Proposta reativada com sucesso', proposta });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao reativar proposta', error: err.message });
  }
};

// Métodos específicos para ações das propostas
exports.aprovarProposta = async (req, res) => {
  try {
    const { id } = req.params;
    const proposta = await Proposta.findByPk(id);
    if (!proposta) {
      return res.status(404).json({ message: 'Proposta não encontrada' });
    }
    
    proposta.estado = 'ativa';
    proposta.data_limite_ativacao = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await proposta.save();
    
    console.log(`Proposta ${id} aprovada (${proposta.estado})`);
    res.json({ message: 'Proposta aprovada com sucesso', proposta });
  } catch (err) {
    console.error('Erro ao aprovar proposta:', err);
    res.status(500).json({ message: 'Erro ao aprovar proposta', error: err.message });
  }
};

exports.desativarProposta = async (req, res) => {
  try {
    const { id } = req.params;
    const proposta = await Proposta.findByPk(id);
    if (!proposta) {
      return res.status(404).json({ message: 'Proposta não encontrada' });
    }
    
    proposta.estado = 'inativo';
    await proposta.save();
    
    console.log(`Proposta ${id} desativada (${proposta.estado})`);
    res.json({ message: 'Proposta desativada com sucesso', proposta });
  } catch (err) {
    console.error('Erro ao desativar proposta:', err);
    res.status(500).json({ message: 'Erro ao desativar proposta', error: err.message });
  }
};

exports.arquivarProposta = async (req, res) => {
  try {
    const { id } = req.params;
    const proposta = await Proposta.findByPk(id);
    if (!proposta) {
      return res.status(404).json({ message: 'Proposta não encontrada' });
    }
    
    proposta.estado = 'arquivado';
    await proposta.save();
    
    console.log(`📁 Proposta ${id} arquivada (${proposta.estado})`);
    res.json({ message: 'Proposta arquivada com sucesso', proposta });
  } catch (err) {
    console.error('Erro ao arquivar proposta:', err);
    res.status(500).json({ message: 'Erro ao arquivar proposta', error: err.message });
  }
};

exports.ativarProposta = async (req, res) => {
  try {
    const { id } = req.params;
    const proposta = await Proposta.findByPk(id);
    if (!proposta) {
      return res.status(404).json({ message: 'Proposta não encontrada' });
    }
    
    proposta.estado = 'ativa';
    proposta.data_limite_ativacao = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await proposta.save();
    
    console.log(`🔄 Proposta ${id} reativada (${proposta.estado})`);
    res.json({ message: 'Proposta ativada com sucesso', proposta });
  } catch (err) {
    console.error('Erro ao ativar proposta:', err);
    res.status(500).json({ message: 'Erro ao ativar proposta', error: err.message });
  }
};

// Endpoints para KPIs do Dashboard Admin

// KPI: Total de Utilizadores (Estudantes + Empresas + Gestores)
exports.getKPIUtilizadores = async (req, res) => {
  try {
    const [estudantes, empresas, gestores] = await Promise.all([
      Estudante.count(),
      Empresa.count(),
      User.count({ where: { role: 'gestor' } })
    ]);

    const total = estudantes + empresas + gestores;
    
    res.json({
      total,
      estudantes,
      empresas,
      gestores
    });
  } catch (error) {
    console.error('Erro ao buscar KPI de utilizadores:', error);
    res.status(500).json({ message: 'Erro ao buscar dados de utilizadores', error: error.message });
  }
};

// KPI: Total de Empresas (ativas/validadas)
exports.getKPIEmpresas = async (req, res) => {
  try {
    const [total, ativas, pendentes] = await Promise.all([
      Empresa.count(),
      Empresa.count({ where: { validado: true } }),
      Empresa.count({ where: { validado: false } })
    ]);

    res.json({
      total,
      ativas,
      pendentes
    });
  } catch (error) {
    console.error('Erro ao buscar KPI de empresas:', error);
    res.status(500).json({ message: 'Erro ao buscar dados de empresas', error: error.message });
  }
};

// KPI: Propostas por estado
exports.getKPIPropostas = async (req, res) => {
  try {
    const [total, ativas, pendentes, arquivadas, desativadas] = await Promise.all([
      Proposta.count(),
      Proposta.count({ where: { estado: { [Op.in]: ['ativa', 'ativo'] } } }),
      Proposta.count({ where: { estado: 'pendente' } }),
      Proposta.count({ where: { estado: 'arquivado' } }),
      Proposta.count({ where: { estado: 'desativo' } })
    ]);

    res.json({
      total,
      ativas,
      pendentes,
      arquivadas,
      desativadas
    });
  } catch (error) {
    console.error('Erro ao buscar KPI de propostas:', error);
    res.status(500).json({ message: 'Erro ao buscar dados de propostas', error: error.message });
  }
};

// KPI: Departamentos
exports.getKPIDepartamentos = async (req, res) => {
  try {
    // Se existir uma tabela de departamentos, usar ela
    // Caso contrário, usar dados estáticos
    const departamentos = [
      'Informática',
      'Gestão', 
      'Marketing',
      'Engenharia',
      'Design'
    ];

    res.json({
      total: departamentos.length,
      departamentos
    });
  } catch (error) {
    console.error('Erro ao buscar KPI de departamentos:', error);
    res.status(500).json({ message: 'Erro ao buscar dados de departamentos', error: error.message });
  }
};

// Criar empresa
exports.criarEmpresa = async (req, res) => {
  try {
    const { nome, email, password, descricao, contacto } = req.body;
    
    if (!nome || !email) {
      return res.status(400).json({ message: 'Nome e email são obrigatórios.' });
    }

    if (!password) {
      return res.status(400).json({ message: 'Password é obrigatória.' });
    }

    // Verificar se o email já existe
    const userExistente = await User.findOne({ where: { email } });
    if (userExistente) {
      return res.status(400).json({ message: 'Este email já está registado.' });
    }

    // Criar utilizador com a password fornecida
    const novoUser = await User.create({
      nome,
      email,
      password: password, // Será hashada pelo modelo
      role: 'empresa'
    });

    const empresa = await Empresa.create({
      nome,
      userId: novoUser.id,
      descricao: descricao || '',
      contacto: contacto || email, // Usar email se contacto não fornecido
      validado: true, // Empresas criadas pelo admin são sempre validadas
      localizacao: '',
      morada: ''
    });

    res.status(201).json({
      message: 'Empresa criada com sucesso!',
      empresa: {
        id: empresa.id,
        nome: empresa.nome,
        email: novoUser.email,
        validado: empresa.validado
      }
    });

  } catch (err) {
    console.error('Erro ao criar empresa:', err);
    res.status(500).json({ message: 'Erro ao criar empresa', error: err.message });
  }
};

exports.obterEmpresa = async (req, res) => {
  try {
    const empresa = await Empresa.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email', 'role']
      }]
    });
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada.' });
    }
    res.status(200).json(empresa);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter empresa', error: err.message });
  }
};

// Função para corrigir empresas criadas sem User
exports.corrigirEmpresasSemUser = async (req, res) => {
  try {
    console.log('[corrigirEmpresasSemUser] Iniciando correção...');
    
    // Buscar empresas sem userId
    const empresasSemUser = await Empresa.findAll({
      where: { userId: null }
    });
    
    console.log('Encontradas', empresasSemUser.length, 'empresas sem User');
    
    let corrigidas = 0;
    for (const empresa of empresasSemUser) {
      // Verificar se já existe um User com este email
      const userExistente = await User.findOne({ 
        where: { email: empresa.contacto } 
      });
      
      if (!userExistente) {
        // Criar User para esta empresa
        const novoUser = await User.create({
          nome: empresa.nome,
          email: empresa.contacto,
          password: 'empresa123', // Password padrão
          role: 'empresa'
        });
        
        // Atualizar empresa com userId
        empresa.userId = novoUser.id;
        empresa.validado = true;
        await empresa.save();
        
        corrigidas++;
        console.log('Corrigida empresa:', empresa.nome);
      }
    }
    
    res.json({
      message: `Correção concluída. ${corrigidas} empresas corrigidas.`,
      empresasCorrigidas: corrigidas,
      totalEmpresas: empresasSemUser.length
    });
    
  } catch (err) {
    console.error('Erro na correção:', err);
    res.status(500).json({ 
      message: 'Erro ao corrigir empresas', 
      error: err.message 
    });
  }
};

// Função para corrigir estudantes sem registo na tabela Estudante
exports.corrigirEstudantesSemRegisto = async (req, res) => {
  try {
    console.log('[corrigirEstudantesSemRegisto] Iniciando correção...');
    
    // Buscar Users estudantes
    const usersEstudantes = await User.findAll({
      where: { role: 'estudante' }
    });
    
    console.log('Encontrados', usersEstudantes.length, 'users estudantes');
    
    let corrigidos = 0;
    for (const user of usersEstudantes) {
      // Verificar se já existe registo na tabela Estudante
      const estudanteExistente = await db.Estudante.findOne({
        where: { userId: user.id }
      });
      
      if (!estudanteExistente) {
        // Criar registo na tabela Estudante
        await db.Estudante.create({
          userId: user.id,
          nome: user.nome,
          contacto: user.email,
          curso: '',
          competencias: '',
          sobreMim: '',
          objetivo: '',
          disponibilidade: '',
          tipoProjeto: '',
          instituicao: '',
          anoConclusao: null,
          idiomas: '',
          linkedin: '',
          areasInteresse: '',
          descricao: '',
          telefone: ''
        });
        
        corrigidos++;
        console.log('Corrigido estudante:', user.nome);
      }
    }
    
    res.json({
      message: `Correção concluída. ${corrigidos} estudantes corrigidos.`,
      estudantesCorrigidos: corrigidos,
      totalEstudantes: usersEstudantes.length
    });
    
  } catch (err) {
    console.error('Erro na correção:', err);
    res.status(500).json({ 
      message: 'Erro ao corrigir estudantes', 
      error: err.message 
    });
  }
};

// Função para limpar todas as empresas e utilizadores empresa
exports.limparTodasEmpresas = async (req, res) => {
  try {
    console.log('[limparTodasEmpresas] Iniciando limpeza...');
    
    // 1. Buscar todos os utilizadores empresa
    const usersEmpresa = await User.findAll({
      where: { role: 'empresa' }
    });
    
    console.log('Encontrados', usersEmpresa.length, 'utilizadores empresa');
    
    // 2. Apagar registos na tabela Empresa
    await Empresa.destroy({
      where: {},
      truncate: true
    });
    
    // 3. Apagar utilizadores empresa
    await User.destroy({
      where: { role: 'empresa' }
    });
    
    console.log('[limparTodasEmpresas] Limpeza concluída');
    
    res.json({
      message: `Limpeza concluída. ${usersEmpresa.length} empresas removidas.`,
      empresasRemovidas: usersEmpresa.length,
      status: 'Agora pode criar empresas novamente'
    });
    
  } catch (err) {
    console.error('Erro na limpeza:', err);
    res.status(500).json({ 
      message: 'Erro ao limpar empresas', 
      error: err.message 
    });
  }
};

// Função para limpar todos os estudantes e utilizadores estudante
exports.limparTodosEstudantes = async (req, res) => {
  try {
    console.log('[limparTodosEstudantes] Iniciando limpeza...');
    
    // 1. Buscar todos os utilizadores estudante
    const usersEstudante = await User.findAll({
      where: { role: 'estudante' }
    });
    
    console.log('Encontrados', usersEstudante.length, 'utilizadores estudante');
    
    // 2. Apagar registos na tabela Estudante
    await db.Estudante.destroy({
      where: {},
      truncate: true
    });
    
    // 3. Apagar utilizadores estudante
    await User.destroy({
      where: { role: 'estudante' }
    });
    
    console.log('[limparTodosEstudantes] Limpeza concluída');
    
    res.json({
      message: `Limpeza concluída. ${usersEstudante.length} estudantes removidos.`,
      estudantesRemovidos: usersEstudante.length,
      status: 'Agora pode criar estudantes novamente'
    });
    
  } catch (err) {
    console.error('Erro na limpeza:', err);
    res.status(500).json({ 
      message: 'Erro ao limpar estudantes', 
      error: err.message 
    });
  }
};

