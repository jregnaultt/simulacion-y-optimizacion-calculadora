/**
 * Simulación de Monte Carlo – Lógica de simulación
 * Variables discretas (transformación inversa) y variables continuas.
 */

// ── Types ──────────────────────────────────────────────

export interface DiscreteRow {
  value: number;
  probability: number;
}

export interface SimulationIteration {
  index: number;
  random: number;
  value: number;
}

export interface HistogramBin {
  label: string;
  count: number;
  frequency: number;
}

export interface ConvergencePoint {
  n: number;
  mean: number;
  stdDev: number;
  error: number;
}

export interface SimulationResult {
  iterations: SimulationIteration[];
  mean: number;
  stdDev: number;
  standardError: number;
  min: number;
  max: number;
  confidenceInterval95: [number, number];
  histogram: HistogramBin[];
  convergence: ConvergencePoint[];
}

// ── Stats helpers ──────────────────────────────────────

export const calcMean = (values: number[]): number =>
  values.reduce((a, b) => a + b, 0) / values.length;

export const calcStdDev = (values: number[], mean: number): number => {
  if (values.length < 2) return 0;
  const variance =
    values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
};

// ── Convergence ────────────────────────────────────────

const CONVERGENCE_TARGETS = [
  10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000,
];

const buildConvergence = (values: number[]): ConvergencePoint[] => {
  const n = values.length;
  const targets = CONVERGENCE_TARGETS.filter((t) => t <= n);
  if (!targets.includes(n)) targets.push(n);

  const points: ConvergencePoint[] = [];
  let runSum = 0;
  let runSumSq = 0;
  let tIdx = 0;

  for (let i = 0; i < n && tIdx < targets.length; i++) {
    runSum += values[i];
    runSumSq += values[i] ** 2;
    const count = i + 1;

    if (count === targets[tIdx]) {
      const mean = runSum / count;
      const variance =
        count > 1 ? (runSumSq - runSum ** 2 / count) / (count - 1) : 0;
      const stdDev = Math.sqrt(Math.max(0, variance));
      const error = stdDev / Math.sqrt(count);
      points.push({ n: count, mean, stdDev, error });
      tIdx++;
    }
  }

  return points;
};

// ── Discrete: Inverse Transform Method ─────────────────

export const buildCumulativeDistribution = (
  rows: DiscreteRow[],
): { value: number; cumProb: number }[] => {
  let cum = 0;
  return rows.map((r) => {
    cum += r.probability;
    return { value: r.value, cumProb: cum };
  });
};

const discreteLookup = (
  cumDist: { value: number; cumProb: number }[],
  r: number,
): number => {
  for (const entry of cumDist) {
    if (r < entry.cumProb) return entry.value;
  }
  return cumDist[cumDist.length - 1].value;
};

export const runDiscreteSimulation = (
  rows: DiscreteRow[],
  numIterations: number,
): SimulationResult => {
  const cumDist = buildCumulativeDistribution(rows);
  const iterations: SimulationIteration[] = [];
  const values: number[] = [];
  let min = Infinity;
  let max = -Infinity;

  for (let i = 0; i < numIterations; i++) {
    const r = Math.random();
    const value = discreteLookup(cumDist, r);
    iterations.push({ index: i + 1, random: r, value });
    values.push(value);
    if (value < min) min = value;
    if (value > max) max = value;
  }

  const mean = calcMean(values);
  const stdDev = calcStdDev(values, mean);
  const se = stdDev / Math.sqrt(values.length);
  const ci: [number, number] = [mean - 1.96 * se, mean + 1.96 * se];

  const countMap = new Map<number, number>();
  for (const v of values) countMap.set(v, (countMap.get(v) || 0) + 1);

  const histogram: HistogramBin[] = rows.map((row) => ({
    label: String(row.value),
    count: countMap.get(row.value) || 0,
    frequency: (countMap.get(row.value) || 0) / values.length,
  }));

  return {
    iterations,
    mean,
    stdDev,
    standardError: se,
    min,
    max,
    confidenceInterval95: ci,
    histogram,
    convergence: buildConvergence(values),
  };
};

// ── Theoretical Stats (Discrete) ───────────────────────

export interface TheoreticalStats {
  mean: number;
  stdDev: number;
}

