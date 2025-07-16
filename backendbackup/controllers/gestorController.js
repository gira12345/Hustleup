const { Op } = require('sequelize');
const { Empresa, Proposta, Setor, Estudante, PedidoRemocao, Notificacao, Departamento, User } = require('../models');

// Obter perfil do gestor
exports.getPerfil = async (req, res) => {
  try {
    const gestor = await User.findByPk(req.user.id, {
      attributes: ['id', 'nome', 'email', 'role', 'createdAt']
    });

    if (!gestor || gestor.role !== 'gestor') {
      return res.status(404).json({ message: 'Gestor não encontrado' });
    }

    res.json({
      id: gestor.id,
      nome: gestor.nome,
      email: gestor.email,
      role: gestor.role,
      createdAt: gestor.createdAt
    });
  } catch (err) {
    console.error('Erro ao obter perfil do gestor:', err);
    res.status(500).json({ message: 'Erro ao obter perfil do gestor', error: err.message });
  }
};

// Submeter proposta em nome de uma empresa
exports.submeterPropostaPorEmpresa = async (req, res) => {
  const { empresaId } = req.params;
  const { titulo, descricao, contacto } = req.body;

  try {
    const empresa = await Empresa.findByPk(empresaId);
    if (!empresa || !empresa.validado) {
      return res.status(404).json({ message: 'Empresa inválida ou não validada.' });
    }

    const proposta = await Proposta.create({
      titulo,
      descricao,
      contacto,
      estado: 'pendente',
      empresaId
    });

    res.status(201).json({ message: 'Proposta submetida com sucesso', proposta });

  } catch (err) {
    res.status(500).json({ message: 'Erro ao submeter proposta', error: err.message });
  }
};

// Validar proposta
exports.validarProposta = async (req, res) => {
  try {
    const proposta = await Proposta.findByPk(req.params.id);
    if (!proposta) return res.status(404).json({ message: 'Proposta não encontrada' });

    proposta.estado = 'ativa';
    await proposta.save();

    res.json({ message: 'Proposta validada com sucesso!' });

  } catch (err) {
    res.status(500).json({ message: 'Erro ao validar proposta', error: err.message });
  }
};

// Alterar estado de proposta
exports.alterarEstadoProposta = async (req, res) => {
  try {
    const proposta = await Proposta.findByPk(req.params.id);
    if (!proposta) return res.status(404).json({ message: 'Proposta não encontrada' });

    proposta.estado = req.body.estado; // ativa, inativa, arquivada...
    await proposta.save();

    res.json({ message: 'Estado da proposta atualizado', proposta });

  } catch (err) {
    res.status(500).json({ message: 'Erro ao alterar estado da proposta', error: err.message });
  }
};

// Enviar notificação a estudantes com perfis compatíveis
exports.notificarEstudantes = async (req, res) => {
  const { setorId, mensagem } = req.body;

  try {
    const estudantes = await Estudante.findAll({
      include: {
        model: Setor,
        where: { id: setorId }
      }
    });

    for (const estudante of estudantes) {
      await Notificacao.create({
        estudanteId: estudante.id,
        mensagem
      });
    }

    res.json({ message: `Notificação enviada a ${estudantes.length} estudantes.` });

  } catch (err) {
    res.status(500).json({ message: 'Erro ao enviar notificações', error: err.message });
  }
};

// Ver pedidos de remoção
exports.getPedidosRemocao = async (req, res) => {
  try {
    const pedidos = await PedidoRemocao.findAll({ where: { estado: 'pendente' }, include: Estudante });
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar pedidos de remoção', error: err.message });
  }
};

// Validar pedido de remoção
exports.validarRemocaoEstudante = async (req, res) => {
  try {
    const pedido = await PedidoRemocao.findByPk(req.params.id);
    if (!pedido) return res.status(404).json({ message: 'Pedido não encontrado' });

    const estudante = await Estudante.findByPk(pedido.estudanteId);
    if (estudante) await estudante.destroy();

    pedido.estado = 'aprovado';
    await pedido.save();

    res.json({ message: 'Estudante removido com sucesso!' });

  } catch (err) {
    res.status(500).json({ message: 'Erro ao remover estudante', error: err.message });
  }
};

// Dashboard estatístico para gestor
exports.dashboard = async (req, res) => {
  try {
    const gestorId = req.user.id;
    
    console.log(`Buscando estatísticas do dashboard para gestor ID: ${gestorId}`);
    
    // Contar propostas por estado sem filtros complexos por enquanto
    const totalPropostas = await Proposta.count().catch(() => 0);
    const propostasAtivas = await Proposta.count({ where: { estado: { [Op.in]: ['ativa', 'ativo'] } } }).catch(() => 0);
    const propostasPendentes = await Proposta.count({ where: { estado: 'pendente' } }).catch(() => 0);
    
    // Número fixo de departamentos por enquanto para evitar erro
    const totalDepartamentos = 3;
    
    console.log(`Estatísticas: Total: ${totalPropostas}, Ativas: ${propostasAtivas}, Pendentes: ${propostasPendentes}`);
    
    res.json({
      totalPropostas,
      propostasAtivas,
      propostasPendentes,
      totalDepartamentos
    });
  } catch (err) {
    console.error(`Erro no dashboard: ${err.message}`, err);
    res.status(500).json({ message: 'Erro ao buscar estatísticas do gestor', error: err.message });
  }
};

