const { Proposta, Empresa, Setor } = require('../models');

// Ver todas as propostas (ativas)
exports.getTodasPropostas = async (req, res) => {
  try {
    const propostas = await Proposta.findAll({
      where: { estado: 'ativa' },
      include: Empresa
    });
    res.json(propostas);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar propostas', error: err.message });
  }
};

// Ver proposta por ID
exports.getPropostaPorId = async (req, res) => {
  try {
    const proposta = await Proposta.findByPk(req.params.id, {
      include: Empresa
    });
    if (!proposta) return res.status(404).json({ message: 'Proposta não encontrada' });
    res.json(proposta);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar proposta', error: err.message });
  }
};

// (Extra) Filtrar por estado
exports.getPropostasPorEstado = async (req, res) => {
  const { estado } = req.params;
  try {
    const propostas = await Proposta.findAll({
      where: { estado },
      include: Empresa
    });
    res.json(propostas);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar por estado', error: err.message });
  }
};

// (Extra) Filtrar por setor
exports.getPropostasPorSetor = async (req, res) => {
  const { setorId } = req.params;
  try {
    const propostas = await Proposta.findAll({
      where: { estado: 'ativa' },
      include: {
        model: Empresa,
        include: {
          model: Setor,
          where: { id: setorId }
        }
      }
    });
    res.json(propostas);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar por setor', error: err.message });
  }
};

// Função utilitária para desativar propostas expiradas
async function desativarPropostasExpiradas() {
  const { Proposta } = require('../models');
  const { Op } = require('sequelize');
  const now = new Date();
  await Proposta.update(
    { estado: 'inativa' },
    {
      where: {
        estado: 'ativa',
        data_limite_ativacao: { [Op.lt]: now }
      }
    }
  );
}

// Listar propostas públicas (todas as ativas e não expiradas)
exports.listarPropostasPublicas = async (req, res) => {
  try {
    await desativarPropostasExpiradas();
    const { Op } = require('sequelize');
    const where = {
      estado: 'ativa',
      data_limite_ativacao: { [Op.gte]: new Date() }
    };
    if (req.query.departamento) {
      where.departamento = req.query.departamento;
    }
    const propostas = await Proposta.findAll({
      where,
      include: Empresa
    });
    res.status(200).json(propostas);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar propostas públicas', error: err.message });
  }
};

// Validar proposta (muda estado para 'ativa')
exports.validarProposta = async (req, res) => {
  try {
    const proposta = await require('../models').Proposta.findByPk(req.params.id);
    if (!proposta) return res.status(404).json({ message: 'Proposta não encontrada' });
    proposta.estado = 'ativa';
    await proposta.save();
    res.status(200).json({ message: 'Proposta validada com sucesso!', proposta });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao validar proposta', error: err.message });
  }
};

// Desativar proposta (muda estado para 'inativa')
exports.desativarProposta = async (req, res) => {
  try {
    const proposta = await require('../models').Proposta.findByPk(req.params.id);
    if (!proposta) return res.status(404).json({ message: 'Proposta não encontrada' });
    proposta.estado = 'inativa';
    await proposta.save();
    res.status(200).json({ message: 'Proposta desativada com sucesso!', proposta });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao desativar proposta', error: err.message });
  }
};

// Reativar proposta (se data limite não passou)
exports.reativarProposta = async (req, res) => {
  try {
    const proposta = await require('../models').Proposta.findByPk(req.params.id);
    if (!proposta) return res.status(404).json({ message: 'Proposta não encontrada' });
    if (new Date(proposta.data_limite_ativacao) < new Date()) {
      return res.status(400).json({ message: 'A data limite já passou. Não é possível reativar.' });
    }
    proposta.estado = 'ativa';
    await proposta.save();
    res.status(200).json({ message: 'Proposta reativada com sucesso!', proposta });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao reativar proposta', error: err.message });
  }
};

