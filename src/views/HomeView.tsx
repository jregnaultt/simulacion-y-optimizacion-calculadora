
interface HomeViewProps {
    onNavigate: (view: 'calculator') => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
    return (
        <div className="flex flex-col min-h-dvh text-slate-900 dark:text-emerald-50">

            {/* ═══════════ HEADER ═══════════ */}
            <header className="bg-gradient-to-b from-emerald-100 to-slate-50
                         dark:from-emerald-950 dark:to-[#080f0b]
                         border-b border-emerald-200 dark:border-emerald-900">
                <div className="flex flex-col items-center gap-4 px-6 pt-14 pb-10">

                    {/* Logo */}
                    <div className="w-20 h-20 rounded-[22px]
                          bg-gradient-to-br from-emerald-500 to-emerald-700
                          flex items-center justify-center text-[2.2rem]
                          shadow-lg shadow-emerald-300/50 dark:shadow-emerald-900/60
                          animate-[float_3s_ease-in-out_infinite]">
                        📡
                    </div>

                    {/* Texto */}
                    <div className="text-center">
                        <h1 className="text-[1.8rem] font-extrabold tracking-tight">
                            SimuladoPRO
                        </h1>
                        <p className="text-[0.7rem] font-semibold text-emerald-600 dark:text-emerald-400
                          uppercase tracking-[1.5px] mt-2">
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
                    <p className="text-[0.9rem] text-slate-600 dark:text-emerald-300 leading-relaxed">
                        Herramienta de simulación para analizar sistemas de colas.
                        Calcula métricas de rendimiento para servidores con y sin límite de cola.
                    </p>
                </div>

                {/* Separador */}
                <div className="h-px w-full bg-slate-200 dark:bg-emerald-900" />

                {/* Acceso rápido */}
                <div className="flex flex-col gap-4">
                    <p className="text-[0.7rem] font-bold text-emerald-600 dark:text-emerald-600
                        uppercase tracking-[1.5px]">
                        Acceso rápido
                    </p>

                    {/* Botón card */}
                    <button
                        type="button"
                        onClick={() => onNavigate('calculator')}
                        className="group w-full text-left
                       bg-white dark:bg-emerald-950
                       border border-emerald-300 dark:border-emerald-800
                       rounded-2xl
                       transition-all duration-200
                       hover:border-emerald-500 dark:hover:border-emerald-600
                       hover:-translate-y-0.5
                       hover:shadow-xl hover:shadow-emerald-100 dark:hover:shadow-black/50
                       active:scale-[0.99]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    >
                        <div className="p-5 flex flex-col gap-4">

                            {/* Fila: ícono + badge */}
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 rounded-xl
                                bg-emerald-100 dark:bg-emerald-900
                                flex items-center justify-center text-2xl">
                                    🖥️
                                </div>
                                <span className="text-[0.65rem] font-bold uppercase tracking-wide
                                 text-emerald-600 dark:text-emerald-400
                                 bg-emerald-50 dark:bg-emerald-950
                                 border border-emerald-300 dark:border-emerald-800
                                 px-3 py-1 rounded-full">
                                    Calculadora
                                </span>
                            </div>

                            {/* Textos */}
                            <div className="flex flex-col gap-1.5">
                                <h3 className="text-[1.1rem] font-bold">
                                    Cálculo de Servidores
                                </h3>
                                <p className="text-[0.8rem] font-semibold text-emerald-600 dark:text-emerald-500">
                                    Cola limitada &amp; Cola ilimitada
                                </p>
                                <p className="text-[0.85rem] text-slate-600 dark:text-emerald-300 leading-relaxed">
                                    Ingresa los parámetros del sistema y obtén métricas clave:
                                    utilización, clientes en espera y tiempo promedio en cola.
                                </p>
                            </div>

                            {/* Footer del card */}
                            <div className="flex items-center justify-between
                              pt-4 border-t border-slate-200 dark:border-emerald-800/60">
                                <span className="text-[0.85rem] font-semibold text-emerald-600 dark:text-emerald-400">
                                    Abrir calculadora
                                </span>
                                <span className="text-emerald-600 dark:text-emerald-500 text-lg
                                 transition-transform duration-200 group-hover:translate-x-1">
                                    →
                                </span>
                            </div>

                        </div>
                    </button>
                </div>

            </div>

            {/* ═══════════ FOOTER ═══════════ */}
            <footer className="text-center px-5 py-6 text-[0.72rem]
                         text-slate-400 dark:text-emerald-900">
                SimuladoPRO · v1.0
            </footer>

        </div>
    );
}
