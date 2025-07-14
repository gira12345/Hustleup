import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import api from '../../config/axios';

const PerfilEmpresa = () => {
  const [perfil, setPerfil] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    setor: '',
    descricao: '',
    website: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/empresa/perfil');
      
      const perfilData = {
        nome: response.data.nome || '',
        email: response.data.user?.email || response.data.contacto || '',
        telefone: response.data.contacto || '',
        endereco: response.data.morada || response.data.localizacao || '',
        setor: '', // Temporariamente vazio até resolver problema com setores
        descricao: response.data.descricao || '',
        website: response.data.website || ''
      };
      
      setPerfil(perfilData);
      setFormData(perfilData);
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
      setError('Erro ao carregar perfil da empresa');
      // Definir perfil vazio em caso de erro para evitar problemas de renderização
      const perfilVazio = {
        nome: '',
        email: '',
        telefone: '',
        endereco: '',
        setor: '',
        descricao: '',
        website: ''
      };
      setPerfil(perfilVazio);
      setFormData(perfilVazio);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSucesso('');
      
      const dadosBackend = {
        nome: formData.nome,
        contacto: formData.email, // Email vai para contacto
        morada: formData.endereco,
        descricao: formData.descricao,
        website: formData.website
      };
      
      await api.patch('/empresa/perfil', dadosBackend);
      setPerfil(formData);
      setEditando(false);
      setSucesso('Perfil atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      setError('Erro ao atualizar perfil. Tente novamente.');
    }
  };

  if (loading) return (
    <Card className="shadow-sm border-0 rounded-4 p-4">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">A carregar...</span>
        </div>
        <p className="mt-2 text-muted">A carregar perfil...</p>
      </div>
    </Card>
  );

  if (error && !editando) return (
    <Card className="shadow-sm border-0 rounded-4 p-4">
      <Alert variant="danger">{error}</Alert>
      <div className="text-center">
        <Button 
          onClick={() => window.location.reload()} 
          variant="primary"
        >
          Tentar novamente
        </Button>
      </div>
    </Card>
  );

  if (!perfil && !loading) return (
    <Card className="shadow-sm border-0 rounded-4 p-4">
      <div className="text-center">
        <p className="text-muted">Perfil não encontrado</p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="primary"
        >
          Tentar novamente
        </Button>
      </div>
    </Card>
  );

  if (editando) {
    return (
      <Card className="shadow-sm border-0 rounded-4 p-4">
        <div className="d-flex align-items-center gap-2 mb-4">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setEditando(false)}
            className="d-flex align-items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </Button>
          <h4 className="mb-0">Editar Perfil da Empresa</h4>
        </div>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {sucesso && <Alert variant="success">{sucesso}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nome da Empresa</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  placeholder="Nome da empresa"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Setor</Form.Label>
                <Form.Select
                  name="setor"
                  value={formData.setor}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione o setor</option>
                  <option value="Tecnologia">Tecnologia</option>
                  <option value="Saúde">Saúde</option>
                  <option value="Educação">Educação</option>
                  <option value="Finanças">Finanças</option>
                  <option value="Manufactura">Manufactura</option>
                  <option value="Serviços">Serviços</option>
                  <option value="Construção">Construção</option>
                  <option value="Energia">Energia</option>
                  <option value="Turismo">Turismo</option>
                  <option value="Retail">Retail</option>
                  <option value="Outro">Outro</option>
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Email da empresa"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Telefone</Form.Label>
                <Form.Control
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  placeholder="Telefone da empresa"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Website</Form.Label>
                <Form.Control
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://www.exemplo.com"
                />
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Endereço</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  placeholder="Endereço da empresa"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Descrição da Empresa</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder="Descrição da empresa"
                />
              </Form.Group>
            </Col>
          </Row>
          
          <div className="d-flex gap-2">
            <Button variant="primary" type="submit">
              Guardar Alterações
            </Button>
            <Button variant="outline-secondary" onClick={() => setEditando(false)}>
              Cancelar
            </Button>
          </div>
        </Form>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-0 rounded-4 p-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 className="mb-0">Perfil da Empresa</h4>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => setEditando(true)}
        >
          Editar
        </Button>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {sucesso && <Alert variant="success">{sucesso}</Alert>}
      
      <Row>
        <Col md={6}>
          <div className="mb-3">
            <strong className="text-muted">Nome:</strong>
            <p className="mb-0">{perfil?.nome || 'Não especificado'}</p>
          </div>
          
          <div className="mb-3">
            <strong className="text-muted">Setor:</strong>
            <p className="mb-0">{perfil?.setor || 'Não especificado'}</p>
          </div>
          
          <div className="mb-3">
            <strong className="text-muted">Email:</strong>
            <p className="mb-0">{perfil?.email || 'Não especificado'}</p>
          </div>
          
          <div className="mb-3">
            <strong className="text-muted">Telefone:</strong>
            <p className="mb-0">{perfil?.telefone || 'Não especificado'}</p>
          </div>
          
          <div className="mb-3">
            <strong className="text-muted">Endereço:</strong>
            <p className="mb-0">{perfil?.endereco || 'Não especificado'}</p>
          </div>
        </Col>
        
        <Col md={6}>
          <div className="mb-3">
            <strong className="text-muted">Descrição:</strong>
            <div className="bg-light p-3 rounded mt-2">
              <small className="text-muted d-block mb-2">
                <i>Descrição da empresa para apresentação aos candidatos.</i>
              </small>
              <p className="mb-0">{perfil?.descricao || 'Não especificado'}</p>
            </div>
          </div>
          
          {perfil?.website && (
            <div className="mb-3">
              <strong className="text-muted">Website:</strong>
              <p className="mb-0">
                <a href={perfil.website} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                  {perfil.website}
                </a>
              </p>
            </div>
          )}
        </Col>
      </Row>
    </Card>
  );
};

export default PerfilEmpresa;
