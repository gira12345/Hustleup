import React, { useEffect, useState } from "react";
import api from "../../config/axios";

export default function DepartamentosDropdown({ value, onChange }) {
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/gestor/departamentos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDepartamentos(res.data || []);
      } catch (err) {
        setDepartamentos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartamentos();
  }, []);

  return (
    <select
      value={value}
      onChange={onChange}
      className="px-3 py-2 border rounded-md w-full"
      disabled={loading}
    >
      <option value="">Todos os departamentos</option>
      {departamentos.map((dep) => (
        <option key={dep.id || dep.nome} value={dep.nome}>{dep.nome}</option>
      ))}
    </select>
  );
}
