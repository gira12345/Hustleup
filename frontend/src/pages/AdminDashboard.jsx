import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import Departamentos from './admin/Departamentos';
import CriarDepartamento from './admin/CriarDepartamento';
import EditarDepartamento from './admin/EditarDepartamento';
import Propostas from './admin/Propostas';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Departamentos */}
        <Route path="/departamentos" element={<Departamentos />} />
        <Route path="/departamentos/criar" element={<CriarDepartamento />} />
        <Route path="/departamentos/:id/editar" element={<EditarDepartamento />} />
        
        {/* Propostas */}
        <Route path="/propostas" element={<Propostas />} />
        
        {/* Placeholder para outras seções */}
        <Route path="/utilizadores" element={
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800">Utilizadores</h1>
            <p className="text-gray-600 mt-4">Em desenvolvimento...</p>
          </div>
        } />
        
        <Route path="/empresas" element={
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800">Empresas</h1>
            <p className="text-gray-600 mt-4">Em desenvolvimento...</p>
          </div>
        } />
        
        <Route path="/setores" element={
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800">Setores</h1>
            <p className="text-gray-600 mt-4">Em desenvolvimento...</p>
          </div>
        } />
        
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  );
}
