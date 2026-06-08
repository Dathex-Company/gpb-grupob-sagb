import { Agent } from '../../types';
import { normalizeAgentName, validateAgentNameAvailability } from './helpers';
import {
  COMMON_FIRST_NAMES,
  FEMININE_FIRST_NAMES,
  MASCULINE_FIRST_NAMES,
  NameCreatorStyle,
  STRONG_LAST_NAMES
} from './nameLists';

export interface GeneratedNameSuggestion {
  name: string;
  normalizedName: string;
  status: 'available' | 'similar';
  message: string;
  conflicts: ReturnType<typeof validateAgentNameAvailability>['conflicts'];
}

const pickFirstNames = (style: NameCreatorStyle) => {
  if (style === 'FEMININO') return FEMININE_FIRST_NAMES;
  if (style === 'MASCULINO') return MASCULINE_FIRST_NAMES;
  return [...FEMININE_FIRST_NAMES, ...MASCULINE_FIRST_NAMES];
};

const isCommonFirstName = (firstName: string) => COMMON_FIRST_NAMES.has(normalizeAgentName(firstName));

const buildCandidatePool = (style: NameCreatorStyle) => {
  const firstNames = pickFirstNames(style).filter((firstName) => !isCommonFirstName(firstName));
  const candidates: string[] = [];

  firstNames.forEach((firstName) => {
    STRONG_LAST_NAMES.forEach((lastName) => {
      candidates.push(`${firstName} ${lastName}`);
    });
  });

  return candidates;
};

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
};

export const generateAgentNameSuggestions = ({
  agents,
  count,
  style
}: {
  agents: Agent[];
  count: number;
  style: NameCreatorStyle;
}): GeneratedNameSuggestion[] => {
  const safeCount = Math.max(1, Math.min(24, Math.floor(count || 8)));
  const emitted = new Set<string>();
  const suggestions: GeneratedNameSuggestion[] = [];
  const candidates = shuffle(buildCandidatePool(style));

  for (const candidate of candidates) {
    if (suggestions.length >= safeCount) break;

    const normalizedName = normalizeAgentName(candidate);
    if (!normalizedName || emitted.has(normalizedName)) continue;
    emitted.add(normalizedName);

    const validation = validateAgentNameAvailability(candidate, agents, null);
    if (validation.status === 'duplicate') continue;
    if (validation.status !== 'available' && validation.status !== 'similar') continue;

    suggestions.push({
      name: candidate,
      normalizedName,
      status: validation.status,
      message: validation.message,
      conflicts: validation.conflicts
    });
  }

  return suggestions;
};

