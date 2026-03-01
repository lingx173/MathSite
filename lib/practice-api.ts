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

  const data = (await res.json()) as unknown;

  // n8n workflow shape: { topic, mode, problems: [{ id, question, answer, explanation }] }
  if (
    data &&
    typeof data === "object" &&
    "problems" in data &&
    Array.isArray((data as { problems: unknown }).problems)
  ) {
    const n8n = data as {
      topic?: string;
      mode?: string;
      problems: Array<{
        id?: number;
        question: string;
        answer: string;
        explanation?: string;
      }>;
    };
    const topicStr = n8n.topic ?? "Mixed";
    const modeStr = n8n.mode ?? "simulated";
    const frontendMode: Mode =
      modeStr === "real" ? "rag" : modeStr === "mock" ? "simulated" : "simulated";

    const questions: Question[] = (n8n.problems ?? []).map((p, i) => ({
      qid: `q-${p.id ?? i + 1}`,
      prompt: p.question ?? "",
      answer: String(p.answer ?? ""),
      solution: p.explanation ?? "",
      hint: undefined,
      difficulty: Math.min(10, Math.max(1, i + 1)),
      topic: topicStr,
    }));

    return {
      meta: {
        domain: "mathcounts",
        topic: topicStr,
        mode: frontendMode,
        generatedAt: new Date().toISOString(),
      },
      questions,
    };
  }

  // Standard shape: { meta, questions }
  const standard = data as {
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

  const questions: Question[] = (standard.questions ?? []).map((q) => ({
    qid: q.qid ?? `q-${Date.now()}`,
    prompt: q.prompt ?? "",
    answer: q.answer ?? "",
    answerFormat: q.answerFormat,
    solution: q.solution ?? "",
    hint: q.hint,
    difficulty: q.difficulty ?? 5,
    topic: q.topic,
    source: q.source,
  }));

  const frontendMode: Mode =
    standard.meta?.mode === "real" ? "rag" : "simulated";

  return {
    meta: {
      domain: standard.meta?.domain ?? "mathcounts",
      topic: standard.meta?.topic ?? "Mixed",
      subtopic: standard.meta?.subtopic,
      mode: frontendMode,
      generatedAt: standard.meta?.generatedAt ?? new Date().toISOString(),
    },
    questions,
  };
}
