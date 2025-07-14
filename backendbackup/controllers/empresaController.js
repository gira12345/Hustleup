const { Empresa, Proposta, Setor, Departamento, User } = require('../models');

exports.getPerfil = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }
    
    if (user.role !== 'empresa') {
      return res.status(404).json({ message: 'Utilizador empresa não encontrado' });
    }
    
    let empresa = await Empresa.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'nome']
        }
      ]
    });

    if (!empresa) {
      empresa = await Empresa.create({
        userId: req.user.id,
        nome: user.nome || 'Empresa',
        descricao: null,
        contacto: user.email || null,
        validado: true,
        localizacao: null,
        morada: null,
        website: null
      });
      
      empresa = await Empresa.findOne({
        where: { userId: req.user.id },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'email', 'nome']
          }
        ]
      });
    }

    res.json(empresa);

  } catch (err) {
    console.error('Erro ao obter perfil da empresa:', err);
    res.status(500).json({ message: 'Erro ao obter perfil da empresa', error: err.message });
  }
};

// Atualizar perfil da empresa (com upload)
exports.editarPerfil = async (req, res) => {
  try {
    const empresa = await Empresa.findOne({ where: { userId: req.user.id } });
    if (!empresa) return res.status(404).json({ message: 'Empresa não encontrada' });

    const { nome, descricao, contacto, localizacao, departamento, contracto, morada, website } = req.body;

    empresa.nome = nome || empresa.nome;
    empresa.descricao = descricao || empresa.descricao;
    empresa.contacto = contacto || empresa.contacto;
    empresa.localizacao = localizacao || empresa.localizacao;
    empresa.departamento = departamento || empresa.departamento;
    empresa.contracto = contracto || empresa.contracto;
    empresa.morada = morada || empresa.morada;
    empresa.website = website || empresa.website;

    if (req.file) {
      empresa.logo = `uploads/${req.file.filename}`;
    }

    await empresa.save();

    res.json({ message: 'Perfil atualizado com sucesso', empresa });

  } catch (err) {
    console.error('Erro ao atualizar perfil da empresa:', err);
    res.status(500).json({ message: 'Erro ao atualizar perfil', error: err.message });
  }
};

// Submeter nova proposta
exports.submeterProposta = async (req, res) => {
  try {
    const empresa = await Empresa.findOne({ where: { userId: req.user.id } });
    if (!empresa) return res.status(404).json({ message: 'Empresa não encontrada' });

    const {
      nome,
      departamento,
      contracto,
      morada,
      descricao,
      areas,
      email,
      estado
    } = req.body;

    const proposta = await Proposta.create({
      nome,
      departamento,
      contracto,
      morada,
      descricao,
      areas: Array.isArray(areas) ? areas : (typeof areas === 'string' ? [areas] : []),
      email,
      estado: estado || 'pendente',
      empresaId: empresa.id
    });

    res.status(201).json({ message: 'Proposta submetida com sucesso', proposta });

  } catch (err) {
    res.status(500).json({ message: 'Erro ao submeter proposta', error: err.message });
  }
};

// Ver todas as propostas da empresa
exports.getMinhasPropostas = async (req, res) => {
  try {
    const empresa = await Empresa.findOne({ where: { userId: req.user.id } });
    if (!empresa) return res.status(404).json({ message: 'Empresa não encontrada' });

    const propostas = await Proposta.findAll({ where: { empresaId: empresa.id } });
    res.json(propostas);

  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar propostas', error: err.message });
  }
};

// Alterar estado da proposta (reativar/desativar)
exports.alterarEstadoProposta = async (req, res) => {
  try {
    const proposta = await Proposta.findByPk(req.params.id);
    if (!proposta) return res.status(404).json({ message: 'Proposta não encontrada' });

    proposta.estado = req.body.estado; // 'ativa', 'inativa', etc.
    await proposta.save();

    res.json({ message: 'Estado atualizado', proposta });

  } catch (err) {
    res.status(500).json({ message: 'Erro ao alterar estado da proposta', error: err.message });
  }
};

