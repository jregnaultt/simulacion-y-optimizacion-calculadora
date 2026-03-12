/**
 * Smart number formatting utility.
 *
 * Rules:
 * 1. If value is 0, NaN, or Infinity → show "0" / "—"
 * 2. If value.toFixed(decimals) would show all zeros but value ≠ 0 →
 *    extend decimals until the first significant digit appears, then show +1 extra
 * 3. Otherwise → normal toFixed(decimals)
 */
export function formatSmart(value: number, decimals: number): string {
  if (isNaN(value) || !isFinite(value)) return '—';
  if (value === 0) return (0).toFixed(decimals);

  const fixed = value.toFixed(decimals);

  // If toFixed gives all zeros after the decimal but value is not zero,
  // extend decimals until we find the first significant digit, then +1 extra.
  if (parseFloat(fixed) === 0) {
    // Find how many decimals we need to see the first significant digit
    const abs = Math.abs(value);
    // -log10 gives the number of leading zeros after decimal point
    // e.g. 0.000000009 → -log10(9e-9) ≈ 8.05 → need 9 decimals for first digit
    const leadingZeros = Math.floor(-Math.log10(abs));
    const neededDecimals = leadingZeros + 2; // +1 for the digit itself, +1 extra
    return value.toFixed(neededDecimals);
  }

  return fixed;
}
