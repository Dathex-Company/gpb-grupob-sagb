/**
 * SagB Official Theme Tokens
 * This service centralizes the visual language of the system.
 */

export const themeTokens = {
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
  
  gradients: {
    body: {
      radial1: 'rgba(10,132,255,.16)',
      radial2: 'rgba(10,132,255,.07)',
      linear: 'linear-gradient(180deg, #1a1c21, #16181d)',
    },
    panels: 'linear-gradient(180deg, #24272e, #292d35)',
    brand: 'linear-gradient(135deg, #0a84ff, #005fcc)',
    search: 'linear-gradient(180deg, #20242b, #1f2329)',
    menuActive: 'linear-gradient(180deg, #1d3558, #17304f)',
    buttons: 'linear-gradient(180deg, #262a31, #23272e)',
    primaryButton: 'linear-gradient(135deg, #0a84ff, #005fcc)',
    tabsActive: 'linear-gradient(180deg, #22374f, #1d3045)',
    ringCard: 'linear-gradient(180deg, #262a31, #23272e)',
    timeTag: 'linear-gradient(180deg, #20242a, #1e2228)',
    switchOff: 'linear-gradient(180deg, #23262d, #1f2329)',
    switchOn: 'linear-gradient(180deg, #0d67c5, #0a84ff)',
    switchHandle: 'linear-gradient(180deg, #fbfcff, #d8dfeb)',
  },

  status: {
    active: '#32d17d',
    test: '#f5a623',
    error: '#ff5a5f',
    inactive: '#ff5a5f',
  }
};

/**
 * Utility to generate CSS variables for the theme
 */
export const generateCssVariables = () => {
  return `
    :root {
      --sagb-bg: ${themeTokens.colors.bg};
      --sagb-bg-2: ${themeTokens.colors.bg2};
      --sagb-panel: ${themeTokens.colors.panel};
      --sagb-panel-2: ${themeTokens.colors.panel2};
      --sagb-line: ${themeTokens.colors.line};
      --sagb-text: ${themeTokens.colors.text};
      --sagb-muted: ${themeTokens.colors.muted};
      --sagb-blue: ${themeTokens.colors.blue};
      --sagb-blue-2: ${themeTokens.colors.blue2};
      --sagb-green: ${themeTokens.colors.green};
      --sagb-amber: ${themeTokens.colors.amber};
      --sagb-red: ${themeTokens.colors.red};
      
      --sagb-gradient-panels: ${themeTokens.gradients.panels};
      --sagb-gradient-brand: ${themeTokens.gradients.brand};
      --sagb-gradient-menu-active: ${themeTokens.gradients.menuActive};
    }
  `;
};
