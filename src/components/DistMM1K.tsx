import React from 'react';
import { calcPn_MM1K } from '../utils/math/queuingFormulas';

interface DistMM1KProps {
    rho: number;
    k: number;
}

export const DistMM1K: React.FC<DistMM1KProps> = ({ rho, k }) => {
    // Generamos el array de n desde 0 hasta K
    const nValues = Array.from({ length: k + 1 }, (_, i) => i);

    // Calculamos acumulados Fn
    let cumulative = 0;
    const items = nValues.map(n => {
        const pn = calcPn_MM1K(rho, k, n);
        cumulative += pn;
        return { n, pn, fn: cumulative };
    });

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full bg-white dark:bg-[#0c1810] rounded-2xl border border-slate-200 dark:border-emerald-900/60 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="max-h-[400px] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 z-10">
                            <tr className="bg-slate-50/90 dark:bg-emerald-950/80 backdrop-blur-sm border-b border-slate-100 dark:border-emerald-900/40">
                                <th className="py-2.5 px-3 text-[0.7rem] font-bold text-slate-500 dark:text-emerald-600 tracking-wider w-12 text-center italic">n</th>
                                <th className="py-2.5 px-4 text-[0.7rem] font-bold text-slate-500 dark:text-emerald-600 tracking-wider text-center italic">Pn</th>
                                <th className="py-2.5 px-4 text-[0.7rem] font-bold text-slate-500 dark:text-emerald-600 tracking-wider text-center italic">Fn</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-emerald-900/20">
                            {items.map((item) => (
                                <tr key={item.n} className="hover:bg-slate-50/50 dark:hover:bg-emerald-900/10 transition-colors">
                                    <td className="py-2.5 px-3 text-sm font-bold text-slate-900 dark:text-emerald-50 text-center">{item.n}</td>
                                    <td className="py-2.5 px-4 text-sm font-medium text-slate-600 dark:text-emerald-300 text-center tabular-nums">
                                        {item.pn.toFixed(4)}
                                    </td>
                                    <td className="py-2.5 px-4 text-sm font-medium text-slate-600 dark:text-emerald-300 text-center tabular-nums">
                                        {Math.min(1, item.fn).toFixed(4)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className="mt-3 text-[0.65rem] text-slate-400 dark:text-emerald-800 font-medium italic">
                Distribución de probabilidad del sistema (n=0 a {k})
            </p>
        </div>
    );
};
