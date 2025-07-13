import React from 'react';
import { Route } from 'react-router-dom';

// Imports dos componentes - Admin
import DashboardAdmin from '../pages/admin/DashboardAdmin';
import Utilizadores from '../pages/admin/Utilizadores';
import CriarUtilizador from '../pages/admin/CriarUtilizador';
import EditarUtilizador from '../pages/admin/EditarUtilizador';
import Empresas from '../pages/admin/Empresas';
import CriarEmpresa from '../pages/admin/CriarEmpresa';
import EditarEmpresa from '../pages/admin/EditarEmpresa';
import Gestores from '../pages/admin/Gestores';
import CriarGestor from '../pages/admin/CriarGestor';
import EditarGestor from '../pages/admin/EditarGestor';
import Propostas from '../pages/admin/Propostas';
import VerProposta from '../pages/admin/VerProposta';
import CriarProposta from '../pages/admin/CriarProposta';
import EditarProposta from '../pages/admin/EditarProposta';
import Departamentos from '../pages/admin/Departamentos';
import CriarDepartamento from '../pages/admin/CriarDepartamento';
import EditarDepartamento from '../pages/admin/EditarDepartamento';

// Imports dos componentes - Empresa
import DashboardEmpresa from '../pages/empresa/DashboardEmpresa';
import PropostasEmpresa from '../pages/empresa/Propostas';
import VerPropostaEmpresa from '../pages/empresa/VerProposta';
import CriarPropostaEmpresa from '../pages/empresa/CriarProposta';
import EditarPropostaEmpresa from '../pages/empresa/EditarProposta';
import PerfilEmpresa from '../pages/empresa/PerfilEmpresa';

// Imports dos componentes - Gestor
import DashboardGestor from '../pages/gestor/DashboardGestor';
import PropostasGestor from '../pages/gestor/PropostasGestor';
import CriarPropostaGestor from '../pages/gestor/CriarPropostaGestor';
import UtilizadoresGestor from '../pages/gestor/UtilizadoresGestor';
import CriarUtilizadorGestor from '../pages/gestor/CriarUtilizador';
import EmpresaGestor from '../pages/gestor/EmpresaGestor';
import CriarEmpresaGestor from '../pages/gestor/CriarEmpresaGestor';
import EditarUtilizadorGestor from '../pages/gestor/EditarUtilizador';
import EditarPropostaGestor from '../pages/gestor/EditarProposta';
import EditarEmpresaGestor from '../pages/gestor/EditarEmpresa';
import VerPropostaGestor from '../pages/gestor/VerPropostaGestor';

// Imports dos componentes - Utilizador
import DashboardUtilizador from '../pages/utilizador/DashboardUtilizador';
import PropostasCompativeis from '../pages/utilizador/PropostasCompativeis';
import Favoritos from '../pages/utilizador/Favoritos';
import PerfilUtilizador from '../pages/utilizador/PerfilUtilizador';
import VerPropostaUtilizador from '../pages/utilizador/VerProposta';

// Configuração das rotas por tipo de utilizador
export const routeConfig = {
  admin: [
    { path: 'dashboard', element: <DashboardAdmin />, index: true },
    { path: 'utilizadores', element: <Utilizadores /> },
    { path: 'criar-utilizador', element: <CriarUtilizador /> },
    { path: 'editar-utilizador/:id', element: <EditarUtilizador /> },
    { path: 'empresas', element: <Empresas /> },
    { path: 'criar-empresa', element: <CriarEmpresa /> },
    { path: 'editar-empresa/:id', element: <EditarEmpresa /> },
    { path: 'gestores', element: <Gestores /> },
    { path: 'criar-gestor', element: <CriarGestor /> },
    { path: 'editar-gestor/:id', element: <EditarGestor /> },
    { path: 'propostas', element: <Propostas /> },
    { path: 'ver-proposta/:id', element: <VerProposta /> },
    { path: 'criar-proposta', element: <CriarProposta /> },
    { path: 'editar-proposta/:id', element: <EditarProposta /> },
    { path: 'departamentos', element: <Departamentos /> },
    { path: 'criar-departamento', element: <CriarDepartamento /> },
    { path: 'editar-departamento/:id', element: <EditarDepartamento /> }
  ],
  empresa: [
    { path: 'dashboard', element: <DashboardEmpresa />, index: true },
    { path: 'propostas', element: <PropostasEmpresa /> },
    { path: 'proposta/:id', element: <VerPropostaEmpresa /> },
    { path: 'criar-proposta', element: <CriarPropostaEmpresa /> },
    { path: 'editar-proposta/:id', element: <EditarPropostaEmpresa /> },
    { path: 'perfil', element: <PerfilEmpresa /> }
  ],
  gestor: [
    { path: 'dashboard', element: <DashboardGestor />, index: true },
    { path: 'propostas', element: <PropostasGestor /> },
    { path: 'criar-proposta', element: <CriarPropostaGestor /> },
    { path: 'utilizadores', element: <UtilizadoresGestor /> },
    { path: 'criar-utilizador', element: <CriarUtilizadorGestor /> },
    { path: 'empresas', element: <EmpresaGestor /> },
    { path: 'criar-empresa', element: <CriarEmpresaGestor /> },
    { path: 'editar-utilizador/:id', element: <EditarUtilizadorGestor /> },
    { path: 'editar-proposta/:id', element: <EditarPropostaGestor /> },
    { path: 'editar-empresa/:id', element: <EditarEmpresaGestor /> },
    { path: 'ver-proposta/:id', element: <VerPropostaGestor /> }
  ],
  estudante: [
    { path: 'dashboard', element: <DashboardUtilizador />, index: true },
    { path: 'propostas-compativeis', element: <PropostasCompativeis /> },
    { path: 'favoritos', element: <Favoritos /> },
    { path: 'perfil', element: <PerfilUtilizador /> },
    { path: 'propostas/:id', element: <VerPropostaUtilizador /> }
  ]
};

// Função para gerar rotas automaticamente
export const generateRoutes = (userType) => {
  const routes = routeConfig[userType];
  if (!routes) return [];
  
  return routes.map((route, index) => (
    <Route 
      key={index} 
      path={route.path} 
      element={route.element}
      index={route.index}
    />
  ));
};

export default routeConfig;
