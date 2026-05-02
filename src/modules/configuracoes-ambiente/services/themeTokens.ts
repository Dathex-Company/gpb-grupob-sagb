/**
 * SagB Official Theme Tokens
 * This service centralizes the visual language of the system.
 * Supports light and dark themes via generateCssVariables(theme).
 */

export const lightTokens = {
  colors: {
    // Backgrounds
    bg: '#ffffff',
    bg2: '#f9fafb',

    // Panels
    panel: '#f3f4f6',
    panel2: '#e5e7eb',

    // UI Elements
    line: 'rgba(0,0,0,.06)',
    text: '#111827',
    muted: '#6b7280',

    // Brand & Accents
    blue: '#0a84ff',
    blue2: '#005fcc',
    green: '#16a34a',
    amber: '#d97706',
    red: '#dc2626',

    // Slate/Gray variants
    slate: '#6b7280',
    white: '#ffffff',
  },
};

export const darkTokens = {
  colors: {
    // Backgrounds
    bg: '#1b1d22',
    bg2: '#202329',

    // Panels
    panel: '#24272e',
    panel2: '#292d35',

    // UI Elements
    line: 'rgba(255,255,255,.04)',
    text: '#edf2fb',
    muted: '#96a0ae',

    // Brand & Accents
    blue: '#0a84ff',
    blue2: '#005fcc',
    green: '#32d17d',
    amber: '#f5a623',
    red: '#ff5a5f',

    // Slate/Gray variants
    slate: '#7e8a99',
    white: '#ffffff',
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
      --sagb-bg-2: ${tokens.colors.bg2};
      --sagb-panel: ${tokens.colors.panel};
      --sagb-panel-2: ${tokens.colors.panel2};
      --sagb-line: ${tokens.colors.line};
      --sagb-text: ${tokens.colors.text};
      --sagb-muted: ${tokens.colors.muted};
      --sagb-blue: ${tokens.colors.blue};
      --sagb-blue-2: ${tokens.colors.blue2};
      --sagb-green: ${tokens.colors.green};
      --sagb-amber: ${tokens.colors.amber};
      --sagb-red: ${tokens.colors.red};
      --sagb-slate: ${tokens.colors.slate};
    }
  `;
};
