import React, { useState, useMemo } from 'react';
import {
    calcRho_MMC,
    calcP0_MMC,
    calcLq_MMC,
    calcL_MMC,
    calcWq_MMC,
    calcW_MMC,
    calcPw_MMC,
    calcPn_MMC,
} from '../utils/math/queuingFormulas';
import { ResultCard } from './ResultCard';
import { DistMMC } from './DistMMC';
import { formatSmart } from '../utils/formatSmart';

export const MMC: React.FC = () => {
    const decimals = 4;
    const [lambda, setLambda] = useState<number | ''>('');
    const [mu, setMu] = useState<number | ''>('');
    const [c, setC] = useState<number | ''>('');
    const [targetN, setTargetN] = useState<number | ''>('');
    const [showFormulaPopup, setShowFormulaPopup] = useState(false);

    // C mínimo sugerido
    const cMin = useMemo(() => {
        if (typeof lambda !== 'number' || typeof mu !== 'number' || lambda <= 0 || mu <= 0) return null;
        // Para estabilidad rho < 1 -> c > lambda/mu
        return Math.floor(lambda / mu) + 1;
    }, [lambda, mu]);

    const handleNumberInput = (
        setter: (v: number | '') => void,
        value: string,
        isInt = false
    ) => {
        if (value === '') { setter(''); return; }
        const valNum = isInt ? parseInt(value, 10) : Number(value);
        if (!isNaN(valNum)) setter(Math.max(isInt ? 1 : 0, Math.abs(valNum)));
    };

    const blockKeys = (e: React.KeyboardEvent) => {
        if (['-', 'e', 'E', '+'].includes(e.key)) e.preventDefault();
    };

    const renderResults = () => {
        if (
            typeof lambda !== 'number' ||
            typeof mu !== 'number' ||
            typeof c !== 'number' ||
            lambda <= 0 || mu <= 0 || c <= 0
        ) {
            return (
                <div className="flex flex-col items-center justify-center p-8 text-center
                    bg-slate-50 dark:bg-purple-950/30
                    rounded-2xl border border-dashed
                    border-slate-200 dark:border-purple-900 mt-6">
                    <p className="text-slate-500 dark:text-purple-600 mb-2 font-medium">
                        Los parámetros (λ, μ, c) deben ser mayores a 0.
                    </p>
                </div>
            );
        }

        const rho = calcRho_MMC(lambda, mu, c);

        if (rho >= 1) {
            return (
                <div className="bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 p-4 rounded-xl mt-6 border border-red-200 dark:border-red-900">
                    <h4 className="font-bold flex items-center gap-2 mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Sistema Inestable (ρ ≥ 1)
                    </h4>
                    <p className="text-sm opacity-90">
                        ρ = λ/(c·μ) = {lambda}/({c}·{mu}) = {formatSmart(rho, decimals)}.
                        Se necesitan al menos {cMin} servidores para estabilidad.
                    </p>
                </div>
            );
        }

        const p0 = calcP0_MMC(lambda, mu, c);
        const lq = calcLq_MMC(lambda, mu, c, p0);
        const l = calcL_MMC(lambda, mu, lq);
        const wq = calcWq_MMC(lambda, lq);
        const w = calcW_MMC(mu, wq);
        const pw = calcPw_MMC(lambda, mu, c, p0);
        const Pn = typeof targetN === 'number' && targetN >= 0
            ? calcPn_MMC(lambda, mu, c, targetN, p0)
            : null;

        return (
            <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <ResultCard title="Factor de Uso" symbol="ρ" value={rho} description="Utilización del sistema" highlight={rho > 0.8} />
                    <ResultCard title="Prob. Vacío" symbol="P0" value={p0} description="Sistema sin clientes" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <ResultCard title="Clientes en Cola" symbol="Lq" value={lq} description="Promedio esperando" />
                    <ResultCard title="Clientes en Sistema" symbol="L" value={l} description="Promedio en total" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <ResultCard title="Tiempo en Cola" symbol="Wq" value={wq} description="Solo espera" />
                    <ResultCard title="Tiempo en Sistema" symbol="W" value={w} description="Espera + Servicio" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <ResultCard title="Prob. Esperar" symbol="Pw" value={pw} description="Prob. de hacer cola" highlight={pw > 0.5} />
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

                {/* Distribución */}
                <DistMMC lambda={lambda} mu={mu} c={c} rho={rho} p0={p0} />
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full animate-[fadeSlideUp_0.3s_ease_both]">
            <div className="mb-6 space-y-4">
                <p className="text-slate-500 dark:text-purple-400 text-sm leading-relaxed">
                    Modelo con{' '}
                    <span className="font-semibold text-slate-700 dark:text-purple-300">
                        múltiples servidores (c)
                    </span>
                    {' '}y capacidad infinita. Tiempos de llegada y servicio exponenciales.
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
                                <label htmlFor="mmc-lambda" className="block text-sm font-medium text-slate-700 dark:text-purple-400 mb-1">
                                    Tasa de Llegada (λ)
                                </label>
                                <input
                                    id="mmc-lambda"
                                    type="number" inputMode="decimal" min="0" step="any"
                                    className="block w-full rounded-xl border border-slate-300 dark:border-purple-800
                                        bg-slate-50 dark:bg-[#0e0715]
                                        text-slate-900 dark:text-purple-100
                                        placeholder:text-slate-400 dark:placeholder:text-purple-400/50
                                        placeholder:font-medium
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
                                <label htmlFor="mmc-mu" className="block text-sm font-medium text-slate-700 dark:text-purple-400 mb-1">
                                    Tasa de Servicio (μ)
                                </label>
                                <input
                                    id="mmc-mu"
                                    type="number" inputMode="decimal" min="0" step="any"
                                    className="block w-full rounded-xl border border-slate-300 dark:border-purple-800
                                        bg-slate-50 dark:bg-[#0e0715]
                                        text-slate-900 dark:text-purple-100
                                        placeholder:text-slate-400 dark:placeholder:text-purple-400/50
                                        placeholder:font-medium
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
                            <label htmlFor="mmc-c" className="block text-sm font-medium text-slate-700 dark:text-purple-400 mb-1">
                                Número de Servidores (c)
                            </label>
                            <input
                                id="mmc-c"
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
                                onChange={(e) => handleNumberInput(setC, e.target.value, true)}
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

                        <div className="pt-2 border-t border-slate-100 dark:border-purple-900/30">
                            <label htmlFor="mmc-pn" className="block text-sm font-medium text-slate-700 dark:text-purple-400 mb-1">
                                Prob. de 'n' clientes (opcional)
                            </label>
                            <input
                                id="mmc-pn"
                                type="number" inputMode="numeric" min="0" step="1"
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
                                Para que el sistema M/M/c sea <span className="font-semibold text-purple-700 dark:text-purple-400">estable</span>,
                                el factor de utilización debe ser menor a 1:
                            </p>
                            <div className="bg-slate-50 dark:bg-purple-950/40 rounded-xl p-3 font-mono text-center text-base text-slate-800 dark:text-purple-200 border border-slate-200 dark:border-purple-800/40">
                                ρ = λ / (c · μ) {'<'} 1
                            </div>
                            <p>Despejando <span className="font-mono font-bold">c</span>:</p>
                            <div className="bg-slate-50 dark:bg-purple-950/40 rounded-xl p-3 font-mono text-center text-base text-slate-800 dark:text-purple-200 border border-slate-200 dark:border-purple-800/40">
                                c {'>'} λ / μ → c<sub>min</sub> = ⌊λ / μ⌋ + 1
                            </div>
                            {typeof lambda === 'number' && typeof mu === 'number' && mu > 0 && (
                                <p>
                                    Con λ={lambda} y μ={mu}:
                                    <span className="font-bold text-purple-700 dark:text-purple-400"> c<sub>min</sub> = ⌊{lambda}/{mu}⌋ + 1 = {cMin}</span>
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
