import { VideoProviderConfig } from '../types';

export const videosIaProviders: VideoProviderConfig[] = [
  {
    id: 'gemini-veo',
    name: 'Gemini Veo',
    status: 'enabled',
    strengths: ['Narrativa visual', 'Consistência de cena', 'Iteração rápida']
  },
  {
    id: 'sora',
    name: 'Sora',
    status: 'beta',
    strengths: ['Realismo cinematográfico', 'Movimento fluido', 'Composição avançada']
  },
  {
    id: 'kling',
    name: 'Kling',
    status: 'beta',
    strengths: ['Estilo publicitário', 'Variações criativas', 'Aderência visual']
  }
];

export const videosIaStyleLibrary = [
  'cinematografico',
  'documental',
  'motion-branding',
  'social-short-form'
];
