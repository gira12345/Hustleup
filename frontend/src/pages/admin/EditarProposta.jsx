import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import api from '../../config/axios';

export default function EditarProposta() {
  const { id } = useParams();
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
  });
  const [areaInput, setAreaInput] = useState('');
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Buscar departamentos para o dropdown
    api.get('/admin/departamentos')
      .then(res => setDepartamentos(res.data))
      .catch(() => setDepartamentos([]));
    // Buscar dados da proposta
    async function fetchProposta() {
      try {
        const response = await api.get(`/admin/propostas/${id}`);
        const data = response.data;
        setFormData({
          nome: data.nome || data.titulo || '',
          descricao: data.descricao || '',
          departamento: data.departamento || '',
          contracto: data.contracto || data.contacto || '',
          morada: data.morada || '',
          email: data.email || '',
          areas: data.areas || [],
          data_submissao: data.data_submissao ? data.data_submissao.slice(0,10) : '',
          data_limite_ativacao: data.data_limite_ativacao ? data.data_limite_ativacao.slice(0,10) : '',
        });
      } catch (err) {
        setErro('Erro ao carregar proposta.');
      } finally {
        setLoading(false);
      }
    }
    fetchProposta();
  }, [id]);

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
      await api.put(`/admin/propostas/${id}`, formData);
      setSucesso('Proposta atualizada com sucesso!');
      setTimeout(() => navigate('/admin/propostas'), 1500);
    } catch (err) {
      setErro('Erro ao atualizar proposta.');
    }
  };

  if (loading) {
    return <div className="text-center my-5"><span>Carregando...</span></div>;
  }

  return (
    <Card className="shadow-sm border-0 rounded-4 p-4">
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 px-4 py-2 rounded-lg shadow-sm transition-all duration-200 text-sm font-semibold"
          onClick={() => navigate('/admin/propostas')}
        >
          <svg className="w-4 h-4 transform transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h4 className="mb-0">Editar Proposta</h4>
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
                {departamentos.map(dep => (
                  <option key={dep.id || dep.nome} value={dep.nome}>{dep.nome}</option>
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
          Guardar Alterações
        </Button>
      </Form>
    </Card>
  );
}
