import React from 'react';
import { StatusBadge } from './StatusBadge';

const statusByStandardStatus: Record<string, string> = {
  rascunho: 'draft',
  revisao: 'review',
  curadoria: 'curation',
  aprovado: 'approved',
  publicado: 'published',
  deprecado: 'deprecated',
  substituido: 'replaced'
};

export const ApprovalBadge: React.FC<{ status?: string }> = ({ status }) => <StatusBadge value={statusByStandardStatus[status || ''] || status || 'draft'} />;

