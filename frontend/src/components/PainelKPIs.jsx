import React, { useEffect, useState } from "react";
import { Users, Building2, ClipboardList, Briefcase, AlertTriangle } from "lucide-react";
import api from "../config/axios";

export default function PainelKPIs() {
  const [dados, setDados] = useState({
    totalUtilizadores: 0,
    empresasAtivas: 0,
    propostasPendentes: 0,
    totalDepartamentos: 0
  });
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const [utilizadoresRes, empresasRes, propostasRes, departamentosRes] = await Promise.all([
          api.get("/admin/kpi/utilizadores"),
          api.get("/admin/kpi/empresas"),
          api.get("/admin/kpi/propostas"),
          api.get("/admin/kpi/departamentos"),
        ]);

        setDados({
          totalUtilizadores: utilizadoresRes.data.total || 0,
          empresasAtivas: empresasRes.data.ativas || 0,
          propostasPendentes: propostasRes.data.pendentes || 0,
          totalDepartamentos: departamentosRes.data.total || 0
        });
        setErro(false);
      } catch (err) {
        setErro(true);
        console.error("Erro ao buscar KPIs:", err);
      }
    };

    fetchKPIs();
  }, []);

  const kpis = [
    {
      titulo: "Total de Utilizadores",
      valor: dados.totalUtilizadores,
      icone: <Users className="w-6 h-6 text-white" />,
    },
    {
      titulo: "Empresas Ativas",
      valor: dados.empresasAtivas,
      icone: <Building2 className="w-6 h-6 text-white" />,
    },
    {
      titulo: "Propostas Pendentes",
      valor: dados.propostasPendentes,
      icone: <ClipboardList className="w-6 h-6 text-white" />,
    },
    {
      titulo: "Departamentos",
      valor: dados.totalDepartamentos,
      icone: <Briefcase className="w-6 h-6 text-white" />,
    },
  ];

  if (erro) {
    return (
      <div className="flex flex-wrap gap-4 mb-8">
        <div style={{ width: 140, height: 140, background: '#0f1e36' }} className="rounded-xl shadow-md flex flex-col items-center justify-center p-3 text-white text-center animate-pulse">
          <AlertTriangle className="w-7 h-7 text-white mb-1" />
          <p className="text-xs font-medium opacity-80 mb-1">Erro ao carregar KPIs</p>
          <p className="text-base font-bold leading-none">Tente novamente mais tarde</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 mb-12">
      {kpis.map((kpi, idx) => (
        <div
          key={idx}
          style={{ width: 140, height: 140, background: '#0f1e36' }}
          className="rounded-3xl shadow-md flex flex-col items-center justify-center p-3 text-white text-center mb-4"
        >
          <div className="mb-1 flex items-center justify-center">{kpi.icone}</div>
          <p className="text-xs font-medium opacity-80 mb-1">{kpi.titulo}</p>
          <p className="text-2xl font-bold leading-none">{kpi.valor}</p>
        </div>
      ))}
    </div>
  );
}
