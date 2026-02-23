import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
    activeView: 'home' | 'calculator';
    onNavigate: (view: 'home' | 'calculator') => void;
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

const NAV_ITEMS: Array<{
    label: string;
    view: 'home' | 'calculator';
    icon: (active: boolean) => React.ReactElement;
}> = [
        { label: 'Inicio', view: 'home', icon: (a) => <HomeIcon active={a} /> },
        { label: 'Calculadora', view: 'calculator', icon: (a) => <CalculatorIcon active={a} /> },
    ];

export default function Navbar({ activeView, onNavigate }: NavbarProps) {
    const { isDark, toggle } = useTheme();

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

                {/* Toggle tema */}
                <button
                    type="button"
                    onClick={toggle}
                    className="flex flex-col items-center gap-1 px-5 py-1.5 rounded-xl
                     text-slate-400 dark:text-emerald-800/70
                     hover:text-emerald-500 dark:hover:text-emerald-600
                     transition-all duration-150"
                    aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                >
                    {isDark ? <SunIcon /> : <MoonIcon />}
                    <span className="text-[0.65rem] font-semibold tracking-wide">
                        {isDark ? 'Claro' : 'Oscuro'}
                    </span>
                </button>

            </div>
        </nav>
    );
}
