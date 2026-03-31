import React, { useState } from "react";
import type {
  SimulationResult,
  TheoreticalStats,
} from "../utils/math/monteCarloSimulation";
import { useSettings } from "../context/SettingsContext";
import { formatSmart } from "../utils/formatSmart";

interface Props {
  result: SimulationResult;
  showRandomColumn?: boolean;
  theoretical?: TheoreticalStats;
}

function StatCard({
  label,
  symbol,
  value,
}: {
  label: string;
  symbol: string;
  value: string;
}) {
  return (
    <div
      className="p-4 rounded-2xl border bg-white dark:bg-[#140a20]
                    border-slate-100 dark:border-purple-900/50
                    shadow-sm dark:shadow-black/20"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-slate-500 dark:text-purple-500">
          {label}
        </h3>
        <span
          className="inline-flex items-center justify-center min-w-6 h-6 px-1
                     rounded-full text-xs font-bold
                     bg-slate-100 dark:bg-purple-900/60
                     text-slate-700 dark:text-purple-400"
        >
          {symbol}
        </span>
      </div>
      <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-purple-100">
        {value}
      </div>
    </div>
  );
}

const MAX_TABLE_ROWS = 100;

export const MonteCarloResults: React.FC<Props> = ({
  result,
  showRandomColumn = false,
  theoretical,
}) => {
  const { decimals } = useSettings();
  const [showTable, setShowTable] = useState(false);

  const maxBarCount = Math.max(...result.histogram.map((b) => b.count), 1);

  return (
    <div className="mt-6 space-y-4 animate-[fadeSlideUp_0.3s_ease_both]">
      {/* ── Stats Summary ── */}
      <h3 className="text-lg font-bold text-slate-900 dark:text-purple-50">
        Resultados
      </h3>

      {/* ── Theoretical vs Simulated comparison ── */}
      {theoretical && (
        <div
          className="bg-white dark:bg-[#140a20] rounded-2xl border
                        border-slate-100 dark:border-purple-900/50
                        shadow-sm dark:shadow-black/20 overflow-hidden"
        >
          <div className="p-4 border-b border-slate-100 dark:border-purple-900/40 bg-slate-50/50 dark:bg-[#0a040f]/60">
            <h4 className="text-sm font-semibold text-slate-700 dark:text-purple-500/90 uppercase tracking-wider">
              Teórico vs Simulado
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-purple-900/40">
                  <th className="text-left p-3 text-slate-500 dark:text-purple-500 font-semibold" />
                  <th className="text-right p-3 text-slate-500 dark:text-purple-500 font-semibold">
                    Teórico
                  </th>
                  <th className="text-right p-3 text-slate-500 dark:text-purple-500 font-semibold">
                    Simulado
                  </th>
                  <th className="text-right p-3 text-slate-500 dark:text-purple-500 font-semibold">
                    Diferencia
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-50 dark:border-purple-900/20">
                  <td className="p-3 text-slate-700 dark:text-purple-300 font-medium">
                    Media
                  </td>
                  <td className="p-3 text-right text-purple-700 dark:text-purple-300 font-semibold">
                    {formatSmart(theoretical.mean, decimals)}
                  </td>
                  <td className="p-3 text-right text-slate-900 dark:text-purple-100 font-semibold">
                    {formatSmart(result.mean, decimals)}
                  </td>
                  <td className="p-3 text-right text-slate-500 dark:text-purple-500 font-mono text-xs">
                    {formatSmart(Math.abs(result.mean - theoretical.mean), decimals)}
                  </td>
                </tr>
                <tr className="border-b border-slate-50 dark:border-purple-900/20">
                  <td className="p-3 text-slate-700 dark:text-purple-300 font-medium">
                    Desv. Est.
                  </td>
                  <td className="p-3 text-right text-purple-700 dark:text-purple-300 font-semibold">
                    {formatSmart(theoretical.stdDev, decimals)}
                  </td>
                  <td className="p-3 text-right text-slate-900 dark:text-purple-100 font-semibold">
                    {formatSmart(result.stdDev, decimals)}
                  </td>
                  <td className="p-3 text-right text-slate-500 dark:text-purple-500 font-mono text-xs">
                    {formatSmart(Math.abs(result.stdDev - theoretical.stdDev), decimals)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Media Muestral"
          symbol="x̄"
          value={formatSmart(result.mean, decimals)}
        />
        <StatCard
          label="Desviación Estándar"
          symbol="σ"
          value={formatSmart(result.stdDev, decimals)}
        />
        <StatCard
          label="Error Estándar"
          symbol="SE"
          value={formatSmart(result.standardError, decimals)}
        />
        <StatCard
          label="Iteraciones"
          symbol="N"
          value={result.iterations.length.toLocaleString()}
        />
        <StatCard
          label="Valor Mínimo"
          symbol="min"
          value={formatSmart(result.min, decimals)}
        />
        <StatCard
          label="Valor Máximo"
          symbol="max"
          value={formatSmart(result.max, decimals)}
        />
      </div>

      {/* ── Confidence Interval ── */}
      <div
        className="p-4 bg-purple-50/50 dark:bg-purple-900/20 rounded-2xl
                      border border-purple-100 dark:border-purple-700/50
                      dark:shadow-md dark:shadow-purple-900/40"
      >
        <h4 className="text-sm font-medium text-purple-800 dark:text-purple-400 mb-1">
          Intervalo de Confianza (95%)
        </h4>
        <div className="text-lg font-bold text-purple-900 dark:text-purple-300">
          [{formatSmart(result.confidenceInterval95[0], decimals)},{" "}
          {formatSmart(result.confidenceInterval95[1], decimals)}]
        </div>
      </div>

      {/* ── Histogram ── */}
      <div
        className="bg-white dark:bg-[#140a20] rounded-2xl border
                      border-slate-100 dark:border-purple-900/50
                      shadow-sm dark:shadow-black/20 p-4"
      >
        <h4 className="text-sm font-semibold text-slate-700 dark:text-purple-500/90 uppercase tracking-wider mb-4">
          Histograma de Frecuencias
        </h4>
        <div className="flex items-end gap-[3px] h-44">
          {result.histogram.map((bin, i) => {
            const heightPct =
              maxBarCount > 0 ? (bin.count / maxBarCount) * 100 : 0;
            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1 min-w-0"
              >
                <span className="text-[0.55rem] text-slate-500 dark:text-purple-500 font-medium whitespace-nowrap">
                  {(bin.frequency * 100).toFixed(1)}%
                </span>
                <div
                  className="w-full bg-purple-500 dark:bg-purple-400 rounded-t-sm transition-all duration-500"
                  style={{ height: `${Math.max(heightPct, 1)}%` }}
                />
                <span className="text-[0.5rem] text-slate-400 dark:text-purple-700 truncate w-full text-center leading-tight">
                  {bin.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Convergence Table ── */}
      <div
        className="bg-white dark:bg-[#140a20] rounded-2xl border
                      border-slate-100 dark:border-purple-900/50
                      shadow-sm dark:shadow-black/20 overflow-hidden"
      >
        <div className="p-4 border-b border-slate-100 dark:border-purple-900/40 bg-slate-50/50 dark:bg-[#0a040f]/60">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-purple-500/90 uppercase tracking-wider">
            Convergencia
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-purple-900/40">
                <th className="text-left p-3 text-slate-500 dark:text-purple-500 font-semibold">
                  N
                </th>
                <th className="text-right p-3 text-slate-500 dark:text-purple-500 font-semibold">
                  Media
                </th>
                <th className="text-right p-3 text-slate-500 dark:text-purple-500 font-semibold">
                  Desvío
                </th>
                <th className="text-right p-3 text-slate-500 dark:text-purple-500 font-semibold">
                  Error
                </th>
              </tr>
            </thead>
            <tbody>
              {result.convergence.map((p) => (
                <tr
                  key={p.n}
                  className="border-b border-slate-50 dark:border-purple-900/20"
                >
                  <td className="p-3 text-slate-700 dark:text-purple-300 font-medium">
                    {p.n.toLocaleString()}
                  </td>
                  <td className="p-3 text-right text-slate-900 dark:text-purple-100">
                    {formatSmart(p.mean, decimals)}
                  </td>
                  <td className="p-3 text-right text-slate-600 dark:text-purple-400">
                    {formatSmart(p.stdDev, decimals)}
                  </td>
                  <td className="p-3 text-right text-slate-600 dark:text-purple-400">
                    {formatSmart(p.error, decimals)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Iterations Table (collapsible) ── */}
      <div
        className="bg-white dark:bg-[#140a20] rounded-2xl border
                      border-slate-100 dark:border-purple-900/50
                      shadow-sm dark:shadow-black/20 overflow-hidden"
      >
        <button
          onClick={() => setShowTable(!showTable)}
          className="w-full p-4 flex items-center justify-between
                     bg-slate-50/50 dark:bg-[#0a040f]/60
                     border-b border-slate-100 dark:border-purple-900/40"
        >
          <h4 className="text-sm font-semibold text-slate-700 dark:text-purple-500/90 uppercase tracking-wider">
            Tabla de Iteraciones
          </h4>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`w-5 h-5 text-slate-400 dark:text-purple-700 transition-transform duration-200 ${showTable ? "rotate-180" : ""}`}
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {showTable && (
          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white dark:bg-[#140a20]">
                <tr className="border-b border-slate-100 dark:border-purple-900/40">
                  <th className="text-left p-3 text-slate-500 dark:text-purple-500 font-semibold">
                    #
                  </th>
                  {showRandomColumn && (
                    <th className="text-right p-3 text-slate-500 dark:text-purple-500 font-semibold">
                      Aleatorio
                    </th>
                  )}
                  <th className="text-right p-3 text-slate-500 dark:text-purple-500 font-semibold">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.iterations.slice(0, MAX_TABLE_ROWS).map((it) => (
                  <tr
                    key={it.index}
                    className="border-b border-slate-50 dark:border-purple-900/20"
                  >
                    <td className="p-3 text-slate-500 dark:text-purple-500">
                      {it.index}
                    </td>
                    {showRandomColumn && (
                      <td className="p-3 text-right text-slate-600 dark:text-purple-400 font-mono text-xs">
                        {it.random.toFixed(6)}
                      </td>
                    )}
                    <td className="p-3 text-right text-slate-900 dark:text-purple-100 font-medium">
                      {formatSmart(it.value, decimals)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {result.iterations.length > MAX_TABLE_ROWS && (
              <div className="p-3 text-center text-xs text-slate-400 dark:text-purple-700">
                Mostrando {MAX_TABLE_ROWS} de{" "}
                {result.iterations.length.toLocaleString()} iteraciones
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
