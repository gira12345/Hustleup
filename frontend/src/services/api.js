// API Service para HustleUp
const API_BASE = '/api';

// Função helper para fazer requests com token
const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(`${API_BASE}${url}`, config);
    
    // Se token inválido, fazer logout
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return null;
    }
    
    return response;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

// AUTENTICAÇÃO
export const authAPI = {
  // Login de utilizador
  login: async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    return response;
  },

  // Registo de novo utilizador  
  register: async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return response;
  },

  // Logout
  logout: async () => {
    const response = await apiRequest('/auth/logout', {
      method: 'POST'
    });
    
    // Limpar dados locais independentemente da resposta
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    return response;
  },

  // Verificar se utilizador está autenticado
  me: async () => {
    const response = await apiRequest('/auth/me');
    return response;
  }
};

// ADMIN API
export const adminAPI = {
  // Dashboard
  getDashboard: () => apiRequest('/admin/dashboard'),
  getKpis: () => apiRequest('/admin/kpis'),
  
  // Gestão de Utilizadores
  getUsers: () => apiRequest('/admin/users'),
  deleteUser: (id) => apiRequest(`/admin/users/${id}`, { method: 'DELETE' }),
  
  // Gestão de Empresas
  getEmpresas: () => apiRequest('/admin/empresas'),
  createEmpresa: (data) => apiRequest('/admin/empresas', { method: 'POST', body: JSON.stringify(data) }),
  updateEmpresa: (id, data) => apiRequest(`/admin/empresas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  validarEmpresa: (id) => apiRequest(`/admin/empresas/${id}/validar`, { method: 'PATCH' }),
  desativarEmpresa: (id) => apiRequest(`/admin/empresas/${id}/desativar`, { method: 'PATCH' }),
  deleteEmpresa: (id) => apiRequest(`/admin/empresas/${id}`, { method: 'DELETE' }),
  
  // Gestão de Estudantes
  getEstudantes: () => apiRequest('/admin/estudantes'),
  createEstudante: (data) => apiRequest('/admin/estudantes', { method: 'POST', body: JSON.stringify(data) }),
  updateEstudante: (id, data) => apiRequest(`/admin/estudantes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEstudante: (id) => apiRequest(`/admin/estudantes/${id}`, { method: 'DELETE' }),
  
  // Gestão de Gestores
  getGestores: () => apiRequest('/admin/gestores'),
  createGestor: (data) => apiRequest('/admin/gestores', { method: 'POST', body: JSON.stringify(data) }),
  updateGestor: (id, data) => apiRequest(`/admin/gestores/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGestor: (id) => apiRequest(`/admin/gestores/${id}`, { method: 'DELETE' }),
  
  // Gestão de Propostas
  getPropostas: () => apiRequest('/admin/propostas'),
  validarProposta: (id) => apiRequest(`/admin/propostas/${id}/validar`, { method: 'PATCH' }),
  deleteProposta: (id) => apiRequest(`/admin/propostas/${id}`, { method: 'DELETE' }),
  
  // Gestão de Departamentos
  getDepartamentos: () => apiRequest('/admin/departamentos'),
  createDepartamento: (data) => apiRequest('/admin/departamentos', { method: 'POST', body: JSON.stringify(data) }),
  updateDepartamento: (id, data) => apiRequest(`/admin/departamentos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteDepartamento: (id) => apiRequest(`/admin/departamentos/${id}`, { method: 'DELETE' })
};

// EMPRESA API
export const empresaAPI = {
  getPerfil: () => apiRequest('/empresa/perfil'),
  updatePerfil: (data) => apiRequest('/empresa/perfil', { method: 'PUT', body: JSON.stringify(data) }),
  getPropostas: () => apiRequest('/empresa/propostas'),
  getDashboard: () => apiRequest('/empresa/dashboard')
};

// ESTUDANTE API
export const estudanteAPI = {
  getPerfil: () => apiRequest('/estudante/perfil'),
  updatePerfil: (data) => apiRequest('/estudante/perfil', { method: 'PUT', body: JSON.stringify(data) }),
  getFavoritos: () => apiRequest('/estudante/favoritos'),
  addFavorito: (propostaId) => apiRequest('/estudante/favoritos', { 
    method: 'POST', 
    body: JSON.stringify({ propostaId }) 
  }),
  removeFavorito: (propostaId) => apiRequest(`/estudante/favoritos/${propostaId}`, { method: 'DELETE' }),
  getDashboard: () => apiRequest('/estudante/dashboard')
};

// GESTOR API  
export const gestorAPI = {
  getPropostas: () => apiRequest('/gestor/propostas'),
  validarProposta: (id) => apiRequest(`/gestor/propostas/${id}/validar`, { method: 'PUT' }),
  rejeitarProposta: (id, motivo) => apiRequest(`/gestor/propostas/${id}/rejeitar`, { 
    method: 'PUT', 
    body: JSON.stringify({ motivo }) 
  })
};

// PROPOSTAS API
export const propostasAPI = {
  getAll: () => apiRequest('/propostas'),
  getPublicas: () => apiRequest('/propostas/publicas'),
  getById: (id) => apiRequest(`/propostas/${id}`),
  create: (data) => apiRequest('/propostas', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/propostas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/propostas/${id}`, { method: 'DELETE' })
};

// CANDIDATURAS API
export const candidaturasAPI = {
  // Para estudantes
  criar: (propostaId, carta_motivacao, cvFile = null) => {
    const formData = new FormData();
    formData.append('propostaId', propostaId);
    formData.append('carta_motivacao', carta_motivacao);
    if (cvFile) formData.append('cv', cvFile);
    
    return apiRequest('/candidaturas/criar', {
      method: 'POST',
      body: formData,
      headers: {} // Remove Content-Type para FormData
    });
  },
  
  listarEstudante: () => apiRequest('/candidaturas/estudante'),
  
  // Para empresas
  listarEmpresa: () => apiRequest('/candidaturas/empresa'),
  responder: (id, estado, notas = '') => apiRequest(`/candidaturas/${id}/responder`, {
    method: 'PUT',
    body: JSON.stringify({ estado, notas })
  }),
  estatisticasEmpresa: () => apiRequest('/candidaturas/empresa/estatisticas')
};

// UTILITÁRIOS API
export const utilsAPI = {
  healthCheck: () => apiRequest('/health'),
  getDepartamentos: () => apiRequest('/departamentos'),
  upload: (formData) => apiRequest('/upload', { 
    method: 'POST', 
    body: formData,
    headers: {} // Remove Content-Type para FormData
  })
};

// Export principal
const api = {
  auth: authAPI,
  admin: adminAPI,
  empresa: empresaAPI,
  estudante: estudanteAPI,
  gestor: gestorAPI,
  propostas: propostasAPI,
  candidaturas: candidaturasAPI,
  utils: utilsAPI
};

export default api;