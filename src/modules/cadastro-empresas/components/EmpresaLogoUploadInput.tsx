import React from 'react';
import { CloudUploadIcon } from '../../../../components/Icon';
import EmpresaLogoPreview from './EmpresaLogoPreview';

interface EmpresaLogoUploadInputProps {
  previewUrl?: string | null;
  alt: string;
  onSelectFile: (file: File) => void;
  uploading?: boolean;
  disabled?: boolean;
}

const EmpresaLogoUploadInput: React.FC<EmpresaLogoUploadInputProps> = ({
  previewUrl,
  alt,
  onSelectFile,
  uploading = false,
  disabled = false
}) => {
  return (
    <label className={`relative w-10 h-10 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-all overflow-hidden bg-white shadow-sm group ${disabled ? 'border-gray-200 opacity-60 cursor-not-allowed' : 'border-indigo-200 hover:bg-white'}`}>
      {previewUrl ? (
        <EmpresaLogoPreview
          logoUrl={previewUrl}
          alt={alt}
          className="w-full h-full border-0 shadow-none rounded-none p-0 bg-transparent"
          emptyLabel=""
        />
      ) : (
        <CloudUploadIcon className={`w-4 h-4 ${disabled ? 'text-gray-300' : 'text-indigo-300 group-hover:text-indigo-500'}`} />
      )}

      <input
        type="file"
        className="hidden"
        accept="image/*"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onSelectFile(file);
          e.currentTarget.value = '';
        }}
      />

      {uploading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-[8px] font-black text-indigo-600 tracking-widest">
          UP
        </div>
      )}
    </label>
  );
};

export default EmpresaLogoUploadInput;
