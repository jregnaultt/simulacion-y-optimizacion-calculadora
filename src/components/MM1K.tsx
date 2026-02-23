import React, { useState } from 'react';
import {
    calcRho,
    calcP0_MM1K,
    calcPn_MM1K,
    calcL_MM1K,
    calcEffectiveLambda,
    calcLostLambda,
    calcW_MM1K,
    calcWq_MM1K,
    calcLq_MM1K
} from '../utils/math/queuingFormulas';
import { ResultCard } from './ResultCard';

export const MM1K: React.FC = () => {
    const [lambda, setLambda] = useState<number | ''>('');
    const [mu, setMu] = useState<number | ''>('');
    const [kParam, setKParam] = useState<number | ''>('');
    const [targetN, setTargetN] = useState<number | ''>('');

    const renderResults = () => {
        if (
            typeof lambda !== 'number' || typeof mu !== 'number' || typeof kParam !== 'number' ||
            lambda <= 0 || mu <= 0 || kParam <= 0
        ) {
            return (
                <div className="flex flex-col items-center justify-center p-8 text-center
                        bg-slate-50 dark:bg-emerald-950/30
                        rounded-2xl border border-dashed
                        border-slate-200 dark:border-emerald-900 mt-6">
                    <p className="text-slate-500 dark:text-emerald-600 mb-2">
                        Por favor, complete todos los campos (λ, μ, K) con valores mayores a 0.
                    </p>
                </div>
            );
        }

        if (!Number.isInteger(kParam)) {
            return (
                <div className="bg-yellow-50 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-400 p-4 rounded-xl mt-6 border border-yellow-200 dark:border-yellow-900">
                    <p className="text-sm">La capacidad máxima del sistema (K) debe ser un número entero.</p>
                </div>
            );
        }

        const rho = calcRho(lambda, mu);
        const p0 = calcP0_MM1K(rho, kParam);
        const L = calcL_MM1K(rho, kParam);

        const lambdaE = calcEffectiveLambda(lambda, rho, kParam);
        const lambdaLost = calcLostLambda(lambda, rho, kParam);

        // Si la lambda efectiva es 0, evitamos cálculos NaN o Infinity.
        const W = lambdaE > 0 ? calcW_MM1K(lambdaE, L) : 0;
        const Wq = calcWq_MM1K(W, mu);
        const Lq = Math.max(0, calcLq_MM1K(lambdaE, Wq)); // Prevenimos valores ultra-mínimos negativos por el float math

        const Pn = typeof targetN === 'number' && targetN >= 0 && targetN <= kParam
            ? calcPn_MM1K(rho, kParam, targetN) : null;

        return (
            <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <ResultCard title="Lambda Efectiva" symbol="λe" value={lambdaE} description="Tasa de entrada real" highlight={true} />
                    <ResultCard title="Clientes Perdidos" symbol="λp" value={lambdaLost} description="Tasa de rechazo" highlight={lambdaLost > 0} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <ResultCard title="Factor de Uso" symbol="ρ" value={rho} description="Utilización nominal desp. del rechazo" />
                    <ResultCard title="Prob. Vacío" symbol="P0" value={p0} description="Sistema sin clientes" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <ResultCard title="Clientes en Sistema" symbol="L" value={L} description="Promedio en total" />
                    <ResultCard title="Clientes en Cola" symbol="Lq" value={Lq} description="Promedio esperando" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <ResultCard title="Tiempo en Sistema" symbol="W" value={W} description="Espera + Servicio" />
                    <ResultCard title="Tiempo en Cola" symbol="Wq" value={Wq > 0 ? Wq : 0} description="Solo espera" />
                </div>

                {Pn !== null && (
                    <div className="mt-4 p-4 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-700/50 dark:shadow-md dark:shadow-emerald-900/40">
                        <h4 className="text-sm font-medium text-emerald-800 dark:text-emerald-400 mb-1">
                            Probabilidad de {targetN} clientes en el sistema (Pn)
                        </h4>
                        <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-300">
                            {(Pn * 100).toFixed(2)}%
                        </div>
                    </div>
                )}

                {typeof targetN === 'number' && targetN > kParam && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-2">
                        Atención: El valor 'n' no puede superar la capacidad 'K' ({kParam}).
                    </p>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full animate-[fadeSlideUp_0.3s_ease_both]">
            <div className="mb-6 space-y-4">
                <p className="text-slate-500 dark:text-emerald-400 text-sm leading-relaxed">
                    Modelo de un servidor con{' '}
                    <span className="font-semibold text-slate-700 dark:text-emerald-300">
                        capacidad finita (K) en el sistema
                    </span>
                    . Tiempos exponenciales. Se asume que los clientes rechazados se pierden.
                </p>

                <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-slate-200 dark:border-emerald-900/60 shadow-sm dark:shadow-black/40 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-emerald-900/40 bg-slate-50/50 dark:bg-[#081208]/60">
                        <h2 className="text-sm font-semibold text-slate-700 dark:text-emerald-400 uppercase tracking-wider">
                            Parámetros de Entrada
                        </h2>
                    </div>
                    <div className="p-4 space-y-4">

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="mm1k-lambda" className="block text-sm font-medium text-slate-700 dark:text-emerald-400 mb-1">
                                    Tasa de Llegada (λ)
                                </label>
                                <input
                                    id="mm1k-lambda"
                                    type="number"
                                    inputMode="decimal"
                                    className="block w-full rounded-xl border border-slate-300 dark:border-emerald-800
                                 bg-slate-50 dark:bg-[#0a1510]
                                 text-slate-900 dark:text-emerald-50
                                 placeholder:text-slate-400 dark:placeholder:text-emerald-800
                                 focus:border-emerald-500 dark:focus:border-emerald-500/80
                                 focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-500/15
                                 dark:focus:bg-[#0d1a13]
                                 outline-none text-sm p-2 transition-all"
                                    placeholder="Ej. 2 clientes/hora"
                                    value={lambda}
                                    onChange={(e) => setLambda(e.target.value ? Number(e.target.value) : '')}
                                />
                            </div>

                            <div>
                                <label htmlFor="mm1k-mu" className="block text-sm font-medium text-slate-700 dark:text-emerald-400 mb-1">
                                    Tasa de Servicio (μ)
                                </label>
                                <input
                                    id="mm1k-mu"
                                    type="number"
                                    inputMode="decimal"
                                    className="block w-full rounded-xl border border-slate-300 dark:border-emerald-800
                                 bg-slate-50 dark:bg-[#0a1510]
                                 text-slate-900 dark:text-emerald-50
                                 placeholder:text-slate-400 dark:placeholder:text-emerald-800
                                 focus:border-emerald-500 dark:focus:border-emerald-500/80
                                 focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-500/15
                                 dark:focus:bg-[#0d1a13]
                                 outline-none text-sm p-2 transition-all"
                                    placeholder="Ej. 3 clientes/hora"
                                    value={mu}
                                    onChange={(e) => setMu(e.target.value ? Number(e.target.value) : '')}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="mm1k-k" className="block text-sm font-medium text-slate-700 dark:text-emerald-400 mb-1">
                                Capacidad del Sistema (K)
                            </label>
                            <input
                                id="mm1k-k"
                                type="number"
                                inputMode="numeric"
                                min="1"
                                className="block w-full rounded-xl border border-slate-300 dark:border-emerald-800
                           bg-slate-50 dark:bg-[#0a1510]
                           text-slate-900 dark:text-emerald-100
                           placeholder:text-slate-400 dark:placeholder:text-emerald-900
                           focus:border-emerald-500 dark:focus:border-emerald-500/80
                           focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-500/15
                           dark:focus:bg-[#0d1a13]
                           outline-none text-sm p-2 transition-all"
                                placeholder="Límite en el sistema (cola + servidor)"
                                value={kParam}
                                onChange={(e) => setKParam(e.target.value ? Number(e.target.value) : '')}
                            />
                            <p className="text-[10px] text-slate-400 dark:text-emerald-800 mt-1 pl-1">
                                Incluye a la persona siendo atendida y las que esperan.
                            </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-emerald-900/30">
                            <label htmlFor="mm1k-pn" className="block text-sm font-medium text-slate-700 dark:text-emerald-400 mb-1">
                                Prob. de 'n' clientes (opcional)
                            </label>
                            <input
                                id="mm1k-pn"
                                type="number"
                                inputMode="numeric"
                                min="0"
                                className="block w-full rounded-xl border border-slate-300 dark:border-emerald-800
                           bg-slate-50 dark:bg-[#0a1510]
                           text-slate-900 dark:text-emerald-100
                           placeholder:text-slate-400 dark:placeholder:text-emerald-900
                           focus:border-emerald-500 dark:focus:border-emerald-500/80
                           focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-500/15
                           dark:focus:bg-[#0d1a13]
                           outline-none text-sm p-2 transition-all"
                                placeholder="Ej. 2 clientes en sistema"
                                value={targetN}
                                onChange={(e) => setTargetN(e.target.value ? Number(e.target.value) : '')}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 pb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-emerald-50 mb-2">Resultados</h2>
                {renderResults()}
            </div>
        </div>
    );
};
