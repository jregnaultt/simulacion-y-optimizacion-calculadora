import { useTheme } from '../context/ThemeContext';

function SunIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
    );
}

function MoonIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
    );
}

export default function OptionsView() {
    const { isDark, toggle } = useTheme();

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-8 pb-24">
            <header>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Configuración
                </h1>
                <p className="text-slate-500 dark:text-emerald-400/60 mt-2">
                    Personaliza tu experiencia con la calculadora
                </p>
            </header>

            <section className="bg-white/50 dark:bg-emerald-950/20 backdrop-blur-sm border border-slate-200 dark:border-emerald-900/30 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-emerald-50">
                            Modo Visual
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-emerald-400/50">
                            Escoge entre el tema claro u oscuro
                        </p>
                    </div>

                    <button
                        onClick={toggle}
                        className={`
                            relative inline-flex h-12 w-24 items-center rounded-full transition-colors duration-300 focus:outline-none
                            ${isDark ? 'bg-emerald-600' : 'bg-slate-200'}
                        `}
                    >
                        <span className="sr-only">Cambiar modo</span>
                        <div
                            className={`
                                flex items-center justify-center h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform duration-300
                                ${isDark ? 'translate-x-12' : 'translate-x-1'}
                            `}
                        >
                            {isDark ? (
                                <MoonIcon />
                            ) : (
                                <SunIcon />
                            )}
                        </div>
                    </button>
                </div>
            </section>

            <section className="bg-white/50 dark:bg-emerald-950/20 backdrop-blur-sm border border-slate-200 dark:border-emerald-900/30 rounded-2xl p-6 shadow-sm">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-emerald-50">
                            Error
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-emerald-400/50">
                            Margen de error aceptable para los cálculos
                        </p>
                    </div>

                    <input
                        type="text"
                        placeholder="Ej: 0.001"
                        className="w-full bg-white dark:bg-[#0a1510] border border-slate-300 dark:border-emerald-800/70 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
                        readOnly
                    />
                </div>
            </section>
        </div>
    );
}
