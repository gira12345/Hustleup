import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import PainelKPIs from "../../components/PainelKPIs";

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [propostas, setPropostas] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Dados estáticos de fallback para departamentos
      const departamentosFallback = [
        { id: 1, nome: "Informática" },
        { id: 2, nome: "Gestão" },
        { id: 3, nome: "Marketing" },
        { id: 4, nome: "Engenharia" },
        { id: 5, nome: "Design" }
      ];
      
      let resPropostas, resDepartamentos;
      
      try {
        // Tentar primeiro com rotas admin
        [resPropostas, resDepartamentos] = await Promise.all([
          api.get("/api/admin/propostas"),
          api.get("/api/admin/departamentos")
        ]);
      } catch (adminError) {
        // Fallback para rotas públicas
        try {
          resPropostas = await api.get("/api/propostas");
          resDepartamentos = { data: departamentosFallback };
        } catch (publicError) {
          throw publicError;
        }
      }
      
      setPropostas(resPropostas.data || []);
      setDepartamentos(resDepartamentos.data || []);
    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
      setError(`Erro ao carregar dados: ${err.response?.status || 'Sem resposta'} - ${err.response?.data?.message || err.message}`);
      
      // Em último caso, usar dados totalmente estáticos
      setPropostas([]);
      setDepartamentos([
        { id: 1, nome: "Informática" },
        { id: 2, nome: "Gestão" },
        { id: 3, nome: "Marketing" },
        { id: 4, nome: "Engenharia" },
        { id: 5, nome: "Design" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const propostasFiltradas = filtro
    ? propostas.filter(proposta => proposta.departamento === filtro)
    : propostas;

  const getStatusBadge = (status) => {
    const badgeStyle = {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold'
    };

    switch (status) {
      case 'pendente':
        return { ...badgeStyle, backgroundColor: '#fef3c7', color: '#d97706' };
      case 'ativo':
        return { ...badgeStyle, backgroundColor: '#d1fae5', color: '#065f46' };
      case 'inativo':
        return { ...badgeStyle, backgroundColor: '#fee2e2', color: '#dc2626' };
      case 'arquivado':
        return { ...badgeStyle, backgroundColor: '#f3f4f6', color: '#374151' };
      default:
        return { ...badgeStyle, backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'ativo':
        return 'Ativo';
      case 'inativo':
        return 'Inativo';
      case 'arquivado':
        return 'Arquivado';
      default:
        return 'Pendente';
    }
  };

  const handleAprovar = async (id) => {
    try {
      setSuccess("");
      setError("");
      await api.patch(`/api/admin/propostas/${id}/aprovar`);
      setSuccess("Proposta aprovada com sucesso!");
      setTimeout(() => setSuccess(""), 3000); // Auto-hide após 3 segundos
      carregarDados(); // Recarregar dados
    } catch (err) {
      console.error("Erro ao aprovar proposta:", err);
      setError("Erro ao aprovar proposta");
    }
  };

  const handleDesativar = async (id) => {
    try {
      setSuccess("");
      setError("");
      await api.patch(`/api/admin/propostas/${id}/desativar`);
      setSuccess("Proposta desativada com sucesso!");
      setTimeout(() => setSuccess(""), 3000); // Auto-hide após 3 segundos
      carregarDados(); // Recarregar dados
    } catch (err) {
      console.error("Erro ao desativar proposta:", err);
      setError("Erro ao desativar proposta");
    }
  };

  const handleArquivar = async (id) => {
    try {
      setSuccess("");
      setError("");
      await api.patch(`/api/admin/propostas/${id}/arquivar`);
      setSuccess("Proposta arquivada com sucesso!");
      setTimeout(() => setSuccess(""), 3000); // Auto-hide após 3 segundos
      carregarDados(); // Recarregar dados
    } catch (err) {
      console.error("Erro ao arquivar proposta:", err);
      setError("Erro ao arquivar proposta");
    }
  };

  const handleAtivar = async (id) => {
    try {
      setSuccess("");
      setError("");
      await api.patch(`/api/admin/propostas/${id}/ativar`);
      setSuccess("Proposta ativada com sucesso!");
      setTimeout(() => setSuccess(""), 3000); // Auto-hide após 3 segundos
      carregarDados(); // Recarregar dados
    } catch (err) {
      console.error("Erro ao ativar proposta:", err);
      setError("Erro ao ativar proposta");
    }
  };

  const handlePropostaClick = (propostaId) => {
    navigate(`/admin/ver-proposta/${propostaId}`);
  };

  return (
    <div className="p-6">
      <PainelKPIs />
      {loading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
          Carregando dados do dashboard...
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
          {success}
        </div>
      )}
      {/* Listagem de Propostas */}
      <div>
        <div className="flex justify-between items-center">
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os departamentos</option>
            {departamentos.map(dep => (
              <option key={dep.id} value={dep.nome}>
                {dep.nome}
              </option>
            ))}
          </select>
        </div>
        {!loading && propostasFiltradas.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Nenhuma proposta encontrada.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {propostasFiltradas.map(proposta => (
                  <tr key={proposta.id} className="hover:bg-gray-50">
                    <td 
                      className="px-6 py-4 whitespace-nowrap cursor-pointer"
                      onClick={() => handlePropostaClick(proposta.id)}
                    >
                      <div className="flex items-center space-x-2">
                        <div>
                          <div className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">
                            {proposta.nome}
                          </div>
                          <div className="text-sm text-gray-500">
                            {proposta.descricao?.substring(0, 50)}...
                          </div>
                        </div>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {proposta.empresa?.nome || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {proposta.departamento || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span style={getStatusBadge(proposta.estado)}>
                        {getStatusText(proposta.estado)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {proposta.createdAt ? new Date(proposta.createdAt).toLocaleDateString('pt-PT') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {proposta.estado === 'pendente' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAprovar(proposta.id);
                            }}
                            className="bg-blue-400 hover:bg-blue-500 text-blue-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all shadow-sm min-w-[70px]"
                          >
                            Aprovar
                          </button>
                        )}
                        {(proposta.estado === 'ativa' || proposta.estado === 'ativo') && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDesativar(proposta.id);
                            }}
                            className="bg-blue-400 hover:bg-blue-500 text-blue-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all shadow-sm min-w-[70px]"
                          >
                            Desativar
                          </button>
                        )}
                        {proposta.estado === 'inativo' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAtivar(proposta.id);
                            }}
                            className="bg-blue-400 hover:bg-blue-500 text-blue-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all shadow-sm min-w-[70px]"
                          >
                            Ativar
                          </button>
                        )}
                        {((proposta.estado === 'ativa' || proposta.estado === 'ativo') || (proposta.estado === 'inativa' || proposta.estado === 'inativo')) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArquivar(proposta.id);
                            }}
                            className="bg-blue-400 hover:bg-blue-500 text-blue-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all shadow-sm min-w-[70px]"
                          >
                            Arquivar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}