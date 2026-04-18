import React from 'react';
import { Agent, AgentTier, ModelProvider, Venture } from '../../types';
import { Avatar } from '../Avatar';
import { TrashIcon, XIcon } from '../Icon';
import {
  DNA_STATUS_OPTIONS,
  ENTITY_TYPE_OPTIONS,
  LEVEL_OPTIONS,
  OPERATIONAL_ACTIVATION_OPTIONS,
  OPERATIONAL_CLASS_OPTIONS,
  ROLE_TYPE_OPTIONS,
  STACK_OPTIONS,
  STRUCTURAL_STATUS_OPTIONS
} from './constants';
import { HelpTooltip } from './HelpTooltip';
import { AgentFormState, EntityType, FormCustomField, OperationalActivation, OperationalClass, RoleType, StructuralStatus } from './types';
import { toDisplayOption } from './helpers';
import { isHumanStructuralEntity } from '../../utils/humanIdentity';

const isValidHierarchyManager = (candidate: Agent): boolean => {
  const structuralStatus = String(candidate.structuralStatus || '').toUpperCase();
  const lifecycleStatus = String(candidate.status || '').toUpperCase();

  if (structuralStatus === 'ARQUIVADO') return false;
  if (lifecycleStatus === 'BLOCKED') return false;

  return true;
};

interface AgentFactoryFormModalProps {
  isOpen: boolean;
  form: AgentFormState;
  editingAgentId: string | null;
  ventures: Venture[];
  mentorCandidates: Agent[];
  currentEditingAgent?: Agent;
  authUsersByEmail: Record<string, { id: string; email: string }>;
  shouldRequireEmail: boolean;
  isSaving: boolean;
  avatarInputRef: React.RefObject<HTMLInputElement>;
  onClose: () => void;
  onSave: () => void;
  onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSetFormField: <K extends keyof AgentFormState>(key: K, value: AgentFormState[K]) => void;
  onEntityTypeChange: (entityType: EntityType) => void;
  onUsesEmailChange: (usesEmail: boolean) => void;
  onToggleStack: (stack: ModelProvider) => void;
  onUpsertCustomField: (index: number, patch: Partial<FormCustomField>) => void;
  onRemoveCustomField: (index: number) => void;
  onAddCustomField: () => void;
}

