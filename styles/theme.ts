import { DefaultTheme } from 'styled-components';

export const lightTheme: DefaultTheme = {
  colors: {
    background: '#ffffff',
    cardBackground: '#f8f9fa',
    primary: '#2563eb',
    secondary: '#7c3aed',
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    accent: {
      blue: '#2563eb',
      purple: '#7c3aed',
    },
    border: '#e2e8f0',
  },
  shadows: {
    small: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.05)',
    medium: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
    large: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
  },
};

export const darkTheme: DefaultTheme = {
  colors: {
    background: '#111827',
    cardBackground: '#1f2937',
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    text: {
      primary: '#f9fafb',
      secondary: '#9ca3af',
    },
    accent: {
      blue: '#3b82f6',
      purple: '#8b5cf6',
    },
    border: '#374151',
  },
  shadows: {
    small: '0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.3)',
    medium: '0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -1px rgba(0,0,0,0.2)',
    large: '0 10px 15px -3px rgba(0,0,0,0.3), 0 4px 6px -2px rgba(0,0,0,0.2)',
  },
};