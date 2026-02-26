import { z } from "zod";
import type { PracticeRequest } from "@/lib/types/practice";

const practiceRequestSchema = z
  .object({
    domain: z
      .enum(["mathcounts", "amc8", "amc10"])
      .default("mathcounts"),
    topic: z
      .enum([
        "Algebra",
        "Geometry",
        "Number Theory",
        "Counting & Probability",
        "Mixed",
      ])
      .default("Mixed"),
    subtopic: z.string().max(500).optional(),
    mode: z.enum(["real", "simulated"]).default("simulated"),
    difficulty: z
      .enum(["mixed", "easy", "medium", "hard"])
      .default("mixed"),
    count: z.number().int().min(1).max(20).default(10),
    includeSolutions: z.boolean().default(true),
  })
  .strict();

/**
 * Validates unknown body against PracticeRequest schema.
 * Applies defaults for domain, count, includeSolutions, topic, mode, difficulty.
 * @throws z.ZodError when validation fails
 */
export function validatePracticeRequest(body: unknown): PracticeRequest {
  return practiceRequestSchema.parse(body);
}
