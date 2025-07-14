import React, { useEffect, useState } from "react";
import api from "../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "react-bootstrap";

export default function EditarUtilizador() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  console.log('EditarUtilizador - ID do utilizador:', id);

  useEffect(() => {
    const fetchUtilizador = async () => {
      try {
        console.log('Fazendo request para:', `/admin/estudantes/${id}`);
        setLoading(true);
        setError("");
        const res = await api.get(`/admin/estudantes/${id}`);
        console.log('Utilizador carregado:', res.data);
        setNome(res.data.nome);
        setEmail(res.data.email);
      } catch (err) {
        console.error("Erro ao carregar utilizador:", err);
        setError(`Erro ao carregar utilizador: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUtilizador();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Editando utilizador:', { nome, email });
      await api.put(`/admin/estudantes/${id}`, { nome, email });
      console.log('Utilizador editado com sucesso');
      navigate("/admin/utilizadores");
    } catch (err) {
      console.error("Erro ao editar utilizador:", err);
      setError(`Erro ao editar utilizador: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) {
    return (
      <Card className="shadow-sm border-0 rounded-4 p-4 max-w-2xl w-full mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            className="bg-blue-400 hover:bg-blue-500 text-blue-50 px-3 py-1 rounded text-xs font-semibold border-0 transition-all mr-2 shadow-sm min-w-[90px] flex items-center gap-2"
            onClick={() => navigate('/admin/utilizadores')}
          >
            <svg className="w-4 h-4 transform transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h4 className="mb-0">Editar Utilizador</h4>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p>Carregando...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <div className="px-8 py-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Editar Utilizador
        </h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <Card className="shadow-sm border-0 rounded-4 p-4 max-w-2xl w-full mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 px-4 py-2 rounded-lg shadow-sm transition-all duration-200 text-sm font-semibold"
          onClick={() => navigate('/admin/utilizadores')}
        >
          <svg className="w-4 h-4 transform transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h4 className="mb-0">Editar Utilizador</h4>
      </div>

      <div 
        className="bg-white shadow-md max-w-2xl w-full" 
        style={{ 
          borderRadius: '16px', 
          padding: '2rem' 
        }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          {/* Nome */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Botão Guardar */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold px-6 py-2 rounded-md shadow-sm transition-colors"
            >
              Guardar Alterações
            </button>
            <button
              type="button"
              className="bg-red-400 hover:bg-red-500 text-red-50 px-3 py-1 rounded text-xs font-semibold border-0 transition-all shadow-sm min-w-[90px]"
              onClick={async () => {
                if (window.confirm('Tem a certeza que deseja remover este utilizador?')) {
                  try {
                    await api.delete(`/admin/estudantes/${id}`);
                    navigate('/admin/utilizadores');
                  } catch (err) {
                    alert('Erro ao remover utilizador: ' + (err.response?.data?.message || err.message));
                  }
                }
              }}
            >
              Remover
            </button>
          </div>
        </form>
      </div>
    </Card>
  );
}
