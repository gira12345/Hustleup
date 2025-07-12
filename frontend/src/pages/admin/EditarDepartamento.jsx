import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/axios";

export default function EditarDepartamento() {
  const { id } = useParams();
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartamento = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/admin/departamentos/${id}`);
        setNome(res.data.nome);
      } catch (err) {
        console.error("Erro ao carregar departamento:", err);
        setError("Departamento não encontrado");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartamento();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      setError("Nome do departamento é obrigatório");
      return;
    }

    try {
      setSaving(true);
      setError("");
      
      await api.put(`/admin/departamentos/${id}`, { nome: nome.trim() });
      navigate("/admin/departamentos");
    } catch (err) {
      console.error("Erro ao editar departamento:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Erro ao editar departamento");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="px-8 py-10">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Carregando departamento...</div>
        </div>
      </div>
    );
  }

  if (error && !nome) {
    return (
      <div className="px-8 py-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button
          onClick={() => navigate("/admin/departamentos")}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          ← Voltar para Departamentos
        </button>
      </div>
    );
  }

  return (
    <div className="px-8 py-10">
      <div className="flex items-center mb-6">
        <button
          type="button"
          onClick={() => navigate("/admin/departamentos")}
          className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 px-4 py-2 rounded-lg shadow-sm transition-all duration-200 text-sm font-semibold mr-4"
        >
          <svg className="w-4 h-4 transform transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-2xl font-semibold text-gray-800">
          Editar Departamento
        </h2>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div
        className="bg-white shadow-md max-w-2xl w-full"
        style={{
          borderRadius: "16px",
          padding: "2rem",
        }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Nome do Departamento *
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome do departamento"
              required
              className="text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <small className="text-gray-500 mt-1">
              O nome deve ser único no sistema
            </small>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold px-6 py-2 rounded-md shadow-sm"
            >
              {saving ? "Guardando..." : "Guardar Alterações"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/departamentos")}
              className="bg-gray-500 hover:bg-gray-600 text-white text-sm font-semibold px-6 py-2 rounded-md shadow-sm"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}