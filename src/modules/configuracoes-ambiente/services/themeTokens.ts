/**
 * SagB Official Theme Tokens — Robust Clean Palette
 * This service centralizes the visual language of the system.
 * Supports light and dark themes via generateCssVariables(theme).
 *
 * Paleta Robust Clean:
 *   --bg: #F2F4F6          (fundo principal, cinza levemente azulado)
 *   --surface: #FFFFFF      (superfície de cards/containers)
 *   --text: #303842         (Grafite — NUNCA preto puro)
 *   --primary: #2FA99C      (verde-teal, authority color)
 *   --blue: #5D86BC         (azul sereno para links/info)
 *   --red: #C85E62          (vermelho suave para erros/alertas)
 *   --amber: #D4953A        (âmbar para prioridade média/warnings)
 *   --shadow: 0 12px 30px rgba(48,56,66,.07)
 *   --radius-sm: 10px
 *   --radius-xl: 22px
 */

export const lightTokens = {
  colors: {
    // Backgrounds
    bg: '#F2F4F6',
    surface: '#FFFFFF',

    // UI Elements
    line: 'rgba(48,56,66,.08)',
    text: '#303842',
    muted: '#8892A0',

    // Brand & Accents
    primary: '#2FA99C',
    blue: '#5D86BC',
    red: '#C85E62',
    amber: '#D4953A',

    white: '#FFFFFF',
  },
};

export const darkTokens = {
  colors: {
    // Backgrounds
    bg: '#1A1D23',
    surface: '#23272E',

    // UI Elements
    line: 'rgba(255,255,255,.06)',
    text: '#E8EDF5',
    muted: '#8892A0',

    // Brand & Accents
    primary: '#2FA99C',
    blue: '#5D86BC',
    red: '#C85E62',
    amber: '#D4953A',

    white: '#FFFFFF',
  },
};

/**
 * Utility to generate CSS variables for a given theme
 */
export const generateCssVariables = (theme: 'light' | 'dark' = 'light') => {
  const tokens = theme === 'light' ? lightTokens : darkTokens;

  return `
    :root {
      --sagb-bg: ${tokens.colors.bg};
      --sagb-surface: ${tokens.colors.surface};
      --sagb-line: ${tokens.colors.line};
      --sagb-text: ${tokens.colors.text};
      --sagb-muted: ${tokens.colors.muted};
      --sagb-primary: ${tokens.colors.primary};
      --sagb-primary-soft: color-mix(in srgb, ${tokens.colors.primary} 12%, transparent);
      --sagb-primary-hover: ${tokens.colors.primary};
      --sagb-blue: ${tokens.colors.blue};
      --sagb-blue-soft: color-mix(in srgb, ${tokens.colors.blue} 12%, transparent);
      --sagb-red: ${tokens.colors.red};
      --sagb-red-soft: color-mix(in srgb, ${tokens.colors.red} 12%, transparent);
      --sagb-amber: ${tokens.colors.amber};
      --sagb-amber-soft: color-mix(in srgb, ${tokens.colors.amber} 12%, transparent);
      --sagb-shadow: 0 12px 30px rgba(48,56,66,.07);
      --sagb-radius-sm: 10px;
      --sagb-radius-md: 14px;
      --sagb-radius-xl: 22px;
    }
  `;
};
