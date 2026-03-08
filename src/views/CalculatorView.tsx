import { useState } from "react";
import { MM1K } from "../components/MM1K";
import { MM1 } from "../components/MM1";

type QueueType = "" | "limitada" | "ilimitada";

interface Option {
  value: "limitada" | "ilimitada";
  label: string;
  subtitle: string;
  icon: React.ReactElement;
}

const OPTIONS: Option[] = [
  {
    value: "limitada",
    label: "Con límite de cola",
    subtitle: "M/M/1/K — Capacidad finita",
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
          d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
        />
      </svg>
    ),
  },
  {
    value: "ilimitada",
    label: "Sin límite de cola",
    subtitle: "M/M/1 — Capacidad infinita",
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
          d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
        />
      </svg>
    ),
  },
];

export default function CalculatorView() {
  const [selected, setSelected] = useState<QueueType>("ilimitada");
  const [open, setOpen] = useState(false);

  const current = OPTIONS.find((o) => o.value === selected);

  return (
    <div className="flex flex-col min-h-dvh text-slate-900 dark:text-violet-50">
      {/* ─── Header ─── */}
      <header
        className="bg-slate-100 dark:bg-zinc-950
                         border-b border-slate-200 dark:border-zinc-800
                         px-5 py-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-zinc-800 flex items-center justify-center text-violet-600 dark:text-violet-400">
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
          <div>
            <h1 className="text-[1.1rem] font-bold">Análisis de Servidores</h1>
            <p className="text-[0.72rem] text-violet-600 dark:text-violet-500 font-medium">
              Configuración del modelo matemático
            </p>
          </div>
        </div>
      </header>

      {/* ─── Dropdown ─── */}
      <div className="px-5 pt-6 pb-2">
        <label
          className="block text-[0.7rem] font-bold uppercase tracking-[1.5px]
                          text-violet-600 dark:text-violet-600 mb-2"
        >
          Tipo de servidor
        </label>

        <div className="relative">
          {/* Trigger */}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="w-full flex items-center justify-between
                       bg-white dark:bg-zinc-900
                       border border-slate-300 dark:border-zinc-800
                       rounded-xl px-4 py-3
                       text-left transition-all duration-150
                       hover:border-slate-300 dark:hover:border-zinc-700
                       dark:hover:bg-zinc-800
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/20"
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            {current ? (
              <span className="flex items-center gap-3">
                <span className="text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-zinc-800 p-1.5 rounded-md">
                  {current.icon}
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900 dark:text-violet-50">
                    {current.label}
                  </span>
                  <span className="text-[0.72rem] text-violet-600 dark:text-violet-500 font-medium">
                    {current.subtitle}
                  </span>
                </span>
              </span>
            ) : (
              <span className="text-sm text-slate-400 dark:text-violet-700 font-medium">
                Seleccione un modelo matemático...
              </span>
            )}

            {/* Chevron */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`w-5 h-5 text-slate-400 dark:text-violet-700 flex-shrink-0
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
                         bg-white dark:bg-zinc-900
                         border border-slate-200 dark:border-zinc-800
                         rounded-xl overflow-hidden
                         shadow-md shadow-black/5 dark:shadow-none border dark:border-zinc-800"
            >
              {OPTIONS.map((opt) => (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={selected === opt.value}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(opt.value);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left
                                transition-colors duration-100
                                ${
                                  selected === opt.value
                                    ? "bg-violet-50 dark:bg-zinc-800"
                                    : "hover:bg-slate-50 dark:hover:bg-zinc-800"
                                }`}
                  >
                    <span className="text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-zinc-800 p-1.5 rounded-md">
                      {opt.icon}
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900 dark:text-violet-50">
                        {opt.label}
                      </span>
                      <span className="text-[0.72rem] text-violet-600 dark:text-violet-500 font-medium">
                        {opt.subtitle}
                      </span>
                    </span>
                    {selected === opt.value && (
                      <span className="ml-auto text-violet-600 dark:text-violet-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-5 h-5"
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

      {/* ─── Contenido según selección ─── */}
      <div className="flex-1 px-5 pt-4 pb-4">
        {!selected && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900/50 flex items-center justify-center text-zinc-400 dark:text-zinc-600 mb-4">
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
            <p className="text-sm text-slate-500 dark:text-violet-700 font-medium">
              Seleccione un modelo matemático para iniciar el análisis
            </p>
          </div>
        )}
        {selected === "limitada" && <MM1K />}
        {selected === "ilimitada" && <MM1 />}
      </div>
    </div>
  );
}
