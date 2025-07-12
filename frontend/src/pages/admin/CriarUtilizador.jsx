import React, { useState } from "react";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";

export default function CriarUtilizador() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/admin/estudantes", { nome, email, password });
      navigate("/admin/utilizadores");
    } catch (err) {
      console.error("Erro ao criar utilizador:", err);
    }
  };

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
        <h4 className="mb-0">Criar Novo Utilizador</h4>
      </div>

      {/* Caixa do formulário */}
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
              placeholder="Nome completo"
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
              placeholder="exemplo@email.com"
              required
              className="text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              className="text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Botão Criar */}
          <div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2 rounded-md shadow-sm"
            >
              Criar Utilizador
            </button>
          </div>
        </form>
      </div>
    </Card>
  );
}