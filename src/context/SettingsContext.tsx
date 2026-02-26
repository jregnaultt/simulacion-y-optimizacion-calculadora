import { createContext, useContext, useState } from "react";

interface SettingsContextType {
  decimals: number;
  tolerance: number;
  setDecimals: (n: number) => void;
  setTolerance: (t: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [decimals, setDecimalsState] = useState<number>(() => {
    const saved = localStorage.getItem("lambdapro-decimals");
    return saved ? Number(saved) : 4;
  });

  const [tolerance, setToleranceState] = useState<number>(() => {
    const saved = localStorage.getItem("lambdapro-tolerance");
    return saved ? Number(saved) : 0.0001;
  });

  const setDecimals = (n: number) => {
    const clamped = Math.max(1, Math.min(8, Math.round(n)));
    setDecimalsState(clamped);
    localStorage.setItem("lambdapro-decimals", String(clamped));
  };

  const setTolerance = (t: number) => {
    if (t > 0 && t < 1) {
      setToleranceState(t);
      localStorage.setItem("lambdapro-tolerance", String(t));
    }
  };


  return (
    <SettingsContext.Provider value={{ decimals, tolerance, setDecimals, setTolerance }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = (): SettingsContextType => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
};
