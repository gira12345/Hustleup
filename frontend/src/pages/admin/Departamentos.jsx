import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";

export default function Departamentos() {
  const [departamentos, setDepartamentos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartamentos();
  }, []);

  const fetchDepartamentos = async () => {
    try {
      const res = await api.get("/admin/departamentos");
      setDepartamentos(res.data);
    } catch (err) {
      console.error("Erro ao carregar departamentos:", err);
    }
  };

  const removerDepartamento = async (id) => {
    if (!window.confirm("Tens a certeza que queres remover este departamento?")) return;
    try {
      await api.delete(`/admin/departamentos/${id}`);
      fetchDepartamentos();
    } catch (err) {
      console.error("Erro ao remover departamento:", err);
    }
  };

  return (
    <div className="px-0 py-10">
      <div className="flex justify-between items-center mb-6">
        <span className="text-2xl font-semibold text-gray-800">Gestão de Departamentos</span>
        <button
          onClick={() => navigate("/admin/criar-departamento")}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-md shadow-sm ml-4"
        >
          Criar Novo Departamento
        </button>
      </div>

      <div className="bg-white shadow-md max-w-4xl w-full rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-medium text-gray-700">Lista de Departamentos</span>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">Nome</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {departamentos.map((dep) => (
              <tr key={dep.id}>
                <td className="px-4 py-2">{dep.nome}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => removerDepartamento(dep.id)}
                    className="bg-red-400 hover:bg-red-500 text-red-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all shadow-sm min-w-[70px]"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
