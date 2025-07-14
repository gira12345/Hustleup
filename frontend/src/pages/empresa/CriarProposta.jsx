import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import api from '../../config/axios';

export default function CriarProposta() {
  const navigate = useNavigate();
  const [departamentos, setDepartamentos] = useState([]);
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
    // Buscar departamentos para o dropdown
    const carregarDepartamentos = async () => {
      try {
        // Usar o endpoint da empresa para departamentos
        const res = await api.get('/empresa/departamentos');
        
        console.log('Departamentos recebidos:', res.data);
        
        if (res.data && Array.isArray(res.data)) {
          setDepartamentos(res.data);
        } else {
          console.warn('Dados de departamentos inválidos:', res.data);
          setDepartamentos([]);
        }
      } catch (err) {
        console.error('Erro ao buscar departamentos:', err);
        // Em caso de erro, mostrar mensagem ao usuário
        setErro('Erro ao carregar departamentos. Tente novamente mais tarde.');
        setDepartamentos([]);
      }
    };

    carregarDepartamentos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Campo alterado: ${name} = ${value}`);
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
      await api.post('/empresa/propostas', formData);
      setSucesso('Proposta criada com sucesso!');
      setTimeout(() => navigate('/empresa/propostas'), 1500);
    } catch (err) {
      console.error('Erro ao criar proposta:', err);
      setErro(err.response?.data?.message || 'Erro ao criar proposta.');
    }
  };

  return (
    <Card className="shadow-sm border-0 rounded-4 p-4">
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 px-4 py-2 rounded-lg shadow-sm transition-all duration-200 text-sm font-semibold"
          onClick={() => navigate('/empresa/propostas')}
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
              <Form.Label>Departamento</Form.Label>
              <Form.Select
                name="departamento"
                value={formData.departamento}
                onChange={handleChange}
                required
              >
                <option value="">Selecione o departamento</option>
                {departamentos.map((dep, index) => (
                  <option key={dep.id || dep.nome || index} value={dep.nome || dep}>
                    {dep.nome || dep}
                  </option>
                ))}
              </Form.Select>
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
              <Form.Label>Experiência Requerida</Form.Label>
              <Form.Select
                name="experiencia"
                value={formData.experiencia}
                onChange={handleChange}
              >
                <option value="">Selecione a experiência</option>
                <option value="Sem experiência">Sem experiência</option>
                <option value="1-2 anos">1-2 anos</option>
                <option value="3-5 anos">3-5 anos</option>
                <option value="5+ anos">5+ anos</option>
              </Form.Select>
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
          </Col>
        </Row>
        <Button variant="primary" type="submit">
          Criar Proposta
        </Button>
      </Form>
    </Card>
  );
}
