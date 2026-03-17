import { useState } from 'react';
import { MM1K } from '../components/MM1K';
import { MM1 } from '../components/MM1';
import { MMC } from "../components/MMC";
import { MMCN } from "../components/MMCN";

type ServerType = "" | "single" | "multi";
type CapacityType = "infinita" | "finita";

interface ServerOption {
  value: "single" | "multi";
  label: string;
  subtitle: string;
  icon: React.ReactElement;
}

const SERVER_OPTIONS: ServerOption[] = [
  {
    value: "single",
    label: "Líneas de espera de un servidor",
    subtitle: "M/M/1 y M/M/1/K",
    icon: (
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
          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
        />
      </svg>
    ),
  },
  {
    value: "multi",
    label: "Líneas de espera de varios servidores",
    subtitle: "M/M/c y M/M/c/N",
    icon: (
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
          d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
        />
      </svg>
    ),
  },
];

export default function CalculatorView() {
  const [selectedServer, setSelectedServer] = useState<ServerType>("single");
  const [capacity, setCapacity] = useState<CapacityType>("infinita");
  const [open, setOpen] = useState(false);

  const currentServer = SERVER_OPTIONS.find((o) => o.value === selectedServer);

  return (
    <div className="flex flex-col min-h-dvh text-slate-900 dark:text-purple-100 animate-[fadeSlideUp_0.3s_ease_both]">
      {/* ═══════════ HEADER ═══════════ */}
      {selectedServer ? (
        <header
          className="bg-slate-100 dark:bg-[#0c0415]
                           border-b border-slate-200 dark:border-purple-900/50
                           px-5 py-4 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            {/* Logo replacement with Stylized Rho */}
            <div className="w-14 h-14 flex items-center justify-center">
              <img src="/logo.png" alt="Logo Dark" className="w-12 h-12 object-contain hidden dark:block" />
              <img src="/lightlogo.png" alt="Logo Light" className="w-12 h-12 object-contain block dark:hidden" />
            </div>
            <div>
              <h1 className="text-[1.1rem] font-extrabold tracking-tight leading-none">
                Lambda<span className="font-serif italic mx-[1px]">ρ</span>ro
              </h1>
              <p className="text-[0.65rem] text-purple-600 dark:text-purple-500 font-bold uppercase tracking-wider mt-0.5">
                Teoría de Colas · Análisis de Servidores
              </p>
            </div>
          </div>
        </header>
      ) : (
        <header
          className="bg-gradient-to-b from-purple-100 to-slate-50
                           dark:from-purple-950 dark:to-[#080510]
                           border-b border-purple-200 dark:border-purple-900
                           transition-all duration-300"
        >
          <div className="flex flex-col items-center gap-4 px-6 pt-12 pb-10">
            <div className="w-20 h-20 flex items-center justify-center animate-[float_3s_ease-in-out_infinite]">
              <img src="/logo.png" alt="Logo Dark" className="w-20 h-20 object-contain hidden dark:block" />
              <img src="/lightlogo.png" alt="Logo Light" className="w-20 h-20 object-contain block dark:hidden" />
            </div>

            {/* Texto */}
            <div className="text-center">
              <h1 className="text-[1.9rem] font-extrabold tracking-tight">
                Lambda<span className="font-serif italic mx-[1px]">ρ</span>ro
              </h1>
              <p
                className="text-[0.7rem] font-semibold text-purple-600 dark:text-purple-300
                            uppercase tracking-[1.5px] mt-2"
              >
                Teoría de Colas · Análisis de Servidores
              </p>
            </div>
          </div>
        </header>
      )}

      {/* ─── Dropdown Servidor ─── */}
      <div className="px-5 pt-6 pb-2">
        <label
          className="block text-[0.7rem] font-bold uppercase tracking-[1.5px]
                          text-purple-600 dark:text-purple-600 mb-2"
        >
          Tipo de servidor
        </label>

        <div className="relative">
          {/* Trigger */}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="w-full flex items-center justify-between
                       bg-white dark:bg-purple-950/40
                       border border-slate-300 dark:border-purple-800/60
                       rounded-xl px-4 py-3
                       text-left transition-all duration-150
                       hover:border-purple-500 dark:hover:border-purple-600/60
                       dark:hover:bg-purple-900/30
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40"
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            {currentServer ? (
              <span className="flex items-center gap-3">
                <span className="text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/40 p-1.5 rounded-md">
                  {currentServer.icon}
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900 dark:text-purple-50">
                    {currentServer.label}
                  </span>
                  <span className="text-[0.72rem] text-purple-600 dark:text-purple-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                    {currentServer.subtitle}
                  </span>
                </span>
              </span>
            ) : (
              <span className="text-sm text-slate-400 dark:text-purple-700 font-medium">
                Seleccione un tipo de servidor...
              </span>
            )}

            {/* Chevron */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`w-5 h-5 text-slate-400 dark:text-purple-700 flex-shrink-0
                          transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            >
              <path
                fillRule="evenodd"
                d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Opciones */}
          {open && (
            <ul
              role="listbox"
              className="absolute z-10 top-full mt-2 left-0 right-0
                         bg-[#1a0b33] dark:bg-[#1a0b33]
                         border border-purple-800/40
                         rounded-xl overflow-hidden
                         shadow-2xl shadow-black/80"
            >
              {SERVER_OPTIONS.map((opt) => (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={selectedServer === opt.value}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedServer(opt.value);
                      setCapacity("infinita"); // Reset sub-tab
                      setOpen(false);
                    }}
                     className={`w-full flex items-center gap-3 px-4 py-3.5 text-left
                                 transition-all duration-100
                                 ${selectedServer === opt.value
                         ? "bg-purple-400 text-purple-950 shadow-inner"
                         : "text-purple-100/90 hover:bg-purple-900/50"
                       }`}
                  >
                    <span className={`${selectedServer === opt.value
                        ? "bg-purple-950/10 text-purple-900"
                        : "text-purple-400 bg-purple-950/30"}
                         p-1.5 rounded-md transition-colors`}>
                      {opt.icon}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold tracking-tight">
                        {opt.label}
                      </span>
                      <span className={`text-[0.65rem] font-medium
                         ${selectedServer === opt.value ? "text-purple-800" : "text-purple-400"}`}>
                        {opt.subtitle}
                      </span>
                    </div>
                    {selectedServer === opt.value && (
                      <span className="ms-auto">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                          stroke="currentColor"
                          className="w-5 h-5 text-purple-950"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                          />
                        </svg>
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ─── Segmented Control para Capacidad ─── */}
      {selectedServer && (
        <div className="px-5 mt-2">
          <div className="bg-slate-200/60 dark:bg-purple-950/30 p-1 rounded-xl flex items-center border border-transparent dark:border-purple-900/20">
            <button
              onClick={() => setCapacity("infinita")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200
                ${capacity === "infinita"
                  ? "bg-white dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 shadow-sm"
                  : "text-slate-500 dark:text-purple-400/70 hover:text-slate-700 dark:hover:text-purple-300"
                }`}
            >
              Capacidad Infinita
              <span className="block text-[0.65rem] font-normal opacity-70">
                {selectedServer === "single" ? "M/M/1" : "M/M/c"}
              </span>
            </button>
            <button
              onClick={() => setCapacity("finita")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200
                ${capacity === "finita"
                  ? "bg-white dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 shadow-sm"
                  : "text-slate-500 dark:text-purple-400/70 hover:text-slate-700 dark:hover:text-purple-300"
                }`}
            >
              Capacidad Finita
              <span className="block text-[0.65rem] font-normal opacity-70">
                {selectedServer === "single" ? "M/M/1/K" : "M/M/c/N"}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ─── Contenido según selección ─── */}
      <div className="flex-1 px-5 pt-4 pb-4">
        {!selectedServer && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-300 dark:text-purple-800/80 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                />
              </svg>
            </div>
            <p className="text-sm text-slate-500 dark:text-purple-700 font-medium">
              Seleccione un tipo de servidor para iniciar el análisis
            </p>
          </div>
        )}

        {/* Renderizado condicional de los componentes de cálculo */}
        {selectedServer === "single" && capacity === "infinita" && <MM1 />}
        {selectedServer === "single" && capacity === "finita" && <MM1K />}
        {selectedServer === "multi" && capacity === "infinita" && <MMC />}
        {selectedServer === "multi" && capacity === "finita" && <MMCN />}
      </div>
    </div>
  );
}