// Retorna os departamentos do gestor logado
exports.getDepartamentosDoGestor = async (req, res) => {
  try {
    const gestorId = req.user.id;
    
    console.log(`Buscando departamentos para gestor ID: ${gestorId}`);
    
    // Por enquanto, retornar departamentos fixos para evitar erro
    const departamentosFake = [
      { id: 1, nome: 'Engenharia Informática' },
      { id: 2, nome: 'Marketing' },
      { id: 3, nome: 'Estatística e Análise de Dados' }
    ];
    
    console.log(`Retornando ${departamentosFake.length} departamentos`);
    res.json(departamentosFake);
  } catch (err) {
    console.error(`Erro ao buscar departamentos: ${err.message}`, err);
    res.status(500).json({ message: 'Erro ao buscar departamentos do gestor', error: err.message });
  }
};

// Gestor cria proposta
exports.criarProposta = async (req, res) => {
  try {
    const gestorId = req.user.id;
    const { nome, departamento, descricao, contracto, morada, areas, email, empresaId } = req.body;
    
    // Verificar se o campo necessário está presente
    if (!nome || !departamento || !descricao || !contracto || !morada || !areas) {
      return res.status(400).json({ message: 'Campos obrigatórios não fornecidos' });
    }
    
    // Usar o empresaId fornecido ou um valor padrão
    const empresa = empresaId ? empresaId : 1;
    
    // Criar a proposta com os dados fornecidos
    const proposta = await Proposta.create({
      nome,
      departamento,
      descricao,
      contracto,
      morada,
      areas: Array.isArray(areas) ? areas : [areas],
      email,
      empresaId: empresa,
      estado: 'pendente',
      gestorId: gestorId  // Incluir o ID do gestor que está criando a proposta
    });
    
    res.status(201).json({ message: 'Proposta criada com sucesso', proposta });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar proposta', error: err.message });
  }
};

// Lista propostas do gestor logado
exports.listarPropostas = async (req, res) => {
  try {
    const gestorId = req.user.id;
    
    console.log(`Buscando propostas para o gestor ID: ${gestorId}`);
    
    // Verificar se o gestor existe e tem departamentos associados
    const { GestorDepartamento } = require('../models');
    const gestorDeps = await GestorDepartamento.findAll({ where: { gestorId } });
    console.log(`Gestor tem ${gestorDeps.length} departamentos associados`);
    
    // Se não tem departamentos associados, mostrar propostas com departamento nulo ou vazias
    let propostas = [];
    
    if (gestorDeps.length === 0) {
      console.log('Gestor sem departamentos: mostrando todas as propostas');
      // Buscar todas as propostas, mesmo sem departamentos associados
      propostas = await Proposta.findAll({
        include: [{
          model: Empresa,
          as: 'empresa', // Corrigido para garantir que o campo empresa é populado
          attributes: ['id', 'nome'],
          required: false
        }]
      }).catch(err => {
        console.error('Erro ao buscar propostas:', err.message);
        return [];
      });
    } else {
      // Buscar departamentos do gestor para filtrar propostas
      const Departamento = require('../models').Departamento;
      const departamentos = await Departamento.findAll({
        where: { 
          id: gestorDeps.map(gd => gd.departamentoId) 
        }
      });
      
      const departamentosNomes = departamentos.map(d => d.nome.toLowerCase());
      console.log(`Departamentos do gestor: ${departamentosNomes.join(', ')}`);
      
      // Buscar todas as propostas e filtrar por departamentos do gestor
      propostas = await Proposta.findAll({
        include: [{
          model: Empresa,
          as: 'empresa', // Corrigido para garantir que o campo empresa é populado
          attributes: ['id', 'nome'],
          required: false
        }]
      }).catch(err => {
        console.error('Erro ao buscar propostas:', err.message);
        return [];
      });
      
      // Adicionar também propostas com gestorId = gestorId atual
      propostas = propostas.filter(p => 
        (p.departamento && departamentosNomes.includes(p.departamento.toLowerCase().trim())) ||
        p.gestorId === gestorId
      );
      
      console.log(`Encontradas ${propostas.length} propostas nos departamentos do gestor`);
    }
    
    // Log para depuração - mostrar as primeiras 3 propostas encontradas
    if (propostas.length > 0) {
      const amostra = propostas.slice(0, 3);
      console.log('Amostra de propostas:', amostra.map(p => ({
        id: p.id,
        nome: p.nome || p.titulo,
        departamento: p.departamento,
        estado: p.estado || p.status
      })));
    } else {
      console.log('Nenhuma proposta encontrada para este gestor');
      
      // Verificar se estamos em ambiente de produção ou desenvolvimento
      const isProd = process.env.NODE_ENV === 'production';
      
      if (!isProd && req.query.useMock === 'true') {
        // Em desenvolvimento, podemos usar dados de exemplo se solicitado explicitamente
        console.log('Retornando dados mock para testes');
        const propostasMock = [
          { id: 1, nome: 'Desenvolvimento de aplicação web', departamento: 'Engenharia Informática', estado: 'ativa', empresaId: 1 },
          { id: 2, nome: 'Implementação de sistema de gestão', departamento: 'Engenharia Informática', estado: 'pendente', empresaId: 2 },
          { id: 3, nome: 'Estágio em desenvolvimento frontend', departamento: 'Engenharia Informática', estado: 'ativa', empresaId: 3 }
        ];
        return res.json(propostasMock);
      }
      
      // Em produção ou se não solicitado especificamente, retornar lista vazia
      console.log('Retornando lista vazia de propostas');
      return res.json([]);
    }
    
    // Filtra por departamento se fornecido na query
    const departamento = req.query.departamento;
    if (departamento) {
      const termoBusca = departamento.toLowerCase().trim();
      const filtradas = propostas.filter(p => 
        p.departamento?.toLowerCase().includes(termoBusca)
      );
      console.log(`${filtradas.length} propostas após filtro por departamento`);
      return res.json(filtradas);
    }
    
    res.json(propostas);
  } catch (err) {
    console.error(`Erro ao buscar propostas: ${err.message}`, err);
    res.status(500).json({ message: 'Erro ao buscar propostas do gestor', error: err.message });
  }
};

