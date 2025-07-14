import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import api from '../../config/axios';

function PerfilUser() {
  const [perfil, setPerfil] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    foto: '',
    curso: '',
    instituicao: '',
    anoConclusao: '',
    competencias: '',
    idiomas: '',
    linkedin: '',
    areasInteresse: '',
    descricao: ''
  });
  const [remocaoLoading, setRemocaoLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get('/estudante/perfil');
        setPerfil(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
        setError('Erro ao carregar perfil do utilizador');
      } finally {
        setLoading(false);
      }
    };
    
    carregarPerfil();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSucesso('');
      await api.patch('/estudante/perfil', formData);
      setEditando(false);
      setPerfil(formData);
      setSucesso('Perfil atualizado com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      setError('Erro ao atualizar perfil. Tente novamente.');
    }
  };

  const handleRemocao = async () => {
    setRemocaoLoading(true);
    try {
      const res = await api.post('/estudante/remover', {
        estudanteId: perfil.id || perfil.estudanteId
      });
      setSucesso(res.data?.message || 'Pedido de remoção enviado com sucesso!');
    } catch (err) {
      let msg = 'Erro ao pedir remoção.';
      if (err.response && err.response.data && err.response.data.message) {
        msg += '\n' + err.response.data.message;
      }
      setError(msg);
      console.error('Erro ao pedir remoção:', err);
      if (err.response) {
        console.error('Resposta do backend:', err.response.data);
      }
    }
    setRemocaoLoading(false);
  };

  if (loading) return (
    <Card className="shadow-sm border-0 rounded-4 p-4">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">A carregar...</span>
        </div>
        <p className="mt-2 text-muted">A carregar perfil...</p>
      </div>
    </Card>
  );

  if (error && !editando) return (
    <Card className="shadow-sm border-0 rounded-4 p-4">
      <Alert variant="danger">{error}</Alert>
      <div className="text-center">
        <Button 
          onClick={() => window.location.reload()} 
          variant="primary"
        >
          Tentar novamente
        </Button>
      </div>
    </Card>
  );

  if (editando) {
    return (
      <Card className="shadow-sm border-0 rounded-4 p-4">
        <div className="d-flex align-items-center gap-2 mb-4">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setEditando(false)}
            className="d-flex align-items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </Button>
          <h4 className="mb-0">Editar Perfil</h4>
        </div>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {sucesso && <Alert variant="success">{sucesso}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                  placeholder="Nome completo"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Curso</Form.Label>
                <Form.Select
                  name="curso"
                  value={formData.curso}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione o curso</option>
                  <option value="Ciências e Tecnologia do Ambiente">Ciências e Tecnologia do Ambiente</option>
                  <option value="Contabilidade">Contabilidade</option>
                  <option value="Engenharia Civil">Engenharia Civil</option>
                  <option value="Engenharia do Ambiente">Engenharia do Ambiente</option>
                  <option value="Engenharia Eletrotécnica">Engenharia Eletrotécnica</option>
                  <option value="Engenharia Informática">Engenharia Informática</option>
                  <option value="Engenharia Mecânica">Engenharia Mecânica</option>
                  <option value="Gestão Industrial">Gestão Industrial</option>
                  <option value="Gestão de Empresas (inclui pós-laboral)">Gestão de Empresas (inclui pós-laboral)</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Tecnologia e Design de Mobiliário">Tecnologia e Design de Mobiliário</option>
                  <option value="Tecnologias e Design de Multimédia">Tecnologias e Design de Multimédia</option>
                  <option value="Turismo">Turismo</option>
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Instituição</Form.Label>
                <Form.Control
                  type="text"
                  name="instituicao"
                  value={formData.instituicao}
                  onChange={handleInputChange}
                  placeholder="Nome da instituição"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Ano de Conclusão</Form.Label>
                <Form.Control
                  type="text"
                  name="anoConclusao"
                  value={formData.anoConclusao}
                  onChange={handleInputChange}
                  placeholder="Ano de conclusão"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Idiomas</Form.Label>
                <Form.Control
                  type="text"
                  name="idiomas"
                  value={formData.idiomas}
                  onChange={handleInputChange}
                  placeholder="Ex: Português, Inglês, Espanhol"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>LinkedIn</Form.Label>
                <Form.Control
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/seu-perfil"
                />
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Competências</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="competencias"
                  value={formData.competencias}
                  onChange={handleInputChange}
                  required
                  placeholder="Descreva as suas competências técnicas e soft skills para destacar o seu perfil profissional"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Descrição/Sobre Mim</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder="Descreva-se brevemente"
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Áreas de Interesse</Form.Label>
                <Form.Control
                  type="text"
                  name="areasInteresse"
                  value={formData.areasInteresse}
                  onChange={handleInputChange}
                  placeholder="Ex: Desenvolvimento Web, Design, Marketing"
                />
              </Form.Group>
            </Col>
          </Row>
          
          <div className="d-flex gap-2">
            <Button variant="primary" type="submit">
              Guardar Alterações
            </Button>
            <Button variant="outline-secondary" onClick={() => setEditando(false)}>
              Cancelar
            </Button>
          </div>
        </Form>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-0 rounded-4 p-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h4 className="mb-0">Perfil do Utilizador</h4>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => setEditando(true)}
        >
          Editar
        </Button>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {sucesso && <Alert variant="success">{sucesso}</Alert>}
      
      <Row>
        <Col md={6}>
          <div className="mb-3">
            <strong className="text-muted">Nome:</strong>
            <p className="mb-0">{perfil?.nome || 'Não especificado'}</p>
          </div>
          
          <div className="mb-3">
            <strong className="text-muted">Curso:</strong>
            <p className="mb-0">{perfil?.curso || 'Não especificado'}</p>
          </div>
          
          <div className="mb-3">
            <strong className="text-muted">Instituição:</strong>
            <p className="mb-0">{perfil?.instituicao || 'Não especificado'}</p>
          </div>
          
          <div className="mb-3">
            <strong className="text-muted">Ano de Conclusão:</strong>
            <p className="mb-0">{perfil?.anoConclusao || 'Não especificado'}</p>
          </div>
          
          <div className="mb-3">
            <strong className="text-muted">Contacto:</strong>
            <p className="mb-0">{perfil?.contacto || perfil?.User?.email || 'Não especificado'}</p>
          </div>
        </Col>
        
        <Col md={6}>
          <div className="mb-3">
            <strong className="text-muted">Competências:</strong>
            <div className="bg-light p-3 rounded mt-2">
              <small className="text-muted d-block mb-2">
                <i>Liste as suas competências para que o sistema possa mostrar propostas compatíveis com o seu perfil.</i>
              </small>
              <p className="mb-0">{perfil?.competencias || 'Não especificado'}</p>
            </div>
          </div>
          
          {perfil?.idiomas && (
            <div className="mb-3">
              <strong className="text-muted">Idiomas:</strong>
              <p className="mb-0">{perfil.idiomas}</p>
            </div>
          )}
          
          {perfil?.linkedin && (
            <div className="mb-3">
              <strong className="text-muted">LinkedIn:</strong>
              <p className="mb-0">
                <a href={perfil.linkedin} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                  {perfil.linkedin}
                </a>
              </p>
            </div>
          )}
          
          {perfil?.descricao && (
            <div className="mb-3">
              <strong className="text-muted">Sobre Mim:</strong>
              <p className="mb-0">{perfil.descricao}</p>
            </div>
          )}
        </Col>
      </Row>
      
      <div className="border-top pt-3 mt-3">
        <Button
          variant="outline-danger"
          size="sm"
          onClick={handleRemocao}
          disabled={remocaoLoading}
        >
          {remocaoLoading ? 'A processar...' : 'Pedir Remoção'}
        </Button>
      </div>
    </Card>
  );
}

export default PerfilUser;
