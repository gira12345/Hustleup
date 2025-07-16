import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaStar, FaRegStar } from "react-icons/fa";

export default function DashboardUtilizador() {
  const navigate = useNavigate();
  const [propostas, setPropostas] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarPropostas();
    carregarFavoritos();
  }, []);

  const carregarPropostas = async () => {
    try {
      const resPropostas = await api.get("/propostas");
      setPropostas(resPropostas.data || []);
      
      const departamentosUnicos = [...new Set(
        (resPropostas.data || [])
          .map(p => p.departamento)
          .filter(Boolean)
      )];
      
      const departamentosFormatados = departamentosUnicos.map(nome => ({ id: nome, nome }));
      
      setDepartamentos(departamentosFormatados);
    } catch (err) {
      console.error("Erro ao carregar propostas:", err);
    } finally {
      setLoading(false);
    }
  };

  const carregarFavoritos = async () => {
    try {
      const res = await api.get("/estudante/favoritos");
      setFavoritos(res.data.map((f) => f.id));
    } catch (err) {
      console.error("Erro ao carregar favoritos:", err);
    }
  };

  const toggleFavorito = async (propostaId) => {
    try {
      if (favoritos.includes(propostaId)) {
        await api.delete(`/estudante/favoritos/${propostaId}`);
        setFavoritos(favoritos.filter((id) => id !== propostaId));
      } else {
        await api.post(`/estudante/favoritos/${propostaId}`);
        setFavoritos([...favoritos, propostaId]);
      }
    } catch (err) {
      console.error("Erro ao atualizar favorito:", err);
    }
  };

  // Filtro igual ao admin - simples e funcional
  const propostasFiltradas = filtro
    ? propostas.filter(proposta => proposta.departamento === filtro)
    : propostas;

  return (
    <div className="p-6">
      <div className="mb-4">
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os departamentos</option>
          {departamentos.map((dep) => (
            <option key={dep.id || dep.nome || dep} value={dep.nome || dep}>
              {dep.nome || dep}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p>A carregar propostas...</p>
      ) : propostasFiltradas.length === 0 ? (
        <p>Nenhuma proposta encontrada.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {propostasFiltradas.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl p-4 relative border border-gray-200 transition-shadow"
              style={{ margin: '15px' }}
            >
              <a 
                onClick={() => navigate(`/utilizador/propostas/${p.id}`)}
                className="text-2xl font-bold text-blue-600 mb-4 block hover:underline transition-all cursor-pointer"
                style={{ textDecoration: 'none' }}
              >
                {p.nome || p.titulo || 'Sem título'}
              </a>
              <p className="text-xs text-gray-500 mb-4">
                {(() => {
                  const empresaNome = p.Empresa?.nome || p.empresa?.nome || p.empresaNome || p.empresa || 'Sem empresa';
                  const departamento = p.departamento || (p.Setors && p.Setors.length > 0 ? p.Setors.map(s => s.nome).join(', ') : '-');
                  return [empresaNome, departamento].join(', ');
                })()}
              </p>
              <p className="text-sm text-gray-700 mb-1 line-clamp-3 max-h-14 overflow-hidden mb-2">
                {p.descricao}
            </p>
            <div className="flex justify-start mt-8">
              <button
                onClick={() => toggleFavorito(p.id)}
                className={`flex items-center gap-2 border border-gray-300 rounded-full p-2 transition-all bg-white ${favoritos.includes(p.id) ? 'text-blue-600 hover:bg-blue-100' : 'text-gray-400 hover:bg-yellow-100 hover:text-yellow-500'}`}
                title={favoritos.includes(p.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                style={{ background: 'white', border: '1px solid #d1d5db', padding: '0.5rem' }}
              >
                {favoritos.includes(p.id) ? <FaStar /> : <FaRegStar />}
                <span className={`text-xs font-medium ${favoritos.includes(p.id) ? 'text-blue-600' : 'text-gray-700'}`}>Favorito</span>
              </button>
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
}
