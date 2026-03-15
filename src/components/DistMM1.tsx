import React from 'react';
import { calcPn } from '../utils/math/queuingFormulas';

interface DistMM1Props {
    rho: number;
}

export const DistMM1: React.FC<DistMM1Props> = ({ rho }) => {
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
                    </tbody>
                </table>
            </div>
            <p className="mt-3 text-[0.65rem] text-slate-400 dark:text-purple-800 font-medium italic">
                Distribución de probabilidad del sistema (n=0 a 5)
            </p>
        </div>
    );
};
