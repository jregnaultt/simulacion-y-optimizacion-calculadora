/**
 * ============================================================
 * PRUEBAS AUTOMATIZADAS — Fórmulas de Teoría de Colas
 * ============================================================
 *
 * Este archivo verifica que TODAS las fórmulas matemáticas
 * de los modelos M/M/1 y M/M/1/K son correctas.
 *
 * ¿Cómo funciona?
 * ───────────────
 * 1. Importamos las funciones que queremos probar
 * 2. Usamos describe() para agrupar tests por tema
 * 3. Usamos it() para definir UN test individual
 * 4. Usamos expect() para verificar que el resultado sea correcto
 *
 * Patrón AAA:
 *   ARRANGE → Preparar datos de entrada
 *   ACT     → Ejecutar la función
 *   ASSERT  → Verificar el resultado
 *
 * Para ejecutar:
 *   npm run test:run     (una sola vez)
 *   npm test             (modo watch, se re-ejecuta al guardar)
 */

import { describe, it, expect } from 'vitest';
import {
  calcRho,
  calcP0,
  calcL,
  calcLq,
  calcW,
  calcWq,
  calcPn,
  calcP0_MM1K,
  calcPn_MM1K,
  calcL_MM1K,
  calcEffectiveLambda,
  calcLostLambda,
  calcW_MM1K,
  calcWq_MM1K,
  calcLq_MM1K,
} from './queuingFormulas';

// ╔══════════════════════════════════════════════════════════╗
// ║              MODELO M/M/1 (Cola Infinita)               ║
// ╚══════════════════════════════════════════════════════════╝

// describe() agrupa tests relacionados bajo un nombre descriptivo.
// Piensa en ello como un "capítulo" de un libro de tests.
describe('Modelo M/M/1 — Fórmulas básicas', () => {

  // ─── Caso de referencia: λ=2, μ=3 ───
  // Valores calculados a mano:
  //   ρ = 2/3 ≈ 0.6667
  //   P0 = 1 - 2/3 = 1/3 ≈ 0.3333
  //   L = 2/(3-2) = 2
  //   Lq = 4/(3*(3-2)) = 4/3 ≈ 1.3333
  //   W = 1/(3-2) = 1
  //   Wq = 2/(3*(3-2)) = 2/3 ≈ 0.6667

  // it() define UN test individual.
  // El texto describe qué debe cumplirse (en español para que aprendas).
  it('ρ = λ/μ → debe dar 0.6667 para λ=2, μ=3', () => {
    // ARRANGE: Preparamos los datos conocidos
    const lambda = 2;
    const mu = 3;

    // ACT: Ejecutamos la función que queremos probar
    const resultado = calcRho(lambda, mu);

    // ASSERT: Verificamos que el resultado es el esperado
    // toBeCloseTo() compara decimales con una precisión dada
    // (4 significa 4 decimales de precisión)
    expect(resultado).toBeCloseTo(0.6667, 4);
  });

  it('P0 = 1 - ρ → probabilidad de sistema vacío', () => {
    // ARRANGE
    const rho = calcRho(2, 3); // 0.6667

    // ACT
    const resultado = calcP0(rho);

    // ASSERT: P0 = 1 - 0.6667 = 0.3333
    expect(resultado).toBeCloseTo(0.3333, 4);
  });

  it('L = λ/(μ-λ) → promedio de clientes en el sistema', () => {
    // ARRANGE & ACT
    const resultado = calcL(2, 3);

    // ASSERT: L = 2/(3-2) = 2
    expect(resultado).toBeCloseTo(2.0, 4);
  });

  it('Lq = λ²/(μ(μ-λ)) → promedio de clientes en cola', () => {
    const resultado = calcLq(2, 3);

    // Lq = 4/(3*1) = 1.3333
    expect(resultado).toBeCloseTo(1.3333, 4);
  });

  it('W = 1/(μ-λ) → tiempo promedio en el sistema', () => {
    const resultado = calcW(2, 3);

    // W = 1/(3-2) = 1
    expect(resultado).toBeCloseTo(1.0, 4);
  });

  it('Wq = λ/(μ(μ-λ)) → tiempo promedio en cola', () => {
    const resultado = calcWq(2, 3);

    // Wq = 2/(3*1) = 0.6667
    expect(resultado).toBeCloseTo(0.6667, 4);
  });
});