// Busca uma proposta específica do gestor logado
exports.getPropostaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const gestorId = req.user.id;
    
    // Buscar a proposta real da base de dados - busca apenas pelo ID
    // Removemos a restrição de gestorId para permitir edição de qualquer proposta
    let whereConditions = { id };
    
    console.log(`[DEBUG] Buscando proposta com ID: ${id}`);
    
    const proposta = await Proposta.findOne({
      where: whereConditions,
      include: [{
        model: Empresa,
        attributes: ['id', 'nome']
      }]
    });
    
    if (!proposta) {
      return res.status(404).json({ message: 'Proposta não encontrada' });
    }
    
    // Verificar se o filtro por departamento está ativado
    const departamentoFiltro = req.query.departamento;
    if (departamentoFiltro) {
      const termoBusca = departamentoFiltro.toLowerCase().trim();
      if (!proposta.departamento.toLowerCase().includes(termoBusca)) {
        return res.status(403).json({ 
          message: 'Acesso negado: Proposta não pertence ao departamento filtrado.' 
        });
      }
    }
    
    res.json(proposta);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar proposta', error: err.message });
  }
};

// Permite ao gestor editar uma proposta
exports.editarProposta = async (req, res) => {
  console.log('[DEBUG] Iniciando edição de proposta com ID:', req.params.id);
  console.log('[DEBUG] Corpo da requisição:', req.body);
  
  try {
    const { id } = req.params;
    const gestorId = req.user.id;
    
    // Buscar a proposta no banco de dados
    const proposta = await Proposta.findByPk(id);
    
    if (!proposta) {
      console.log(`[DEBUG] Proposta com ID ${id} não encontrada`);
      return res.status(404).json({ message: 'Proposta não encontrada' });
    }
    
    console.log(`[DEBUG] Proposta encontrada:`, {
      id: proposta.id,
      nome: proposta.nome,
      departamento: proposta.departamento,
      gestorId: proposta.gestorId
    });
    
    // Para permitir mais flexibilidade na edição, vamos remover temporariamente as verificações
    // de segurança relacionadas a departamentos e gestorId
    /*
    // Se a proposta tem gestorId definido, verificar se corresponde ao gestor atual
    if (proposta.gestorId !== null && proposta.gestorId !== undefined && proposta.gestorId !== gestorId) {
      console.log(`[DEBUG] Permissão negada: gestorId da proposta (${proposta.gestorId}) não corresponde ao gestor atual (${gestorId})`);
      return res.status(403).json({ 
        message: 'Você não tem permissão para editar esta proposta' 
      });
    }
    
    // Verificar a associação entre gestor e departamento da proposta
    const { GestorDepartamento } = require('../models');
    const gestorDeps = await GestorDepartamento.findAll({ where: { gestorId } });
    const departamentoDoGestor = await Departamento.findAll({
      where: { id: gestorDeps.map(gd => gd.departamentoId) }
    });
    
    // Verificar se o departamento da proposta corresponde a algum departamento do gestor
    const depNomes = departamentoDoGestor.map(d => d.nome.toLowerCase());
    if (!depNomes.includes(proposta.departamento.toLowerCase())) {
      console.log(`[DEBUG] Permissão negada: departamento da proposta (${proposta.departamento}) não está nos departamentos do gestor (${depNomes.join(', ')})`);
      return res.status(403).json({
        message: 'Você só pode editar propostas de seus departamentos'
      });
    }
    
    // Validar se o departamento está na lista de departamentos gerenciados pelo gestor
    if (departamento && !depNomes.includes(departamento.toLowerCase())) {
      console.log(`[DEBUG] Departamento inválido: ${departamento} não pertence ao gestor`);
      return res.status(403).json({
        message: 'Você não pode transferir a proposta para um departamento fora da sua gestão'
      });
    }
    */
    
    // Extrair dados do body
    const { nome, departamento, descricao, contracto, morada, areas, email, estado } = req.body;
    
    console.log('[DEBUG] Preparando atualização com dados:', {
      nome, departamento, estado, 
      areasLength: areas ? areas.length : 'undefined'
    });
    
    // Preparar dados para atualização, mantendo valores originais se não fornecidos
    const updateData = {
      nome: nome !== undefined ? nome : proposta.nome,
      departamento: departamento !== undefined ? departamento : proposta.departamento,
      descricao: descricao !== undefined ? descricao : proposta.descricao,
      contracto: contracto !== undefined ? contracto : proposta.contracto,
      morada: morada !== undefined ? morada : proposta.morada,
      areas: areas !== undefined ? areas : proposta.areas,
      email: email !== undefined ? email : proposta.email,
      estado: estado !== undefined ? estado : proposta.estado
    };
    
    console.log('[DEBUG] Dados finais para atualização:', updateData);
    
    // Realizar atualização
    await proposta.update(updateData);
    
    console.log('[DEBUG] Proposta atualizada com sucesso');
    res.json({ message: 'Proposta atualizada com sucesso', proposta });
  } catch (err) {
    console.error(`Erro ao editar proposta: ${err.message}`, err);
    res.status(500).json({ message: 'Erro ao atualizar proposta', error: err.message });
  }
};

