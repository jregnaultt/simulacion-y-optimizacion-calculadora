import React, { useState, useMemo } from "react";
import type { MultiVariableResult } from "../utils/math/monteCarloSimulation";
import { useSettings } from "../context/SettingsContext";
import { formatSmart } from "../utils/formatSmart";

interface Props {
  result: MultiVariableResult;
  /** Theoretical mean to compare against (λ for Poisson, μ for Exponential, etc.) */
  theoreticalMean: number;
  /** Symbol to display for the theoretical parameter (default: "λ") */
  theoreticalLabel?: string;
  /** When true, format cell values to 4 decimal places (continuous distributions) */
  continuous?: boolean;
  /** Override formula line shown in the header (optional) */
  generatorFormula?: string;
}

// ── Histogram helpers ──────────────────────────────────

interface HistogramBin {
  label: string;
  count: number;
  frequency: number;
}

/** Extract column j from the matrix */
const extractColumn = (matrix: number[][], j: number): number[] =>
  matrix.map((row) => row[j]);

/**
 * Discrete histogram: count exact integer frequencies.
 * Returns bins sorted by value.
 */
const buildDiscreteHistogram = (column: number[]): HistogramBin[] => {
  const countMap = new Map<number, number>();
  for (const v of column) countMap.set(v, (countMap.get(v) || 0) + 1);

  const sorted = [...countMap.entries()].sort((a, b) => a[0] - b[0]);
  return sorted.map(([value, count]) => ({
    label: String(value),
    count,
    frequency: count / column.length,
  }));
};

/**
 * Continuous histogram: group decimals into equal-width bins.
 * Number of bins uses Sturges' rule: c = 1 + 3.322 · log₁₀(n)
 */
const buildContinuousHistogram = (column: number[]): HistogramBin[] => {
  const n = column.length;
  if (n === 0) return [];

  const numBins = Math.max(3, Math.ceil(1 + 3.322 * Math.log10(n)));
  const min = Math.min(...column);
  const max = Math.max(...column);
  const range = max - min || 1;
  const binWidth = range / numBins;

  const counts = new Array<number>(numBins).fill(0);
  for (const v of column) {
    let idx = Math.floor((v - min) / binWidth);
    if (idx >= numBins) idx = numBins - 1;
    if (idx < 0) idx = 0;
    counts[idx]++;
  }

  return counts.map((count, i) => {
    const lo = min + i * binWidth;
    const hi = lo + binWidth;
    return {
      label: `${lo.toFixed(2)} – ${hi.toFixed(2)}`,
      count,
      frequency: count / n,
    };
  });
};

// ── Component ──────────────────────────────────────────

const MAX_VISIBLE_ROWS = 20;

