// Test local das rotas
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Teste simples das rotas principais
const TestRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/admin" element={<div>Admin Page</div>} />
        <Route path="/empresa" element={<div>Empresa Page</div>} />
        <Route path="/utilizador" element={<div>Utilizador Page</div>} />
        <Route path="/gestor" element={<div>Gestor Page</div>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

console.log('Rotas configuradas:');
console.log('- /login -> Login Page');
console.log('- /admin -> Admin Page');
console.log('- /empresa -> Empresa Page');
console.log('- /utilizador -> Utilizador Page');
console.log('- /gestor -> Gestor Page');
console.log('- / -> Redirect to /login');
console.log('- * -> 404 Page');

export default TestRoutes;
