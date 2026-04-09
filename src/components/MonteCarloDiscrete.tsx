import React, { useState, useMemo } from "react";
import {
  buildCumulativeDistribution,
  getTheoreticalStatsPoisson,
  generatePoissonDistribution,
  runMultivariableDiscreteSimulation,
  runDiscreteSimulation,
  type SimulationResult,
  type TheoreticalStats,
  type MultiVariableResult,
} from "../utils/math/monteCarloSimulation";
import { MonteCarloResults } from "./MonteCarloResults";
import { MonteCarloMatrixResults } from "./MonteCarloMatrixResults";
import { useSettings } from "../context/SettingsContext";
import { formatSmart } from "../utils/formatSmart";

const INPUT_CLS = `block w-full rounded-xl border border-slate-300 dark:border-purple-800
  bg-slate-50 dark:bg-[#0e0715] text-slate-900 dark:text-purple-100
  placeholder:text-slate-400 dark:placeholder:text-purple-400/50 placeholder:font-medium
  focus:border-purple-500 dark:focus:border-purple-500/80
  focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-500/15
  dark:focus:bg-[#140a20] outline-none text-sm p-2 transition-all`;

const PRESET_N = [100, 1000, 5000, 10000];

export const MonteCarloDiscrete: React.FC = () => {
  const { decimals } = useSettings();

  // ── Poisson state ──
  const [poissonLambda, setPoissonLambda] = useState<number | "">(3);

  // ── Shared state ──
  const [numIterations, setNumIterations] = useState<number | "">(1000);
  const [numVariables, setNumVariables] = useState<number | "">(1);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [multiResult, setMultiResult] = useState<MultiVariableResult | null>(
    null,
  );
  const [theoretical, setTheoretical] = useState<TheoreticalStats | null>(
    null,
  );

  // ── Poisson helpers ──
  const poissonRows = useMemo(
    () =>
      typeof poissonLambda === "number" && poissonLambda > 0
        ? generatePoissonDistribution(poissonLambda)
        : [],
    [poissonLambda],
  );

  const canSimulate =
    typeof poissonLambda === "number" &&
    poissonLambda > 0 &&
    poissonRows.length >= 1 &&
    typeof numIterations === "number" &&
    numIterations > 0;

  const cumDist = useMemo(
    () =>
      poissonRows.length > 0
        ? buildCumulativeDistribution(poissonRows)
        : null,
    [poissonRows],
  );

  const effectiveK =
    typeof numVariables === "number" && numVariables > 1
      ? numVariables
      : 1;

  const handleSimulate = () => {
    if (!canSimulate) return;

    setTheoretical(getTheoreticalStatsPoisson(poissonLambda as number));

    // Multivariable path (k > 1)
    if (effectiveK > 1) {
      setResult(null);
      setMultiResult(
        runMultivariableDiscreteSimulation(
          poissonRows,
          numIterations as number,
          effectiveK,
        ),
      );
      return;
    }

    setMultiResult(null);
    setResult(runDiscreteSimulation(poissonRows, numIterations as number));
  };

  return (
    <div className="flex flex-col h-full animate-[fadeSlideUp_0.3s_ease_both]">
      <p className="text-slate-500 dark:text-purple-400 text-sm leading-relaxed mb-4">
        Distribución de Poisson (discreta). Se usa el{" "}
        <span className="font-semibold text-slate-700 dark:text-purple-300">
          método de Transformación Inversa
        </span>{" "}
        para generar los valores simulados.
      </p>

      {/* ── Poisson Input ── */}
      <div className="bg-white dark:bg-[#12091c] rounded-2xl border border-slate-200 dark:border-purple-900/60 shadow-sm dark:shadow-black/40 overflow-hidden mb-4">
        <div className="p-4 border-b border-slate-100 dark:border-purple-900/40 bg-slate-50/50 dark:bg-[#0a040f]/60">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-purple-500/90 uppercase tracking-wider">
            Distribución de Poisson
          </h2>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-purple-400 mb-1">
              Tasa promedio (λ)
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="0.1"
              step="any"
              className={INPUT_CLS}
              placeholder="Ej. 3"
              value={poissonLambda}
              onChange={(e) => {
                if (e.target.value === "") {
                  setPoissonLambda("");
                  return;
                }
                const v = parseFloat(e.target.value);
                if (!isNaN(v) && v > 0) setPoissonLambda(v);
              }}
            />
          </div>

          {/* Formula hint */}
          <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200 dark:border-purple-900/50">
            <span className="text-xs text-slate-500 dark:text-purple-500 font-medium">
              Fórmula:{" "}
            </span>
            <span className="text-sm font-mono text-purple-700 dark:text-purple-300 font-semibold">
              P(X=k) = (λ^k · e^(-λ)) / k!
            </span>
          </div>

          {/* Theoretical values */}
          {typeof poissonLambda === "number" && poissonLambda > 0 && (
            <div className="grid grid-cols-3 gap-2">
              <div className="px-3 py-2 rounded-xl bg-purple-50/50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-700/50">
                <span className="text-[0.65rem] text-purple-600 dark:text-purple-500 font-medium block">
                  Media
                </span>
                <span className="text-sm font-bold text-purple-900 dark:text-purple-300">
                  {formatSmart(poissonLambda, decimals)}
                </span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-purple-50/50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-700/50">
                <span className="text-[0.65rem] text-purple-600 dark:text-purple-500 font-medium block">
                  Varianza
                </span>
                <span className="text-sm font-bold text-purple-900 dark:text-purple-300">
                  {formatSmart(poissonLambda, decimals)}
                </span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-purple-50/50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-700/50">
                <span className="text-[0.65rem] text-purple-600 dark:text-purple-500 font-medium block">
                  Desv. Est.
                </span>
                <span className="text-sm font-bold text-purple-900 dark:text-purple-300">
                  {formatSmart(Math.sqrt(poissonLambda), decimals)}
                </span>
              </div>
            </div>
          )}

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
              Cada variable es una columna independiente simulada con la misma λ.
            </p>
          </div>

          {/* Generated PMF table (limited preview) */}
          {poissonRows.length > 0 && (
            <div className="text-xs text-slate-500 dark:text-purple-500">
              Tabla generada: {poissonRows.length} valores (k = 0 …{" "}
              {poissonRows[poissonRows.length - 1].value})
            </div>
          )}
        </div>
      </div>

      {/* ── Cumulative Distribution Preview ── */}
      {cumDist && cumDist.length <= 30 && (
        <div className="bg-white dark:bg-[#12091c] rounded-2xl border border-slate-200 dark:border-purple-900/60 shadow-sm dark:shadow-black/40 overflow-hidden mb-4">
          <div className="p-4 border-b border-slate-100 dark:border-purple-900/40 bg-slate-50/50 dark:bg-[#0a040f]/60">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-purple-500/90 uppercase tracking-wider">
              Distribución Acumulada (F)
            </h2>
          </div>
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white dark:bg-[#12091c]">
                <tr className="border-b border-slate-100 dark:border-purple-900/40">
                  <th className="text-left p-3 text-slate-500 dark:text-purple-500 font-semibold">
                    Valor
                  </th>
                  <th className="text-right p-3 text-slate-500 dark:text-purple-500 font-semibold">
                    Prob.
                  </th>
                  <th className="text-right p-3 text-slate-500 dark:text-purple-500 font-semibold">
                    F(x)
                  </th>
                  <th className="text-right p-3 text-slate-500 dark:text-purple-500 font-semibold">
                    Intervalo
                  </th>
                </tr>
              </thead>
              <tbody>
                {cumDist.map((entry, i) => {
                  const prevCum = i === 0 ? 0 : cumDist[i - 1].cumProb;
                  return (
                    <tr
                      key={i}
                      className="border-b border-slate-50 dark:border-purple-900/20"
                    >
                      <td className="p-3 text-slate-700 dark:text-purple-300 font-medium">
                        {entry.value}
                      </td>
                      <td className="p-3 text-right text-slate-600 dark:text-purple-400">
                        {formatSmart(poissonRows[i].probability, decimals)}
                      </td>
                      <td className="p-3 text-right text-slate-900 dark:text-purple-100 font-medium">
                        {formatSmart(entry.cumProb, decimals)}
                      </td>
                      <td className="p-3 text-right text-slate-500 dark:text-purple-500 font-mono text-xs">
                        [{formatSmart(prevCum, 2)},{" "}
                        {formatSmart(entry.cumProb, 2)})
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Iterations Config + Simulate ── */}
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

      {/* ── Results ── */}
      {result && (
        <MonteCarloResults
          result={result}
          showRandomColumn
          theoretical={theoretical ?? undefined}
        />
      )}

      {multiResult && typeof poissonLambda === "number" && (
        <MonteCarloMatrixResults
          result={multiResult}
          theoreticalMean={poissonLambda}
          theoreticalLabel="λ"
        />
      )}
    </div>
  );
};
