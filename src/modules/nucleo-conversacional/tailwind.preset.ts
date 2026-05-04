/**
 * Tailwind Preset — Núcleo Conversacional
 *
 * Tokens de cor extraidos do index.html do SagB (tailwind.config inline).
 * Use este preset em qualquer projeto Tailwind que consuma o modulo.
 *
 * Se o host usa Tailwind via CDN (script inline no HTML), copie o objeto
 * tailwindTokens para dentro do tailwind.config.theme.extend no HTML.
 */

export const bitrixTokens = {
  nav: '#111827',
  accent: '#7C3AED',
  text: '#1F2937',
  secondary: '#6B7280',
  border: '#E5E7EB',
  surface: '#FFFFFF',
} as const;

export type BitrixToken = keyof typeof bitrixTokens;

export const sagbColors = {
  bg: '#FFFFFF',
  'bg-2': '#F9FAFB',
  panel: '#FFFFFF',
  'panel-2': '#F9FAFB',
  line: 'rgba(0,0,0,.05)',
  text: '#1F2937',
  muted: '#6B7280',
  blue: '#3B82F6',
  'blue-2': '#2563EB',
  green: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
} as const;

export type SagbColorToken = keyof typeof sagbColors;

export const sagbGradients = {
  'gradient-panels': 'linear-gradient(180deg, #FFFFFF, #F9FAFB)',
  'gradient-brand': 'linear-gradient(135deg, #3B82F6, #2563EB)',
  'gradient-menu-active': 'linear-gradient(180deg, #EFF6FF, #DBEAFE)',
} as const;

export const sagbBoxShadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.01)',
  DEFAULT: '0 1px 3px rgba(0, 0, 0, 0.02)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.02)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.03)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.03)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.01)',
  soft: '0 2px 10px rgba(0, 0, 0, 0.01)',
  hover: '0 20px 40px rgba(0, 0, 0, 0.02)',
} as const;

/**
 * Objeto completo de tokens para uso direto num tailwind.config.theme.extend.
 * Copie isto para o CDN inline ou use como preset do PostCSS.
 */
export const tailwindTokens = {
  colors: {
    bitrix: bitrixTokens,
    sagb: sagbColors,
  },
  backgroundImage: sagbGradients,
  boxShadow: sagbBoxShadows,
} as const;

/**
 * Preset completo para tailwind.config.js (modo PostCSS/npm).
 *
 * Uso:
 *   module.exports = {
 *     presets: [require('@sagb/nucleo-conversacional/tailwind-preset').ncTailwindPreset],
 *     content: [...]
 *   }
 */
export const ncTailwindPreset = {
  theme: {
    extend: {
      colors: {
        bitrix: bitrixTokens,
        sagb: sagbColors,
      },
      backgroundImage: sagbGradients,
      boxShadow: sagbBoxShadows,
    },
  },
} as const;
