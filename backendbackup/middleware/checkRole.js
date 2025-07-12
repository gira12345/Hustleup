module.exports = (...rolesPermitidos) => {
  return (req, res, next) => {
    console.log('\nVerificando role...');
    console.log('User do token:', req.user);
    console.log('Roles permitidos:', rolesPermitidos);
    
    if (!req.user) {
      console.log('req.user não existe - token inválido');
      return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
    
    if (!rolesPermitidos.includes(req.user.role)) {
      console.log('Role não autorizado:', req.user.role);
      return res.status(403).json({ 
        message: 'Acesso negado. Role necessário: ' + rolesPermitidos.join(' ou ') 
      });
    }
    
    console.log('Acesso permitido para role:', req.user.role);
    next();
  };
};
