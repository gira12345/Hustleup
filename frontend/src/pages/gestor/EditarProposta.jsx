import React, { useEffect, useState } from "react";
import api from "../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "react-bootstrap";

export default function EditarPropostaGestor() {
  const [nome, setNome] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [morada, setMorada] = useState("");
  const [contracto, setContracto] = useState("");
  const [email, setEmail] = useState("");
  const [descricao, setDescricao] = useState("");
  const [areas, setAreas] = useState([]);
  const [areaInput, setAreaInput] = useState("");
  const [dataSubmissao, setDataSubmissao] = useState("");
  const [dataLimiteAtivacao, setDataLimiteAtivacao] = useState("");
  const [departamentos, setDepartamentos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [empresaId, setEmpresaId] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProposta = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/gestor/propostas/${id}`);
        setNome(res.data.nome || "");
        setDepartamento(res.data.departamento || "");
        setMorada(res.data.morada || "");
        setContracto(res.data.contracto || "");
        setEmail(res.data.email || "");
        setDescricao(res.data.descricao || "");
        setAreas(res.data.areas || []);
        setDataSubmissao(res.data.data_submissao || "");
        setDataLimiteAtivacao(res.data.data_limite_ativacao || "");
        setEmpresaId(res.data.empresaId || res.data.empresa_id || "");
      } catch (err) {
        setError(`Erro ao carregar proposta: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };
    const fetchDepartamentos = async () => {
      try {
        const res = await api.get('/gestor/departamentos');
        setDepartamentos(res.data);
      } catch (err) {
        setDepartamentos([]);
      }
    };
    const fetchEmpresas = async () => {
      try {
        const res = await api.get('/gestor/empresas');
        setEmpresas((res.data || []).filter(e => e.validado));
      } catch (err) {
        setEmpresas([]);
      }
    };
    if (id) fetchProposta();
    fetchDepartamentos();
    fetchEmpresas();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/gestor/propostas/${id}`, {
        nome,
        departamento,
        morada,
        contracto,
        email,
        descricao,
        areas,
        data_submissao: dataSubmissao,
        data_limite_ativacao: dataLimiteAtivacao,
        empresaId,
      });
      navigate("/gestor/propostas");
    } catch (err) {
      setError(`Erro ao editar proposta: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleAddArea = (e) => {
    e.preventDefault();
    if (areaInput.trim() && !areas.includes(areaInput.trim())) {
      setAreas([...areas, areaInput.trim()]);
      setAreaInput("");
    }
  };

  const handleRemoveArea = (area) => {
    setAreas(areas.filter(a => a !== area));
  };

  if (loading) {
    return (
      <Card className="shadow-sm border-0 rounded-4 p-4 max-w-2xl w-full mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            className="bg-blue-400 hover:bg-blue-500 text-blue-50 px-3 py-1 rounded text-xs font-semibold border-0 transition-all mr-2 shadow-sm min-w-[90px] flex items-center gap-2"
            onClick={() => navigate('/gestor/propostas')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h4 className="mb-0">Editar Proposta</h4>
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
          Editar Proposta
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
          onClick={() => navigate('/gestor/propostas')}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h4 className="mb-0">Editar Proposta</h4>
      </div>

      <div className="bg-white shadow-md max-w-2xl w-full rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
              className="text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Título da proposta"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Departamento</label>
            <select
              value={departamento}
              onChange={e => setDepartamento(e.target.value)}
              required
              className="text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione o departamento</option>
              {departamentos.map(dep => (
                <option key={dep.id} value={dep.nome}>{dep.nome}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Morada</label>
            <input
              type="text"
              value={morada}
              onChange={e => setMorada(e.target.value)}
              className="text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Morada/localização"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Contacto</label>
            <input
              type="text"
              value={contracto}
              onChange={e => setContracto(e.target.value)}
              className="text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email ou telefone de contacto"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email de contacto"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              required
              rows={5}
              className="text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descreve os detalhes da proposta"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Competências (tags)</label>
            <div className="flex mb-2">
              <input
                type="text"
                value={areaInput}
                onChange={e => setAreaInput(e.target.value)}
                className="text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                placeholder="Adicionar competência (ex: Informática)"
              />
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs px-3 py-1 rounded ml-2"
                onClick={handleAddArea}
              >
                Adicionar
              </button>
            </div>
            <div className="mb-2 flex flex-wrap gap-2">
              {areas.map(area => (
                <span key={area} className="badge bg-blue-500 text-white px-2 py-1 rounded">
                  {area} <span style={{cursor:'pointer'}} onClick={() => handleRemoveArea(area)}>×</span>
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Data de Submissão</label>
            <input
              type="date"
              value={dataSubmissao}
              onChange={e => setDataSubmissao(e.target.value)}
              className="text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Data Limite de Ativação</label>
            <input
              type="date"
              value={dataLimiteAtivacao}
              onChange={e => setDataLimiteAtivacao(e.target.value)}
              className="text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Empresa</label>
            <select
              value={empresaId}
              onChange={e => setEmpresaId(e.target.value)}
              required
              className="text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione a empresa</option>
              {empresas.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.nome}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2 rounded-md shadow-sm transition-colors"
            >
              Guardar Alterações
            </button>
          </div>
        </form>
      </div>
    </Card>
  );
}
