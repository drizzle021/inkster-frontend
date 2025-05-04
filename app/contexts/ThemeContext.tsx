import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<'light' | 'dark'>(systemColorScheme || 'light');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('appTheme');
        if (storedTheme) {
          setTheme(storedTheme as 'light' | 'dark');
        } else {
          setTheme(systemColorScheme || 'light');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
        setTheme(systemColorScheme || 'light'); // Fallback to system on error
      }
    };

    loadTheme();
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const saveTheme = async () => {
      try {
        await AsyncStorage.setItem('appTheme', theme);
      } catch (error) {
        console.error('Error saving theme:', error);
      }
    };

    saveTheme();
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};