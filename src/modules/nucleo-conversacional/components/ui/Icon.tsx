import React from 'react';

// Estilo Base: Stroke Width 1.5, Round Caps/Joins (Phosphor Style)
const BaseIcon = ({ d, className }: { d: string, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d={d} />
  </svg>
);

// Ícones usados pelo Núcleo Conversacional (subconjunto do Icon.tsx global)
export const SearchIcon = ({ className }: { className?: string }) => (
  <BaseIcon d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z" className={className} />
);

export const BotIcon = ({ className }: { className?: string }) => (
  <BaseIcon d="M12 2a2 2 0 0 1 2 2v2h-4V4a2 2 0 0 1 2-2zM6 8h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2zM9 14h6" className={className} />
);

export const AlertTriangleIcon = ({ className }: { className?: string }) => (
  <BaseIcon d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" className={className} />
);

export const ChevronRightIcon = ({ className }: { className?: string }) => (
  <BaseIcon d="M9 18l6-6-6-6" className={className} />
);

export const XIcon = ({ className }: { className?: string }) => (
  <BaseIcon d="M18 6L6 18M6 6l12 12" className={className} />
);

export const CloudUploadIcon = ({ className }: { className?: string }) => (
  <BaseIcon d="M7 16a4 4 0 0 1-.88-7.903A5 5 0 1 1 15.9 6L16 6a5 5 0 0 1 1 9.9M12 13l0 9m0 0l-3-3m3 3l3-3" className={className} />
);

export const FileTextIcon = ({ className }: { className?: string }) => (
  <BaseIcon d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" className={className} />
);

export const MicIcon = ({ className }: { className?: string }) => (
  <BaseIcon d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" className={className} />
);

export const PencilIcon = ({ className }: { className?: string }) => (
  <BaseIcon d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" className={className} />
);

export const CheckIcon = ({ className }: { className?: string }) => (
  <BaseIcon d="M20 6L9 17l-5-5" className={className} />
);
