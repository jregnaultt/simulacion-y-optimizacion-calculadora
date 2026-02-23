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
