import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import api from "../../config/axios";

export default function PropostasCompativeis() {
  const navigate = useNavigate();
  const [propostas, setPropostas] = useState([]);
  const [departamentoFiltro, setDepartamentoFiltro] = useState("");
  const [departamentos, setDepartamentos] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [pressedId, setPressedId] = useState(null);
  const [loadingFav, setLoadingFav] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    
    // Carregar propostas compatíveis
    api.get("/api/estudante/propostas/compativeis")
      .then((res) => {
        setPropostas(res.data);
        console.log('Propostas compatíveis recebidas:', res.data);
        if (res.data.length === 0) {
          console.log('Nenhuma proposta compatível encontrada - verifique se o estudante tem competências definidas');
        }
        
        // Extrair departamentos únicos das próprias propostas (isso garante que os nomes são exatos)
        const departamentosUnicos = [...new Set(
          res.data.map(p => p.departamento).filter(Boolean) // Remove valores null/undefined
        )];
        
        // Convertê-los para o formato esperado pelo dropdown
        const departamentosFormatados = departamentosUnicos.map(nome => ({ id: nome, nome }));
        
        console.log("Departamentos extraídos das propostas:", departamentosFormatados);
        setDepartamentos(departamentosFormatados);
      })
      .catch((err) => {
        console.error('Erro ao buscar propostas compatíveis:', err);
        if (err.response) {
          console.error('Status:', err.response.status);
          console.error('Data:', err.response.data);
        }
        // Mostrar erro para o usuário
        alert(`Erro ao carregar propostas compatíveis: ${err.response?.data?.message || err.message}`);
      });
      
    // Remover carregamento separado de setores - usamos apenas os das propostas
      
    // Carregar favoritos
    api.get("/api/estudante/favoritos")
      .then((res) => {
        setFavoritos(res.data.map((fav) => fav.id));
      })
      .catch((err) => {
        console.error('Erro ao buscar favoritos:', err);
      });
  }, []);

  const toggleFavorito = async (id) => {
    setLoadingFav(id);
    try {
      if (favoritos.includes(id)) {
        await api.delete(`/api/estudante/favoritos/${id}`);
        setFavoritos((prev) => prev.filter((fid) => fid !== id));
      } else {
        await api.post(`/api/estudante/favoritos/${id}`);
        setFavoritos((prev) => [...prev, id]);
      }
    } catch (err) {
      alert('Erro ao atualizar favorito!');
      console.error('Erro ao atualizar favorito:', err);
      // Adiciona log detalhado para backend
      if (err.response) {
        console.error('Resposta do backend:', err.response.data);
      }
    }
    setLoadingFav(null);
  };

  // Filtro igual ao admin - simples e funcional
  const propostasFiltradas = departamentoFiltro
    ? propostas.filter(proposta => proposta.departamento === departamentoFiltro)
    : propostas;

  return (
    <div className="p-6">
      <style>
        {`
          .star-blink {
            animation: blinkStar 0.5s linear infinite;
          }
          @keyframes blinkStar {
            0%, 100% { color: #eab308; }
            50% { color: #1e293b; }
          }
        `}
      </style>
      <div className="mb-4">
        <select
          value={departamentoFiltro}
          onChange={(e) => setDepartamentoFiltro(e.target.value)}
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3">
        {propostasFiltradas.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 mb-4">Nenhuma proposta compatível encontrada.</p>
            <p className="text-gray-400 text-sm">
              Certifique-se de que tem competências definidas no seu perfil ou experimente ajustar o filtro de departamento.
            </p>
          </div>
        ) : (
          propostasFiltradas.map((p, idx) => (
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
            
            {/* Competências compatíveis */}
            {p.areas && p.areas.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Competências compatíveis:</p>
                <div className="flex flex-wrap gap-1">
                  {p.areas.slice(0, 3).map((competencia, index) => (
                    <span 
                      key={index}
                      className="bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-200 text-xs font-medium"
                    >
                      {competencia}
                    </span>
                  ))}
                  {p.areas.length > 3 && (
                    <span className="text-xs text-gray-500">+{p.areas.length - 3} mais</span>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex justify-start mt-8">
              <button
                onClick={() => toggleFavorito(p.id)}
                disabled={loadingFav === p.id}
                className={`flex items-center gap-2 border border-gray-300 rounded-full p-2 transition-all bg-white ${favoritos.includes(p.id) ? 'text-blue-600 hover:bg-blue-100' : 'text-gray-400 hover:bg-yellow-100 hover:text-yellow-500'} ${loadingFav === p.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={favoritos.includes(p.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                style={{ background: 'white', border: '1px solid #d1d5db', padding: '0.5rem' }}
              >
                {favoritos.includes(p.id) ? <FaStar /> : <FaRegStar />}
                <span className={`text-xs font-medium ${favoritos.includes(p.id) ? 'text-blue-600' : 'text-gray-700'}`}>Favorito</span>
                {loadingFav === p.id && <span className="ml-2 text-xs text-gray-400">...</span>}
              </button>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
}