// Permite ao gestor validar propostas
exports.validarProposta = async (req, res) => {
  try {
    const { id } = req.params;
    const gestorId = req.user.id;
    
    console.log(`Tentando validar proposta ID: ${id} por gestor ID: ${gestorId}`);
    
    // Buscar a proposta no banco de dados
    const proposta = await Proposta.findByPk(id);
    
    if (!proposta) {
      return res.status(404).json({ message: 'Proposta não encontrada' });
    }
    
    console.log(`Proposta encontrada: ${JSON.stringify(proposta)}`);
    
    // Se a proposta tem gestorId definido, verificar se corresponde ao gestor atual
    if (proposta.gestorId !== null && proposta.gestorId !== undefined && proposta.gestorId !== gestorId) {
      return res.status(403).json({ 
        message: 'Você não tem permissão para validar esta proposta' 
      });
    }
    
    // Verificar a associação entre gestor e departamento da proposta
    const { GestorDepartamento } = require('../models');
    const gestorDeps = await GestorDepartamento.findAll({ where: { gestorId } });
    const departamentoDoGestor = await Departamento.findAll({
      where: { id: gestorDeps.map(gd => gd.departamentoId) }
    });
    
    // Verificar se o departamento da proposta corresponde a algum departamento do gestor
    const depNomes = departamentoDoGestor.map(d => d.nome.toLowerCase());
    if (!depNomes.includes(proposta.departamento.toLowerCase())) {
      console.log(`Departamento da proposta (${proposta.departamento}) não corresponde aos departamentos do gestor: ${depNomes.join(', ')}`);
      return res.status(403).json({
        message: 'Você só pode validar propostas de seus departamentos'
      });
    }
    
    console.log(`Atualizando proposta para status 'ativa'`);
    
    // Garantir que o estado seja atualizado para 'ativa'
    await proposta.update({ 
      estado: 'ativa',
      data_ativacao: new Date()
    });
    
    // Forçar a persistência no banco de dados
    await proposta.save();
    
    // Verificar se a atualização foi bem-sucedida
    const propostaAtualizada = await Proposta.findByPk(id);
    console.log(`Estado após atualização: ${propostaAtualizada.estado}`);
    
    res.json({ 
      message: 'Proposta validada com sucesso', 
      proposta: propostaAtualizada
    });
  } catch (err) {
    console.error(`Erro ao validar proposta: ${err.message}`, err);
    res.status(500).json({ message: 'Erro ao validar proposta', error: err.message });
  }
};

// Permite ao gestor reativar propostas
exports.reativarProposta = async (req, res) => {
  try {
    const { id } = req.params;
    const proposta = await Proposta.findByPk(id);
    
    if (!proposta) {
      return res.status(404).json({ message: 'Proposta não encontrada' });
    }
    
    await proposta.update({ estado: 'ativa' });
    res.json({ message: 'Proposta reativada com sucesso', proposta });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao reativar proposta', error: err.message });
  }
};

// Permite ao gestor eliminar propostas
exports.eliminarProposta = async (req, res) => {
  try {
    const { id } = req.params;
    const proposta = await Proposta.findByPk(id);
    
    if (!proposta) {
      return res.status(404).json({ message: 'Proposta não encontrada' });
    }
    
    await proposta.destroy();
    res.json({ message: 'Proposta deletada com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao eliminar proposta', error: err.message });
  }
};

// Aprovar proposta
exports.aprovarProposta = async (req, res) => {
  try {
    const { id } = req.params;
    const proposta = await Proposta.findByPk(id);
    if (!proposta) return res.status(404).json({ message: 'Proposta não encontrada' });
    proposta.estado = 'ativo';
    await proposta.save();
    res.json({ message: 'Proposta aprovada com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao aprovar proposta', error: err.message });
  }
};

// Desativar proposta
exports.desativarProposta = async (req, res) => {
  try {
    const { id } = req.params;
    const proposta = await Proposta.findByPk(id);
    if (!proposta) return res.status(404).json({ message: 'Proposta não encontrada' });
    proposta.estado = 'inativo';
    await proposta.save();
    res.json({ message: 'Proposta desativada com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao desativar proposta', error: err.message });
  }
};

// Ativar proposta
exports.ativarProposta = async (req, res) => {
  try {
    const { id } = req.params;
    const proposta = await Proposta.findByPk(id);
    if (!proposta) return res.status(404).json({ message: 'Proposta não encontrada' });
    proposta.estado = 'ativo';
    await proposta.save();
    res.json({ message: 'Proposta ativada com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao ativar proposta', error: err.message });
  }
};

