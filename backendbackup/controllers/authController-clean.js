const bcrypt = require('bcrypt');
const { User, Empresa, Estudante } = require('../models');
const generateToken = require('../utils/generateToken');

// LOGIN SIMPLIFICADO
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  console.log(' LOGIN REQUEST:', { email, passwordLength: password?.length });

  try {
    // Validação
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e password são obrigatórios' });
    }

    // Buscar utilizador
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Verificar password
    const passwordCorreta = await bcrypt.compare(password, user.password);
    
    if (!passwordCorreta) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    console.log(' Login autorizado:', email, 'Role:', user.role);

    // Para empresas, incluir empresaId
    if (user.role === 'empresa') {
      const empresa = await Empresa.findOne({ where: { userId: user.id } });
      
      if (!empresa) {
        return res.status(400).json({ message: 'Empresa não encontrada' });
      }
      
      const token = generateToken({ id: user.id, role: user.role, empresaId: empresa.id });
      
      return res.json({ 
        token, 
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          role: user.role,
          empresaId: empresa.id
        }
      });
    }

    // Login normal
    const token = generateToken({ id: user.id, role: user.role });
    
    return res.json({
      token, 
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (err) {
    console.error('❌ ERRO LOGIN:', err.message);
    return res.status(500).json({ 
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = exports;

