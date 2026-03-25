/**
 * Página principal do módulo Telas Avançadas
 * V2: Suporte a 3 tipos (URL externa, arquivo HTML, código HTML)
 */

import React, { useState, useEffect } from 'react';
import { TelaAvancadaForm } from '../components/TelaAvancadaForm';
import { TelaAvancadaCard } from '../components/TelaAvancadaCard';
import { TelaAvancadaViewer } from '../components/TelaAvancadaViewer';
import { useTelasAvancadasStore } from '../store/telasAvancadas.store';
import { TelaAvancada } from '../types/telasAvancadas.types';

export const TelasAvancadasPage: React.FC = () => {
  const { telas, isLoading, error, loadTelas, removeTela, addTela } = useTelasAvancadasStore();
  const [showForm, setShowForm] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerTela, setViewerTela] = useState<TelaAvancada | null>(null);

  useEffect(() => {
    loadTelas();
  }, [loadTelas]);

  const handleOpenHtmlViewer = (htmlContent: string, title: string) => {
    // Cria uma tela temporária para o viewer
    const tempTela: TelaAvancada = {
      id: 'temp-viewer',
      type: 'html_code',
      title,
      htmlContent,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setViewerTela(tempTela);
    setViewerOpen(true);
  };

  const handleDeleteTela = async (tela: TelaAvancada) => {
    if (confirm(`Tem certeza que deseja excluir "${tela.title}"?`)) {
      await removeTela(tela.id);
    }
  };

  const handleEditTela = (tela: TelaAvancada) => {
    // TODO: Implementar edição
    alert(`Editar "${tela.title}" - Funcionalidade em desenvolvimento`);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      await addTela(formData);
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao adicionar tela:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#15151f] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-400">Carregando telas avançadas...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#15151f] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white mb-2">
                Telas Avançadas
              </h1>
              <p className="text-gray-400">
                Gerencie URLs externas, arquivos HTML e códigos HTML personalizados
              </p>
            </div>
            
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
            >
              + Nova Tela
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total de Telas</p>
                  <p className="text-2xl font-bold text-white mt-1">{telas.length}</p>
                </div>
                <div className="text-blue-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Arquivos HTML</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {telas.filter(t => t.type === 'html_file').length}
                  </p>
                </div>
                <div className="text-emerald-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Códigos HTML</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {telas.filter(t => t.type === 'html_code').length}
                  </p>
                </div>
                <div className="text-purple-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {telas.length === 0 && !isLoading && (
          <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Nenhuma tela avançada</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Comece adicionando sua primeira tela avançada. Você pode adicionar URLs externas, arquivos HTML ou código HTML personalizado.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
            >
              Criar Primeira Tela
            </button>
          </div>
        )}

        {/* Grid de telas */}
        {telas.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-white mb-6">Suas Telas ({telas.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {telas.map((tela) => (
                <div key={tela.id} className="relative group">
                  <TelaAvancadaCard
                    tela={tela}
                    onOpenHtmlViewer={handleOpenHtmlViewer}
                  />
                  
                  {/* Menu de ações */}
                  <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditTela(tela)}
                        className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors duration-200"
                        title="Editar"
                      >
                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteTela(tela)}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors duration-200"
                        title="Excluir"
                      >
                        <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal do formulário */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl">
              <div className="bg-gradient-to-b from-[#1a1a24] to-[#24242e] border border-white/10 rounded-2xl shadow-2xl">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Nova Tela Avançada</h2>
                    <button
                      onClick={() => setShowForm(false)}
                      className="p-2 hover:bg-white/5 rounded-lg transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <TelaAvancadaForm 
                    onSubmit={handleFormSubmit}
                    isLoading={isLoading}
                    error={error}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal do viewer */}
        {viewerOpen && viewerTela && (
          <div className="fixed inset-0 z-50">
            <TelaAvancadaViewer
              tela={viewerTela}
              onClose={() => {
                setViewerOpen(false);
                setViewerTela(null);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};