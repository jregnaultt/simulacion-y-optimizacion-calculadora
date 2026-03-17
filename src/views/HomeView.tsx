
interface HomeViewProps {
    onNavigate: (view: "calculator") => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
    return (
        <div className="flex flex-col min-h-dvh text-slate-900 dark:text-purple-50 animate-[fadeSlideUp_0.3s_ease_both]">

            {/* ═══════════ HEADER ═══════════ */}
            <header className="bg-gradient-to-b from-purple-100 to-slate-50
                         dark:from-purple-950 dark:to-[#080510]
                         border-b border-purple-200 dark:border-purple-900">
                <div className="flex flex-col items-center gap-4 px-6 pt-14 pb-10">

                    {/* Logo replacement with Stylized Rho */}
                    <div className="w-24 h-24 flex items-center justify-center animate-[float_3s_ease-in-out_infinite]">
                        <img src="/logo.png" alt="Logo" className="w-24 h-24 object-contain" />
                    </div>

                    {/* Texto */}
                    <div className="text-center">
                        <h1 className="text-[1.8rem] font-extrabold tracking-tight">
                            Lambda<span className="font-serif italic mx-[1px]">ρ</span>ro
                        </h1>
                        <p className="text-[0.7rem] font-semibold text-purple-600 dark:text-purple-400
                                uppercase tracking-[1.5px] mt-2">
                            Teoría de Colas · Análisis de Servidores
                        </p>
                    </div>
                </div>
            </header>

            {/* ═══════════ CONTENIDO ═══════════ */}
            <main className="flex-1 max-w-2xl mx-auto px-5 py-8 space-y-8">

                {/* Intro */}
                <section className="space-y-3">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-purple-100">
                        Optimiza tus sistemas de servicio
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-purple-400/70 leading-relaxed">
                        Analiza colas de espera con precisión matemática.
                        Calcula tiempos promedio, niveles de ocupación y probabilidades para tomar decisiones informadas.
                    </p>
                </section>

                {/* Acceso Rápido */}
                <div className="grid grid-cols-1 gap-4">
                    <button
                        onClick={() => onNavigate('calculator')}
                        className="group relative flex items-center gap-5 p-6 bg-white dark:bg-[#12091c] rounded-2xl
                                 border border-slate-200 dark:border-purple-900/40 shadow-sm
                                 hover:border-purple-400 dark:hover:border-purple-500/60 transition-all duration-300
                                 text-left overflow-hidden translate-y-0 hover:-translate-y-1"
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="text-4xl">📊</span>
                        </div>

                        <div className="w-16 h-16 rounded-xl bg-purple-100 dark:bg-purple-900/40 
                                     flex items-center justify-center text-3xl
                                     group-hover:scale-110 transition-transform">
                            🧮
                        </div>

                        <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-purple-100 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                                    Calculadora de Colas
                                </h3>
                                <span className="text-purple-600 dark:text-purple-400 transition-transform group-hover:translate-x-1">→</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-purple-400/60 font-medium">
                                Modelos M/M/1, M/M/1/K, M/M/c y M/M/c/N
                            </p>
                            <p className="text-xs text-slate-400 dark:text-purple-600/70 mt-2 leading-relaxed">
                                Ingresa tasas de llegada, servicio y servidores para obtener métricas de utilización y tiempos de espera.
                            </p>
                        </div>
                    </button>

                    <div className="p-6 bg-purple-50/50 dark:bg-purple-950/20 rounded-2xl border border-dashed border-purple-200 dark:border-purple-900/40">
                        <h4 className="text-[0.7rem] font-bold text-purple-600 dark:text-purple-500 uppercase tracking-widest mb-4">
                            Recursos Rápidos
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white dark:bg-[#12091c]/50 rounded-xl border border-purple-100 dark:border-purple-800/30">
                                <span className="block text-2xl mb-1">📖</span>
                                <span className="text-xs font-bold text-slate-700 dark:text-purple-300">Guía de Uso</span>
                            </div>
                            <div className="p-4 bg-white dark:bg-[#12091c]/50 rounded-xl border border-purple-100 dark:border-purple-800/30">
                                <span className="block text-2xl mb-1">📝</span>
                                <span className="text-xs font-bold text-slate-700 dark:text-purple-300">Fórmulas</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer simple */}
                <footer className="pt-12 pb-6 text-center border-t border-slate-100 dark:border-purple-900/10">
                    <p className="text-[0.65rem] text-slate-400 dark:text-purple-800 font-bold tracking-widest uppercase">
                        LambdaPro • Teoría de Colas • 2026
                    </p>
                </footer>
            </main>
        </div>
    );
}
