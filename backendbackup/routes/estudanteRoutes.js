const express = require('express');
const router = express.Router();

const estudanteController = require('../controllers/estudanteController');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');
const upload = require('../middleware/upload');

router.use(verifyToken);
router.use(checkRole('estudante'));

// Dashboard com estatísticas
router.get('/dashboard', estudanteController.dashboard);

// Ver e editar perfil
router.get('/perfil', estudanteController.getPerfil);
router.patch('/perfil', upload.single('foto'), estudanteController.editarPerfil);

// Ver propostas compatíveis com os seus setores
router.get('/propostas/compativeis', estudanteController.getPropostasMatch);

// Endpoint de teste para debug
router.get('/debug/competencias', async (req, res) => {
  try {
    const { Estudante, Proposta, Empresa } = require('../models');
    
    const estudante = await Estudante.findOne({
      where: { userId: req.user.id }
    });
    
    if (!estudante) {
      return res.status(404).json({ message: 'Estudante não encontrado' });
    }
    
    const propostas = await Proposta.findAll({
      where: { 
        estado: ['ativo', 'ativa', 'aprovada', 'validada']
      },
      include: [
        {
          model: Empresa,
          attributes: ['nome', 'contacto']
        }
      ]
    });
    
    res.json({
      estudante: {
        nome: estudante.nome,
        competencias: estudante.competencias,
        competenciasArray: estudante.competencias ? estudante.competencias.split(',').map(c => c.trim()) : []
      },
      propostas: propostas.map(p => ({
        nome: p.nome,
        empresa: p.Empresa?.nome,
        areas: p.areas,
        estado: p.estado
      }))
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ver todas as propostas (exploração)
router.get('/propostas', estudanteController.getTodasPropostas);

// Pedir remoção da plataforma
router.post('/remover', estudanteController.pedirRemocao);

// Favoritar propostas
router.post('/favoritos/:propostaId', estudanteController.adicionarFavorito);
router.delete('/favoritos/:propostaId', estudanteController.removerFavorito);
router.get('/favoritos', estudanteController.listarFavoritos);

module.exports = router;
