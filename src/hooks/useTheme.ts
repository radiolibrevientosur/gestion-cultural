import { useState, useEffect } from 'react';
import { ThemeConfig } from '../types/cultural';

const defaultTheme: ThemeConfig = {
  mode: 'system',
  primaryColor: '#FF7F50',
  secondaryColor: '#4B0082',
};

export function useTheme() {
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const saved = localStorage.getItem('theme');
    return saved ? JSON.parse(saved) : defaultTheme;
  });

  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const currentTheme = theme.mode === 'system' ? systemTheme : theme.mode;
    document.documentElement.classList.toggle('dark', currentTheme === 'dark');
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme, systemTheme]);

  const toggleTheme = () => {
    setTheme(prev => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : 'light',
    }));
  };

  const setThemeMode = (mode: ThemeConfig['mode']) => {
    setTheme(prev => ({ ...prev, mode }));
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    setThemeMode,
    currentTheme: theme.mode === 'system' ? systemTheme : theme.mode,
  };
}