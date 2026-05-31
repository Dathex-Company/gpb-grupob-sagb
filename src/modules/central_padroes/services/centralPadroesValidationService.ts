import { CreateChecklistInput, CreateDecisionInput, CreateDocumentInput, CreateStandardInput } from '../types';

const requireText = (value: unknown, label: string) => {
  if (typeof value !== 'string' || value.trim().length < 2) {
    throw new Error(`${label} é obrigatório.`);
  }
};

export const centralPadroesValidationService = {
  validateStandard(input: Partial<CreateStandardInput>) {
    requireText(input.key, 'Chave do padrão');
    requireText(input.title, 'Título do padrão');
    requireText(input.summary, 'Resumo do padrão');
    requireText(input.areaId, 'Área responsável');
    requireText(input.owner, 'Owner');
  },

  validateDocument(input: Partial<CreateDocumentInput>) {
    requireText(input.title, 'Título do documento');
    requireText(input.path, 'Caminho do documento');
    requireText(input.category, 'Categoria');
  },

  validateDecision(input: Partial<CreateDecisionInput>) {
    requireText(input.title, 'Título da decisão');
    requireText(input.summary, 'Resumo da decisão');
  },

  validateChecklist(input: Partial<CreateChecklistInput>) {
    requireText(input.title, 'Título do checklist');
    requireText(input.context, 'Contexto do checklist');
    if (!Array.isArray(input.items) || input.items.length === 0) throw new Error('Checklist precisa ter ao menos um item.');
  }
};

