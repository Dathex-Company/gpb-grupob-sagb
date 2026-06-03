import {
  NagiIngestionClassificationStatus,
  NagiIngestionDestination,
  NagiIngestionDocument,
  NagiIngestionInterpretation,
  NagiItem,
  NagiItemType,
  NagiRelatedCatalogCandidate,
} from '../domain/types';

/* ──────────────────────────────────────────────
 * NAGI V3 — Classificação inicial por heurísticas
 * Não é IA pesada. É leitura prática para triagem rápida.
 * ────────────────────────────────────────────── */

type KeywordRule = {
  type: NagiItemType;
  words: string[];
};

const TYPE_RULES: KeywordRule[] = [
  { type: 'empresa', words: ['empresa', 'holding', 'cnpj', 'unidade de negócio', 'marca oficial'] },
  { type: 'venture', words: ['venture', 'spin-off', 'startup', 'novo negócio', 'investimento'] },
  { type: 'metodologia', words: ['metodologia', 'método', 'passo a passo', 'protocolo', 'abordagem'] },
  { type: 'programa', words: ['programa', 'jornada', 'turma', 'ciclo', 'imersão'] },
  { type: 'framework', words: ['framework', 'estrutura', 'modelo', 'canvas', 'matriz'] },
  { type: 'plano', words: ['plano', 'roadmap', 'cronograma', 'planejamento', 'metas'] },
  { type: 'iniciativa', words: ['iniciativa', 'frente', 'projeto', 'operação', 'implantação'] },
  { type: 'treinamento', words: ['treinamento', 'capacitação', 'aula', 'trilha', 'curso'] },
  { type: 'mentoria', words: ['mentoria', 'mentor', 'mentorado', 'sessão', 'acompanhamento'] },
  { type: 'produto', words: ['produto', 'oferta', 'pacote', 'assinatura', 'solução'] },
  { type: 'sistema', words: ['sistema', 'software', 'app', 'plataforma', 'módulo'] },
  { type: 'ideia', words: ['ideia', 'hipótese', 'oportunidade', 'sugestão', 'possibilidade'] },
];

const CATEGORY_RULES: { category: string; words: string[] }[] = [
  { category: 'Organização Estratégica', words: ['estratégia', 'governança', 'estrutura', 'modelo', 'decisão'] },
  { category: 'Gestão de Portfólio', words: ['venture', 'portfolio', 'portfólio', 'negócio', 'empresa'] },
  { category: 'Treinamento e Capital Intelectual', words: ['treinamento', 'mentoria', 'curso', 'trilha', 'aula'] },
  { category: 'Aplicação Comercial', words: ['comercial', 'venda', 'prospecção', 'crm', 'cliente'] },
  { category: 'Inteligência Documental', words: ['documento', 'base', 'arquivo', 'transcrição', 'resumo'] },
  { category: 'Memória Operacional', words: ['memória', 'reunião', 'histórico', 'registro', 'operação'] },
  { category: 'Vídeo e Contexto', words: ['vídeo', 'youtube', 'gravação', 'conteúdo', 'contexto'] },
  { category: 'Análise Multimodal', words: ['áudio', 'imagem', 'vídeo', 'multimodal', 'análise'] },
  { category: 'Produtos e Ofertas', words: ['produto', 'oferta', 'pacote', 'assinatura', 'preço'] },
];

const STOP_WORDS = new Set([
  'para', 'com', 'uma', 'como', 'que', 'dos', 'das', 'por', 'das', 'dos', 'sobre', 'entre', 'este', 'esta', 'isso', 'mais',
  'pela', 'pelo', 'ser', 'são', 'foi', 'tem', 'ter', 'não', 'sim', 'seu', 'sua', 'seus', 'suas', 'nagi', 'sagb',
]);

