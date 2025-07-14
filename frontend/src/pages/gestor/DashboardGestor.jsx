import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import DepartamentosDropdown from "./DepartamentosDropdown";

export default function DashboardGestor() {
  const navigate = useNavigate();
  const [propostas, setPropostas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [success, setSuccess] = useState("");
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    carregarPropostas();
  }, []);

  const carregarPropostas = async () => {
    try {
      const res = await api.get("/gestor/propostas");
      setPropostas(res.data);
    } catch (err) {
      setErro("Erro ao carregar propostas.");
    } finally {
      setLoading(false);
    }
  };

  const handleAprovar = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.patch(
        `/gestor/propostas/${id}/aprovar`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setErro("");
      setSuccess(res.data?.message || "Proposta aprovada com sucesso!");
      await carregarPropostas();
    } catch (err) {
      setSuccess("");
      setErro(err.response?.data?.message || "Erro ao aprovar proposta.");
    }
  };

  const handleDesativar = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.patch(
        `/gestor/propostas/${id}/desativar`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setErro("");
      setSuccess(res.data?.message || "Proposta desativada com sucesso!");
      await carregarPropostas();
    } catch (err) {
      setSuccess("");
      setErro(err.response?.data?.message || "Erro ao desativar proposta.");
    }
  };

  const handleAtivar = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.patch(
        `/gestor/propostas/${id}/ativar`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setErro("");
      setSuccess(res.data?.message || "Proposta ativada com sucesso!");
      await carregarPropostas();
    } catch (err) {
      setSuccess("");
      setErro(err.response?.data?.message || "Erro ao ativar proposta.");
    }
  };

  const handleArquivar = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.patch(
        `/gestor/propostas/${id}/arquivar`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setErro("");
      setSuccess(res.data?.message || "Proposta arquivada com sucesso!");
      await carregarPropostas();
    } catch (err) {
      setSuccess("");
      setErro(err.response?.data?.message || "Erro ao arquivar proposta.");
    }
  };

  const estados = {
    pendente: "bg-yellow-100 text-yellow-800",
    ativo: "bg-green-100 text-green-800",
    inativo: "bg-red-100 text-red-800",
    arquivado: "bg-gray-100 text-gray-800",
  };

  const propostasFiltradas = filtro
    ? propostas.filter((p) => p.departamento === filtro)
    : propostas;

  return (
    <div className="p-6">
      {erro && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {erro}
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div
          className="rounded-xl shadow-md flex flex-col items-center justify-center p-3 text-white text-center"
          style={{
            width: "100%",
            height: "140px",
            background: "rgb(15, 30, 54)",
          }}
        >
          <p className="text-xs font-medium opacity-80 mb-1">
            Total de Propostas
          </p>
          <p className="text-2xl font-bold leading-none">{propostas.length}</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex gap-4 items-center mb-4">
          <DepartamentosDropdown
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empresa
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
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                    A carregar propostas...
                  </td>
                </tr>
              ) : (
                propostasFiltradas.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td
                      className="px-6 py-4 whitespace-nowrap cursor-pointer text-blue-600 hover:underline"
                      onClick={() => navigate(`/gestor/ver-proposta/${p.id}`)}
                    >
                      {p.nome || p.titulo || "Sem título"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {p.empresa?.nome || p.empresaNome || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          estados[p.estado] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {p.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString("pt-PT")
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {p.estado === "pendente" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAprovar(p.id);
                            }}
                            className="bg-blue-400 hover:bg-blue-500 text-blue-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all shadow-sm min-w-[70px]"
                          >
                            Aprovar
                          </button>
                        )}
                        {p.estado === "ativo" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDesativar(p.id);
                            }}
                            className="bg-blue-400 hover:bg-blue-500 text-blue-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all shadow-sm min-w-[70px]"
                          >
                            Desativar
                          </button>
                        )}
                        {p.estado === "inativo" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAtivar(p.id);
                            }}
                            className="bg-blue-400 hover:bg-blue-500 text-blue-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all shadow-sm min-w-[70px]"
                          >
                            Ativar
                          </button>
                        )}
                        {(p.estado === "ativo" || p.estado === "inativo") && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArquivar(p.id);
                            }}
                            className="bg-blue-400 hover:bg-blue-500 text-blue-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all shadow-sm min-w-[70px]"
                          >
                            Arquivar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
