import React from 'react';

interface ResultCardProps {
  title: string;
  value: string | number;
  symbol: string;
  description: string;
  highlight?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, value, symbol, description, highlight = false }) => {
  return (
    <div className={`p-4 rounded-2xl shadow-sm border ${highlight ? 'bg-primary/5 border-primary/20' : 'bg-white border-gray-100'}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-bold text-gray-700">
          {symbol}
        </span>
      </div>
      <div className={`text-2xl font-bold mb-1 ${highlight ? 'text-primary-dark' : 'text-gray-900'}`}>
        {typeof value === 'number' ? Number.isInteger(value) ? value : value.toFixed(4) : value}
      </div>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
};
