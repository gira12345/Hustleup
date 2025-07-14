const db = require('../models');
const { Op } = require('sequelize');
const { Empresa, Estudante, Proposta, PedidoRemocao, User, Setor, EstudanteFavorito } = db;

// Obter perfil do estudante
exports.getPerfil = async (req, res) => {
  try {
    console.log('🔍 [getPerfil] Buscando estudante para userId:', req.user.id);
    
    // Primeiro, verificar se o user existe
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }
    
    // Buscar o estudante
    let estudante = await Estudante.findOne({
      where: { userId: req.user.id },
      include: [{
        model: Setor,
        through: { attributes: [] }
      }]
    });

    // Se não existe registo na tabela Estudante, criar um
    if (!estudante) {
      console.log('⚠️ [getPerfil] Estudante não encontrado, criando registo...');
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
        descricao: '',
        telefone: ''
      });
      
      // Buscar novamente com includes
      estudante = await Estudante.findOne({
        where: { userId: req.user.id },
        include: [{
          model: Setor,
          through: { attributes: [] }
        }]
      });
    }

    console.log('✅ [getPerfil] Estudante encontrado:', estudante.nome);
    res.json(estudante);

  } catch (err) {
    console.error('❌ [getPerfil] Erro:', err);
    res.status(500).json({ message: 'Erro ao buscar perfil', error: err.message });
  }
};

// Editar perfil do estudante
exports.editarPerfil = async (req, res) => {
  try {
    const estudante = await Estudante.findOne({ 
      where: { userId: req.user.id }, 
      include: [{
        model: Setor,
        through: { attributes: [] }
      }]
    });
    if (!estudante) return res.status(404).json({ message: 'Estudante não encontrado' });

    const { nome, curso, competencias, contacto, setores, sobreMim, objetivo, disponibilidade, tipoProjeto,
      instituicao, anoConclusao, idiomas, linkedin, areasInteresse, descricao, telefone } = req.body;

    // Atualiza apenas os campos enviados
    if (nome !== undefined) estudante.nome = nome;
    if (curso !== undefined) estudante.curso = curso;
    if (competencias !== undefined) estudante.competencias = competencias;
    if (contacto !== undefined) estudante.contacto = contacto;
    if (sobreMim !== undefined) estudante.sobreMim = sobreMim;
    if (objetivo !== undefined) estudante.objetivo = objetivo;
    if (disponibilidade !== undefined) estudante.disponibilidade = disponibilidade;
    if (tipoProjeto !== undefined) estudante.tipoProjeto = tipoProjeto;
    if (instituicao !== undefined) estudante.instituicao = instituicao;
    if (anoConclusao !== undefined) estudante.anoConclusao = anoConclusao;
    if (idiomas !== undefined) estudante.idiomas = idiomas;
    if (linkedin !== undefined) estudante.linkedin = linkedin;
    if (areasInteresse !== undefined) estudante.areasInteresse = areasInteresse;
    if (descricao !== undefined) estudante.descricao = descricao;
    if (telefone !== undefined) estudante.telefone = telefone;

    if (req.file) {
      estudante.foto = `uploads/${req.file.filename}`;
    }

    await estudante.save();

    // Parse setores se vier como string JSON
    let setoresParsed = setores;
    if (typeof setoresParsed === 'string') {
      try {
        setoresParsed = JSON.parse(setoresParsed);
      } catch {
        setoresParsed = setoresParsed.split(',').map(s => s.trim());
      }
    }

    // Atualizar setores (array de nomes ou IDs)
    if (setoresParsed) {
      let setoresIds = setoresParsed;
      if (Array.isArray(setoresParsed) && typeof setoresParsed[0] === 'string' && isNaN(Number(setoresParsed[0]))) {
        const setoresObjs = await Setor.findAll({ where: { nome: setoresParsed } });
        setoresIds = setoresObjs.map(s => s.id);
      }
      const setoresExistentes = await Setor.findAll({ where: { id: setoresIds } });
      if (setoresExistentes.length !== setoresIds.length) {
        return res.status(400).json({ message: 'Um ou mais setores não existem.' });
      }
      await estudante.setSetors(setoresIds);
    }

    // Retorna perfil atualizado (com setores)
    const estudanteAtualizado = await Estudante.findOne({
      where: { userId: req.user.id },
      include: [{
        model: Setor,
        through: { attributes: [] }
      }]
    });

    res.json({ message: 'Perfil atualizado com sucesso', estudante: estudanteAtualizado });
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err); // Adicionado log detalhado
    res.status(500).json({ message: 'Erro ao atualizar perfil', error: err.message });
  }
};

// Ver propostas compatíveis (por competências)
exports.getPropostasMatch = async (req, res) => {
  try {
    console.log('=== INICIO getPropostasMatch ===');
    console.log('User ID:', req.user.id);
    
    const estudante = await Estudante.findOne({
      where: { userId: req.user.id }
    });

    if (!estudante) {
      console.log('Estudante não encontrado para userId:', req.user.id);
      return res.status(404).json({ message: 'Estudante não encontrado' });
    }

    console.log('Estudante encontrado:', estudante.nome);
    console.log('Competências do estudante:', estudante.competencias);

    // Obter competências do estudante
    const competenciasEstudante = estudante.competencias ? estudante.competencias.split(',').map(c => c.trim().toLowerCase()) : [];

    console.log('Competências processadas:', competenciasEstudante);

    if (competenciasEstudante.length === 0) {
      console.log('Estudante não tem competências definidas');
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

    console.log('Propostas ativas encontradas:', propostas.length);

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
      
      const isMatch = matchExato || matchParcial;
      
      if (isMatch) {
        console.log(`Match encontrado: ${proposta.nome}`);
        console.log(`  Competências proposta: [${competenciasProposta.join(', ')}]`);
        console.log(`  Match exato: ${matchExato}, Match parcial: ${matchParcial}`);
      }
      
      return isMatch;
    });

    console.log('Propostas compatíveis encontradas:', propostasCompativeis.length);
    console.log('=== FIM getPropostasMatch ===');

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

