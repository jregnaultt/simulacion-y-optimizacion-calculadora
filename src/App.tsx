import { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import Navbar from './components/Navbar';
import HomeView from './views/HomeView';
import CalculatorView from './views/CalculatorView';
import MonteCarloView from './views/MonteCarloView';
import OptionsView from './views/OptionsView';

export type ActiveView = 'home' | 'calculator' | 'montecarlo' | 'options';

function AppContent() {
  const [activeView, setActiveView] = useState<ActiveView>('calculator');
  const { isDark } = useTheme();

  return (
    <div className={`flex flex-col min-h-dvh ${isDark ? 'dark bg-[#0b0510]' : 'bg-slate-50'}`}>
      <div className="flex-1 overflow-y-auto">
        {activeView === 'home' && <HomeView onNavigate={(view) => setActiveView(view)} />}
        {activeView === 'calculator' && <CalculatorView />}
        {activeView === 'montecarlo' && <MonteCarloView />}
        {activeView === 'options' && <OptionsView />}
      </div>
      <Navbar activeView={activeView} onNavigate={setActiveView} />
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SettingsProvider>
  );
}