// Listar departamentos (para dropdown)
exports.listarDepartamentos = async (req, res) => {
  try {
    const departamentos = await Departamento.findAll({
      attributes: ['id', 'nome'],
      order: [['nome', 'ASC']]
    });
    res.status(200).json(departamentos);
  } catch (err) {
    console.error('Erro ao listar departamentos:', err);
    res.status(500).json({ message: 'Erro ao carregar departamentos', error: err.message });
  }
};

// Obter proposta específica
exports.obterProposta = async (req, res) => {
  try {
    const { id } = req.params;
    
    const proposta = await Proposta.findOne({
      where: { id },
      include: [{ model: Empresa, where: { userId: req.user.id } }]
    });
    
    if (!proposta) {
      return res.status(404).json({ message: 'Proposta não encontrada ou não pertence a esta empresa.' });
    }
    
    res.json(proposta);
  } catch (err) {
    console.error('Erro ao obter proposta:', err);
    res.status(500).json({ message: 'Erro ao obter proposta', error: err.message });
  }
};

// Editar proposta existente
exports.editarProposta = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, departamento, contracto, morada, email, areas, data_submissao, data_limite_ativacao, experiencia } = req.body;
    
    // Buscar a proposta
    const proposta = await Proposta.findOne({ 
      where: { id },
      include: [{ model: Empresa, where: { userId: req.user.id } }]
    });
    
    if (!proposta) {
      return res.status(404).json({ message: 'Proposta não encontrada ou não pertence a esta empresa.' });
    }
    
    // Atualizar a proposta
    proposta.nome = nome || proposta.nome;
    proposta.descricao = descricao || proposta.descricao;
    proposta.departamento = departamento || proposta.departamento;
    proposta.contracto = contracto || proposta.contracto;
    proposta.morada = morada || proposta.morada;
    proposta.email = email || proposta.email;
    proposta.areas = areas || proposta.areas;
    proposta.data_submissao = data_submissao || proposta.data_submissao;
    proposta.data_limite_ativacao = data_limite_ativacao || proposta.data_limite_ativacao;
    proposta.experiencia = experiencia || proposta.experiencia;
    
    await proposta.save();
    
    res.json({ message: 'Proposta atualizada com sucesso', proposta });
  } catch (err) {
    console.error('Erro ao editar proposta:', err);
    res.status(500).json({ message: 'Erro ao editar proposta', error: err.message });
  }
};

// Apagar proposta
exports.apagarProposta = async (req, res) => {
  try {
    const { id } = req.params;
    
    const proposta = await Proposta.findOne({
      where: { id },
      include: [{ model: Empresa, where: { userId: req.user.id } }]
    });
    
    if (!proposta) {
      return res.status(404).json({ message: 'Proposta não encontrada ou não pertence a esta empresa.' });
    }
    
    await proposta.destroy();
    
    res.json({ message: 'Proposta apagada com sucesso' });
  } catch (err) {
    console.error('Erro ao apagar proposta:', err);
    res.status(500).json({ message: 'Erro ao apagar proposta', error: err.message });
  }
};

// Exports corretos para as rotas empresa
exports.getPerfil = exports.getPerfil;
exports.editarPerfil = exports.editarPerfil;
exports.submeterProposta = exports.submeterProposta;
exports.desativarProposta = (req, res) => exports.alterarEstadoProposta({ ...req, body: { estado: 'inativa' } }, res);
exports.reativarProposta = (req, res) => exports.alterarEstadoProposta({ ...req, body: { estado: 'ativa' } }, res);
exports.listarPropostas = exports.getMinhasPropostas;
exports.listarDepartamentos = exports.listarDepartamentos;
exports.obterProposta = exports.obterProposta;
exports.apagarProposta = exports.apagarProposta;

