import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  Home,
  Building2,
  Users2,
  BriefcaseBusiness,
  UserCog,
  FileText
} from "lucide-react";

const navItems = [
  { to: "/admin/dashboard", icon: <Home size={18} />, label: "Dashboard" },
  { to: "/admin/departamentos", icon: <Building2 size={18} />, label: "Departamentos" },
  { to: "/admin/utilizadores", icon: <Users2 size={18} />, label: "Utilizadores" },
  { to: "/admin/empresas", icon: <BriefcaseBusiness size={18} />, label: "Empresas" },
  { to: "/admin/gestores", icon: <UserCog size={18} />, label: "Gestores" },
  { to: "/admin/propostas", icon: <FileText size={18} />, label: "Propostas" }
];

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside 
        className="w-64 text-white flex flex-col justify-between shadow-md"
        style={{ backgroundColor: '#0f1e36' }}
      >
        <div>
          {/* LOGO */}
          <div 
            className="flex flex-col items-center py-6 px-4"
            style={{ borderBottom: '1px solid #374151' }}
          >
            <img src="/hustleup-logo.png" alt="HustleUp Logo" className="w-32 h-32 object-contain mb-2 mt-4" style={{ maxWidth: '128px', maxHeight: '128px' }} />
            <span className="text-sm" style={{ color: '#d1d5db' }}>Administrador</span>
          </div>

          {/* Menu */}
          <nav className="mt-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all 
                  ${isActive ? "bg-white rounded-l-full font-semibold" : ""}`
                }
                style={({ isActive }) => ({
                  color: isActive ? '#0f1e36' : 'rgba(255,255,255,0.8)',
                  backgroundColor: isActive ? 'white' : 'transparent'
                })}
                onMouseEnter={(e) => {
                  if (!e.target.classList.contains('bg-white')) {
                    e.target.style.backgroundColor = '#1c2d50';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.target.classList.contains('bg-white')) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer */}
       
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="mx-auto w-full max-w-[1200px] px-4 pt-40">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
