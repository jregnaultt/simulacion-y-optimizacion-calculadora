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
        ? `bg-purple-50 dark:bg-purple-900/25
           border-purple-200 dark:border-purple-700/60
           shadow-md dark:shadow-purple-900/50`
        : `bg-white dark:bg-[#140a20]
           border-slate-100 dark:border-purple-900/50
           shadow-sm dark:shadow-black/30`
      }`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-slate-500 dark:text-purple-500">{title}</h3>
        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full
                         text-xs font-bold
                         ${highlight
            ? 'bg-purple-100 dark:bg-purple-800/70 text-purple-700 dark:text-purple-300'
            : 'bg-slate-100 dark:bg-purple-900/60 text-slate-700 dark:text-purple-400'
          }`}>
          {symbol}
        </span>
      </div>
      <div className={`text-2xl font-bold mb-1 tracking-tight
        ${highlight
          ? 'text-purple-700 dark:text-purple-300'
          : 'text-slate-900 dark:text-purple-100'
        }`}>
        {typeof value === 'number'
          ? Number.isInteger(value) ? value : value.toFixed(decimals)
          : value}
      </div>
      <p className="text-xs text-slate-400 dark:text-purple-700/80">{description}</p>
    </div>
  );
};
