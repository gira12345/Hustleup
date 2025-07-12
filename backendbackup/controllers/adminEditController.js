// Adiciona endpoints de edição de estudante e empresa para o admin
const bcrypt = require('bcrypt');
const { User, Empresa } = require('../models');

// Editar estudante (admin)
exports.editarEstudante = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, password } = req.body;
    const user = await User.findByPk(id);
    if (!user || user.role !== 'estudante') {
      return res.status(404).json({ message: 'Utilizador não encontrado.' });
    }
    if (nome) user.nome = nome;
    if (email) user.email = email;
    if (password) user.password = password; // hash será feito pelo hook
    await user.save();
    res.status(200).json({ message: 'Utilizador atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao editar utilizador', error: err.message });
  }
};

// Editar empresa (admin)
exports.editarEmpresa = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, contacto, localizacao, departamento, contracto, morada, email, password } = req.body;
    const empresa = await Empresa.findByPk(id);
    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada.' });
    }
    if (nome) empresa.nome = nome;
    if (descricao) empresa.descricao = descricao;
    if (contacto) empresa.contacto = contacto;
    if (localizacao) empresa.localizacao = localizacao;
    if (departamento) empresa.departamento = departamento;
    if (contracto) empresa.contracto = contracto;
    if (morada) empresa.morada = morada;
    await empresa.save();
    // Atualizar email/password do user associado
    if (email || password) {
      const user = await User.findByPk(empresa.userId);
      if (user) {
        if (email) user.email = email;
        if (password) user.password = password;
        await user.save();
      }
    }
    res.status(200).json({ message: 'Empresa atualizada com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao editar empresa', error: err.message });
  }
};