// Dashboard simples: total de propostas, empresas, estudantes
exports.dashboard = async (req, res) => {
  try {
    const { Proposta, Empresa, Estudante } = require('../models');
    const totalPropostas = await Proposta.count();
    const totalEmpresas = await Empresa.count();
    const totalEstudantes = await Estudante.count();
    res.status(200).json({ totalPropostas, totalEmpresas, totalEstudantes });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter dashboard', error: err.message });
  }
};

// Stubs para todas as funções esperadas nas rotas proposta
exports.verPropostaPorId = async (req, res) => {
  console.log('verPropostaPorId FOI CHAMADA');
  try {
    const proposta = await Proposta.findByPk(req.params.id, {
      include: Empresa
    });
    if (!proposta) {
      return res.status(404).json({ message: 'Proposta não encontrada' });
    }
    res.status(200).json(proposta);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar proposta', error: err.message });
  }
};
exports.filtrarPropostasAvancado = async (req, res) => {
  try {
    const { estado, setorId, empresaId, dataCriacao, titulo } = req.body;
    const where = {};
    const include = [{ model: Empresa }];

    if (estado) where.estado = estado;
    if (empresaId) where.empresaId = empresaId;
    if (titulo) where.titulo = { $like: `%${titulo}%` };
    if (dataCriacao) where.createdAt = dataCriacao;

    // Filtro por setor (relacional)
    if (setorId) {
      include[0].include = [{ model: Setor, where: { id: setorId } }];
    }

    // Sequelize v6+: use Op.like e Op.eq
    const { Op } = require('sequelize');
    if (titulo) where.titulo = { [Op.like]: `%${titulo}%` };
    if (dataCriacao) where.createdAt = { [Op.eq]: dataCriacao };

    const propostas = await Proposta.findAll({ where, include });
    res.status(200).json(propostas);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao filtrar propostas', error: err.message });
  }
};
exports.marcarComoAtribuida = async (req, res) => {
  console.log('FUNÇÃO CERTA SENDO CHAMADA');
  try {
    const { id } = req.params;
    const proposta = await Proposta.findByPk(id);
    if (!proposta) {
      return res.status(404).json({ message: 'Proposta não encontrada' });
    }
    // Atualiza o estado para 'ativa'
    proposta.estado = 'ativa';
    await proposta.save();
    res.status(200).json({ message: 'Proposta marcada como atribuída', proposta });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao marcar como atribuída', error: err.message });
  }
};

// Buscar propostas que tenham pelo menos uma área igual às competências do estudante
exports.propostasMatchEstudante = async (req, res) => {
  try {
    const { Estudante, Proposta } = require('../models');
    // Pega o estudante autenticado pelo userId do token
    const userId = req.user.id;
    const estudante = await Estudante.findOne({ where: { userId } });
    if (!estudante) {
      return res.status(404).json({ message: 'Estudante não encontrado' });
    }
    // Suporta competências como string separada por vírgula ou array
    let competencias = estudante.competencias;
    if (typeof competencias === 'string') {
      competencias = competencias.split(',').map(s => s.trim());
    }
    // Busca propostas que tenham pelo menos uma área igual
    const { Op } = require('sequelize');
    const propostas = await Proposta.findAll({
      where: {
        areas: {
          [Op.overlap]: competencias
        },
        estado: 'ativa'
      }
    });
    res.json(propostas);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar propostas compatíveis', error: err.message });
  }
};

// Função para criar nova proposta
exports.criarProposta = async (req, res) => {
  try {
    const { nome, departamento, contracto, morada, email, descricao, areas } = req.body;
    const empresaId = req.user.empresaId;
    if (!nome || !departamento || !contracto || !morada || !email || !descricao || !areas || !empresaId) {
      return res.status(400).json({ message: 'Campos obrigatórios em falta.' });
    }
    const novaProposta = {
      nome,
      departamento,
      contracto,
      morada,
      email,
      descricao,
      areas,
      empresaId,
      data_limite_ativacao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    console.log('DEBUG NOVA PROPOSTA:', novaProposta);
    const proposta = await require('../models').Proposta.create(novaProposta);
    res.status(201).json({ message: 'Proposta criada com sucesso!', proposta });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar proposta', error: err.message });
  }
};

