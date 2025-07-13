import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const images = ['/fundo1.png', '/fundo2.png'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    console.log('Dados do login:', { email, senha });
    
    try {
      const resposta = await api.post('/auth/login', {
        email,
        password: senha
      });

      console.log('Resposta do servidor:', resposta.data);

      const { token, user } = resposta.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('tipo', user.role); //  CORREÇÃO: adicionar tipo para ProtectedRoute

      console.log(' Login realizado! Navegando para:', user.role);

      // Navegar baseado no role do utilizador
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'empresa') navigate('/empresa');
      else if (user.role === 'estudante') navigate('/utilizador');
      else if (user.role === 'gestor') navigate('/gestor');
      else navigate('/dashboard');
      
    } catch (err) {
      console.error(' Erro no login:', err);
      
      if (err.response?.data?.message) {
        setErro(err.response.data.message);
      } else {
        setErro('Erro na conexão. Verifique se o servidor está funcionando.');
      }
    }
  };

  const handleRegistar = () => {
    navigate('/registar');
  };

  return (
    <div
      className="d-flex vh-100 justify-content-start align-items-center"
      style={{
        background: 'linear-gradient(to right, #0b1a2d, #112D4E)',
        padding: '2rem',
      }}
    >
      <div className="d-flex align-items-center w-100">
        <div
          className="bg-white p-5 shadow"
          style={{
            border: '2px solid black',
            borderRadius: '40px',
            minWidth: '400px',
            height: '600px',
            marginLeft: '5vw',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Logo */}
          <img src="/hustleup-logo.png" alt="HustleUp" className="mx-auto d-block mb-5" style={{ height: '80px', marginTop: '-20px' }} />

          {/* Formulário */}
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Senha</label>
              <input
                type="password"
                className="form-control"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            {erro && (
              <div className="alert alert-danger p-2 mb-2" style={{ fontSize: '0.9rem' }}>
                {erro}
              </div>
            )}

            <button
              type="submit"
              className="btn w-100 mb-2"
              style={{ backgroundColor: '#112D4E', color: '#fff' }}
            >
              Entrar
            </button>

            <button
              type="button"
              onClick={handleRegistar}
              className="btn btn-outline-primary w-100"
            >
              Registar Empresa
            </button>
          </form>
        </div>

        {/* Carrossel de imagens */}
        <div
          className="flex-grow-1 d-flex align-items-center justify-content-center"
          style={{
            height: '100vh',
            position: 'relative',
            overflow: 'hidden',
            marginLeft: '2rem',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '95%',
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
            }}
          >
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Fundo ${index + 1}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                
                  objectFit: 'cover',
                  opacity: index === currentImageIndex ? 1 : 0,
                  transition: 'opacity 1s ease-in-out',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