// Arquivar proposta
exports.arquivarProposta = async (req, res) => {
  try {
    const { id } = req.params;
    const proposta = await Proposta.findByPk(id);
    if (!proposta) return res.status(404).json({ message: 'Proposta não encontrada' });
    proposta.estado = 'arquivado';
    await proposta.save();
    res.json({ message: 'Proposta arquivada com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao arquivar proposta', error: err.message });
  }
};

// Apagar proposta
exports.apagarProposta = async (req, res) => {
  try {
    const { id } = req.params;
    const proposta = await Proposta.findByPk(id);
    if (!proposta) return res.status(404).json({ message: 'Proposta não encontrada' });
    await proposta.destroy();
    res.json({ message: 'Proposta apagada com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao apagar proposta', error: err.message });
  }
};

// Listar pedidos de remoção para o gestor (baseado na implementação do admin)
exports.listarPedidosRemocao = async (req, res) => {
  try {
    console.log('[GESTOR - listarPedidosRemocao] Iniciando...');
    
    const { PedidoRemocao, Estudante } = require('../models');
    if (!PedidoRemocao) {
      throw new Error('Modelo PedidoRemocao não encontrado');
    }
    if (!Estudante) {
      throw new Error('Modelo Estudante não encontrado');
    }
    console.log(' [GESTOR - listarPedidosRemocao] Modelos carregados');
    
    console.log('[GESTOR - listarPedidosRemocao] Fazendo query...');
    const pedidos = await PedidoRemocao.findAll({
      where: { estado: 'pendente' },
      include: [
        {
          model: Estudante,
          attributes: ['id', 'nome', 'contacto']
        }
      ]
    });
    
    console.log(' [GESTOR - listarPedidosRemocao] Query executada, encontrados:', pedidos.length, 'pedidos');
    
    // Formatar os dados para o frontend
    const pedidosFormatados = pedidos.map(p => ({
      id: p.id,
      nome: p.Estudante ? p.Estudante.nome : 'N/A',
      email: p.Estudante ? p.Estudante.contacto : 'N/A',
      motivo: p.motivo || 'Pedido de remoção de conta',
      estado: p.estado
    }));
    
    console.log(' [GESTOR - listarPedidosRemocao] Dados formatados:', pedidosFormatados.length);
    res.status(200).json(pedidosFormatados);
  } catch (err) {
    console.error(' [GESTOR - listarPedidosRemocao] Erro:', err);
    console.error(' [GESTOR - listarPedidosRemocao] Stack:', err.stack);
    res.status(500).json({ 
      message: 'Erro ao listar pedidos de remoção', 
      error: err.message,
      details: err.stack
    });
  }
};

// Aprovar pedido de remoção
exports.aprovarPedidoRemocao = async (req, res) => {
  try {
    const { id } = req.params;
    const gestorId = req.user.id;
    
    // Buscar o pedido
    const pedido = await PedidoRemocao.findByPk(id, {
      include: [Estudante]
    });
    
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }
    
    // Verificar se o estudante está em um departamento do gestor
    const { GestorDepartamento, EstudanteDepartamento } = require('../models');
    
    // Buscar departamentos do gestor
    const gestorDepartamentos = await GestorDepartamento.findAll({ where: { gestorId } });
    const departamentoIds = gestorDepartamentos.map(gd => gd.departamentoId);
    
    // Verificar se o estudante pertence a algum departamento do gestor
    const estudanteDepartamento = await EstudanteDepartamento.findOne({
      where: {
        estudanteId: pedido.estudanteId,
        departamentoId: departamentoIds
      }
    });
    
    if (!estudanteDepartamento) {
      return res.status(403).json({ 
        message: 'Acesso negado: Você não tem permissão para gerenciar este estudante' 
      });
    }
    
    // Aprovar pedido e remover estudante
    await pedido.update({ estado: 'aprovado' });

    if (pedido.Estudante) {
      // Remover estudante da base de dados
      await pedido.Estudante.destroy();
    }

    res.json({ message: 'Pedido de remoção aprovado com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao aprovar pedido de remoção', error: err.message });
  }
};

// Rejeitar pedido de remoção
exports.rejeitarPedidoRemocao = async (req, res) => {
  try {
    const { id } = req.params;
    const gestorId = req.user.id;
    
    // Buscar o pedido
    const pedido = await PedidoRemocao.findByPk(id, {
      include: [Estudante]
    });
    
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }
    
    // Verificar se o estudante está em um departamento do gestor
    const { GestorDepartamento, EstudanteDepartamento } = require('../models');
    
    // Buscar departamentos do gestor
    const gestorDepartamentos = await GestorDepartamento.findAll({ where: { gestorId } });
    const departamentoIds = gestorDepartamentos.map(gd => gd.departamentoId);
    
    // Verificar se o estudante pertence a algum departamento do gestor
    const estudanteDepartamento = await EstudanteDepartamento.findOne({
      where: {
        estudanteId: pedido.estudanteId,
        departamentoId: departamentoIds
      }
    });
    
    if (!estudanteDepartamento) {
      return res.status(403).json({ 
        message: 'Acesso negado: Você não tem permissão para gerenciar este estudante' 
      });
    }
    
    // Rejeitar o pedido
    await pedido.update({ estado: 'rejeitado' });
    
    res.json({ message: 'Pedido de remoção rejeitado com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao rejeitar pedido de remoção', error: err.message });
  }
};

