import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { Card, Button, Form } from "react-bootstrap";

export default function EditarGestor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // password opcional
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [departamentos, setDepartamentos] = useState([]);
  const [departamentosSelecionados, setDepartamentosSelecionados] = useState([]);

  useEffect(() => {
    buscarGestor();
    api.get("/api/admin/departamentos")
      .then(res => setDepartamentos(res.data))
      .catch(() => setDepartamentos([]));
    // Buscar departamentos já associados ao gestor
    api.get(`/api/admin/gestores/${id}/departamentos`).then(res => {
      setDepartamentosSelecionados(res.data.map(dep => dep.id));
    }).catch(() => setDepartamentosSelecionados([]));
  }, []);

  const buscarGestor = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/api/admin/gestores`);
      const gestor = res.data.gestores?.find((g) => g.id === parseInt(id));
      if (gestor) {
        setNome(gestor.nome);
        setEmail(gestor.email);
      } else {
        setError("Gestor não encontrado");
      }
    } catch (err) {
      console.error("Erro ao buscar gestor:", err);
      setError("Erro ao carregar dados do gestor");
    } finally {
      setLoading(false);
    }
  };

  const handleDepartamentosChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setDepartamentosSelecionados(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      const dados = { nome, email };
      if (password.trim()) dados.password = password;
      await api.put(`/api/admin/gestores/${id}`, dados);
      // Atualizar departamentos associados
      await api.post(`/api/admin/gestores/${id}/departamentos`, { departamentoIds: departamentosSelecionados });
      navigate("/admin/gestores");
    } catch (err) {
      console.error("Erro ao atualizar gestor:", err);
      setError(err.response?.data?.message || "Erro ao atualizar gestor");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="px-8 py-10">
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
          Carregando dados do gestor...
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-10">
      <Card className="shadow-sm border-0 rounded-4 p-4 max-w-2xl w-full mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => navigate("/admin/gestores")}
            className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 px-4 py-2 rounded-lg shadow-sm transition-all duration-200 text-sm font-semibold"
          >
            <svg className="w-4 h-4 transform transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h4 className="mb-0">Editar Gestor</h4>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        <Form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          <Form.Group className="flex flex-col mb-3">
            <Form.Label className="text-sm font-medium text-gray-700 mb-1">Nome</Form.Label>
            <Form.Control
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Form.Group>
          <Form.Group className="flex flex-col mb-3">
            <Form.Label className="text-sm font-medium text-gray-700 mb-1">Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Form.Group>
          <Form.Group className="flex flex-col mb-3">
            <Form.Label className="text-sm font-medium text-gray-700 mb-1">Nova Password (opcional)</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Deixa em branco para manter"
              className="text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <small className="text-gray-500 mt-1">Deixe em branco para manter a password atual</small>
          </Form.Group>
          <Form.Group className="flex flex-col mb-3">
            <Form.Label className="text-sm font-medium text-gray-700 mb-1">Departamentos</Form.Label>
            <Form.Control
              as="select"
              multiple
              value={departamentosSelecionados}
              onChange={handleDepartamentosChange}
              className="text-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {departamentos.map(dep => (
                <option key={dep.id} value={dep.id}>{dep.nome}</option>
              ))}
            </Form.Control>
            <small className="text-gray-500 mt-1">Segure Ctrl (Windows) ou Cmd (Mac) para selecionar múltiplos</small>
          </Form.Group>
          <div>
            <Button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold px-6 py-2 rounded-md shadow-sm transition-colors"
            >
              {saving ? "Guardando..." : "Guardar Alterações"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