export interface NagiClassificationDraft {
  title: string;
  summary: string;
  tags: string[];
  signals: string[];
  typeSuggestion: NagiItemType;
  categorySuggestion: string;
  relatedCatalogCandidates: NagiRelatedCatalogCandidate[];
  classificationStatus: NagiIngestionClassificationStatus;
  interpretation: NagiIngestionInterpretation;
  suggestedDestination: NagiIngestionDestination;
  confidence: number;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function countRuleMatches(text: string, words: string[]): number {
  const n = normalize(text);
  return words.reduce((total, word) => total + (n.includes(normalize(word)) ? 1 : 0), 0);
}

function extractTitle(text: string, fileName?: string): string {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const firstStrong = lines.find((line) => line.length >= 8 && line.length <= 90);
  if (firstStrong) return firstStrong.replace(/^#+\s*/, '').slice(0, 90);
  if (fileName) return fileName.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').slice(0, 90);
  return 'Documento sem título';
}

function extractSummary(text: string): string {
  const compact = text.replace(/\s+/g, ' ').trim();
  if (!compact) return 'Sem resumo disponível. Revise o conteúdo antes de salvar.';
  return compact.length > 260 ? `${compact.slice(0, 257).trim()}...` : compact;
}

function extractTags(text: string): string[] {
  const words = normalize(text).split(' ').filter((w) => w.length > 4 && !STOP_WORDS.has(w));
  const frequency = new Map<string, number>();
  for (const word of words) frequency.set(word, (frequency.get(word) ?? 0) + 1);
  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);
}

function extractSignals(text: string): string[] {
  const signals: string[] = [];
  const lower = normalize(text);
  if (lower.includes('aprovado') || lower.includes('oficial') || lower.includes('validado')) signals.push('Parece algo já reconhecido ou formalizado');
  if (lower.includes('ideia') || lower.includes('oportunidade') || lower.includes('hipotese')) signals.push('Tem cara de ideia nova ou oportunidade');
  if (lower.includes('jornada') || lower.includes('programa') || lower.includes('trilha')) signals.push('Pode ser programa, jornada ou treinamento');
  if (lower.includes('cliente') || lower.includes('venda') || lower.includes('oferta')) signals.push('Tem sinais comerciais');
  if (lower.length < 280) signals.push('Conteúdo curto: revisar antes de salvar');
  return signals.slice(0, 5);
}

function suggestType(text: string): NagiItemType {
  const ranked = TYPE_RULES
    .map((rule) => ({ type: rule.type, score: countRuleMatches(text, rule.words) }))
    .sort((a, b) => b.score - a.score);
  return ranked[0]?.score > 0 ? ranked[0].type : 'ideia';
}

function suggestCategory(text: string): string {
  const ranked = CATEGORY_RULES
    .map((rule) => ({ category: rule.category, score: countRuleMatches(text, rule.words) }))
    .sort((a, b) => b.score - a.score);
  return ranked[0]?.score > 0 ? ranked[0].category : 'Organização Estratégica';
}

function similarityScore(text: string, item: NagiItem): number {
  const normalizedText = normalize(text);
  const titleTokens = normalize(item.title).split(' ').filter((w) => w.length > 3);
  const tagTokens = item.tags.map(normalize).filter(Boolean);
  const categoryTokens = normalize(item.category).split(' ').filter((w) => w.length > 4);
  let score = 0;
  for (const token of titleTokens) if (normalizedText.includes(token)) score += 18;
  for (const token of tagTokens) if (normalizedText.includes(token)) score += 8;
  for (const token of categoryTokens) if (normalizedText.includes(token)) score += 5;
  if (normalizedText.includes(normalize(item.title))) score += 35;
  return Math.min(100, score);
}

export function suggestCatalogCandidates(text: string, catalogItems: NagiItem[]): NagiRelatedCatalogCandidate[] {
  return catalogItems
    .map((item) => ({
      itemId: item.id,
      title: item.title,
      reason: `Encontramos termos próximos de "${item.title}" no conteúdo.`,
      confidence: similarityScore(text, item),
    }))
    .filter((candidate) => candidate.confidence >= 28)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);
}