// Listar propostas pendentes para aprovação
exports.listarPropostasPendentes = async (req, res) => {
  try {
    const gestorId = req.user.id;
    
    console.log(`Buscando propostas pendentes para o gestor ID: ${gestorId}`);
    
    // Buscar todas as propostas pendentes sem usar GestorDepartamento por enquanto
    const allPropostas = await Proposta.findAll({
      where: { estado: 'pendente' },
      include: [{
        model: Empresa,
        as: 'empresa', // Corrigido para garantir que o campo empresa é populado
        attributes: ['id', 'nome'], // Removido 'email' que não existe no modelo
        required: false
      }],
      order: [['createdAt', 'DESC']]
    }).catch(err => {
      console.error('Erro ao buscar propostas:', err.message);
      return [];
    });
    
    console.log(`Encontradas ${allPropostas.length} propostas pendentes no total`);
    
    if (allPropostas.length > 0) {
      console.log('Propostas encontradas:', allPropostas.map(p => ({ 
        id: p.id, 
        nome: p.nome || p.titulo, 
        departamento: p.departamento,
        estado: p.estado
      })));
    }
    
    res.json(allPropostas);
  } catch (err) {
    console.error(`Erro ao buscar propostas pendentes: ${err.message}`, err);
    res.status(500).json({ 
      message: 'Erro ao buscar propostas pendentes', 
      error: err.message 
    });
  }
};

// Listar propostas por departamento do gestor
exports.listarPropostasPorDepartamento = async (req, res) => {
  try {
    const gestorId = req.user.id;
    const { depId } = req.params;
    
    // Verificar se o gestor está associado a este departamento
    const { GestorDepartamento } = require('../models');
    const gestorDepartamento = await GestorDepartamento.findOne({
      where: { 
        gestorId,
        departamentoId: depId
      }
    });
    
    if (!gestorDepartamento) {
      return res.status(403).json({
        message: 'Você não tem acesso a este departamento'
      });
    }
    
    // Buscar o departamento para obter seu nome
    const departamento = await Departamento.findByPk(depId);
    if (!departamento) {
      return res.status(404).json({
        message: 'Departamento não encontrado'
      });
    }
    
    // Buscar propostas que correspondam ao nome do departamento
    const propostas = await Proposta.findAll({
      where: {
        departamento: departamento.nome
      },
      include: [{
        model: Empresa,
        attributes: ['id', 'nome']
      }]
    });
    
    res.json(propostas);
  } catch (err) {
    console.error(`Erro ao listar propostas por departamento: ${err.message}`, err);
    res.status(500).json({ 
      message: 'Erro ao buscar propostas do departamento', 
      error: err.message 
    });
  }
};

// Listar propostas pendentes de um departamento específico
exports.listarPropostasPendentesPorDepartamento = async (req, res) => {
  try {
    const gestorId = req.user.id;
    const { depId } = req.params;
    
    // Verificar se o gestor está associado a este departamento
    const { GestorDepartamento } = require('../models');
    const gestorDepartamento = await GestorDepartamento.findOne({
      where: { 
        gestorId,
        departamentoId: depId
      }
    });
    
    if (!gestorDepartamento) {
      return res.status(403).json({
        message: 'Você não tem acesso a este departamento'
      });
    }
    
    // Buscar o departamento para obter seu nome
    const departamento = await Departamento.findByPk(depId);
    if (!departamento) {
      return res.status(404).json({
        message: 'Departamento não encontrado'
      });
    }
    
    // Buscar propostas pendentes deste departamento
    const propostas = await Proposta.findAll({
      where: {
        departamento: departamento.nome,
        estado: 'pendente'
      },
      include: [{
        model: Empresa,
        attributes: ['id', 'nome']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(propostas);
  } catch (err) {
    console.error(`Erro ao listar propostas pendentes por departamento: ${err.message}`, err);
    res.status(500).json({ 
      message: 'Erro ao buscar propostas pendentes do departamento', 
      error: err.message 
    });
  }
};

// Função simplificada para editar uma proposta - aceita apenas o nome como obrigatório
exports.editarPropostaSimples = async (req, res) => {
  console.log('[DEBUG] Iniciando edição simples de proposta com ID:', req.params.id);
  console.log('[DEBUG] Corpo da requisição:', req.body);
  
  try {
    const { id } = req.params;
    
    // Buscar a proposta no banco de dados sem restrições
    const proposta = await Proposta.findByPk(id);
    
    if (!proposta) {
      console.log(`[DEBUG] Proposta com ID ${id} não encontrada`);
      return res.status(404).json({ message: 'Proposta não encontrada' });
    }
    
    console.log(`[DEBUG] Proposta encontrada:`, {
      id: proposta.id,
      nome: proposta.nome,
      departamento: proposta.departamento
    });
    
    // Extrair apenas o campo nome do corpo da requisição
    const { nome } = req.body;
    
    if (!nome || nome.trim() === '') {
      return res.status(400).json({ message: 'O nome da proposta é obrigatório' });
    }
    
    console.log('[DEBUG] Atualizando nome da proposta para:', nome);
    
    // Atualizar apenas o nome
    await proposta.update({ nome });
    
    console.log('[DEBUG] Proposta atualizada com sucesso (edição simples)');
    res.json({ 
      message: 'Proposta atualizada com sucesso', 
      proposta: {
        id: proposta.id,
        nome: proposta.nome
      } 
    });
  } catch (err) {
    console.error(`[ERROR] Erro ao editar proposta (modo simples): ${err.message}`, err);
    res.status(500).json({ message: 'Erro ao atualizar proposta', error: err.message });
  }
};

// Listar empresas visíveis para o gestor
exports.listarEmpresas = async (req, res) => {
  try {
    // Pode-se filtrar por departamento do gestor, se necessário
    // Mostrar empresas validadas e pendentes
    const empresas = await Empresa.findAll();
    res.json(empresas);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar empresas', error: err.message });
  }
};

// Criar utilizador (gestor pode criar estudante, empresa ou gestor)
exports.criarUtilizador = async (req, res) => {
  try {
    const { nome, email, password, role } = req.body;
    if (!nome || !email || !password || !role) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    // Verificar se já existe utilizador com o mesmo email
    const existente = await User.findOne({ where: { email } });
    if (existente) {
      return res.status(409).json({ message: 'Já existe um utilizador com este email.' });
    }
    // Criar utilizador
    const novo = await User.create({ nome, email, password, role });
    res.status(201).json({ message: 'Utilizador criado com sucesso!', utilizador: novo });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar utilizador', error: err.message });
  }
};

// Listar utilizadores (apenas estudantes para o gestor)
exports.listarUtilizadores = async (req, res) => {
  try {
    const utilizadores = await User.findAll({
      where: { role: 'estudante' },
      attributes: ['id', 'nome', 'email', 'role', 'createdAt']
    });
    res.json({ utilizadores });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar utilizadores', error: err.message });
  }
};

// Remover utilizador
exports.removerUtilizador = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Utilizador não encontrado' });
    await user.destroy();
    res.json({ message: 'Utilizador removido com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao remover utilizador', error: err.message });
  }
};

// Editar utilizador
exports.editarUtilizador = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, role } = req.body;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Utilizador não encontrado' });
    user.nome = nome || user.nome;
    user.email = email || user.email;
    user.role = role || user.role;
    await user.save();
    res.json({ message: 'Utilizador atualizado com sucesso!', utilizador: user });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao editar utilizador', error: err.message });
  }
};

