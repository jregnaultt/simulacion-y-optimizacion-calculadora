import React from 'react';

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
  return (
    <div className={`p-4 rounded-2xl border transition-all duration-200
      ${highlight
        ? `bg-emerald-50 dark:bg-emerald-900/25
           border-emerald-200 dark:border-emerald-700/60
           shadow-md dark:shadow-emerald-900/50`
        : `bg-white dark:bg-[#0d1a11]
           border-slate-100 dark:border-emerald-900/50
           shadow-sm dark:shadow-black/30`
      }`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-slate-500 dark:text-emerald-500">{title}</h3>
        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full
                         text-xs font-bold
                         ${highlight
            ? 'bg-emerald-100 dark:bg-emerald-800/70 text-emerald-700 dark:text-emerald-300'
            : 'bg-slate-100 dark:bg-emerald-900/60 text-slate-700 dark:text-emerald-400'
          }`}>
          {symbol}
        </span>
      </div>
      <div className={`text-2xl font-bold mb-1 tracking-tight
        ${highlight
          ? 'text-emerald-700 dark:text-emerald-300'
          : 'text-slate-900 dark:text-emerald-100'
        }`}>
        {typeof value === 'number'
          ? Number.isInteger(value) ? value : value.toFixed(4)
          : value}
      </div>
      <p className="text-xs text-slate-400 dark:text-emerald-700/80">{description}</p>
    </div>
  );
};
