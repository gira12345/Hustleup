const db = require('../models');
const { Op } = require('sequelize');
const { Empresa, Estudante, Proposta, PedidoRemocao, User, Setor, EstudanteFavorito } = db;

exports.getPerfil = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }
    
    let estudante = await Estudante.findOne({
      where: { userId: req.user.id }
    });

    if (!estudante) {
      estudante = await Estudante.create({
        userId: req.user.id,
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
        descricao: ''
      });
    }

    try {
      estudante = await Estudante.findOne({
        where: { userId: req.user.id },
        include: [
          {
            model: Setor,
            through: { attributes: [] },
            required: false
          },
          {
            model: User,
            attributes: ['id', 'email', 'nome']
          }
        ]
      });
    } catch (includeError) {
      estudante = await Estudante.findOne({
        where: { userId: req.user.id }
      });
      if (estudante) {
        estudante.dataValues.User = user;
      }
    }

    res.json(estudante);

  } catch (err) {
    console.error('Erro ao buscar perfil:', err);
    res.status(500).json({ message: 'Erro ao buscar perfil', error: err.message });
  }
};

exports.editarPerfil = async (req, res) => {
  try {
    const estudante = await Estudante.findOne({ 
      where: { userId: req.user.id }
    });
    
    if (!estudante) {
      return res.status(404).json({ message: 'Estudante não encontrado' });
    }

    const camposPermitidos = {};
    
    if (req.body.nome !== undefined) camposPermitidos.nome = req.body.nome;
    if (req.body.curso !== undefined) camposPermitidos.curso = req.body.curso;
    if (req.body.competencias !== undefined) camposPermitidos.competencias = req.body.competencias;
    if (req.body.contacto !== undefined) camposPermitidos.contacto = req.body.contacto;
    if (req.body.sobreMim !== undefined) camposPermitidos.sobreMim = req.body.sobreMim;
    if (req.body.objetivo !== undefined) camposPermitidos.objetivo = req.body.objetivo;
    if (req.body.disponibilidade !== undefined) camposPermitidos.disponibilidade = req.body.disponibilidade;
    if (req.body.tipoProjeto !== undefined) camposPermitidos.tipoProjeto = req.body.tipoProjeto;
    if (req.body.instituicao !== undefined) camposPermitidos.instituicao = req.body.instituicao;
    if (req.body.anoConclusao !== undefined) camposPermitidos.anoConclusao = req.body.anoConclusao;
    if (req.body.idiomas !== undefined) camposPermitidos.idiomas = req.body.idiomas;
    if (req.body.linkedin !== undefined) camposPermitidos.linkedin = req.body.linkedin;
    if (req.body.areasInteresse !== undefined) camposPermitidos.areasInteresse = req.body.areasInteresse;
    if (req.body.descricao !== undefined) camposPermitidos.descricao = req.body.descricao;

    if (Object.keys(camposPermitidos).length === 0) {
      return res.status(400).json({ message: 'Nenhum campo válido para atualizar' });
    }

    await Estudante.update(camposPermitidos, {
      where: { userId: req.user.id }
    });

    const estudanteAtualizado = await Estudante.findOne({
      where: { userId: req.user.id }
    });

    const user = await User.findByPk(req.user.id, { 
      attributes: ['id', 'email', 'nome'] 
    });

    const resposta = {
      message: 'Perfil atualizado com sucesso',
      estudante: {
        ...estudanteAtualizado.dataValues,
        User: user
      }
    };

    res.json(resposta);

  } catch (err) {
    console.error('Erro ao atualizar perfil:', err);
    res.status(500).json({ 
      message: 'Erro ao atualizar perfil', 
      error: err.message
    });
  }
};

// Ver propostas compatíveis (por competências)
exports.getPropostasMatch = async (req, res) => {
  try {
    const estudante = await Estudante.findOne({
      where: { userId: req.user.id }
    });

    if (!estudante) {
      return res.status(404).json({ message: 'Estudante não encontrado' });
    }

    // Obter competências do estudante
    const competenciasEstudante = estudante.competencias ? estudante.competencias.split(',').map(c => c.trim().toLowerCase()) : [];

    if (competenciasEstudante.length === 0) {
      return res.json([]);
    }

    // Buscar todas as propostas ativas (verificar vários estados)
    const propostas = await Proposta.findAll({
      where: { 
        estado: { [Op.in]: ['ativa', 'ativo', 'aprovada', 'validada'] }
      },
      include: [
        {
          model: Empresa,
          attributes: ['nome', 'contacto', 'localizacao']
        }
      ]
    });

    // Filtrar propostas que têm pelo menos uma competência em comum
    const propostasCompativeis = propostas.filter(proposta => {
      if (!proposta.areas || !Array.isArray(proposta.areas) || proposta.areas.length === 0) {
        return false;
      }
      
      const competenciasProposta = proposta.areas.map(area => area.trim().toLowerCase());
      
      // Verificar matches exatos
      const matchExato = competenciasProposta.some(comp => competenciasEstudante.includes(comp));
      
      // Verificar matches parciais (uma competência contém a outra)
      const matchParcial = competenciasProposta.some(compProposta => 
        competenciasEstudante.some(compEstudante => 
          compProposta.includes(compEstudante) || compEstudante.includes(compProposta)
        )
      );
      
      return matchExato || matchParcial;
    });

    res.json(propostasCompativeis);

  } catch (err) {
    console.error('Erro ao buscar propostas compatíveis:', err);
    res.status(500).json({ message: 'Erro ao buscar propostas compatíveis', error: err.message });
  }
};

// Ver todas as propostas (explorar)
exports.getTodasPropostas = async (req, res) => {
  try {
    const propostas = await Proposta.findAll({
      where: { estado: { [Op.in]: ['ativa', 'ativo'] } },
      include: Empresa
    });

    res.json(propostas);

  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar propostas', error: err.message });
  }
};

