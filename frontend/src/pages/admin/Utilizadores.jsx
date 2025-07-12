import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";

export default function Utilizadores() {
  const [estudantes, setEstudantes] = useState([]);
  const [remocoes, setRemocoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(''); // Para mostrar o que está carregando
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking', 'online', 'offline'
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    const loadData = async () => {
      setLoading(true);
      setBackendStatus('checking');
      setLoadingStep('Conectando ao servidor...');
      
      try {
        // Tentar carregar utilizadores primeiro (mais crítico)
        setLoadingStep('Carregando utilizadores...');
        await fetchEstudantes();
        
        // Se os utilizadores carregaram, tentar carregar remoções
        setLoadingStep('Carregando pedidos de remoção...');
        await fetchRemocoes();
        
        setLoadingStep('Concluído!');
      } catch (err) {
        // Se chegou aqui, é porque o fetchEstudantes falhou
        console.error("Erro crítico ao carregar dados principais:", err);
        setLoadingStep('Erro ao carregar dados');
      } finally {
        setTimeout(() => {
          setLoading(false);
          setLoadingStep('');
        }, 300); // Pequeno delay para suavizar a transição
      }
    };
    loadData();
  }, []);

  const fetchEstudantes = async () => {
    const startTime = performance.now();
    try {
      console.log('Fazendo request para /api/admin/utilizadores');
      const res = await api.get("/api/admin/utilizadores", {
        timeout: 3000 // 3 segundos específico para esta request
      });
      const endTime = performance.now();
      console.log(`Utilizadores carregados em ${Math.round(endTime - startTime)}ms`);
      console.log('Resposta recebida:', res.data);
      
      // O backend retorna { utilizadores: [...] }
      setEstudantes(res.data.utilizadores || []);
      setError(null); // Limpar erro se os utilizadores carregaram
      setBackendStatus('online');
    } catch (err) {
      const endTime = performance.now();
      console.error(`Erro após ${Math.round(endTime - startTime)}ms:`, err);
      console.error("Detalhes do erro:", err.response?.data);
      console.error("Status:", err.response?.status);
      
      setBackendStatus('offline');
      setEstudantes([]);
      setError(`Erro ao conectar ao servidor: ${err.response?.status || 'Sem resposta'} - ${err.response?.data?.message || err.message}`);
      throw err; // Re-throw para que loadData saiba que falhou
    }
  };

  const fetchRemocoes = async () => {
    try {
      const res = await api.get("/api/admin/remocoes");
      setRemocoes(res.data || []);
      // Não limpar o erro aqui, pois pode ser do fetchEstudantes
    } catch (err) {
      console.error("Erro ao carregar pedidos de remoção:", err);
      
      // Se for 404 ou erro de "não encontrado", não é realmente um erro
      if (err.response?.status === 404) {
        console.log("Nenhum pedido de remoção encontrado (404 - normal)");
        setRemocoes([]);
        return; // Não definir erro para 404
      }
      
      // Apenas definir erro para outros tipos de erro, e só se não há erro anterior
      setRemocoes([]);
      if (!error && err.response?.status !== 500) {
        setError(`Erro ao carregar pedidos de remoção: ${err.response?.status || 'Sem resposta'}`);
      }
    }
  };

  const removerEstudante = async (id) => {
    if (!window.confirm("Tens a certeza que queres remover este utilizador?")) return;
    try {
      await api.delete(`/api/admin/utilizadores/${id}`);
      fetchEstudantes();
    } catch (err) {
      console.error("Erro ao remover utilizador:", err);
      alert(`Erro ao remover utilizador: ${err.response?.data?.message || err.message}`);
    }
  };

  const aprovarRemocao = async (id) => {
    try {
      await api.patch(`/api/admin/remocoes/${id}/aprovar`);
      fetchRemocoes();
      fetchEstudantes();
    } catch (err) {
      console.error("Erro ao aprovar pedido de remoção:", err);
      alert(`Erro ao aprovar pedido: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="px-0 py-10">
      {/* Título e botão */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestão de Utilizadores</h2>
        <button
          onClick={() => navigate("/admin/criar-utilizador")}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          disabled={backendStatus === 'offline'}
        >
          Criar Utilizador
        </button>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold">Problema de conectividade</p>
              <p className="text-sm">{error}</p>
              <p className="text-sm mt-1">
                <strong>Solução:</strong> Verifique se o backend está a correr na porta 3001
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Tentar Reconectar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Indicador de loading melhorado */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-gray-600">{loadingStep}</div>
          <div className="text-sm text-gray-400 mt-2">
            {loadingStep.includes('Conectando') && 'Verificando conexão com o servidor...'}
            {loadingStep.includes('utilizadores') && 'Obtendo lista de utilizadores...'}
            {loadingStep.includes('remoção') && 'Verificando pedidos pendentes...'}
          </div>
        </div>
      ) : (
        <>
          {/* Lista de Estudantes */}
          <div>
            <h3 className="text-xl font-semibold mb-3">
              Lista de Utilizadores ({estudantes.length})
            </h3>
            <div className="overflow-x-auto border rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-gray-200 bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nome</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {estudantes.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                        Nenhum utilizador encontrado
                      </td>
                    </tr>
                  ) : (
                    estudantes.map((e) => (
                      <tr key={e.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{e.nome}</td>
                        <td className="px-4 py-2">{e.email}</td>
                        <td className="px-4 py-2 space-x-2">
                          <button
                            onClick={() => navigate(`/admin/editar-utilizador/${e.id}`)}
                            className="bg-blue-400 hover:bg-blue-500 text-blue-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all mr-2 shadow-sm min-w-[70px]"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => removerEstudante(e.id)}
                            className="bg-red-400 hover:bg-red-500 text-red-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all shadow-sm min-w-[70px]"
                          >
                            Remover
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pedidos de Remoção */}
          <div>
            <h3 className="text-xl font-semibold mt-10 mb-3">
              Pedidos de Remoção ({remocoes.length})
            </h3>
            <div className="overflow-x-auto border rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-gray-200 bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nome</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Motivo</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {remocoes.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                        {backendStatus === 'online' 
                          ? "Nenhum pedido de remoção pendente" 
                          : "Não foi possível carregar pedidos de remoção"}
                      </td>
                    </tr>
                  ) : (
                    remocoes.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{r.nome}</td>
                        <td className="px-4 py-2">{r.email}</td>
                        <td className="px-4 py-2">{r.motivo}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => aprovarRemocao(r.id)}
                            className="bg-blue-400 hover:bg-blue-500 text-blue-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all shadow-sm min-w-[70px]"
                          >
                            Aprovar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
