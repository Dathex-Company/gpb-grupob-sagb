import React from 'react';

type RotaInterna =
  | '/metodologias'
  | '/metodologias/mesa'
  | '/metodologias/catalogo'
  | '/metodologias/saude'
  | `/metodologias/ativos/${string}`
  | `/metodologias/ativos/${string}/editar`;

interface MetodologiasInternalMenuProps {
  rotaAtiva: RotaInterna;
  onSelect: (rota: RotaInterna) => void;
}

const ITENS_MENU: { id: RotaInterna; label: string; icone: string }[] = [
  { id: '/metodologias', label: 'Home', icone: '🏠' },
  { id: '/metodologias/mesa', label: 'Mesa', icone: '🪟' },
  { id: '/metodologias/catalogo', label: 'Catálogo', icone: '📋' },
  { id: '/metodologias/saude', label: 'Saúde', icone: '❤️' },
];

export const MetodologiasInternalMenu: React.FC<MetodologiasInternalMenuProps> = ({
  rotaAtiva,
  onSelect,
}) => {
  const isRotaAtiva = (itemId: RotaInterna) => {
    if (itemId === '/metodologias') return rotaAtiva === '/metodologias';
    if (itemId === '/metodologias/mesa') return rotaAtiva === '/metodologias/mesa';
    if (itemId === '/metodologias/catalogo') return rotaAtiva === '/metodologias/catalogo';
    if (itemId === '/metodologias/saude') return rotaAtiva === '/metodologias/saude';
    return false;
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-3">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-sagb-muted px-1">
        Navegação
      </h3>

      <nav className="flex flex-col gap-1.5" aria-label="Navegação interna do Núcleo de Metodologias">
        {ITENS_MENU.map((item) => {
          const ativo = isRotaAtiva(item.id);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`w-full text-left rounded-xl px-3 py-2.5 text-[12px] font-bold transition-all border ${
                ativo
                  ? 'bg-sagb-blue text-white border-sagb-blue shadow-[0_4px_12px_rgba(37,99,235,0.3)]'
                  : 'bg-sagb-panel text-sagb-text border-sagb-line hover:border-sagb-blue/50 hover:text-sagb-blue'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <span className="text-base">{item.icone}</span>
                <span>{item.label}</span>
              </span>
            </button>
          );
        })}
      </nav>

      {(rotaAtiva.startsWith('/metodologias/ativos/') || rotaAtiva.endsWith('/editar')) && (
        <div className="pt-2 border-t border-sagb-line">
          <p className="text-[10px] text-sagb-muted px-1 leading-relaxed">
            Modo detalhamento ativo
          </p>
        </div>
      )}
    </aside>
  );
};
