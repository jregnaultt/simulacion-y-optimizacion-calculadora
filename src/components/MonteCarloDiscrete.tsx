import React, { useState, useMemo } from "react";
import {
  runDiscreteSimulation,
  buildCumulativeDistribution,
  getTheoreticalStatsDiscrete,
  generatePoissonDistribution,
  getTheoreticalStatsPoisson,
  runMultivariableDiscreteSimulation,
  type DiscreteRow,
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

type DiscreteMode = "manual" | "poisson";

interface RowInput {
  value: string;
  probability: string;
}

export const MonteCarloDiscrete: React.FC = () => {
  const { decimals } = useSettings();
  const [mode, setMode] = useState<DiscreteMode>("manual");

  // ── Manual state ──
  const [rows, setRows] = useState<RowInput[]>([
    { value: "", probability: "" },
    { value: "", probability: "" },
    { value: "", probability: "" },
  ]);

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

  // ── Manual helpers ──
  const updateRow = (i: number, field: keyof RowInput, val: string) =>
    setRows((prev) =>
      prev.map((r, j) => (j === i ? { ...r, [field]: val } : r)),
    );

  const addRow = () =>
    setRows((prev) => [...prev, { value: "", probability: "" }]);

  const removeRow = (i: number) => {
    if (rows.length <= 2) return;
    setRows((prev) => prev.filter((_, j) => j !== i));
  };

  const parsedManualRows: (DiscreteRow | null)[] = rows.map((r) => {
    const v = parseFloat(r.value);
    const p = parseFloat(r.probability);
    if (isNaN(v) || isNaN(p) || p < 0) return null;
    return { value: v, probability: p };
  });

  const manualValidRows = parsedManualRows.filter(
    (r): r is DiscreteRow => r !== null,
  );
  const probSum = manualValidRows.reduce((s, r) => s + r.probability, 0);
  const isValidSum = Math.abs(probSum - 1) < 0.01;
  const allManualFilled =
    parsedManualRows.every((r) => r !== null) && rows.length >= 2;

  // ── Poisson helpers ──
  const poissonRows = useMemo(
    () =>
      typeof poissonLambda === "number" && poissonLambda > 0
        ? generatePoissonDistribution(poissonLambda)
        : [],
    [poissonLambda],
  );

  // ── Resolved rows for simulation ──
  const activeRows: DiscreteRow[] =
    mode === "poisson" ? poissonRows : manualValidRows;

  const activeValid =
    mode === "poisson"
      ? typeof poissonLambda === "number" && poissonLambda > 0
      : allManualFilled && isValidSum;

  const canSimulate =
    activeValid &&
    activeRows.length >= 1 &&
    typeof numIterations === "number" &&
    numIterations > 0;

  const cumDist = useMemo(
    () =>
      activeRows.length > 0 &&
      (mode === "poisson" || (mode === "manual" && isValidSum))
        ? buildCumulativeDistribution(activeRows)
        : null,
    [activeRows, mode, isValidSum],
  );

  const effectiveK =
    mode === "poisson" && typeof numVariables === "number" && numVariables > 1
      ? numVariables
      : 1;

  const handleSimulate = () => {
    if (!canSimulate) return;

    if (mode === "poisson" && typeof poissonLambda === "number") {
      setTheoretical(getTheoreticalStatsPoisson(poissonLambda));

      // Multivariable path (k > 1)
      if (effectiveK > 1) {
        setResult(null);
        setMultiResult(
          runMultivariableDiscreteSimulation(
            activeRows,
            numIterations as number,
            effectiveK,
          ),
        );
        return;
      }
    } else {
      setTheoretical(getTheoreticalStatsDiscrete(activeRows));
    }

    setMultiResult(null);
    setResult(runDiscreteSimulation(activeRows, numIterations as number));
  };

  const handleModeChange = (m: DiscreteMode) => {
    setMode(m);
    setResult(null);
    setMultiResult(null);
    setTheoretical(null);
  };

  return (
    <div className="flex flex-col h-full animate-[fadeSlideUp_0.3s_ease_both]">
      <p className="text-slate-500 dark:text-purple-400 text-sm leading-relaxed mb-4">
        Defina una distribución de probabilidad discreta. Se usará el{" "}
        <span className="font-semibold text-slate-700 dark:text-purple-300">
          método de Transformación Inversa
        </span>{" "}
        para generar los valores simulados.
      </p>

      {/* ── Mode Toggle ── */}
      <div className="bg-slate-200/60 dark:bg-purple-950/30 p-1 rounded-xl flex items-center border border-transparent dark:border-purple-900/20 mb-4">
        <button
          onClick={() => handleModeChange("manual")}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200
            ${
              mode === "manual"
                ? "bg-white dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 shadow-sm"
                : "text-slate-500 dark:text-purple-400/70 hover:text-slate-700 dark:hover:text-purple-300"
            }`}
        >
          Personalizada
        </button>
        <button
          onClick={() => handleModeChange("poisson")}
          className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200
            ${
              mode === "poisson"
                ? "bg-white dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 shadow-sm"
                : "text-slate-500 dark:text-purple-400/70 hover:text-slate-700 dark:hover:text-purple-300"
            }`}
        >
          Poisson
        </button>
      </div>

      {/* ── Manual Input Table ── */}
      {mode === "manual" && (
        <div className="bg-white dark:bg-[#12091c] rounded-2xl border border-slate-200 dark:border-purple-900/60 shadow-sm dark:shadow-black/40 overflow-hidden mb-4">
          <div className="p-4 border-b border-slate-100 dark:border-purple-900/40 bg-slate-50/50 dark:bg-[#0a040f]/60">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-purple-500/90 uppercase tracking-wider">
              Distribución de Probabilidad
            </h2>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-[1fr_1fr_auto] gap-2 text-xs font-semibold text-slate-500 dark:text-purple-500 uppercase tracking-wider">
              <span>Valor</span>
              <span>Probabilidad</span>
              <span className="w-8" />
            </div>

            {rows.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center"
              >
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  className={INPUT_CLS}
                  placeholder="Ej. 42"
                  value={row.value}
                  onChange={(e) => updateRow(i, "value", e.target.value)}
                />
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="1"
                  step="any"
                  className={INPUT_CLS}
                  placeholder="Ej. 0.3"
                  value={row.probability}
                  onChange={(e) => updateRow(i, "probability", e.target.value)}
                />
                <button
                  onClick={() => removeRow(i)}
                  disabled={rows.length <= 2}
                  className="w-8 h-8 flex items-center justify-center rounded-lg
                             text-slate-400 dark:text-purple-700
                             hover:text-red-500 dark:hover:text-red-400
                             hover:bg-red-50 dark:hover:bg-red-950/30
                             disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                  </svg>
                </button>
              </div>
            ))}

            <button
              onClick={addRow}
              className="w-full py-2 rounded-xl border-2 border-dashed
                         border-slate-200 dark:border-purple-800/50
                         text-slate-400 dark:text-purple-600
                         hover:border-purple-400 dark:hover:border-purple-600
                         hover:text-purple-500 dark:hover:text-purple-400
                         transition-colors text-sm font-medium"
            >
              + Agregar fila
            </button>

            <div
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium
                ${
                  isValidSum
                    ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/50"
                    : probSum > 0
                      ? "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50"
                      : "bg-slate-50 dark:bg-purple-950/20 text-slate-500 dark:text-purple-500 border border-slate-200 dark:border-purple-900/50"
                }`}
            >
              <span>Suma de probabilidades:</span>
              <span className="font-bold">
                {manualValidRows.length > 0
                  ? formatSmart(probSum, decimals)
                  : "—"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Poisson Input ── */}
      {mode === "poisson" && (
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
      )}

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
                        {formatSmart(activeRows[i].probability, decimals)}
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