export const getTheoreticalStatsDiscrete = (
  rows: DiscreteRow[],
): TheoreticalStats => {
  const mean = rows.reduce((s, r) => s + r.value * r.probability, 0);
  const variance = rows.reduce(
    (s, r) => s + r.probability * (r.value - mean) ** 2,
    0,
  );
  return { mean, stdDev: Math.sqrt(variance) };
};

// ── Poisson Distribution ───────────────────────────────

/** P(X = k) = (λ^k · e^-λ) / k! */
export const poissonPMF = (lambda: number, k: number): number => {
  // Use log to avoid overflow for large k
  let logP = -lambda;
  for (let i = 1; i <= k; i++) {
    logP += Math.log(lambda) - Math.log(i);
  }
  return Math.exp(logP);
};

/** Generate the PMF table until cumulative probability ≥ 0.9999 */
export const generatePoissonDistribution = (lambda: number): DiscreteRow[] => {
  const rows: DiscreteRow[] = [];
  let cumulative = 0;
  const maxK = Math.max(100, Math.ceil(lambda + 10 * Math.sqrt(lambda)));

  for (let k = 0; k <= maxK; k++) {
    const p = poissonPMF(lambda, k);
    if (p < 1e-10 && cumulative > 0.9999) break;
    rows.push({ value: k, probability: p });
    cumulative += p;
  }

  return rows;
};

export const getTheoreticalStatsPoisson = (
  lambda: number,
): TheoreticalStats => ({
  mean: lambda,
  stdDev: Math.sqrt(lambda),
});

// ── Multivariable Simulation (n × k matrix) ────────────

export interface MultiVariableColumnStats {
  mean: number;
  stdDev: number;
}

export interface MultiVariableResult {
  /** n rows × k columns matrix of simulated values */
  matrix: number[][];
  /** Per-column statistics (x̄ and s) */
  columnStats: MultiVariableColumnStats[];
  /** Number of iterations (rows) */
  n: number;
  /** Number of variables (columns) */
  k: number;
}

/**
 * Run a multivariable discrete simulation producing an n×k matrix.
 * Each column is an independent sequence generated via the inverse
 * transform method on the given discrete distribution (e.g. Poisson).
 *
 * Column stats use the **sample** standard deviation (dividing by n−1).
 */
export const runMultivariableDiscreteSimulation = (
  rows: DiscreteRow[],
  n: number,
  k: number,
): MultiVariableResult => {
  const cumDist = buildCumulativeDistribution(rows);

  // Build n × k matrix
  const matrix: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j < k; j++) {
      const r = Math.random();
      row.push(discreteLookup(cumDist, r));
    }
    matrix.push(row);
  }

  // Per-column statistics
  const columnStats: MultiVariableColumnStats[] = [];
  for (let j = 0; j < k; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += matrix[i][j];
    const mean = sum / n;

    let sumSqDiff = 0;
    for (let i = 0; i < n; i++) sumSqDiff += (matrix[i][j] - mean) ** 2;
    const stdDev = n > 1 ? Math.sqrt(sumSqDiff / (n - 1)) : 0;

    columnStats.push({ mean, stdDev });
  }

  return { matrix, columnStats, n, k };
};

// ── Continuous Distributions ───────────────────────────

export type ContinuousDistType =
  | "uniform"
  | "exponential"
  | "normal"
  | "lognormal"
  | "weibull";

/** Box-Muller transform */
const boxMullerNormal = (mu: number, sigma: number): number => {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mu + sigma * z;
};

export const generateContinuousValue = (
  type: ContinuousDistType,
  params: Record<string, number>,
): number => {
  const r = Math.random();
  switch (type) {
    case "uniform":
      return params.a + (params.b - params.a) * r;
    case "exponential":
      return -Math.log(r) * params.media;
    case "normal":
      return boxMullerNormal(params.media, params.desvEst);
    case "lognormal":
      return Math.exp(boxMullerNormal(params.media, params.desvEst));
    case "weibull":
      return params.escala * Math.pow(-Math.log(r), 1 / params.forma);
  }
};

