const bcrypt = require('bcrypt');
const { User, Empresa, Estudante } = require('../models');
const generateToken = require('../utils/generateToken');

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('🔍 [LOGIN] Tentativa de login:', email);
    
    // Validação
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e password são obrigatórios' });
    }

    // ADMIN HARDCODED - Para deploy inicial
    if (email === 'admin@hustleup.com' && password === 'admin123') {
      const token = generateToken({ id: 999, role: 'admin' });
      
      return res.json({ 
        token, 
        user: {
          id: 999,
          nome: 'Admin',
          email: 'admin@hustleup.com',
          role: 'admin'
        }
      });
    }

    // Buscar utilizador
    const user = await User.findOne({ where: { email } });
    console.log('🔍 [LOGIN] Utilizador encontrado:', user ? user.email : 'Não encontrado');
    
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Verificar password
    console.log('🔍 [LOGIN] Verificando password...');
    const passwordCorreta = await bcrypt.compare(password, user.password);
    console.log('🔍 [LOGIN] Password correta:', passwordCorreta);
    
    if (!passwordCorreta) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    console.log('✅ [LOGIN] Login bem-sucedido para:', user.email, 'Role:', user.role);

    // Para empresas, incluir empresaId
    if (user.role === 'empresa') {
      console.log('🏢 [LOGIN] Processando login de empresa:', user.email);
      let empresa = await Empresa.findOne({ where: { userId: user.id } });
      
      // Se não encontrar empresa por userId, tentar por email
      if (!empresa) {
        console.log('⚠️ [LOGIN] Empresa não encontrada por userId, tentando por email...');
        empresa = await Empresa.findOne({ where: { contacto: user.email } });
        
        // Se encontrar por email, atualizar com userId
        if (empresa) {
          console.log('📋 [LOGIN] Empresa encontrada por email:', empresa.nome, 'validado:', empresa.validado);
          empresa.userId = user.id;
          empresa.validado = true;
          if (!empresa.descricao) empresa.descricao = '';
          await empresa.save();
          console.log('✅ [LOGIN] Empresa corrigida:', empresa.nome);
        }
      } else {
        console.log('📋 [LOGIN] Empresa encontrada por userId:', empresa.nome, 'validado:', empresa.validado);
      }
      
      // Se ainda não existe, criar registo na tabela Empresa
      if (!empresa) {
        console.log('⚠️ [LOGIN] Criando registo de empresa...');
        empresa = await Empresa.create({
          userId: user.id,
          nome: user.nome,
          descricao: '',
          contacto: user.email,
          validado: true,
          localizacao: '',
          morada: ''
        });
        console.log('✅ [LOGIN] Empresa criada:', empresa.nome);
      }
      
      // Verificar se a empresa está validada
      if (!empresa.validado) {
        console.log('❌ [LOGIN] Empresa não validada:', empresa.nome, 'validado:', empresa.validado);
        return res.status(403).json({ 
          message: 'Empresa ainda não foi validada pelo administrador' 
        });
      }
      
      console.log('✅ [LOGIN] Empresa validada, gerando token:', empresa.nome);
      
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

    // Login normal (admin, estudante, gestor)
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
    console.error('Erro no login:', err);
    return res.status(500).json({ 
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// REGISTO (Empresa fica pendente de validação)
exports.registarEmpresa = async (req, res) => {
  const { nome, email, password, descricao, contacto } = req.body;

  if (!nome || nome.trim() === '') {
    return res.status(400).json({ message: 'O nome da empresa é obrigatório.' });
  }

  if (!email || email.trim() === '') {
    return res.status(400).json({ message: 'O email é obrigatório.' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'A password deve ter pelo menos 6 caracteres.' });
  }

  try {
    // Verificar se email já existe
    const userExistente = await User.findOne({ where: { email } });
    if (userExistente) {
      return res.status(400).json({ message: 'Este email já está registado.' });
    }

    // Criar utilizador (password será hashada automaticamente pelo modelo)
    const novoUser = await User.create({
      nome,
      email,
      password: password, // Será hashada pelo hook beforeCreate
      role: 'empresa'
    });

    // Criar entrada na tabela Empresa (validado = false por defeito)
    await Empresa.create({
      nome,
      userId: novoUser.id,
      descricao: descricao || '',
      contacto: contacto || '',
      validado: false
    });

    res.status(201).json({ 
      message: 'Empresa registada com sucesso! Aguarda validação pelo administrador.' 
    });

  } catch (err) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Verificar se o token ainda é válido
exports.verificarToken = (req, res) => {
  res.status(200).json({ message: 'Token válido!' });
};

// Ver dados do utilizador logado
exports.utilizadorAtual = (req, res) => {
  res.status(200).json({ user: req.user });
};

