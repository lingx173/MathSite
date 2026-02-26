/* ── Domain ─────────────────────────────────────────────────── */
export type Domain = "mathcounts" | "amc8" | "amc10";

export const DOMAINS: { value: Domain; label: string; disabled?: boolean }[] = [
  { value: "mathcounts", label: "MathCounts" },
  { value: "amc8", label: "AMC 8", disabled: true },
  { value: "amc10", label: "AMC 10", disabled: true },
];

/* ── Topic ──────────────────────────────────────────────────── */
export type Topic =
  | "algebra"
  | "geometry"
  | "number-theory"
  | "counting-probability"
  | "mixed";

export const TOPICS: { value: Topic; label: string }[] = [
  { value: "algebra", label: "Algebra" },
  { value: "geometry", label: "Geometry" },
  { value: "number-theory", label: "Number Theory" },
  { value: "counting-probability", label: "Counting & Probability" },
  { value: "mixed", label: "Mixed" },
];

/* ── Subtopic ───────────────────────────────────────────────── */
export const SUBTOPICS: Record<Exclude<Topic, "mixed">, string[]> = {
  algebra: [
    "Expressions",
    "Linear Equations",
    "Systems of Equations",
    "Inequalities",
    "Exponents",
    "Polynomials",
    "Quadratics",
    "Functions",
    "Ratios & Percents",
    "Sequences & Patterns",
  ],
  geometry: [
    "Angles",
    "Triangles",
    "Similarity",
    "Circles",
    "Coordinate Geometry",
    "Area",
    "Surface Area & Volume",
    "Transformations",
  ],
  "number-theory": [
    "Factors & Multiples",
    "GCD & LCM",
    "Divisibility",
    "Remainders",
    "Modular Arithmetic",
    "Integers",
    "Fractions & Decimals",
    "Number Bases",
  ],
  "counting-probability": [
    "Basic Counting",
    "Permutations",
    "Combinations",
    "Probability",
    "Expected Value",
    "Venn Diagrams",
    "Pascal's Triangle",
  ],
};

/* ── Mode & Difficulty ──────────────────────────────────────── */
export type Mode = "rag" | "simulated";

export type Difficulty = "mixed" | "easy" | "medium" | "hard";

export const DIFFICULTIES: { value: Difficulty; label: string; desc?: string }[] = [
  { value: "mixed", label: "Mixed" },
  { value: "easy", label: "Easy", desc: "1-3" },
  { value: "medium", label: "Medium", desc: "4-6" },
  { value: "hard", label: "Hard", desc: "7-10" },
];

/* ── API Request ────────────────────────────────────────────── */
export interface PracticeRequest {
  domain: Domain;
  topic: Topic;
  subtopic?: string;
  mode: Mode;
  count: number;
  difficulty: Difficulty;
  includeSolutions: boolean;
}

/* ── API Response ───────────────────────────────────────────── */
export interface QuestionSource {
  year?: number;
  round?: string;
  problemNumber?: string;
}

export interface Question {
  qid: string;
  prompt: string;
  answer: string;
  answerFormat?: string;
  solution: string;
  hint?: string;
  difficulty: number;
  topic?: string;
  source?: QuestionSource;
}

export interface PracticeSetMeta {
  domain: string;
  topic: string;
  subtopic?: string;
  mode: Mode;
  generatedAt: string;
}

export interface PracticeSet {
  meta: PracticeSetMeta;
  questions: Question[];
}

/* ── Per-question UI state ──────────────────────────────────── */
export interface QuestionUIState {
  userAnswer: string;
  isCorrect: boolean | null;
  showSolution: boolean;
  showHint: boolean;
  /** Hint text from /api/hint when question has no built-in hint */
  derivedHint?: string | null;
  /** True while fetching hint from /api/hint */
  hintLoading?: boolean;
}
