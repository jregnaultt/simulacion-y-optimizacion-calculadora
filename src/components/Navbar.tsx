import React from 'react';

interface NavbarProps {
    activeView: 'home' | 'calculator' | 'options';
    onNavigate: (view: 'home' | 'calculator' | 'options') => void;
}

function HomeIcon({ active }: { active: boolean }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            fill={active ? 'currentColor' : 'none'}
            stroke="currentColor" strokeWidth={active ? 0 : 1.8}
            className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
    );
}

function CalculatorIcon({ active }: { active: boolean }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            fill={active ? 'currentColor' : 'none'}
            stroke="currentColor" strokeWidth={active ? 0 : 1.8}
            className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm2.498-4.5h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm2.504-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008ZM3.75 6A2.25 2.25 0 0 1 6 3.75h12A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6Z" />
        </svg>
    );
}

function SettingsIcon({ active }: { active: boolean }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            fill={active ? 'currentColor' : 'none'}
            stroke="currentColor" strokeWidth={active ? 0 : 1.8}
            className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
    );
}

const NAV_ITEMS: Array<{
    label: string;
    view: 'home' | 'calculator' | 'options';
    icon: (active: boolean) => React.ReactElement;
}> = [
        { label: 'Inicio', view: 'home', icon: (a) => <HomeIcon active={a} /> },
        { label: 'Calculadora', view: 'calculator', icon: (a) => <CalculatorIcon active={a} /> },
        { label: 'Opciones', view: 'options', icon: (a) => <SettingsIcon active={a} /> },
    ];

export default function Navbar({ activeView, onNavigate }: NavbarProps) {
    return (
        <nav className="sticky bottom-0 z-50
                    bg-white/95 dark:bg-[#060e08]/95
                    backdrop-blur-md
                    border-t border-slate-200 dark:border-emerald-900/40
                    shadow-[0_-4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_32px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-around px-4 pt-2 pb-3">

                {NAV_ITEMS.map((item) => {
                    const active = activeView === item.view;
                    return (
                        <button
                            key={item.view}
                            type="button"
                            onClick={() => onNavigate(item.view)}
                            className={`relative flex flex-col items-center gap-1 px-5 py-1.5 rounded-xl
                          transition-all duration-150
                          ${active
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-slate-400 dark:text-emerald-800/70 hover:text-emerald-500 dark:hover:text-emerald-600'
                                }`}
                            aria-label={item.label}
                            aria-current={active ? 'page' : undefined}
                        >
                            {active && (
                                <span className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5
                                 bg-emerald-500 dark:bg-emerald-400 rounded-full
                                 shadow-[0_0_8px_2px] shadow-emerald-400/50 dark:shadow-emerald-500/60" />
                            )}
                            {item.icon(active)}
                            <span className="text-[0.65rem] font-semibold tracking-wide">
                                {item.label}
                            </span>
                        </button>
                    );
                })}

            </div>
        </nav>
    );
}
