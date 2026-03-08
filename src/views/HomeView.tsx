interface HomeViewProps {
  onNavigate: (view: "calculator") => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  return (
    <div className="flex flex-col min-h-dvh text-slate-900 dark:text-violet-50">
      {/* ═══════════ HEADER ═══════════ */}
      <header
        className="bg-white
                         dark:bg-zinc-950
                         border-b border-violet-200 dark:border-zinc-800"
      >
        <div className="flex flex-col items-center gap-4 px-6 pt-14 pb-10">
          {/* Logo */}
          <img
            src="/logo.png"
            alt="LambdaPro Logo"
            className="w-24 h-24 rounded-full shadow-md shadow-black/5 dark:shadow-black/20"
          />

          {/* Texto */}
          <div className="text-center">
            <h1 className="text-[1.9rem] font-extrabold tracking-tight">
              Lambda<span className="font-serif italic mx-[1px]">ρ</span>ro
            </h1>
            <p
              className="text-[0.7rem] font-bold text-slate-400 dark:text-zinc-500
                          uppercase tracking-[2px] mt-2"
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
          <h2 className="text-[1.3rem] font-bold text-slate-800 dark:text-violet-100">
            Análisis de Sistemas
          </h2>
          <p className="text-[0.9rem] text-slate-600 dark:text-violet-300 leading-relaxed">
            Módulo integral para el cálculo de métricas en sistemas de colas
            (M/M/1 y M/M/1/K).
          </p>
        </div>

        {/* Separador */}
        <div className="h-px w-full bg-slate-200 dark:bg-violet-900" />

        {/* Acceso rápido */}
        <div className="flex flex-col gap-4">
          <p
            className="text-[0.7rem] font-bold text-slate-400 dark:text-zinc-500
                        uppercase tracking-[1.5px]"
          >
            Acceso rápido
          </p>

          {/* Botón card */}
          <button
            type="button"
            onClick={() => onNavigate("calculator")}
            className="group w-full text-left
                       bg-white dark:bg-zinc-900
                       border border-violet-300 dark:border-zinc-800
                       rounded-2xl
                       transition-all duration-200
                       hover:border-slate-300 dark:hover:border-zinc-700
                       hover:-translate-y-0.5
                       hover:shadow-md hover:shadow-black/5 dark:hover:shadow-none
                       active:scale-[0.99]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            <div className="p-5 flex flex-col">
              {/* Fila: ícono + badge */}
              <div className="flex items-center justify-between">
                <div
                  className="w-12 h-12 rounded-xl
                                bg-slate-50 dark:bg-zinc-800/80
                                flex items-center justify-center text-slate-600 dark:text-zinc-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
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
                                 text-slate-600 dark:text-zinc-400
                                 bg-slate-100 dark:bg-zinc-800/80
                                 border border-slate-200 dark:border-zinc-700
                                 px-3 py-1 rounded-full"
                >
                  Calculadora
                </span>
              </div>

              {/* Textos */}
              <div className="flex flex-col gap-1.5">
                <h3 className="text-[1.1rem] font-bold text-slate-800 dark:text-violet-50">
                  Simulación de Servidores
                </h3>
                <p className="text-[0.8rem] font-semibold text-violet-600 dark:text-violet-400">
                  M/M/1 &amp; M/M/1/K
                </p>
                <p className="text-[0.85rem] text-slate-600 dark:text-violet-300 leading-relaxed">
                  Calcule utilización, tiempos promedios y distribución
                  estadística de usuarios en el sistema.
                </p>
              </div>
              {/* Footer del card */}
              <div
                className="flex items-center justify-between
                              pt-4 border-t border-slate-200 dark:border-zinc-800"
              >
                <span className="text-[0.85rem] font-semibold text-violet-600 dark:text-violet-400">
                  Abrir calculadora
                </span>
                <span
                  className="text-violet-600 dark:text-violet-500 text-lg
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
                         text-slate-400 dark:text-violet-400"
      >
        Lambda<span className="font-serif italic mx-[1px]">ρ</span>ro · v1.0
      </footer>
    </div>
  );
}