export const AgentFactoryFormModal: React.FC<AgentFactoryFormModalProps> = ({
  isOpen,
  form,
  editingAgentId,
  ventures,
  mentorCandidates,
  currentEditingAgent,
  authUsersByEmail,
  shouldRequireEmail,
  isSaving,
  avatarInputRef,
  onClose,
  onSave,
  onAvatarUpload,
  onSetFormField,
  onEntityTypeChange,
  onUsesEmailChange,
  onToggleStack,
  onUpsertCustomField,
  onRemoveCustomField,
  onAddCustomField
}) => {
  if (!isOpen) return null;

  const managerCandidates = mentorCandidates
    .filter(isValidHierarchyManager)
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/70 backdrop-blur-sm p-4 md:p-8 animate-in fade-in duration-200">
      <div className="flex h-full max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] border border-gray-200/70 dark:border-white/10 bg-white dark:bg-sagb-panel shadow-2xl transition-colors duration-300">
        <div className="flex items-start justify-between border-b border-gray-100 dark:border-white/10 px-8 py-6 transition-colors duration-300">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-bitrix-nav dark:text-sagb-text">{editingAgentId ? 'Editar cadastro' : 'Novo cadastro'}</h2>
            <p className="mt-1 text-[11px] font-semibold text-gray-500">Quadro estrutural sem exposição de DNA, cultura ou compliance.</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-700"><XIcon className="h-6 w-6" /></button>
        </div>
        <div className="flex-1 space-y-8 overflow-y-auto px-8 py-6 custom-scrollbar">
          <section className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-400 border-b border-gray-100 pb-2">Bloco 1 — Identidade</h3>
            <div className="grid grid-cols-1 gap-4">
              <label className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Tipo *<HelpTooltip text="A primeira decisão do cadastro: Humano, Agente IA ou Híbrido" /></span>
                <select value={form.entityType} onChange={(e) => onEntityTypeChange(e.target.value as EntityType)} className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1F2937] px-4 py-3 text-sm font-semibold text-gray-700 dark:text-white outline-none focus:border-indigo-300">{ENTITY_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
              </label>
              <label className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Nome *<HelpTooltip text="Nome principal de apresentação na plataforma" /></span>
                <input value={form.name} onChange={(e) => onSetFormField('name', e.target.value)} className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-sagb-bg-2 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-sagb-text outline-none focus:border-indigo-300" />
              </label>
              <div className="flex items-center gap-4 rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-sagb-bg-2 p-4 transition-colors">
                <Avatar name={form.name || 'Novo Cadastro'} url={form.avatarUrl} className="h-16 w-16 shadow-md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-gray-800 dark:text-white">Avatar / Foto <HelpTooltip text="A foto aparecerá nos chats e no sistema para Humanos e Agentes" /></p>
                  <p className="truncate text-[10px] font-semibold text-gray-500 dark:text-gray-400">Imagem pública para visualização de lista</p>
                </div>
                <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={onAvatarUpload} />
                <button onClick={() => avatarInputRef.current?.click()} className="rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-sagb-panel px-4 py-2 text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 shadow-sm transition hover:bg-gray-50 dark:hover:bg-white/10">Alterar Foto</button>
              </div>
              <label className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Descrição curta<HelpTooltip text="Resumo rápido visível nas listas e headers do chat" /></span>
                <textarea value={form.shortDescription} onChange={(e) => onSetFormField('shortDescription', e.target.value)} rows={2} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300" />
              </label>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-400 border-b border-gray-100 pb-2">Bloco 2 — Estrutura</h3>
            <div className="grid grid-cols-1 gap-4">
              <label className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Venture *<HelpTooltip text="A qual negócio/venture o agente/humano pertence principalmente" /></span>
                <select value={form.ventureId} onChange={(e) => onSetFormField('ventureId', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300"><option value="">Selecionar...</option>{ventures.map((venture) => <option key={venture.id} value={venture.id}>{venture.name}</option>)}</select>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Unidade<HelpTooltip text="Departamento ou divisão interna" /></span>
                  <input value={form.unitName} onChange={(e) => onSetFormField('unitName', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300" />
                </label>
                <label className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Área<HelpTooltip text="Setor específico de atuação" /></span>
                  <input value={form.area} onChange={(e) => onSetFormField('area', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300" />
                </label>
              </div>
              <label className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Função principal *<HelpTooltip text="O cargo ou função oficial que será listado" /></span>
                <input value={form.functionName} onChange={(e) => onSetFormField('functionName', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300" />
              </label>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-400 border-b border-gray-100 pb-2">Bloco 3 — Vínculos</h3>
            <div className="grid grid-cols-2 gap-4">
              <label className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Gestor direto<HelpTooltip text="Líder hierárquico direto no organograma" /></span>
                <select value={form.humanOwner} onChange={(e) => onSetFormField('humanOwner', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300"><option value="">Nenhum...</option>{managerCandidates.map((candidate) => <option key={candidate.id} value={candidate.name}>{candidate.name} {isHumanStructuralEntity(candidate) ? '(Humano)' : '(Agente)'}</option>)}</select>
              </label>
              <label className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Mentor DAI<HelpTooltip text="Agente que orienta aquela função" /></span>
                <select value={form.aiMentor} onChange={(e) => onSetFormField('aiMentor', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300"><option value="">Nenhum...</option>{mentorCandidates.map((candidate) => <option key={candidate.id} value={candidate.name}>{candidate.name}</option>)}</select>
              </label>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-400 border-b border-gray-100 pb-2">Bloco 4 — Comunicação</h3>
            <div className="grid grid-cols-1 gap-4">
              {(form.entityType === 'AGENTE') && (
                <label className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Agente usa e-mail próprio?<HelpTooltip text="Agentes que interagem externamente podem precisar de uma conta de e-mail própria" /></span>
                  <select value={form.usesEmail ? 'sim' : 'nao'} onChange={(e) => onUsesEmailChange(e.target.value === 'sim')} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300"><option value="nao">Não</option><option value="sim">Sim</option></select>
                </label>
              )}
              {(form.entityType !== 'AGENTE' || form.usesEmail) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">E-mail {shouldRequireEmail ? '*' : ''}<HelpTooltip text="Obrigatório para Humanos autenticarem no sistema" /></span>
                    <input type="email" value={form.email} onChange={(e) => onSetFormField('email', e.target.value)} placeholder={form.entityType === 'AGENTE' ? 'agente@grupob.com.br' : 'humano@grupob.com.br'} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300" />
                    <p className="text-[10px] font-semibold text-gray-500">{form.entityType === 'AGENTE' ? 'E-mail estrutural para ações externas.' : 'E-mail base. O sistema usa fallback por e-mail caso não haja ID vinculado.'}</p>
                  </label>
                </div>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-400 border-b border-gray-100 pb-2">Bloco 5 — Leitura do sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Status DNA</span>
                <div className="w-full rounded-xl border border-gray-200/50 bg-gray-50/50 px-4 py-3 text-sm font-semibold text-gray-500">
                  {toDisplayOption(form.dnaStatus)}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Status operacional</span>
                <div className="w-full rounded-xl border border-gray-200/50 bg-gray-50/50 px-4 py-3 text-sm font-semibold text-gray-500">
                  {toDisplayOption(form.operationalStatus)}
                </div>
                <p className="text-[10px] font-semibold text-gray-500">{form.dnaStatus === 'DNA_COMPLETO' ? 'Com DNA válido, pode operar.' : 'Sem DNA válido, operação bloqueada.'}</p>
              </div>
            </div>
          </section>

          <details className="group space-y-4 rounded-2xl border border-gray-200 bg-white p-4 open:bg-gray-50/30 transition-colors">
            <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-700 outline-none marker:content-none">
              <span className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-500">Configurações Avançadas</span>
              <svg className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-100 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <label className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Status estrutural</span>
                  <select value={form.structuralStatus} onChange={(e) => onSetFormField('structuralStatus', e.target.value as StructuralStatus)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300">{STRUCTURAL_STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
                </label>
                <label className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Ativação operacional</span>
                  <select value={form.operationalActivation} onChange={(e) => onSetFormField('operationalActivation', e.target.value as OperationalActivation)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300">{OPERATIONAL_ACTIVATION_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Nível</span>
                  <select value={form.level} onChange={(e) => onSetFormField('level', e.target.value as AgentTier)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300">{LEVEL_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
                </label>
                <label className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Papel de atuação</span>
                  <select value={form.roleType} onChange={(e) => onSetFormField('roleType', e.target.value as RoleType)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300">{ROLE_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Cargo-base (taxonomia)</span>
                  <input value={form.baseRoleUniversal} onChange={(e) => onSetFormField('baseRoleUniversal', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300" />
                </label>
                <label className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Origem</span>
                  <input value={form.origin} onChange={(e) => onSetFormField('origin', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300" />
                </label>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <label className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Classe operacional</span>
                  <select value={form.operationalClass} onChange={(e) => onSetFormField('operationalClass', e.target.value as OperationalClass)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300">{OPERATIONAL_CLASS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
                </label>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Stack permitida (múltiplos)</span>
                  <div className="flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-white p-3">
                    {STACK_OPTIONS.map((option) => (
                      <label key={option.value} className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition-all">
                        <input type="checkbox" checked={form.allowedStacks.includes(option.value)} onChange={() => onToggleStack(option.value)} className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500" />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>
                <label className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Modelo preferencial</span>
                  <select value={form.preferredModel} onChange={(e) => onSetFormField('preferredModel', e.target.value as ModelProvider | '')} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300"><option value="">Selecionar...</option>{STACK_OPTIONS.filter((option) => form.allowedStacks.includes(option.value)).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
                </label>
                <label className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Projeto Vinculado (Opcional)</span>
                  <input value={form.projectId} onChange={(e) => onSetFormField('projectId', e.target.value)} placeholder="ID ou Nome do Projeto" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300" />
                </label>
              </div>
            </div>
          </details>

          <section className="space-y-4 pb-10">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-400">Campos customizados</h3>
              <button onClick={onAddCustomField} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-gray-600 shadow-sm transition hover:bg-gray-50">+ Campo</button>
            </div>
            <div className="space-y-3">
              {form.customFields.length === 0 && <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 px-4 py-4 text-center text-[11px] font-semibold text-gray-400">Nenhum campo customizado adicionado.</p>}
              {form.customFields.map((field, index) => (
                <div key={`${index}-${field.key}`} className="flex items-center gap-3">
                  <input value={field.key} onChange={(e) => onUpsertCustomField(index, { key: e.target.value })} placeholder="Chave" className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300" />
                  <input value={field.value} onChange={(e) => onUpsertCustomField(index, { value: e.target.value })} placeholder="Valor" className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300" />
                  <button onClick={() => onRemoveCustomField(index)} className="rounded-xl border border-red-100 bg-red-50 p-3 text-red-500 transition hover:bg-red-500 hover:text-white"><TrashIcon className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="flex shrink-0 items-center justify-between border-t border-gray-100 dark:border-white/10 px-8 py-5 transition-colors">
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{editingAgentId ? 'Edicao de cadastro estrutural.' : 'Cadastro novo para escalar o ecossistema.'}</p>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-sagb-panel px-5 py-2.5 text-xs font-black uppercase tracking-wider text-gray-600 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-all">Cancelar</button>
            <button onClick={onSave} disabled={isSaving} className="rounded-xl bg-bitrix-nav px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-black hover:shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-50">{isSaving ? 'Salvando...' : 'Salvar cadastro'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};
