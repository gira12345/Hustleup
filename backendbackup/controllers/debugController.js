// Endpoint temporário para debug
const { User, Empresa } = require('../models');
const bcrypt = require('bcrypt');

exports.debugLogin = async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log('🔍 [DEBUG] Procurando utilizador:', email);
    
    // Buscar utilizador
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.json({
        found: false,
        message: 'Utilizador não encontrado',
        email: email
      });
    }
    
    console.log('✅ [DEBUG] Utilizador encontrado:', user.email);
    
    // Se for empresa, buscar dados da empresa
    if (user.role === 'empresa') {
      const empresa = await Empresa.findOne({ where: { userId: user.id } });
      
      return res.json({
        found: true,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          role: user.role,
          password: user.password.substring(0, 20) + '...'
        },
        empresa: empresa ? {
          id: empresa.id,
          nome: empresa.nome,
          validado: empresa.validado,
          userId: empresa.userId
        } : null
      });
    }
    
    return res.json({
      found: true,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        password: user.password.substring(0, 20) + '...'
      }
    });
    
  } catch (error) {
    console.error('❌ [DEBUG] Erro:', error);
    return res.status(500).json({
      error: error.message
    });
  }
};

exports.corrigirHashDuplo = async (req, res) => {
  try {
    console.log('🔧 [CORRIGIR] Procurando users com hash duplo...');
    
    const users = await User.findAll({
      where: { role: 'empresa' }
    });
    
    let corrigidos = 0;
    
    for (const user of users) {
      try {
        // Tentar fazer login com password comum
        const passwordsComuns = ['password123', '123456', user.nome, user.email];
        
        for (const password of passwordsComuns) {
          const match = await bcrypt.compare(password, user.password);
          if (match) {
            console.log(`✅ [CORRIGIR] Password encontrada para ${user.email}: ${password}`);
            continue;
          }
        }
        
        // Se a password parece ter hash duplo (muito longa), tentar corrigir
        if (user.password.length > 70) {
          console.log(`⚠️ [CORRIGIR] Possível hash duplo detectado para ${user.email}`);
          // Aqui poderíamos tentar corrigir, mas é perigoso sem saber a password original
        }
        
      } catch (error) {
        console.error(`❌ [CORRIGIR] Erro ao verificar ${user.email}:`, error.message);
      }
    }
    
    res.json({
      message: `Verificação concluída. ${corrigidos} utilizadores corrigidos.`,
      totalUsers: users.length
    });
    
  } catch (error) {
    console.error('❌ [CORRIGIR] Erro:', error);
    res.status(500).json({ error: error.message });
  }
};
