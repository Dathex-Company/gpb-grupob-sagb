export type VideoProviderId = 'gemini-veo' | 'sora' | 'kling';

export interface VideoProviderConfig {
  id: VideoProviderId;
  name: string;
  status: 'enabled' | 'beta' | 'planned';
  strengths: string[];
}

export interface VideoPromptAsset {
  id: string;
  briefing: string;
  promptBase: string;
  promptRefinado?: string;
  promptMaster?: string;
  estilo?: string;
  tags: string[];
  favorito: boolean;
  versao: number;
}

export interface VideoRecipe {
  id: string;
  nome: string;
  provider: VideoProviderId;
  promptAssetId: string;
  configuracao: Record<string, any>;
  observacoes?: string;
}
