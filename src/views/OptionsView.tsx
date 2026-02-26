import { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import { useSettings } from "../context/SettingsContext";

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
      />
    </svg>
  );
}

const DECIMAL_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

/* ─── Toast Alert Component ─── */
function ToleranceToast({
  message,
  visible,
}: {
  message: string;
  visible: boolean;
}) {
  return (
    <div
      className={`
        fixed top-6 left-1/2 -translate-x-1/2 z-[100]
        max-w-[90vw] px-5 py-3
        bg-purple-600/95 dark:bg-purple-500/95 backdrop-blur-md
        text-white text-sm font-semibold
        rounded-2xl shadow-xl shadow-purple-900/40
        transition-all duration-500 ease-out
        ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }
      `}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">⚙️</span>
        <span>{message}</span>
      </div>
    </div>
  );
}

export default function OptionsView() {
  const { isDark, toggle } = useTheme();
  const {
    decimals,
    tolerance,
    setDecimals,
    increaseTolerance,
    decreaseTolerance,
  } = useSettings();

  /* ─── Toast state ─── */
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (direction: "up" | "down", newVal: number) => {
    const dirText = direction === "up" ? "más filas" : "menos filas";
    setToastMessage(
      `Tolerancia → ${newVal.toExponential(0)} — La tabla mostrará ${dirText}`
    );
    setToastVisible(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToastVisible(false), 3000);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleIncrease = () => {
    const next = Math.min(0.5, tolerance * 10);
    increaseTolerance();
    showToast("down", next); // higher tolerance = less rows
  };

  const handleDecrease = () => {
    const next = Math.max(0.000001, tolerance / 10);
    decreaseTolerance();
    showToast("up", next); // lower tolerance = more rows
  };

  // Check if buttons are at limits
  const atMax = tolerance >= 0.5;
  const atMin = tolerance <= 0.000001;

  return (
    <>
      <ToleranceToast message={toastMessage} visible={toastVisible} />

      <div className="p-6 max-w-2xl mx-auto space-y-8 pb-24">
        <header>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Configuración
          </h1>
          <p className="text-slate-500 dark:text-purple-400/60 mt-2">
            Configuración de preferencias del sistema
          </p>
        </header>

        {/* ─── Modo Visual ─── */}
        <section className="bg-white/50 dark:bg-purple-950/20 backdrop-blur-sm border border-slate-200 dark:border-purple-900/30 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-purple-50">
                Modo Visual
              </h2>
              <p className="text-sm text-slate-500 dark:text-purple-400/50">
                Alternar tema de interfaz
              </p>
            </div>

            <button
              onClick={toggle}
              className={`
                relative inline-flex h-12 w-24 items-center rounded-full transition-colors duration-300 focus:outline-none
                ${isDark ? "bg-purple-600" : "bg-slate-200"}
              `}
            >
              <span className="sr-only">Cambiar modo</span>
              <div
                className={`
                  flex items-center justify-center h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform duration-300
                  ${isDark ? "translate-x-12" : "translate-x-1"}
                `}
              >
                {isDark ? <MoonIcon /> : <SunIcon />}
              </div>
            </button>
          </div>
        </section>

        {/* ─── Cantidad de Decimales ─── */}
        <section className="bg-white/50 dark:bg-purple-950/20 backdrop-blur-sm border border-slate-200 dark:border-purple-900/30 rounded-2xl p-6 shadow-sm">
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-purple-50">
                Cantidad de Decimales
              </h2>
              <p className="text-sm text-slate-500 dark:text-purple-400/50">
                Precisión decimal en los resultados
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {DECIMAL_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => setDecimals(n)}
                  className={`
                    min-w-[2.5rem] h-10 rounded-xl text-sm font-bold transition-all duration-200
                    ${
                      decimals === n
                        ? "bg-purple-600 text-white shadow-md shadow-purple-500/30"
                        : "bg-white dark:bg-[#0e0715] border border-slate-300 dark:border-purple-800/70 text-slate-600 dark:text-purple-400 hover:border-purple-500 dark:hover:border-purple-600/80"
                    }
                  `}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-purple-800 italic">
              Valor actual: {decimals} decimales — Ejemplo:{" "}
              {(0.123456789).toFixed(decimals)}
            </p>
          </div>
        </section>

        {/* ─── Tolerancia de Error ─── */}
        <section className="bg-white/50 dark:bg-purple-950/20 backdrop-blur-sm border border-slate-200 dark:border-purple-900/30 rounded-2xl p-6 shadow-sm">
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-purple-50">
                Tolerancia de Error
              </h2>
              <p className="text-sm text-slate-500 dark:text-purple-400/50">
                Umbral de corte para la distribución M/M/1
              </p>
            </div>

            {/* ─── Stepper Control ─── */}
            <div className="flex items-center justify-center gap-4">
              {/* Decrease (more precise = more rows) */}
              <button
                onClick={handleDecrease}
                disabled={atMin}
                className={`
                  flex items-center justify-center w-14 h-14 rounded-2xl
                  text-xl font-bold transition-all duration-200
                  ${
                    atMin
                      ? "bg-slate-100 dark:bg-purple-950/30 text-slate-300 dark:text-purple-900 cursor-not-allowed"
                      : "bg-white dark:bg-[#0e0715] border border-slate-300 dark:border-purple-800/70 text-purple-600 dark:text-purple-400 hover:border-purple-500 dark:hover:border-purple-600/80 hover:shadow-md hover:shadow-purple-500/20 active:scale-95"
                  }
                `}
                aria-label="Disminuir tolerancia"
              >
                ▼
              </button>

              {/* Current value display */}
              <div className="flex flex-col items-center min-w-[10rem]">
                <span className="text-2xl font-bold text-slate-900 dark:text-purple-50 tabular-nums tracking-wide">
                  {tolerance.toExponential(0)}
                </span>
                <span className="text-[0.65rem] text-slate-400 dark:text-purple-700 font-medium mt-1">
                  {tolerance.toFixed(
                    Math.max(0, -Math.floor(Math.log10(tolerance)))
                  )}
                </span>
              </div>

              {/* Increase (less precise = fewer rows) */}
              <button
                onClick={handleIncrease}
                disabled={atMax}
                className={`
                  flex items-center justify-center w-14 h-14 rounded-2xl
                  text-xl font-bold transition-all duration-200
                  ${
                    atMax
                      ? "bg-slate-100 dark:bg-purple-950/30 text-slate-300 dark:text-purple-900 cursor-not-allowed"
                      : "bg-white dark:bg-[#0e0715] border border-slate-300 dark:border-purple-800/70 text-purple-600 dark:text-purple-400 hover:border-purple-500 dark:hover:border-purple-600/80 hover:shadow-md hover:shadow-purple-500/20 active:scale-95"
                  }
                `}
                aria-label="Aumentar tolerancia"
              >
                ▲
              </button>
            </div>

            {/* Scale indicator */}
            <div className="flex items-center justify-between px-2">
              <span className="text-[0.6rem] text-slate-400 dark:text-purple-800 font-medium">
                1e-6 (más filas)
              </span>
              <div className="flex-1 mx-3 h-1 bg-slate-100 dark:bg-purple-950/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-400 dark:bg-purple-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      ((Math.log10(tolerance) + 6) / (Math.log10(0.5) + 6)) *
                      100
                    }%`,
                  }}
                />
              </div>
              <span className="text-[0.6rem] text-slate-400 dark:text-purple-800 font-medium">
                0.5 (menos filas)
              </span>
            </div>

            <p className="text-[11px] text-slate-400 dark:text-purple-800 italic">
              La tabla de distribución M/M/1 se detiene cuando Pn &lt;{" "}
              {tolerance.toExponential(0)}. Valor menor = más filas.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
