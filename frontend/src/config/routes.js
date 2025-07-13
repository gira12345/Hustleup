// Configuração centralizada das rotas da aplicação
export const routes = {
  // Rotas públicas
  public: {
    login: '/login',
    register: '/registar',
    home: '/'
  },
  
  // Rotas do Admin
  admin: {
    base: '/admin',
    dashboard: '/admin/dashboard',
    users: '/admin/utilizadores',
    createUser: '/admin/criar-utilizador',
    editUser: '/admin/editar-utilizador/:id',
    companies: '/admin/empresas',
    createCompany: '/admin/criar-empresa',
    editCompany: '/admin/editar-empresa/:id',
    managers: '/admin/gestores',
    createManager: '/admin/criar-gestor',
    editManager: '/admin/editar-gestor/:id',
    proposals: '/admin/propostas',
    viewProposal: '/admin/ver-proposta/:id',
    createProposal: '/admin/criar-proposta',
    editProposal: '/admin/editar-proposta/:id',
    departments: '/admin/departamentos',
    createDepartment: '/admin/criar-departamento',
    editDepartment: '/admin/editar-departamento/:id'
  },
  
  // Rotas da Empresa
  company: {
    base: '/empresa',
    dashboard: '/empresa/dashboard',
    proposals: '/empresa/propostas',
    viewProposal: '/empresa/proposta/:id',
    createProposal: '/empresa/criar-proposta',
    editProposal: '/empresa/editar-proposta/:id',
    profile: '/empresa/perfil'
  },
  
  // Rotas do Gestor
  manager: {
    base: '/gestor',
    dashboard: '/gestor/dashboard',
    proposals: '/gestor/propostas',
    createProposal: '/gestor/criar-proposta',
    users: '/gestor/utilizadores',
    createUser: '/gestor/criar-utilizador',
    companies: '/gestor/empresas',
    createCompany: '/gestor/criar-empresa',
    editUser: '/gestor/editar-utilizador/:id',
    editProposal: '/gestor/editar-proposta/:id',
    editCompany: '/gestor/editar-empresa/:id',
    viewProposal: '/gestor/ver-proposta/:id'
  },
  
  // Rotas do Utilizador/Estudante
  user: {
    base: '/utilizador',
    dashboard: '/utilizador/dashboard',
    compatibleProposals: '/utilizador/propostas-compativeis',
    favorites: '/utilizador/favoritos',
    profile: '/utilizador/perfil',
    viewProposal: '/utilizador/propostas/:id'
  }
};

// Função para gerar URL com parâmetros
export const generateRoute = (route, params = {}) => {
  let url = route;
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  return url;
};

// Função para obter todas as rotas protegidas por tipo de utilizador
export const getProtectedRoutes = (userType) => {
  switch(userType) {
    case 'admin':
      return routes.admin;
    case 'empresa':
      return routes.company;
    case 'gestor':
      return routes.manager;
    case 'estudante':
      return routes.user;
    default:
      return {};
  }
};

export default routes;
