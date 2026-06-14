import React from 'react';

export const CrudModal: React.FC<{ title: string; open: boolean; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode }> = ({ title, open, onClose, children, footer }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-sagb-line bg-sagb-panel p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-sagb-text">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-xl bg-sagb-bg-2 px-3 py-2 text-[12px] font-bold text-sagb-muted hover:text-sagb-text">Fechar</button>
        </div>
        <div>{children}</div>
        {footer && <div className="mt-5 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
};

