// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ tipo }) => {
  const location = useLocation();

  // Menus para cada tipo de utilizador
  const menus = {
    admin: [
      { path: '/admin', label: 'Dashboard', icon: '▣' },
      { path: '/admin/departamentos', label: 'Departamentos', icon: '🏢' },
      { path: '/admin/utilizadores', label: 'Utilizadores', icon: '👨‍🎓' },
      { path: '/admin/empresas', label: 'Empresas', icon: '🏬' },
      { path: '/admin/gestores', label: 'Gestores', icon: '👨‍💼' },
      { path: '/admin/propostas', label: 'Propostas', icon: '📋' },
      { path: '/admin/submissoes', label: 'Submissões', icon: '📤' },
      { path: '/admin/estados-propostas', label: 'Estados das Propostas', icon: '📈' }
    ],
    utilizador: [
      { path: '/user/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/user/favoritos', label: 'Favoritos', icon: '❤️' },
      { path: '/user/propostas', label: 'Propostas', icon: '📋' }
    ],
    gestor: [
      { path: '/gestor/dashboard', label: 'Dashboard', icon: '🗂️' },
      { path: '/gestor/departamentos', label: 'Departamentos', icon: '🏢' },
      { path: '/gestor/propostas', label: 'Propostas', icon: '📋' }
    ]
  };

  const links = menus[tipo] || menus.admin;

  return (
    <div
      className="bg-dark text-white d-flex flex-column p-3"
      style={{ width: '250px', minHeight: '100vh' }}
    >
      <div className="text-center mb-4">
        <h4 className="mb-2">
          {tipo === 'admin' ? '⚙ Admin Panel' : tipo === 'gestor' ? '□ Gestor Panel' : '◊ Utilizador'}
        </h4>
        <hr className="text-white-50" />
      </div>
      
      <nav className="flex-grow-1">
        {links.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className={`d-flex align-items-center mb-2 p-2 text-white text-decoration-none rounded sidebar-link ${
              location.pathname === link.path 
                ? 'bg-primary fw-bold' 
                : 'hover-bg-secondary'
            }`}
            style={{
              fontSize: '0.9rem'
            }}
          >
            <span className="me-2" style={{ fontSize: '1.1rem' }}>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto pt-3 border-top border-secondary">
        <small className="text-muted">HustleUp v1.0</small>
      </div>
    </div>
  );
};

export default Sidebar;
