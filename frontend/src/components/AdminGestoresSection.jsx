import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Badge, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { adminAPI } from '../services/api';

export default function AdminGestoresSection() {
  const [gestores, setGestores] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingGestor, setEditingGestor] = useState(null);
  const [formData, setFormData] = useState({ 
    nome: '', 
    email: '', 
    departamento_id: '',
    ativo: true 
  });

  useEffect(() => {
    loadGestores();
    loadDepartamentos();
  }, []);

  const loadGestores = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminAPI.getGestores();
      if (response && response.ok) {
        const data = await response.json();
        
        // Garantir que os dados estão no formato correto
        const gestoresFormatados = Array.isArray(data) ? data.map(gestor => ({
          id: gestor.id,
          nome: gestor.nome || gestor.User?.nome || 'Nome não disponível',
          email: gestor.email || gestor.User?.email || 'Email não disponível',
          departamento: gestor.departamento || gestor.Departamento?.nome || 'Departamento não especificado',
          departamento_id: gestor.departamento_id || gestor.departamentoId || gestor.Departamento?.id || '',
          ativo: gestor.ativo !== false // assume ativo se não especificado
        })) : [];
        
        setGestores(gestoresFormatados);
      } else {
        throw new Error('Erro ao carregar gestores');
      }
    } catch (err) {
      console.error('Erro ao carregar gestores:', err);
      setError('Erro ao carregar gestores');
      // Dados mock para desenvolvimento
      setGestores([
        { 
          id: 1, 
          nome: 'Ana Ferreira', 
          email: 'ana@universidade.pt', 
          departamento: 'Engenharia Informática',
          departamento_id: 1,
          ativo: true 
        },
        { 
          id: 2, 
          nome: 'Carlos Mendes', 
          email: 'carlos@universidade.pt', 
          departamento: 'Gestão',
          departamento_id: 2,
          ativo: true 
        },
        { 
          id: 3, 
          nome: 'Isabel Santos', 
          email: 'isabel@universidade.pt', 
          departamento: 'Marketing',
          departamento_id: 3,
          ativo: false 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadDepartamentos = async () => {
    try {
      const response = await adminAPI.getDepartamentos();
      if (response && response.ok) {
        const data = await response.json();
        setDepartamentos(data);
      } else {
        throw new Error('Erro ao carregar departamentos');
      }
    } catch (err) {
      console.error('Erro ao carregar departamentos:', err);
      // Dados mock para desenvolvimento
      setDepartamentos([
        { id: 1, nome: 'Engenharia Informática' },
        { id: 2, nome: 'Gestão' },
        { id: 3, nome: 'Marketing' },
        { id: 4, nome: 'Direito' },
        { id: 5, nome: 'Medicina' }
      ]);
    }
  };

  const handleDeleteGestor = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este gestor?')) {
      try {
        const response = await adminAPI.deleteGestor(id);
        if (response && response.ok) {
          await loadGestores();
          alert('Gestor removido com sucesso!');
        } else {
          throw new Error('Erro ao remover gestor');
        }
      } catch (err) {
        console.error('Erro ao remover gestor:', err);
        alert('Erro ao remover gestor');
      }
    }
  };

  const handleShowModal = (gestor = null) => {
    setEditingGestor(gestor);
    setFormData(gestor ? { ...gestor } : { 
      nome: '', 
      email: '', 
      departamento_id: '',
      ativo: true 
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingGestor(null);
    setFormData({ 
      nome: '', 
      email: '', 
      departamento_id: '',
      ativo: true 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGestor) {
        // Editar gestor existente
        console.log('Editando gestor:', formData);
      } else {
        // Criar novo gestor
        console.log('Criando gestor:', formData);
      }
      handleCloseModal();
      await loadGestores();
    } catch (err) {
      console.error('Erro ao salvar gestor:', err);
      alert('Erro ao salvar gestor');
    }
  };

  const getStatusBadge = (gestor) => {
    return gestor.ativo ? 
      <Badge bg="success">Ativo</Badge> : 
      <Badge bg="secondary">Inativo</Badge>;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Carregando gestores...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Gestão de Gestores</h2>
          <p className="text-muted mb-0">Gerir gestores de departamento</p>
        </div>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Novo Gestor
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
          <Card className="text-center border-0 bg-success text-white">
            <Card.Body>
              <h3 className="fw-bold">{gestores.length}</h3>
              <small>Total de Gestores</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 bg-primary text-white">
            <Card.Body>
              <h3 className="fw-bold">{gestores.filter(g => g.ativo).length}</h3>
              <small>Gestores Ativos</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 bg-info text-white">
            <Card.Body>
              <h3 className="fw-bold">{departamentos.length}</h3>
              <small>Departamentos</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 bg-secondary text-white">
            <Card.Body>
              <h3 className="fw-bold">{gestores.filter(g => !g.ativo).length}</h3>
              <small>Gestores Inativos</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabela de Gestores */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-light">
          <h5 className="mb-0 fw-bold">Lista de Gestores</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive striped hover className="mb-0">
            <thead className="bg-success text-white">
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Departamento</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {gestores.map(gestor => (
                <tr key={gestor.id}>
                  <td className="fw-bold">#{gestor.id}</td>
                  <td>{gestor.nome}</td>
                  <td>{gestor.email}</td>
                  <td>
                    <Badge bg="info" className="p-2">
                      {gestor.departamento}
                    </Badge>
                  </td>
                  <td>{getStatusBadge(gestor)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => handleShowModal(gestor)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDeleteGestor(gestor.id)}
                      >
                        Remover
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal para Criar/Editar Gestor */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingGestor ? 'Editar Gestor' : 'Novo Gestor'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nome Completo</Form.Label>
              <Form.Control
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Departamento</Form.Label>
              <Form.Select
                value={formData.departamento_id}
                onChange={(e) => setFormData({ ...formData, departamento_id: e.target.value })}
                required
              >
                <option value="">Selecione um departamento</option>
                {departamentos.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.nome}
                  </option>
                ))}
              </Form.Select>
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
              {editingGestor ? 'Atualizar' : 'Criar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
