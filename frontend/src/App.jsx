import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Registar from './pages/Registar';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import Utilizadores from './pages/admin/Utilizadores';
import CriarUtilizador from './pages/admin/CriarUtilizador';
import CriarUtilizadorGestor from './pages/gestor/CriarUtilizador';
import EditarUtilizador from './pages/admin/EditarUtilizador';
import Empresas from './pages/admin/Empresas';
import CriarEmpresa from './pages/admin/CriarEmpresa';
import EditarEmpresa from './pages/admin/EditarEmpresa';
import Gestores from './pages/admin/Gestores';
import CriarGestor from './pages/admin/CriarGestor';
import EditarGestor from './pages/admin/EditarGestor';
import Propostas from './pages/admin/Propostas';
import VerProposta from './pages/admin/VerProposta';
import Departamentos from './pages/admin/Departamentos';
import CriarDepartamento from './pages/admin/CriarDepartamento';
import EditarDepartamento from './pages/admin/EditarDepartamento';
import DashboardEmpresa from './pages/empresa/DashboardEmpresa';
import PropostasEmpresa from './pages/empresa/Propostas';
import PerfilEmpresa from './pages/empresa/PerfilEmpresa';
import VerPropostaEmpresa from './pages/empresa/VerProposta';
import CriarPropostaEmpresa from './pages/empresa/CriarProposta';
import EditarPropostaEmpresa from './pages/empresa/EditarProposta';
import LayoutEmpresa from './pages/empresa/LayoutEmpresa';
import DashboardUtilizador from './pages/utilizador/DashboardUtilizador';
import AdminLayout from './pages/admin/AdminLayout';
import CriarProposta from './pages/admin/CriarProposta';
import EditarProposta from './pages/admin/EditarProposta';
import GestorLayout from './pages/gestor/GestorLayout';
import DashboardGestor from './pages/gestor/DashboardGestor';
import PropostasGestor from './pages/gestor/PropostasGestor';
import UtilizadoresGestor from './pages/gestor/UtilizadoresGestor';
import EmpresaGestor from './pages/gestor/EmpresaGestor';
import CriarPropostaGestor from './pages/gestor/CriarPropostaGestor';
import CriarEmpresaGestor from './pages/gestor/CriarEmpresaGestor';
import EditarUtilizadorGestor from './pages/gestor/EditarUtilizador.jsx';
import EditarPropostaGestor from './pages/gestor/EditarProposta.jsx';
import EditarEmpresaGestor from './pages/gestor/EditarEmpresa.jsx';
import VerPropostaGestor from './pages/gestor/VerPropostaGestor';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserLayout from './pages/utilizador/UserLayout';
import PropostasCompativeis from './pages/utilizador/PropostasCompativeis';
import Favoritos from './pages/utilizador/Favoritos';
import PerfilUtilizador from './pages/utilizador/PerfilUtilizador';
import VerPropostaUtilizador from './pages/utilizador/VerProposta';

