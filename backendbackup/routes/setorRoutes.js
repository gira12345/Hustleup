const express = require('express');
const router = express.Router();
const db = require('../models');
const Setor = db.Setor;

// GET /api/setores - retorna todos os setores/departamentos
router.get('/', async (req, res) => {
  try {
    const setores = await Setor.findAll();
    res.json(setores);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar setores', details: err.message });
  }
});

module.exports = router;
