import React from 'react';
import { BackIcon, EyeIcon } from '../../../../components/Icon';
import { EmpresaLogoPreview, EmpresaFichaSection } from '../components';
import { Empresa } from '../types';

interface CadastroEmpresaDetailPageProps {
  empresa: Empresa | null;
  empresaIdOrSlug: string;
  onBackToList: () => void;
}

const formatDate = (value?: Date) => {
  if (!value) return '--';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleString('pt-BR');
};

const textOrDash = (value?: unknown) => {
  const text = String(value ?? '').trim();
  return text || '--';
};

const Field: React.FC<{ label: string; value?: unknown }> = ({ label, value }) => (
  <div>
    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
    <p className="text-[12px] font-bold text-gray-700 mt-1 break-words">{textOrDash(value)}</p>
  </div>
);

export const CadastroEmpresaDetailPage: React.FC<CadastroEmpresaDetailPageProps> = ({
  empresa,
  empresaIdOrSlug,
  onBackToList
}) => {
  if (!empresa) {
    return (
      <div className="flex-1 h-full bg-white flex flex-col font-sans overflow-hidden">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToList}
              className="w-9 h-9 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center justify-center"
              title="Voltar para listagem"
            >
              <BackIcon className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-sm font-black text-gray-800 uppercase tracking-tight">Cadastro de Empresas</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Detalhe interno cadastral</p>
            </div>
          </div>
        </header>

        <div className="flex-1 px-6 py-6 bg-gray-50">
          <div className="bg-white border border-red-100 rounded-xl p-6">
            <p className="text-[11px] font-black text-red-700 uppercase tracking-widest">Empresa não encontrada</p>
            <p className="text-xs font-semibold text-gray-500 mt-2">
              Não foi possível localizar uma empresa para o identificador <span className="font-black">{empresaIdOrSlug || '--'}</span>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full bg-white flex flex-col font-sans overflow-hidden">
      <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToList}
            className="w-9 h-9 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center justify-center"
            title="Voltar para listagem"
          >
            <BackIcon className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-black text-gray-800 uppercase tracking-tight">Ficha Cadastral da Empresa</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Módulo Cadastro de Empresas</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Identificador</p>
          <p className="text-[11px] font-bold text-gray-700">{empresa.id}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto bg-gray-50 px-6 py-5 space-y-4 custom-scrollbar">
        <EmpresaFichaSection title="Identificação da empresa" subtitle="Entidade principal oficial do módulo">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Nome" value={empresa.nome} />
            <Field label="Nome Curto" value={empresa.nomeCurto} />
            <Field label="Slug" value={empresa.slug} />
            <Field label="Descrição Curta" value={empresa.descricaoCurta} />
          </div>
        </EmpresaFichaSection>

        <EmpresaFichaSection title="Classificação cadastral" subtitle="Status e tipificação oficial">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Status" value={empresa.status} />
            <Field label="Tipo" value={empresa.tipo} />
            <Field label="Esfera" value={empresa.esfera} />
            <Field label="Segmento" value={empresa.segmento} />
            <Field label="Nicho" value={empresa.nicho} />
            <Field label="Status de Validação" value={empresa.camposAuxiliares?.statusValidacao} />
          </div>
        </EmpresaFichaSection>

        <EmpresaFichaSection title="Presença digital básica" subtitle="Canais e referência principal">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Site URL" value={empresa.siteUrl} />
            <Field label="Logo URL" value={empresa.logoUrl} />
          </div>
        </EmpresaFichaSection>

        <EmpresaFichaSection title="Logo e mídia principal" subtitle="Visual de identificação cadastral">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl border border-gray-100 bg-white p-2">
              <EmpresaLogoPreview logoUrl={empresa.logoUrl} alt={empresa.nome} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logo oficial</p>
              <p className="text-xs text-gray-600 font-semibold mt-1 break-all">{textOrDash(empresa.logoUrl)}</p>
            </div>
          </div>
        </EmpresaFichaSection>

        <EmpresaFichaSection title="Informações auxiliares" subtitle="Campos de apoio estritamente cadastrais">
          {empresa.camposAuxiliares && Object.keys(empresa.camposAuxiliares).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(empresa.camposAuxiliares).map(([key, value]) => (
                <div key={key} className="grid grid-cols-12 gap-2 text-xs">
                  <p className="col-span-4 md:col-span-3 font-black text-gray-500 uppercase tracking-widest text-[9px]">{key}</p>
                  <p className="col-span-8 md:col-span-9 font-semibold text-gray-700 break-words">{textOrDash(typeof value === 'object' ? JSON.stringify(value) : value)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs font-semibold text-gray-500">Nenhum campo auxiliar cadastral informado.</p>
          )}
        </EmpresaFichaSection>

        <EmpresaFichaSection title="Metadados do cadastro" subtitle="Rastreabilidade e manutenção do registro">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Created At" value={formatDate(empresa.createdAt)} />
            <Field label="Updated At" value={formatDate(empresa.updatedAt)} />
            <Field label="Timestamp (legado)" value={formatDate(empresa.timestamp)} />
          </div>
        </EmpresaFichaSection>

        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 flex items-start gap-3">
          <EyeIcon className="w-4 h-4 text-indigo-500 mt-0.5" />
          <div>
            <p className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Preparada para expansão futura</p>
            <p className="text-xs font-semibold text-indigo-600 mt-1">
              Esta tela está delimitada à ficha cadastral da Empresa. Módulos de metas, tarefas, documentos, agentes e ecossistema visual
              permanecem fora deste escopo nesta etapa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroEmpresaDetailPage;
