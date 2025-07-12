const { Op } = require('sequelize');
const { Candidatura, Estudante, Proposta, Empresa } = require('../models');

// Criar candidatura
exports.criarCandidatura = async (req, res) => {
  try {
    const { propostaId, carta_motivacao } = req.body;
    const estudanteId = req.user.estudanteId;

    // Verificar se já existe candidatura para esta proposta
    const candidaturaExistente = await Candidatura.findOne({
      where: { estudanteId, propostaId }
    });

    if (candidaturaExistente) {
      return res.status(400).json({ message: 'Já candidataste-te a esta proposta' });
    }

    // Verificar se a proposta existe e está ativa
    const proposta = await Proposta.findOne({
      where: { id: propostaId, estado: { [Op.in]: ['ativa', 'ativo'] } }
    });

    if (!proposta) {
      return res.status(404).json({ message: 'Proposta não encontrada ou não está ativa' });
    }

    const candidatura = await Candidatura.create({
      estudanteId,
      propostaId,
      carta_motivacao,
      cv_url: req.file ? `uploads/${req.file.filename}` : null
    });

    res.status(201).json({
      message: 'Candidatura criada com sucesso',
      candidatura
    });

  } catch (error) {
    console.error('Erro ao criar candidatura:', error);
    res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
};

// Listar candidaturas do estudante
exports.listarCandidaturasEstudante = async (req, res) => {
  try {
    const estudanteId = req.user.estudanteId;

    const candidaturas = await Candidatura.findAll({
      where: { estudanteId },
      include: [{
        model: Proposta,
        include: [{
          model: Empresa,
          attributes: ['nome', 'logo']
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(candidaturas);

  } catch (error) {
    console.error('Erro ao listar candidaturas:', error);
    res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
};

// Listar candidaturas para as propostas da empresa
exports.listarCandidaturasEmpresa = async (req, res) => {
  try {
    const empresaId = req.user.empresaId;

    const candidaturas = await Candidatura.findAll({
      include: [{
        model: Proposta,
        where: { empresaId },
        include: [{
          model: Empresa,
          attributes: ['nome']
        }]
      }, {
        model: Estudante,
        attributes: ['nome', 'email', 'curso', 'ano_letivo']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(candidaturas);

  } catch (error) {
    console.error('Erro ao listar candidaturas da empresa:', error);
    res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
};

// Responder a candidatura (aceitar/rejeitar)
exports.responderCandidatura = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, notas } = req.body;
    const empresaId = req.user.empresaId;

    const candidatura = await Candidatura.findOne({
      where: { id },
      include: [{
        model: Proposta,
        where: { empresaId }
      }]
    });

    if (!candidatura) {
      return res.status(404).json({ message: 'Candidatura não encontrada' });
    }

    candidatura.estado = estado;
    candidatura.notas = notas;
    candidatura.data_resposta = new Date();

    await candidatura.save();

    res.json({
      message: 'Candidatura atualizada com sucesso',
      candidatura
    });

  } catch (error) {
    console.error('Erro ao responder candidatura:', error);
    res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
};

// Estatísticas de candidaturas para empresa
exports.estatisticasCandidaturas = async (req, res) => {
  try {
    const empresaId = req.user.empresaId;

    // Buscar todas as candidaturas da empresa
    const candidaturas = await Candidatura.findAll({
      include: [{
        model: Proposta,
        where: { empresaId },
        attributes: ['id', 'titulo']
      }],
      attributes: ['id', 'estado', 'createdAt', 'data_resposta']
    });

    const total = candidaturas.length;
    const pendentes = candidaturas.filter(c => c.estado === 'pendente').length;
    const aceites = candidaturas.filter(c => c.estado === 'aceite').length;
    const rejeitadas = candidaturas.filter(c => c.estado === 'rejeitada').length;

    // Calcular candidatos dos últimos 30 dias
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
    const novos = candidaturas.filter(c => new Date(c.createdAt) > trintaDiasAtras).length;

    // Calcular taxa de aceitação
    const taxaAceitacao = total > 0 ? ((aceites / total) * 100).toFixed(1) : 0;

    // Calcular tempo médio de resposta
    const candidaturasRespondidas = candidaturas.filter(c => c.data_resposta);
    let tempoMedioResposta = '0 dias';
    
    if (candidaturasRespondidas.length > 0) {
      const tempoTotal = candidaturasRespondidas.reduce((acc, c) => {
        const diferenca = new Date(c.data_resposta) - new Date(c.createdAt);
        return acc + diferenca;
      }, 0);
      
      const mediaMilissegundos = tempoTotal / candidaturasRespondidas.length;
      const mediaDias = Math.round(mediaMilissegundos / (1000 * 60 * 60 * 24));
      tempoMedioResposta = `${mediaDias} dias`;
    }

    res.json({
      total,
      pendentes,
      aceites,
      rejeitadas,
      novos,
      taxaAceitacao: parseFloat(taxaAceitacao),
      tempoMedioResposta
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
};

module.exports = exports;

