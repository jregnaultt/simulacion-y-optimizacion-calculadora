import React, { useState } from "react";
import {
  runContinuousSimulation,
  getTheoreticalStatsContinuous,
  type ContinuousDistType,
  type SimulationResult,
  type TheoreticalStats,
} from "../utils/math/monteCarloSimulation";
import { MonteCarloResults } from "./MonteCarloResults";

const INPUT_CLS = `block w-full rounded-xl border border-slate-300 dark:border-purple-800
  bg-slate-50 dark:bg-[#0e0715] text-slate-900 dark:text-purple-100
  placeholder:text-slate-400 dark:placeholder:text-purple-400/50 placeholder:font-medium
  focus:border-purple-500 dark:focus:border-purple-500/80
  focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-500/15
  dark:focus:bg-[#140a20] outline-none text-sm p-2 transition-all`;

interface DistConfig {
  value: ContinuousDistType;
  label: string;
  formula: string;
  params: { key: string; label: string; placeholder: string }[];
  validate: (p: Record<string, number>) => boolean;
}

const DISTRIBUTIONS: DistConfig[] = [
  {
    value: "normal",
    label: "Normal",
    formula: "X = μ + σ · Z",
    params: [
      { key: "media", label: "Media (μ)", placeholder: "Ej. 0" },
      { key: "desvEst", label: "Desv. Estándar (σ)", placeholder: "Ej. 1" },
    ],
    validate: (p) => p.desvEst > 0,
  },
  {
    value: "exponential",
    label: "Exponencial",
    formula: "X = −ln(U) · b",
    params: [{ key: "media", label: "Media (b)", placeholder: "Ej. 5" }],
    validate: (p) => p.media > 0,
  },
  {
    value: "uniform",
    label: "Uniforme",
    formula: "X = a + (b − a) · U",
    params: [
      { key: "a", label: "Límite Inferior (a)", placeholder: "Ej. 0" },
      { key: "b", label: "Límite Superior (b)", placeholder: "Ej. 10" },
    ],
    validate: (p) => p.a < p.b,
  },
  {
    value: "lognormal",
    label: "Lognormal",
    formula: "X = e^(μ + σ · Z)",
    params: [
      { key: "media", label: "Media de ln(X) (μ)", placeholder: "Ej. 0" },
      {
        key: "desvEst",
        label: "Desv. Est. de ln(X) (σ)",
        placeholder: "Ej. 1",
      },
    ],
    validate: (p) => p.desvEst > 0,
  },
  {
    value: "weibull",
    label: "Weibull",
    formula: "X = b · (−ln(U))^(1/a)",
    params: [
      { key: "escala", label: "Escala (b)", placeholder: "Ej. 1" },
      { key: "forma", label: "Forma (a)", placeholder: "Ej. 1.5" },
    ],
    validate: (p) => p.escala > 0 && p.forma > 0,
  },
];

const PRESET_N = [100, 1000, 5000, 10000];

export const MonteCarloContinuous: React.FC = () => {
  const [distType, setDistType] = useState<ContinuousDistType>("normal");
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [numIterations, setNumIterations] = useState<number | "">(1000);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [theoretical, setTheoretical] = useState<TheoreticalStats | null>(null);

  const currentDist = DISTRIBUTIONS.find((d) => d.value === distType)!;

  // Parse & validate params
  const parsedParams: Record<string, number> = {};
  let allValid = true;
  for (const p of currentDist.params) {
    const v = parseFloat(paramValues[p.key] ?? "");
    if (isNaN(v)) {
      allValid = false;
      break;
    }
    parsedParams[p.key] = v;
  }
  if (allValid && !currentDist.validate(parsedParams)) allValid = false;

  const canSimulate =
    allValid && typeof numIterations === "number" && numIterations > 0;

  const handleDistChange = (type: ContinuousDistType) => {
    setDistType(type);
    setParamValues({});
    setResult(null);
  };

  const handleSimulate = () => {
    if (!canSimulate) return;
    setTheoretical(getTheoreticalStatsContinuous(distType, parsedParams));
    setResult(
      runContinuousSimulation(distType, parsedParams, numIterations as number),
    );
  };

  return (
    <div className="flex flex-col h-full animate-[fadeSlideUp_0.3s_ease_both]">
      <p className="text-slate-500 dark:text-purple-400 text-sm leading-relaxed mb-4">
        Seleccione una distribución continua y configure sus parámetros para
        generar valores aleatorios mediante{" "}
        <span className="font-semibold text-slate-700 dark:text-purple-300">
          simulación Monte Carlo
        </span>
        .
      </p>

      {/* ── Distribution Selector ── */}
      <div className="bg-white dark:bg-[#12091c] rounded-2xl border border-slate-200 dark:border-purple-900/60 shadow-sm dark:shadow-black/40 overflow-hidden mb-4">
        <div className="p-4 border-b border-slate-100 dark:border-purple-900/40 bg-slate-50/50 dark:bg-[#0a040f]/60">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-purple-500/90 uppercase tracking-wider">
            Tipo de Distribución
          </h2>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {DISTRIBUTIONS.map((d) => (
              <button
                key={d.value}
                onClick={() => handleDistChange(d.value)}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all
                  ${
                    distType === d.value
                      ? "bg-purple-600 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-purple-950/40 text-slate-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40"
                  }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Formula hint */}
          <div className="mt-3 px-3 py-2 rounded-xl bg-slate-50 dark:bg-purple-950/20 border border-slate-200 dark:border-purple-900/50">
            <span className="text-xs text-slate-500 dark:text-purple-500 font-medium">
              Fórmula:{" "}
            </span>
            <span className="text-sm font-mono text-purple-700 dark:text-purple-300 font-semibold">
              {currentDist.formula}
            </span>
          </div>
        </div>
      </div>

      {/* ── Parameters ── */}
      <div className="bg-white dark:bg-[#12091c] rounded-2xl border border-slate-200 dark:border-purple-900/60 shadow-sm dark:shadow-black/40 overflow-hidden mb-4">
        <div className="p-4 border-b border-slate-100 dark:border-purple-900/40 bg-slate-50/50 dark:bg-[#0a040f]/60">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-purple-500/90 uppercase tracking-wider">
            Parámetros
          </h2>
        </div>
        <div className="p-4 space-y-4">
          <div
            className={`grid gap-3 ${currentDist.params.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
          >
            {currentDist.params.map((p) => (
              <div key={p.key}>
                <label className="block text-sm font-medium text-slate-700 dark:text-purple-400 mb-1">
                  {p.label}
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  className={INPUT_CLS}
                  placeholder={p.placeholder}
                  value={paramValues[p.key] ?? ""}
                  onChange={(e) =>
                    setParamValues((prev) => ({
                      ...prev,
                      [p.key]: e.target.value,
                    }))
                  }
                />
              </div>
            ))}
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

      {/* ── Results ── */}
      {result && (
        <MonteCarloResults
          result={result}
          theoretical={theoretical ?? undefined}
        />
      )}
    </div>
  );
};
