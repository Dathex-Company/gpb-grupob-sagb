import React from 'react';
import { Agent, Venture } from '../../types';
import { Avatar } from '../../../../../components/Avatar';
import { BotIcon, PencilIcon, TrashIcon } from '../../../../../components/Icon';
import { deriveOperationalStatus, getOperationalStatusLabel, isAgentOperationallyBlocked } from '../../../../../utils/agentOperational';
import { getAgentAuthEmail, getHumanAccessStatusLabel, isHumanStructuralEntity, resolveHumanAccessStatus } from '../../../../../utils/humanIdentity';
import { toDisplayOption } from './helpers';

interface AgentFactoryTableProps {
  filteredAgents: Agent[];
  ventures: Venture[];
  showAdvancedColumns: boolean;
  authUsersByEmail: Record<string, { id: string; email: string }>;
  activeSessionEmail?: string | null;
  onOpenEdit: (agent: Agent) => void;
  onManageIntelligence?: (agent: Agent) => void;
  onDelete?: (agent: Agent) => void;
}

const renderBadge = (label: string, tone: 'default' | 'green' | 'yellow' | 'purple' | 'gray' = 'default') => {
  const toneClass = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    yellow: 'bg-amber-100 text-amber-700 border-amber-200',
    purple: 'bg-violet-100 text-violet-700 border-violet-200',
    gray: 'bg-gray-100 text-gray-600 border-gray-200'
  }[tone];
  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${toneClass}`}>{label}</span>;
};

export const AgentFactoryTable: React.FC<AgentFactoryTableProps> = ({
  filteredAgents,
  ventures,
  showAdvancedColumns,
  authUsersByEmail,
  activeSessionEmail,
  onOpenEdit,
  onManageIntelligence,
  onDelete
}) => {
  return (
    <div className="flex-1 overflow-auto">
      <table className={`${showAdvancedColumns ? 'min-w-[1700px]' : 'min-w-[1120px]'} table-fixed border-collapse`}>
        <thead className="sticky top-0 z-10 bg-white dark:bg-sagb-panel shadow-sm">
          <tr className="border-b border-gray-100 dark:border-white/5 text-left text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">
            <th className="px-3 py-3">Nome</th>
            <th className="px-3 py-3">Tipo</th>
            <th className="px-3 py-3">Venture</th>
            <th className="px-3 py-3">Unidade</th>
            {showAdvancedColumns && <th className="px-3 py-3">Area</th>}
            <th className="px-3 py-3">Funcao</th>
            {showAdvancedColumns && <th className="px-3 py-3">Cargo-base</th>}
            <th className="px-3 py-3">Nivel</th>
            {showAdvancedColumns && <th className="px-3 py-3">Papel</th>}
            <th className="px-3 py-3">Status estrutural</th>
            {showAdvancedColumns && <th className="px-3 py-3">Ativacao</th>}
            <th className="px-3 py-3">DNA</th>
            {showAdvancedColumns && <th className="px-3 py-3">Status operacional</th>}
            {showAdvancedColumns && <th className="px-3 py-3">Classe</th>}
            {showAdvancedColumns && <th className="px-3 py-3">Stack permitida</th>}
            {showAdvancedColumns && <th className="px-3 py-3">Modelo preferencial</th>}
            <th className="px-3 py-3">Responsavel humano</th>
            {showAdvancedColumns && <th className="px-3 py-3">Documentos</th>}
            {showAdvancedColumns && <th className="px-3 py-3">Origem</th>}
            <th className="px-3 py-3">Ultima atualizacao</th>
            <th className="px-3 py-3 text-center">Acoes</th>
          </tr>
        </thead>
        <tbody>
          {filteredAgents.map((agent) => {
            const ventureName = ventures.find((venture) => venture.id === agent.ventureId)?.name || agent.company || '-';
            const stackText = Array.isArray(agent.allowedStacks) && agent.allowedStacks.length > 0
              ? agent.allowedStacks.map((stack) => toDisplayOption(stack)).join(', ')
              : toDisplayOption(agent.modelProvider || '-');
            const updatedAt = (agent as any).updatedAt || (agent as any).updated_at || (agent as any).createdAt;
            const updatedAtText = updatedAt ? new Date(updatedAt).toLocaleString('pt-BR') : '-';
            const structuralStatus = agent.structuralStatus || (agent.status === 'ACTIVE' ? 'ATIVO' : agent.status === 'STAGING' ? 'HOMOLOGACAO' : 'EM_CONFIGURACAO');
            const dnaStatus = agent.dnaStatus || 'SEM_DNA';
            const operationalStatus = deriveOperationalStatus(agent);
            const isBlocked = isAgentOperationallyBlocked(agent);
            const humanAccessStatus = resolveHumanAccessStatus(agent, authUsersByEmail, activeSessionEmail);
            return (
              <tr key={agent.id} className={`border-b border-gray-100 dark:border-white/5 text-[12px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${isBlocked ? 'opacity-55' : ''}`}>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-3">
                    <Avatar name={agent.name} url={agent.avatarUrl} className="h-9 w-9" />
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-bold text-gray-800 dark:text-white">{agent.name}</p>
                      <p className="truncate text-[10px] font-semibold text-gray-400 dark:text-gray-500">{agent.shortDescription || agent.officialRole || '-'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2">{toDisplayOption(agent.entityType || (agent.collaboratorType === 'HUMANO' ? 'HUMANO' : 'AGENTE'))}</td>
                <td className="px-3 py-2">{ventureName}</td>
                <td className="px-3 py-2">{agent.unitName || agent.division || '-'}</td>
                {showAdvancedColumns && <td className="px-3 py-2">{isHumanStructuralEntity(agent) ? <div className="space-y-1"><div>{renderBadge(getHumanAccessStatusLabel(humanAccessStatus), humanAccessStatus === 'AUTENTICADO' ? 'green' : humanAccessStatus === 'AUTENTICAVEL' ? 'purple' : 'gray')}</div><div className="text-[10px] text-gray-400 truncate">{getAgentAuthEmail(agent) || '-'}</div></div> : '-'}</td>}
                {showAdvancedColumns && <td className="px-3 py-2">{agent.area || agent.sector || '-'}</td>}
                <td className="px-3 py-2">{agent.functionName || agent.officialRole || '-'}</td>
                {showAdvancedColumns && <td className="px-3 py-2">{agent.baseRoleUniversal || '-'}</td>}
                <td className="px-3 py-2">{toDisplayOption(agent.tier || '-')}</td>
                {showAdvancedColumns && <td className="px-3 py-2">{toDisplayOption(agent.roleType || '-')}</td>}
                <td className="px-3 py-2">{renderBadge(toDisplayOption(structuralStatus), structuralStatus === 'ATIVO' ? 'green' : structuralStatus === 'HOMOLOGACAO' ? 'purple' : 'gray')}</td>
                {showAdvancedColumns && <td className="px-3 py-2">{toDisplayOption(agent.operationalActivation || '-')}</td>}
                <td className="px-3 py-2">{renderBadge(dnaStatus === 'DNA_COMPLETO' ? 'DNA Completo' : dnaStatus === 'SEM_DNA' ? 'Sem DNA' : toDisplayOption(dnaStatus), dnaStatus === 'DNA_COMPLETO' ? 'green' : dnaStatus === 'DNA_PARCIAL' ? 'yellow' : 'gray')}</td>
                {showAdvancedColumns && <td className="px-3 py-2">{renderBadge(getOperationalStatusLabel(operationalStatus), operationalStatus === 'ATIVO' ? 'green' : operationalStatus === 'DISPONIVEL' ? 'purple' : 'gray')}</td>}
                {showAdvancedColumns && <td className="px-3 py-2">{toDisplayOption(agent.operationalClass || '-')}</td>}
                {showAdvancedColumns && <td className="px-3 py-2">{stackText}</td>}
                {showAdvancedColumns && <td className="px-3 py-2">{toDisplayOption(agent.preferredModel || agent.modelProvider || '-')}</td>}
                <td className="px-3 py-2">{agent.humanOwner || '-'}</td>
                {showAdvancedColumns && <td className="px-3 py-2">{Number(agent.docCount || 0)}</td>}
                {showAdvancedColumns && <td className="px-3 py-2">{agent.origin || '-'}</td>}
                <td className="px-3 py-2 text-[11px]">{updatedAtText}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => onOpenEdit(agent)} className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600" title="Editar"><PencilIcon className="h-3.5 w-3.5" /></button>
                    {onManageIntelligence && <button onClick={() => onManageIntelligence(agent)} className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-purple-50 hover:text-purple-600" title="Status DNA"><BotIcon className="h-3.5 w-3.5" /></button>}
                    {onDelete && <button onClick={() => onDelete(agent)} className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-red-50 hover:text-red-600" title="Excluir"><TrashIcon className="h-3.5 w-3.5" /></button>}
                  </div>
                </td>
              </tr>
            );
          })}
          {filteredAgents.length === 0 && <tr><td colSpan={showAdvancedColumns ? 22 : 11} className="px-6 py-10 text-center text-sm font-semibold text-gray-400">Nenhum cadastro encontrado para o filtro atual.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};