export const MonteCarloMatrixResults: React.FC<Props> = ({
  result,
  theoreticalMean,
  theoreticalLabel = "λ",
  continuous = false,
  generatorFormula,
}) => {
  const { decimals } = useSettings();
  const [expanded, setExpanded] = useState(false);
  const [selectedVarIndex, setSelectedVarIndex] = useState(0);

  const visibleRows = expanded
    ? result.matrix
    : result.matrix.slice(0, MAX_VISIBLE_ROWS);

  /** Format a cell value: 4 fixed decimals for continuous, raw integer for discrete */
  const fmtCell = (val: number) =>
    continuous ? val.toFixed(4) : String(val);

  // ── Histogram data (memoized) ──
  const histogramData = useMemo(() => {
    const column = extractColumn(result.matrix, selectedVarIndex);
    return continuous
      ? buildContinuousHistogram(column)
      : buildDiscreteHistogram(column);
  }, [result.matrix, selectedVarIndex, continuous]);

  const maxBarCount = Math.max(...histogramData.map((b) => b.count), 1);

  return (
    <div className="mt-6 space-y-4 animate-[fadeSlideUp_0.3s_ease_both]">
      {/* ── Title ── */}
      <h3 className="text-lg font-bold text-slate-900 dark:text-purple-50">
        Resultados Multivariable
      </h3>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-3 gap-3">
        <div
          className="p-4 rounded-2xl border bg-white dark:bg-[#140a20]
                     border-slate-100 dark:border-purple-900/50
                     shadow-sm dark:shadow-black/20"
        >
          <h4 className="text-sm font-medium text-slate-500 dark:text-purple-500 mb-1">
            Variables
          </h4>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-purple-100">
            {result.k}
          </div>
        </div>
        <div
          className="p-4 rounded-2xl border bg-white dark:bg-[#140a20]
                     border-slate-100 dark:border-purple-900/50
                     shadow-sm dark:shadow-black/20"
        >
          <h4 className="text-sm font-medium text-slate-500 dark:text-purple-500 mb-1">
            Iteraciones
          </h4>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-purple-100">
            {result.n.toLocaleString()}
          </div>
        </div>
        <div
          className="p-4 rounded-2xl border bg-white dark:bg-[#140a20]
                     border-slate-100 dark:border-purple-900/50
                     shadow-sm dark:shadow-black/20"
        >
          <h4 className="text-sm font-medium text-slate-500 dark:text-purple-500 mb-1">
            {theoreticalLabel} Teórico
          </h4>
          <div className="text-2xl font-bold tracking-tight text-purple-700 dark:text-purple-300">
            {formatSmart(theoreticalMean, decimals)}
          </div>
        </div>
      </div>

      {/* ── Formula Reference ── */}
      <div className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200 dark:border-purple-900/50">
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
          {generatorFormula && (
            <span>
              <span className="text-slate-500 dark:text-purple-500 font-medium">
                Generador:{" "}
              </span>
              <span className="font-mono text-purple-700 dark:text-purple-300 font-semibold">
                {generatorFormula}
              </span>
            </span>
          )}
          <span>
            <span className="text-slate-500 dark:text-purple-500 font-medium">
              Media Muestral:{" "}
            </span>
            <span className="font-mono text-purple-700 dark:text-purple-300 font-semibold">
              x̄ = (1/n) Σxᵢ
            </span>
          </span>
          <span>
            <span className="text-slate-500 dark:text-purple-500 font-medium">
              Desv. Est. Muestral:{" "}
            </span>
            <span className="font-mono text-purple-700 dark:text-purple-300 font-semibold">
              s = √[Σ(xᵢ−x̄)²/(n−1)]
            </span>
          </span>
        </div>
      </div>

      {/* ── Matrix Table ── */}
      <div
        className="bg-white dark:bg-[#140a20] rounded-2xl border
                   border-slate-100 dark:border-purple-900/50
                   shadow-sm dark:shadow-black/20 overflow-hidden"
      >
        <div className="p-4 border-b border-slate-100 dark:border-purple-900/40 bg-slate-50/50 dark:bg-[#0a040f]/60">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-purple-500/90 uppercase tracking-wider">
            Matriz de Simulación ({result.n}×{result.k})
          </h4>
        </div>

        <div className="overflow-x-auto max-h-[28rem] overflow-y-auto">
          <table className="w-full text-sm">
            {/* ── Column Headers ── */}
            <thead className="sticky top-0 z-20">
              <tr className="bg-white dark:bg-[#140a20] border-b border-slate-100 dark:border-purple-900/40">
                <th className="text-left p-3 text-slate-500 dark:text-purple-500 font-semibold min-w-[3rem] sticky left-0 bg-white dark:bg-[#140a20] z-10">
                  #
                </th>
                {Array.from({ length: result.k }, (_, j) => (
                  <th
                    key={j}
                    className="text-right p-3 text-purple-700 dark:text-purple-300 font-bold min-w-[5rem]"
                  >
                    v<sub>{j + 1}</sub>
                  </th>
                ))}
              </tr>

              {/* ── Stats Row: Mean ── */}
              <tr className="bg-purple-50/70 dark:bg-purple-900/30 border-b border-purple-100 dark:border-purple-800/50">
                <td className="p-3 text-purple-700 dark:text-purple-300 font-bold text-xs uppercase tracking-wider sticky left-0 bg-purple-50/70 dark:bg-purple-900/30 z-10">
                  x̄
                </td>
                {result.columnStats.map((col, j) => (
                  <td
                    key={j}
                    className="p-3 text-right text-purple-900 dark:text-purple-100 font-bold tabular-nums"
                  >
                    {continuous ? col.mean.toFixed(4) : formatSmart(col.mean, decimals)}
                  </td>
                ))}
              </tr>

              {/* ── Stats Row: Std Dev ── */}
              <tr className="bg-purple-50/40 dark:bg-purple-900/20 border-b border-purple-100 dark:border-purple-800/40">
                <td className="p-3 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-wider sticky left-0 bg-purple-50/40 dark:bg-purple-900/20 z-10">
                  s
                </td>
                {result.columnStats.map((col, j) => (
                  <td
                    key={j}
                    className="p-3 text-right text-purple-800 dark:text-purple-200 font-semibold tabular-nums"
                  >
                    {continuous ? col.stdDev.toFixed(4) : formatSmart(col.stdDev, decimals)}
                  </td>
                ))}
              </tr>
            </thead>

            {/* ── Iteration Rows ── */}
            <tbody>
              {visibleRows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-50 dark:border-purple-900/20 hover:bg-slate-50/50 dark:hover:bg-purple-950/20 transition-colors"
                >
                  <td className="p-3 text-slate-400 dark:text-purple-600 font-medium tabular-nums sticky left-0 bg-white dark:bg-[#140a20] z-10">
                    {i + 1}
                  </td>
                  {row.map((val, j) => (
                    <td
                      key={j}
                      className="p-3 text-right text-slate-800 dark:text-purple-100 tabular-nums"
                    >
                      {fmtCell(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Show more / less toggle ── */}
        {result.n > MAX_VISIBLE_ROWS && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full py-3 text-center text-sm font-semibold
                       text-purple-600 dark:text-purple-400
                       hover:bg-purple-50 dark:hover:bg-purple-950/30
                       border-t border-slate-100 dark:border-purple-900/40
                       transition-colors"
          >
            {expanded
              ? "Mostrar menos"
              : `Ver las ${result.n.toLocaleString()} iteraciones`}
          </button>
        )}
      </div>

      {/* ════════════════════════════════════════════════════ */}
      {/* ── Histogram with Variable Selector ────────────── */}
      {/* ════════════════════════════════════════════════════ */}
      <div
        className="bg-white dark:bg-[#140a20] rounded-2xl border
                   border-slate-100 dark:border-purple-900/50
                   shadow-sm dark:shadow-black/20 overflow-hidden"
      >
        <div className="p-4 border-b border-slate-100 dark:border-purple-900/40 bg-slate-50/50 dark:bg-[#0a040f]/60">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-purple-500/90 uppercase tracking-wider">
            Histograma de Frecuencias
          </h4>
        </div>

        <div className="p-4 space-y-4">
          {/* ── Variable Selector (tab-style) ── */}
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: result.k }, (_, j) => (
              <button
                key={j}
                onClick={() => setSelectedVarIndex(j)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200
                  ${
                    selectedVarIndex === j
                      ? "bg-purple-600 text-white shadow-sm shadow-purple-500/30"
                      : "bg-slate-100 dark:bg-purple-950/40 text-slate-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40"
                  }`}
              >
                Variable v<sub>{j + 1}</sub>
              </button>
            ))}
          </div>

          {/* ── Selected variable stats summary ── */}
          <div className="flex flex-wrap gap-3">
            <div className="px-3 py-2 rounded-xl bg-purple-50/50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-700/50">
              <span className="text-[0.65rem] text-purple-600 dark:text-purple-500 font-medium block">
                x̄
              </span>
              <span className="text-sm font-bold text-purple-900 dark:text-purple-300 tabular-nums">
                {continuous
                  ? result.columnStats[selectedVarIndex].mean.toFixed(4)
                  : formatSmart(result.columnStats[selectedVarIndex].mean, decimals)}
              </span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-purple-50/50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-700/50">
              <span className="text-[0.65rem] text-purple-600 dark:text-purple-500 font-medium block">
                s
              </span>
              <span className="text-sm font-bold text-purple-900 dark:text-purple-300 tabular-nums">
                {continuous
                  ? result.columnStats[selectedVarIndex].stdDev.toFixed(4)
                  : formatSmart(result.columnStats[selectedVarIndex].stdDev, decimals)}
              </span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-purple-50/50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-700/50">
              <span className="text-[0.65rem] text-purple-600 dark:text-purple-500 font-medium block">
                n
              </span>
              <span className="text-sm font-bold text-purple-900 dark:text-purple-300 tabular-nums">
                {result.n.toLocaleString()}
              </span>
            </div>
            {continuous && (
              <div className="px-3 py-2 rounded-xl bg-purple-50/50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-700/50">
                <span className="text-[0.65rem] text-purple-600 dark:text-purple-500 font-medium block">
                  Bins (Sturges)
                </span>
                <span className="text-sm font-bold text-purple-900 dark:text-purple-300 tabular-nums">
                  {histogramData.length}
                </span>
              </div>
            )}
          </div>

          {/* ── Bar Chart ── */}
          <div className="flex items-end gap-[3px] h-48">
            {histogramData.map((bin, i) => {
              const heightPct =
                maxBarCount > 0 ? (bin.count / maxBarCount) * 100 : 0;
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col justify-end items-center gap-1 min-w-0 group h-full"
                >
                  {/* Frequency % label */}
                  <span className="text-[0.55rem] text-slate-500 dark:text-purple-500 font-medium whitespace-nowrap opacity-70 group-hover:opacity-100 transition-opacity">
                    {(bin.frequency * 100).toFixed(1)}%
                  </span>
                  {/* Bar */}
                  <div
                    className="w-full bg-purple-500 dark:bg-purple-400 rounded-t-sm transition-all duration-500
                               group-hover:bg-purple-600 dark:group-hover:bg-purple-300"
                    style={{ height: `${Math.max(heightPct, 1)}%` }}
                  />
                  {/* X-axis label */}
                  <span
                    className="text-[0.45rem] text-slate-400 dark:text-purple-700 truncate w-full text-center leading-tight"
                    title={bin.label}
                  >
                    {bin.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ── Frequency detail table (collapsible) ── */}
          <details className="group">
            <summary className="cursor-pointer text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
              <span className="ml-1">Ver tabla de frecuencias</span>
            </summary>
            <div className="mt-3 overflow-x-auto max-h-64 overflow-y-auto rounded-xl border border-slate-100 dark:border-purple-900/40">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white dark:bg-[#140a20]">
                  <tr className="border-b border-slate-100 dark:border-purple-900/40">
                    <th className="text-left p-3 text-slate-500 dark:text-purple-500 font-semibold">
                      {continuous ? "Intervalo" : "Valor"}
                    </th>
                    <th className="text-right p-3 text-slate-500 dark:text-purple-500 font-semibold">
                      Frecuencia
                    </th>
                    <th className="text-right p-3 text-slate-500 dark:text-purple-500 font-semibold">
                      Fr. Relativa
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {histogramData.map((bin, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-50 dark:border-purple-900/20"
                    >
                      <td className="p-3 text-slate-700 dark:text-purple-300 font-medium">
                        {bin.label}
                      </td>
                      <td className="p-3 text-right text-slate-900 dark:text-purple-100 font-semibold tabular-nums">
                        {bin.count}
                      </td>
                      <td className="p-3 text-right text-slate-500 dark:text-purple-400 tabular-nums">
                        {(bin.frequency * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      </div>

      {/* ── Per-Column Detail Cards ── */}
      <div
        className="bg-white dark:bg-[#140a20] rounded-2xl border
                   border-slate-100 dark:border-purple-900/50
                   shadow-sm dark:shadow-black/20 overflow-hidden"
      >
        <div className="p-4 border-b border-slate-100 dark:border-purple-900/40 bg-slate-50/50 dark:bg-[#0a040f]/60">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-purple-500/90 uppercase tracking-wider">
            Estadísticas por Variable
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-purple-900/40">
                <th className="text-left p-3 text-slate-500 dark:text-purple-500 font-semibold">
                  Variable
                </th>
                <th className="text-right p-3 text-slate-500 dark:text-purple-500 font-semibold">
                  Media (x̄)
                </th>
                <th className="text-right p-3 text-slate-500 dark:text-purple-500 font-semibold">
                  Desv. Est. (s)
                </th>
                <th className="text-right p-3 text-slate-500 dark:text-purple-500 font-semibold">
                  |x̄ − {theoreticalLabel}|
                </th>
              </tr>
            </thead>
            <tbody>
              {result.columnStats.map((col, j) => (
                <tr
                  key={j}
                  className="border-b border-slate-50 dark:border-purple-900/20"
                >
                  <td className="p-3 text-purple-700 dark:text-purple-300 font-bold">
                    v<sub>{j + 1}</sub>
                  </td>
                  <td className="p-3 text-right text-slate-900 dark:text-purple-100 font-semibold tabular-nums">
                    {continuous ? col.mean.toFixed(4) : formatSmart(col.mean, decimals)}
                  </td>
                  <td className="p-3 text-right text-slate-700 dark:text-purple-300 tabular-nums">
                    {continuous ? col.stdDev.toFixed(4) : formatSmart(col.stdDev, decimals)}
                  </td>
                  <td className="p-3 text-right text-slate-500 dark:text-purple-500 font-mono text-xs tabular-nums">
                    {continuous
                      ? Math.abs(col.mean - theoreticalMean).toFixed(4)
                      : formatSmart(Math.abs(col.mean - theoreticalMean), decimals)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
