// ── Domain & topic (display-style) ─────────────────────────────
export type Domain = "mathcounts" | "amc8" | "amc10";

export type TopicPrimary =
  | "Algebra"
  | "Geometry"
  | "Number Theory"
  | "Counting & Probability"
  | "Mixed";

export type DifficultyLevel = "mixed" | "easy" | "medium" | "hard";

export type PracticeMode = "real" | "simulated";

// ── Request ───────────────────────────────────────────────────
export interface PracticeRequest {
  domain: Domain;
  topic: TopicPrimary;
  subtopic?: string;
  mode: PracticeMode;
  difficulty: DifficultyLevel;
  count: number;
  includeSolutions: boolean;
}

// ── Question source & response ─────────────────────────────────
export interface QuestionSourceMeta {
  year?: number;
  round?: string;
  problemNumber?: string;
}

export interface PracticeQuestion {
  qid: string;
  prompt: string;
  answer: string;
  answerFormat?: string;
  solution: string;
  difficulty: number;
  topic?: string;
  source?: QuestionSourceMeta;
}

export interface PracticeResponse {
  meta: {
    domain: Domain;
    topic: TopicPrimary;
    subtopic?: string;
    mode: PracticeMode;
    generatedAt: string;
  };
  questions: PracticeQuestion[];
}
