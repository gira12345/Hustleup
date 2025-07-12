import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Badge, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { adminAPI } from '../services/api';

export default function AdminDepartamentosSection() {
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartamento, setEditingDepartamento] = useState(null);
  const [formData, setFormData] = useState({ 
    nome: '', 
    codigo: '',
    descricao: '',
    ativo: true 
  });

  useEffect(() => {
    loadDepartamentos();
  }, []);

  const loadDepartamentos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminAPI.getDepartamentos();
      if (response && response.ok) {
        const data = await response.json();
        setDepartamentos(data);
      } else {
        throw new Error('Erro ao carregar departamentos');
      }
    } catch (err) {
      console.error('Erro ao carregar departamentos:', err);
      setError('Erro ao carregar departamentos');
      // Dados mock para desenvolvimento
      setDepartamentos([
        { 
          id: 1, 
          nome: 'Engenharia Informática', 
          codigo: 'EI',
          descricao: 'Departamento de Engenharia Informática e Computação',
          gestores: 2,
          estudantes: 150,
          ativo: true 
        },
        { 
          id: 2, 
          nome: 'Gestão', 
          codigo: 'GEST',
          descricao: 'Departamento de Gestão e Economia',
          gestores: 1,
          estudantes: 80,
          ativo: true 
        },
        { 
          id: 3, 
          nome: 'Marketing', 
          codigo: 'MKT',
          descricao: 'Departamento de Marketing e Comunicação',
          gestores: 1,
          estudantes: 60,
          ativo: true 
        },
        { 
          id: 4, 
          nome: 'Direito', 
          codigo: 'DIR',
          descricao: 'Departamento de Ciências Jurídicas',
          gestores: 1,
          estudantes: 40,
          ativo: false 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (departamento = null) => {
    setEditingDepartamento(departamento);
    setFormData(departamento ? { ...departamento } : { 
      nome: '', 
      codigo: '',
      descricao: '',
      ativo: true 
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDepartamento(null);
    setFormData({ 
      nome: '', 
      codigo: '',
      descricao: '',
      ativo: true 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDepartamento) {
        // Editar departamento existente
        console.log('Editando departamento:', formData);
      } else {
        // Criar novo departamento
        console.log('Criando departamento:', formData);
      }
      handleCloseModal();
      await loadDepartamentos();
    } catch (err) {
      console.error('Erro ao salvar departamento:', err);
      alert('Erro ao salvar departamento');
    }
  };

  const getStatusBadge = (departamento) => {
    return departamento.ativo ? 
      <Badge bg="success">Ativo</Badge> : 
      <Badge bg="secondary">Inativo</Badge>;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Carregando departamentos...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Gestão de Departamentos</h2>
          <p className="text-muted mb-0">Gerir departamentos da universidade</p>
        </div>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Novo Departamento
        </Button>
      </div>

      {error && (
        <Alert variant="warning" className="mb-4">
          {error} - Exibindo dados de exemplo
        </Alert>
      )}

      {/* Estatísticas Rápidas */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="text-center border-0 bg-info text-white">
            <Card.Body>
              <h3 className="fw-bold">{departamentos.length}</h3>
              <small>Total de Departamentos</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 bg-success text-white">
            <Card.Body>
              <h3 className="fw-bold">{departamentos.filter(d => d.ativo).length}</h3>
              <small>Departamentos Ativos</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 bg-primary text-white">
            <Card.Body>
              <h3 className="fw-bold">
                {departamentos.reduce((acc, d) => acc + (d.gestores || 0), 0)}
              </h3>
              <small>Total de Gestores</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 bg-warning text-white">
            <Card.Body>
              <h3 className="fw-bold">
                {departamentos.reduce((acc, d) => acc + (d.estudantes || 0), 0)}
              </h3>
              <small>Total de Estudantes</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Cards de Departamentos */}
      <Row className="g-4">
        {departamentos.map(departamento => (
          <Col lg={6} key={departamento.id}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0 fw-bold">{departamento.nome}</h6>
                  <small className="text-muted">Código: {departamento.codigo}</small>
                </div>
                {getStatusBadge(departamento)}
              </Card.Header>
              <Card.Body>
                <p className="text-muted mb-3">{departamento.descricao}</p>
                
                <Row className="text-center">
                  <Col xs={6}>
                    <div className="border-end">
                      <h5 className="text-primary mb-0">{departamento.gestores || 0}</h5>
                      <small className="text-muted">Gestores</small>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <h5 className="text-success mb-0">{departamento.estudantes || 0}</h5>
                    <small className="text-muted">Estudantes</small>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer className="bg-white">
                <div className="d-grid gap-2 d-md-flex">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleShowModal(departamento)}
                  >
                     Editar
                  </Button>
                  <Button
                    variant="outline-info"
                    size="sm"
                    onClick={() => console.log('Ver relatório do departamento', departamento.id)}
                  >
                     Relatório
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Tabela Resumida */}
      <Card className="border-0 shadow-sm mt-4">
        <Card.Header className="bg-light">
          <h5 className="mb-0 fw-bold">Resumo dos Departamentos</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive striped hover className="mb-0">
            <thead className="bg-info text-white">
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Código</th>
                <th>Gestores</th>
                <th>Estudantes</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {departamentos.map(departamento => (
                <tr key={departamento.id}>
                  <td className="fw-bold">#{departamento.id}</td>
                  <td>{departamento.nome}</td>
                  <td>
                    <Badge bg="outline-secondary" className="p-2">
                      {departamento.codigo}
                    </Badge>
                  </td>
                  <td>{departamento.gestores || 0}</td>
                  <td>{departamento.estudantes || 0}</td>
                  <td>{getStatusBadge(departamento)}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => handleShowModal(departamento)}
                    >
                       Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal para Criar/Editar Departamento */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingDepartamento ? 'Editar Departamento' : 'Novo Departamento'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nome do Departamento</Form.Label>
              <Form.Control
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Código</Form.Label>
              <Form.Control
                type="text"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                placeholder="Ex: EI, GEST, MKT"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Breve descrição do departamento..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.ativo}
                onChange={(e) => setFormData({ ...formData, ativo: e.target.value === 'true' })}
              >
                <option value={true}>Ativo</option>
                <option value={false}>Inativo</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {editingDepartamento ? 'Atualizar' : 'Criar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
