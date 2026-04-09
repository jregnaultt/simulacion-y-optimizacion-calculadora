import React, { useState } from "react";
import {
  runContinuousSimulation,
  getTheoreticalStatsContinuous,
  runMultivariableContinuousSimulation,
  type SimulationResult,
  type TheoreticalStats,
  type MultiVariableResult,
} from "../utils/math/monteCarloSimulation";
import { MonteCarloResults } from "./MonteCarloResults";
import { MonteCarloMatrixResults } from "./MonteCarloMatrixResults";

const INPUT_CLS = `block w-full rounded-xl border border-slate-300 dark:border-purple-800
  bg-slate-50 dark:bg-[#0e0715] text-slate-900 dark:text-purple-100
  placeholder:text-slate-400 dark:placeholder:text-purple-400/50 placeholder:font-medium
  focus:border-purple-500 dark:focus:border-purple-500/80
  focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-500/15
  dark:focus:bg-[#140a20] outline-none text-sm p-2 transition-all`;

const PRESET_N = [100, 1000, 5000, 10000];

export const MonteCarloContinuous: React.FC = () => {
  const [media, setMedia] = useState<number | "">(5);
  const [numIterations, setNumIterations] = useState<number | "">(1000);
  const [numVariables, setNumVariables] = useState<number | "">(1);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [multiResult, setMultiResult] = useState<MultiVariableResult | null>(
    null,
  );
  const [theoretical, setTheoretical] = useState<TheoreticalStats | null>(null);

  const allValid = typeof media === "number" && media > 0;

  const canSimulate =
    allValid && typeof numIterations === "number" && numIterations > 0;

  const isMultiMode =
    typeof numVariables === "number" && numVariables > 1;

  const handleSimulate = () => {
    if (!canSimulate) return;
    const params = { media: media as number };

    setTheoretical(getTheoreticalStatsContinuous("exponential", params));

    // Multivariable path (k > 1)
    if (isMultiMode) {
      setResult(null);
      setMultiResult(
        runMultivariableContinuousSimulation(
          "exponential",
          params,
          numIterations as number,
          numVariables as number,
        ),
      );
      return;
    }

    setMultiResult(null);
    setResult(
      runContinuousSimulation("exponential", params, numIterations as number),
    );
  };

  return (
    <div className="flex flex-col h-full animate-[fadeSlideUp_0.3s_ease_both]">
      <p className="text-slate-500 dark:text-purple-400 text-sm leading-relaxed mb-4">
        Distribución Exponencial (continua). Los valores se generan mediante{" "}
        <span className="font-semibold text-slate-700 dark:text-purple-300">
          simulación Monte Carlo
        </span>
        .
      </p>

      {/* ── Parameters ── */}
      <div className="bg-white dark:bg-[#12091c] rounded-2xl border border-slate-200 dark:border-purple-900/60 shadow-sm dark:shadow-black/40 overflow-hidden mb-4">
        <div className="p-4 border-b border-slate-100 dark:border-purple-900/40 bg-slate-50/50 dark:bg-[#0a040f]/60">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-purple-500/90 uppercase tracking-wider">
            Distribución Exponencial
          </h2>
        </div>
        <div className="p-4 space-y-4">
          {/* Formula hint */}
          <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200 dark:border-purple-900/50">
            <span className="text-xs text-slate-500 dark:text-purple-500 font-medium">
              Fórmula:{" "}
            </span>
            <span className="text-sm font-mono text-purple-700 dark:text-purple-300 font-semibold">
              X = −μ · ln(1 − U)
            </span>
          </div>

          {/* Media (μ) */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-purple-400 mb-1">
              Media (μ)
            </label>
            <input
              type="number"
              inputMode="decimal"
              step="any"
              className={INPUT_CLS}
              placeholder="Ej. 5"
              value={media}
              onChange={(e) => {
                if (e.target.value === "") {
                  setMedia("");
                  return;
                }
                const v = parseFloat(e.target.value);
                if (!isNaN(v) && v > 0) setMedia(v);
              }}
            />
          </div>

          {/* ── Num Variables input ── */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-purple-400 mb-1">
              Cantidad de Variables (k)
            </label>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              max="50"
              className={INPUT_CLS}
              placeholder="Ej. 5"
              value={numVariables}
              onChange={(e) => {
                if (e.target.value === "") {
                  setNumVariables("");
                  return;
                }
                const v = parseInt(e.target.value, 10);
                if (!isNaN(v) && v > 0) setNumVariables(Math.min(v, 50));
              }}
              onKeyDown={(e) => {
                if (
                  e.key === "-" ||
                  e.key === "e" ||
                  e.key === "E" ||
                  e.key === "+" ||
                  e.key === "."
                )
                  e.preventDefault();
              }}
            />
            <p className="text-[0.65rem] text-slate-400 dark:text-purple-600 mt-1">
              Cada variable es una columna independiente simulada con la misma
              μ.
            </p>
          </div>
        </div>
      </div>

      {/* ── Iterations Config ── */}
      <div className="bg-white dark:bg-[#12091c] rounded-2xl border border-slate-200 dark:border-purple-900/60 shadow-sm dark:shadow-black/40 overflow-hidden mb-4">
        <div className="p-4 border-b border-slate-100 dark:border-purple-900/40 bg-slate-50/50 dark:bg-[#0a040f]/60">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-purple-500/90 uppercase tracking-wider">
            Configuración
          </h2>
        </div>
        <div className="p-4 space-y-3">
          <label className="block text-sm font-medium text-slate-700 dark:text-purple-400 mb-1">
            Número de Iteraciones
          </label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {PRESET_N.map((n) => (
              <button
                key={n}
                onClick={() => setNumIterations(n)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all
                  ${
                    numIterations === n
                      ? "bg-purple-600 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-purple-950/40 text-slate-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40"
                  }`}
              >
                {n.toLocaleString()}
              </button>
            ))}
          </div>
          <input
            type="number"
            inputMode="numeric"
            min="1"
            max="100000"
            className={INPUT_CLS}
            placeholder="Cantidad personalizada (máx 100 000)"
            value={numIterations}
            onChange={(e) => {
              if (e.target.value === "") {
                setNumIterations("");
                return;
              }
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v) && v > 0) setNumIterations(Math.min(v, 100000));
            }}
            onKeyDown={(e) => {
              if (
                e.key === "-" ||
                e.key === "e" ||
                e.key === "E" ||
                e.key === "+" ||
                e.key === "."
              )
                e.preventDefault();
            }}
          />
        </div>
      </div>

      <button
        onClick={handleSimulate}
        disabled={!canSimulate}
        className="w-full py-3.5 rounded-xl font-bold text-white
                   bg-purple-600 hover:bg-purple-700 active:bg-purple-800
                   disabled:bg-slate-300 dark:disabled:bg-purple-950/40
                   disabled:text-slate-500 dark:disabled:text-purple-700
                   disabled:cursor-not-allowed
                   transition-all duration-150 shadow-sm
                   dark:shadow-purple-900/30 mb-4"
      >
        Simular
      </button>

      {/* ── Single-variable Results ── */}
      {result && (
        <MonteCarloResults
          result={result}
          theoretical={theoretical ?? undefined}
        />
      )}

      {/* ── Multivariable Results ── */}
      {multiResult && (
        <MonteCarloMatrixResults
          result={multiResult}
          theoreticalMean={media as number}
          theoreticalLabel="μ"
          continuous
          generatorFormula="X = −μ · ln(1 − U)"
        />
      )}
    </div>
  );
};
