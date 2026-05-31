import React from 'react';

export const Toast: React.FC<{ message: string | null; type?: 'success' | 'error'; onClose?: () => void }> = ({ message, type = 'success', onClose }) => {
  if (!message) return null;
  return (
    <div className={`fixed bottom-5 right-5 z-[70] rounded-2xl border px-4 py-3 text-[12px] font-bold shadow-xl ${type === 'error' ? 'border-red-500/30 bg-red-500/15 text-red-700' : 'border-emerald-500/30 bg-emerald-500/15 text-emerald-700'}`}>
      <button type="button" onClick={onClose} className="mr-3 font-black">×</button>{message}
    </div>
  );
};