export function classifyIngestionText(text: string, fileName: string | undefined, catalogItems: NagiItem[]): NagiClassificationDraft {
  const title = extractTitle(text, fileName);
  const summary = extractSummary(text);
  const tags = extractTags(text);
  const signals = extractSignals(text);
  const typeSuggestion = suggestType(`${title}\n${text}`);
  const categorySuggestion = suggestCategory(`${title}\n${text}`);
  const candidates = suggestCatalogCandidates(`${title}\n${text}`, catalogItems);
  const strongest = candidates[0];
  const officialScore = countRuleMatches(text, ['oficial', 'aprovado', 'validado', 'consolidado', 'implantado', 'documentado']);
  const ideaScore = countRuleMatches(text, ['ideia', 'oportunidade', 'hipótese', 'sugestão', 'rascunho', 'possibilidade']);
  const lowClarity = normalize(text).length < 180 || tags.length < 3;

  let interpretation: NagiIngestionInterpretation = 'nova_ideia_triagem';
  let suggestedDestination: NagiIngestionDestination = 'triagem';
  let classificationStatus: NagiIngestionClassificationStatus = 'classificado';
  let confidence = Math.min(88, 45 + tags.length * 4 + (officialScore + ideaScore) * 8);

  if (lowClarity) {
    interpretation = 'sem_clareza_suficiente';
    suggestedDestination = 'revisao_manual';
    classificationStatus = 'baixa_clareza';
    confidence = 28;
  } else if (strongest && strongest.confidence >= 72) {
    interpretation = 'duplicata_provavel';
    suggestedDestination = 'revisao_manual';
    classificationStatus = 'duplicata_possivel';
    confidence = strongest.confidence;
  } else if (strongest && strongest.confidence >= 45) {
    interpretation = 'expansao_item_existente';
    suggestedDestination = 'revisao_manual';
    classificationStatus = 'vinculo_sugerido';
    confidence = strongest.confidence;
  } else if (officialScore >= 2 && typeSuggestion !== 'ideia' && typeSuggestion !== 'outro') {
    interpretation = 'item_existente_catalogo';
    suggestedDestination = 'catalogo';
    classificationStatus = 'classificado';
    confidence = Math.max(confidence, 68);
  } else if (typeSuggestion === 'ideia' || ideaScore > 0) {
    interpretation = 'nova_ideia_triagem';
    suggestedDestination = 'triagem';
    classificationStatus = 'classificado';
    confidence = Math.max(confidence, 52);
  }

  if (countRuleMatches(text, ['anexo', 'apoio', 'referência', 'material complementar']) >= 2) {
    interpretation = 'documento_de_apoio';
    suggestedDestination = strongest ? 'revisao_manual' : 'triagem';
    classificationStatus = strongest ? 'vinculo_sugerido' : 'classificado';
  }

  return {
    title,
    summary,
    tags,
    signals,
    typeSuggestion,
    categorySuggestion,
    relatedCatalogCandidates: candidates,
    classificationStatus,
    interpretation,
    suggestedDestination,
    confidence,
  };
}

export function reclassifyDocument(doc: NagiIngestionDocument, catalogItems: NagiItem[]): NagiIngestionDocument {
  const draft = classifyIngestionText(doc.originalText, doc.fileName, catalogItems);
  return {
    ...doc,
    extractedTitle: draft.title,
    extractedSummary: draft.summary,
    extractedTags: draft.tags,
    extractedSignals: draft.signals,
    extractedTypeSuggestion: draft.typeSuggestion,
    extractedCategorySuggestion: draft.categorySuggestion,
    relatedCatalogCandidates: draft.relatedCatalogCandidates,
    classificationStatus: draft.classificationStatus,
    interpretation: draft.interpretation,
    suggestedDestination: draft.suggestedDestination,
    confidence: draft.confidence,
    reviewStatus: draft.suggestedDestination === 'revisao_manual' ? 'em_revisao' : 'pronto_para_salvar',
    updatedAt: new Date().toISOString(),
  };
}
