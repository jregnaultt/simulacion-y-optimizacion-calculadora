interface HomeViewProps {
  onNavigate: (view: "calculator") => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  return (
    <div className="flex flex-col min-h-dvh text-slate-900 dark:text-purple-50">
      {/* ═══════════ HEADER ═══════════ */}
      <header
        className="bg-gradient-to-b from-purple-100 to-slate-50
                         dark:from-purple-950 dark:to-[#0b0510]
                         border-b border-purple-200 dark:border-purple-900"
      >
        <div className="flex flex-col items-center gap-4 px-6 pt-14 pb-10">
          {/* Logo */}
          <img
            src="/logo.png"
            alt="LambdaPro Logo"
            className="w-24 h-24 rounded-full shadow-lg shadow-purple-900/60
                       drop-shadow-[0_0_15px_rgba(168,85,247,0.4)] dark:drop-shadow-[0_0_25px_rgba(168,85,247,0.6)]
                       animate-[float_3s_ease-in-out_infinite]"
          />

          {/* Texto */}
          <div className="text-center">
            <h1 className="text-[1.9rem] font-extrabold tracking-tight">
              Lambda<span className="font-serif italic mx-[1px]">ρ</span>ro
            </h1>
            <p
              className="text-[0.7rem] font-semibold text-purple-600 dark:text-purple-400
                          uppercase tracking-[1.5px] mt-2"
            >
              Teoría de Colas · Análisis de Servidores
            </p>
          </div>
        </div>
      </header>

      {/* ═══════════ CONTENIDO ═══════════ */}
      <div className="flex flex-col flex-1 px-5 py-8 gap-8">
        {/* Bienvenida */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[1.4rem] font-bold">¡Bienvenido! 👋</h2>
          <p className="text-[0.9rem] text-slate-600 dark:text-purple-300 leading-relaxed">
            Herramienta de simulación para analizar sistemas de colas. Calcula
            métricas de rendimiento para servidores con y sin límite de cola.
          </p>
        </div>

        {/* Separador */}
        <div className="h-px w-full bg-slate-200 dark:bg-purple-900" />

        {/* Acceso rápido */}
        <div className="flex flex-col gap-4">
          <p
            className="text-[0.7rem] font-bold text-purple-600 dark:text-purple-600
                        uppercase tracking-[1.5px]"
          >
            Acceso rápido
          </p>

          {/* Botón card */}
          <button
            type="button"
            onClick={() => onNavigate("calculator")}
            className="group w-full text-left
                       bg-white dark:bg-purple-950
                       border border-purple-300 dark:border-purple-800
                       rounded-2xl
                       transition-all duration-200
                       hover:border-purple-500 dark:hover:border-purple-600
                       hover:-translate-y-0.5
                       hover:shadow-xl hover:shadow-purple-100 dark:hover:shadow-black/50
                       active:scale-[0.99]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <div className="p-5 flex flex-col gap-4">
              {/* Fila: ícono + badge */}
              <div className="flex items-center justify-between">
                <div
                  className="w-12 h-12 rounded-xl
                                bg-purple-100 dark:bg-purple-900
                                flex items-center justify-center text-2xl"
                >
                  🖥️
                </div>
                <span
                  className="text-[0.65rem] font-bold uppercase tracking-wide
                                 text-purple-600 dark:text-purple-400
                                 bg-purple-50 dark:bg-purple-950
                                 border border-purple-300 dark:border-purple-800
                                 px-3 py-1 rounded-full"
                >
                  Calculadora
                </span>
              </div>

              {/* Textos */}
              <div className="flex flex-col gap-1.5">
                <h3 className="text-[1.1rem] font-bold">
                  Cálculo de Servidores
                </h3>
                <p className="text-[0.8rem] font-semibold text-purple-600 dark:text-purple-500">
                  Cola limitada &amp; Cola ilimitada
                </p>
                <p className="text-[0.85rem] text-slate-600 dark:text-purple-300 leading-relaxed">
                  Ingresa los parámetros del sistema y obtén métricas clave:
                  utilización, clientes en espera y tiempo promedio en cola.
                </p>
              </div>

              {/* Footer del card */}
              <div
                className="flex items-center justify-between
                              pt-4 border-t border-slate-200 dark:border-purple-800/60"
              >
                <span className="text-[0.85rem] font-semibold text-purple-600 dark:text-purple-400">
                  Abrir calculadora
                </span>
                <span
                  className="text-purple-600 dark:text-purple-500 text-lg
                                 transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer
        className="text-center px-5 py-6 text-[0.72rem]
                         text-slate-400 dark:text-purple-900"
      >
        Lambda<span className="font-serif italic mx-[1px]">ρ</span>ro · v1.0
      </footer>
    </div>
  );
}
