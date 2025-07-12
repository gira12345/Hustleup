import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Badge, Modal, Alert, Spinner } from 'react-bootstrap';
import { adminAPI } from '../services/api';

export default function AdminPropostasSection() {
  const [propostas, setPropostas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProposta, setSelectedProposta] = useState(null);

  useEffect(() => {
    loadPropostas();
  }, []);

  const loadPropostas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminAPI.getPropostas();
      if (response && response.ok) {
        const data = await response.json();
        
        // Garantir que os dados estão no formato correto
        const propostasFormatadas = Array.isArray(data) ? data.map(proposta => ({
          id: proposta.id,
          titulo: proposta.titulo || proposta.nome || 'Sem título',
          empresa: proposta.empresa?.nome || proposta.Empresa?.nome || proposta.empresa || 'Empresa não especificada',
          localizacao: proposta.localizacao || proposta.local || 'Localização não especificada',
          tipo: proposta.tipo || proposta.modalidade || 'Não especificado',
          estado: proposta.estado || proposta.status || 'pendente',
          data_criacao: proposta.createdAt || proposta.data_criacao || new Date().toISOString(),
          data_inicio: proposta.data_inicio || proposta.dataInicio || new Date().toISOString(),
          candidatos: proposta.candidatos || proposta.numeroCandidatos || 0
        })) : [];
        
        setPropostas(propostasFormatadas);
      } else {
        throw new Error('Erro ao carregar propostas');
      }
    } catch (err) {
      console.error('Erro ao carregar propostas:', err);
      setError('Erro ao carregar propostas');
      // Dados mock para desenvolvimento
      setPropostas([
        { 
          id: 1, 
          titulo: 'Desenvolvedor Frontend React',
          empresa: 'TechCorp',
          localizacao: 'Porto',
          tipo: 'Estágio',
          estado: 'pendente',
          data_criacao: '2024-01-15',
          data_inicio: '2024-03-01',
          candidatos: 5
        },
        { 
          id: 2, 
          titulo: 'Designer UX/UI',
          empresa: 'StartupX',
          localizacao: 'Lisboa',
          tipo: 'Part-time',
          estado: 'ativa',
          data_criacao: '2024-01-10',
          data_inicio: '2024-02-15',
          candidatos: 8
        },
        { 
          id: 3, 
          titulo: 'Analista de Marketing Digital',
          empresa: 'InnovaCorp',
          localizacao: 'Braga',
          tipo: 'Full-time',
          estado: 'rejeitada',
          data_criacao: '2024-01-05',
          data_inicio: '2024-02-01',
          candidatos: 2
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleValidarProposta = async (id) => {
    try {
      const response = await adminAPI.validarProposta(id);
      if (response && response.ok) {
        await loadPropostas(); // Recarregar lista
        alert('Proposta validada com sucesso!');
      } else {
        throw new Error('Erro ao validar proposta');
      }
    } catch (err) {
      console.error('Erro ao validar proposta:', err);
      alert('Erro ao validar proposta');
    }
  };

  const handleDeleteProposta = async (id) => {
    if (window.confirm('Tem certeza que deseja remover esta proposta?')) {
      try {
        const response = await adminAPI.deleteProposta(id);
        if (response && response.ok) {
          await loadPropostas();
          alert('Proposta removida com sucesso!');
        } else {
          throw new Error('Erro ao remover proposta');
        }
      } catch (err) {
        console.error('Erro ao remover proposta:', err);
        alert('Erro ao remover proposta');
      }
    }
  };

  const handleShowModal = (proposta) => {
    setSelectedProposta(proposta);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProposta(null);
  };

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'pendente':
        return <Badge bg="warning">Pendente</Badge>;
      case 'ativa':
        return <Badge bg="success">Ativa</Badge>;
      case 'rejeitada':
        return <Badge bg="danger">Rejeitada</Badge>;
      case 'expirada':
        return <Badge bg="secondary">Expirada</Badge>;
      default:
        return <Badge bg="light">Desconhecido</Badge>;
    }
  };

  const getTipoBadge = (tipo) => {
    switch (tipo) {
      case 'Estágio':
        return <Badge bg="primary">Estágio</Badge>;
      case 'Part-time':
        return <Badge bg="info">Part-time</Badge>;
      case 'Full-time':
        return <Badge bg="success">Full-time</Badge>;
      default:
        return <Badge bg="secondary">{tipo}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Carregando propostas...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Gestão de Propostas</h2>
          <p className="text-muted mb-0">Validar e gerir propostas de trabalho</p>
        </div>
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
              <h3 className="fw-bold">{propostas.length}</h3>
              <small>Total de Propostas</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 bg-warning text-white">
            <Card.Body>
              <h3 className="fw-bold">{propostas.filter(p => p.estado === 'pendente').length}</h3>
              <small>Pendentes de Validação</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 bg-success text-white">
            <Card.Body>
              <h3 className="fw-bold">{propostas.filter(p => p.estado === 'ativa').length}</h3>
              <small>Propostas Ativas</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-0 bg-info text-white">
            <Card.Body>
              <h3 className="fw-bold">
                {propostas.reduce((acc, p) => acc + (p.candidatos || 0), 0)}
              </h3>
              <small>Total de Candidatos</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabela de Propostas */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-light">
          <h5 className="mb-0 fw-bold">Lista de Propostas</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive striped hover className="mb-0">
            <thead className="bg-primary text-white">
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Empresa</th>
                <th>Localização</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Candidatos</th>
                <th>Data Criação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {propostas.map(proposta => (
                <tr key={proposta.id}>
                  <td className="fw-bold">#{proposta.id}</td>
                  <td>
                    <div className="fw-bold">{String(proposta.titulo)}</div>
                  </td>
                  <td>{String(proposta.empresa)}</td>
                  <td>{String(proposta.localizacao)}</td>
                  <td>{getTipoBadge(proposta.tipo)}</td>
                  <td>{getStatusBadge(proposta.estado)}</td>
                  <td>
                    <Badge bg="info" className="p-2">
                      {proposta.candidatos || 0}
                    </Badge>
                  </td>
                  <td>{new Date(proposta.data_criacao).toLocaleDateString('pt-PT')}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="outline-info"
                        onClick={() => handleShowModal(proposta)}
                      >
                        Ver
                      </Button>
                      {proposta.estado === 'pendente' && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleValidarProposta(proposta.id)}
                        >
                          Validar
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDeleteProposta(proposta.id)}
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

      {/* Modal para Ver Detalhes da Proposta */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Detalhes da Proposta #{selectedProposta?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProposta && (
            <div>
              <Row className="mb-3">
                <Col md={8}>
                  <h4 className="fw-bold text-primary">{selectedProposta.titulo}</h4>
                  <p className="text-muted mb-2">
                    <strong>Empresa:</strong> {selectedProposta.empresa}
                  </p>
                  <p className="text-muted mb-2">
                    <strong>Localização:</strong> {selectedProposta.localizacao}
                  </p>
                </Col>
                <Col md={4} className="text-end">
                  {getTipoBadge(selectedProposta.tipo)}
                  <br />
                  <br />
                  {getStatusBadge(selectedProposta.estado)}
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Card className="border-info">
                    <Card.Body className="text-center">
                      <h5 className="text-info">{selectedProposta.candidatos || 0}</h5>
                      <small className="text-muted">Candidatos</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-success">
                    <Card.Body className="text-center">
                      <h5 className="text-success">
                        {new Date(selectedProposta.data_inicio).toLocaleDateString('pt-PT')}
                      </h5>
                      <small className="text-muted">Data de Início</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <div className="mb-3">
                <h6 className="fw-bold">Informações Adicionais:</h6>
                <p className="text-muted">
                  Proposta criada em {new Date(selectedProposta.data_criacao).toLocaleDateString('pt-PT')}
                </p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fechar
          </Button>
          {selectedProposta?.estado === 'pendente' && (
            <Button 
              variant="success" 
              onClick={() => {
                handleValidarProposta(selectedProposta.id);
                handleCloseModal();
              }}
            >
              Validar Proposta
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
