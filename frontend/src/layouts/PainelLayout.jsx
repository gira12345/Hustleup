// src/layouts/PainelLayout.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';

const PainelLayout = ({ children, tipo, onFiltrar }) => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar tipo={tipo} onFiltrar={onFiltrar} />
      <div className="flex-grow-1" style={{ backgroundColor: '#f8f9fa' }}>
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PainelLayout;
