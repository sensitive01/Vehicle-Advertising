'use client';

import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FACC15', // Vibrant Yellow
      light: '#FDE047',
      dark: '#EAB308',
      contrastText: '#000000',
    },
    secondary: {
      main: '#27272A', // Zinc 800
      light: '#3F3F46',
      dark: '#18181B',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#050505', // Near black
      paper: '#121212', // Dark grey for cards
    },
    text: {
      primary: '#FFFFFF', 
      secondary: '#A1A1AA', // Zinc 400
    }
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    h1: { fontWeight: 900, letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '12px 28px',
          boxShadow: 'none',
          textTransform: 'uppercase',
          fontWeight: 700,
          '&:hover': {
            boxShadow: '0 4px 20px rgba(250, 204, 21, 0.4)',
          },
        },
        contained: {
          backgroundColor: '#FACC15',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#FDE047',
          }
        },
        outlined: {
          borderColor: '#FACC15',
          color: '#FACC15',
          borderWidth: '2px',
          '&:hover': {
            backgroundColor: 'rgba(250, 204, 21, 0.1)',
            borderColor: '#FDE047',
            borderWidth: '2px',
          }
        }
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#FACC15',
          fontWeight: 500,
          '&.Mui-focused': {
            color: '#FDE047',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
          color: '#FFFFFF',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#333333',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#555555',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#FACC15',
          },
        },
        input: {
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 100px #1E1E1E inset !important',
            WebkitTextFillColor: '#FFFFFF !important',
            caretColor: '#FFFFFF',
            borderRadius: 'inherit',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          border: '1px solid #333333',
          backgroundImage: 'none',
          transition: 'all 0.3s ease-in-out',
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#333333',
        }
      }
    }
  },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}
