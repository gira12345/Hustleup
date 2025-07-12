import React, { useState, useEffect } from 'react';
import api from '../../config/axios';

const PerfilEmpresa = () => {
  const [perfil, setPerfil] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    setor: '',
    descricao: '',
    website: '',
    nif: '',
    numeroFuncionarios: '',
    anoFundacao: '',
    linkedinEmpresa: ''
  });
  const [formData, setFormData] = useState({});
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      setLoading(true);
      // Por agora, dados mockados - futuramente será: const response = await api.get('/empresa/perfil');
      const perfilMock = {
        nome: 'TechCorp Solutions',
        email: 'contato@techcorp.com',
        telefone: '234 567 890',
        endereco: 'Rua das Tecnologias, 123, Viseu',
        setor: 'Tecnologia',
        descricao: 'Empresa líder em soluções tecnológicas inovadoras, especializada em desenvolvimento de software e consultoria em TI.',
        website: 'https://techcorp.com',
        nif: '123456789',
        numeroFuncionarios: '50-100',
        anoFundacao: '2015',
        linkedinEmpresa: 'https://linkedin.com/company/techcorp'
      };
      setPerfil(perfilMock);
      setFormData(perfilMock);
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
      setError('Erro ao carregar perfil da empresa');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Futuramente será: await api.put('/empresa/perfil', formData);
      console.log('Perfil atualizado:', formData);
      setPerfil(formData);
      setEditando(false);
      setError('');
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      setError('Erro ao atualizar perfil da empresa');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">A carregar perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Perfil da Empresa</h1>
        <p className="text-gray-600">Gerir as informações da sua empresa</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Visualização do perfil */}
      {!editando && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          {/* Cabeçalho do perfil */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-200">
              {/* Avatar placeholder removed */}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-blue-600 mb-2">{perfil.nome}</h1>
              <p className="text-gray-600">{perfil.setor}</p>
            </div>
          </div>

          {/* Informações do perfil */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <span className="font-semibold text-gray-900">Email:</span>
                <p className="text-gray-700 mt-1">{perfil.email}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Telefone:</span>
                <p className="text-gray-700 mt-1">{perfil.telefone}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Endereço:</span>
                <p className="text-gray-700 mt-1">{perfil.endereco}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-900">NIF:</span>
                <p className="text-gray-700 mt-1">{perfil.nif}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Número de Funcionários:</span>
                <p className="text-gray-700 mt-1">{perfil.numeroFuncionarios}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <span className="font-semibold text-gray-900">Ano de Fundação:</span>
                <p className="text-gray-700 mt-1">{perfil.anoFundacao}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Website:</span>
                <p className="text-blue-600 mt-1">
                  {perfil.website ? (
                    <a href={perfil.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {perfil.website}
                    </a>
                  ) : '-'}
                </p>
              </div>
              <div>
                <span className="font-semibold text-gray-900">LinkedIn:</span>
                <p className="text-blue-600 mt-1">
                  {perfil.linkedinEmpresa ? (
                    <a href={perfil.linkedinEmpresa} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {perfil.linkedinEmpresa}
                    </a>
                  ) : '-'}
                </p>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Descrição:</span>
                <p className="text-gray-700 mt-1">{perfil.descricao}</p>
              </div>
            </div>
          </div>

          {/* Botão de ação */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={() => setEditando(true)}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-300 hover:bg-blue-200 transition"
            >
              Editar
            </button>
          </div>
        </div>
      )}

      {/* Formulário de edição */}
      {editando && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Editar Perfil da Empresa</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nome da empresa"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Setor</label>
                  <select
                    name="setor"
                    value={formData.setor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione o setor</option>
                    <option value="Tecnologia">Tecnologia</option>
                    <option value="Saúde">Saúde</option>
                    <option value="Educação">Educação</option>
                    <option value="Finanças">Finanças</option>
                    <option value="Manufactura">Manufactura</option>
                    <option value="Serviços">Serviços</option>
                    <option value="Construção">Construção</option>
                    <option value="Energia">Energia</option>
                    <option value="Turismo">Turismo</option>
                    <option value="Retail">Retail</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email da empresa"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Telefone da empresa"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIF</label>
                  <input
                    type="text"
                    name="nif"
                    value={formData.nif}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="NIF da empresa"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                  <textarea
                    rows={3}
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Endereço da empresa"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de Funcionários</label>
                  <select
                    name="numeroFuncionarios"
                    value={formData.numeroFuncionarios}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione o número de funcionários</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-100">51-100</option>
                    <option value="101-500">101-500</option>
                    <option value="500+">500+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ano de Fundação</label>
                  <input
                    type="text"
                    name="anoFundacao"
                    value={formData.anoFundacao}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ano de fundação"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Website da empresa"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn da Empresa</label>
                  <input
                    type="url"
                    name="linkedinEmpresa"
                    value={formData.linkedinEmpresa}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="LinkedIn da empresa"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição da Empresa</label>
              <textarea
                rows={4}
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descrição da empresa"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setEditando(false)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PerfilEmpresa;
