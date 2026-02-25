import { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import HomeView from './views/HomeView';
import CalculatorView from './views/CalculatorView';
import OptionsView from './views/OptionsView';

type ActiveView = 'home' | 'calculator' | 'options';

function AppContent() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const { isDark } = useTheme();

  return (
    <div className={`flex flex-col min-h-dvh ${isDark ? 'dark bg-[#0b0510]' : 'bg-slate-50'}`}>
      <div className="flex-1 overflow-y-auto">
        {activeView === 'home' && <HomeView onNavigate={(view) => setActiveView(view)} />}
        {activeView === 'calculator' && <CalculatorView />}
        {activeView === 'options' && <OptionsView />}
      </div>
      <Navbar activeView={activeView} onNavigate={setActiveView} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