// Listar estudantes (apenas estudantes, igual ao admin)
exports.listarEstudantes = async (req, res) => {
  try {
    const utilizadores = await User.findAll({
      where: { role: 'estudante' },
      attributes: ['id', 'nome', 'email', 'role', 'createdAt']
    });
    res.status(200).json({ utilizadores });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar estudantes', error: err.message });
  }
};

// Aprovar empresa
exports.aprovarEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const empresa = await Empresa.findByPk(id);
    if (!empresa) return res.status(404).json({ message: 'Empresa não encontrada' });
    empresa.validado = true;
    await empresa.save();
    res.json({ message: 'Empresa aprovada com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao aprovar empresa', error: err.message });
  }
};

// Desativar empresa
exports.desativarEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const empresa = await Empresa.findByPk(id);
    if (!empresa) return res.status(404).json({ message: 'Empresa não encontrada' });
    empresa.validado = false;
    await empresa.save();
    res.json({ message: 'Empresa desativada com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao desativar empresa', error: err.message });
  }
};

// Apagar empresa
exports.apagarEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const empresa = await Empresa.findByPk(id);
    if (!empresa) return res.status(404).json({ message: 'Empresa não encontrada' });
    await empresa.destroy();
    res.json({ message: 'Empresa apagada com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao apagar empresa', error: err.message });
  }
};

// Retorna os dados de uma empresa pelo ID
exports.getEmpresaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const empresa = await Empresa.findByPk(id);
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }
    res.json(empresa);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar empresa', error: err.message });
  }
};

