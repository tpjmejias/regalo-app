export interface ColorTheme {
  id: string;
  name: string;
  gradient: string;
}

export const colorThemes: ColorTheme[] = [
  {
    id: 'purple',
    name: 'Púrpura',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'blue',
    name: 'Azul',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'green',
    name: 'Verde',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    id: 'orange',
    name: 'Naranja',
    gradient: 'from-orange-500 to-yellow-500'
  },
  {
    id: 'red',
    name: 'Rojo',
    gradient: 'from-red-500 to-rose-500'
  },
  {
    id: 'indigo',
    name: 'Índigo',
    gradient: 'from-indigo-500 to-violet-500'
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
  