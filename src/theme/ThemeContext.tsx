import React, { createContext, useContext, useEffect, useState } from 'react';

export type SiteTheme = 'classic' | 'going-dark';

interface ThemeContextValue {
  theme: SiteTheme;
  isGoingDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: SiteTheme) => void;
}

const STORAGE_KEY = 'spire_site_theme';

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<SiteTheme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'going-dark' || saved === 'classic') {
        return saved;
      }
    } catch {
      // Ignore storage access errors in private contexts
    }
    return 'classic';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'going-dark') {
      root.setAttribute('data-theme', 'going-dark');
    } else {
      root.removeAttribute('data-theme');
    }

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore storage write errors
    }
  }, [theme]);

  const setTheme = (next: SiteTheme) => setThemeState(next);
  const toggleTheme = () => setThemeState(prev => (prev === 'going-dark' ? 'classic' : 'going-dark'));

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isGoingDark: theme === 'going-dark',
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return ctx;
}
