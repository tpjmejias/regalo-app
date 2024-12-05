export const colorThemes = [
  {
    id: 'pink-violet',
    name: 'Rosa y Violeta',
    gradient: 'from-pink-500 to-violet-500',
    primary: {
      light: '#F9A8D4',
      DEFAULT: '#EC4899',
      dark: '#BE185D',
    },
    secondary: {
      light: '#C4B5FD',
      DEFAULT: '#8B5CF6',
      dark: '#6D28D9',
    }
  },
  {
    id: 'blue-purple',
    name: 'Azul y Morado',
    gradient: 'from-blue-500 to-purple-500',
    primary: {
      light: '#93C5FD',
      DEFAULT: '#3B82F6',
      dark: '#1D4ED8',
    },
    secondary: {
      light: '#C084FC',
      DEFAULT: '#9333EA',
      dark: '#6B21A8',
    }
  },
  {
    id: 'teal-emerald',
    name: 'Verde Agua y Esmeralda',
    gradient: 'from-teal-500 to-emerald-500',
    primary: {
      light: '#5EEAD4',
      DEFAULT: '#14B8A6',
      dark: '#0F766E',
    },
    secondary: {
      light: '#6EE7B7',
      DEFAULT: '#10B981',
      dark: '#047857',
    }
  },
  {
    id: 'orange-red',
    name: 'Naranja y Rojo',
    gradient: 'from-orange-500 to-red-500',
    primary: {
      light: '#FDBA74',
      DEFAULT: '#F97316',
      dark: '#C2410C',
    },
    secondary: {
      light: '#FCA5A5',
      DEFAULT: '#EF4444',
      dark: '#B91C1C',
    }
  },
  {
    id: 'indigo-sky',
    name: 'Índigo y Cielo',
    gradient: 'from-indigo-500 to-sky-500',
    primary: {
      light: '#A5B4FC',
      DEFAULT: '#6366F1',
      dark: '#4338CA',
    },
    secondary: {
      light: '#7DD3FC',
      DEFAULT: '#0EA5E9',
      dark: '#0369A1',
    }
  },
  {
    id: 'rose-pink',
    name: 'Rosa y Coral',
    gradient: 'from-rose-500 to-pink-500',
    primary: {
      light: '#FDA4AF',
      DEFAULT: '#F43F5E',
      dark: '#BE123C',
    },
    secondary: {
      light: '#F9A8D4',
      DEFAULT: '#EC4899',
      dark: '#BE185D',
    }
  },
  {
    id: 'amber-orange',
    name: 'Ámbar y Naranja',
    gradient: 'from-amber-500 to-orange-500',
    primary: {
      light: '#FCD34D',
      DEFAULT: '#F59E0B',
      dark: '#B45309',
    },
    secondary: {
      light: '#FDBA74',
      DEFAULT: '#F97316',
      dark: '#C2410C',
    }
  },
  {
    id: 'lime-green',
    name: 'Lima y Verde',
    gradient: 'from-lime-500 to-green-500',
    primary: {
      light: '#BEF264',
      DEFAULT: '#84CC16',
      dark: '#3F6212',
    },
    secondary: {
      light: '#86EFAC',
      DEFAULT: '#22C55E',
      dark: '#15803D',
    }
  },
  {
    id: 'cyan-blue',
    name: 'Cian y Azul',
    gradient: 'from-cyan-500 to-blue-500',
    primary: {
      light: '#67E8F9',
      DEFAULT: '#06B6D4',
      dark: '#0E7490',
    },
    secondary: {
      light: '#93C5FD',
      DEFAULT: '#3B82F6',
      dark: '#1D4ED8',
    }
  },
  {
    id: 'fuchsia-purple',
    name: 'Fucsia y Púrpura',
    gradient: 'from-fuchsia-500 to-purple-500',
    primary: {
      light: '#F5D0FE',
      DEFAULT: '#D946EF',
      dark: '#A21CAF',
    },
    secondary: {
      light: '#E9D5FF',
      DEFAULT: '#A855F7',
      dark: '#7E22CE',
    }
  }
];

export const theme = {
  colors: colorThemes[0], // Tema por defecto
  fonts: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif']
  },
  logo: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 12v10H4V12"/>
      <path d="M2 7h20v5H2z"/>
      <path d="M12 22V7"/>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    </svg>`,
    text: 'LinkGift'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
  },
  transitions: {
    DEFAULT: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.5s ease'
  },
  borderRadius: {
    sm: '0.375rem',
    DEFAULT: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px'
  }
} as const;
  