// ─── Tests de Pn para M/M/1 ───
describe('Modelo M/M/1 — Distribución de probabilidad Pn', () => {

  it('Pn(n=0) = (1-ρ)ρ⁰ = P0 = 0.3333', () => {
    const rho = 2 / 3;
    const resultado = calcPn(rho, 0);

    // Pn(0) = (1-0.6667) * 0.6667^0 = 0.3333
    expect(resultado).toBeCloseTo(0.3333, 4);
  });

  it('Pn(n=1) = (1-ρ)ρ¹ ≈ 0.2222', () => {
    const rho = 2 / 3;
    const resultado = calcPn(rho, 1);

    // Pn(1) = (1-0.6667) * 0.6667 = 0.2222
    expect(resultado).toBeCloseTo(0.2222, 4);
  });

  it('Pn(n=2) = (1-ρ)ρ² ≈ 0.1481', () => {
    const rho = 2 / 3;
    const resultado = calcPn(rho, 2);

    // Pn(2) = (1-0.6667) * 0.6667^2 = 0.1481
    expect(resultado).toBeCloseTo(0.1481, 4);
  });

  // Este test verifica una PROPIEDAD MATEMÁTICA:
  // La suma de todas las Pn debe ser exactamente 1.
  // Como no podemos sumar infinitos, sumamos hasta n=50 y verificamos ≈ 1.
  it('la suma de Pn(0..50) debe ser ≈ 1.0 (propiedad fundamental)', () => {
    const rho = 2 / 3;
    let suma = 0;

    for (let n = 0; n <= 50; n++) {
      suma += calcPn(rho, n);
    }

    // La suma de todas las probabilidades = 1 (axioma de probabilidad)
    expect(suma).toBeCloseTo(1.0, 4);
  });
});

// ─── Tests del rango dinámico de la distribución ───
describe('Modelo M/M/1 — Rango dinámico de distribución', () => {

  it('con ρ=0.5, Pn debe ser < 0.0001 antes de n=20', () => {
    const rho = 0.5;
    // Pn = 0.5 * 0.5^n → buscamos dónde Pn < 0.0001
    let lastSignificantN = 0;

    for (let n = 0; n <= 20; n++) {
      const pn = calcPn(rho, n);
      if (pn >= 0.0001) {
        lastSignificantN = n;
      }
    }

    // Con ρ=0.5, P(13) ≈ 0.0000610, P(12) ≈ 0.000122
    // Así que el último n significativo debería ser ~12
    expect(lastSignificantN).toBeLessThanOrEqual(20);
    expect(lastSignificantN).toBeGreaterThan(5);
  });

  it('con ρ=0.9 (sistema congestionado), necesita más filas', () => {
    const rho = 0.9;
    let lastSignificantN = 0;

    for (let n = 0; n <= 50; n++) {
      const pn = calcPn(rho, n);
      if (pn >= 0.0001) {
        lastSignificantN = n;
      }
    }

    // Con ρ alto, la distribución se extiende más
    expect(lastSignificantN).toBeGreaterThan(10);
  });
});

// ╔══════════════════════════════════════════════════════════╗
// ║           MODELO M/M/1/K (Cola Finita, K clientes)      ║
// ╚══════════════════════════════════════════════════════════╝

