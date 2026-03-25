/**
 * Componente Grid para exibir múltiplos cards de Telas Avançadas
 */

import React from 'react';
import { TelaAvancada } from '../types/telasAvancadas.types';
import { TelaAvancadaCard } from './TelaAvancadaCard';

interface TelasAvancadasGridProps {
  telas: TelaAvancada[];
  isLoading?: boolean;
  onCardClick?: (tela: TelaAvancada) => void;
}

export const TelasAvancadasGrid: React.FC<TelasAvancadasGridProps> = ({ 
  telas, 
  isLoading = false,
  onCardClick 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(6)].map((_, index) => (
          <div 
            key={index}
            className="h-[120px] rounded-2xl bg-gradient-to-b from-[#24272e] to-[#292d35] border border-white/5 animate-pulse"
            style={{
              boxShadow: '0 8px 32px rgba(0,0,0,0.38), 0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.02)'
            }}
          />
        ))}
      </div>
    );
  }

  if (telas.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-b from-[#24272e] to-[#292d35] border border-white/5 mb-4">
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-sm font-black uppercase tracking-widest text-white mb-2">
          Nenhuma Tela Cadastrada
        </h3>
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          Comece adicionando sua primeira tela HTML especial usando o formulário ao lado.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {telas.map((tela) => (
        <div 
          key={tela.id}
          className="w-full"
          style={{
            minWidth: '190px',
            maxWidth: '200px'
          }}
        >
          <TelaAvancadaCard 
            tela={tela} 
            onClick={onCardClick}
          />
        </div>
      ))}
    </div>
  );
};