import React from 'react';

interface EmpresaFichaSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const EmpresaFichaSection: React.FC<EmpresaFichaSectionProps> = ({ title, subtitle, children }) => {
  return (
    <section className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <header className="mb-3">
        <h2 className="text-[11px] font-black text-gray-700 uppercase tracking-widest">{title}</h2>
        {subtitle && (
          <p className="text-[10px] font-semibold text-gray-400 mt-1">{subtitle}</p>
        )}
      </header>

      {children}
    </section>
  );
};

export default EmpresaFichaSection;
