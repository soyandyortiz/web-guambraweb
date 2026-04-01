"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { themes, defaultTheme, generateCSSVariables, type Theme } from "@/../theme.config";

type ThemeContextType = {
  currentTheme: Theme;
  themeName: string;
  setTheme: (name: string) => void;
  availableThemes: Theme[];
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<string>(defaultTheme);

  const applyTheme = useCallback((name: string) => {
    const theme = themes[name] ?? themes[defaultTheme];
    const cssVars = generateCSSVariables(theme);

    // Inyectar variables CSS en :root dinámicamente
    let styleTag = document.getElementById("guambra-theme-vars");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "guambra-theme-vars";
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = `:root { ${cssVars} }`;

    // Persistir en localStorage
    localStorage.setItem("guambra-theme", name);
    setThemeName(name);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("guambra-theme") ?? defaultTheme;
    applyTheme(saved);
  }, [applyTheme]);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme: themes[themeName] ?? themes[defaultTheme],
        themeName,
        setTheme: applyTheme,
        availableThemes: Object.values(themes),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
