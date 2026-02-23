import { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { MM1View } from './pages/MM1View';
import { MM1KView } from './pages/MM1KView';

function App() {
  const [activeTab, setActiveTab] = useState<'MM1' | 'MM1K'>('MM1');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 selection:bg-primary selection:text-white">
      {/* Header Nativo-like */}
      <header className="bg-white px-4 py-4 border-b border-gray-100 sticky top-0 z-10 safe-top">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">
          Teoría de Colas
        </h1>
        <p className="text-xs text-gray-500 font-medium">Calculadora de Líneas de Espera</p>
      </header>

      {/* Main SCROLLABLE Content */}
      <main className="flex-1 w-full max-w-md mx-auto p-4 md:p-6 overflow-y-auto w-full">
        {activeTab === 'MM1' ? <MM1View /> : <MM1KView />}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;
