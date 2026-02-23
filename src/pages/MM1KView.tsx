import React, { useState } from 'react';
import { 
  calcRho, 
  calcP0_MM1K, 
  calcPn_MM1K, 
  calcL_MM1K, 
  calcEffectiveLambda, 
  calcLostLambda,
  calcW_MM1K,
  calcWq_MM1K,
  calcLq_MM1K
} from '../utils/math/queuingFormulas';
import { ResultCard } from '../components/ResultCard';

export const MM1KView: React.FC = () => {
  const [lambda, setLambda] = useState<number | ''>('');
  const [mu, setMu] = useState<number | ''>('');
  const [kParam, setKParam] = useState<number | ''>('');
  const [targetN, setTargetN] = useState<number | ''>('');

  const renderResults = () => {
    if (
      typeof lambda !== 'number' || typeof mu !== 'number' || typeof kParam !== 'number' ||
      lambda <= 0 || mu <= 0 || kParam <= 0
    ) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 mt-6">
          <p className="text-gray-500 mb-2">Por favor, complete todos los campos (λ, μ, K) con valores mayores a 0.</p>
        </div>
      );
    }

    if (!Number.isInteger(kParam)) {
      return (
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl mt-6">
          <p className="text-sm">La capacidad máxima del sistema (K) debe ser un número entero.</p>
        </div>
      );
    }

    const rho = calcRho(lambda, mu);
    const p0 = calcP0_MM1K(rho, kParam);
    const L = calcL_MM1K(rho, kParam);
    
    const lambdaE = calcEffectiveLambda(lambda, rho, kParam);
    const lambdaLost = calcLostLambda(lambda, rho, kParam);
    
    // Si la lambda efectiva es 0, evitamos cálculos NaN o Infinity.
    const W = lambdaE > 0 ? calcW_MM1K(lambdaE, L) : 0;
    const Wq = calcWq_MM1K(W, mu);
    const Lq = Math.max(0, calcLq_MM1K(lambdaE, Wq)); // Prevenimos valores ultra-mínimos negativos por el float math
    
    const Pn = typeof targetN === 'number' && targetN >= 0 && targetN <= kParam 
      ? calcPn_MM1K(rho, kParam, targetN) : null;

    return (
      <div className="mt-6 space-y-4">
        
        <div className="grid grid-cols-2 gap-3">
          <ResultCard
            title="Lambda Efectiva"
            symbol="λe"
            value={lambdaE}
            description="Tasa de entrada real"
            highlight={true}
          />
          <ResultCard
            title="Clientes Perdidos"
            symbol="λp"
            value={lambdaLost}
            description="Tasa de rechazo"
            highlight={lambdaLost > 0}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ResultCard
            title="Factor de Uso"
            symbol="ρ"
            value={rho}
            description="Utilización nominal desp. del rechazo"
          />
          <ResultCard
            title="Prob. Vacío"
            symbol="P0"
            value={p0}
            description="Sistema sin clientes"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <ResultCard
            title="Clientes en Sistema"
            symbol="L"
            value={L}
            description="Promedio en total"
          />
          <ResultCard
            title="Clientes en Cola"
            symbol="Lq"
            value={Lq}
            description="Promedio esperando"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <ResultCard
            title="Tiempo en Sistema"
            symbol="W"
            value={W}
            description="Espera + Servicio"
          />
          <ResultCard
            title="Tiempo en Cola"
            symbol="Wq"
            value={Wq > 0 ? Wq : 0}
            description="Solo espera"
          />
        </div>

        {Pn !== null && (
          <div className="mt-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
            <h4 className="text-sm font-medium text-purple-800 mb-1">Probabilidad de {targetN} clientes en el sistema (Pn)</h4>
            <div className="text-2xl font-bold text-purple-900">{(Pn * 100).toFixed(2)}%</div>
          </div>
        )}
        
        {typeof targetN === 'number' && targetN > kParam && (
           <p className="text-xs text-red-500 mt-2">Atención: El valor 'n' no puede superar la capacidad 'K' ({kParam}).</p>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in slide-in-from-right-8 duration-300">
      <div className="mb-6 space-y-4">
        <p className="text-gray-500 text-sm leading-relaxed">
          Modelo de un servidor con <span className="font-semibold text-purple-700">capacidad finita (K) en el sistema</span>. Tiempos exponenciales. Se asume que los clientes rechazados se pierden.
        </p>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Parámetros de Entrada</h2>
          </div>
          <div className="p-4 space-y-4">
            
            <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="lambdaK" className="block text-sm font-medium text-gray-700 mb-1">
                    Llegada (λ)
                  </label>
                  <input
                    id="lambdaK"
                    type="number"
                    inputMode="decimal"
                    className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-lg p-3 bg-gray-50"
                    placeholder="Ej. 2"
                    value={lambda}
                    onChange={(e) => setLambda(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                
                <div>
                  <label htmlFor="muK" className="block text-sm font-medium text-gray-700 mb-1">
                    Servicio (μ)
                  </label>
                  <input
                    id="muK"
                    type="number"
                    inputMode="decimal"
                    className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-lg p-3 bg-gray-50"
                    placeholder="Ej. 3"
                    value={mu}
                    onChange={(e) => setMu(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
            </div>

            <div>
              <label htmlFor="kParam" className="block text-sm font-medium text-purple-700 mb-1">
                Capacidad del Sistema (K)
              </label>
              <input
                id="kParam"
                type="number"
                inputMode="numeric"
                min="1"
                className="block w-full rounded-xl border-purple-200 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-lg p-3 bg-purple-50/30"
                placeholder="Límite en el sistema (cola + servidor)"
                value={kParam}
                onChange={(e) => setKParam(e.target.value ? Number(e.target.value) : '')}
              />
              <p className="text-[10px] text-gray-400 mt-1 pl-1">Incluye a la persona siendo atendida y las que esperan.</p>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <label htmlFor="pnK" className="block text-sm font-medium text-gray-700 mb-1">
                Prob. de 'n' clientes (opcional)
              </label>
              <input
                id="pnK"
                type="number"
                inputMode="numeric"
                min="0"
                className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-base p-2.5 bg-gray-50"
                placeholder="Ej. 2 clientes en sistema"
                value={targetN}
                onChange={(e) => setTargetN(e.target.value ? Number(e.target.value) : '')}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 pb-24">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Resultados</h2>
        {renderResults()}
      </div>
    </div>
  );
};
