/**
 * Formulas for M/M/1 and M/M/1/K Queuing Models
 */

// --- M/M/1 Model ---
export const calcRho = (lambda: number, mu: number): number => lambda / mu;

export const calcP0 = (rho: number): number => 1 - rho;

export const calcL = (lambda: number, mu: number): number => lambda / (mu - lambda);

export const calcLq = (lambda: number, mu: number): number => Math.pow(lambda, 2) / (mu * (mu - lambda));

export const calcW = (lambda: number, mu: number): number => 1 / (mu - lambda);

export const calcWq = (lambda: number, mu: number): number => lambda / (mu * (mu - lambda));

export const calcPn = (rho: number, n: number): number => (1 - rho) * Math.pow(rho, n);


// --- M/M/1/K Model ---
export const calcP0_MM1K = (rho: number, k: number): number => {
  if (rho === 1) return 1 / (k + 1);
  return (1 - rho) / (1 - Math.pow(rho, k + 1));
};

export const calcPn_MM1K = (rho: number, k: number, n: number): number => {
  if (n > k) return 0;
  if (rho === 1) return 1 / (k + 1);
  return Math.pow(rho, n) * ((1 - rho) / (1 - Math.pow(rho, k + 1)));
};

export const calcL_MM1K = (rho: number, k: number): number => {
  if (rho === 1) return k / 2;
  const partLeft = rho / (1 - rho);
  const partRight = ((k + 1) * Math.pow(rho, k + 1)) / (1 - Math.pow(rho, k + 1));
  return partLeft - partRight;
};

export const calcEffectiveLambda = (lambda: number, rho: number, k: number): number => {
  const pk = calcPn_MM1K(rho, k, k);
  return lambda * (1 - pk);
};

export const calcLostLambda = (lambda: number, rho: number, k: number): number => {
  const pk = calcPn_MM1K(rho, k, k);
  return lambda * pk;
};

export const calcW_MM1K = (lambdaE: number, l: number): number => {
  return l / lambdaE;
};

export const calcWq_MM1K = (w: number, mu: number): number => {
  return w - (1 / mu);
};

export const calcLq_MM1K = (lambdaE: number, wq: number): number => {
  return lambdaE * wq;
};
// --- Helper ---
const factorial = (n: number): number => {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
};

// --- M/M/c Model ---
export const calcRho_MMC = (lambda: number, mu: number, c: number): number => {
  return lambda / (c * mu);
};

export const calcP0_MMC = (lambda: number, mu: number, c: number): number => {
  const rho = lambda / (c * mu);
  const ratio = lambda / mu;
  let sum = 0;
  for (let n = 0; n < c; n++) {
    sum += Math.pow(ratio, n) / factorial(n);
  }
  const lastPart = (Math.pow(ratio, c) / (factorial(c) * (1 - rho)));
  return 1 / (sum + lastPart);
};

export const calcLq_MMC = (lambda: number, mu: number, c: number, p0: number): number => {
  const rho = lambda / (c * mu);
  const ratio = lambda / mu;
  const numerator = p0 * Math.pow(ratio, c) * rho;
  const denominator = factorial(c) * Math.pow(1 - rho, 2);
  return numerator / denominator;
};

export const calcL_MMC = (lambda: number, mu: number, lq: number): number => {
  return lq + (lambda / mu);
};

export const calcWq_MMC = (lambda: number, lq: number): number => {
  return lq / lambda;
};

export const calcW_MMC = (mu: number, wq: number): number => {
  return wq + (1 / mu);
};

export const calcPw_MMC = (lambda: number, mu: number, c: number, p0: number): number => {
  const ratio = lambda / mu;
  const rho = lambda / (c * mu);
  return (Math.pow(ratio, c) / (factorial(c) * (1 - rho))) * p0;
};

export const calcPn_MMC = (lambda: number, mu: number, c: number, n: number, p0: number): number => {
  const ratio = lambda / mu;
  if (n <= c) {
    return (Math.pow(ratio, n) / factorial(n)) * p0;
  } else {
    return (Math.pow(ratio, n) / (factorial(c) * Math.pow(c, n - c))) * p0;
  }
};

// --- M/M/c/N Model (Multiserver with finite capacity N) ---

export const calcP0_MMCN = (lambda: number, mu: number, c: number, N: number): number => {
  const ratio = lambda / mu;
  const rho = lambda / (c * mu);

  let sum = 0;
  // Sum from n=0 to c-1: (lambda/mu)^n / n!
  for (let n = 0; n < c; n++) {
    sum += Math.pow(ratio, n) / factorial(n);
  }

  // Sum from n=c to N: (lambda/mu)^n / (c! * c^(n-c))
  if (rho === 1) {
    // Special case: rho = 1
    sum += (Math.pow(ratio, c) / factorial(c)) * (N - c + 1);
  } else {
    const base = Math.pow(ratio, c) / factorial(c);
    const geoSum = (1 - Math.pow(rho, N - c + 1)) / (1 - rho);
    sum += base * geoSum;
  }

  return 1 / sum;
};

export const calcPn_MMCN = (lambda: number, mu: number, c: number, N: number, n: number, p0: number): number => {
  if (n > N) return 0;
  const ratio = lambda / mu;
  if (n <= c) {
    return (Math.pow(ratio, n) / factorial(n)) * p0;
  } else {
    return (Math.pow(ratio, n) / (factorial(c) * Math.pow(c, n - c))) * p0;
  }
};

export const calcLq_MMCN = (lambda: number, mu: number, c: number, N: number, p0: number): number => {
  const ratio = lambda / mu;
  const rho = lambda / (c * mu);

  if (rho === 1) {
    // Special case: Lq = P0 * (ratio^c / c!) * (N-c)(N-c+1)/2
    const base = p0 * Math.pow(ratio, c) / factorial(c);
    return base * (N - c) * (N - c + 1) / 2;
  }

  const base = (p0 * Math.pow(ratio, c) * rho) / (factorial(c) * Math.pow(1 - rho, 2));
  const bracket = 1 - Math.pow(rho, N - c) - (N - c) * Math.pow(rho, N - c) * (1 - rho);
  return base * bracket;
};

export const calcL_MMCN = (lambda: number, mu: number, c: number, N: number, p0: number): number => {
  const lq = calcLq_MMCN(lambda, mu, c, N, p0);
  const pN = calcPn_MMCN(lambda, mu, c, N, N, p0);
  const lambdaE = lambda * (1 - pN);
  return lq + lambdaE / mu;
};

export const calcLambdaE_MMCN = (lambda: number, mu: number, c: number, N: number, p0: number): number => {
  const pN = calcPn_MMCN(lambda, mu, c, N, N, p0);
  return lambda * (1 - pN);
};

export const calcLambdaLost_MMCN = (lambda: number, mu: number, c: number, N: number, p0: number): number => {
  const pN = calcPn_MMCN(lambda, mu, c, N, N, p0);
  return lambda * pN;
};

export const calcW_MMCN = (l: number, lambdaE: number): number => {
  if (lambdaE <= 0) return 0;
  return l / lambdaE;
};

export const calcWq_MMCN = (w: number, mu: number): number => {
  return w - (1 / mu);
};

