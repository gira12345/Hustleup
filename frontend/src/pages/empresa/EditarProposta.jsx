import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import api from '../../config/axios';

export default function EditarProposta() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    departamento: '',
    contracto: '',
    morada: '',
    email: '',
    areas: [],
    data_submissao: '',
    data_limite_ativacao: '',
    experiencia: ''
  });
  const [areaInput, setAreaInput] = useState('');
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        
        // Carregar departamentos
        const resDepartamentos = await api.get('/api/empresa/departamentos');
        if (resDepartamentos.data && Array.isArray(resDepartamentos.data)) {
          setDepartamentos(resDepartamentos.data);
        }

        // Carregar dados da proposta
        const resProposta = await api.get(`/api/empresa/propostas/${id}`);
        const proposta = resProposta.data;
        
        setFormData({
          nome: proposta.nome || '',
          descricao: proposta.descricao || '',
          departamento: proposta.departamento || '',
          contracto: proposta.contracto || '',
          morada: proposta.morada || '',
          email: proposta.email || '',
          areas: proposta.areas || [],
          data_submissao: proposta.data_submissao || '',
          data_limite_ativacao: proposta.data_limite_ativacao || '',
          experiencia: proposta.experiencia || ''
        });
        
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setErro('Erro ao carregar dados da proposta.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      carregarDados();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
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
      await api.patch(`/api/empresa/propostas/${id}`, formData);
      setSucesso('Proposta atualizada com sucesso!');
      setTimeout(() => navigate('/empresa/propostas'), 1500);
    } catch (err) {
      console.error('Erro ao atualizar proposta:', err);
      setErro(err.response?.data?.message || 'Erro ao atualizar proposta.');
    }
  };

  if (loading) {
    return (
      <Card className="shadow-sm border-0 rounded-4 p-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">A carregar...</span>
          </div>
          <p className="mt-2">A carregar dados da proposta...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-0 rounded-4 p-4">
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 px-4 py-2 rounded-lg shadow-sm transition-all duration-200 text-sm"
          onClick={() => navigate('/empresa/propostas')}
        >
          <svg className="w-4 h-4 transform transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h4 className="mb-0">Editar Proposta</h4>
      </div>

      {erro && (
        <Alert variant="danger" className="mb-4">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {erro}
        </Alert>
      )}
      
      {sucesso && (
        <Alert variant="success" className="mb-4">
          <i className="fas fa-check-circle me-2"></i>
          {sucesso}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nome da Proposta</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Departamento</Form.Label>
              <Form.Select
                name="departamento"
                value={formData.departamento}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um departamento</option>
                {departamentos.map((dept) => (
                  <option key={dept.id} value={dept.nome}>
                    {dept.nome}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contacto</Form.Label>
              <Form.Control
                type="text"
                name="contracto"
                value={formData.contracto}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Morada</Form.Label>
              <Form.Control
                type="text"
                name="morada"
                value={formData.morada}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Experiência Requerida</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="experiencia"
                value={formData.experiencia}
                onChange={handleChange}
                placeholder="Descreva a experiência necessária para esta proposta"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Competências</Form.Label>
              <div className="d-flex gap-2 mb-2">
                <Form.Control
                  type="text"
                  value={areaInput}
                  onChange={(e) => setAreaInput(e.target.value)}
                  placeholder="Digite uma competência"
                />
                <Button variant="outline-primary" onClick={handleAddArea}>
                  <i className="fas fa-plus"></i>
                </Button>
              </div>
              <div className="d-flex flex-wrap gap-1">
                {formData.areas.map((area, index) => (
                  <span key={index} className="badge bg-primary d-flex align-items-center gap-1">
                    {area}
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      style={{ fontSize: '0.5rem' }}
                      onClick={() => handleRemoveArea(area)}
                    ></button>
                  </span>
                ))}
              </div>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data de Submissão</Form.Label>
                  <Form.Control
                    type="date"
                    name="data_submissao"
                    value={formData.data_submissao}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data Limite de Ativação</Form.Label>
                  <Form.Control
                    type="date"
                    name="data_limite_ativacao"
                    value={formData.data_limite_ativacao}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Col>
        </Row>

        <div className="d-flex gap-2 justify-content-end">
          <Button variant="secondary" onClick={() => navigate('/empresa/propostas')}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            <i className="fas fa-save me-2"></i>
            Atualizar Proposta
          </Button>
        </div>
      </Form>
    </Card>
  );
}