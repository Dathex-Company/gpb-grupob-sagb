import React from 'react';

export const ConfirmDialog: React.FC<{ open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void }> = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl border border-sagb-line bg-sagb-panel p-5 shadow-2xl">
        <h2 className="text-lg font-black text-sagb-text">{title}</h2>
        <p className="mt-2 text-[13px] text-sagb-muted">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-xl bg-sagb-bg-2 px-4 py-2 text-[12px] font-bold text-sagb-muted">Cancelar</button>
          <button onClick={onConfirm} className="rounded-xl bg-red-600 px-4 py-2 text-[12px] font-black text-white">Confirmar</button>
        </div>
      </div>
    </div>
  );
};