describe('Modelo M/M/1/K — Fórmulas básicas', () => {

  // ─── Caso de referencia: λ=2, μ=3, K=5 ───
  // ρ = 2/3 ≈ 0.6667

  it('P0_MM1K → probabilidad de sistema vacío con K=5', () => {
    const rho = 2 / 3;
    const resultado = calcP0_MM1K(rho, 5);

    // P0 = (1-ρ) / (1-ρ^6) = 0.3333 / 0.9122 ≈ 0.3655
    expect(resultado).toBeCloseTo(0.3655, 3);
  });

  it('Pn_MM1K(n=0) debe ser igual a P0_MM1K', () => {
    const rho = 2 / 3;
    const pn0 = calcPn_MM1K(rho, 5, 0);
    const p0 = calcP0_MM1K(rho, 5);

    // Pn(0) y P0 deben ser el mismo valor
    expect(pn0).toBeCloseTo(p0, 10);
  });

  it('Pn_MM1K(n > K) debe retornar 0', () => {
    const rho = 2 / 3;

    // Si n > K, la probabilidad es 0
    // (no puede haber más clientes que la capacidad)
    expect(calcPn_MM1K(rho, 5, 6)).toBe(0);
    expect(calcPn_MM1K(rho, 5, 100)).toBe(0);
  });

  it('L_MM1K → promedio de clientes en sistema con K=5', () => {
    const rho = 2 / 3;
    const resultado = calcL_MM1K(rho, 5);

    // Valor calculado con la fórmula completa:
    // L = ρ/(1-ρ) - (K+1)·ρ^(K+1) / (1-ρ^(K+1))
    //   = 2.0 - 6·(2/3)^6 / (1-(2/3)^6)
    //   ≈ 1.4226
    expect(resultado).toBeCloseTo(1.4226, 3);
  });

  it('λ efectiva = λ(1-Pk) → tasa real de entrada', () => {
    const rho = 2 / 3;
    const resultado = calcEffectiveLambda(2, rho, 5);

    // λe = 2 * (1 - Pk) donde Pk = P(n=5)
    expect(resultado).toBeGreaterThan(0);
    expect(resultado).toBeLessThanOrEqual(2);
  });

  it('λ perdida = λ * Pk → tasa de clientes rechazados', () => {
    const rho = 2 / 3;
    const resultado = calcLostLambda(2, rho, 5);

    // λp debe ser >= 0 y < λ
    expect(resultado).toBeGreaterThanOrEqual(0);
    expect(resultado).toBeLessThan(2);
  });

  it('λ efectiva + λ perdida = λ (principio de conservación)', () => {
    const rho = 2 / 3;
    const lambdaE = calcEffectiveLambda(2, rho, 5);
    const lambdaP = calcLostLambda(2, rho, 5);

    // La suma debe dar la λ original
    expect(lambdaE + lambdaP).toBeCloseTo(2.0, 10);
  });

  it('W_MM1K = L/λe → tiempo promedio en sistema', () => {
    const rho = 2 / 3;
    const L = calcL_MM1K(rho, 5);
    const lambdaE = calcEffectiveLambda(2, rho, 5);
    const resultado = calcW_MM1K(lambdaE, L);

    expect(resultado).toBeGreaterThan(0);
  });

  it('Wq_MM1K = W - 1/μ → tiempo promedio en cola', () => {
    const rho = 2 / 3;
    const L = calcL_MM1K(rho, 5);
    const lambdaE = calcEffectiveLambda(2, rho, 5);
    const W = calcW_MM1K(lambdaE, L);
    const resultado = calcWq_MM1K(W, 3);

    // Wq = W - 1/μ, debe ser ≥ 0
    expect(resultado).toBeGreaterThanOrEqual(0);
  });

  it('Lq_MM1K = λe * Wq → promedio de clientes en cola', () => {
    const rho = 2 / 3;
    const L = calcL_MM1K(rho, 5);
    const lambdaE = calcEffectiveLambda(2, rho, 5);
    const W = calcW_MM1K(lambdaE, L);
    const Wq = calcWq_MM1K(W, 3);
    const resultado = calcLq_MM1K(lambdaE, Wq);

    expect(resultado).toBeGreaterThanOrEqual(0);
  });
});

// ─── Tests de distribución M/M/1/K ───
describe('Modelo M/M/1/K — Distribución de probabilidad', () => {

  it('la suma de Pn(0..K) debe ser exactamente ≈ 1.0', () => {
    const rho = 2 / 3;
    const K = 5;
    let suma = 0;

    for (let n = 0; n <= K; n++) {
      suma += calcPn_MM1K(rho, K, n);
    }

    // En M/M/1/K, la suma de TODAS las probabilidades es exactamente 1
    // (a diferencia de M/M/1 donde solo podemos aproximar)
    expect(suma).toBeCloseTo(1.0, 10);
  });

  it('la suma de Pn(0..K) debe ser ≈ 1.0 con ρ > 1 (λ=3, μ=2, K=3)', () => {
    // ¡En M/M/1/K el sistema PUEDE funcionar con ρ > 1!
    const rho = 3 / 2; // ρ = 1.5
    const K = 3;
    let suma = 0;

    for (let n = 0; n <= K; n++) {
      suma += calcPn_MM1K(rho, K, n);
    }

    expect(suma).toBeCloseTo(1.0, 10);
  });

  it('Pn decrece monótonamente cuando ρ < 1', () => {
    const rho = 0.5;
    const K = 5;

    for (let n = 0; n < K; n++) {
      const pnActual = calcPn_MM1K(rho, K, n);
      const pnSiguiente = calcPn_MM1K(rho, K, n + 1);

      // Con ρ < 1, cada P(n+1) debe ser menor que P(n)
      expect(pnSiguiente).toBeLessThan(pnActual);
    }
  });
});

