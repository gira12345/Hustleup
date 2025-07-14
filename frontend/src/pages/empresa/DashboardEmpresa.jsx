import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";

const DashboardEmpresa = () => {
  const navigate = useNavigate();
  const [propostas, setPropostas] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarPropostas();
  }, []);

  const carregarPropostas = async () => {
    try {
      setLoading(true);
      console.log('Carregando todas as propostas...');
      
      // Buscar TODAS as propostas (não apenas da empresa logada)
      const resPropostas = await api.get("/propostas");
      console.log("Propostas carregadas:", resPropostas.data);
      
      setPropostas(resPropostas.data || []);
      
      // Extrair departamentos únicos das propostas
      const departamentosUnicos = [...new Set(
        (resPropostas.data || [])
          .map(p => p.departamento)
          .filter(Boolean)
      )];
      
      console.log("Departamentos encontrados:", departamentosUnicos);
      
      const departamentosFormatados = departamentosUnicos.map(nome => ({ id: nome, nome }));
      setDepartamentos(departamentosFormatados);
      
    } catch (err) {
      console.error("Erro ao carregar propostas:", err);
      
      // Mostrar erro específico
      if (err.response?.status === 401) {
        alert("Sessão expirada. Por favor, faça login novamente.");
        window.location.href = '/login';
      } else if (err.response?.status === 403) {
        alert("Acesso negado. Certifique-se de que está logado como empresa.");
      } else {
        console.error("Detalhes do erro:", err.response?.data || err.message);
        alert(`Erro ao carregar propostas: ${err.response?.data?.message || err.message}`);
      }
      
      // Dados vazios em caso de erro
      setPropostas([]);
      setDepartamentos([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtro igual ao dashboard do utilizador
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
              className="bg-white rounded-xl p-4 relative border border-gray-200 transition-shadow hover:shadow-md cursor-pointer"
              style={{ margin: '15px' }}
              onClick={() => navigate(`/empresa/proposta/${p.id}`)}
            >
              <h3 className="text-2xl font-bold text-blue-600 mb-4 block hover:underline transition-all">
                {p.nome || p.titulo || 'Sem título'}
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                {(() => {
                  const empresaNome = p.Empresa?.nome || 'Empresa não informada';
                  const departamento = p.departamento || 'Sem departamento';
                  return [empresaNome, departamento].join(', ');
                })()}
              </p>
              <p className="text-sm text-gray-700 mb-1 line-clamp-3 max-h-14 overflow-hidden mb-2">
                {p.descricao}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardEmpresa;
