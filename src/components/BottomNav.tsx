import React from 'react';
import { IconSingleServer, IconLimitedQueue } from './Icons';

interface BottomNavProps {
  activeTab: 'MM1' | 'MM1K';
  onTabChange: (tab: 'MM1' | 'MM1K') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => onTabChange('MM1')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            activeTab === 'MM1' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <IconSingleServer className="w-6 h-6" />
          <span className="text-xs font-medium">M/M/1</span>
        </button>
        <button
          onClick={() => onTabChange('MM1K')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            activeTab === 'MM1K' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <IconLimitedQueue className="w-6 h-6" />
          <span className="text-xs font-medium">M/M/1/K</span>
        </button>
      </div>
    </div>
  );
};
