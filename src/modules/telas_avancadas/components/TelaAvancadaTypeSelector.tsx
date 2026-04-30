/**
 * Componente para seleção do tipo de origem da Tela Avançada
 */

import React from 'react';
import { TelaAvancadaType } from '../types/telasAvancadas.types';

interface TelaAvancadaTypeSelectorProps {
  selectedType: TelaAvancadaType;
  onTypeChange: (type: TelaAvancadaType) => void;
  disabled?: boolean;
}

export const TelaAvancadaTypeSelector: React.FC<TelaAvancadaTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
  disabled = false
}) => {
  const typeOptions: Array<{ value: TelaAvancadaType; label: string; description: string; icon: string }> = [
    {
      value: 'external_url',
      label: 'URL Externa',
      description: 'Link para uma página web externa',
      icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
    },
    {
      value: 'html_file',
      label: 'Arquivo HTML',
      description: 'Upload de arquivo .html ou .htm',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    },
    {
      value: 'html_code',
      label: 'Código HTML',
      description: 'Cole o código HTML diretamente',
      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
          Origem da Tela *
        </label>
        <p className="text-xs text-gray-500 mb-4">
          Selecione como deseja cadastrar esta tela avançada
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {typeOptions.map((option) => {
          const isSelected = selectedType === option.value;
          
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onTypeChange(option.value)}
              disabled={disabled}
              className={`relative p-4 rounded-xl border transition-all duration-300 text-left focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                isSelected
                  ? 'bg-gradient-to-b from-[#1d3558] to-[#17304f] border-blue-500/30 shadow-lg shadow-blue-500/10'
                  : 'bg-gradient-to-b from-[#262a31] to-[#23272e] border-white/5 hover:border-blue-500/20 hover:shadow-md'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              style={{
                boxShadow: isSelected 
                  ? '0 8px 32px rgba(10,132,255,0.15), 0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)'
                  : '0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.02)'
              }}
            >
              {/* Ícone */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${
                isSelected 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'bg-white/5 text-gray-400'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={option.icon} />
                </svg>
              </div>

              {/* Título */}
              <h3 className={`text-sm font-bold mb-1 ${
                isSelected ? 'text-white' : 'text-gray-300'
              }`}>
                {option.label}
              </h3>

              {/* Descrição */}
              <p className="text-xs text-gray-400 leading-relaxed">
                {option.description}
              </p>

              {/* Indicador de seleção */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Nota sobre caminhos locais */}
      <div className="mt-4 p-3 bg-gradient-to-b from-[#20242b] to-[#1f2329] border border-amber-500/20 rounded-xl">
        <div className="flex items-start">
          <div className="w-4 h-4 rounded-full bg-amber-500/20 flex items-center justify-center mr-2 mt-0.5">
            <svg className="w-2 h-2 text-amber-400" fill="currentColor" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="4" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-amber-400 mb-1">Caminhos locais não são suportados</p>
            <p className="text-xs text-gray-400">
              Para telas locais, use <strong>Upload de arquivo HTML</strong> ou <strong>Cole o código HTML</strong>.
              O sistema não aceita caminhos como <code className="text-gray-300">D:\projetos\tela.html</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};