import React, { useState, useEffect } from 'react';
import api from '../../config/axios';

function PerfilUser() {
  const [perfil, setPerfil] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    foto: '',
    curso: '',
    instituicao: '',
    anoConclusao: '',
    competencias: '',
    idiomas: '',
    linkedin: '',
    areasInteresse: [],
    descricao: ''
  });
  const [remocaoLoading, setRemocaoLoading] = useState(false);

  useEffect(() => {
    api.get('/estudante/perfil').then((res) => {
      setPerfil(res.data);
      setFormData(res.data);
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.patch('/estudante/perfil', formData);
    setEditando(false);
    setPerfil(formData);
  };

  const handleRemocao = async () => {
    setRemocaoLoading(true);
    try {
      const res = await api.post('/estudante/remover', {
        estudanteId: perfil.id || perfil.estudanteId
      });
      alert(res.data?.message || 'Pedido de remoção enviado com sucesso!');
    } catch (err) {
      let msg = 'Erro ao pedir remoção.';
      if (err.response && err.response.data && err.response.data.message) {
        msg += '\n' + err.response.data.message;
      }
      alert(msg);
      console.error('Erro ao pedir remoção:', err);
      if (err.response) {
        console.error('Resposta do backend:', err.response.data);
      }
    }
    setRemocaoLoading(false);
  };

  if (!perfil) return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-center text-gray-600">A carregar perfil...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          {/* Cabeçalho do perfil */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-200">
              {/* Avatar placeholder removed */}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-blue-600 mb-2">{perfil.nome}</h1>
            </div>
          </div>

          {/* Informações do perfil */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <span className="font-semibold text-gray-900">Curso:</span>
                <p className="text-gray-700 mt-1">{perfil.curso}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Instituição:</span>
                <p className="text-gray-700 mt-1">{perfil.instituicao}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Ano de Conclusão:</span>
                <p className="text-gray-700 mt-1">{perfil.anoConclusao}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Competências:</span>
                <p className="text-gray-700 mt-1">{perfil.competencias}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <span className="font-semibold text-gray-900">Idiomas:</span>
                <p className="text-gray-700 mt-1">{perfil.idiomas}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-900">LinkedIn:</span>
                <p className="text-blue-600 mt-1">
                  {perfil.linkedin ? (
                    <a href={perfil.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {perfil.linkedin}
                    </a>
                  ) : '-'}
                </p>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Contacto:</span>
                <p className="text-gray-700 mt-1">{perfil.telefone || perfil.contacto || perfil.User?.email || '-'}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-900">Sobre Mim:</span>
                <p className="text-gray-700 mt-1">{perfil.sobreMim}</p>
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={handleRemocao}
              className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium border border-red-300 hover:bg-red-200 transition"
              disabled={remocaoLoading}
            >
              {remocaoLoading ? 'A enviar pedido...' : 'Pedir remoção'}
            </button>
            <button
              onClick={() => setEditando(true)}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-300 hover:bg-blue-200 transition"
            >
              Editar
            </button>
          </div>
        </div>

        {/* Formulário de edição */}
        {editando && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Editar Perfil</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nome"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
                    <select
                      name="curso"
                      value={formData.curso}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selecione o curso</option>
                      <option value="Ciências e Tecnologia do Ambiente">Ciências e Tecnologia do Ambiente</option>
                      <option value="Contabilidade">Contabilidade</option>
                      <option value="Engenharia Civil">Engenharia Civil</option>
                      <option value="Engenharia do Ambiente">Engenharia do Ambiente</option>
                      <option value="Engenharia Eletrotécnica">Engenharia Eletrotécnica</option>
                      <option value="Engenharia Informática">Engenharia Informática</option>
                      <option value="Engenharia Mecânica">Engenharia Mecânica</option>
                      <option value="Gestão Industrial">Gestão Industrial</option>
                      <option value="Gestão de Empresas (inclui pós-laboral)">Gestão de Empresas (inclui pós-laboral)</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Tecnologia e Design de Mobiliário">Tecnologia e Design de Mobiliário</option>
                      <option value="Tecnologias e Design de Multimédia">Tecnologias e Design de Multimédia</option>
                      <option value="Turismo">Turismo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instituição</label>
                    <textarea
                      rows={2}
                      name="instituicao"
                      value={formData.instituicao}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Instituição"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ano de Conclusão</label>
                    <input
                      type="text"
                      name="anoConclusao"
                      value={formData.anoConclusao}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ano de Conclusão"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Competências</label>
                    <textarea
                      rows={3}
                      name="competencias"
                      value={formData.competencias}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Competências"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Idiomas</label>
                    <textarea
                      rows={2}
                      name="idiomas"
                      value={formData.idiomas}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Idiomas"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                    <textarea
                      rows={2}
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="LinkedIn"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <input
                      type="text"
                      name="telefone"
                      value={formData.telefone || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contacto (telefone)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sobre Mim</label>
                    <textarea
                      rows={3}
                      name="sobreMim"
                      value={formData.sobreMim || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Sobre Mim"
                    />
                  </div>
                </div>
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
    </div>
  );
}

export default PerfilUser;
