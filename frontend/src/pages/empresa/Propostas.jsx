import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";

export default function Propostas() {
  const [propostas, setPropostas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    buscarPropostas();
  }, []);

  const buscarPropostas = async () => {
    try {
      setLoading(true);
      setError("");
      // Buscar propostas da empresa específica
      const res = await api.get("/empresa/propostas");
      setPropostas(res.data || []);
    } catch (err) {
      console.error("Erro ao buscar propostas:", err);
      setError(`Erro ao carregar propostas`);
      // Dados mockados para teste
      setPropostas([
        {
          id: 1,
          nome: "Estágio em Desenvolvimento Web",
          descricao: "Oportunidade de estágio em desenvolvimento web com foco em React e Node.js",
          departamento: "Tecnologia",
          estado: "ativo",
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          nome: "Trainee em Marketing Digital",
          descricao: "Programa de trainee em marketing digital com foco em redes sociais",
          departamento: "Marketing",
          estado: "pendente",
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          nome: "Analista de Dados Júnior",
          descricao: "Posição para analista de dados com experiência em Python e SQL",
          departamento: "Tecnologia",
          estado: "inativo",
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const normalizarEstado = (estado) => {
    if (!estado) return '';
    const mapeamento = {
      'ativa': 'ativo',
      'inativa': 'inativo',
      'arquivada': 'arquivado',
      'pendente': 'pendente',
      'ativo': 'ativo',
      'inativo': 'inativo',
      'arquivado': 'arquivado'
    };
    return mapeamento[estado.toLowerCase()] || estado.toLowerCase();
  };

  const filtrarPropostas = () => {
    return propostas.filter((p) => {
      const semPesquisa = !pesquisa || pesquisa.trim() === "";
      const tituloMatch = p.nome ? p.nome.toLowerCase().includes(pesquisa.toLowerCase()) : false;
      const departamentoMatch = p.departamento ? p.departamento.toLowerCase().includes(pesquisa.toLowerCase()) : false;
      const pesquisaMatch = semPesquisa || tituloMatch || departamentoMatch;
      const estadoMatch = filtro ? normalizarEstado(p.estado) === filtro.toLowerCase() : true;
      return pesquisaMatch && estadoMatch;
    });
  };

  const mudarEstado = async (id, acao) => {
    try {
      await api.patch(`/empresa/propostas/${id}/${acao}`);
      buscarPropostas();
    } catch (err) {
      console.error("Erro ao mudar estado:", err);
    }
  };

  const apagarProposta = async (id) => {
    if (!window.confirm("Tens a certeza que queres apagar esta proposta permanentemente?")) return;
    try {
      await api.delete(`/empresa/propostas/${id}`);
      buscarPropostas();
    } catch (err) {
      console.error("Erro ao apagar proposta:", err);
    }
  };

  const verProposta = (proposta) => {
    const estadoNormalizado = normalizarEstado(proposta.estado);
    
    if (estadoNormalizado === 'ativa' || estadoNormalizado === 'ativo') {
      // Se a proposta está ativa, navegar para a página de visualização
      navigate(`/empresa/ver-proposta/${proposta.id}`);
    } else if (estadoNormalizado === 'pendente') {
      // Mensagem específica para propostas pendentes
      alert('Proposta pendente. Aguarde a aprovação para visualizar.');
    } else {
      // Mensagem para outros estados
      alert(`Proposta ${estadoNormalizado}. Apenas propostas ativas podem ser visualizadas.`);
    }
  };

  return (
    <div className="px-0 py-10">
      {/* Topo com título e botão */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Minhas Propostas
        </h2>
        <button
          onClick={() => navigate("/empresa/criar-proposta")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium"
        >
          Criar Proposta
        </button>
      </div>

      {loading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
          Carregando propostas...
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-xl p-6">
        <div className="flex gap-4 items-center mb-6">
          <input
            type="text"
            placeholder="Pesquisar por nome ou departamento..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            className="px-3 py-2 border rounded-md w-1/2"
          />
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">Todos os estados</option>
            <option value="pendente">Pendente</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
            <option value="arquivado">Arquivado</option>
          </select>
        </div>

        <div className="overflow-x-auto border rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">Nome</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Departamento</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Estado</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Criada em</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {!loading && filtrarPropostas().length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                    {propostas.length === 0 ? "Nenhuma proposta encontrada" : "Nenhuma proposta corresponde aos filtros"}
                  </td>
                </tr>
              ) : (
                filtrarPropostas().map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-2">{p.nome || "-"}</td>
                    <td className="px-4 py-2">{p.departamento || "-"}</td>
                    <td className="px-4 py-2">{normalizarEstado(p.estado) || "-"}</td>
                    <td className="px-4 py-2">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "-"}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => verProposta(p)}
                        className="bg-blue-500 hover:bg-blue-600 text-blue-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all mr-2 shadow-sm min-w-[70px]"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => navigate(`/empresa/editar-proposta/${p.id}`)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all mr-2 shadow-sm min-w-[70px]"
                      >
                        Editar
                      </button>

                      {normalizarEstado(p.estado) === "ativo" && (
                        <>
                          <button
                            onClick={() => mudarEstado(p.id, "desativar")}
                            className="bg-orange-400 hover:bg-orange-500 text-orange-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all mr-2 shadow-sm min-w-[70px]"
                          >
                            Desativar
                          </button>
                          <button
                            onClick={() => mudarEstado(p.id, "arquivar")}
                            className="bg-purple-400 hover:bg-purple-500 text-purple-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all mr-2 shadow-sm min-w-[70px]"
                          >
                            Arquivar
                          </button>
                        </>
                      )}

                      {normalizarEstado(p.estado) === "inativo" && (
                        <>
                          <button
                            onClick={() => mudarEstado(p.id, "ativar")}
                            className="bg-blue-400 hover:bg-blue-500 text-blue-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all mr-2 shadow-sm min-w-[70px]"
                          >
                            Reativar
                          </button>
                          <button
                            onClick={() => mudarEstado(p.id, "arquivar")}
                            className="bg-purple-400 hover:bg-purple-500 text-purple-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all mr-2 shadow-sm min-w-[70px]"
                          >
                            Arquivar
                          </button>
                        </>
                      )}

                      {normalizarEstado(p.estado) === "arquivado" && (
                        <button
                          onClick={() => mudarEstado(p.id, "ativar")}
                          className="bg-blue-400 hover:bg-blue-500 text-blue-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all mr-2 shadow-sm min-w-[70px]"
                        >
                          Reativar
                        </button>
                      )}
                      
                      <button
                        onClick={() => apagarProposta(p.id)}
                        className="bg-red-400 hover:bg-red-500 text-red-50 px-2 py-0.5 rounded text-xs font-semibold border-0 transition-all shadow-sm min-w-[70px]"
                      >
                        Apagar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
