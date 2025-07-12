import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/axios";

export default function VerPropostaGestor() {
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
        const res = await api.get(`/api/gestor/propostas/${id}`);
        setProposta(res.data);
      } catch (err) {
        setError(`Erro ao carregar proposta: ${err.response?.status || 'Sem resposta'}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProposta();
    }
  }, [id]);

  const mudarEstado = async (acao) => {
    try {
      console.log(`Mudando estado da proposta ${id} para:`, acao);
      await api.patch(`/api/gestor/propostas/${id}/${acao}`);
      console.log('Estado alterado com sucesso');
      
      // Recarregar a proposta para ver o estado atualizado
      const res = await api.get(`/api/gestor/propostas/${id}`);
      setProposta(res.data);
    } catch (err) {
      console.error(`Erro ao ${acao} proposta:`, err);
      alert(`Erro ao ${acao} proposta. Tenta novamente.`);
    }
  };

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
          onClick={() => navigate("/gestor/propostas")}
          className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 px-4 py-2 rounded-lg shadow-sm transition-all duration-200 text-sm font-semibold"
        >
          <svg className="w-4 h-4 transform transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar às Propostas
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
          onClick={() => navigate("/gestor/propostas")}
          className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 px-4 py-2 rounded-lg shadow-sm transition-all duration-200 text-sm font-semibold mt-4"
        >
          <svg className="w-4 h-4 transform transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar às Propostas
        </button>
      </div>
    );
  }

  const estadoNormalizado = normalizarEstado(proposta.estado);

  return (
    <div className="p-6">
      {/* Botão de voltar */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/gestor/propostas")}
          className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 px-4 py-2 rounded-lg shadow-sm transition-all duration-200 text-sm font-semibold"
        >
          <svg className="w-4 h-4 transform transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Layout com duas colunas */}
      <div className="max-w-6xl mx-auto flex gap-6 items-start">
        {/* Coluna principal */}
        <div className="flex-1">
          <div className="bg-white rounded-xl p-6 border border-gray-200 transition-shadow" style={{ margin: '15px' }}>
            {/* Header do card */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-blue-600 mb-2 hover:underline transition-all">
                  {proposta.nome || 'Sem título'}
                </h1>
                <p className="text-xs text-gray-500 mb-4">
                  {(() => {
                    const empresaNome = proposta.Empresa?.nome || proposta.empresa?.nome || proposta.empresaNome || proposta.empresa || 'Sem empresa';
                    const departamento = proposta.departamento || (proposta.Setors && proposta.Setors.length > 0 ? proposta.Setors.map(s => s.nome).join(', ') : '-');
                    return [empresaNome, departamento].join(', ');
                  })()}
                </p>
              </div>
              <span className={`px-3 py-1 text-sm rounded-full font-medium ${getEstadoCor(proposta.estado)}`}>
                {estadoNormalizado.charAt(0).toUpperCase() + estadoNormalizado.slice(1)}
              </span>
            </div>

            {/* Descrição */}
            <div className="mb-6">
              <p className="text-sm text-gray-700 leading-relaxed">
                {proposta.descricao || 'Sem descrição disponível'}
              </p>
            </div>

            {/* Informações adicionais */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Experiência requerida:</h3>
                <p className="text-sm text-gray-600">{proposta.experiencia || 'Não especificada'}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Competências:</h3>
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
                    <span className="text-sm text-gray-600">Não especificado</span>
                  )}
                </div>
              </div>
            </div>

            {/* Datas */}
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="text-sm text-gray-600 grid md:grid-cols-2 gap-4">
                <p><strong>Criada:</strong> {proposta.data_submissao ? new Date(proposta.data_submissao).toLocaleDateString() : 'Não especificada'}</p>
                <p><strong>Atualizada:</strong> {proposta.updatedAt ? new Date(proposta.updatedAt).toLocaleDateString() : 'Não especificada'}</p>
              </div>
            </div>

            {/* Ações administrativas */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate(`/gestor/editar-proposta/${proposta.id}`)}
                className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg text-sm font-medium border border-yellow-300 hover:bg-yellow-200 transition"
              >
                Editar
              </button>
              
              {estadoNormalizado === "pendente" && (
                <button
                  onClick={() => mudarEstado("aprovar")}
                  className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium border border-green-300 hover:bg-green-200 transition"
                >
                  Aprovar
                </button>
              )}
              
              {estadoNormalizado === "ativo" && (
                <button
                  onClick={() => mudarEstado("desativar")}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium border border-red-300 hover:bg-red-200 transition"
                >
                  Desativar
                </button>
              )}
              
              {estadoNormalizado === "inativo" && (
                <button
                  onClick={() => mudarEstado("reativar")}
                  className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium border border-green-300 hover:bg-green-200 transition"
                >
                  Reativar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Coluna lateral - Informações de contacto */}
        <div className="w-80">
          <div className="bg-white rounded-xl p-6 border border-gray-200 transition-shadow" style={{ margin: '15px' }}>
            <h3 className="text-sm font-medium text-gray-700 mb-4">Informações de Contacto</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-700 text-sm">{proposta.morada || 'Localização não especificada'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-700 text-sm">{proposta.email || 'Email não disponível'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-700 text-sm">{proposta.contracto || 'Contacto não disponível'}</span>
              </div>
            </div>
            
            {/* Botões de administração */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-3">
                {estadoNormalizado === "ativo" && (
                  <>
                    <button
                      onClick={() => mudarEstado("desativar")}
                      className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg text-sm font-medium border border-orange-300 hover:bg-orange-200 transition"
                    >
                      Desativar
                    </button>
                    <button
                      onClick={() => mudarEstado("arquivar")}
                      className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium border border-purple-300 hover:bg-purple-200 transition"
                    >
                      Arquivar
                    </button>
                  </>
                )}
                
                {estadoNormalizado === "inativo" && (
                  <>
                    <button
                      onClick={() => mudarEstado("ativar")}
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-300 hover:bg-blue-200 transition"
                    >
                      Reativar
                    </button>
                    <button
                      onClick={() => mudarEstado("arquivar")}
                      className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium border border-purple-300 hover:bg-purple-200 transition"
                    >
                      Arquivar
                    </button>
                  </>
                )}
                
                {estadoNormalizado === "arquivado" && (
                  <button
                    onClick={() => mudarEstado("ativar")}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-300 hover:bg-blue-200 transition"
                  >
                    Reativar
                  </button>
                )}
                
                <button
                  onClick={async () => {
                    if (!window.confirm("Tens a certeza que queres apagar esta proposta permanentemente?")) return;
                    try {
                      await api.delete(`/api/gestor/propostas/${proposta.id}`);
                      navigate("/gestor/propostas");
                    } catch (err) {
                      alert("Erro ao apagar proposta. Tenta novamente.");
                    }
                  }}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium border border-red-300 hover:bg-red-200 transition"
                >
                  Apagar
                </button>
                
                <button
                  onClick={() => navigate(`/gestor/propostas`)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-200 transition"
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
