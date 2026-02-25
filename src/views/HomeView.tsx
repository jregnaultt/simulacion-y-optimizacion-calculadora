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
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <h2 className="text-[1.3rem] font-bold text-slate-800 dark:text-purple-100">
            Análisis de Sistemas
          </h2>
          <p className="text-[0.9rem] text-slate-600 dark:text-purple-300 leading-relaxed">
            Módulo integral para el cálculo de métricas en sistemas de colas
            (M/M/1 y M/M/1/K).
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
            <div className="p-5 flex flex-col">
              {/* Fila: ícono + badge */}
              <div className="flex items-center justify-between">
                <div
                  className="w-12 h-12 rounded-xl
                                bg-purple-100 dark:bg-purple-900/50
                                flex items-center justify-center text-purple-600 dark:text-purple-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
                    />
                  </svg>
                </div>
                <span
                  className="text-[0.65rem] font-bold uppercase tracking-wide
                                 text-purple-600 dark:text-purple-400
                                 bg-purple-50 dark:bg-purple-900/30
                                 border border-purple-200 dark:border-purple-800/50
                                 px-3 py-1 rounded-full"
                >
                  Calculadora
                </span>
              </div>

              {/* Textos */}
              <div className="flex flex-col gap-1.5">
                <h3 className="text-[1.1rem] font-bold text-slate-800 dark:text-purple-50">
                  Simulación de Servidores
                </h3>
                <p className="text-[0.8rem] font-semibold text-purple-600 dark:text-purple-400">
                  M/M/1 &amp; M/M/1/K
                </p>
                <p className="text-[0.85rem] text-slate-600 dark:text-purple-300 leading-relaxed">
                  Calcule utilización, tiempos promedios y distribución
                  estadística de usuarios en el sistema.
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
