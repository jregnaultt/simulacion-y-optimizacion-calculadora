import React from 'react';
import { useSettings } from '../context/SettingsContext';

interface ResultCardProps {
  title: string;
  value: string | number;
  symbol: string;
  description: string;
  highlight?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  value,
  symbol,
  description,
  highlight = false,
}) => {
  const { decimals } = useSettings();

  return (
    <div className={`p-4 rounded-2xl border transition-all duration-200
      ${highlight
        ? `bg-violet-50 dark:bg-violet-900/25
           border-violet-200 dark:border-violet-700/60
           shadow-md dark:shadow-sm shadow-black/5 dark:shadow-black/20`
        : `bg-white dark:bg-zinc-800
           border-slate-100 dark:border-zinc-800
           shadow-sm dark:shadow-black/30`
      }`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-slate-500 dark:text-violet-500">{title}</h3>
        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full
                         text-xs font-bold
                         ${highlight
            ? 'bg-violet-100 dark:bg-violet-800/70 text-violet-700 dark:text-violet-300'
            : 'bg-slate-100 dark:bg-violet-900/60 text-slate-700 dark:text-violet-400'
          }`}>
          {symbol}
        </span>
      </div>
      <div className={`text-2xl font-bold mb-1 tracking-tight
        ${highlight
          ? 'text-violet-700 dark:text-violet-300'
          : 'text-slate-900 dark:text-violet-100'
        }`}>
        {typeof value === 'number'
          ? Number.isInteger(value) ? value : value.toFixed(decimals)
          : value}
      </div>
      <p className="text-xs text-slate-400 dark:text-violet-700/80">{description}</p>
    </div>
  );
};
