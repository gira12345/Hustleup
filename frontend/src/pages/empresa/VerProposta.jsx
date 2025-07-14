import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/axios";

export default function VerPropostaEmpresa() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposta, setProposta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Função para normalizar estados antigos para novos
  const normalizarEstado = (estado) => {
    if (!estado) return '';
    
    const mapeamento = {
      'ativa': 'ativo',
      'inativa': 'inativo', 
      'arquivada': 'arquivado',
      'aprovada': 'ativo',
      'validada': 'ativo',
      'desativada': 'inativo',
      'fechada': 'arquivado',
      'finalizada': 'arquivado',
      // Manter estados já corretos
      'pendente': 'pendente',
      'ativo': 'ativo',
      'inativo': 'inativo',
      'arquivado': 'arquivado'
    };
    
    return mapeamento[estado.toLowerCase()] || estado.toLowerCase();
  };

  // Função para obter a cor do badge do estado
  const getEstadoCor = (estado) => {
    const estadoNormalizado = normalizarEstado(estado);
    
    switch (estadoNormalizado) {
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'inativo':
        return 'bg-red-100 text-red-800';
      case 'arquivado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  useEffect(() => {
    const fetchProposta = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Verificar se temos token antes de fazer a requisição
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('tipo');
        
        console.log('VerPropostaEmpresa - Token:', !!token, 'UserType:', userType);
        
        if (!token) {
          console.log('Token não encontrado, redirecionando para login');
          navigate('/login');
          return;
        }
        
        const res = await api.get(`/propostas/${id}`);
        setProposta(res.data);
        
      } catch (err) {
        console.error('Erro ao carregar proposta:', err);
        
        // Se erro 401, redirecionar para login
        if (err.response?.status === 401) {
          console.log('Token expirado, redirecionando para login');
          localStorage.removeItem('token');
          localStorage.removeItem('tipo');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }
        
        setError(`Erro ao carregar proposta: ${err.response?.status || 'Sem resposta'}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProposta();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="px-8 py-10 max-w-4xl mx-auto">
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
          A carregar proposta...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-8 py-10 max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          type="button"
          onClick={() => navigate("/empresa/dashboard")}
          className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 px-4 py-2 rounded-lg shadow-sm transition-all duration-200 text-sm font-semibold"
        >
          <svg className="w-4 h-4 transform transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar ao Dashboard
        </button>
      </div>
    );
  }

  if (!proposta) {
    return (
      <div className="px-8 py-10 max-w-4xl mx-auto">
        <p className="text-gray-600">Proposta não encontrada.</p>
        <button
          type="button"
          onClick={() => navigate("/empresa/dashboard")}
          className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 px-4 py-2 rounded-lg shadow-sm transition-all duration-200 text-sm font-semibold mt-4"
        >
          <svg className="w-4 h-4 transform transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar ao Dashboard
        </button>
      </div>
    );
  }

  const estadoNormalizado = normalizarEstado(proposta.estado);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Área principal - Descrição da proposta */}
      <div className="flex-1 p-8 flex">
        <div className="max-w-4xl mx-auto w-full flex">
          <div className="bg-white rounded-lg p-6 border-l-4 border-blue-600 flex-1 flex flex-col">
            {/* Logo/Avatar da empresa */}
            <div className="flex items-start mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-200">
                <span className="text-2xl font-bold text-blue-600">
                  {(proposta.empresa?.nome || proposta.empresaNome) ? (proposta.empresa?.nome || proposta.empresaNome).charAt(0).toUpperCase() : ''}
                </span>
              </div>
              <div className="ml-4 flex-1">
                <h2 className="text-xl font-semibold text-blue-600">{proposta.empresa?.nome || proposta.empresaNome || ""}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => navigate("/empresa/dashboard")}
                    className="flex items-center gap-1 text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 px-3 py-1.5 rounded-md shadow-sm transition-all duration-200 text-sm font-semibold"
                  >
                    <svg className="w-4 h-4 transform transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h1 className="text-2xl font-bold text-gray-900 mb-0">{proposta.nome || proposta.titulo || 'Sem título'}</h1>
                </div>
              </div>
              <span className={`px-3 py-1 text-sm rounded-full font-medium ${getEstadoCor(proposta.estado)}`}>
                {estadoNormalizado.charAt(0).toUpperCase() + estadoNormalizado.slice(1)}
              </span>
            </div>

            {/* Descrição principal */}
            <div className="mb-6 flex-1">
              <div className="text-gray-700 leading-relaxed">
                {proposta.descricao || 'Sem descrição disponível'}
              </div>
            </div>

            {/* Experiência requerida */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Experiência requerida na área:</span> {proposta.experiencia || 'Não especificada'}
              </p>
            </div>

            {/* Ações do utilizador */}
            <div className="flex flex-wrap gap-3 mt-auto">
              <button
                onClick={() => window.open(`mailto:${proposta.email}`, '_blank')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
                disabled={!proposta.email}
              >
                Contactar Empresa
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Separador azul vertical */}
      <div className="w-1 bg-blue-600 mx-2"></div>

      {/* Painel lateral direito - Informações de contacto */}
      <div className="w-80 bg-white p-6 border-l-4 border-blue-600 rounded-lg h-full flex flex-col">
        <div className="mb-6">
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">Departamento:</span>
              <div className="text-gray-600">{proposta.departamento || 'Não especificado'}</div>
            </div>
            <div>
              <span className="font-medium text-gray-700">Competências:</span>
              <div className="mt-2">
                {proposta.areas && proposta.areas.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {proposta.areas.map((competencia, index) => (
                      <span 
                        key={index}
                        className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 text-xs font-medium"
                      >
                        {competencia}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-600">Não especificado</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-6 flex-1">
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-gray-700">{proposta.morada || 'Localização não especificada'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-700">{proposta.email || 'Email não disponível'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-gray-700">{proposta.contracto || 'Contacto não disponível'}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mt-auto">
          <div className="text-sm text-gray-600">
            <p><strong>Criada:</strong> {proposta.data_submissao ? new Date(proposta.data_submissao).toLocaleDateString() : 'Não especificada'}</p>
            <p><strong>Atualizada:</strong> {proposta.updatedAt ? new Date(proposta.updatedAt).toLocaleDateString() : 'Não especificada'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