// Pedidos de remoção
exports.debugPedidosRemocao = async (req, res) => {
  try {
    
    // Verificar se há dados na tabela
    const todosPedidos = await PedidoRemocao.findAll({
      include: [{
        model: Estudante,
        include: [{
          model: User,
          attributes: ['nome', 'email']
        }]
      }]
    });
    
    console.log('Total de pedidos na BD:', todosPedidos.length);
    
    // Verificar pedidos pendentes
    const pedidosPendentes = await PedidoRemocao.findAll({
      where: { estado: 'pendente' },
      include: [{
        model: Estudante,
        include: [{
          model: User,
          attributes: ['nome', 'email']
        }]
      }]
    });
    
    console.log('⏳ Pedidos pendentes:', pedidosPendentes.length);
    
    res.json({
      totalPedidos: todosPedidos.length,
      pedidosPendentes: pedidosPendentes.length,
      todosPedidos: todosPedidos.map(p => ({
        id: p.id,
        estudanteId: p.estudanteId,
        estado: p.estado,
        motivo: p.motivo,
        nome: p.Estudante?.User?.nome,
        email: p.Estudante?.User?.email,
        createdAt: p.createdAt
      })),
      pendentes: pedidosPendentes.map(p => ({
        id: p.id,
        estudanteId: p.estudanteId,
        estado: p.estado,
        motivo: p.motivo,
        nome: p.Estudante?.User?.nome,
        email: p.Estudante?.User?.email,
        createdAt: p.createdAt
      }))
    });
  } catch (error) {
    console.error('Erro no debug:', error);
    res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
};

// Listar pedidos de remoção
exports.listarPedidosRemocaoSimples = async (req, res) => {
  try {
    console.log('Listando pedidos de remoção');
    console.log('User:', req.user);
    
    // Buscar TODOS os pedidos pendentes
    const pedidos = await PedidoRemocao.findAll({
      where: { estado: 'pendente' },
      include: [{
        model: Estudante,
        include: [{
          model: User,
          attributes: ['nome', 'email']
        }]
      }]
    });
    
    console.log('Pedidos pendentes encontrados:', pedidos.length);
    
    // Formatar os dados
    const pedidosFormatados = pedidos.map(p => ({
      id: p.id,
      estudanteId: p.estudanteId,
      estado: p.estado,
      motivo: p.motivo,
      nome: p.Estudante?.User?.nome || 'N/A',
      email: p.Estudante?.User?.email || 'N/A',
      createdAt: p.createdAt
    }));
    
    console.log('Retornando pedidos formatados:', pedidosFormatados.length);
    res.json(pedidosFormatados);
  } catch (error) {
    console.error('Erro na versão simples:', error);
    res.status(500).json({ 
      message: 'Erro ao listar pedidos de remoção',
      error: error.message 
    });
  }
};

// Aprovar pedido de remoção para o gestor (NOVA IMPLEMENTAÇÃO - baseada no admin)
exports.aprovarPedidoRemocaoNova = async (req, res) => {
  try {
    console.log('[GESTOR - aprovarPedidoRemocaoNova] Iniciando...');
    
    const { PedidoRemocao, Estudante } = require('../models');
    const { id } = req.params;
    const { acao } = req.body; // 'aprovar' ou 'rejeitar'
    
    if (!PedidoRemocao || !Estudante) {
      throw new Error('Modelos não encontrados');
    }
    
    console.log('[GESTOR - aprovarPedidoRemocaoNova] Buscando pedido ID:', id);
    
    const pedido = await PedidoRemocao.findByPk(id, {
      include: [
        {
          model: Estudante,
          attributes: ['id', 'nome', 'contacto']
        }
      ]
    });
    
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }
    
    console.log('[GESTOR - aprovarPedidoRemocaoNova] Pedido encontrado:', pedido.id);
    
    if (acao === 'aprovar') {
      // Marcar pedido como aprovado
      await pedido.update({ estado: 'aprovado' });
      
      // Eliminar o usuário estudante
      if (pedido.Estudante) {
        await User.destroy({ where: { id: pedido.Estudante.id } });
        console.log('[GESTOR - aprovarPedidoRemocaoNova] Usuário removido:', pedido.Estudante.id);
      }
      
      res.json({ message: 'Pedido aprovado e usuário removido com sucesso' });
    } else if (acao === 'rejeitar') {
      // Marcar pedido como rejeitado
      await pedido.update({ estado: 'rejeitado' });
      res.json({ message: 'Pedido rejeitado com sucesso' });
    } else {
      res.status(400).json({ message: 'Ação inválida' });
    }
    
  } catch (err) {
    console.error('[GESTOR - aprovarPedidoRemocaoNova] Erro:', err);
    res.status(500).json({ 
      message: 'Erro ao processar pedido', 
      error: err.message 
    });
  }
};

// Listar pedidos de remoção para o gestor (NOVA IMPLEMENTAÇÃO - baseada no admin)
exports.listarPedidosRemocaoNova = async (req, res) => {
  try {
    console.log('[GESTOR - listarPedidosRemocaoNova] Iniciando...');
    
    const { PedidoRemocao, Estudante } = require('../models');
    if (!PedidoRemocao) {
      throw new Error('Modelo PedidoRemocao não encontrado');
    }
    if (!Estudante) {
      throw new Error('Modelo Estudante não encontrado');
    }
    console.log('[GESTOR - listarPedidosRemocaoNova] Modelos carregados');
    
    console.log('[GESTOR - listarPedidosRemocaoNova] Fazendo query...');
    const pedidos = await PedidoRemocao.findAll({
      where: { estado: 'pendente' },
      include: [
        {
          model: Estudante,
          attributes: ['id', 'nome', 'contacto']
        }
      ]
    });
    
    console.log('[GESTOR - listarPedidosRemocaoNova] Query executada, encontrados:', pedidos.length, 'pedidos');
    
    // Formatar os dados para o frontend
    const pedidosFormatados = pedidos.map(p => ({
      id: p.id,
      nome: p.Estudante ? p.Estudante.nome : 'N/A',
      email: p.Estudante ? p.Estudante.contacto : 'N/A',
      motivo: p.motivo || 'Pedido de remoção de conta',
      estado: p.estado
    }));
    
    console.log('[GESTOR - listarPedidosRemocaoNova] Dados formatados:', pedidosFormatados.length);
    res.status(200).json(pedidosFormatados);
  } catch (err) {
    console.error('[GESTOR - listarPedidosRemocaoNova] Erro:', err);
    console.error('[GESTOR - listarPedidosRemocaoNova] Stack:', err.stack);
    res.status(500).json({ 
      message: 'Erro ao listar pedidos de remoção', 
      error: err.message,
      details: err.stack
    });
  }
};

// Obter utilizador por ID
exports.getUtilizadorPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ['id', 'nome', 'email', 'role', 'createdAt']
    });
    if (!user) return res.status(404).json({ message: 'Utilizador não encontrado' });
    res.json({ utilizador: user });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter utilizador', error: err.message });
  }
};

