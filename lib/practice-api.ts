import type {
  PracticeSet,
  Question,
  Topic,
  Domain,
  Mode,
  Difficulty,
} from "./practice-types";

/** Map frontend topic to API TopicPrimary (display-style). */
const TOPIC_TO_API: Record<Topic, string> = {
  algebra: "Algebra",
  geometry: "Geometry",
  "number-theory": "Number Theory",
  "counting-probability": "Counting & Probability",
  mixed: "Mixed",
};

/** Map frontend mode to API PracticeMode. */
const MODE_TO_API: Record<Mode, "real" | "simulated"> = {
  rag: "real",
  simulated: "simulated",
};

/**
 * Build request body for /api/practice (matches API validation schema).
 */
function buildApiPayload(
  domain: Domain,
  topic: Topic,
  subtopic: string | undefined,
  mode: Mode,
  difficulty: Difficulty
): Record<string, unknown> {
  return {
    domain,
    topic: TOPIC_TO_API[topic],
    subtopic: subtopic || undefined,
    mode: MODE_TO_API[mode],
    difficulty,
    count: 10,
    includeSolutions: true,
  };
}

/**
 * Fetch a practice set from the n8n flow via /api/practice.
 * The API forwards to N8N_PRACTICE_WEBHOOK_URL or NEXT_PUBLIC_N8N_WEBHOOK_URL.
 */
export async function generateSet(
  domain: Domain,
  topic: Topic,
  subtopic: string | undefined,
  mode: Mode,
  difficulty: Difficulty
): Promise<PracticeSet> {
  const payload = buildApiPayload(domain, topic, subtopic, mode, difficulty);

  const res = await fetch("/api/practice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({})) as {
      error?: string;
      details?: string | Record<string, unknown>;
    };
    const message =
      typeof data.details === "string"
        ? data.details
        : data.error ?? "Failed to generate questions";
    throw new Error(message);
  }

  const data = (await res.json()) as {
    meta: { domain: string; topic: string; subtopic?: string; mode: string; generatedAt: string };
    questions: Array<{
      qid: string;
      prompt: string;
      answer: string;
      answerFormat?: string;
      solution: string;
      hint?: string;
      difficulty: number;
      topic?: string;
      source?: { year?: number; round?: string; problemNumber?: string };
    }>;
  };

  const questions: Question[] = data.questions.map((q) => ({
    qid: q.qid,
    prompt: q.prompt,
    answer: q.answer,
    answerFormat: q.answerFormat,
    solution: q.solution,
    hint: q.hint,
    difficulty: q.difficulty,
    topic: q.topic,
    source: q.source,
  }));

  const frontendMode: Mode = data.meta.mode === "real" ? "rag" : "simulated";

  return {
    meta: {
      domain: data.meta.domain,
      topic: data.meta.topic,
      subtopic: data.meta.subtopic,
      mode: frontendMode,
      generatedAt: data.meta.generatedAt,
    },
    questions,
  };
}