export const runContinuousSimulation = (
  type: ContinuousDistType,
  params: Record<string, number>,
  numIterations: number,
): SimulationResult => {
  const iterations: SimulationIteration[] = [];
  const values: number[] = [];
  let min = Infinity;
  let max = -Infinity;

  for (let i = 0; i < numIterations; i++) {
    const value = generateContinuousValue(type, params);
    iterations.push({ index: i + 1, random: 0, value });
    values.push(value);
    if (value < min) min = value;
    if (value > max) max = value;
  }

  const mean = calcMean(values);
  const stdDev = calcStdDev(values, mean);
  const se = stdDev / Math.sqrt(values.length);
  const ci: [number, number] = [mean - 1.96 * se, mean + 1.96 * se];

  // Histogram: equal-width bins
  const numBins = Math.min(
    20,
    Math.max(5, Math.ceil(Math.sqrt(numIterations))),
  );
  const range = max - min || 1;
  const binWidth = range / numBins;

  const binCounts = new Array<number>(numBins).fill(0);
  for (const v of values) {
    let idx = Math.floor((v - min) / binWidth);
    if (idx >= numBins) idx = numBins - 1;
    if (idx < 0) idx = 0;
    binCounts[idx]++;
  }

  const histogram: HistogramBin[] = binCounts.map((count, i) => ({
    label: (min + i * binWidth).toFixed(2),
    count,
    frequency: count / values.length,
  }));

  return {
    iterations,
    mean,
    stdDev,
    standardError: se,
    min,
    max,
    confidenceInterval95: ci,
    histogram,
    convergence: buildConvergence(values),
  };
};

// ── Multivariable Continuous Simulation (n × k matrix) ──

/**
 * Run a multivariable continuous simulation producing an n×k matrix.
 * Each column is an independent sequence generated via the corresponding
 * continuous distribution generator.
 *
 * Column stats use the **sample** standard deviation (dividing by n−1).
 */
export const runMultivariableContinuousSimulation = (
  type: ContinuousDistType,
  params: Record<string, number>,
  n: number,
  k: number,
): MultiVariableResult => {
  // Build n × k matrix
  const matrix: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j < k; j++) {
      row.push(generateContinuousValue(type, params));
    }
    matrix.push(row);
  }

  // Per-column statistics
  const columnStats: MultiVariableColumnStats[] = [];
  for (let j = 0; j < k; j++) {
    let sum = 0;
    for (let i = 0; i < n; i++) sum += matrix[i][j];
    const mean = sum / n;

    let sumSqDiff = 0;
    for (let i = 0; i < n; i++) sumSqDiff += (matrix[i][j] - mean) ** 2;
    const stdDev = n > 1 ? Math.sqrt(sumSqDiff / (n - 1)) : 0;

    columnStats.push({ mean, stdDev });
  }

  return { matrix, columnStats, n, k };
};

// ── Theoretical Stats (Continuous) ─────────────────────

/** Lanczos approximation of the Gamma function */
const gammaLanczos = (z: number): number => {
  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gammaLanczos(1 - z));
  }
  z -= 1;
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  let x = c[0];
  for (let i = 1; i < g + 2; i++) {
    x += c[i] / (z + i);
  }
  const t = z + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
};

export const getTheoreticalStatsContinuous = (
  type: ContinuousDistType,
  params: Record<string, number>,
): TheoreticalStats => {
  switch (type) {
    case "normal":
      return { mean: params.media, stdDev: params.desvEst };
    case "exponential":
      return { mean: params.media, stdDev: params.media };
    case "uniform": {
      const a = params.a,
        b = params.b;
      return {
        mean: (a + b) / 2,
        stdDev: Math.sqrt((b - a) ** 2 / 12),
      };
    }
    case "lognormal": {
      const mu = params.media,
        s = params.desvEst;
      const mean = Math.exp(mu + (s ** 2) / 2);
      const variance = (Math.exp(s ** 2) - 1) * Math.exp(2 * mu + s ** 2);
      return { mean, stdDev: Math.sqrt(variance) };
    }
    case "weibull": {
      const b = params.escala,
        a = params.forma;
      const mean = b * gammaLanczos(1 + 1 / a);
      const variance =
        b ** 2 * (gammaLanczos(1 + 2 / a) - gammaLanczos(1 + 1 / a) ** 2);
      return { mean, stdDev: Math.sqrt(Math.max(0, variance)) };
    }
  }
};
