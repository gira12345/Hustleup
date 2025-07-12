import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { Card } from "react-bootstrap";

export default function EditarEmpresa() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [empresa, setEmpresa] = useState({
    nome: "",
    email: "",
    descricao: "",
    contacto: "",
  });
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    async function fetchEmpresa() {
      try {
        const res = await api.get(`/api/admin/empresas/${id}`);
        const data = res.data;
        setEmpresa({
          nome: data.nome || "",
          email: data.email || "",
          descricao: data.descricao || "",
          contacto: data.contacto || "",
        });
      } catch (err) {
        console.error("Erro ao carregar empresa:", err);
        setErro("Erro ao carregar dados da empresa");
      } finally {
        setLoading(false);
      }
    }
    fetchEmpresa();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmpresa((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    try {
      await api.put(`/api/admin/empresas/${id}`, empresa);
      setSucesso("Empresa atualizada com sucesso!");
      setTimeout(() => navigate("/admin/empresas"), 1500);
    } catch (err) {
      console.error("Erro ao atualizar empresa:", err);
      setErro("Erro ao atualizar empresa.");
    }
  };

  if (loading) {
    return <div className="text-center my-5">A carregar...</div>;
  }

  return (
    <Card className="shadow-sm border-0 rounded-4 p-4 max-w-2xl w-full mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 px-4 py-2 rounded-lg shadow-sm transition-all duration-200 text-sm font-semibold"
          onClick={() => navigate('/admin/empresas')}
        >
          <svg className="w-4 h-4 transform transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h4 className="mb-0">Editar Empresa</h4>
      </div>
      {erro && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-3">{erro}</div>}
      {sucesso && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-3">{sucesso}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            type="text"
            name="nome"
            value={empresa.nome}
            onChange={handleChange}
            required
            className="text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={empresa.email}
            onChange={handleChange}
            required
            className="text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea
            name="descricao"
            value={empresa.descricao}
            onChange={handleChange}
            rows={3}
            className="text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">Contacto</label>
          <input
            type="text"
            name="contacto"
            value={empresa.contacto}
            onChange={handleChange}
            className="text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold border-0 transition-all mr-2 shadow-sm min-w-[90px]"
          >
            Guardar Alterações
          </button>
        </div>
      </form>
    </Card>
  );
}