// Pedir remoção da conta
exports.pedirRemocao = async (req, res) => {
  try {
    const estudante = await Estudante.findOne({ where: { userId: req.user.id } });
    if (!estudante) return res.status(404).json({ message: 'Estudante não encontrado' });

    const pedidoExistente = await PedidoRemocao.findOne({ where: { estudanteId: estudante.id, estado: 'pendente' } });
    if (pedidoExistente) return res.status(400).json({ message: 'Já existe um pedido pendente.' });

    await PedidoRemocao.create({
      estudanteId: estudante.id,
      estado: 'pendente'
    });

    res.status(201).json({ message: 'Pedido de remoção enviado ao administrador.' });

  } catch (err) {
    res.status(500).json({ message: 'Erro ao pedir remoção', error: err.message });
  }
};

// Adicionar proposta aos favoritos
exports.adicionarFavorito = async (req, res) => {
  try {
    const { propostaId } = req.params;
    const estudanteId = req.user.id;

    // Buscar estudante
    const estudante = await Estudante.findOne({
      where: { userId: estudanteId }
    });

    if (!estudante) {
      return res.status(404).json({ message: 'Estudante não encontrado' });
    }

    // Verificar se a proposta existe
    const proposta = await Proposta.findByPk(propostaId);
    if (!proposta) {
      return res.status(404).json({ message: 'Proposta não encontrada' });
    }

    // Verificar se já está nos favoritos
    const estudanteComFavoritos = await Estudante.findByPk(estudante.id, {
      include: [{
        model: Proposta,
        as: 'Favoritos',
        where: { id: propostaId },
        required: false
      }]
    });

    if (estudanteComFavoritos.Favoritos && estudanteComFavoritos.Favoritos.length > 0) {
      return res.status(400).json({ message: 'Proposta já está nos favoritos' });
    }

    // Adicionar aos favoritos usando a relação many-to-many
    await estudante.addFavoritos(proposta);

    res.json({ message: 'Proposta adicionada aos favoritos com sucesso' });

  } catch (err) {
    console.error('Erro ao adicionar favorito:', err);
    res.status(500).json({ 
      message: 'Erro ao adicionar favorito', 
      error: err.message 
    });
  }
};

// Remover proposta dos favoritos
exports.removerFavorito = async (req, res) => {
  try {
    const { propostaId } = req.params;
    const estudanteId = req.user.id;

    // Buscar estudante
    const estudante = await Estudante.findOne({
      where: { userId: estudanteId }
    });

    if (!estudante) {
      return res.status(404).json({ message: 'Estudante não encontrado' });
    }

    // Buscar proposta
    const proposta = await Proposta.findByPk(propostaId);
    if (!proposta) {
      return res.status(404).json({ message: 'Proposta não encontrada' });
    }

    // Remover dos favoritos usando a relação many-to-many
    await estudante.removeFavoritos(proposta);

    res.json({ message: 'Proposta removida dos favoritos com sucesso' });

  } catch (err) {
    console.error('Erro ao remover favorito:', err);
    res.status(500).json({ 
      message: 'Erro ao remover favorito', 
      error: err.message 
    });
  }
};

// Listar favoritos do estudante
exports.listarFavoritos = async (req, res) => {
  try {
    const estudanteId = req.user.id;

    // Buscar estudante
    const estudante = await Estudante.findOne({
      where: { userId: estudanteId }
    });

    if (!estudante) {
      return res.status(404).json({ message: 'Estudante não encontrado' });
    }

    // Buscar favoritos usando a relação many-to-many
    const estudanteComFavoritos = await Estudante.findByPk(estudante.id, {
      include: [{
        model: Proposta,
        as: 'Favoritos',
        include: [Empresa]
      }]
    });

    res.json(estudanteComFavoritos.Favoritos || []);

  } catch (err) {
    console.error('Erro ao listar favoritos:', err);
    res.status(500).json({ 
      message: 'Erro ao listar favoritos', 
      error: err.message 
    });
  }
};

// Dashboard do estudante - estatísticas e dados
exports.dashboard = async (req, res) => {
  try {
    const estudanteId = req.user.id;

    // Buscar estudante
    const estudante = await Estudante.findOne({
      where: { userId: estudanteId }
    });

    if (!estudante) {
      return res.status(404).json({ message: 'Estudante não encontrado' });
    }

    // Estatísticas
    const totalPropostasDisponiveis = await Proposta.count({
      where: { estado: { [Op.in]: ['ativa', 'ativo'] } }
    });

    const totalFavoritos = await EstudanteFavorito.count({
      where: { estudanteId: estudante.id }
    });

    res.json({
      estudante: {
        id: estudante.id,
        nome: estudante.nome,
        curso: estudante.curso
      },
      totalPropostasDisponiveis,
      totalFavoritos,
      message: 'Dashboard carregado com sucesso'
    });

  } catch (err) {
    console.error('Erro ao carregar dashboard do estudante:', err);
    res.status(500).json({ 
      message: 'Erro ao carregar dashboard', 
      error: err.message 
    });
  }
};

// Exports corretos para as rotas estudante
exports.getPerfil = exports.getPerfil;
exports.editarPerfil = exports.editarPerfil;
// 📄 Ver propostas compatíveis (por setores)
exports.verPropostasCompativeis = exports.getPropostasMatch;
// 🔎 Ver todas as propostas (exploração)
exports.verTodasPropostas = exports.getTodasPropostas;
exports.pedirRemocao = exports.pedirRemocao;
exports.adicionarFavorito = exports.adicionarFavorito;
exports.removerFavorito = exports.removerFavorito;
exports.listarFavoritos = exports.listarFavoritos;

