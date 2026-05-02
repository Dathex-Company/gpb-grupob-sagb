import React, { createContext, useContext, useEffect, useState } from 'react';
import { generateCssVariables } from '../../modules/configuracoes-ambiente/services/themeTokens';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Migração única: força 'light' como padrão, ignorando localStorage de versões anteriores
  const [theme, setThemeState] = useState<Theme>(() => {
    const migrated = localStorage.getItem('sagb-theme-migrated-v1');
    if (!migrated) {
      localStorage.removeItem('sagb-theme');
      localStorage.setItem('sagb-theme-migrated-v1', 'true');
    }
    const saved = localStorage.getItem('sagb-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'light';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('sagb-theme', newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Injeta as variáveis CSS corretas para o tema atual
    const styleId = 'sagb-theme-variables';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = generateCssVariables(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
