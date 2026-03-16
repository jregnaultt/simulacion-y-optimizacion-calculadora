import React from 'react';
import { calcPn_MMCN } from '../utils/math/queuingFormulas';
import { formatSmart } from '../utils/formatSmart';

interface DistMMCNProps {
    lambda: number;
    mu: number;
    c: number;
    N: number;
    p0: number;
}

export const DistMMCN: React.FC<DistMMCNProps> = ({ lambda, mu, c, N, p0 }) => {
    const decimals = 4;
    const tolerance = Math.pow(10, -decimals);

    // Generate items n=0 to N, con corte cuando Fn ≈ 1
    const items: { n: number; pn: number; fn: number }[] = [];
    let cumulative = 0;

    for (let n = 0; n <= N; n++) {
        const pn = calcPn_MMCN(lambda, mu, c, N, n, p0);
        cumulative += pn;
        items.push({ n, pn, fn: cumulative });
        // Corte anticipado cuando probabilidad acumulada ≈ 1
        if (n > 0 && 1 - cumulative < tolerance) break;
    }

    const maxPn = Math.max(...items.map(i => i.pn));
    const totalPn = items.reduce((sum, i) => sum + i.pn, 0);

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full bg-white dark:bg-[#12091c] rounded-2xl border border-slate-200 dark:border-purple-900/60 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="max-h-[400px] overflow-y-auto overflow-x-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 z-10">
                            <tr className="bg-slate-50/90 dark:bg-purple-950/80 backdrop-blur-sm border-b border-slate-100 dark:border-purple-900/40">
                                <th className="py-2.5 px-3 text-[0.7rem] font-bold text-slate-500 dark:text-purple-600 tracking-wider w-12 text-center italic">n</th>
                                <th className="py-2.5 px-4 text-[0.7rem] font-bold text-slate-500 dark:text-purple-600 tracking-wider text-center italic">Pn</th>
                                <th className="py-2.5 px-4 text-[0.7rem] font-bold text-slate-500 dark:text-purple-600 tracking-wider text-center italic">Fn</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-purple-900/20">
                            {items.map((item) => (
                                <tr key={item.n} className="hover:bg-slate-50/50 dark:hover:bg-purple-900/10 transition-colors">
                                    <td className="py-2.5 px-3 text-sm font-bold text-slate-900 dark:text-purple-50 text-center">
                                        {item.n}
                                        {item.n < c && <span className="ml-1 text-[0.6rem] text-purple-400 font-normal">(S-{item.n+1})</span>}
                                    </td>
                                    <td className="py-2.5 px-4 text-sm font-medium text-slate-600 dark:text-purple-300 text-center tabular-nums">
                                        {formatSmart(item.pn, decimals)}
                                        <div className="mt-1 h-1.5 w-full bg-slate-100 dark:bg-purple-950/60 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-purple-400 dark:bg-purple-500 rounded-full transition-all duration-300"
                                                style={{ width: `${(item.pn / maxPn) * 100}%` }}
                                            />
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-4 text-sm font-medium text-slate-600 dark:text-purple-300 text-center tabular-nums">
                                        {formatSmart(Math.min(1, item.fn), decimals)}
                                    </td>
                                </tr>
                            ))}
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
            </div>
            <p className="mt-3 text-[0.65rem] text-slate-400 dark:text-purple-800 font-medium italic">
                Distribución de probabilidad del sistema M/M/c/N (n=0 a {N})
            </p>
        </div>
    );
};
