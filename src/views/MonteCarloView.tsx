import { useState } from "react";
import { MonteCarloDiscrete } from "../components/MonteCarloDiscrete";
import { MonteCarloContinuous } from "../components/MonteCarloContinuous";

type MCMode = "discreta" | "continua";

export default function MonteCarloView() {
  const [mode, setMode] = useState<MCMode>("discreta");

  return (
    <div className="flex flex-col min-h-dvh text-slate-900 dark:text-purple-100 animate-[fadeSlideUp_0.3s_ease_both]">
      {/* ═══════════ HEADER ═══════════ */}
      <header
        className="bg-slate-100 dark:bg-[#0c0415]
                   border-b border-slate-200 dark:border-purple-900/50
                   px-5 py-4 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Logo Dark"
              className="w-12 h-12 object-contain hidden dark:block"
            />
            <img
              src="/lightlogo.png"
              alt="Logo Light"
              className="w-12 h-12 object-contain block dark:hidden"
            />
          </div>
          <div>
            <h1 className="text-[1.1rem] font-extrabold tracking-tight leading-none">
              Lambda<span className="font-serif italic mx-[1px]">ρ</span>ro
            </h1>
            <p className="text-[0.65rem] text-purple-600 dark:text-purple-500 font-bold uppercase tracking-wider mt-0.5">
              Simulación Monte Carlo
            </p>
          </div>
        </div>
      </header>

      {/* ─── Segmented Control ─── */}
      <div className="px-5 pt-6 pb-2">
        <label className="block text-[0.7rem] font-bold uppercase tracking-[1.5px] text-purple-600 dark:text-purple-600 mb-2">
          Tipo de variable
        </label>

        <div className="bg-slate-200/60 dark:bg-purple-950/30 p-1 rounded-xl flex items-center border border-transparent dark:border-purple-900/20">
          <button
            onClick={() => setMode("discreta")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200
              ${
                mode === "discreta"
                  ? "bg-white dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 shadow-sm"
                  : "text-slate-500 dark:text-purple-400/70 hover:text-slate-700 dark:hover:text-purple-300"
              }`}
          >
            Discreta
            <span className="block text-[0.65rem] font-normal opacity-70">
              Manual / Poisson
            </span>
          </button>
          <button
            onClick={() => setMode("continua")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200
              ${
                mode === "continua"
                  ? "bg-white dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 shadow-sm"
                  : "text-slate-500 dark:text-purple-400/70 hover:text-slate-700 dark:hover:text-purple-300"
              }`}
          >
            Continua
            <span className="block text-[0.65rem] font-normal opacity-70">
              Normal, Exponencial, etc.
            </span>
          </button>
        </div>
      </div>

      {/* ─── Content ─── */}
      <div className="flex-1 px-5 pt-4 pb-4">
        {mode === "discreta" && <MonteCarloDiscrete />}
        {mode === "continua" && <MonteCarloContinuous />}
      </div>
    </div>
  );
}
