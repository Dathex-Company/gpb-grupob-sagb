import React, { useEffect, useState } from 'react';

/**
 * MockModeBanner — Alerta visual quando o TaskZei está operando em modo mock.
 *
 * Regra (decisao_011):
 * - Provider mock é fallback permanente de desenvolvimento, não dívida técnica.
 * - Em produção o padrão é VITE_TASKZEI_PROVIDER=supabase.
 * - Este banner alerta quando o modo mock está ativo.
 */
export const MockModeBanner: React.FC = () => {
  const [isMock, setIsMock] = useState(true);

  useEffect(() => {
    const provider = String(import.meta.env.VITE_TASKZEI_PROVIDER || 'supabase').toLowerCase();
    setIsMock(provider !== 'supabase');
  }, []);

  if (!isMock) return null;

  return (
    <div className="mx-3 mt-2 flex items-center gap-2 rounded-lg border border-[#e6c06d]/40 bg-[#fef9e7] px-3 py-2">
      {/* Ícone de alerta */}
      <svg
        className="h-4 w-4 shrink-0 text-[#b8860b]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
      <span className="text-[12px] font-medium text-[#8b6914]">
        Modo de Desenvolvimento — os dados não persistem. Para persistência real, configure{' '}
        <code className="rounded bg-[#e6c06d]/20 px-1 font-mono text-[11px]">VITE_TASKZEI_PROVIDER=supabase</code>.
      </span>
    </div>
  );
};
