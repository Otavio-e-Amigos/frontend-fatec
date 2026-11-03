import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext<any>(undefined);

const AVAILABLE_THEMES = ['default', 'example', 'protanopia', 'monochromatic'];
const DEFAULT_THEME = 'default'

export function ThemeProvider({ children, storage }: {children: any, storage:any}) {
	const [localStorage] = useState<any>(storage)
  const [theme, setTheme] = useState(() => {
    // Load saved preference or default to 'system'
    return localStorage.getItem('app-theme') || DEFAULT_THEME;
  });

  useEffect(() => {
    const root = document.documentElement;
    // const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    // const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		AVAILABLE_THEMES.forEach(
			(t) => {
				console.log(t)
				root.classList.remove(`theme-${t}`)
			}
		);

		if (theme !== DEFAULT_THEME)
			root.classList.add(`theme-${theme}`)
		// else

		localStorage.setItem('app-theme', theme);

		// const applyTheme = () => {
  //     root.classList.remove('dark');

  //     if (theme === 'dark' || (theme === 'system' && mediaQuery.matches)) {
  //       root.classList.add('dark');
  //     }
  //   };

  //   applyTheme();

  //   if (theme === 'system') {
  //     localStorage.removeItem('theme');
  //   } else {
  //     localStorage.setItem('theme', theme);
  //   }

    // const handleSystemChange = () => {
    //   if (theme === 'system') {
    //     applyTheme();
    //   }
    // };

    // mediaQuery.addEventListener('change', handleSystemChange);
    // return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, AVAILABLE_THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
