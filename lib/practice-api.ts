import type {
  PracticeRequest,
  PracticeSet,
  Question,
  Topic,
  Domain,
  Mode,
  Difficulty,
} from "./practice-types";

/* ── Stub data ──────────────────────────────────────────────── */

const STUB_QUESTIONS: Omit<Question, "qid" | "difficulty" | "topic">[] = [
  {
    prompt: "If 3x + 7 = 22, what is the value of x?",
    answer: "5",
    hint: "Isolate x by first subtracting 7 from both sides.",
    solution: "3x + 7 = 22 → 3x = 15 → x = 5.",
    source: { year: 2019, round: "School Sprint", problemNumber: "4" },
  },
  {
    prompt:
      "What is the area, in square units, of a triangle with vertices at (0, 0), (6, 0), and (3, 4)?",
    answer: "12",
    hint: "Use the formula: Area = (1/2) x base x height.",
    solution:
      "Base = 6 (along the x-axis). Height = 4 (perpendicular distance from (3,4) to the x-axis). Area = (1/2)(6)(4) = 12.",
    source: { year: 2020, round: "Chapter Sprint", problemNumber: "12" },
  },
  {
    prompt: "How many positive factors does 72 have?",
    answer: "12",
    hint: "Start by finding the prime factorization of 72.",
    solution: "72 = 2^3 x 3^2. Number of factors = (3+1)(2+1) = 12.",
    source: { year: 2018, round: "State Sprint", problemNumber: "8" },
  },
  {
    prompt:
      "A bag contains 3 red marbles, 5 blue marbles, and 2 green marbles. What is the probability of drawing a blue marble?",
    answer: "1/2",
    hint: "Probability = favorable outcomes / total outcomes.",
    solution: "Total marbles = 3 + 5 + 2 = 10. P(blue) = 5/10 = 1/2.",
    source: { year: 2021, round: "School Sprint", problemNumber: "6" },
  },
  {
    prompt: "Simplify: (2^3)(2^5).",
    answer: "256",
    hint: "When multiplying powers with the same base, add the exponents.",
    solution: "(2^3)(2^5) = 2^(3+5) = 2^8 = 256.",
  },
  {
    prompt:
      "A rectangle has a perimeter of 30 cm and a length that is twice its width. What is its area in square centimeters?",
    answer: "50",
    hint: "Let width = w, then length = 2w. Use the perimeter formula.",
    solution:
      "2(2w + w) = 30 → 6w = 30 → w = 5. Length = 10. Area = 10 x 5 = 50.",
    source: { year: 2022, round: "School Target", problemNumber: "2" },
  },
  {
    prompt: "What is the least common multiple of 12 and 18?",
    answer: "36",
    hint: "Find the prime factorizations and take the highest power of each prime.",
    solution: "12 = 2^2 x 3, 18 = 2 x 3^2. LCM = 2^2 x 3^2 = 36.",
  },
  {
    prompt: "In how many ways can 5 different books be arranged on a shelf?",
    answer: "120",
    hint: "This is a permutation of 5 distinct objects.",
    solution: "5! = 5 x 4 x 3 x 2 x 1 = 120.",
    source: { year: 2020, round: "State Sprint", problemNumber: "15" },
  },
  {
    prompt: "If f(x) = 2x^2 - 3x + 1, what is f(3)?",
    answer: "10",
    hint: "Substitute x = 3 into the expression.",
    solution: "f(3) = 2(9) - 3(3) + 1 = 18 - 9 + 1 = 10.",
  },
  {
    prompt:
      "The measures of the angles of a triangle are in the ratio 2:3:4. What is the degree measure of the largest angle?",
    answer: "80",
    hint: "The sum of angles in a triangle is 180 degrees.",
    solution:
      "Let the angles be 2x, 3x, 4x. 2x + 3x + 4x = 180 → 9x = 180 → x = 20. Largest = 4(20) = 80.",
    source: { year: 2019, round: "Chapter Target", problemNumber: "4" },
  },
];

const DIFF_MAP: Record<string, number[]> = {
  easy: [1, 2, 3],
  medium: [4, 5, 6],
  hard: [7, 8, 9, 10],
};

const TOPIC_CYCLE: Exclude<Topic, "mixed">[] = [
  "algebra",
  "geometry",
  "number-theory",
  "counting-probability",
];

function randomDifficulty(difficulty: Difficulty, index: number): number {
  if (difficulty === "mixed") {
    const pool = [...DIFF_MAP.easy, ...DIFF_MAP.medium, ...DIFF_MAP.hard];
    return pool[index % pool.length];
  }
  const pool = DIFF_MAP[difficulty];
  return pool[index % pool.length];
}

/**
 * Fetch a practice set from the API.
 * Currently stubbed with a simulated delay and sample data.
 * Replace the body with a real fetch("/api/practice", ...) call when the backend is ready.
 */
export async function generateSet(
  domain: Domain,
  topic: Topic,
  subtopic: string | undefined,
  mode: Mode,
  difficulty: Difficulty
): Promise<PracticeSet> {
  const payload: PracticeRequest = {
    domain,
    topic,
    subtopic: subtopic || undefined,
    mode,
    count: 10,
    difficulty,
    includeSolutions: true,
  };

  // ── Stub: simulate network latency ──────────────────────────
  // Replace this block with:
  //   const res = await fetch("/api/practice", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(payload),
  //   });
  //   if (!res.ok) throw new Error("Failed to generate questions");
  //   return res.json() as Promise<PracticeSet>;

  await new Promise((r) => setTimeout(r, 1200));

  void payload; // consumed by the real fetch

  const questions: Question[] = STUB_QUESTIONS.map((q, i) => ({
    ...q,
    qid: `q-${Date.now()}-${i}`,
    difficulty: randomDifficulty(difficulty, i),
    topic:
      topic === "mixed"
        ? TOPIC_CYCLE[i % TOPIC_CYCLE.length]
        : topic,
  }));

  return {
    meta: {
      domain,
      topic,
      subtopic: subtopic || undefined,
      mode,
      generatedAt: new Date().toISOString(),
    },
    questions,
  };
}
