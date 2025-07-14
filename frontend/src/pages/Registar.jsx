import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';

const Registar = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    confirmPassword: '',
    descricao: ''
  });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const images = ['/fundo1.png', '/fundo3.png'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setErro('As passwords não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setErro('A password deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/registar-empresa', {
        nome: formData.nome,
        email: formData.email,
        password: formData.password,
        descricao: formData.descricao
      });

      setSucesso('Empresa registada com sucesso! Aguarda validação pelo administrador.');
      
      // Limpar formulário
      setFormData({
        nome: '',
        email: '',
        password: '',
        confirmPassword: '',
        descricao: ''
      });

      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error) {
      console.error('Erro no registo:', error);
      setErro(error.response?.data?.message || 'Erro ao registar empresa');
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    navigate('/login');
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
            minWidth: '500px',
            maxWidth: '600px',
            height: '600px',
            marginLeft: '5vw',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
        <h2 className="text-center mb-3" style={{ fontSize: '1.5rem' }}>Registar Empresa</h2>

        {erro && (
          <div className="alert alert-danger p-1 mb-2" style={{ fontSize: '0.8rem' }}>
            {erro}
          </div>
        )}

        {sucesso && (
          <div className="alert alert-success p-1 mb-2" style={{ fontSize: '0.8rem' }}>
            {sucesso}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="nome" className="form-label" style={{ fontSize: '0.9rem' }}>Nome da Empresa *</label>
            <input
              type="text"
              className="form-control form-control-sm"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label htmlFor="email" className="form-label" style={{ fontSize: '0.9rem' }}>Email *</label>
            <input
              type="email"
              className="form-control form-control-sm"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label htmlFor="password" className="form-label" style={{ fontSize: '0.9rem' }}>Password *</label>
            <input
              type="password"
              className="form-control form-control-sm"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <div className="mb-2">
            <label htmlFor="confirmPassword" className="form-label" style={{ fontSize: '0.9rem' }}>Confirmar Password *</label>
            <input
              type="password"
              className="form-control form-control-sm"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <div className="mb-2">
            <label htmlFor="descricao" className="form-label" style={{ fontSize: '0.9rem' }}>Descrição da Empresa</label>
            <textarea
              className="form-control form-control-sm"
              id="descricao"
              name="descricao"
              rows="2"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="(Opcional) Descreva brevemente a sua empresa..."
            ></textarea>
          </div>

          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn w-100 mb-2"
              disabled={loading}
              style={{ backgroundColor: '#112D4E', color: '#fff' }}
            >
              {loading ? 'Registando...' : 'Registar Empresa'}
            </button>

            <button
              type="button"
              className="btn btn-outline-primary w-100"
              onClick={handleVoltar}
              disabled={loading}
            >
              Voltar ao Login
            </button>
          </div>
        </form>

        <div className="mt-2 text-center">
          <small className="text-muted" style={{ fontSize: '0.75rem' }}>
            Após o registo, a empresa ficará pendente de validação pelo administrador.
          </small>
        </div>
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

export default Registar;
