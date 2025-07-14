import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import api from '../../config/axios';

function CriarPropostaGestor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    empresaId: '',
    departamento: '',
    contracto: '',
    morada: '',
    email: '',
    areas: [],
    data_submissao: '',
    data_limite_ativacao: '',
  });
  const [areaInput, setAreaInput] = useState('');
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAddArea = (e) => {
    e.preventDefault();
    if (areaInput.trim() && !formData.areas.includes(areaInput.trim())) {
      setFormData((prev) => ({ ...prev, areas: [...prev.areas, areaInput.trim()] }));
      setAreaInput('');
    }
  };

  const handleRemoveArea = (area) => {
    setFormData((prev) => ({ ...prev, areas: prev.areas.filter(a => a !== area) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);
    try {
      await api.post('/gestor/propostas', formData);
      setSucesso('Proposta criada com sucesso!');
      setTimeout(() => navigate('/gestor/propostas'), 1500);
    } catch (err) {
      setErro('Erro ao criar proposta.');
    }
  };

  useEffect(() => {
    // Buscar empresas e departamentos
    Promise.all([
      api.get('/gestor/empresas'),
      api.get('/gestor/departamentos')
    ]).then(([empresasRes, depRes]) => {
      setEmpresas(empresasRes.data || []);
      setDepartamentos(depRes.data || []);
    }).catch(err => {
      console.error('Erro ao carregar dados:', err);
      setEmpresas([]);
      setDepartamentos([]);
    });
  }, []);

  return (
    <Card className="shadow-sm border-0 rounded-4 p-4">
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 px-4 py-2 rounded-lg shadow-sm transition-all duration-200 text-sm font-semibold"
          onClick={() => {
            // Garante que o token e tipo estão presentes antes de navegar
            if (!localStorage.getItem('token') || !localStorage.getItem('tipo')) {
              alert('Sessão expirada. Faz login novamente.');
              navigate('/login');
            } else {
              navigate('/gestor/propostas');
            }
          }}
        >
          <svg className="w-4 h-4 transform transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h4 className="mb-0">Criar Nova Proposta</h4>
      </div>
      {erro && <Alert variant="danger">{erro}</Alert>}
      {sucesso && <Alert variant="success">{sucesso}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
                placeholder="Título da proposta"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Morada</Form.Label>
              <Form.Control
                type="text"
                name="morada"
                value={formData.morada}
                onChange={handleChange}
                placeholder="Morada/localização"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contacto</Form.Label>
              <Form.Control
                type="text"
                name="contracto"
                value={formData.contracto}
                onChange={handleChange}
                placeholder="Email ou telefone de contacto"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email de contacto"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                name="descricao"
                rows={5}
                value={formData.descricao}
                onChange={handleChange}
                required
                placeholder="Descreve os detalhes da proposta"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Competências (tags)</Form.Label>
              <div className="d-flex mb-2">
                <Form.Control
                  type="text"
                  value={areaInput}
                  onChange={e => setAreaInput(e.target.value)}
                  placeholder="Adicionar competência (ex: Informática)"
                />
                <Button variant="secondary" className="ms-2" onClick={handleAddArea}>Adicionar</Button>
              </div>
              <div className="mb-2">
                {formData.areas.map(area => (
                  <span key={area} className="badge bg-primary me-2">
                    {area} <span style={{cursor:'pointer'}} onClick={() => handleRemoveArea(area)}>×</span>
                  </span>
                ))}
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data de Submissão</Form.Label>
              <Form.Control
                type="date"
                name="data_submissao"
                value={formData.data_submissao}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data Limite de Ativação</Form.Label>
              <Form.Control
                type="date"
                name="data_limite_ativacao"
                value={formData.data_limite_ativacao}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Departamento</Form.Label>
              <Form.Select
                name="departamento"
                value={formData.departamento || ''}
                onChange={handleChange}
                required
              >
                <option value="">Selecione o departamento</option>
                {departamentos.map(dep => (
                  <option key={dep.id} value={dep.nome}>{dep.nome}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Empresa</Form.Label>
              <Form.Select
                name="empresaId"
                value={formData.empresaId || ''}
                onChange={handleChange}
                required
              >
                <option value="">Selecione a empresa</option>
                {empresas.map(emp => (
                  <option key={emp.id || emp.nome} value={emp.id}>{emp.nome}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit">
          Criar Proposta
        </Button>
      </Form>
    </Card>
  );
}

export default CriarPropostaGestor;
