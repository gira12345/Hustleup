import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";

export default function Gestores() {
  const [gestores, setGestores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    buscarGestores();
  }, []);

  const buscarGestores = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/admin/gestores");
      setGestores(res.data.gestores || []);
    } catch (err) {
      console.error("Erro ao buscar gestores:", err);
      setError(`Erro ao carregar gestores: ${err.response?.status || 'Sem resposta'}`);
      setGestores([]);
    } finally {
      setLoading(false);
    }
  };

  const removerGestor = async (id) => {
    if (!window.confirm("Tens a certeza que queres remover este gestor?")) return;
    try {
      await api.delete(`/api/admin/gestores/${id}`);
      buscarGestores();
    } catch (err) {
      console.error("Erro ao remover gestor:", err);
    }
  };

  // Fallback para garantir que algo sempre renderiza
  if (loading) {
    return (
      <div className="px-8 py-10">
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
          Carregando gestores...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-8 py-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
        <button 
          onClick={buscarGestores}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="px-8 py-10">
      {/* Topo com título e botão */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-2xl font-semibold text-gray-800">Gestão de Gestores</span>
        <button
          onClick={() => navigate("/admin/criar-gestor")}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-md shadow-sm ml-4"
        >
          Criar Novo Gestor
        </button>
      </div>

      {loading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
          Carregando gestores...
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-xl p-6">
        <div className="overflow-x-auto border rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">Nome</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Email</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {!loading && gestores.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-4 py-6 text-center text-gray-500">
                    Nenhum gestor encontrado
                  </td>
                </tr>
              ) : (
                gestores.map((gestor) => (
                  <tr key={gestor.id}>
                    <td className="px-4 py-2">{gestor.nome || "-"}</td>
                    <td className="px-4 py-2">{gestor.email || "-"}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => navigate(`/admin/editar-gestor/${gestor.id}`)}
                        className="bg-blue-400 hover:bg-blue-500 text-blue-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all mr-2 shadow-sm min-w-[70px]"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => removerGestor(gestor.id)}
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
    </div>
  );
}
