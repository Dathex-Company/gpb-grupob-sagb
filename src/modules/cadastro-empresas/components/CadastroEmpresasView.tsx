import React, { useMemo, useState } from 'react';
import { SearchIcon, PlusIcon, TrashIcon, PencilIcon, CheckIcon, AlertCircleIcon, EyeIcon } from '../../../../components/Icon';
import { db, collection, addDoc, Timestamp } from '../../../../services/supabase';
import { Agent } from '../../../../types';
import { Empresa, EmpresaDraft } from '../types';
import {
  asDate,
  empresaEsfera,
  empresaLogo,
  empresaNicho,
  empresaNome,
  empresaSegmento,
  empresaStatus,
  empresaStatusValidacao,
  empresaTipo,
  includesCI,
  isLegacyBase64Logo,
  toLegacyVentureCompat,
  uploadEmpresaLogo,
  updateEmpresaCadastro
} from '../services';
import EmpresaLogoPreview from './EmpresaLogoPreview';
import EmpresaLogoUploadInput from './EmpresaLogoUploadInput';

interface CadastroEmpresasViewProps {
  empresas: Empresa[];
  agents: Agent[];
  onAddEmpresa?: (empresa: Empresa) => void;
  onRemoveEmpresa?: (id: string) => void;
  onUpdateEmpresa?: (empresa: Empresa) => void;
  onOpenEmpresaDetail?: (empresaId: string) => void;
}

