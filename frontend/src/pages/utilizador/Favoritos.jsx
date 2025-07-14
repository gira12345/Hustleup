import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { FaStar, FaRegStar } from "react-icons/fa";

export default function Favoritos() {
  const navigate = useNavigate();
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarFavoritos();
  }, []);

  const carregarFavoritos = async () => {
    try {
      const res = await api.get("/estudante/favoritos");
      setFavoritos(res.data || []);
    } catch (err) {
      console.error("Erro ao carregar favoritos:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorito = async (propostaId) => {
    try {
      await api.delete(`/estudante/favoritos/${propostaId}`);
      setFavoritos(favoritos.filter((p) => p.id !== propostaId));
    } catch (err) {
      console.error("Erro ao remover favorito:", err);
    }
  };

  return (
    <div className="p-6">
      {loading ? (
        <p>A carregar favoritos...</p>
      ) : favoritos.length === 0 ? (
        <p>Nenhuma proposta favorita encontrada.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoritos.map((p) => (
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
                {[p.empresaNome || (p.Empresa && p.Empresa.nome) || p.empresa || 'Sem empresa', p.departamento || (p.Setors && p.Setors.length > 0 ? p.Setors.map(s => s.nome).join(', ') : '-')].join(', ')}
              </p>
              <p className="text-sm text-gray-700 mb-1 line-clamp-3 max-h-14 overflow-hidden mb-2">
                {p.descricao}
              </p>
              <div className="flex justify-start mt-8">
                <button
                  onClick={() => toggleFavorito(p.id)}
                  className={`flex items-center gap-2 border border-gray-300 rounded-full p-2 transition-all bg-white text-blue-600 hover:bg-blue-100`}
                  title="Remover dos favoritos"
                  style={{ background: 'white', border: '1px solid #d1d5db', padding: '0.5rem' }}
                >
                  <FaStar />
                  <span className="text-xs font-medium text-blue-600">Favorito</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
