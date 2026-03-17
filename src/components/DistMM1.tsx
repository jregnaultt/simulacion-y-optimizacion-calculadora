import React from 'react';
import { calcPn } from '../utils/math/queuingFormulas';
import { useSettings } from '../context/SettingsContext';
import { formatSmart } from '../utils/formatSmart';

interface DistMM1Props {
    rho: number;
}

export const DistMM1: React.FC<DistMM1Props> = ({ rho }) => {
    const { decimals } = useSettings();
    const tolerance = Math.pow(10, -decimals);

    // --- Guarda defensiva: M/M/1 requiere 0 < ρ < 1 ---
    if (rho <= 0 || rho >= 1) {
        return (
            <div className="flex flex-col items-center w-full">
                <div className="w-full bg-white dark:bg-[#12091c] rounded-2xl border border-amber-300 dark:border-amber-700/60 shadow-sm p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <p className="text-sm text-amber-700 dark:text-amber-400 font-medium text-center">
                        ⚠️ El factor de utilización (ρ = {formatSmart(rho, decimals)}) debe estar entre 0 y 1 (exclusivo)
                        para que el modelo M/M/1 sea estable.
                    </p>
                </div>
            </div>
        );
    }

    // --- Rango dinámico: iterar hasta que Fn ≈ 1 o n > 200 ---
    const items: { n: number; pn: number; fn: number }[] = [];
    let cumulative = 0;

    for (let n = 0; n <= 200; n++) {
        const pn = calcPn(rho, n);
        cumulative += pn;
        items.push({ n, pn, fn: cumulative });
        // Detener cuando probabilidad acumulada está suficientemente cerca de 1
        if (1 - cumulative < tolerance) break;
    }

    // Suma total de Pn para la fila de verificación
    const totalPn = items.reduce((sum, i) => sum + i.pn, 0);

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full bg-white dark:bg-[#12091c] rounded-2xl border border-slate-200 dark:border-purple-900/60 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/80 dark:bg-purple-950/40 border-b border-slate-100 dark:border-purple-900/40">
                            <th className="py-2.5 px-3 text-[0.7rem] font-bold text-slate-500 dark:text-purple-600 tracking-wider w-12 text-center italic">n</th>
                            <th className="py-2.5 px-4 text-[0.7rem] font-bold text-slate-500 dark:text-purple-600 tracking-wider text-center italic">Pn</th>
                            <th className="py-2.5 px-4 text-[0.7rem] font-bold text-slate-500 dark:text-purple-600 tracking-wider text-center italic">Fn</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-purple-900/20">
                        {[0, 1, 2, 3, 4, 5].map((n) => {
                            const pnValue = calcPn(rho, n);
                            const fnValue = 1 - Math.pow(rho, n + 1);
                            return (
                                <tr key={n} className="hover:bg-slate-50/50 dark:hover:bg-purple-900/10 transition-colors">
                                    <td className="py-2.5 px-3 text-sm font-bold text-slate-900 dark:text-purple-50 text-center">{n}</td>
                                    <td className="py-2.5 px-4 text-sm font-medium text-slate-600 dark:text-purple-300 text-center tabular-nums">
                                        {pnValue.toFixed(4)}
                                    </td>
                                    <td className="py-2.5 px-4 text-sm font-medium text-slate-600 dark:text-purple-300 text-center tabular-nums">
                                        {fnValue.toFixed(4)}
                                    </td>
                                </tr>
                            );
                        })}
                        {/* Fila de verificación: suma total de Pn */}
                        <tr className="bg-slate-50/80 dark:bg-purple-950/40 border-t-2 border-slate-200 dark:border-purple-800/60">
                            <td className="py-2.5 px-3 text-sm font-bold text-slate-900 dark:text-purple-50 text-center">Σ</td>
                            <td className="py-2.5 px-4 text-sm font-bold text-slate-900 dark:text-purple-200 text-center tabular-nums">
                                {formatSmart(totalPn, decimals)}
                            </td>
                            <td className="py-2.5 px-4 text-sm font-medium text-slate-400 dark:text-purple-700 text-center italic">
                                —
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p className="mt-3 text-[0.65rem] text-slate-400 dark:text-purple-800 font-medium italic">
                Distribución de probabilidad del sistema (n=0 a 5)
            </p>
        </div>
    );
};
