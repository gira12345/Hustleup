import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Badge, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { adminAPI } from '../services/api';

export default function AdminEstudantesSection() {
  const [estudantes, setEstudantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEstudante, setEditingEstudante] = useState(null);
  const [formData, setFormData] = useState({ 
    nome: '', 
    email: '', 
    numero_estudante: '', 
    curso: '', 
    ano_letivo: '',
    ativo: true 
  });

  useEffect(() => {
    loadEstudantes();
  }, []);

  const loadEstudantes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminAPI.getEstudantes();
      if (response && response.ok) {
        const data = await response.json();
        
        // Garantir que os dados estão no formato correto
        const estudantesFormatados = Array.isArray(data) ? data.map(estudante => ({
          id: estudante.id,
          nome: estudante.nome || estudante.User?.nome || 'Nome não disponível',
          email: estudante.email || estudante.User?.email || 'Email não disponível',
          numero_estudante: estudante.numero_estudante || estudante.numeroEstudante || 'N/A',
          curso: estudante.curso || estudante.Departamento?.nome || 'Curso não especificado',
          ano_letivo: estudante.ano_letivo || estudante.anoLetivo || '2024/2025',
          ativo: estudante.ativo !== false // assume ativo se não especificado
        })) : [];
        
        setEstudantes(estudantesFormatados);
      } else {
        throw new Error('Erro ao carregar estudantes');
      }
    } catch (err) {
      console.error('Erro ao carregar estudantes:', err);
      setError('Erro ao carregar estudantes');
      // Dados mock para desenvolvimento
      setEstudantes([
        { 
          id: 1, 
          nome: 'João Silva', 
          email: 'joao@estudante.com', 
          numero_estudante: '20210001',
          curso: 'Engenharia Informática',
          ano_letivo: '2024/2025',
          ativo: true 
        },
        { 
          id: 2, 
          nome: 'Maria Santos', 
          email: 'maria@estudante.com', 
          numero_estudante: '20210002',
          curso: 'Gestão',
          ano_letivo: '2024/2025',
          ativo: true 
        },
        { 
          id: 3, 
          nome: 'Pedro Costa', 
          email: 'pedro@estudante.com', 
          numero_estudante: '20200015',
          curso: 'Marketing',
          ano_letivo: '2024/2025',
          ativo: false 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEstudante = async (id) => {
    if (window.confirm('Tem certeza que deseja remover este estudante?')) {
      try {
        const response = await adminAPI.deleteEstudante(id);
        if (response && response.ok) {
          await loadEstudantes();
          alert('Estudante removido com sucesso!');
        } else {
          throw new Error('Erro ao remover estudante');
        }
      } catch (err) {
        console.error('Erro ao remover estudante:', err);
        alert('Erro ao remover estudante');
      }
    }
  };

  const handleShowModal = (estudante = null) => {
    setEditingEstudante(estudante);
    setFormData(estudante ? { ...estudante } : { 
      nome: '', 
      email: '', 
      numero_estudante: '', 
      curso: '', 
      ano_letivo: '2024/2025',
      ativo: true 
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEstudante(null);
    setFormData({ 
      nome: '', 
      email: '', 
      numero_estudante: '', 
      curso: '', 
      ano_letivo: '2024/2025',
      ativo: true 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEstudante) {
        // Editar estudante existente
        console.log('Editando estudante:', formData);
      } else {
        // Criar novo estudante
        console.log('Criando estudante:', formData);
      }
      handleCloseModal();
      await loadEstudantes();
    } catch (err) {
      console.error('Erro ao salvar estudante:', err);
      alert('Erro ao salvar estudante');
    }
  };

  const getStatusBadge = (estudante) => {
    return estudante.ativo ? 
      <Badge bg="success">Ativo</Badge> : 
      <Badge bg="secondary">Inativo</Badge>;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Carregando estudantes...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Gestão de Estudantes</h2>
          <p className="text-muted mb-0">Gerir estudantes registados na plataforma</p>
        </div>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Novo Estudante
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
              <h3 className="fw-bold">{estudantes.length}</h3>
              <small>Total de Estudantes</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 bg-success text-white">
            <Card.Body>
              <h3 className="fw-bold">{estudantes.filter(e => e.ativo).length}</h3>
              <small>Estudantes Ativos</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 bg-warning text-white">
            <Card.Body>
              <h3 className="fw-bold">{[...new Set(estudantes.map(e => e.curso))].length}</h3>
              <small>Cursos Diferentes</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 bg-secondary text-white">
            <Card.Body>
              <h3 className="fw-bold">{estudantes.filter(e => !e.ativo).length}</h3>
              <small>Estudantes Inativos</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabela de Estudantes */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-light">
          <h5 className="mb-0 fw-bold">Lista de Estudantes</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive striped hover className="mb-0">
            <thead className="bg-info text-white">
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Nº Estudante</th>
                <th>Curso</th>
                <th>Ano Letivo</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {estudantes.map(estudante => (
                <tr key={estudante.id}>
                  <td className="fw-bold">#{estudante.id}</td>
                  <td>{estudante.nome}</td>
                  <td>{estudante.email}</td>
                  <td className="fw-bold text-primary">{estudante.numero_estudante}</td>
                  <td>{estudante.curso}</td>
                  <td>{estudante.ano_letivo}</td>
                  <td>{getStatusBadge(estudante)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => handleShowModal(estudante)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDeleteEstudante(estudante.id)}
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

      {/* Modal para Criar/Editar Estudante */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingEstudante ? 'Editar Estudante' : 'Novo Estudante'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome Completo</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Número de Estudante</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.numero_estudante}
                    onChange={(e) => setFormData({ ...formData, numero_estudante: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Curso</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.curso}
                    onChange={(e) => setFormData({ ...formData, curso: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ano Letivo</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.ano_letivo}
                    onChange={(e) => setFormData({ ...formData, ano_letivo: e.target.value })}
                    placeholder="2024/2025"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
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
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {editingEstudante ? 'Atualizar' : 'Criar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
