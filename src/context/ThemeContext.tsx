import { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("lambdapro-theme");
    return saved ? saved === "dark" : true; // oscuro por defecto
  });

  // Aplica / quita la clase .dark en <html> para activar dark: variants de Tailwind v4
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const toggle = () =>
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("lambdapro-theme", next ? "dark" : "light");
      return next;
    });

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};