const CadastroEmpresasView: React.FC<CadastroEmpresasViewProps> = ({
  empresas,
  agents,
  onAddEmpresa,
  onRemoveEmpresa,
  onUpdateEmpresa,
  onOpenEmpresaDetail
}) => {
  const novoDraft = (): EmpresaDraft => ({
    nome: '',
    logoUrl: '',
    status: 'DESENVOLVIMENTO',
    tipo: 'MARCA',
    esfera: 'NAO_DEFINIDA',
    segmento: '',
    nicho: '',
    siteUrl: '',
    camposAuxiliares: { statusValidacao: 'Pendente' }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newEmpresa, setNewEmpresa] = useState<EmpresaDraft>(novoDraft());
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploadingNewLogo, setIsUploadingNewLogo] = useState(false);
  const [newLogoError, setNewLogoError] = useState<string | null>(null);

  const [editingEmpresaId, setEditingEmpresaId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<EmpresaDraft | null>(null);
  const [editingLogoPreview, setEditingLogoPreview] = useState<string | null>(null);
  const [isUploadingEditingLogo, setIsUploadingEditingLogo] = useState(false);
  const [editingLogoError, setEditingLogoError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  const validateLogoFile = (file: File) => {
    if (!String(file.type || '').startsWith('image/')) {
      throw new Error('Arquivo inválido. Envie uma imagem.');
    }

    if (file.size > 2_000_000) {
      throw new Error('Logo muito pesada. Use uma imagem de até 2MB.');
    }
  };

  const handleNewLogoUpload = async (file: File) => {
    try {
      validateLogoFile(file);
      setNewLogoError(null);
      setIsUploadingNewLogo(true);

      const { logoUrl } = await uploadEmpresaLogo(file, newEmpresa.nome || file.name);
      setLogoPreview(logoUrl);
      setNewEmpresa((prev) => ({ ...prev, logoUrl }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao fazer upload da logo.';
      setNewLogoError(message);
    } finally {
      setIsUploadingNewLogo(false);
    }
  };

  const handleEditingLogoUpload = async (file: File) => {
    if (!editingDraft) return;

    try {
      validateLogoFile(file);
      setEditingLogoError(null);
      setIsUploadingEditingLogo(true);

      const { logoUrl } = await uploadEmpresaLogo(file, editingDraft.nome || file.name);
      setEditingLogoPreview(logoUrl);
      setEditingDraft({ ...editingDraft, logoUrl });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao fazer upload da logo.';
      setEditingLogoError(message);
    } finally {
      setIsUploadingEditingLogo(false);
    }
  };

  const handleSave = async () => {
    setNewLogoError(null);

    if (isUploadingNewLogo) {
      setNewLogoError('Aguarde o upload da logo terminar para salvar.');
      return;
    }

    if (!newEmpresa.nome || !newEmpresa.logoUrl) {
      alert('Nome e Logo são obrigatórios para registrar uma Empresa.');
      return;
    }

    try {
      const agora = new Date();
      const empresaCanonica: Empresa = {
        id: '',
        nome: newEmpresa.nome,
        nomeCurto: newEmpresa.nomeCurto,
        slug: newEmpresa.slug,
        status: newEmpresa.status || 'DESENVOLVIMENTO',
        tipo: newEmpresa.tipo || 'MARCA',
        esfera: newEmpresa.esfera || 'NAO_DEFINIDA',
        segmento: newEmpresa.segmento,
        nicho: newEmpresa.nicho,
        logoUrl: newEmpresa.logoUrl,
        descricaoCurta: newEmpresa.descricaoCurta,
        siteUrl: newEmpresa.siteUrl,
        createdAt: agora,
        updatedAt: agora,
        timestamp: agora,
        camposAuxiliares: {
          statusValidacao: String(newEmpresa.camposAuxiliares?.statusValidacao || 'Pendente')
        }
      };

      const payloadLegado = {
        ...toLegacyVentureCompat(empresaCanonica),
        timestamp: Timestamp.fromDate(agora),
        createdAt: Timestamp.fromDate(agora),
        updatedAt: Timestamp.fromDate(agora)
      };

      const docRef = await addDoc(collection(db, 'ventures'), payloadLegado as any);
      onAddEmpresa?.({ ...empresaCanonica, id: docRef.id });

      setIsAdding(false);
      setNewEmpresa(novoDraft());
      setLogoPreview(null);
      setNewLogoError(null);
    } catch (e) {
      console.error('Erro ao salvar empresa:', e);
      alert('Erro ao salvar Empresa no banco de dados.');
    }
  };

  const handleStartEdit = (empresa: Empresa) => {
    setIsAdding(false);
    setUpdateError(null);
    setUpdateSuccess(null);
    setEditingEmpresaId(empresa.id);
    setEditingLogoPreview(null);
    setEditingLogoError(null);
    setEditingDraft({
      nome: empresa.nome,
      nomeCurto: empresa.nomeCurto || '',
      slug: empresa.slug || '',
      status: empresa.status,
      tipo: empresa.tipo,
      esfera: empresa.esfera,
      segmento: empresa.segmento || '',
      nicho: empresa.nicho || '',
      descricaoCurta: empresa.descricaoCurta || '',
      siteUrl: empresa.siteUrl || '',
      logoUrl: empresa.logoUrl || '',
      camposAuxiliares: {
        ...(empresa.camposAuxiliares || {}),
        statusValidacao: String(empresa.camposAuxiliares?.statusValidacao || 'Pendente')
      }
    });
  };

  const handleCancelEdit = () => {
    setEditingEmpresaId(null);
    setEditingDraft(null);
    setEditingLogoPreview(null);
    setIsUploadingEditingLogo(false);
    setEditingLogoError(null);
    setIsUpdating(false);
    setUpdateError(null);
  };

  const handleSaveEdit = async (empresa: Empresa) => {
    if (!editingDraft) return;

    if (isUploadingEditingLogo) {
      setUpdateError('Aguarde o upload da logo terminar para salvar.');
      return;
    }

    if (!editingDraft.nome || !editingDraft.logoUrl) {
      setUpdateError('Nome e logo são obrigatórios para atualizar a empresa.');
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(null);

    try {
      const atualizada = await updateEmpresaCadastro(empresa, {
        nome: editingDraft.nome,
        nomeCurto: editingDraft.nomeCurto || undefined,
        slug: editingDraft.slug || undefined,
        status: editingDraft.status || 'DESENVOLVIMENTO',
        tipo: editingDraft.tipo || 'OUTRO',
        esfera: editingDraft.esfera || 'NAO_DEFINIDA',
        segmento: editingDraft.segmento || undefined,
        nicho: editingDraft.nicho || undefined,
        descricaoCurta: editingDraft.descricaoCurta || undefined,
        siteUrl: editingDraft.siteUrl || undefined,
        logoUrl: editingDraft.logoUrl,
        camposAuxiliares: {
          statusValidacao: String(editingDraft.camposAuxiliares?.statusValidacao || 'Pendente')
        }
      });

      onUpdateEmpresa?.(atualizada);
      setEditingEmpresaId(null);
      setEditingDraft(null);
      setEditingLogoPreview(null);
      setUpdateSuccess(`Empresa "${atualizada.nome}" atualizada com sucesso.`);
      setTimeout(() => setUpdateSuccess(null), 3500);
    } catch (e) {
      console.error('Erro ao atualizar empresa:', e);
      setUpdateError('Falha ao atualizar empresa. Tente novamente.');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredEmpresas = useMemo(() => {
    const list = (empresas || []).filter((empresa) => includesCI(empresaNome(empresa), searchTerm));
    return list.sort((a, b) => asDate(b.timestamp).getTime() - asDate(a.timestamp).getTime());
  }, [empresas, searchTerm]);

  const colWidths = {
    logo: 'w-20',
    name: 'flex-1',
    status: 'w-32',
    type: 'w-28',
    statusLab: 'w-32',
    niche: 'w-32',
    segment: 'w-32',
    sphere: 'w-28',
    actions: 'w-32'
  };

  return (
    <div className="flex-1 h-full bg-white flex flex-col font-sans overflow-hidden">
      <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-black text-gray-800 uppercase tracking-tight">Cadastro de Empresas</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Base de cadastro, manutenção e dados-base</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-50 border border-transparent hover:border-gray-200 rounded-lg px-2 py-1.5 w-48 transition-all group">
            <SearchIcon className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
            <input
              type="text"
              placeholder="Buscar empresa..."
              className="bg-transparent text-xs font-medium text-gray-700 outline-none w-full ml-2 placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              handleCancelEdit();
              setIsAdding(true);
            }}
            className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase hover:bg-indigo-700 transition-all flex items-center gap-1 shadow-md"
          >
            Nova Empresa <PlusIcon className="w-3 h-3 ml-1 text-white/50" />
          </button>
        </div>
      </header>

      {(updateError || updateSuccess) && (
        <div className={`mx-6 mt-3 rounded-lg border px-3 py-2 text-[11px] font-bold flex items-center gap-2 ${updateError ? 'bg-red-50 text-red-700 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
          <AlertCircleIcon className="w-4 h-4" />
          {updateError || updateSuccess}
        </div>
      )}

      <div className="flex items-center px-6 h-10 border-b border-gray-100 bg-gray-50/50 text-[9px] font-bold text-gray-400 uppercase tracking-widest shrink-0">
        <div className={`${colWidths.logo} px-2`}>Logo</div>
        <div className={`${colWidths.name} px-2`}>Nome da Empresa</div>
        <div className={`${colWidths.status} px-2`}>Status</div>
        <div className={`${colWidths.type} px-2`}>Iniciativa</div>
        <div className={`${colWidths.statusLab} px-2`}>Status Lab</div>
        <div className={`${colWidths.niche} px-2`}>Nicho</div>
        <div className={`${colWidths.segment} px-2`}>Segmento</div>
        <div className={`${colWidths.sphere} px-2`}>Esfera</div>
        <div className={`${colWidths.actions} text-center`}>Ações</div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
        {isAdding && (
          <div className="relative flex items-center px-6 py-4 border-b border-indigo-100 bg-indigo-50/20 animate-msg gap-2">
            <div className={`${colWidths.logo} px-2`}>
              <EmpresaLogoUploadInput
                previewUrl={logoPreview || newEmpresa.logoUrl || null}
                alt="Logo preview"
                onSelectFile={handleNewLogoUpload}
                uploading={isUploadingNewLogo}
              />
            </div>

            <div className={`${colWidths.name} px-2`}>
              <input
                autoFocus
                className="w-full bg-white border border-indigo-200 rounded px-2 py-1.5 text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                placeholder="Nome da Empresa..."
                value={newEmpresa.nome || ''}
                onChange={(e) => setNewEmpresa({ ...newEmpresa, nome: e.target.value })}
              />
            </div>

            <div className={`${colWidths.status} px-2`}>
              <select className="w-full bg-white border border-indigo-200 rounded px-2 py-1 text-[10px] font-black outline-none" value={newEmpresa.status} onChange={(e) => setNewEmpresa({ ...newEmpresa, status: e.target.value as any })}>
                <option>IDEIA</option>
                <option>DESENVOLVIMENTO</option>
                <option>APROVADA</option>
                <option>ATIVA</option>
                <option>INATIVA</option>
              </select>
            </div>

            <div className={`${colWidths.type} px-2`}>
              <select className="w-full bg-white border border-indigo-200 rounded px-2 py-1 text-[10px] outline-none" value={newEmpresa.tipo} onChange={(e) => setNewEmpresa({ ...newEmpresa, tipo: e.target.value as any })}>
                <option value="MARCA">Marca</option>
                <option value="PROJETO">Projeto</option>
                <option value="UNIDADE_NEGOCIO">Unidade de Negócio</option>
                <option value="OUTRO">Outro</option>
              </select>
            </div>

            <div className={`${colWidths.statusLab} px-2`}>
              <select className="w-full bg-white border border-indigo-200 rounded px-2 py-1 text-[10px] outline-none" value={String(newEmpresa.camposAuxiliares?.statusValidacao || 'Pendente')} onChange={(e) => setNewEmpresa({ ...newEmpresa, camposAuxiliares: { ...(newEmpresa.camposAuxiliares || {}), statusValidacao: e.target.value } })}>
                <option>Pendente</option>
                <option>Validado</option>
                <option>Próximo Teste</option>
              </select>
            </div>

            <div className={`${colWidths.niche} px-2`}>
              <input className="w-full bg-white border border-indigo-200 rounded px-2 py-1 text-[10px] outline-none" placeholder="Nicho..." value={newEmpresa.nicho || ''} onChange={(e) => setNewEmpresa({ ...newEmpresa, nicho: e.target.value })} />
            </div>

            <div className={`${colWidths.segment} px-2`}>
              <input className="w-full bg-white border border-indigo-200 rounded px-2 py-1 text-[10px] outline-none" placeholder="Segmento..." value={newEmpresa.segmento || ''} onChange={(e) => setNewEmpresa({ ...newEmpresa, segmento: e.target.value })} />
            </div>

            <div className={`${colWidths.sphere} px-2`}>
              <select className="w-full bg-white border border-indigo-200 rounded px-2 py-1 text-[10px] outline-none" value={newEmpresa.esfera || 'NAO_DEFINIDA'} onChange={(e) => setNewEmpresa({ ...newEmpresa, esfera: e.target.value as any })}>
                <option value="NAO_DEFINIDA">Não definida</option>
                <option value="GRUPOB">GrupoB</option>
                <option value="MERCADO">Mercado</option>
                <option value="INTERNA">Interna</option>
              </select>
            </div>

            <div className={`${colWidths.actions} flex justify-center gap-2`}>
              <button disabled={isUploadingNewLogo} onClick={handleSave} className="bg-green-500 text-white px-3 py-1 rounded text-[10px] font-black hover:bg-green-600 shadow-sm disabled:opacity-60">SALVAR</button>
              <button onClick={() => setIsAdding(false)} className="bg-gray-100 text-gray-500 px-3 py-1 rounded text-[10px] font-black hover:bg-gray-200 shadow-sm">X</button>
            </div>

            {newLogoError && (
              <div className="absolute left-6 right-6 -bottom-5 text-[10px] font-bold text-red-600">
                {newLogoError}
              </div>
            )}
          </div>
        )}

        {filteredEmpresas.length === 0 && !isAdding ? (
          <div className="flex flex-col items-center justify-center h-64 opacity-30">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center px-10">
              Nenhuma empresa registrada.<br />Use o botão + para começar a organizar o cadastro.
            </p>
          </div>
        ) : (
          filteredEmpresas.map((empresa) => {
            const isEditingThis = editingEmpresaId === empresa.id && !!editingDraft;
            const name = empresaNome(empresa) || 'Sem nome';
            const logo = empresaLogo(empresa);
            const logoIsBase64Legacy = isLegacyBase64Logo(logo);
            const status = empresaStatus(empresa);
            const tipo = empresaTipo(empresa);
            const statusValidacao = empresaStatusValidacao(empresa);
            const nicho = empresaNicho(empresa);
            const segmento = empresaSegmento(empresa);
            const esfera = empresaEsfera(empresa);
            const agentCount = (agents || []).filter((a) => a.ventureId === empresa.id).length;

            if (isEditingThis && editingDraft) {
              return (
                <div key={empresa.id} className="px-6 py-4 border-b border-indigo-100 bg-indigo-50/30 animate-msg">
                  <div className="grid grid-cols-12 gap-2 mb-2">
                    <div className="col-span-1">
                      <EmpresaLogoUploadInput
                        previewUrl={editingLogoPreview || editingDraft.logoUrl || null}
                        alt="Logo edição"
                        onSelectFile={handleEditingLogoUpload}
                        uploading={isUploadingEditingLogo}
                        disabled={isUpdating}
                      />
                    </div>
                    <input className="col-span-3 bg-white border border-indigo-200 rounded px-2 py-1 text-[10px] font-bold outline-none" value={editingDraft.nome || ''} placeholder="Nome" onChange={(e) => setEditingDraft({ ...editingDraft, nome: e.target.value })} />
                    <input className="col-span-2 bg-white border border-indigo-200 rounded px-2 py-1 text-[10px] outline-none" value={editingDraft.nomeCurto || ''} placeholder="Nome curto" onChange={(e) => setEditingDraft({ ...editingDraft, nomeCurto: e.target.value })} />
                    <input className="col-span-2 bg-white border border-indigo-200 rounded px-2 py-1 text-[10px] outline-none" value={editingDraft.slug || ''} placeholder="Slug" onChange={(e) => setEditingDraft({ ...editingDraft, slug: e.target.value })} />
                    <select className="col-span-2 bg-white border border-indigo-200 rounded px-2 py-1 text-[10px] outline-none" value={editingDraft.status} onChange={(e) => setEditingDraft({ ...editingDraft, status: e.target.value as any })}>
                      <option>IDEIA</option><option>DESENVOLVIMENTO</option><option>APROVADA</option><option>ATIVA</option><option>INATIVA</option>
                    </select>
                    <select className="col-span-2 bg-white border border-indigo-200 rounded px-2 py-1 text-[10px] outline-none" value={editingDraft.tipo} onChange={(e) => setEditingDraft({ ...editingDraft, tipo: e.target.value as any })}>
                      <option value="MARCA">Marca</option><option value="PROJETO">Projeto</option><option value="UNIDADE_NEGOCIO">Unidade de Negócio</option><option value="OUTRO">Outro</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-12 gap-2 mb-2">
                    <select className="col-span-2 bg-white border border-indigo-200 rounded px-2 py-1 text-[10px] outline-none" value={editingDraft.esfera || 'NAO_DEFINIDA'} onChange={(e) => setEditingDraft({ ...editingDraft, esfera: e.target.value as any })}>
                      <option value="NAO_DEFINIDA">Não definida</option><option value="GRUPOB">GrupoB</option><option value="MERCADO">Mercado</option><option value="INTERNA">Interna</option>
                    </select>
                    <input className="col-span-2 bg-white border border-indigo-200 rounded px-2 py-1 text-[10px] outline-none" value={editingDraft.nicho || ''} placeholder="Nicho" onChange={(e) => setEditingDraft({ ...editingDraft, nicho: e.target.value })} />
                    <input className="col-span-2 bg-white border border-indigo-200 rounded px-2 py-1 text-[10px] outline-none" value={editingDraft.segmento || ''} placeholder="Segmento" onChange={(e) => setEditingDraft({ ...editingDraft, segmento: e.target.value })} />
                    <input className="col-span-3 bg-white border border-indigo-200 rounded px-2 py-1 text-[10px] outline-none" value={editingDraft.siteUrl || ''} placeholder="Site URL" onChange={(e) => setEditingDraft({ ...editingDraft, siteUrl: e.target.value })} />
                    <select className="col-span-3 bg-white border border-indigo-200 rounded px-2 py-1 text-[10px] outline-none" value={String(editingDraft.camposAuxiliares?.statusValidacao || 'Pendente')} onChange={(e) => setEditingDraft({ ...editingDraft, camposAuxiliares: { ...(editingDraft.camposAuxiliares || {}), statusValidacao: e.target.value } })}>
                      <option>Pendente</option><option>Validado</option><option>Próximo Teste</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-12 gap-2 items-center">
                    <input className="col-span-5 bg-white border border-indigo-200 rounded px-2 py-1 text-[10px] outline-none" value={editingDraft.logoUrl || ''} placeholder="logoUrl (compat)" onChange={(e) => setEditingDraft({ ...editingDraft, logoUrl: e.target.value })} />
                    <input className="col-span-5 bg-white border border-indigo-200 rounded px-2 py-1 text-[10px] outline-none" value={editingDraft.descricaoCurta || ''} placeholder="Descrição curta" onChange={(e) => setEditingDraft({ ...editingDraft, descricaoCurta: e.target.value })} />
                    <div className="col-span-2 flex justify-end gap-2">
                      <button disabled={isUpdating || isUploadingEditingLogo} onClick={() => handleSaveEdit(empresa)} className="bg-emerald-600 text-white px-2.5 py-1 rounded text-[10px] font-black hover:bg-emerald-700 disabled:opacity-70 flex items-center gap-1">
                        <CheckIcon className="w-3 h-3" /> {isUpdating ? 'SALVANDO...' : 'SALVAR'}
                      </button>
                      <button disabled={isUpdating} onClick={handleCancelEdit} className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded text-[10px] font-black hover:bg-gray-200">X</button>
                    </div>
                  </div>

                  {editingLogoError && (
                    <div className="text-[10px] font-bold text-red-600 mt-1">{editingLogoError}</div>
                  )}
                </div>
              );
            }

            return (
              <div key={empresa.id} className="group flex items-center px-6 py-4 border-b border-gray-50 hover:bg-indigo-50/10 transition-all h-16 animate-msg">
                <div className={`${colWidths.logo} px-2`}>
                  <EmpresaLogoPreview logoUrl={logo} alt={name} />
                </div>

                <div className={`${colWidths.name} px-2 min-w-0`}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-black text-gray-800 tracking-tight uppercase truncate">{name}</span>
                    {logoIsBase64Legacy && (
                      <span className="text-[8px] font-black px-1.5 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-700 uppercase tracking-widest">
                        Legacy Logo
                      </span>
                    )}
                    <span className="text-[8px] bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded font-black uppercase tracking-widest border border-indigo-100">
                      {agentCount} Agentes
                    </span>
                  </div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest truncate">{segmento || 'Segmento não definido'}</p>
                </div>

                <div className={`${colWidths.status} px-2`}>
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest text-center block ${
                    status === 'APROVADA' || status === 'ATIVA'
                      ? 'bg-green-100 text-green-700'
                      : status === 'DESENVOLVIMENTO'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-500'
                  }`}>
                    {status}
                  </span>
                </div>

                <div className={`${colWidths.type} px-2`}>
                  <span className="text-[9px] font-black bg-purple-100 text-purple-700 px-2 py-1 rounded uppercase tracking-tighter block text-center">{tipo}</span>
                </div>

                <div className={`${colWidths.statusLab} px-2`}>
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest text-center block border ${
                    statusValidacao === 'Validado'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : statusValidacao === 'Próximo Teste'
                        ? 'bg-orange-50 text-orange-600 border-orange-100'
                        : 'bg-gray-50 text-gray-400 border-gray-100'
                  }`}>
                    {statusValidacao}
                  </span>
                </div>

                <div className={`${colWidths.niche} px-2 text-[10px] font-bold text-gray-600 truncate`}>{nicho || '--'}</div>
                <div className={`${colWidths.segment} px-2 text-[10px] font-bold text-gray-600 truncate`}>{segmento || '--'}</div>
                <div className={`${colWidths.sphere} px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest truncate`}>{esfera || '--'}</div>

                <div className={`${colWidths.actions} flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                  <button onClick={() => onOpenEmpresaDetail?.(empresa.id)} className="text-gray-300 hover:text-blue-600 transition-colors p-2" title="Ver detalhe da Empresa">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleStartEdit(empresa)} className="text-gray-300 hover:text-indigo-600 transition-colors p-2" title="Editar Empresa">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => onRemoveEmpresa?.(empresa.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2" title="Remover Empresa">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CadastroEmpresasView;
