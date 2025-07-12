import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";

export default function UtilizadoresGestor() {
  const [estudantes, setEstudantes] = useState([]);
  const [remocoes, setRemocoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setLoadingStep('Conectando ao servidor...');

      try {
        setLoadingStep('Carregando utilizadores...');
        await fetchEstudantes();

        setLoadingStep('Carregando pedidos de remoção...');
        await fetchRemocoes();

        setLoadingStep('Concluído!');
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setLoadingStep('Erro ao carregar dados');
      } finally {
        setTimeout(() => {
          setLoading(false);
          setLoadingStep('');
        }, 300);
      }
    };
    loadData();
  }, []);

  const fetchEstudantes = async () => {
    try {
      const res = await api.get("/api/gestor/utilizadores");
      setEstudantes(res.data.utilizadores || []);
      setBackendStatus('online');
    } catch (err) {
      console.error("Erro ao buscar utilizadores:", err);
      setBackendStatus('offline');
      setEstudantes([]);
      setError("Erro ao conectar com o servidor.");
    }
  };

  const fetchRemocoes = async () => {
    try {
      const res2 = await api.get("/api/gestor/pedidos-remocao");
      setRemocoes(res2.data || []);
    } catch (err) {
      console.error("Erro ao buscar remoções:", err);
      setRemocoes([]);
    }
  };

  const aprovarRemocao = async (id) => {
    try {
      await api.post(`/api/gestor/pedidos-remocao/${id}/aprovar`, { acao: 'aprovar' });
      fetchRemocoes();
      fetchEstudantes();
    } catch (err) {
      console.error("Erro ao aprovar pedido:", err);
      alert("Erro ao aprovar pedido de remoção");
    }
  };

  const removerEstudante = async (id) => {
    if (window.confirm('Tem a certeza que deseja remover este utilizador?')) {
      try {
        await api.delete(`/api/gestor/utilizadores/${id}`);
        fetchEstudantes();
      } catch (err) {
        alert('Erro ao remover utilizador: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  return (
    <div className="px-0 py-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestão de Utilizadores</h2>
        <div className="space-x-2">
          <button
            onClick={() => navigate("/gestor/criar-utilizador")}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
            disabled={backendStatus === 'offline'}
          >
            Criar Utilizador
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">Erro de conexão</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-gray-600">{loadingStep}</div>
        </div>
      ) : (
        <>
          <div>
            <h3 className="text-xl font-semibold mb-3">
              Lista de Estudantes ({estudantes.length})
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
                        Nenhum estudante encontrado
                      </td>
                    </tr>
                  ) : (
                    estudantes.map((e) => (
                      <tr key={e.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{e.nome}</td>
                        <td className="px-4 py-2">{e.email}</td>
                        <td className="px-4 py-2 space-x-2">
                          <button
                            onClick={() => navigate(`/gestor/editar-utilizador/${e.id}`)}
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
                        Nenhum pedido de remoção pendente
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