// ╔══════════════════════════════════════════════════════════╗
// ║           CASO ESPECIAL: ρ = 1 en M/M/1/K              ║
// ╚══════════════════════════════════════════════════════════╝

describe('M/M/1/K — Caso especial ρ=1 (λ=μ)', () => {

  // Cuando ρ=1, todas las probabilidades son iguales: 1/(K+1)
  it('P0 = 1/(K+1) cuando ρ = 1', () => {
    const resultado = calcP0_MM1K(1, 4);

    // P0 = 1/(4+1) = 0.2
    expect(resultado).toBeCloseTo(0.2, 10);
  });

  it('todas las Pn son iguales = 1/(K+1) cuando ρ = 1', () => {
    const K = 4;
    const valorEsperado = 1 / (K + 1); // 0.2

    for (let n = 0; n <= K; n++) {
      expect(calcPn_MM1K(1, K, n)).toBeCloseTo(valorEsperado, 10);
    }
  });

  it('L = K/2 cuando ρ = 1', () => {
    const resultado = calcL_MM1K(1, 4);

    // L = 4/2 = 2
    expect(resultado).toBeCloseTo(2.0, 10);
  });

  it('la suma de Pn sigue siendo 1.0 cuando ρ = 1', () => {
    const K = 4;
    let suma = 0;

    for (let n = 0; n <= K; n++) {
      suma += calcPn_MM1K(1, K, n);
    }

    expect(suma).toBeCloseTo(1.0, 10);
  });
});

// ╔══════════════════════════════════════════════════════════╗
// ║               EDGE CASES (Casos límite)                 ║
// ╚══════════════════════════════════════════════════════════╝

describe('Edge Cases — Valores extremos y errores', () => {

  it('calcRho con μ=0 retorna Infinity (división por cero)', () => {
    // λ/0 = Infinity en JavaScript
    const resultado = calcRho(2, 0);
    expect(resultado).toBe(Infinity);
  });

  it('calcPn con n=0 da P0 (caso base)', () => {
    const rho = 0.5;
    const pn0 = calcPn(rho, 0);
    const p0 = calcP0(rho);

    // Pn(0) debe ser igual a P0
    expect(pn0).toBeCloseTo(p0, 10);
  });

  it('calcPn_MM1K con n > K retorna 0', () => {
    // No puede haber más clientes que la capacidad K
    expect(calcPn_MM1K(0.5, 5, 6)).toBe(0);
    expect(calcPn_MM1K(0.5, 5, 100)).toBe(0);
    expect(calcPn_MM1K(0.5, 5, 999)).toBe(0);
  });

  it('calcP0_MM1K con K=1 → sistema binario', () => {
    // Con K=1: solo puede haber 0 o 1 cliente
    const rho = 0.5;
    const p0 = calcP0_MM1K(rho, 1);
    const p1 = calcPn_MM1K(rho, 1, 1);

    // P0 + P1 = 1
    expect(p0 + p1).toBeCloseTo(1.0, 10);
  });

  it('con ρ muy pequeño (0.01), P0 es ≈ 0.99', () => {
    const rho = 0.01;
    const p0 = calcP0(rho);

    // P0 = 1 - 0.01 = 0.99
    expect(p0).toBeCloseTo(0.99, 4);
  });

  it('con ρ muy alto (0.99), L es muy grande', () => {
    const resultado = calcL(0.99, 1);

    // L = 0.99 / (1 - 0.99) = 99
    expect(resultado).toBeCloseTo(99, 0);
  });

  it('relación de Little: L = λ * W', () => {
    // La Ley de Little es una propiedad fundamental de teoría de colas
    const lambda = 2;
    const mu = 3;

    const L = calcL(lambda, mu);
    const W = calcW(lambda, mu);

    // L debe ser igual a λ * W
    expect(L).toBeCloseTo(lambda * W, 10);
  });

  it('relación de Little en cola: Lq = λ * Wq', () => {
    const lambda = 2;
    const mu = 3;

    const Lq = calcLq(lambda, mu);
    const Wq = calcWq(lambda, mu);

    // Lq debe ser igual a λ * Wq
    expect(Lq).toBeCloseTo(lambda * Wq, 10);
  });
});
