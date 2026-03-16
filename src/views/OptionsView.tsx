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

const TOLERANCE_OPTIONS = [
  { value: 0.1, label: "0.1" },
  { value: 0.01, label: "0.01" },
  { value: 0.001, label: "0.001" },
  { value: 0.0001, label: "0.0001" },
  { value: 0.00001, label: "0.00001" },
  { value: 0.000001, label: "0.000001" },
];

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
  const { decimals, tolerance, setDecimals, setTolerance } = useSettings();

    return (
        <div className="p-6 max-w-xl mx-auto space-y-6 pb-24 animate-[fadeSlideUp_0.3s_ease_both]">
            <header className="px-1">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-purple-50 tracking-tight">
                    Configuración
                </h1>
                <p className="text-sm text-slate-500 dark:text-purple-400/60 font-medium mt-1">
                    Personaliza tu experiencia con la calculadora
                </p>
            </header>

            <section className="bg-white/70 dark:bg-[#12091c]/90 backdrop-blur-md border border-slate-200 dark:border-purple-900/40 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h2 className="text-base font-bold text-slate-800 dark:text-purple-100 uppercase tracking-wide">
                            Modo Visual
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-purple-400/50 italic">
                            Cambia entre el tema claro y oscuro
                        </p>
                    </div>

                    <button
                        onClick={toggle}
                        className={`
                            relative inline-flex h-9 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/20
                            ${isDark ? 'bg-purple-600 shadow-[0_0_12px_rgba(147,51,234,0.4)]' : 'bg-slate-200'}
                        `}
                    >
                        <span className="sr-only">Cambiar modo</span>
                        <div
                            className={`
                                flex items-center justify-center h-7 w-7 transform rounded-full bg-white shadow-md transition-transform duration-300
                                ${isDark ? 'translate-x-[1.9rem]' : 'translate-x-1'}
                            `}
                        >
                            <div className="text-purple-600">
                                {isDark ? <MoonIcon /> : <SunIcon />}
                            </div>
                        </div>
                    </button>
                </div>
            </section>

            <section className="bg-white/70 dark:bg-[#12091c]/90 backdrop-blur-md border border-slate-200 dark:border-purple-900/40 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h2 className="text-base font-bold text-slate-800 dark:text-purple-100 uppercase tracking-wide">
                            Precisión Decimal
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-purple-400/50 italic leading-tight">
                            Número de decimales para los resultados
                        </p>
                    </div>

                    <div className="relative w-24">
                        <input
                            type="text"
                            defaultValue="4"
                            className="w-full bg-slate-50/50 dark:bg-[#0e0715] border border-slate-300 dark:border-purple-800/70 rounded-xl px-4 py-2.5 text-base text-center text-slate-900 dark:text-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-mono shadow-inner"
                            readOnly
                        />
                        <div className="absolute -right-1 -top-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.6)] animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
    setToastVisible(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToastVisible(false), 3000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

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
              Valor actual: {decimals} decimales — Tolerancia sincronizada: {Math.pow(10, -decimals)}
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

            {/* ─── Chip Selector ─── */}
            <div className="flex flex-wrap gap-2">
              {TOLERANCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleToleranceChange(opt.value)}
                  className={`
                    px-3 h-10 rounded-xl text-sm font-bold transition-all duration-200
                    ${
                      tolerance === opt.value
                        ? "bg-purple-600 text-white shadow-md shadow-purple-500/30"
                        : "bg-white dark:bg-[#0e0715] border border-slate-300 dark:border-purple-800/70 text-slate-600 dark:text-purple-400 hover:border-purple-500 dark:hover:border-purple-600/80"
                    }
                  `}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 dark:text-purple-800 italic">
              La tabla se detiene cuando 1 - Fn &lt; {tolerance}. Cambiar esto
              ajusta automáticamente los decimales.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
