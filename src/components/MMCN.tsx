import React, { useState, useMemo } from 'react';
import {
    calcP0_MMCN,
    calcPn_MMCN,
    calcLq_MMCN,
    calcL_MMCN,
    calcLambdaE_MMCN,
    calcLambdaLost_MMCN,
    calcW_MMCN,
    calcWq_MMCN,
} from '../utils/math/queuingFormulas';
import { ResultCard } from './ResultCard';
import { DistMMCN } from './DistMMCN';
import { formatSmart } from '../utils/formatSmart';

export const MMCN: React.FC = () => {
    const decimals = 4;
    const [lambda, setLambda] = useState<number | ''>('');
    const [mu, setMu] = useState<number | ''>('');
    const [c, setC] = useState<number | ''>('');
    const [N, setN] = useState<number | ''>('');
    const [targetN, setTargetN] = useState<number | ''>('');
    const [showFormulaPopup, setShowFormulaPopup] = useState(false);

    // C mínimo sugerido
    const cMin = useMemo(() => {
        if (typeof lambda !== 'number' || typeof mu !== 'number' || lambda <= 0 || mu <= 0) return null;
        return Math.ceil(lambda / mu);
    }, [lambda, mu]);

    const handleNumberInput = (
        setter: (v: number | '') => void,
        value: string,
        isInt = false,
        minVal = 0
    ) => {
        if (value === '') { setter(''); return; }
        const valNum = isInt ? parseInt(value, 10) : Number(value);
        if (!isNaN(valNum)) setter(Math.max(minVal, Math.abs(valNum)));
    };

    const blockKeys = (e: React.KeyboardEvent) => {
        if (['-', 'e', 'E', '+'].includes(e.key)) e.preventDefault();
    };

    const renderResults = () => {
        if (
            typeof lambda !== 'number' || typeof mu !== 'number' ||
            typeof c !== 'number' || typeof N !== 'number' ||
            lambda <= 0 || mu <= 0 || c <= 0 || N <= 0
        ) {
            return (
                <div className="flex flex-col items-center justify-center p-8 text-center
                    bg-slate-50 dark:bg-purple-950/30 rounded-2xl border border-dashed
                    border-slate-200 dark:border-purple-900 mt-6">
                    <p className="text-slate-500 dark:text-purple-600 mb-2 font-medium">
                        Los parámetros (λ, μ, c, N) deben ser mayores a 0.
                    </p>
                </div>
            );
        }

        if (N < c) {
            return (
                <div className="bg-yellow-50 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-400 p-4 rounded-xl mt-6 border border-yellow-200 dark:border-yellow-900">
                    <p className="text-sm">
                        La capacidad del sistema (N={N}) debe ser mayor o igual al número de servidores (c={c}).
                    </p>
                </div>
            );
        }

        const rho = lambda / (c * mu);
        const p0 = calcP0_MMCN(lambda, mu, c, N);
        const lq = calcLq_MMCN(lambda, mu, c, N, p0);
        const l = calcL_MMCN(lambda, mu, c, N, p0);
        const lambdaE = calcLambdaE_MMCN(lambda, mu, c, N, p0);
        const lambdaLost = calcLambdaLost_MMCN(lambda, mu, c, N, p0);
        const w = calcW_MMCN(l, lambdaE);
        const wq = calcWq_MMCN(w, mu);

        const Pn = typeof targetN === 'number' && targetN >= 0 && targetN <= N
            ? calcPn_MMCN(lambda, mu, c, N, targetN, p0)
            : null;

        return (
            <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <ResultCard title="Lambda Efectiva" symbol="λe" value={lambdaE} description="Tasa de entrada real" highlight={true} />
                    <ResultCard title="Clientes Perdidos" symbol="λp" value={lambdaLost} description="Tasa de rechazo" highlight={lambdaLost > 0} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <ResultCard title="Factor de Uso" symbol="ρ" value={rho} description="Utilización del sistema" highlight={rho > 0.8} />
                    <ResultCard title="Prob. Vacío" symbol="P0" value={p0} description="Sistema sin clientes" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <ResultCard title="Clientes en Cola" symbol="Lq" value={lq} description="Promedio esperando" />
                    <ResultCard title="Clientes en Sistema" symbol="L" value={l} description="Promedio en total" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <ResultCard title="Tiempo en Cola" symbol="Wq" value={wq > 0 ? wq : 0} description="Solo espera" />
                    <ResultCard title="Tiempo en Sistema" symbol="W" value={w} description="Espera + Servicio" />
                </div>

                {Pn !== null && (
                    <div className="p-4 bg-purple-50/50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-700/50 dark:shadow-md dark:shadow-purple-900/40">
                        <h4 className="text-sm font-medium text-purple-800 dark:text-purple-400 mb-1">
                            Probabilidad de {targetN} clientes en el sistema (Pn)
                        </h4>
                        <div className="text-2xl font-bold text-purple-900 dark:text-purple-300">
                            {formatSmart(Pn * 100, decimals)}%
                        </div>
                    </div>
                )}

                {typeof targetN === 'number' && targetN > N && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-2">
                        Atención: El valor 'n' no puede superar la capacidad 'N' ({N}).
                    </p>
                )}

                {/* Distribución */}
                <DistMMCN lambda={lambda} mu={mu} c={c} N={N} p0={p0} />
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full animate-[fadeSlideUp_0.3s_ease_both]">
            <div className="mb-6 space-y-4">
                <p className="text-slate-500 dark:text-purple-400 text-sm leading-relaxed">
                    Modelo con{' '}
                    <span className="font-semibold text-slate-700 dark:text-purple-300">
                        múltiples servidores (c) y capacidad finita (N)
                    </span>
                    . Tiempos exponenciales. Los clientes que llegan cuando el sistema está lleno se pierden.
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
                                <label htmlFor="mmcn-lambda" className="block text-sm font-medium text-slate-700 dark:text-purple-400 mb-1">
                                    Tasa de Llegada (λ)
                                </label>
                                <input
                                    id="mmcn-lambda"
                                    type="number" inputMode="decimal" min="0" step="any"
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
                                    onChange={(e) => handleNumberInput(setLambda, e.target.value)}
                                    onKeyDown={blockKeys}
                                />
                            </div>
                            <div>
                                <label htmlFor="mmcn-mu" className="block text-sm font-medium text-slate-700 dark:text-purple-400 mb-1">
                                    Tasa de Servicio (μ)
                                </label>
                                <input
                                    id="mmcn-mu"
                                    type="number" inputMode="decimal" min="0" step="any"
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
                                    onChange={(e) => handleNumberInput(setMu, e.target.value)}
                                    onKeyDown={blockKeys}
                                />
                            </div>
                        </div>

                        {/* Servidores (c) + sugerencia de C mínimo */}
                        <div>
                            <label htmlFor="mmcn-c" className="block text-sm font-medium text-slate-700 dark:text-purple-400 mb-1">
                                Número de Servidores (c)
                            </label>
                            <input
                                id="mmcn-c"
                                type="number" inputMode="numeric" min="1" step="1"
                                className="block w-full rounded-xl border border-slate-300 dark:border-purple-800
                                    bg-slate-50 dark:bg-[#0e0715]
                                    text-slate-900 dark:text-purple-100
                                    placeholder:text-slate-400 dark:placeholder:text-purple-900
                                    focus:border-purple-500 dark:focus:border-purple-500/80
                                    focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-500/15
                                    dark:focus:bg-[#140a20]
                                    outline-none text-sm p-2 transition-all"
                                placeholder="Ej. 2 servidores"
                                value={c}
                                onChange={(e) => handleNumberInput(setC, e.target.value, true, 1)}
                                onKeyDown={blockKeys}
                            />

                            {/* Sugerencia de C mínimo */}
                            {cMin !== null && cMin > 0 && (
                                <div
                                    className="mt-2 flex items-center gap-2 w-full px-3 py-2
                                        bg-purple-50 dark:bg-purple-900/25
                                        border border-purple-200 dark:border-purple-700/50
                                        rounded-xl text-left
                                        hover:bg-purple-100 dark:hover:bg-purple-900/40
                                        transition-colors duration-150 group"
                                >
                                    <span className="text-purple-600 dark:text-purple-400 text-sm">💡</span>
                                    <span className="text-xs font-medium text-purple-700 dark:text-purple-400 flex-1">
                                        C mínimo sugerido: <span className="font-bold">{cMin}</span>
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setC(cMin);
                                        }}
                                        className="text-[0.65rem] font-bold px-2 py-1 rounded-lg
                                            bg-purple-600 text-white
                                            hover:bg-purple-700
                                            transition-colors"
                                    >
                                        Usar
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Capacidad del sistema N */}
                        <div>
                            <label htmlFor="mmcn-n" className="block text-sm font-medium text-slate-700 dark:text-purple-400 mb-1">
                                Capacidad del Sistema (N)
                            </label>
                            <input
                                id="mmcn-n"
                                type="number" inputMode="numeric" min="1" step="1"
                                className="block w-full rounded-xl border border-slate-300 dark:border-purple-800
                                    bg-slate-50 dark:bg-[#0e0715]
                                    text-slate-900 dark:text-purple-100
                                    placeholder:text-slate-400 dark:placeholder:text-purple-900
                                    focus:border-purple-500 dark:focus:border-purple-500/80
                                    focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-500/15
                                    dark:focus:bg-[#140a20]
                                    outline-none text-sm p-2 transition-all"
                                placeholder="Límite total en el sistema"
                                value={N}
                                onChange={(e) => handleNumberInput(setN, e.target.value, true, 1)}
                                onKeyDown={blockKeys}
                            />
                            <p className="text-[10px] text-slate-400 dark:text-purple-800 mt-1 pl-1">
                                Máximo de clientes en todo el sistema (cola + servidores).
                            </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-purple-900/30">
                            <label htmlFor="mmcn-pn" className="block text-sm font-medium text-slate-700 dark:text-purple-400 mb-1">
                                Prob. de 'n' clientes (opcional)
                            </label>
                            <input
                                id="mmcn-pn"
                                type="number" inputMode="numeric" min="0" step="1"
                                className="block w-full rounded-xl border border-slate-300 dark:border-purple-800
                                    bg-slate-50 dark:bg-[#0e0715]
                                    text-slate-900 dark:text-purple-100
                                    placeholder:text-slate-400 dark:placeholder:text-purple-900
                                    focus:border-purple-500 dark:focus:border-purple-500/80
                                    focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-500/15
                                    dark:focus:bg-[#140a20]
                                    outline-none text-sm p-2 transition-all"
                                placeholder="Ej. 2 clientes en sistema"
                                value={targetN}
                                onChange={(e) => handleNumberInput(setTargetN, e.target.value, true)}
                                onKeyDown={blockKeys}
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

            {/* Popup fórmula C mínimo */}
            {showFormulaPopup && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6"
                    onClick={() => setShowFormulaPopup(false)}
                >
                    <div
                        className="bg-white dark:bg-[#12091c] rounded-2xl border border-slate-200 dark:border-purple-800/60
                            shadow-2xl max-w-sm w-full p-6 space-y-4
                            animate-[fadeSlideUp_0.2s_ease_both]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold text-slate-900 dark:text-purple-50">
                            ¿Cómo se calcula C mínimo?
                        </h3>
                        <div className="space-y-3 text-sm text-slate-600 dark:text-purple-300 leading-relaxed">
                            <p>
                                Aunque M/M/c/N tiene capacidad finita, para un rendimiento óptimo
                                el factor de utilización debería ser menor a 1:
                            </p>
                            <div className="bg-slate-50 dark:bg-purple-950/40 rounded-xl p-3 font-mono text-center text-base text-slate-800 dark:text-purple-200 border border-slate-200 dark:border-purple-800/40">
                                ρ = λ / (c · μ) {'<'} 1
                            </div>
                            <p>Despejando <span className="font-mono font-bold">c</span>:</p>
                            <div className="bg-slate-50 dark:bg-purple-950/40 rounded-xl p-3 font-mono text-center text-base text-slate-800 dark:text-purple-200 border border-slate-200 dark:border-purple-800/40">
                                c {'>'} λ / μ → c<sub>min</sub> = ⌈λ / μ⌉
                            </div>
                            {typeof lambda === 'number' && typeof mu === 'number' && mu > 0 && (
                                <p>
                                    Con λ={lambda} y μ={mu}:
                                    <span className="font-bold text-purple-700 dark:text-purple-400"> c<sub>min</sub> = ⌈{lambda}/{mu}⌉ = {cMin}</span>
                                </p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowFormulaPopup(false)}
                            className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-semibold
                                hover:bg-purple-700 transition-colors"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
