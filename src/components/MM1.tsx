import React, { useState } from "react";
import {
  calcRho,
  calcP0,
  calcL,
  calcLq,
  calcW,
  calcWq,
  calcPn,
} from "../utils/math/queuingFormulas";
import { ResultCard } from "./ResultCard";
import { DistMM1 } from "./DistMM1";

export const MM1: React.FC = () => {
  const [lambda, setLambda] = useState<number | "">("");
  const [mu, setMu] = useState<number | "">("");
  const [targetN, setTargetN] = useState<number | "">("");

  const renderResults = () => {
    if (
      typeof lambda !== "number" ||
      typeof mu !== "number" ||
      lambda <= 0 ||
      mu <= 0
    ) {
      return (
        <div
          className="flex flex-col items-center justify-center p-8 text-center
                        bg-slate-50 dark:bg-purple-950/30
                        rounded-2xl border border-dashed
                        border-slate-200 dark:border-purple-900 mt-6"
        >
          <p className="text-slate-500 dark:text-purple-600 mb-2 font-medium">
            Los parámetros (λ, μ) deben ser mayores a 0.
          </p>
          <p className="text-sm text-slate-400 dark:text-purple-800">
            Nota: La tasa de servicio (μ) debe ser mayor a la tasa de llegada
            (λ) para que el sistema sea estable.
          </p>
        </div>
      );
    }

    const rho = calcRho(lambda, mu);

    if (rho >= 1) {
      return (
        <div className="bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 p-4 rounded-xl mt-6 border border-red-200 dark:border-red-900">
          <h4 className="font-bold flex items-center gap-2 mb-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Sistema Inestable (ρ ≥ 1)
          </h4>
          <p className="text-sm opacity-90">
            La tasa de llegada ({lambda}) es mayor o igual a la tasa de servicio
            ({mu}). La cola crecerá infinitamente.
          </p>
        </div>
      );
    }

    const p0 = calcP0(rho);
    const L = calcL(lambda, mu);
    const Lq = calcLq(lambda, mu);
    const W = calcW(lambda, mu);
    const Wq = calcWq(lambda, mu);
    const Pn =
      typeof targetN === "number" && targetN >= 0 ? calcPn(rho, targetN) : null;

    return (
      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <ResultCard
            title="Factor de Uso"
            symbol="ρ"
            value={rho}
            description="Prob. sistema ocupado"
            highlight={rho > 0.8}
          />
          <ResultCard
            title="Prob. Vacío"
            symbol="P0"
            value={p0}
            description="Sistema sin clientes"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <ResultCard
            title="Clientes en Sistema"
            symbol="L"
            value={L}
            description="Promedio en total"
          />
          <ResultCard
            title="Clientes en Cola"
            symbol="Lq"
            value={Lq}
            description="Promedio esperando"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <ResultCard
            title="Tiempo en Sistema"
            symbol="W"
            value={W}
            description="Espera + Servicio"
          />
          <ResultCard
            title="Tiempo en Cola"
            symbol="Wq"
            value={Wq}
            description="Solo espera"
          />
        </div>

        {Pn !== null && (
          <div className="p-4 bg-purple-50/50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-700/50 dark:shadow-md dark:shadow-purple-900/40">
            <h4 className="text-sm font-medium text-purple-800 dark:text-purple-400 mb-1">
              Probabilidad de {targetN} clientes en el sistema (Pn)
            </h4>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-300">
              {(Pn * 100).toFixed(2)}%
            </div>
          </div>
        )}
        {/* ─── Distribución de Probabilidades ─── */}
        <DistMM1 rho={rho} />
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full animate-[fadeSlideUp_0.3s_ease_both]">
      <div className="mb-6 space-y-4">
        <p className="text-slate-500 dark:text-purple-400 text-sm leading-relaxed">
          Modelo de un solo servidor con{" "}
          <span className="font-semibold text-slate-700 dark:text-purple-300">
            capacidad infinita en el sistema
          </span>
          . Tiempos de llegada y servicio exponenciales.
        </p>

        <div className="bg-white dark:bg-[#12091c] rounded-2xl border border-slate-200 dark:border-purple-900/60 shadow-sm dark:shadow-black/40 overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-purple-900/40 bg-slate-50/50 dark:bg-[#0a040f]/60">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-purple-500/90 uppercase tracking-wider">
              Parámetros de Entrada
            </h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="mm1-lambda"
                  className="block text-sm font-medium text-slate-700 dark:text-purple-400 mb-1"
                >
                  Tasa de Llegada (λ)
                </label>
                <input
                  id="mm1-lambda"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  className="block w-full rounded-xl border border-slate-300 dark:border-purple-800
                               bg-slate-50 dark:bg-[#0e0715]
                               text-slate-900 dark:text-purple-100
                               placeholder:text-slate-400 dark:placeholder:text-purple-900
                               focus:border-purple-500 dark:focus:border-purple-500/80
                               focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-500/15
                               dark:focus:bg-[#140a20]
                               outline-none text-sm p-2 transition-all"
                  placeholder="Ej. 2 clientes/hora"
                  value={lambda}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      setLambda("");
                      return;
                    }
                    const valNum = Number(e.target.value);
                    setLambda(
                      !isNaN(valNum) ? Math.max(0, Math.abs(valNum)) : "",
                    );
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === "-" ||
                      e.key === "e" ||
                      e.key === "E" ||
                      e.key === "+"
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="mm1-mu"
                  className="block text-sm font-medium text-slate-700 dark:text-purple-400 mb-1"
                >
                  Tasa de Servicio (μ)
                </label>
                <input
                  id="mm1-mu"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  className="block w-full rounded-xl border border-slate-300 dark:border-purple-800
                               bg-slate-50 dark:bg-[#0e0715]
                               text-slate-900 dark:text-purple-50
                               placeholder:text-slate-400 dark:placeholder:text-purple-800
                               focus:border-purple-500 dark:focus:border-purple-500/80
                               focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-500/15
                               dark:focus:bg-[#140a20]
                               outline-none text-sm p-2 transition-all"
                  placeholder="Ej. 3 clientes/hora"
                  value={mu}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      setMu("");
                      return;
                    }
                    const valNum = Number(e.target.value);
                    setMu(!isNaN(valNum) ? Math.max(0, Math.abs(valNum)) : "");
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === "-" ||
                      e.key === "e" ||
                      e.key === "E" ||
                      e.key === "+"
                    ) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-purple-900/30">
              <label
                htmlFor="mm1-pn"
                className="block text-sm font-medium text-slate-700 dark:text-purple-400 mb-1"
              >
                Prob. de 'n' clientes (opcional)
              </label>
              <input
                id="mm1-pn"
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                className="block w-full rounded-xl border border-slate-300 dark:border-purple-800
                           bg-slate-50 dark:bg-[#0e0715]
                           text-slate-900 dark:text-purple-100
                           placeholder:text-slate-400 dark:placeholder:text-purple-900
                           focus:border-purple-500 dark:focus:border-purple-500/80
                           focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-500/15
                           dark:focus:bg-[#140a20]
                           outline-none text-sm p-2 transition-all"
                placeholder="Ingrese un valor para n..."
                value={targetN}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setTargetN("");
                    return;
                  }
                  const valNum = parseInt(e.target.value, 10);
                  setTargetN(
                    !isNaN(valNum) ? Math.max(0, Math.abs(valNum)) : "",
                  );
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "-" ||
                    e.key === "e" ||
                    e.key === "E" ||
                    e.key === "+"
                  ) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 pb-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-purple-50 mb-2">
          Resultados
        </h2>
        {renderResults()}
      </div>
    </div>
  );
};