// Componente para rotas protegidas
const ProtectedRoute = ({ children, allowedTypes }) => {
  const token = localStorage.getItem('token');
  let userType = localStorage.getItem('tipo');
  
  // Verificar se token existe
  if (!token) {
    console.log('ProtectedRoute - No token found');
    return <Navigate to="/login" replace />;
  }

  // Verificar se token é válido (básico - não vazio e tem formato)
  if (token.length < 10 || !token.includes('.')) {
    console.log('ProtectedRoute - Invalid token format');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tipo');
    return <Navigate to="/login" replace />;
  }
  
  // Forçar role para minúsculas para evitar problemas de case
  if (userType) userType = userType.toLowerCase();
  
  // Fallback: se não tiver 'tipo', tentar obter do 'user'
  if (!userType) {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        userType = parsedUser.role ? parsedUser.role.toLowerCase() : undefined;
        // Salvar userType para próxima vez
        if (userType) {
          localStorage.setItem('tipo', userType);
        }
      } catch (e) {
        console.error('Erro ao parsear user do localStorage:', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tipo');
        return <Navigate to="/login" replace />;
      }
    }
  }

  console.log('ProtectedRoute - Token:', !!token, 'UserType:', userType, 'AllowedTypes:', allowedTypes);

  // Verificar se o tipo de usuário é permitido
  if (allowedTypes && allowedTypes.length > 0 && !allowedTypes.includes(userType)) {
    console.log('Acesso negado - Tipo não permitido. UserType:', userType, 'AllowedTypes:', allowedTypes);
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rota de login */}
          <Route path="/login" element={<Login />} />
          
          {/* Rota de registo */}
          <Route path="/registar" element={<Registar />} />
          
          {/* Rotas protegidas do Admin com Layout */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedTypes={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Rotas aninhadas dentro do AdminLayout */}
            <Route index element={<DashboardAdmin />} />
            <Route path="dashboard" element={<DashboardAdmin />} />
            <Route path="utilizadores" element={<Utilizadores />} />
            <Route path="criar-utilizador" element={<CriarUtilizador />} />
            <Route path="editar-utilizador/:id" element={<EditarUtilizador />} />
            <Route path="empresas" element={<Empresas />} />
            <Route path="criar-empresa" element={<CriarEmpresa />} />
            <Route path="editar-empresa/:id" element={<EditarEmpresa />} />
            {/* ROTAS DE GESTORES */}
            <Route path="gestores" element={<Gestores />} />
            <Route path="criar-gestor" element={<CriarGestor />} />
            <Route path="editar-gestor/:id" element={<EditarGestor />} />
            {/* FIM ROTAS DE GESTORES */}
            <Route path="propostas" element={<Propostas />} />
            <Route path="ver-proposta/:id" element={<VerProposta />} />
            <Route path="criar-proposta" element={<CriarProposta />} />
            <Route path="editar-proposta/:id" element={<EditarProposta />} />
            <Route path="departamentos" element={<Departamentos />} />
            <Route path="criar-departamento" element={<CriarDepartamento />} />
            <Route path="editar-departamento/:id" element={<EditarDepartamento />} />
          </Route>
          
          <Route 
            path="/empresa/*" 
            element={
              <ProtectedRoute allowedTypes={['empresa']}>
                <LayoutEmpresa />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardEmpresa />} />
            <Route path="dashboard" element={<DashboardEmpresa />} />
            <Route path="propostas" element={<PropostasEmpresa />} />
            <Route path="proposta/:id" element={<VerPropostaEmpresa />} />
            <Route path="criar-proposta" element={<CriarPropostaEmpresa />} />
            <Route path="editar-proposta/:id" element={<EditarPropostaEmpresa />} />
            <Route path="perfil" element={<PerfilEmpresa />} />
          </Route>
          
          <Route 
            path="/utilizador/*" 
            element={
              <ProtectedRoute allowedTypes={['estudante']}>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardUtilizador />} />
            <Route path="dashboard" element={<DashboardUtilizador />} />
            <Route path="propostas-compativeis" element={<PropostasCompativeis />} />
            <Route path="favoritos" element={<Favoritos />} />
            <Route path="perfil" element={<PerfilUtilizador />} />
            <Route path="propostas/:id" element={<VerPropostaUtilizador />} />
          </Route>
          
          <Route 
            path="/gestor/*" 
            element={
              <ProtectedRoute allowedTypes={['gestor']}>
                <GestorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardGestor />} />
            <Route path="dashboard" element={<DashboardGestor />} />
            <Route path="propostas" element={<PropostasGestor />} />
            <Route path="criar-proposta" element={<CriarPropostaGestor />} />
            <Route path="utilizadores" element={<UtilizadoresGestor />} />
            <Route path="criar-utilizador" element={<CriarUtilizadorGestor />} />
            <Route path="empresas" element={<EmpresaGestor />} />
            <Route path="criar-empresa" element={<CriarEmpresaGestor />} />
            <Route path="editar-utilizador/:id" element={<EditarUtilizadorGestor />} />
            <Route path="editar-proposta/:id" element={<EditarPropostaGestor />} />
            <Route path="editar-empresa/:id" element={<EditarEmpresaGestor />} />
            <Route path="ver-proposta/:id" element={<VerPropostaGestor />} />
          </Route>
          
          {/* Rota por defeito - redireciona para login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Rota para caminhos não encontrados */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;