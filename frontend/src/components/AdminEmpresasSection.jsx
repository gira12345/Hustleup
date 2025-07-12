import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Badge, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { adminAPI } from '../services/api';

export default function AdminEmpresasSection() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState(null);
  const [formData, setFormData] = useState({ nome: '', email: '', validado: false });

  useEffect(() => {
    loadEmpresas();
  }, []);

  const loadEmpresas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminAPI.getEmpresas();
      if (response && response.ok) {
        const data = await response.json();
        
        // Garantir que os dados estão no formato correto
        const empresasFormatadas = Array.isArray(data) ? data.map(empresa => ({
          id: empresa.id,
          nome: empresa.nome || empresa.name || 'Empresa sem nome',
          email: empresa.email || empresa.User?.email || 'Email não disponível',
          validado: empresa.validado || false,
          ativo: empresa.ativo !== false // assume ativo se não especificado
        })) : [];
        
        setEmpresas(empresasFormatadas);
      } else {
        throw new Error('Erro ao carregar empresas');
      }
    } catch (err) {
      console.error('Erro ao carregar empresas:', err);
      setError('Erro ao carregar empresas');
      // Dados mock para desenvolvimento
      setEmpresas([
        { id: 1, nome: 'TechCorp', email: 'admin@techcorp.com', validado: true, ativo: true },
        { id: 2, nome: 'StartupX', email: 'contact@startupx.com', validado: false, ativo: true },
        { id: 3, nome: 'InnovaCorp', email: 'info@innovacorp.com', validado: true, ativo: false }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleValidarEmpresa = async (id) => {
    try {
      const response = await adminAPI.validarEmpresa(id);
      if (response && response.ok) {
        await loadEmpresas(); // Recarregar lista
        alert('Empresa validada com sucesso!');
      } else {
        throw new Error('Erro ao validar empresa');
      }
    } catch (err) {
      console.error('Erro ao validar empresa:', err);
      alert('Erro ao validar empresa');
    }
  };

  const handleDeleteEmpresa = async (id) => {
    if (window.confirm('Tem certeza que deseja remover esta empresa?')) {
      try {
        const response = await adminAPI.deleteUser(id);
        if (response && response.ok) {
          await loadEmpresas();
          alert('Empresa removida com sucesso!');
        } else {
          throw new Error('Erro ao remover empresa');
        }
      } catch (err) {
        console.error('Erro ao remover empresa:', err);
        alert('Erro ao remover empresa');
      }
    }
  };

  const handleShowModal = (empresa = null) => {
    setEditingEmpresa(empresa);
    setFormData(empresa ? { ...empresa } : { nome: '', email: '', validado: false });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEmpresa(null);
    setFormData({ nome: '', email: '', validado: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmpresa) {
        // Editar empresa existente
        console.log('Editando empresa:', formData);
      } else {
        // Criar nova empresa
        console.log('Criando empresa:', formData);
      }
      handleCloseModal();
      await loadEmpresas();
    } catch (err) {
      console.error('Erro ao salvar empresa:', err);
      alert('Erro ao salvar empresa');
    }
  };

  const getStatusBadge = (empresa) => {
    if (!empresa.ativo) return <Badge bg="danger">Inativa</Badge>;
    if (!empresa.validado) return <Badge bg="warning">Pendente</Badge>;
    return <Badge bg="success">Validada</Badge>;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Carregando empresas...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Gestão de Empresas</h2>
          <p className="text-muted mb-0">Gerir empresas registadas na plataforma</p>
        </div>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Nova Empresa
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
          <Card className="text-center border-0 bg-primary text-white">
            <Card.Body>
              <h3 className="fw-bold">{empresas.length}</h3>
              <small>Total de Empresas</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 bg-success text-white">
            <Card.Body>
              <h3 className="fw-bold">{empresas.filter(e => e.validado).length}</h3>
              <small>Empresas Validadas</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 bg-warning text-white">
            <Card.Body>
              <h3 className="fw-bold">{empresas.filter(e => !e.validado).length}</h3>
              <small>Pendentes de Validação</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 bg-danger text-white">
            <Card.Body>
              <h3 className="fw-bold">{empresas.filter(e => !e.ativo).length}</h3>
              <small>Empresas Inativas</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabela de Empresas */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-light">
          <h5 className="mb-0 fw-bold">Lista de Empresas</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive striped hover className="mb-0">
            <thead className="bg-primary text-white">
              <tr>
                <th>ID</th>
                <th>Nome da Empresa</th>
                <th>Email</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map(empresa => (
                <tr key={empresa.id}>
                  <td className="fw-bold">#{empresa.id}</td>
                  <td>{empresa.nome}</td>
                  <td>{empresa.email}</td>
                  <td>{getStatusBadge(empresa)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      {!empresa.validado && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleValidarEmpresa(empresa.id)}
                        >
                          Validar
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => handleShowModal(empresa)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDeleteEmpresa(empresa.id)}
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

      {/* Modal para Criar/Editar Empresa */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingEmpresa ? 'Editar Empresa' : 'Nova Empresa'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nome da Empresa</Form.Label>
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
              <Form.Check
                type="checkbox"
                label="Empresa Validada"
                checked={formData.validado}
                onChange={(e) => setFormData({ ...formData, validado: e.target.checked })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {editingEmpresa ? 'Atualizar' : 'Criar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
