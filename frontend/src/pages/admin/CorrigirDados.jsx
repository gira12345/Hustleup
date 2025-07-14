import React, { useState } from 'react';
import api from '../../config/axios';

function CorrigirDados() {
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState({});

  const corrigirEmpresas = async () => {
    setLoading(true);
    try {
      const response = await api.post('/admin/corrigir/empresas');
      setResultados(prev => ({
        ...prev,
        empresas: response.data
      }));
      alert('Correção de empresas concluída! Verifique os resultados.');
    } catch (error) {
      console.error('Erro ao corrigir empresas:', error);
      alert('Erro ao corrigir empresas: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const corrigirEstudantes = async () => {
    setLoading(true);
    try {
      const response = await api.post('/admin/corrigir/estudantes');
      setResultados(prev => ({
        ...prev,
        estudantes: response.data
      }));
      alert('Correção de estudantes concluída! Verifique os resultados.');
    } catch (error) {
      console.error('Erro ao corrigir estudantes:', error);
      alert('Erro ao corrigir estudantes: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Correção de Dados</h1>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">⚠️ Atenção</h2>
        <p className="text-yellow-700">
          Esta página permite corrigir problemas de dados que podem ter surgido durante a criação de utilizadores.
          Execute apenas se houver problemas de login ou perfil.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Correção de Empresas */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">🏢 Corrigir Empresas</h3>
          <p className="text-gray-600 mb-4">
            Corrige empresas que foram criadas sem utilizador associado.
            Cria contas de utilizador para empresas que só existem na tabela Empresa.
          </p>
          <button
            onClick={corrigirEmpresas}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Corrigindo...' : 'Corrigir Empresas'}
          </button>
          
          {resultados.empresas && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <h4 className="font-semibold text-green-800">Resultados:</h4>
              <p className="text-green-700">{resultados.empresas.message}</p>
              <p className="text-sm text-green-600">
                Empresas corrigidas: {resultados.empresas.empresasCorrigidas} / {resultados.empresas.totalEmpresas}
              </p>
            </div>
          )}
        </div>

        {/* Correção de Estudantes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">👨‍🎓 Corrigir Estudantes</h3>
          <p className="text-gray-600 mb-4">
            Corrige estudantes que foram criados apenas na tabela User.
            Cria registos na tabela Estudante para utilizadores estudantes.
          </p>
          <button
            onClick={corrigirEstudantes}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Corrigindo...' : 'Corrigir Estudantes'}
          </button>
          
          {resultados.estudantes && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <h4 className="font-semibold text-green-800">Resultados:</h4>
              <p className="text-green-700">{resultados.estudantes.message}</p>
              <p className="text-sm text-green-600">
                Estudantes corrigidos: {resultados.estudantes.estudantesCorrigidos} / {resultados.estudantes.totalEstudantes}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">📋 Instruções</h3>
        <ol className="list-decimal list-inside text-blue-700 space-y-1">
          <li>Execute "Corrigir Empresas" se houver problemas de login de empresas</li>
          <li>Execute "Corrigir Estudantes" se perfis de estudantes não carregarem</li>
          <li>Após as correções, teste o login e perfis dos utilizadores</li>
          <li>As passwords padrão para empresas corrigidas é: <code className="bg-blue-100 px-1 rounded">empresa123</code></li>
        </ol>
      </div>
    </div>
  );
}

export default CorrigirDados;
