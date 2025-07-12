import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";

export default function EmpresasGestor() {
  const [empresas, setEmpresas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    buscarEmpresas();
  }, []);

  // Busca empresas diretamente do endpoint do gestor
  const buscarEmpresas = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/gestor/empresas");
      setEmpresas(res.data || []);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError("Acesso negado. Faça login como gestor.");
      } else {
        setError("Erro ao carregar empresas.");
      }
      setEmpresas([]);
    } finally {
      setLoading(false);
    }
  };

  const aprovarEmpresa = async (id) => {
    try {
      await api.patch(`/api/gestor/empresas/${id}/aprovar`);
      buscarEmpresas();
    } catch (err) {
      setError("Erro ao aprovar empresa.");
    }
  };

  const desativarEmpresa = async (id) => {
    try {
      await api.patch(`/api/gestor/empresas/${id}/desativar`);
      buscarEmpresas();
    } catch (err) {
      setError("Erro ao desativar empresa.");
    }
  };

  const apagarEmpresa = async (id) => {
    if (!window.confirm("Tens a certeza que queres apagar esta empresa permanentemente?")) return;
    try {
      await api.delete(`/api/gestor/empresas/${id}`);
      buscarEmpresas();
    } catch (err) {
      setError("Erro ao apagar empresa.");
    }
  };

  const empresasFiltradas = filtro
    ? empresas.filter((e) => {
        const estado = e.validado ? "ativo" : "pendente";
        return estado === filtro.toLowerCase();
      })
    : empresas;

  return (
    <div className="px-0 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Empresas</h2>
        <button
          onClick={() => navigate("/gestor/criar-empresa")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Criar Empresa
        </button>
      </div>

      {loading && <p className="text-blue-700">A carregar empresas...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="bg-white shadow-md rounded-xl p-6">
        <div className="flex gap-4 items-center mb-6">
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">Todos os estados</option>
            <option value="pendente">Pendente</option>
            <option value="ativo">Ativo</option>
          </select>
        </div>

        <div className="overflow-x-auto border rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">Nome</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Email</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Contacto</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Estado</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {!loading && empresasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                    Nenhuma empresa encontrada.
                  </td>
                </tr>
              ) : (
                empresasFiltradas.map((e) => (
                  <tr key={e.id}>
                    <td className="px-4 py-2">{e.nome}</td>
                    <td className="px-4 py-2">{e.email}</td>
                    <td className="px-4 py-2">{e.contacto}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          e.validado
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {e.validado ? "Ativo" : "Pendente"}
                      </span>
                      {e.userId == null && (
                        <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                          Sem utilizador
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => navigate(`/gestor/editar-empresa/${e.id}`)}
                        className="bg-blue-400 hover:bg-blue-500 text-blue-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all mr-2 shadow-sm min-w-[70px]"
                      >
                        Editar
                      </button>
                      {!e.validado && (
                        <button
                          onClick={() => aprovarEmpresa(e.id)}
                          className="bg-green-400 hover:bg-green-500 text-green-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all mr-2 shadow-sm min-w-[70px]"
                        >
                          Aprovar
                        </button>
                      )}
                      {e.validado && (
                        <button
                          onClick={() => desativarEmpresa(e.id)}
                          className="bg-orange-400 hover:bg-orange-500 text-orange-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all mr-2 shadow-sm min-w-[70px]"
                        >
                          Desativar
                        </button>
                      )}
                      <button
                        onClick={() => apagarEmpresa(e.id)}
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
