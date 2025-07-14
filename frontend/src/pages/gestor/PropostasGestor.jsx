import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";

export default function PropostasGestor() {
  const [propostas, setPropostas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    buscarPropostas();
  }, []);

  const buscarPropostas = async () => {
    try {
      setLoading(true);
      const res = await api.get("/gestor/propostas");
      setPropostas(res.data || []);
    } catch (err) {
      setError("Erro ao carregar propostas");
    } finally {
      setLoading(false);
    }
  };

  const filtrarPropostas = () => {
    return propostas.filter((p) => {
      const pesquisaMatch =
        !pesquisa ||
        p.nome?.toLowerCase().includes(pesquisa.toLowerCase()) ||
        p.empresa?.nome?.toLowerCase().includes(pesquisa.toLowerCase());
      const estadoMatch =
        !filtro || p.estado?.toLowerCase() === filtro.toLowerCase();
      return pesquisaMatch && estadoMatch;
    });
  };

  const mudarEstado = async (id, acao) => {
    try {
      await api.patch(`/gestor/propostas/${id}/${acao}`);
      buscarPropostas();
    } catch (err) {
      console.error("Erro ao mudar estado:", err);
    }
  };

  const apagarProposta = async (id) => {
    if (!window.confirm("Tens a certeza que queres apagar esta proposta?"))
      return;
    try {
      await api.delete(`/gestor/propostas/${id}`);
      buscarPropostas();
    } catch (err) {
      console.error("Erro ao apagar proposta:", err);
    }
  };

  const normalizarEstado = (estado) => {
    if (!estado) return estado;
    return estado.toLowerCase().replace(/\s+/g, "_");
  };

  return (
    <div className="px-0 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Minhas Propostas
        </h2>
        <button
          onClick={() => navigate("/gestor/criar-proposta")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium"
        >
          Criar Proposta
        </button>
      </div>

      {loading && <p className="text-blue-600">Carregando propostas...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="bg-white shadow-md rounded-xl p-6">
        <div className="flex gap-4 items-center mb-6">
          <input
            type="text"
            placeholder="Pesquisar por nome ou empresa..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            className="px-3 py-2 border rounded-md w-1/2"
          />
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">Todos os estados</option>
            <option value="pendente">Pendente</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
            <option value="arquivado">Arquivado</option>
          </select>
        </div>

        <div className="overflow-x-auto border rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">Nome</th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Empresa
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Estado
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtrarPropostas().length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    Nenhuma proposta encontrada
                  </td>
                </tr>
              ) : (
                filtrarPropostas().map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-2">{p.nome || p.titulo || "Sem título"}</td>
                    <td className="px-4 py-2">{p.empresa?.nome || p.empresaNome || "N/A"}</td>
                    <td className="px-4 py-2 capitalize">{p.estado || "-"}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => navigate(`/gestor/ver-proposta/${p.id}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-blue-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all mr-2 shadow-sm min-w-[70px]"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => navigate(`/gestor/editar-proposta/${p.id}`)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all mr-2 shadow-sm min-w-[70px]"
                      >
                        Editar
                      </button>
                      {normalizarEstado(p.estado) === "pendente" && (
                        <button
                          onClick={() => mudarEstado(p.id, "aprovar")}
                          className="bg-green-400 hover:bg-green-500 text-green-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all mr-2 shadow-sm min-w-[70px]"
                        >
                          Aprovar
                        </button>
                      )}
                      {normalizarEstado(p.estado) === "ativo" && (
                        <>
                          <button
                            onClick={() => mudarEstado(p.id, "desativar")}
                            className="bg-orange-400 hover:bg-orange-500 text-orange-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all mr-2 shadow-sm min-w-[70px]"
                          >
                            Desativar
                          </button>
                          <button
                            onClick={() => mudarEstado(p.id, "arquivar")}
                            className="bg-purple-400 hover:bg-purple-500 text-purple-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all mr-2 shadow-sm min-w-[70px]"
                          >
                            Arquivar
                          </button>
                        </>
                      )}
                      {normalizarEstado(p.estado) === "inativo" && (
                        <>
                          <button
                            onClick={() => mudarEstado(p.id, "ativar")}
                            className="bg-blue-400 hover:bg-blue-500 text-blue-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all mr-2 shadow-sm min-w-[70px]"
                          >
                            Reativar
                          </button>
                          <button
                            onClick={() => mudarEstado(p.id, "arquivar")}
                            className="bg-purple-400 hover:bg-purple-500 text-purple-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all mr-2 shadow-sm min-w-[70px]"
                          >
                            Arquivar
                          </button>
                        </>
                      )}
                      {normalizarEstado(p.estado) === "arquivado" && (
                        <button
                          onClick={() => mudarEstado(p.id, "ativar")}
                          className="bg-blue-400 hover:bg-blue-500 text-blue-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all mr-2 shadow-sm min-w-[70px]"
                        >
                          Reativar
                        </button>
                      )}
                      <button
                        onClick={() => apagarProposta(p.id)}
                        className="bg-red-400 hover:bg-red-500 text-red-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all shadow-sm min-w-[70px]"
                      >
                        Apagar
                      </button>
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
