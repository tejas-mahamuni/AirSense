export function validateAQI(val: unknown): number | null {
  const n = Number(val);
  if (isNaN(n) || n < 0 || n > 500) return null;
  return Math.round(n);
}

export function validateTemp(val: unknown): number | null {
  const n = Number(val);
  if (isNaN(n) || n < -50 || n > 60) return null;
  return Math.round(n * 10) / 10;
}

export function validateHumidity(val: unknown): number | null {
  const n = Number(val);
  if (isNaN(n) || n < 0 || n > 100) return null;
  return Math.round(n);
}

export function validateWind(val: unknown): number | null {
  const n = Number(val);
  if (isNaN(n) || n < 0) return null;
  return Math.round(n * 10) / 10;
}

export function validatePollutant(val: unknown): number | null {
  const n = Number(val);
  if (isNaN(n) || n < 0) return null;
  return Math.round(n * 10) / 10;
}
