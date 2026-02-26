import { createContext, useContext, useState, useCallback } from "react";

interface SettingsContextType {
  decimals: number;
  tolerance: number;
  setDecimals: (n: number) => void;
  setTolerance: (t: number) => void;
  increaseTolerance: () => void;
  decreaseTolerance: () => void;
}

const TOLERANCE_MIN = 0.000001;
const TOLERANCE_MAX = 0.5;

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
    if (t >= TOLERANCE_MIN && t <= TOLERANCE_MAX) {
      setToleranceState(t);
      localStorage.setItem("lambdapro-tolerance", String(t));
    }
  };

  const increaseTolerance = useCallback(() => {
    setToleranceState((prev) => {
      const next = Math.min(TOLERANCE_MAX, prev * 10);
      localStorage.setItem("lambdapro-tolerance", String(next));
      return next;
    });
  }, []);

  const decreaseTolerance = useCallback(() => {
    setToleranceState((prev) => {
      const next = Math.max(TOLERANCE_MIN, prev / 10);
      localStorage.setItem("lambdapro-tolerance", String(next));
      return next;
    });
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        decimals,
        tolerance,
        setDecimals,
        setTolerance,
        increaseTolerance,
        decreaseTolerance,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = (): SettingsContextType => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
};
