import React, { useEffect, useState } from 'react';
import api from '../../config/axios';
import { Container, Row, Col, Dropdown, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function PropostasCompatíveis() {
  const [propostas, setPropostas] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [filtroArea, setFiltroArea] = useState('Todas');

  useEffect(() => {
    fetchPropostas();
    fetchFavoritos();
  }, []);

  const fetchPropostas = async () => {
    try {
      const response = await api.get('/estudante/propostas/compativeis');
      setPropostas(response.data);
    } catch (error) {
      console.error('Erro ao carregar propostas compatíveis:', error);
    }
  };

  const fetchFavoritos = async () => {
    try {
      const response = await api.get('/estudante/favoritos');
      setFavoritos(response.data.map((p) => p.id));
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  };

  const toggleFavorito = async (id) => {
    try {
      if (favoritos.includes(id)) {
        await api.delete(`/api/estudante/favoritos/${id}`);
        setFavoritos(favoritos.filter((f) => f !== id));
      } else {
        await api.post(`/api/estudante/favoritos/${id}`);
        setFavoritos([...favoritos, id]);
      }
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
    }
  };

  const areas = [...new Set(propostas.map((p) => p.areas || []).flat())].filter(Boolean);

  const propostasFiltradas = filtroArea === 'Todas'
    ? propostas
    : propostas.filter((p) => p.areas && p.areas.includes(filtroArea));

  return (
    <Container className="py-4">
      <Row className="mb-4 align-items-center">
        <Col><h3 className="fw-bold">Propostas Compatíveis</h3></Col>
        <Col md="auto">
          <Dropdown onSelect={(area) => setFiltroArea(area)}>
            <Dropdown.Toggle variant="outline-primary">
              {filtroArea}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="Todas">Todas</Dropdown.Item>
              {areas.map((area) => (
                <Dropdown.Item key={area} eventKey={area}>{area}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      <Row className="g-4">
        {propostasFiltradas.map((proposta) => (
          <Col key={proposta.id} md={4}>
            <div className="border rounded p-3 shadow-sm h-100 d-flex flex-column justify-content-between">
              <div>
                <h5 className="fw-semibold mb-1">{proposta.nome || proposta.titulo || 'Sem título'}</h5>
                <p className="text-muted small mb-2">{proposta.areas ? proposta.areas.join(', ') : 'Sem competências'}</p>
                <p className="text-truncate-3 mb-3">{proposta.descricao}</p>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <Link to={`/utilizador/propostas/${proposta.id}`} className="btn btn-sm btn-outline-primary">
                  Ver Proposta
                </Link>
                <Button
                  variant={favoritos.includes(proposta.id) ? 'warning' : 'outline-warning'}
                  size="sm"
                  onClick={() => toggleFavorito(proposta.id)}
                >
                  {favoritos.includes(proposta.id) ? '★' : '☆'}
                </Button>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default PropostasCompatíveis;
