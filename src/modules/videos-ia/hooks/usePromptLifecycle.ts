import { useMemo } from 'react';

export const usePromptLifecycle = (promptBase: string, promptRefinado?: string) => {
  return useMemo(() => {
    const promptMaster = [promptBase, promptRefinado].filter(Boolean).join('\n\n').trim();
    return {
      promptBase,
      promptRefinado: promptRefinado || '',
      promptMaster
    };
  }, [promptBase, promptRefinado]);
};
