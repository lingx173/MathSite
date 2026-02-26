/**
 * Normalize answer string: trim and collapse consecutive spaces to one.
 */
export function normalizeAnswer(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}

const FRACTION_REGEX = /^(-?\d+)\s*\/\s*(-?\d+)$/;
const DECIMAL_TOLERANCE = 1e-6;
const MULTIPLE_CHOICE_LETTERS = /^[A-D]$/i;

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

/** Parse "num/den", return [num, den] in reduced form or null. */
function parseFraction(s: string): [number, number] | null {
  const m = s.match(FRACTION_REGEX);
  if (!m) return null;
  let num = parseInt(m[1], 10);
  let den = parseInt(m[2], 10);
  if (den === 0) return null;
  const g = gcd(num, den);
  num /= g;
  den /= g;
  if (den < 0) {
    num = -num;
    den = -den;
  }
  return [num, den];
}

function isNumeric(s: string): boolean {
  const n = parseFloat(s);
  return Number.isFinite(n) && s.trim() !== "";
}

function isMultipleChoiceLetter(s: string): boolean {
  return MULTIPLE_CHOICE_LETTERS.test(s.trim());
}

/**
 * Compare two answers with optional format hint.
 * - Trims and collapses spaces.
 * - Equivalent fractions: e.g. 2/4 === 1/2.
 * - Decimals compared with tolerance 1e-6 when both numeric.
 * - Multiple-choice A/B/C/D compared case-insensitively.
 * No external services; returns boolean only.
 */
export function isCorrect(
  user: string,
  expected: string,
  format?: string
): boolean {
  const u = normalizeAnswer(user);
  const e = normalizeAnswer(expected);

  if (u === e) return true;

  const isChoice =
    format === "multiple-choice" ||
    (isMultipleChoiceLetter(u) && isMultipleChoiceLetter(e));
  if (isChoice) {
    return u.toUpperCase().trim() === e.toUpperCase().trim();
  }

  const fracU = parseFraction(u);
  const fracE = parseFraction(e);
  if (fracU && fracE) {
    return fracU[0] === fracE[0] && fracU[1] === fracE[1];
  }

  // One fraction, one numeric: compare as numbers (e.g. 0.5 and 1/2) — before both-numeric so "1/2" isn't parsed as 1
  if (fracU && isNumeric(e)) {
    const val = fracU[0] / fracU[1];
    return Math.abs(val - parseFloat(e)) < DECIMAL_TOLERANCE;
  }
  if (fracE && isNumeric(u)) {
    const val = fracE[0] / fracE[1];
    return Math.abs(val - parseFloat(u)) < DECIMAL_TOLERANCE;
  }

  if (isNumeric(u) && isNumeric(e)) {
    return Math.abs(parseFloat(u) - parseFloat(e)) < DECIMAL_TOLERANCE;
  }

  return false;
}
