/**
 * Componente Formulário para cadastrar nova Tela Avançada
 * V2: Suporte a URL externa, arquivo HTML e código HTML
 */

import React, { useState } from 'react';
import { TelaAvancadaFormData, TelaAvancadaType } from '../types/telasAvancadas.types';
import { TelaAvancadaTypeSelector } from './TelaAvancadaTypeSelector';

interface TelaAvancadaFormProps {
  onSubmit: (formData: TelaAvancadaFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

type FormState = {
  type: TelaAvancadaType;
  title: string;
  url: string;
  file: File | null;
  htmlContent: string;
};

export const TelaAvancadaForm: React.FC<TelaAvancadaFormProps> = ({ 
  onSubmit, 
  isLoading = false,
  error = null 
}) => {
  const [formState, setFormState] = useState<FormState>({
    type: 'external_url',
    title: '',
    url: '',
    file: null,
    htmlContent: ''
  });
  
  const [localError, setLocalError] = useState<string | null>(null);
  const [isReadingFile, setIsReadingFile] = useState(false);

  const handleTypeChange = (type: TelaAvancadaType) => {
    setFormState(prev => ({ ...prev, type }));
    setLocalError(null);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ ...prev, title: e.target.value }));
    if (localError) setLocalError(null);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ ...prev, url: e.target.value }));
    if (localError) setLocalError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormState(prev => ({ ...prev, file }));
    
    if (file) {
      // Valida se é um arquivo HTML
      if (!file.name.toLowerCase().endsWith('.html') && !file.name.toLowerCase().endsWith('.htm')) {
        setLocalError('Por favor, selecione um arquivo HTML (.html ou .htm)');
        return;
      }
      
      // Lê o conteúdo do arquivo
      setIsReadingFile(true);
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setFormState(prev => ({ ...prev, htmlContent: content }));
        setIsReadingFile(false);
        setLocalError(null);
      };
      
      reader.onerror = () => {
        setLocalError('Erro ao ler o arquivo. Tente novamente.');
        setIsReadingFile(false);
      };
      
      reader.readAsText(file);
    }
  };

  const handleHtmlContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormState(prev => ({ ...prev, htmlContent: e.target.value }));
    if (localError) setLocalError(null);
  };

  const validateForm = (): boolean => {
    // Validação do título
    if (!formState.title.trim()) {
      setLocalError('O título da tela é obrigatório');
      return false;
    }

    // Validações específicas por tipo
    switch (formState.type) {
      case 'external_url':
        if (!formState.url.trim()) {
          setLocalError('A URL da tela é obrigatória');
          return false;
        }
        
        if (!formState.url.startsWith('http://') && !formState.url.startsWith('https://')) {
          setLocalError('URL deve começar com http:// ou https://');
          return false;
        }
        
        // Validação básica de URL
        try {
          new URL(formState.url);
        } catch (_) {
          setLocalError('URL inválida');
          return false;
        }
        break;

      case 'html_file':
        if (!formState.file) {
          setLocalError('Por favor, selecione um arquivo HTML');
          return false;
        }
        
        if (!formState.htmlContent.trim()) {
          setLocalError('O arquivo HTML está vazio ou não pôde ser lido');
          return false;
        }
        break;

      case 'html_code':
        if (!formState.htmlContent.trim()) {
          setLocalError('O código HTML é obrigatório');
          return false;
        }
        
        if (formState.htmlContent.trim().length < 10) {
          setLocalError('O código HTML parece muito curto. Verifique se colou o conteúdo completo.');
          return false;
        }
        break;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      let formData: TelaAvancadaFormData;
      
      switch (formState.type) {
        case 'external_url':
          formData = {
            type: 'external_url',
            title: formState.title.trim(),
            url: formState.url.trim()
          };
          break;
          
        case 'html_file':
          if (!formState.file) {
            throw new Error('Arquivo não selecionado');
          }
          formData = {
            type: 'html_file',
            title: formState.title.trim(),
            file: formState.file
          };
          break;
          
        case 'html_code':
          formData = {
            type: 'html_code',
            title: formState.title.trim(),
            htmlContent: formState.htmlContent.trim()
          };
          break;
          
        default:
          throw new Error('Tipo de tela não suportado');
      }
      
      await onSubmit(formData);
      
      // Limpa o formulário após sucesso
      setFormState({
        type: 'external_url',
        title: '',
        url: '',
        file: null,
        htmlContent: ''
      });
      setLocalError(null);
      
    } catch (err) {
      console.error('Erro ao submeter formulário:', err);
      // Erro já será tratado pelo componente pai
    }
  };

  const displayError = error || localError;
  const isSubmitting = isLoading || isReadingFile;

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-gradient-to-b from-[#24272e] to-[#292d35] rounded-2xl border border-white/5 p-6 shadow-2xl"
      style={{
        boxShadow: '0 8px 32px rgba(0,0,0,0.38), 0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.02)'
      }}
    >
      <div className="mb-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-white mb-2">
          Nova Tela Avançada
        </h2>
        <p className="text-xs text-gray-400">
          Cadastre uma tela HTML especial para acesso rápido na biblioteca
        </p>
      </div>
      
      {/* Mensagem de erro */}
      {displayError && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-xs text-red-400 font-medium">{displayError}</p>
        </div>
      )}
      
      <div className="space-y-6">
        {/* Seletor de tipo */}
        <TelaAvancadaTypeSelector 
          selectedType={formState.type}
          onTypeChange={handleTypeChange}
          disabled={isSubmitting}
        />
        
        {/* Campo Título (comum a todos os tipos) */}
        <div>
          <label htmlFor="title" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            Título da Tela *
          </label>
          <input
            type="text"
            id="title"
            value={formState.title}
            onChange={handleTitleChange}
            placeholder="Ex: Dashboard Experimental"
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-gradient-to-b from-[#20242b] to-[#1f2329] border border-white/5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/20 transition-all duration-300"
            style={{
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.28), 0 1px 0 rgba(255,255,255,0.02)'
            }}
          />
        </div>
        
        {/* Campos específicos por tipo */}
        {formState.type === 'external_url' && (
          <div>
            <label htmlFor="url" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              URL da Tela *
            </label>
            <input
              type="url"
              id="url"
              value={formState.url}
              onChange={handleUrlChange}
              placeholder="https://exemplo.com/tela.html"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-gradient-to-b from-[#20242b] to-[#1f2329] border border-white/5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/20 transition-all duration-300"
              style={{
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.28), 0 1px 0 rgba(255,255,255,0.02)'
              }}
            />
            <p className="mt-1 text-[10px] text-gray-500">
              Use http:// ou https:// para links externos
            </p>
          </div>
        )}
        
        {formState.type === 'html_file' && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Arquivo HTML *
            </label>
            <div className="relative">
              <input
                type="file"
                id="file"
                accept=".html,.htm"
                onChange={handleFileChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-gradient-to-b from-[#20242b] to-[#1f2329] border border-white/5 rounded-xl text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-br file:from-[#0a84ff] file:to-[#005fcc] file:text-white hover:file:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300"
                style={{
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.28), 0 1px 0 rgba(255,255,255,0.02)'
                }}
              />
              
              {isReadingFile && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400" />
                </div>
              )}
            </div>
            
            {formState.file && (
              <div className="mt-2 p-3 bg-gradient-to-b from-[#20242b] to-[#1f2329] border border-white/5 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs text-gray-300">
                    {formState.file.name} • {(formState.file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                {formState.htmlContent && (
                  <p className="text-[10px] text-gray-500 mt-1">
                    {formState.htmlContent.length.toLocaleString()} caracteres lidos
                  </p>
                )}
              </div>
            )}
            
            <p className="mt-1 text-[10px] text-gray-500">
              Selecione um arquivo .html ou .htm. O conteúdo será armazenado internamente.
            </p>
          </div>
        )}
        
        {formState.type === 'html_code' && (
          <div>
            <label htmlFor="htmlContent" className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Código HTML *
            </label>
            <textarea
              id="htmlContent"
              value={formState.htmlContent}
              onChange={handleHtmlContentChange}
              placeholder="<!DOCTYPE html><html><head><title>Minha Tela</title></head><body>...</body></html>"
              disabled={isSubmitting}
              rows={8}
              className="w-full px-4 py-3 bg-gradient-to-b from-[#20242b] to-[#1f2329] border border-white/5 rounded-xl text-sm text-white placeholder-gray-500 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/20 transition-all duration-300 resize-y"
              style={{
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.28), 0 1px 0 rgba(255,255,255,0.02)'
              }}
            />
            <div className="flex justify-between mt-1">
              <p className="text-[10px] text-gray-500">
                Cole o código HTML completo. Será armazenado internamente.
              </p>
              {formState.htmlContent && (
                <p className="text-[10px] text-gray-400">
                  {formState.htmlContent.length.toLocaleString()} caracteres
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Botão de submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-br from-[#0a84ff] to-[#005fcc] text-white text-sm font-bold uppercase tracking-wider rounded-xl hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            style={{
              boxShadow: '0 4px 16px rgba(10,132,255,0.35), inset 0 1px 0 rgba(255,255,255,0.15)'
            }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {isReadingFile ? 'Lendo arquivo...' : 'Salvando...'}
              </span>
            ) : (
              'Adicionar à Biblioteca'
            )}
          </button>
        </div>
      </div>
      
      {/* Nota técnica */}
      <div className="mt-6 pt-4 border-t border-white/5">
        <p className="text-[10px] font-black uppercase text-blue-400 mb-1">Nota técnica V2</p>
        <p className="text-xs leading-relaxed text-gray-400">
          URLs externas abrem em nova aba. HTML armazenado (arquivo ou código) é renderizado internamente.
          Todo conteúdo é persistido localmente no navegador.
        </p>
      </div>
    </form>
  );
};