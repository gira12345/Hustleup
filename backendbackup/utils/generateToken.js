const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  let secret = process.env.JWT_SECRET;
  
  if (!secret) {
    secret = 'your_super_secret_jwt_key_here_change_in_production';
    process.env.JWT_SECRET = secret;
  }
  
  console.log('JWT_SECRET exists:', !!secret);
  console.log('JWT_SECRET length:', secret ? secret.length : 0);
  
  if (!secret) {
    console.error('Erro crítico: JWT_SECRET não disponível!');
    throw new Error('JWT_SECRET não configurado');
  }
  
  console.log('Gerando token JWT para utilizador:', user.id);
  
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      ...(user.empresaId && { empresaId: user.empresaId })
    },
    secret,
    {
      expiresIn: '7d'
    }
  );
};

module.exports = generateToken;
